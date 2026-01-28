import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CandidateCard } from '@/components/CandidateCard';
import { Button } from '@/components/ui/button';
import { useVoting } from '@/contexts/VotingContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Vote, CheckCircle, ArrowRight, ArrowLeft, Send } from 'lucide-react';

export default function VotingPage() {
  const { candidates, positions, votes, setVote, submitVotes, hasVoted, isLoggedIn, user } = useVoting();
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if not logged in or not a voter
  if (!isLoggedIn || user?.role !== 'voter') {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="glass-card max-w-md w-full text-center p-8">
            <CardContent className="pt-6">
              <Vote className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-display text-2xl font-bold mb-2">Login Required</h2>
              <p className="text-muted-foreground mb-6">
                Please login as a student to cast your vote.
              </p>
              <Button variant="hero" onClick={() => navigate('/login')}>
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Show thank you page if already voted
  if (hasVoted) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="glass-card max-w-md w-full text-center p-8 animate-scale-in">
            <CardContent className="pt-6">
              <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-success" />
              </div>
              <h2 className="font-display text-3xl font-bold mb-2">Thank You!</h2>
              <p className="text-muted-foreground mb-6">
                Your vote has been successfully recorded. Thank you for participating in the SSG Election!
              </p>
              <div className="flex flex-col gap-3">
                <Button variant="hero" onClick={() => navigate('/results')}>
                  View Results
                </Button>
                <Button variant="outline" onClick={() => navigate('/')}>
                  Return Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const currentPosition = positions[currentPositionIndex];
  const positionCandidates = candidates.filter(c => c.position === currentPosition.id);
  const selectedCandidate = votes[currentPosition.id];
  const allPositionsVoted = positions.every(p => votes[p.id]);

  const handleNext = () => {
    if (currentPositionIndex < positions.length - 1) {
      setCurrentPositionIndex(currentPositionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPositionIndex > 0) {
      setCurrentPositionIndex(currentPositionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const success = await submitVotes();
      if (success) {
        toast({
          title: 'Vote Submitted!',
          description: 'Your vote has been successfully recorded.',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit your vote. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
      setShowConfirmDialog(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Position {currentPositionIndex + 1} of {positions.length}
              </span>
              <span className="text-sm font-medium text-foreground">
                {Object.keys(votes).length} / {positions.length} Selected
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full gradient-primary transition-all duration-300"
                style={{ width: `${((currentPositionIndex + 1) / positions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Position Progress Dots */}
          <div className="flex justify-center gap-2 mb-8">
            {positions.map((position, index) => (
              <button
                key={position.id}
                onClick={() => setCurrentPositionIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentPositionIndex 
                    ? 'gradient-primary scale-125' 
                    : votes[position.id] 
                      ? 'bg-success' 
                      : 'bg-muted'
                }`}
                title={position.name}
              />
            ))}
          </div>

          {/* Current Position */}
          <div className="text-center mb-8 animate-fade-in">
            <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
              Vote for
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              {currentPosition.name}
            </h1>
          </div>

          {/* Candidates */}
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-8">
            {positionCandidates.map((candidate, index) => (
              <div 
                key={candidate.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CandidateCard
                  candidate={candidate}
                  position={currentPosition}
                  isSelected={selectedCandidate === candidate.id}
                  onSelect={() => setVote(currentPosition.id, candidate.id)}
                />
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center max-w-3xl mx-auto">
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrevious}
              disabled={currentPositionIndex === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentPositionIndex === positions.length - 1 ? (
              <Button
                variant="hero"
                size="lg"
                onClick={() => setShowConfirmDialog(true)}
                disabled={!allPositionsVoted}
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Votes
              </Button>
            ) : (
              <Button
                variant="hero"
                size="lg"
                onClick={handleNext}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          {/* Vote Summary */}
          <Card className="mt-8 max-w-3xl mx-auto glass-card">
            <CardHeader>
              <CardTitle className="font-display text-xl">Your Selections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {positions.map((position) => {
                  const selected = candidates.find(c => c.id === votes[position.id]);
                  return (
                    <div 
                      key={position.id}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <span className="text-sm font-medium">{position.name}</span>
                      {selected ? (
                        <span className="text-sm text-primary font-semibold flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          {selected.name}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">Not selected</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-2xl">Confirm Your Votes</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                <p className="mb-4">You are about to submit your votes. This action cannot be undone.</p>
                <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
                  {positions.map((position) => {
                    const selected = candidates.find(c => c.id === votes[position.id]);
                    return (
                      <div key={position.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{position.name}:</span>
                        <span className="font-medium text-foreground">{selected?.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="gradient-primary"
            >
              {isSubmitting ? 'Submitting...' : 'Confirm & Submit'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
}
