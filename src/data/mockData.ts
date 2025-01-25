import { Problem, User, LeaderboardEntry, Badge, Activity } from '../types';
import { BookOpen, Zap, Award, Target, Brain, Lightbulb, Code } from 'lucide-react';

export const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'Problem Solver',
    description: 'Solved 100 problems',
    icon: 'Trophy',
    earnedAt: '2024-03-10'
  },
  {
    id: '2',
    name: 'Physics Master',
    description: 'Completed all Physics problems',
    icon: 'Atom',
    earnedAt: '2024-03-08'
  },
  {
    id: '3',
    name: 'Streak Master',
    description: 'Maintained a 7-day streak',
    icon: 'Zap',
    earnedAt: '2024-03-05'
  },
  {
    id: '4',
    name: 'Chemistry Wizard',
    description: 'Solved 50 chemistry problems',
    icon: 'Flask',
    earnedAt: '2024-03-12'
  },
  {
    id: '5',
    name: 'Math Prodigy',
    description: 'Achieved 95% accuracy in Mathematics',
    icon: 'Calculator',
    earnedAt: '2024-03-15'
  },
  {
    id: '6',
    name: 'Early Bird',
    description: 'Completed 10 problems before 8 AM',
    icon: 'Sun',
    earnedAt: '2024-03-18'
  },
  {
    id: '7',
    name: 'Night Owl',
    description: 'Solved problems for 3 hours after midnight',
    icon: 'Moon',
    earnedAt: '2024-03-20'
  },
  {
    id: '8',
    name: 'Speed Demon',
    description: 'Solved 5 problems in under 30 minutes',
    icon: 'Timer',
    earnedAt: '2024-03-22'
  }
];

export const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'problem_solved',
    description: 'Solved "Kinematics: Projectile Motion"',
    timestamp: '2024-03-10T14:30:00Z'
  },
  {
    id: '2',
    type: 'badge_earned',
    description: 'Earned "Physics Master" badge',
    timestamp: '2024-03-08T09:15:00Z'
  },
  {
    id: '3',
    type: 'streak_achieved',
    description: 'Achieved 7-day streak!',
    timestamp: '2024-03-05T18:45:00Z'
  },
  {
    id: '4',
    type: 'problem_solved',
    description: 'Solved "Chemical Equilibrium"',
    timestamp: '2024-03-12T10:20:00Z'
  },
  {
    id: '5',
    type: 'badge_earned',
    description: 'Earned "Chemistry Wizard" badge',
    timestamp: '2024-03-12T10:25:00Z'
  }
];

export const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  solvedCount: 145,
  rank: 234,
  streak: 7,
  badges: mockBadges,
  topics: {
    'Physics': 75,
    'Chemistry': 60,
    'Mathematics': 85,
    'Mechanics': 80,
    'Thermodynamics': 65,
    'Organic Chemistry': 55,
    'Calculus': 90
  },
  recentActivity: mockActivities
};

