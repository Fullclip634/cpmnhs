import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Candidate, Position, Voter, Election, User, Vote } from '@/types/voting';

interface VotingContextType {
  user: User | null;
  election: Election | null;
  candidates: Candidate[];
  positions: Position[];
  voters: Voter[];
  votes: Record<string, string>;
  isLoggedIn: boolean;
  hasVoted: boolean;
  login: (studentId: string, password: string) => Promise<boolean>;
  adminLogin: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  setVote: (positionId: string, candidateId: string) => void;
  submitVotes: () => Promise<boolean>;
  getResults: () => { position: Position; candidates: Candidate[] }[];
}

const VotingContext = createContext<VotingContextType | undefined>(undefined);

// Mock data for demonstration
const mockPositions: Position[] = [
  { id: '1', name: 'President', order: 1, maxVotes: 1 },
  { id: '2', name: 'Vice President', order: 2, maxVotes: 1 },
  { id: '3', name: 'Secretary', order: 3, maxVotes: 1 },
  { id: '4', name: 'Treasurer', order: 4, maxVotes: 1 },
  { id: '5', name: 'Auditor', order: 5, maxVotes: 1 },
  { id: '6', name: 'P.R.O.', order: 6, maxVotes: 1 },
];

const mockCandidates: Candidate[] = [
  { id: '1', name: 'Juan Dela Cruz', position: '1', party: 'Unity Party', photo: '', motto: 'Leadership through service', gradeLevel: '12', section: 'STEM-A', votes: 145 },
  { id: '2', name: 'Maria Santos', position: '1', party: 'Progress Party', photo: '', motto: 'Together we rise', gradeLevel: '12', section: 'ABM-B', votes: 132 },
  { id: '3', name: 'Pedro Reyes', position: '2', party: 'Unity Party', photo: '', motto: 'Excellence in action', gradeLevel: '12', section: 'HUMSS-A', votes: 156 },
  { id: '4', name: 'Ana Garcia', position: '2', party: 'Progress Party', photo: '', motto: 'Voice of the students', gradeLevel: '12', section: 'STEM-B', votes: 121 },
  { id: '5', name: 'Carlos Mendoza', position: '3', party: 'Unity Party', photo: '', motto: 'Efficient and organized', gradeLevel: '11', section: 'STEM-A', votes: 167 },
  { id: '6', name: 'Sofia Ramos', position: '3', party: 'Progress Party', photo: '', motto: 'Transparency in records', gradeLevel: '11', section: 'ABM-A', votes: 110 },
  { id: '7', name: 'Miguel Torres', position: '4', party: 'Unity Party', photo: '', motto: 'Responsible finance', gradeLevel: '11', section: 'HUMSS-B', votes: 143 },
  { id: '8', name: 'Isabella Cruz', position: '4', party: 'Progress Party', photo: '', motto: 'Every peso counts', gradeLevel: '11', section: 'STEM-A', votes: 134 },
  { id: '9', name: 'Gabriel Santos', position: '5', party: 'Unity Party', photo: '', motto: 'Accuracy and integrity', gradeLevel: '12', section: 'ABM-A', votes: 151 },
  { id: '10', name: 'Luna Reyes', position: '5', party: 'Progress Party', photo: '', motto: 'Trustworthy auditing', gradeLevel: '12', section: 'STEM-B', votes: 126 },
  { id: '11', name: 'Rafael Garcia', position: '6', party: 'Unity Party', photo: '', motto: 'Connecting students', gradeLevel: '11', section: 'HUMSS-A', votes: 139 },
  { id: '12', name: 'Emma Mendoza', position: '6', party: 'Progress Party', photo: '', motto: 'Your voice matters', gradeLevel: '11', section: 'ABM-B', votes: 138 },
];

const mockElection: Election = {
  id: '1',
  name: 'Supreme Student Government Election 2024-2025',
  schoolYear: '2024-2025',
  startDate: new Date('2024-03-01'),
  endDate: new Date('2024-03-15'),
  isActive: true,
  totalVoters: 500,
  totalVoted: 277,
};

export function VotingProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);

  const login = useCallback(async (studentId: string, password: string): Promise<boolean> => {
    // Mock login - in real app, validate against database
    if (studentId && password) {
      setUser({
        id: studentId,
        role: 'voter',
        name: 'Student Voter',
        studentId: studentId,
      });
      return true;
    }
    return false;
  }, []);

  const adminLogin = useCallback(async (username: string, password: string): Promise<boolean> => {
    // Mock admin login
    if (username === 'admin' && password === 'admin123') {
      setUser({
        id: 'admin-1',
        role: 'admin',
        name: 'System Administrator',
      });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setVotes({});
    setHasVoted(false);
  }, []);

  const setVote = useCallback((positionId: string, candidateId: string) => {
    setVotes(prev => ({
      ...prev,
      [positionId]: candidateId,
    }));
  }, []);

  const submitVotes = useCallback(async (): Promise<boolean> => {
    // In real app, submit to database
    setCandidates(prev => 
      prev.map(candidate => {
        const votedFor = Object.values(votes).includes(candidate.id);
        return votedFor ? { ...candidate, votes: candidate.votes + 1 } : candidate;
      })
    );
    setHasVoted(true);
    return true;
  }, [votes]);

  const getResults = useCallback(() => {
    return mockPositions.map(position => ({
      position,
      candidates: candidates
        .filter(c => c.position === position.id)
        .sort((a, b) => b.votes - a.votes),
    }));
  }, [candidates]);

  return (
    <VotingContext.Provider
      value={{
        user,
        election: mockElection,
        candidates,
        positions: mockPositions,
        voters: [],
        votes,
        isLoggedIn: !!user,
        hasVoted,
        login,
        adminLogin,
        logout,
        setVote,
        submitVotes,
        getResults,
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
