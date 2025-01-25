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
}

export const mockProfiles: { [key: string]: UserProfile } = {
  'user1': {
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
    ]
  }
};
