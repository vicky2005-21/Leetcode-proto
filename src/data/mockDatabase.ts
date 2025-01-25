export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinedDate: string;
  rank: number;
  totalUsers: number;
  stats: {
    problemsSolved: number;
    totalAttempts: number;
    successRate: number;
    currentStreak: number;
    longestStreak: number;
    totalScore: number;
  };
  recentActivity: {
    date: string;
    type: 'solved' | 'attempted' | 'contest';
    problemId: string;
    problemName: string;
    result?: 'correct' | 'incorrect';
    score?: number;
  }[];
  subjectPerformance: {
    subject: string;
    solved: number;
    total: number;
    accuracy: number;
  }[];
  badges: {
    id: string;
    name: string;
    description: string;
    icon: string;
    dateEarned: string;
  }[];
  contests: {
    id: string;
    name: string;
    date: string;
    rank: number;
    totalParticipants: number;
    score: number;
    maxScore: number;
  }[];
}

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

export const mockDatabase = {
  currentUser: {
    id: 'user1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    joinedDate: '2024-01-01',
    rank: 156,
    totalUsers: 10000,
    stats: {
      problemsSolved: 247,
      totalAttempts: 312,
      successRate: 79.2,
      currentStreak: 5,
      longestStreak: 15,
      totalScore: 1850
    },
    recentActivity: [
      {
        date: '2025-01-22T14:30:00',
        type: 'contest',
        problemId: 'contest2',
        problemName: 'JEE Mains Practice Contest',
        score: 185
      },
      {
        date: '2025-01-21T10:15:00',
        type: 'solved',
        problemId: 'prob123',
        problemName: 'Complex Numbers',
        result: 'correct'
      },
      {
        date: '2025-01-20T16:45:00',
        type: 'attempted',
        problemId: 'prob124',
        problemName: 'Chemical Equilibrium',
        result: 'incorrect'
      }
    ],
    subjectPerformance: [
      {
        subject: 'Physics',
        solved: 85,
        total: 100,
        accuracy: 85
      },
      {
        subject: 'Chemistry',
        solved: 75,
        total: 100,
        accuracy: 75
      },
      {
        subject: 'Mathematics',
        solved: 87,
        total: 100,
        accuracy: 87
      }
    ],
    badges: [
      {
        id: 'badge1',
        name: 'Problem Solver',
        description: 'Solved 100+ problems',
        icon: '🏆',
        dateEarned: '2024-12-15'
      },
      {
        id: 'badge2',
        name: 'Math Wizard',
        description: '90%+ accuracy in Mathematics',
        icon: '🧙‍♂️',
        dateEarned: '2024-12-20'
      },
      {
        id: 'badge3',
        name: 'Streak Master',
        description: 'Maintained a 10-day streak',
        icon: '🔥',
        dateEarned: '2025-01-10'
      }
    ],
    contests: [
      {
        id: 'contest1',
        name: 'JEE Advanced Mock Test',
        date: '2024-12-15',
        rank: 123,
        totalParticipants: 1500,
        score: 195,
        maxScore: 300
      },
      {
        id: 'contest2',
        name: 'JEE Mains Practice Contest',
        date: '2025-01-15',
        rank: 156,
        totalParticipants: 1890,
        score: 185,
        maxScore: 300
      }
    ]
  },
  contests: [
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
  ]
};
