export interface Topic {
  id: string;
  subject: 'physics' | 'chemistry' | 'mathematics';
  name: string;
  description: string;
  chapters: Chapter[];
  icon: string;
}

export interface Chapter {
  id: string;
  name: string;
  description: string;
  concepts: Concept[];
  questionCount: number;
  completedCount?: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Concept {
  id: string;
  name: string;
  description: string;
  importance: 'high' | 'medium' | 'low';
  prerequisites: string[];
  relatedConcepts: string[];
}

export const mockTopics: Topic[] = [
  {
    id: 'phy',
    subject: 'physics',
    name: 'Physics',
    description: 'Study of matter, energy, and their interactions',
    icon: '⚛️',
    chapters: [
      {
        id: 'phy_ch1',
        name: 'Kinematics',
        description: 'Study of motion without considering its causes',
        difficulty: 'medium',
        questionCount: 50,
        completedCount: 30,
        concepts: [
          {
            id: 'kin_1',
            name: 'Motion in One Dimension',
            description: 'Understanding displacement, velocity, and acceleration in 1D',
            importance: 'high',
            prerequisites: [],
            relatedConcepts: ['Vectors', 'Graphs of Motion']
          },
          {
            id: 'kin_2',
            name: 'Projectile Motion',
            description: 'Motion under constant gravitational field in 2D',
            importance: 'high',
            prerequisites: ['Motion in One Dimension', 'Vectors'],
            relatedConcepts: ['Gravitational Force', 'Energy Conservation']
          }
        ]
      },
      {
        id: 'phy_ch2',
        name: 'Dynamics',
        description: 'Study of forces and their effects on motion',
        difficulty: 'hard',
        questionCount: 45,
        completedCount: 20,
        concepts: [
          {
            id: 'dyn_1',
            name: 'Newton\'s Laws',
            description: 'Fundamental laws governing motion and forces',
            importance: 'high',
            prerequisites: ['Kinematics'],
            relatedConcepts: ['Friction', 'Circular Motion']
          }
        ]
      }
    ]
  },
  {
    id: 'chem',
    subject: 'chemistry',
    name: 'Chemistry',
    description: 'Study of matter, its properties, and transformations',
    icon: '🧪',
    chapters: [
      {
        id: 'chem_ch1',
        name: 'Chemical Bonding',
        description: 'Understanding how atoms combine to form molecules',
        difficulty: 'medium',
        questionCount: 40,
        completedCount: 25,
        concepts: [
          {
            id: 'bond_1',
            name: 'Ionic Bonding',
            description: 'Transfer of electrons between metals and non-metals',
            importance: 'high',
            prerequisites: ['Atomic Structure'],
            relatedConcepts: ['Electronegativity', 'Crystal Structure']
          },
          {
            id: 'bond_2',
            name: 'Covalent Bonding',
            description: 'Sharing of electrons between non-metals',
            importance: 'high',
            prerequisites: ['Atomic Structure'],
            relatedConcepts: ['Molecular Geometry', 'Hybridization']
          }
        ]
      }
    ]
  },
  {
    id: 'math',
    subject: 'mathematics',
    name: 'Mathematics',
    description: 'Study of numbers, quantities, and shapes',
    icon: '📐',
    chapters: [
      {
        id: 'math_ch1',
        name: 'Complex Numbers',
        description: 'Numbers involving real and imaginary parts',
        difficulty: 'hard',
        questionCount: 35,
        completedCount: 15,
        concepts: [
          {
            id: 'comp_1',
            name: 'Complex Number Operations',
            description: 'Addition, subtraction, multiplication, and division',
            importance: 'high',
            prerequisites: ['Algebra'],
            relatedConcepts: ['Polar Form', 'De Moivre\'s Formula']
          }
        ]
      }
    ]
  }
];
