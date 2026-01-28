export interface Candidate {
  id: string;
  name: string;
  position: string;
  party: string;
  photo: string;
  motto: string;
  gradeLevel: string;
  section: string;
  votes: number;
}

export interface Position {
  id: string;
  name: string;
  order: number;
  maxVotes: number;
}

export interface Voter {
  id: string;
  studentId: string;
  name: string;
  gradeLevel: string;
  section: string;
  hasVoted: boolean;
  votedAt?: Date;
}

export interface Election {
  id: string;
  name: string;
  schoolYear: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  totalVoters: number;
  totalVoted: number;
}

export interface Vote {
  id: string;
  voterId: string;
  candidateId: string;
  positionId: string;
  timestamp: Date;
}

export interface User {
  id: string;
  role: 'admin' | 'voter';
  name: string;
  studentId?: string;
}
