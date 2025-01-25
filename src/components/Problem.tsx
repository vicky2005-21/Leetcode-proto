import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { ApiService } from '../services/api';
import { Problem as ProblemType } from '../types';
import RecommendedProblems from './RecommendedProblems';

interface ProblemProps {
  problemId: number;
  onBack?: () => void;
  onProblemSelect?: (id: number) => void;
}

export default function Problem({ problemId, onBack, onProblemSelect }: ProblemProps) {
  const [problem, setProblem] = useState<ProblemType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [review, setReview] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getProblem(problemId);
        setProblem(data);
      } catch (err) {
        setError('Failed to load problem');
        console.error('Error fetching problem:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer) {
      setError('Please select an answer');
      return;
    }

    try {
      setSubmitting(true);
      await ApiService.submitAnswer('user1', problemId, selectedAnswer);
      // Optionally submit review if provided
      if (review.trim()) {
        await ApiService.submitReview('user1', problemId, review);
      }
      setError(null);
    } catch (err) {
      setError('Failed to submit answer');
      console.error('Error submitting answer:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!review.trim()) {
      setError('Please enter a review');
      return;
    }

    try {
      setSubmitting(true);
      await ApiService.submitReview('user1', problemId, review);
      setError(null);
    } catch (err) {
      setError('Failed to submit review');
      console.error('Error submitting review:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Problem not found</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Navigation Bar */}
      <div className="flex items-center justify-between mb-6 bg-white rounded-lg shadow-sm p-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Problems
        </button>
        <div className="flex items-center gap-4">
          <button className="text-gray-600 hover:text-gray-900">Previous</button>
          <button className="text-gray-600 hover:text-gray-900">Next</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Problem Description */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            {/* Problem Header */}
            <div className="border-b border-gray-200 pb-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{problem.title}</h1>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    problem.difficulty === 'Hard' ? 'bg-red-100 text-red-800' :
                    problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {problem.difficulty}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Category: {problem.topic}</span>
                <span>•</span>
                <span>Acceptance: 75%</span>
              </div>
            </div>

            {/* Problem Content */}
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-6">{problem.description}</p>
            </div>
          </div>

          {/* Answer Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-medium text-gray-900 mb-4">Select your answer:</h3>
            <div className="space-y-3">
              {problem.options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedAnswer === option
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={option}
                    checked={selectedAnswer === option}
                    onChange={(e) => setSelectedAnswer(e.target.value)}
                    className="hidden"
                  />
                  <span className="ml-2">{option}</span>
                </label>
              ))}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmitAnswer}
              disabled={submitting}
              className="w-full mt-6 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1">
          {/* Problem Stats */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="font-medium text-gray-900 mb-4">Problem Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Attempts</span>
                <span className="font-medium">1,234</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Acceptance Rate</span>
                <span className="font-medium">75%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Difficulty</span>
                <span className={`font-medium ${
                  problem.difficulty === 'Hard' ? 'text-red-600' :
                  problem.difficulty === 'Medium' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>{problem.difficulty}</span>
              </div>
            </div>
          </div>

          {/* Review Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-medium text-gray-900 mb-4">Add Review</h3>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your thoughts about this problem..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={4}
            />
            {error && (
              <div className="text-red-600 mt-2 mb-4">
                {error}
              </div>
            )}
            <button
              onClick={handleSubmitReview}
              disabled={submitting || !review.trim()}
              className="w-full mt-4 px-6 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Submit Review
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Problems */}
      <RecommendedProblems
        currentProblem={problem}
        currentTopic={problem.topic}
        onProblemSelect={onProblemSelect}
      />
    </div>
  );
}
