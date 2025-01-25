export interface Problem {
  id: number;
  title: string;
  description: string;
  topic: string;
  options: Array<{
    id: string;
    text: string;
  }>;
  correct_answer: string;
  hints?: string[];
  difficulty: string;
}

export interface UserStats {
  problemsSolved: number;
  accuracyRate: number;
  studyStreak: number;
  timeSpent: string;
  correctSolved: number;
  totalPoints: number;
  lastUpdated: string;
}

export interface Achievement {
  name: string;
  description: string;
  icon: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  solvedCount: number;
  rank: number;
  streak: number;
  badges: Badge[];
  topics: { [key: string]: number };
  recentActivity: Activity[];
  stats: UserStats;
  achievements: Achievement[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface Activity {
  id: string;
  type: 'problem_solved' | 'badge_earned' | 'streak_achieved';
  description: string;
  timestamp: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  solvedCount: number;
  accuracy: number;
  badges: Badge[];
  recentSubmissions: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ProblemStats {
  total_attempts: number;
  correct_attempts: number;
  accuracy: number;
}

export interface UserAnswer {
  answer: string;
  is_correct: boolean;
  timestamp: string;
}

export interface SubmitAnswerResponse {
  success: boolean;
  answer: {
    answer: string;
    is_correct: boolean;
    timestamp: string;
  };
  stats: {
    problemsSolved: number;
    accuracyRate: number;
    studyStreak: number;
    timeSpent: string;
    correctSolved: number;
    totalPoints: number;
    lastUpdated: string;
  };
}

export interface UserSubmission {
  username: string;
  answer?: string;
  review?: string;
  timestamp: string;
  is_correct: boolean;
}