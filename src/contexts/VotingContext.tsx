 import React, { createContext, useContext, useEffect, ReactNode, useCallback } from 'react';
 import { useAuth, UserRole } from '@/hooks/useAuth';
 import { useElections, Election, Position, Candidate } from '@/hooks/useElections';
 import { useVotingOperations } from '@/hooks/useVoting';
 import { useResults } from '@/hooks/useResults';
 
 interface VotingContextType {
   // Auth
   user: {
     id: string;
     name: string;
     role: UserRole;
     studentId?: string;
   } | null;
   isLoggedIn: boolean;
   isLoading: boolean;
   signIn: (email: string, password: string) => Promise<{ error: any }>;
   signUp: (email: string, password: string, metadata: {
     fullName: string;
     studentId: string;
     gradeLevel: string;
     section: string;
   }) => Promise<{ error: any; data?: any }>;
   signOut: () => Promise<{ error: any }>;
 
   // Election data
   election: Election | null;
   positions: Position[];
   candidates: Candidate[];
   
   // Voting
   votes: Record<string, string>;
   hasVoted: boolean;
   setVote: (positionId: string, candidateId: string) => void;
   submitVotes: () => Promise<boolean>;
   
   // Results
   stats: {
     totalVoters: number;
     totalVoted: number;
     participationRate: number;
   } | null;
   getResults: () => { position: Position; candidates: (Candidate & { votes: number })[] }[];
   
   // Refetch
   refetchData: () => Promise<void>;
 }
 
 const VotingContext = createContext<VotingContextType | undefined>(undefined);
 
 export function VotingProvider({ children }: { children: ReactNode }) {
   const auth = useAuth();
   const elections = useElections();
   const voting = useVotingOperations(auth.user?.id, elections.activeElection?.id);
   const results = useResults(elections.activeElection?.id);
 
   // Check voting status when user and election are available
   useEffect(() => {
     if (auth.user && elections.activeElection) {
       voting.checkVotingStatus();
     }
   }, [auth.user, elections.activeElection]);
 
   const getResults = useCallback(() => {
     return elections.positions.map(position => {
       const positionCandidates = elections.candidates
         .filter(c => c.positionId === position.id)
         .map(candidate => {
           const voteData = results.voteCounts.find(v => v.candidateId === candidate.id);
           return {
             ...candidate,
             votes: voteData?.voteCount ?? 0,
           };
         })
         .sort((a, b) => b.votes - a.votes);
 
       return {
         position,
         candidates: positionCandidates,
       };
     });
   }, [elections.positions, elections.candidates, results.voteCounts]);
 
   const handleSubmitVotes = useCallback(async () => {
     const success = await voting.submitVotes(elections.positions);
     if (success) {
       // Refresh results after voting
       await results.refetch();
     }
     return success;
   }, [voting, elections.positions, results]);
 
   const refetchData = useCallback(async () => {
     await elections.refetch();
     await results.refetch();
     if (auth.user && elections.activeElection) {
       await voting.checkVotingStatus();
     }
   }, [elections, results, auth.user, voting]);
 
   const contextUser = auth.profile && auth.role ? {
     id: auth.user?.id || '',
     name: auth.profile.fullName,
     role: auth.role,
     studentId: auth.profile.studentId || undefined,
   } : null;
 
   return (
     <VotingContext.Provider
       value={{
         user: contextUser,
         isLoggedIn: auth.isAuthenticated,
         isLoading: auth.isLoading || elections.isLoading,
         signIn: auth.signIn,
         signUp: auth.signUp,
         signOut: auth.signOut,
         election: elections.activeElection,
         positions: elections.positions,
         candidates: elections.candidates,
         votes: voting.votes,
         hasVoted: voting.hasVoted,
         setVote: voting.setVote,
         submitVotes: handleSubmitVotes,
         stats: results.stats,
         getResults,
         refetchData,
       }}
     >
       {children}
     </VotingContext.Provider>
   );
 }
 
 export function useVoting() {
   const context = useContext(VotingContext);
   if (context === undefined) {
     throw new Error('useVoting must be used within a VotingProvider');
   }
   return context;
 }
