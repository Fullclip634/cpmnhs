 import { Header } from '@/components/Header';
 import { Footer } from '@/components/Footer';
 import { CandidateCard } from '@/components/CandidateCard';
 import { useVoting } from '@/contexts/VotingContext';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Progress } from '@/components/ui/progress';
 import { BarChart3, Trophy, Users, Vote, Loader2 } from 'lucide-react';
 
 export default function ResultsPage() {
   const { election, getResults, stats, isLoading } = useVoting();
   const results = getResults();
 
   if (isLoading) {
     return (
       <div className="min-h-screen flex flex-col bg-background">
         <Header />
         <main className="flex-1 flex items-center justify-center">
           <Loader2 className="h-8 w-8 animate-spin text-primary" />
         </main>
         <Footer />
       </div>
     );
   }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">
              <BarChart3 className="h-4 w-4" />
              Live Results
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Election Results
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real-time voting results for the {election?.name}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <Card className="glass-card">
              <CardContent className="pt-6 text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-3xl font-bold text-foreground">{stats?.totalVoters || 0}</p>
                <p className="text-sm text-muted-foreground">Registered Voters</p>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="pt-6 text-center">
                <Vote className="h-8 w-8 text-success mx-auto mb-2" />
                <p className="text-3xl font-bold text-foreground">{stats?.totalVoted || 0}</p>
                <p className="text-sm text-muted-foreground">Votes Cast</p>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="pt-6 text-center">
                <Trophy className="h-8 w-8 text-accent mx-auto mb-2" />
                <p className="text-3xl font-bold text-foreground">
                  {stats?.participationRate || 0}%
                </p>
                <p className="text-sm text-muted-foreground">Voter Turnout</p>
              </CardContent>
            </Card>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No results available yet. Check back after voting begins!</p>
            </div>
          ) : (
            <div className="space-y-12">
              {results.map(({ position, candidates: positionCandidates }, positionIndex) => {
              const positionTotalVotes = positionCandidates.reduce((sum, c) => sum + c.votes, 0);
              const winner = positionCandidates[0];
              
              return (
                <div 
                  key={position.id} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${positionIndex * 100}ms` }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                      <span className="text-xl font-bold text-primary-foreground">{positionIndex + 1}</span>
                    </div>
                    <div>
                      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                        {position.name}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {positionTotalVotes} total votes
                      </p>
                    </div>
                  </div>

                  {/* Bar Chart View */}
                  <Card className="glass-card mb-6">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {positionCandidates.map((candidate, index) => {
                          const percentage = positionTotalVotes > 0 
                            ? Math.round((candidate.votes / positionTotalVotes) * 100) 
                            : 0;
                          const isLeading = index === 0;
                          
                          return (
                            <div key={candidate.id} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  {isLeading && (
                                    <Trophy className="h-5 w-5 text-accent" />
                                  )}
                                  <span className={`font-medium ${isLeading ? 'text-primary' : 'text-foreground'}`}>
                                    {candidate.name}
                                  </span>
                                  <span className="text-sm text-muted-foreground">
                                    ({candidate.party})
                                  </span>
                                </div>
                                <div className="text-right">
                                  <span className="font-bold text-lg">{candidate.votes}</span>
                                  <span className="text-muted-foreground text-sm ml-2">
                                    ({percentage}%)
                                  </span>
                                </div>
                              </div>
                              <div className="h-3 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-1000 ${
                                    isLeading ? 'gradient-primary' : 'bg-secondary-foreground/30'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Candidate Cards */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {positionCandidates.map((candidate, index) => (
                      <CandidateCard
                        key={candidate.id}
                        candidate={candidate}
                        position={position}
                        showVotes
                        rank={index + 1}
                      />
                    ))}
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
