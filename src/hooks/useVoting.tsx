 import { useState, useCallback } from 'react';
 import { supabase } from '@/integrations/supabase/client';
 import { useToast } from '@/hooks/use-toast';
 
 export function useVotingOperations(userId: string | undefined, electionId: string | undefined) {
   const [votes, setVotes] = useState<Record<string, string>>({});
   const [hasVoted, setHasVoted] = useState(false);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [isCheckingStatus, setIsCheckingStatus] = useState(true);
   const { toast } = useToast();
 
   const checkVotingStatus = useCallback(async () => {
     if (!userId || !electionId) {
       setIsCheckingStatus(false);
       return;
     }
 
     setIsCheckingStatus(true);
     
     const { data, error } = await supabase
       .from('voter_status')
       .select('has_voted')
       .eq('user_id', userId)
       .eq('election_id', electionId)
       .maybeSingle();
 
     if (error) {
       console.error('Error checking voting status:', error);
     }
 
     setHasVoted(data?.has_voted ?? false);
     setIsCheckingStatus(false);
   }, [userId, electionId]);
 
   const setVote = useCallback((positionId: string, candidateId: string) => {
     setVotes(prev => ({
       ...prev,
       [positionId]: candidateId,
     }));
   }, []);
 
   const submitVotes = useCallback(async (positions: { id: string }[]) => {
     if (!userId || !electionId) {
       toast({
         title: 'Error',
         description: 'You must be logged in to vote.',
         variant: 'destructive',
       });
       return false;
     }
 
     // Check if all positions have been voted for
     const allVoted = positions.every(p => votes[p.id]);
     if (!allVoted) {
       toast({
         title: 'Incomplete Ballot',
         description: 'Please vote for all positions before submitting.',
         variant: 'destructive',
       });
       return false;
     }
 
     setIsSubmitting(true);
 
     try {
       // Insert all votes
       const votesToInsert = Object.entries(votes).map(([positionId, candidateId]) => ({
         voter_id: userId,
         candidate_id: candidateId,
         position_id: positionId,
         election_id: electionId,
       }));
 
       const { error: votesError } = await supabase
         .from('votes')
         .insert(votesToInsert);
 
       if (votesError) {
         throw votesError;
       }
 
       // Update voter status
       const { error: statusError } = await supabase
         .from('voter_status')
         .upsert({
           user_id: userId,
           election_id: electionId,
           has_voted: true,
           voted_at: new Date().toISOString(),
         });
 
       if (statusError) {
         throw statusError;
       }
 
       setHasVoted(true);
       toast({
         title: 'Vote Submitted!',
         description: 'Your vote has been successfully recorded. Thank you for participating!',
       });
 
       return true;
     } catch (error: any) {
       console.error('Error submitting votes:', error);
       toast({
         title: 'Error',
         description: error.message || 'Failed to submit your vote. Please try again.',
         variant: 'destructive',
       });
       return false;
     } finally {
       setIsSubmitting(false);
     }
   }, [userId, electionId, votes, toast]);
 
   return {
     votes,
     hasVoted,
     isSubmitting,
     isCheckingStatus,
     setVote,
     submitVotes,
     checkVotingStatus,
   };
 }