export const mockProblems: Problem[] = [
  {
    id: '1',
    title: 'Kinematics: Projectile Motion',
    description: `A ball is thrown from the ground at an initial velocity of 20 m/s at an angle of 45° with the horizontal. Neglecting air resistance:

1. Calculate the maximum height reached by the ball
2. Calculate the total time of flight
3. Calculate the horizontal distance traveled

Use g = 9.8 m/s²

Sample Solution Approach:
1. Use v₀y = v₀sin(θ) for initial vertical velocity
2. Use h = v₀y²/2g for maximum height
3. Use t = 2v₀y/g for total time
4. Use R = v₀²sin(2θ)/g for range`,
    difficulty: 'Medium',
    topics: ['Physics', 'Mechanics'],
    solved: true,
    accuracy: 68,
    sampleInput: 'v₀ = 20 m/s, θ = 45°, g = 9.8 m/s²',
    sampleOutput: 'Maximum height = 10.2 m\nTime of flight = 2.89 s\nRange = 40.8 m',
    hints: [
      'Break the initial velocity into components',
      'Use equations of motion for constant acceleration',
      'Consider symmetry of the trajectory'
    ],
    timeLimit: 20,
    points: 100
  },
  {
    id: '2',
    title: 'Organic Chemistry: Alkenes',
    description: 'Predict the major product of the following reaction:\nCH₃-CH=CH₂ + HBr → ?\n\nExplain the mechanism and justify your answer based on Markovnikov\'s rule.',
    difficulty: 'Hard',
    topics: ['Chemistry', 'Organic Chemistry'],
    solved: false,
    accuracy: 45,
    hints: [
      'Consider Markovnikov\'s rule',
      'Think about carbocation stability',
      'Look at the electron density distribution'
    ],
    timeLimit: 15,
    points: 150
  },
  {
    id: '3',
    title: 'Calculus: Integration',
    description: 'Evaluate the following definite integral:\n\n∫₀²(x² + 2x + 1)dx',
    difficulty: 'Medium',
    topics: ['Mathematics', 'Calculus'],
    solved: false,
    accuracy: 55,
    sampleInput: '∫₀²(x² + 2x + 1)dx',
    sampleOutput: '14/3',
    hints: [
      'Break down the polynomial',
      'Integrate term by term',
      'Don\'t forget to evaluate at the limits'
    ],
    timeLimit: 10,
    points: 100
  },
  {
    id: '4',
    title: 'Thermodynamics: Heat Engine',
    description: 'A heat engine operates between two reservoirs at temperatures 400K and 300K. If the engine absorbs 1000J of heat from the hot reservoir per cycle, calculate:\n\n1. The maximum possible efficiency\n2. The maximum work output per cycle\n3. The minimum heat rejected to the cold reservoir per cycle',
    difficulty: 'Hard',
    topics: ['Physics', 'Thermodynamics'],
    solved: false,
    accuracy: 40,
    sampleInput: 'T_hot = 400K, T_cold = 300K, Q_in = 1000J',
    sampleOutput: 'Efficiency = 25%\nMax work = 250J\nMin heat rejected = 750J',
    hints: [
      'Use Carnot efficiency formula',
      'Remember the first law of thermodynamics',
      'Consider energy conservation'
    ],
    timeLimit: 25,
    points: 150
  },
  {
    id: '5',
    title: 'Chemical Equilibrium',
    description: 'For the reaction N₂(g) + 3H₂(g) ⇌ 2NH₃(g), the equilibrium constant Kc = 4.0 at 300K. If the initial concentrations are [N₂]₀ = 2.0M, [H₂]₀ = 2.0M, and [NH₃]₀ = 0M, calculate:\n\n1. The equilibrium concentrations of all species\n2. The reaction quotient Q at t=0\n3. The direction of the reaction',
    difficulty: 'Hard',
    topics: ['Chemistry', 'Chemical Equilibrium'],
    solved: true,
    accuracy: 35,
    hints: [
      'Set up ICE table',
      'Use the equilibrium constant expression',
      'Compare Q and K to determine direction'
    ],
    timeLimit: 30,
    points: 200
  },
  {
    id: '6',
    title: 'Vectors: 3D Motion',
    description: 'A particle moves in 3D space with velocity v = (2t)i + (3t²)j + (4)k m/s. Find:\n\n1. The position vector at t=2s if initial position is origin\n2. The acceleration vector\n3. The speed at t=2s',
    difficulty: 'Medium',
    topics: ['Physics', 'Mechanics', 'Vectors'],
    solved: false,
    accuracy: 60,
    sampleInput: 'v = (2t)i + (3t²)j + (4)k, t = 2s, r₀ = 0',
    sampleOutput: 'r = 4i + 4j + 8k\na = 2i + 6tj\nspeed = √(16 + 144 + 16)',
    hints: [
      'Integrate velocity for position',
      'Differentiate velocity for acceleration',
      'Use Pythagorean theorem for speed'
    ],
    timeLimit: 20,
    points: 120
  }
];

export const mockTopics = [
  {
    id: '1',
    name: 'Physics',
    description: 'Study of matter, energy, and their interactions',
    icon: 'Atom',
    subtopics: [
      {
        id: '1.1',
        name: 'Mechanics',
        description: 'Motion, forces, and energy',
        questionCount: 25,
        completedCount: 12
      },
      {
        id: '1.2',
        name: 'Thermodynamics',
        description: 'Heat, energy, and systems',
        questionCount: 20,
        completedCount: 8
      },
      {
        id: '1.3',
        name: 'Electrostatics',
        description: 'Electric charges and fields',
        questionCount: 15,
        completedCount: 5
      }
    ],
    totalQuestions: 60,
    completedQuestions: 25,
    averageAccuracy: 75
  },
  {
    id: '2',
    name: 'Chemistry',
    description: 'Study of matter, its properties, and transformations',
    icon: 'Flask',
    subtopics: [
      {
        id: '2.1',
        name: 'Organic Chemistry',
        description: 'Study of carbon compounds',
        questionCount: 30,
        completedCount: 15
      },
      {
        id: '2.2',
        name: 'Chemical Equilibrium',
        description: 'Balance in chemical reactions',
        questionCount: 20,
        completedCount: 10
      },
      {
        id: '2.3',
        name: 'Acid-Base',
        description: 'Properties and reactions of acids and bases',
        questionCount: 15,
        completedCount: 7
      }
    ],
    totalQuestions: 65,
    completedQuestions: 32,
    averageAccuracy: 68
  },
  {
    id: '3',
    name: 'Mathematics',
    description: 'Study of numbers, quantities, and shapes',
    icon: 'Calculator',
    subtopics: [
      {
        id: '3.1',
        name: 'Calculus',
        description: 'Study of continuous change',
        questionCount: 25,
        completedCount: 18
      },
      {
        id: '3.2',
        name: 'Complex Numbers',
        description: 'Numbers with real and imaginary parts',
        questionCount: 15,
        completedCount: 8
      },
      {
        id: '3.3',
        name: 'Vectors',
        description: 'Quantities with magnitude and direction',
        questionCount: 20,
        completedCount: 12
      }
    ],
    totalQuestions: 60,
    completedQuestions: 38,
    averageAccuracy: 82
  }
];

