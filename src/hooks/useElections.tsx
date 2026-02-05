 import { useState, useEffect, useCallback } from 'react';
 import { supabase } from '@/integrations/supabase/client';
 
 export interface Election {
   id: string;
   name: string;
   schoolYear: string;
   startDate: Date;
   endDate: Date;
   isActive: boolean;
 }
 
 export interface Position {
   id: string;
   electionId: string;
   name: string;
   displayOrder: number;
   maxVotes: number;
 }
 
 export interface Candidate {
   id: string;
   positionId: string;
   name: string;
   party: string | null;
   photoUrl: string | null;
   motto: string | null;
   gradeLevel: string | null;
   section: string | null;
   votes?: number;
 }
 
 export function useElections() {
   const [elections, setElections] = useState<Election[]>([]);
   const [activeElection, setActiveElection] = useState<Election | null>(null);
   const [positions, setPositions] = useState<Position[]>([]);
   const [candidates, setCandidates] = useState<Candidate[]>([]);
   const [isLoading, setIsLoading] = useState(true);
 
   const fetchElections = useCallback(async () => {
     const { data, error } = await supabase
       .from('elections')
       .select('*')
       .order('created_at', { ascending: false });
 
     if (error) {
       console.error('Error fetching elections:', error);
       return;
     }
 
     const mapped = data.map(e => ({
       id: e.id,
       name: e.name,
       schoolYear: e.school_year,
       startDate: new Date(e.start_date),
       endDate: new Date(e.end_date),
       isActive: e.is_active,
     }));
 
     setElections(mapped);
     const active = mapped.find(e => e.isActive);
     setActiveElection(active || null);
 
     return mapped;
   }, []);
 
   const fetchPositions = useCallback(async (electionId: string) => {
     const { data, error } = await supabase
       .from('positions')
       .select('*')
       .eq('election_id', electionId)
       .order('display_order', { ascending: true });
 
     if (error) {
       console.error('Error fetching positions:', error);
       return;
     }
 
     const mapped = data.map(p => ({
       id: p.id,
       electionId: p.election_id,
       name: p.name,
       displayOrder: p.display_order,
       maxVotes: p.max_votes,
     }));
 
     setPositions(mapped);
     return mapped;
   }, []);
 
   const fetchCandidates = useCallback(async (positionIds: string[]) => {
     if (positionIds.length === 0) {
       setCandidates([]);
       return;
     }
 
     const { data, error } = await supabase
       .from('candidates')
       .select('*')
       .in('position_id', positionIds);
 
     if (error) {
       console.error('Error fetching candidates:', error);
       return;
     }
 
     const mapped = data.map(c => ({
       id: c.id,
       positionId: c.position_id,
       name: c.name,
       party: c.party,
       photoUrl: c.photo_url,
       motto: c.motto,
       gradeLevel: c.grade_level,
       section: c.section,
     }));
 
     setCandidates(mapped);
     return mapped;
   }, []);
 
   const fetchVoteCounts = useCallback(async () => {
     const { data, error } = await supabase
       .from('vote_counts')
       .select('*');
 
     if (error) {
       console.error('Error fetching vote counts:', error);
       return;
     }
 
     return data;
   }, []);
 
   useEffect(() => {
     const loadData = async () => {
       setIsLoading(true);
       const electionList = await fetchElections();
       
       if (electionList && electionList.length > 0) {
         const active = electionList.find(e => e.isActive) || electionList[0];
         const positionList = await fetchPositions(active.id);
         
         if (positionList && positionList.length > 0) {
           await fetchCandidates(positionList.map(p => p.id));
         }
       }
       
       setIsLoading(false);
     };
 
     loadData();
   }, [fetchElections, fetchPositions, fetchCandidates]);
 
   return {
     elections,
     activeElection,
     positions,
     candidates,
     isLoading,
     fetchElections,
     fetchPositions,
     fetchCandidates,
     fetchVoteCounts,
     refetch: async () => {
       const electionList = await fetchElections();
       if (electionList && electionList.length > 0) {
         const active = electionList.find(e => e.isActive) || electionList[0];
         const positionList = await fetchPositions(active.id);
         if (positionList && positionList.length > 0) {
           await fetchCandidates(positionList.map(p => p.id));
         }
       }
     },
   };
 }