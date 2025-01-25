export interface Problem {
  id: string;
  title: string;
  description: string;
  subject: 'physics' | 'chemistry' | 'mathematics';
  difficulty: 'easy' | 'medium' | 'hard';
  solution: string;
}

export const mockProblems: Problem[] = [
  {
    id: 'phy_001',
    title: 'Projectile Motion',
    description: 'A ball is thrown at an angle. Calculate the maximum height.',
    subject: 'physics',
    difficulty: 'medium',
    solution: 'Use kinematic equations to solve.',
  },
  // Add more mock problems as needed
];
