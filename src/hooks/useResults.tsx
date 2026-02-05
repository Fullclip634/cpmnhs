 import { useState, useEffect, useCallback } from 'react';
 import { supabase } from '@/integrations/supabase/client';
 
 interface VoteCount {
   candidateId: string;
   candidateName: string;
   positionId: string;
   positionName: string;
   electionId: string;
   voteCount: number;
 }
 
 interface ElectionStats {
   totalVoters: number;
   totalVoted: number;
   participationRate: number;
 }
 
 export function useResults(electionId: string | undefined) {
   const [voteCounts, setVoteCounts] = useState<VoteCount[]>([]);
   const [stats, setStats] = useState<ElectionStats | null>(null);
   const [isLoading, setIsLoading] = useState(true);
 
   const fetchResults = useCallback(async () => {
     if (!electionId) {
       setIsLoading(false);
       return;
     }
 
     setIsLoading(true);
 
     try {
       // Fetch vote counts
       const { data: countsData, error: countsError } = await supabase
         .from('vote_counts')
         .select('*')
         .eq('election_id', electionId);
 
       if (countsError) {
         console.error('Error fetching vote counts:', countsError);
       } else if (countsData) {
         setVoteCounts(countsData.map(c => ({
           candidateId: c.candidate_id,
           candidateName: c.candidate_name,
           positionId: c.position_id,
           positionName: c.position_name,
           electionId: c.election_id,
           voteCount: Number(c.vote_count) || 0,
         })));
       }
 
       // Fetch election stats
       const { data: statsData, error: statsError } = await supabase
         .rpc('get_election_stats', { election_uuid: electionId });
 
       if (statsError) {
         console.error('Error fetching stats:', statsError);
       } else if (statsData && statsData.length > 0) {
         setStats({
           totalVoters: Number(statsData[0].total_voters) || 0,
           totalVoted: Number(statsData[0].total_voted) || 0,
           participationRate: Number(statsData[0].participation_rate) || 0,
         });
       }
     } catch (error) {
       console.error('Error in fetchResults:', error);
     } finally {
       setIsLoading(false);
     }
   }, [electionId]);
 
   useEffect(() => {
     fetchResults();
   }, [fetchResults]);
 
   return {
     voteCounts,
     stats,
     isLoading,
     refetch: fetchResults,
   };
 }