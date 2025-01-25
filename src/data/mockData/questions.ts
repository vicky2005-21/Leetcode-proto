export interface Question {
  id: string;
  title: string;
  description: string;
  subject: 'physics' | 'chemistry' | 'mathematics';
  chapter: string;
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
  timeLimit: number; // in minutes
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation?: string;
  }[];
  explanation: string;
  tags: string[];
  relatedTopics: string[];
  statistics: {
    totalAttempts: number;
    correctAttempts: number;
    averageTime: number; // in minutes
  };
}

export const mockQuestions: Question[] = [
  {
    id: 'phy_001',
    title: 'Projectile Motion Maximum Height',
    description: 'A ball is thrown with an initial velocity of 20 m/s at an angle of 60° to the horizontal. Calculate the maximum height reached by the ball. (Take g = 9.8 m/s²)',
    subject: 'physics',
    chapter: 'Kinematics',
    difficulty: 'medium',
    marks: 4,
    timeLimit: 5,
    options: [
      {
        id: 'a',
        text: '15.3 m',
        isCorrect: false,
        explanation: 'This answer uses incorrect formula application'
      },
      {
        id: 'b',
        text: '17.7 m',
        isCorrect: true,
        explanation: 'Using h_max = (v₀sinθ)²/2g = (20sin60°)²/(2×9.8) = 17.7 m'
      },
      {
        id: 'c',
        text: '20.1 m',
        isCorrect: false,
        explanation: 'This answer doesn\'t account for the angle properly'
      },
      {
        id: 'd',
        text: '22.5 m',
        isCorrect: false,
        explanation: 'This answer uses the total distance formula instead'
      }
    ],
    explanation: 'The maximum height in projectile motion can be calculated using the formula h_max = (v₀sinθ)²/2g. Here, v₀ = 20 m/s, θ = 60°, and g = 9.8 m/s². Plugging these values gives us 17.7 m.',
    tags: ['projectile motion', 'kinematics', 'maximum height', '2D motion'],
    relatedTopics: ['Vertical Motion', 'Gravitational Force', 'Energy Conservation'],
    statistics: {
      totalAttempts: 1200,
      correctAttempts: 720,
      averageTime: 4.2
    }
  },
  {
    id: 'chem_001',
    title: 'Hybridization in Organic Compounds',
    description: 'What is the hybridization of carbon atoms in ethyne (C₂H₂)?',
    subject: 'chemistry',
    chapter: 'Chemical Bonding',
    difficulty: 'medium',
    marks: 4,
    timeLimit: 3,
    options: [
      {
        id: 'a',
        text: 'sp³',
        isCorrect: false,
        explanation: 'sp³ hybridization involves four sigma bonds, like in methane'
      },
      {
        id: 'b',
        text: 'sp²',
        isCorrect: false,
        explanation: 'sp² hybridization involves three sigma bonds, like in ethene'
      },
      {
        id: 'c',
        text: 'sp',
        isCorrect: true,
        explanation: 'In ethyne, each carbon forms two sigma bonds and one triple bond, requiring sp hybridization'
      },
      {
        id: 'd',
        text: 'No hybridization',
        isCorrect: false,
        explanation: 'Carbon always undergoes hybridization in organic compounds'
      }
    ],
    explanation: 'In ethyne (C₂H₂), each carbon atom forms two sigma bonds (one C-H and one C-C) and one triple bond. This requires sp hybridization, where one s orbital and one p orbital hybridize to form two sp hybrid orbitals, leaving two unhybridized p orbitals for pi bonding.',
    tags: ['hybridization', 'organic chemistry', 'bonding', 'alkyne'],
    relatedTopics: ['Molecular Orbital Theory', 'Chemical Bonding', 'Organic Chemistry'],
    statistics: {
      totalAttempts: 950,
      correctAttempts: 570,
      averageTime: 2.8
    }
  },
  {
    id: 'math_001',
    title: 'Complex Number Properties',
    description: 'If z = 1 + i, what is the value of z⁴?',
    subject: 'mathematics',
    chapter: 'Complex Numbers',
    difficulty: 'hard',
    marks: 4,
    timeLimit: 6,
    options: [
      {
        id: 'a',
        text: '4',
        isCorrect: true,
        explanation: '(1+i)⁴ = (1+2i+i²)² = (2i)² = 4'
      },
      {
        id: 'b',
        text: '4i',
        isCorrect: false,
        explanation: 'This would be the result if we missed a step in the calculation'
      },
      {
        id: 'c',
        text: '-4',
        isCorrect: false,
        explanation: 'This would be the result if we made a sign error'
      },
      {
        id: 'd',
        text: '2 + 2i',
        isCorrect: false,
        explanation: 'This would be the result of z² not z⁴'
      }
    ],
    explanation: 'To find z⁴ where z = 1 + i:\n1. First find z² = (1+i)² = 1 + 2i + i² = 2i (since i² = -1)\n2. Then find (z²)² = (2i)² = 4(i²) = 4(-1) = 4',
    tags: ['complex numbers', 'algebra', 'powers', 'imaginary numbers'],
    relatedTopics: ['Polar Form', 'De Moivre\'s Formula', 'Complex Roots'],
    statistics: {
      totalAttempts: 800,
      correctAttempts: 360,
      averageTime: 5.5
    }
  }
];
