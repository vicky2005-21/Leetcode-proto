export interface Contest {
  id: string;
  name: string;
  date: string;
  duration: string;
  status: 'upcoming' | 'ongoing' | 'past';
  registeredUsers: number;
  yourRank?: number;
  totalParticipants?: number;
  score?: number;
  maxScore?: number;
  questions?: {
    id: string;
    title: string;
    subject: 'physics' | 'chemistry' | 'mathematics';
    difficulty: 'easy' | 'medium' | 'hard';
    marks: number;
    yourAnswer?: string;
    status?: 'correct' | 'incorrect' | 'unattempted';
  }[];
}

export const mockContests: Contest[] = [
  {
    id: 'jee-mock-1',
    name: 'JEE Mains Mock Test #1',
    date: '2025-02-01T09:00:00',
    duration: '3 hours',
    status: 'upcoming',
    registeredUsers: 1500,
  },
  {
    id: 'jee-mock-2',
    name: 'JEE Mains Practice Contest',
    date: '2025-01-15T09:00:00',
    duration: '3 hours',
    status: 'past',
    registeredUsers: 2000,
    yourRank: 156,
    totalParticipants: 1890,
    score: 185,
    maxScore: 300,
    questions: [
      {
        id: 'q1',
        title: 'Kinematics in 2D',
        subject: 'physics',
        difficulty: 'medium',
        marks: 4,
        status: 'correct',
        yourAnswer: 'Option B'
      },
      {
        id: 'q2',
        title: 'Organic Chemistry: Alcohols',
        subject: 'chemistry',
        difficulty: 'hard',
        marks: 4,
        status: 'incorrect',
        yourAnswer: 'Option A'
      },
      {
        id: 'q3',
        title: 'Complex Numbers',
        subject: 'mathematics',
        difficulty: 'medium',
        marks: 4,
        status: 'correct',
        yourAnswer: 'Option D'
      }
    ]
  }
];
