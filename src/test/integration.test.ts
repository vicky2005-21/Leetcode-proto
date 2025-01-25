import 'cross-fetch/polyfill';
import ApiService from '../services/api';

jest.setTimeout(10000); // Increase timeout to 10 seconds

describe('API Integration Tests', () => {
  const userId = 'user1';
  let problemId: number;

  // Add a delay helper function
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  beforeAll(async () => {
    // Wait for the server to be fully ready
    await delay(1000);
  });

  test('should fetch user profile', async () => {
    try {
      const user = await ApiService.getUser(userId);
      expect(user).toBeDefined();
      expect(user.name).toBeDefined();
      expect(user.stats).toBeDefined();
      expect(user.stats.problemsSolved).toBeDefined();
      expect(user.stats.accuracyRate).toBeDefined();
      expect(user.stats.studyStreak).toBeDefined();
      expect(user.stats.timeSpent).toBeDefined();
    } catch (error) {
      console.error('Error in user profile test:', error);
      throw error;
    }
  });

  test('should fetch all problems', async () => {
    try {
      const problems = await ApiService.getProblems();
      expect(problems).toBeDefined();
      expect(Array.isArray(problems)).toBe(true);
      expect(problems.length).toBeGreaterThan(0);
      problemId = problems[0].id;
    } catch (error) {
      console.error('Error in problems test:', error);
      throw error;
    }
  });

  test('should fetch a specific problem', async () => {
    try {
      const problem = await ApiService.getProblem(problemId);
      expect(problem).toBeDefined();
      expect(problem.id).toBe(problemId);
      expect(problem.options).toBeDefined();
      expect(Array.isArray(problem.options)).toBe(true);
    } catch (error) {
      console.error('Error in specific problem test:', error);
      throw error;
    }
  });

  test('should submit an answer and get response', async () => {
    try {
      const answer = await ApiService.submitAnswer(userId, problemId, 'A');
      expect(answer).toBeDefined();
      expect(answer.answer).toBe('A');
      expect(typeof answer.is_correct).toBe('boolean');
      expect(answer.timestamp).toBeDefined();
    } catch (error) {
      console.error('Error in submit answer test:', error);
      throw error;
    }
  });

  test('should fetch user answers', async () => {
    try {
      const answers = await ApiService.getUserAnswers(userId);
      expect(answers).toBeDefined();
      expect(typeof answers).toBe('object');
      expect(Object.keys(answers).length).toBeGreaterThan(0);
    } catch (error) {
      console.error('Error in user answers test:', error);
      throw error;
    }
  });

  test('should fetch specific user answer', async () => {
    try {
      const answer = await ApiService.getUserAnswer(userId, problemId);
      expect(answer).toBeDefined();
      if (answer) {
        expect(answer.answer).toBeDefined();
        expect(answer.is_correct).toBeDefined();
        expect(answer.timestamp).toBeDefined();
      }
    } catch (error) {
      console.error('Error in specific answer test:', error);
      throw error;
    }
  });

  test('should update user profile', async () => {
    try {
      const updatedData = {
        name: 'John Doe Updated',
        stats: {
          problemsSolved: 20,
          accuracyRate: 90,
          studyStreak: 5,
          timeSpent: '50h'
        }
      };

      const updated = await ApiService.updateUser(userId, updatedData);
      expect(updated).toBeDefined();
      expect(updated.name).toBe(updatedData.name);
      expect(updated.stats.problemsSolved).toBe(updatedData.stats.problemsSolved);
    } catch (error) {
      console.error('Error in update profile test:', error);
      throw error;
    }
  });
});