export const mockTopicQuestions = {
  'Physics': {
    'Mechanics': [mockProblems[0], mockProblems[5]],
    'Thermodynamics': [mockProblems[3]],
    'Electrostatics': []
  },
  'Chemistry': {
    'Organic Chemistry': [mockProblems[1]],
    'Chemical Equilibrium': [mockProblems[4]],
    'Acid-Base': []
  },
  'Mathematics': {
    'Calculus': [mockProblems[2]],
    'Complex Numbers': [],
    'Vectors': []
  }
};

export const mockTopicProgress = {
  'Physics': {
    completedProblems: 15,
    totalProblems: 25,
    accuracy: 78,
    lastAttempted: '2024-03-20T15:30:00Z',
    strongAreas: ['Mechanics', 'Kinematics'],
    weakAreas: ['Thermodynamics', 'Waves']
  },
  'Chemistry': {
    completedProblems: 12,
    totalProblems: 20,
    accuracy: 65,
    lastAttempted: '2024-03-19T14:20:00Z',
    strongAreas: ['Organic Chemistry'],
    weakAreas: ['Chemical Equilibrium', 'Electrochemistry']
  },
  'Mathematics': {
    completedProblems: 18,
    totalProblems: 22,
    accuracy: 82,
    lastAttempted: '2024-03-21T10:45:00Z',
    strongAreas: ['Calculus', 'Algebra'],
    weakAreas: ['Complex Numbers']
  }
};

export const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    name: 'Rahul Kumar',
    solvedCount: 450,
    accuracy: 92,
    badges: mockBadges.slice(0, 3),
    recentSubmissions: 23
  },
  {
    rank: 2,
    name: 'Priya Singh',
    solvedCount: 445,
    accuracy: 89,
    badges: mockBadges.slice(1, 4),
    recentSubmissions: 19
  },
  {
    rank: 3,
    name: 'Amit Patel',
    solvedCount: 442,
    accuracy: 87,
    badges: mockBadges.slice(0, 2),
    recentSubmissions: 15
  },
  {
    rank: 4,
    name: 'Sarah Khan',
    solvedCount: 438,
    accuracy: 85,
    badges: mockBadges.slice(2, 4),
    recentSubmissions: 12
  },
  {
    rank: 5,
    name: 'Raj Sharma',
    solvedCount: 435,
    accuracy: 84,
    badges: mockBadges.slice(1, 3),
    recentSubmissions: 10
  },
  {
    rank: 6,
    name: 'Neha Gupta',
    solvedCount: 430,
    accuracy: 83,
    badges: mockBadges.slice(0, 2),
    recentSubmissions: 8
  },
  {
    rank: 7,
    name: 'Arjun Reddy',
    solvedCount: 425,
    accuracy: 82,
    badges: mockBadges.slice(2, 4),
    recentSubmissions: 7
  },
  {
    rank: 8,
    name: 'Zara Ali',
    solvedCount: 420,
    accuracy: 81,
    badges: mockBadges.slice(1, 3),
    recentSubmissions: 6
  },
  {
    rank: 9,
    name: 'Vikram Singh',
    solvedCount: 415,
    accuracy: 80,
    badges: mockBadges.slice(0, 2),
    recentSubmissions: 5
  },
  {
    rank: 10,
    name: 'Maya Patel',
    solvedCount: 410,
    accuracy: 79,
    badges: mockBadges.slice(2, 4),
    recentSubmissions: 4
  }
];

export const features = [
  {
    icon: Target,
    title: 'Targeted Practice',
    description: 'Focus on your weak areas with our intelligent problem recommendation system'
  },
  {
    icon: Brain,
    title: 'Conceptual Learning',
    description: 'Detailed explanations and step-by-step solutions for deep understanding'
  },
  {
    icon: Lightbulb,
    title: 'Smart Analytics',
    description: 'Track your progress and identify improvement areas with advanced analytics'
  },
  {
    icon: Code,
    title: 'Real-time Feedback',
    description: 'Get instant feedback on your solutions with detailed explanations'
  },
  {
    icon: Zap,
    title: 'Daily Challenges',
    description: 'Stay motivated with daily problems and maintain your streak'
  },
  {
    icon: Award,
    title: 'Competitive Edge',
    description: 'Compare your performance with peers and climb the leaderboard'
  }
];