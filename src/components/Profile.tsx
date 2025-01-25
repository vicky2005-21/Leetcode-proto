import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Clock, Award, Target, Zap, Globe, Trophy, Calendar } from 'lucide-react';
import { ApiService } from '../services/api';
import { User } from '../services/api';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentProblems, setRecentProblems] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const unifiedStats = await ApiService.getUnifiedStats('vicky');
        setUser(unifiedStats.user);
        setRecentProblems(unifiedStats.recentActivity);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 text-gray-500">
        No user data available
      </div>
    );
  }

  const upcomingContests = [
    { id: 1, name: 'Weekly Challenge #45', date: '2025-01-25', duration: '2 hours' },
    { id: 2, name: 'Monthly Contest', date: '2025-02-01', duration: '3 hours' },
    { id: 3, name: 'Coding Sprint', date: '2025-02-15', duration: '1.5 hours' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center space-x-6">
          <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <div className="flex space-x-3 mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    <Globe className="h-4 w-4 mr-1" />
                    Global Rank #{user.rank || 'N/A'}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <Zap className="h-4 w-4 mr-1" />
                    {user.stats.studyStreak} Day Streak
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Member since</p>
                <p className="font-medium">January 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Problems Solved */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Problems Solved</h3>
            <Target className="h-6 w-6 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {user?.stats?.problemsSolved} / {user?.stats?.totalProblems}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Total attempts: {user?.stats?.totalAttempts}
          </p>
        </div>

        {/* Accuracy Rate */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Accuracy Rate</h3>
            <Target className="h-6 w-6 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {user?.stats?.accuracyRate}%
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Based on unique problem attempts
          </p>
        </div>

        {/* Study Streak */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Study Streak</h3>
            <Zap className="h-6 w-6 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {user?.stats?.studyStreak} days
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Keep practicing daily!
          </p>
        </div>

        {/* Time Spent */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Time Spent</h3>
            <Clock className="h-6 w-6 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {user?.stats?.timeSpent}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Total study time
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Problems */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Problems</h2>
              <button
                onClick={() => navigate('/submissions')}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View All Submissions
              </button>
            </div>
            <div className="space-y-4">
              {recentProblems.map((problem) => (
                <div
                  key={problem.id}
                  onClick={() => navigate(`/problems/${problem.id}`)}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className={`h-2 w-2 rounded-full ${problem.lastResult === 'Accepted' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <h3 className="font-medium text-gray-900">{problem.title}</h3>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(problem.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                      problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {problem.difficulty}
                    </span>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                      {problem.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Contests */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Contests</h2>
              <Trophy className="h-6 w-6 text-yellow-500" />
            </div>
            <div className="space-y-4">
              {upcomingContests.map((contest) => (
                <div key={contest.id} className="p-4 rounded-lg bg-gray-50">
                  <h3 className="font-medium text-gray-900">{contest.name}</h3>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(contest.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {contest.duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Achievements</h2>
            <div className="grid grid-cols-3 gap-4">
              {['Problem Solver', 'Quick Learner', 'Streak Master'].map((badge, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                    <Award className="h-6 w-6 text-yellow-600" />
                  </div>
                  <span className="text-xs text-center font-medium text-gray-700">{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;