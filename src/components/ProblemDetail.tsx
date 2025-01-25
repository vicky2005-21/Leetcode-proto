import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle, ChevronLeft, ChevronRight, ChevronDown, Upload } from 'lucide-react';
import { ApiService } from '../services/api';
import { Problem, UserAnswer, ProblemStats, UserSubmission } from '../types';
import '../styles/ProblemDetail.css';

interface ProblemDetailProps {
  onBack?: () => void;
}

const ProblemDetail: React.FC<ProblemDetailProps> = ({ onBack }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [problemStats, setProblemStats] = useState<ProblemStats>({ total_attempts: 0, correct_attempts: 0, accuracy: 0 });
  const [reviews, setReviews] = useState([]);
  const [review, setReview] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalProblems, setTotalProblems] = useState(0);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [solvedProblems, setSolvedProblems] = useState(0);
  const [userAnswer, setUserAnswer] = useState<UserAnswer | null>(null);
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [averageTime, setAverageTime] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [attempts, setAttempts] = useState<number>(0);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [showTimer, setShowTimer] = useState<boolean>(true);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isTimerRunning) {
      intervalId = setInterval(() => {
        if (startTime) {
          const now = Date.now();
          setElapsedTime(Math.floor((now - startTime) / 1000));
        }
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isTimerRunning, startTime]);

  useEffect(() => {
    // Reset and start timer when problem changes
    setStartTime(Date.now());
    setElapsedTime(0);
    setIsTimerRunning(true);
    setUserAnswer(null);
    setSelectedAnswer('');
    setShowFeedback(false);
    setFeedbackMessage('');
    setShowHint(false);
  }, [id, problem?.id]);

  useEffect(() => {
    // Start timer when component mounts or when problem changes
    if (!userAnswer) {
      setIsTimerRunning(true);
    }
  }, [id, userAnswer]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchProblemData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching problem data for ID:', id);
        
        // Reset states
        setSelectedAnswer('');
        setShowFeedback(false);
        setShowHint(false);
        setUserAnswer(null);
        setFeedbackMessage('');
        setAttempts(0);  
        setIsSolved(false);  
        
        // Start the timer for the new problem
        setStartTime(Date.now());
        setElapsedTime(0);
        setIsTimerRunning(true);

        const problemId = parseInt(id);
        const [
          problemData,
          problemsData,
          userStatsData,
          previousAnswer,
          stats,
          reviewsData
        ] = await Promise.all([
          ApiService.getProblem(problemId),
          ApiService.getProblems(),
          ApiService.getUserStats('user1'),
          ApiService.getUserAnswer('user1', problemId),
          ApiService.getProblemStats(problemId),
          ApiService.getProblemReviews(problemId)
        ]);

        console.log('Received problem data:', problemData);
        console.log('All problems:', problemsData);

        if (!problemData) {
          throw new Error('Problem not found');
        }

        setProblem(problemData);
        setCurrentTopic(problemData.topic);
        setReviews(reviewsData);
        
        // Set total problems and current index
        const filteredProblems = currentTopic
          ? problemsData.filter(p => p.topic === currentTopic)
          : problemsData;
        setTotalProblems(filteredProblems.length);
        setCurrentProblemIndex(filteredProblems.findIndex(p => p.id === problemId) + 1);

        // Set stats
        if (userStatsData?.stats) {
          setSolvedProblems(userStatsData.stats.problemsSolved);
        }

        if (stats) setProblemStats(stats);

        if (previousAnswer) {
          setUserAnswer(previousAnswer);
          setSelectedAnswer(previousAnswer.answer);
          if (previousAnswer.is_correct) {
            setShowFeedback(true);
            setFeedbackMessage('Correct! Well done.');
          }
        }

        if (stats) {
          setProblemStats(stats);
        }
      } catch (err) {
        console.error('Error fetching problem:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching problem data');
      } finally {
        setLoading(false);
      }
    };

    fetchProblemData();
  }, [id]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchTotalProblems = async () => {
      try {
        const problems = await ApiService.getProblems();
        setTotalProblems(problems.length);
        if (id) {
          const currentIndex = problems.findIndex(p => p.id === parseInt(id));
          setCurrentProblemIndex(currentIndex + 1);
        }
      } catch (error) {
        console.error('Error fetching total problems:', error);
      }
    };
    fetchTotalProblems();
  }, [id]);

  useEffect(() => {
    const fetchProblemStats = async () => {
      try {
        const submissions = await ApiService.getProblemSubmissions(id);
        const uniqueUsers = new Set(submissions.map(s => s.userId));
        const uniqueAcceptedUsers = new Set(
          submissions
            .filter(s => s.lastResult === 'Accepted')
            .map(s => s.userId)
        );
        
        setProblemStats({
          total_attempts: submissions.length,
          correct_attempts: uniqueAcceptedUsers.size,
          accuracy: Math.round((uniqueAcceptedUsers.size / uniqueUsers.size) * 100) || 0
        });
      } catch (error) {
        console.error('Error fetching problem stats:', error);
      }
    };

    if (id) {
      fetchProblemStats();
    }
  }, [id]);

  const fetchRelatedProblems = async (currentProblem: Problem) => {
    try {
      const allProblems = await ApiService.getProblems();
      const related = allProblems
        .filter(p => p.id !== currentProblem.id)
        .filter(p => 
          p.category === currentProblem.category ||
          p.difficulty === currentProblem.difficulty
        )
        .slice(0, 12); // Get top 12 related problems
      setRelatedProblems(related);
    } catch (err) {
      console.error('Error fetching related problems:', err);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMediaFile(file);
      const url = URL.createObjectURL(file);
      setMediaPreview(url);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!selectedAnswer || !id) return;

    try {
      setSubmitting(true);
      setIsTimerRunning(false); // Stop the timer
      const timeTaken = Math.floor((Date.now() - (startTime || Date.now())) / 1000);
      
      const result = await ApiService.submitAnswer('user1', Number(id), selectedAnswer, timeTaken);
      
      // Check if result.answer exists and has the expected properties
      if (result.answer && typeof result.answer === 'object') {
        setUserAnswer({
          answer: result.answer.answer,
          is_correct: result.answer.is_correct,
          timestamp: result.answer.timestamp
        });
        
        setShowFeedback(true);
        
        if (result.answer.is_correct) {
          setFeedbackMessage('Correct! Great job!');
          setIsSolved(true);
          // Don't increment attempts if already solved
          if (!isSolved) {
            setAttempts(prev => prev + 1);
          }
        } else {
          setFeedbackMessage('Not quite right. Try again!');
          setShowHint(true);
          // Only increment attempts for wrong answers
          setAttempts(prev => prev + 1);
          // Update average time only on first wrong attempt
          if (!userAnswer) {
            setAverageTime(timeTaken);
          }
        }

        // Update stats and submissions immediately
        const [newStats] = await Promise.all([
          ApiService.getProblemStats(parseInt(id))
        ]);

        setProblemStats(newStats);
      } else {
        console.error('Invalid response format:', result);
        setFeedbackMessage('Error processing answer. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      setFeedbackMessage('Error submitting answer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOptionSelect = (option: string) => {
    // Always allow selecting a new option unless the answer was correct
    if (!userAnswer?.is_correct) {
      setSelectedAnswer(option);
      setShowFeedback(false);
      setFeedbackMessage('');
    }
  };

  const handleNextProblem = async () => {
    if (!problem) return;

    try {
      const problems = await ApiService.getProblems();
      const filteredProblems = currentTopic
        ? problems.filter(p => p.topic === currentTopic)
        : problems;
      
      const currentIndex = filteredProblems.findIndex(p => p.id === problem.id);
      const nextProblem = filteredProblems[currentIndex + 1];

      if (nextProblem) {
        navigate(`/problems/${nextProblem.id}`);
      } else {
        // No more problems in this topic
        setFeedbackMessage('You have completed all problems in this topic!');
      }
    } catch (error) {
      console.error('Error navigating to next problem:', error);
    }
  };

  const handleNext = async () => {
    if (!problem) return;

    try {
      const problems = await ApiService.getProblems();
      const filteredProblems = currentTopic
        ? problems.filter(p => p.topic === currentTopic)
        : problems;
      
      const currentIndex = filteredProblems.findIndex(p => p.id === problem.id);
      if (currentIndex < filteredProblems.length - 1) {
        const nextProblem = filteredProblems[currentIndex + 1];
        navigate(`/problems/${nextProblem.id}`);
      } else {
        setFeedbackMessage('You have completed all problems in this topic!');
        navigate('/problems');
      }
    } catch (error) {
      console.error('Error navigating to next problem:', error);
      setError('Failed to navigate to next problem');
    }
  };

  const handleSkip = async () => {
    try {
      const allProblems = await ApiService.getProblems();
      const currentIndex = allProblems.findIndex(p => p.id === problem?.id);
      
      if (currentIndex < allProblems.length - 1) {
        const nextProblem = allProblems[currentIndex + 1];
        // Navigate to the next problem
        navigate(`/problems/${nextProblem.id}`, { replace: true });
        // Reset states for the new problem
        setSelectedAnswer('');
        setShowFeedback(false);
        setIsCorrect(null);
      } else {
        navigate('/problems');
      }
    } catch (error) {
      console.error('Error skipping problem:', error);
      setError('Failed to skip problem');
    }
  };

  const handleBack = () => {
    navigate('/problems');
  };

  const handleSubmitReview = async () => {
    if (!id || !review.trim()) return;

    try {
      const formData = new FormData();
      formData.append('content', review);
      if (mediaFile) {
        formData.append('media', mediaFile);
      }

      const newReview = await ApiService.submitReviewWithForm(parseInt(id), formData);
      setReviews(prev => [newReview, ...prev]);
      setReview('');
      setMediaFile(null);
      setMediaPreview(null);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleCancelReview = () => {
    setReview('');
    setMediaFile(null);
    setMediaPreview(null);
  };

  useEffect(() => {
    const updateStats = async () => {
      try {
        const stats = await ApiService.getUserStats('user1');
        if (stats?.stats) {
          setSolvedProblems(stats.stats.problemsSolved);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    updateStats();
  }, [userAnswer]); // Update whenever answer changes

  const renderStatsSection = () => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Problem Statistics</h2>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
          <div className="text-sm text-gray-500">Total Attempts</div>
          <div className="text-2xl font-bold">{problemStats.total_attempts || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
          <div className="text-sm text-gray-500">Average Time</div>
          <div className="text-2xl font-bold text-blue-600">
            ⏱️ {formatTime(averageTime)}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
          <div className="text-sm text-gray-500">Accuracy</div>
          <div className="text-2xl font-bold text-blue-600">
            {problemStats.accuracy || 0}%
          </div>
        </div>
      </div>
    </div>
  );

  const renderReviewsSection = () => (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
      <h2 className="text-2xl font-semibold mb-6">Reviews & Discussion</h2>
      
      {/* Review Input */}
      <div className="mb-8">
        <div className="relative">
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your approach or ask a question..."
            className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[120px] resize-none"
          />
          <div className="absolute bottom-3 right-3">
            <label className="cursor-pointer inline-flex items-center gap-2 p-2 bg-white text-gray-600 rounded-lg border border-gray-200">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleMediaUpload}
                className="hidden"
              />
              <Upload className="w-5 h-5" />
            </label>
          </div>
        </div>
        
        {/* Media Preview */}
        {mediaPreview && (
          <div className="mt-4">
            <div className="relative inline-block">
              {mediaFile?.type.startsWith('image/') ? (
                <img src={mediaPreview} alt="Preview" className="h-20 w-20 object-cover rounded-lg border border-gray-200" />
              ) : (
                <video src={mediaPreview} className="h-20 w-20 object-cover rounded-lg border border-gray-200" />
              )}
              <button
                onClick={() => {
                  setMediaFile(null);
                  setMediaPreview(null);
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <span className="sr-only">Remove media</span>
                ×
              </button>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSubmitReview}
            disabled={!review.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Review
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-100 pb-6">
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="font-medium text-gray-900">{review.author}</span>
                <span className="text-gray-500 text-sm ml-2">
                  {new Date(review.timestamp).toLocaleDateString()}
                </span>
              </div>
            </div>
            <p className="text-gray-700 mb-4">{review.content}</p>
            {review.media && (
              <div className="mt-2">
                {review.media.endsWith('.mp4') ? (
                  <video src={review.media} controls className="max-h-[300px] rounded-lg" />
                ) : (
                  <img src={review.media} alt="" className="max-h-[300px] rounded-lg" />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => navigate('/problems')}
          className="text-blue-600 hover:text-blue-700"
        >
          Return to Problems List
        </button>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-600 mb-4">Problem not found</div>
        <button
          onClick={() => navigate('/problems')}
          className="text-blue-600 hover:text-blue-700"
        >
          Return to Problems List
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Back button and navigation */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to Problems
        </button>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            Problem {currentProblemIndex} of {totalProblems}
          </span>
          <span className="text-sm text-green-600">
            {solvedProblems} Solved
          </span>
        </div>
      </div>

      {/* Problem content */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button onClick={onBack} className="text-gray-600 hover:text-gray-800">
              <ArrowLeft size={24} />
            </button>
            <h2 className="text-2xl font-bold text-gray-900">Problem {currentProblemIndex} of {totalProblems}</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-lg font-semibold text-gray-700">
              Time: {formatTime(elapsedTime)}
            </div>
            <div className="text-sm text-gray-500">
              Attempts: {attempts}
            </div>
            <div className="text-sm text-gray-500">
              Solved: {solvedProblems}
            </div>
          </div>
        </div>

        <div className="prose max-w-none mb-8">
          <p>{problem.description}</p>
        </div>

        {/* Hint Button */}
        {!userAnswer?.is_correct && problem.hints && (
          <div className="mb-4">
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-blue-600 hover:text-blue-700 flex items-center"
            >
              <HelpCircle className="w-4 h-4 mr-1" />
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
            {showHint && (
              <div className="mt-2 p-3 bg-blue-50 rounded-lg text-blue-700">
                {problem.hints[0]}
              </div>
            )}
          </div>
        )}

        {/* Options */}
        <div className="space-y-4 mt-6">
          {problem.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              disabled={userAnswer?.is_correct}
              className={`w-full p-4 text-left rounded-lg border transition-colors ${
                selectedAnswer === option.id
                  ? userAnswer?.is_correct
                    ? 'bg-green-100 border-green-500'
                    : userAnswer?.answer === option.id && showFeedback
                    ? 'bg-red-100 border-red-500'
                    : 'bg-blue-100 border-blue-500'
                  : 'bg-white hover:bg-gray-50 border-gray-200'
              } ${
                userAnswer?.is_correct && option.id === userAnswer.answer
                  ? 'bg-green-100 border-green-500'
                  : ''
              }`}
            >
              <div className="flex items-center">
                <span className="font-medium w-8">{option.id}.</span>
                <span>{option.text}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Feedback and Navigation */}
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm">
            {showFeedback && (
              <span className={userAnswer?.is_correct ? 'text-green-600' : 'text-red-600'}>
                {feedbackMessage}
              </span>
            )}
            {attempts > 0 && (
              <p className="text-sm text-gray-600">
                Attempts: {attempts}
              </p>
            )}
          </div>
          <div className="flex space-x-4">
            {!userAnswer?.is_correct && (
              <button
                onClick={handleAnswerSubmit}
                disabled={!selectedAnswer || submitting}
                className={`px-6 py-2 rounded-lg font-semibold text-white ${
                  selectedAnswer
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            )}
            {userAnswer?.is_correct && (
              <button
                onClick={handleNextProblem}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <span>Next {currentTopic ? 'in Topic' : 'Problem'}</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {renderStatsSection()}

      {/* Show reviews */}
      {renderReviewsSection()}
    </div>
  );
};

export default ProblemDetail;
