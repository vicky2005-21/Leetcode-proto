import axios, { AxiosError } from 'axios';
import { Problem, UserStats, ProblemStats, UserSubmission, User, Achievement, UserAnswer, SubmitAnswerResponse } from '../types';

const API_BASE_URL = 'http://192.168.0.102:5001';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
});

class ApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      throw new ApiError(error.response.data.error || 'API request failed', error.response.status);
    }
    throw new ApiError(error.message);
  }
  throw new ApiError('An unexpected error occurred');
};

export const ApiService = {
  async getUser(userId: string): Promise<User> {
    try {
      const response = await axiosInstance.get<User>(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting user:', error);
      throw handleApiError(error);
    }
  },

  async getProblems(): Promise<Problem[]> {
    try {
      const response = await axiosInstance.get<Problem[]>('/problems');
      return response.data;
    } catch (error) {
      console.error('Error getting problems:', error);
      throw handleApiError(error);
    }
  },

  async getProblem(id: number): Promise<Problem | null> {
    try {
      const response = await axiosInstance.get<Problem>(`/problems/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching problem:', error);
      return null;
    }
  },

  async getUserAnswer(userId: string, problemId: number): Promise<UserAnswer | null> {
    try {
      const response = await axiosInstance.get<UserAnswer>(`/user_answer/${userId}/${problemId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting user answer:', error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null; // Return null for new users or no answer yet
      }
      throw handleApiError(error);
    }
  },

  async getUserAnswers(userId: string): Promise<Record<string, UserAnswer>> {
    try {
      const response = await axiosInstance.get<Record<string, UserAnswer>>(`/users/${userId}/answers`);
      return response.data;
    } catch (error) {
      console.error('Error getting user answers:', error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return {}; // Return empty object if user has no answers
      }
      throw handleApiError(error);
    }
  },

  async submitAnswer(userId: string, problemId: number, answer: string): Promise<SubmitAnswerResponse> {
    try {
      const response = await axiosInstance.post<SubmitAnswerResponse>(
        `/users/${userId}/submit_answer/${problemId}`,
        { answer },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Log the response in a clean format
      console.log('Server response:', {
        success: response.data.success,
        answer: {
          value: response.data.answer.answer,
          isCorrect: response.data.answer.is_correct,
          timestamp: response.data.answer.timestamp
        },
        stats: {
          problemsSolved: response.data.stats.problemsSolved,
          accuracyRate: response.data.stats.accuracyRate,
          studyStreak: response.data.stats.studyStreak,
          timeSpent: response.data.stats.timeSpent,
          correctSolved: response.data.stats.correctSolved,
          totalPoints: response.data.stats.totalPoints,
          lastUpdated: response.data.stats.lastUpdated
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error submitting answer:', error);
      throw handleApiError(error);
    }
  },

  async submitReview(userId: string, problemId: number, review: string): Promise<{
    success: boolean;
    message: string;
    review: {
      user_id: string;
      problem_id: number;
      review: string;
      timestamp: string;
    };
  }> {
    try {
      const response = await axiosInstance.post(
        `/users/${userId}/submit_review/${problemId}`,
        { review },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error submitting review:', error);
      throw handleApiError(error);
    }
  },

  async getUserStats(userId: string): Promise<{
    stats: UserStats;
    achievements: Achievement[];
  }> {
    try {
      const response = await axiosInstance.get<{
        stats: UserStats;
        achievements: Achievement[];
      }>(`/users/${userId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error getting user stats:', error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        // Return default stats if none exist
        return {
          stats: {
            problemsSolved: 0,
            accuracyRate: 0,
            studyStreak: 0,
            timeSpent: '0',
            correctSolved: 0,
            totalPoints: 0,
            lastUpdated: new Date().toISOString()
          },
          achievements: []
        };
      }
      throw handleApiError(error);
    }
  },

  async getProblemStats(problemId: number): Promise<ProblemStats> {
    try {
      const response = await axiosInstance.get<ProblemStats>(`/problem_stats/${problemId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting problem stats:', error);
      // Return default stats on error
      return {
        totalSubmissions: 0,
        correctSubmissions: 0,
        accuracy: 0
      };
    }
  },

  async getProblemSubmissions(problemId: string | undefined): Promise<UserSubmission[]> {
    try {
      const response = await axiosInstance.get<UserSubmission[]>(`/problems/${problemId}/submissions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching problem submissions:', error);
      return [];
    }
  },

  async getProblemReviews(problemId: number): Promise<any[]> {
    try {
      const response = await axiosInstance.get(`/problems/${problemId}/reviews`);
      return response.data;
    } catch (error) {
      console.error('Error fetching problem reviews:', error);
      return [];
    }
  },

  async submitReviewWithForm(problemId: number, formData: FormData): Promise<any> {
    try {
      const response = await axiosInstance.post(
        `/problems/${problemId}/reviews`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  },

  async getUserSubmissions(): Promise<any> {
    try {
      // Get problems to generate submission data
      const problemsResponse = await axiosInstance.get('/problems');
      const problems = problemsResponse.data;

      // Create sample submission data from problems
      const submissions = problems.slice(0, 10).map((problem: any) => ({
        id: problem.id,
        timestamp: new Date().toISOString(),
        problemId: problem.id,
        problemTitle: problem.title,
        difficulty: problem.difficulty,
        lastResult: Math.random() > 0.3 ? 'Accepted' : 'Wrong Answer',
        attempts: Math.floor(Math.random() * 3) + 1
      }));

      return submissions;
    } catch (error) {
      console.error('Error in getUserSubmissions:', error);
      throw handleApiError(error);
    }
  },

  async getUnifiedStats(userId: string): Promise<any> {
    try {
      const response = await axiosInstance.get(`/api/unified-stats/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting unified stats:', error);
      throw handleApiError(error);
    }
  }
};
