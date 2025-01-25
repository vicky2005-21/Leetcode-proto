export interface RecommendedQuestion {
  questionId: string;
  recommendationReason: 'next_in_sequence' | 'similar_topic' | 'practice_needed' | 'difficulty_progression';
  priority: number; // 1 to 10, higher means more recommended
  prerequisitesMet: boolean;
  estimatedDifficulty: number; // 1 to 10
  relevanceScore: number; // 1 to 10
  userStats?: {
    attemptedSimilar: number;
    successRateInTopic: number;
    timeSpentOnSimilar: number; // average minutes
  };
}

export interface QuestionSequence {
  currentQuestionId: string;
  nextQuestions: RecommendedQuestion[];
  previousQuestions: string[];
  relatedQuestions: string[];
}

export const mockRecommendations: { [key: string]: QuestionSequence } = {
  'phy_001': {
    currentQuestionId: 'phy_001',
    nextQuestions: [
      {
        questionId: 'phy_002',
        recommendationReason: 'next_in_sequence',
        priority: 10,
        prerequisitesMet: true,
        estimatedDifficulty: 6,
        relevanceScore: 9,
        userStats: {
          attemptedSimilar: 5,
          successRateInTopic: 0.8,
          timeSpentOnSimilar: 4.5
        }
      },
      {
        questionId: 'phy_003',
        recommendationReason: 'similar_topic',
        priority: 8,
        prerequisitesMet: true,
        estimatedDifficulty: 5,
        relevanceScore: 8,
        userStats: {
          attemptedSimilar: 3,
          successRateInTopic: 0.7,
          timeSpentOnSimilar: 5.2
        }
      },
      {
        questionId: 'phy_004',
        recommendationReason: 'practice_needed',
        priority: 7,
        prerequisitesMet: true,
        estimatedDifficulty: 4,
        relevanceScore: 7,
        userStats: {
          attemptedSimilar: 2,
          successRateInTopic: 0.6,
          timeSpentOnSimilar: 6.0
        }
      }
    ],
    previousQuestions: ['phy_intro_2', 'phy_intro_1'],
    relatedQuestions: ['phy_005', 'phy_006', 'phy_007']
  },
  'chem_001': {
    currentQuestionId: 'chem_001',
    nextQuestions: [
      {
        questionId: 'chem_002',
        recommendationReason: 'next_in_sequence',
        priority: 9,
        prerequisitesMet: true,
        estimatedDifficulty: 7,
        relevanceScore: 8,
        userStats: {
          attemptedSimilar: 4,
          successRateInTopic: 0.75,
          timeSpentOnSimilar: 5.0
        }
      }
    ],
    previousQuestions: ['chem_intro_2', 'chem_intro_1'],
    relatedQuestions: ['chem_003', 'chem_004']
  },
  'math_001': {
    currentQuestionId: 'math_001',
    nextQuestions: [
      {
        questionId: 'math_002',
        recommendationReason: 'next_in_sequence',
        priority: 9,
        prerequisitesMet: true,
        estimatedDifficulty: 8,
        relevanceScore: 9,
        userStats: {
          attemptedSimilar: 6,
          successRateInTopic: 0.85,
          timeSpentOnSimilar: 4.8
        }
      }
    ],
    previousQuestions: ['math_intro_2', 'math_intro_1'],
    relatedQuestions: ['math_003', 'math_004']
  }
};
