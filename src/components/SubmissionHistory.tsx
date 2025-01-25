import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { ApiService } from '../services/api';

interface Submission {
  id: string;
  timestamp: string;
  problemId: string;
  problemTitle: string;
  difficulty: string;
  lastResult: 'Accepted' | 'Wrong Answer';
  attempts: number;
}

const SubmissionHistory: React.FC = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSolved: 0,
    easy: 0,
    medium: 0,
    hard: 0,
    acceptanceRate: 0,
    totalSubmissions: 0
  });

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        console.log('Fetching unified stats...');
        const unifiedStats = await ApiService.getUnifiedStats('vicky');
        console.log('Received unified stats:', unifiedStats);
        
        // Map recent activity to submissions format
        const formattedSubmissions = unifiedStats.recentActivity.map(activity => ({
          id: activity.problemId,
          timestamp: activity.timestamp,
          problemId: activity.problemId,
          problemTitle: activity.problemTitle,
          difficulty: activity.difficulty,
          lastResult: activity.isCorrect ? 'Accepted' : 'Wrong Answer'
        }));

        setSubmissions(formattedSubmissions);
        
        // Update stats
        setStats({
          totalSolved: unifiedStats.submissions.correct,
          easy: unifiedStats.problemsByDifficulty.easy,
          medium: unifiedStats.problemsByDifficulty.medium,
          hard: unifiedStats.problemsByDifficulty.hard,
          acceptanceRate: unifiedStats.submissions.acceptanceRate,
          totalSubmissions: unifiedStats.submissions.total
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching submissions:', error);
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Your Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Problems Solved</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalSolved}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Total Submissions</h3>
            <p className="text-3xl font-bold text-green-600">{stats.totalSubmissions}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Acceptance Rate</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.acceptanceRate}%</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Difficulty Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-100 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800">Easy</h4>
            <p className="text-2xl font-bold text-green-600">{stats.easy}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-800">Medium</h4>
            <p className="text-2xl font-bold text-yellow-600">{stats.medium}</p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg">
            <h4 className="font-semibold text-red-800">Hard</h4>
            <p className="text-2xl font-bold text-red-600">{stats.hard}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">Submission History</h3>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Problem</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissions.map((submission, index) => (
                <tr key={submission.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 cursor-pointer" 
                         onClick={() => navigate(`/problems/${submission.problemId}`)}>
                      {submission.problemTitle}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${submission.difficulty === 'Easy' ? 'bg-green-100 text-green-800' : 
                        submission.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {submission.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${submission.lastResult === 'Accepted' ? 'bg-green-100 text-green-800' : 
                      'bg-red-100 text-red-800'}`}>
                      {submission.lastResult}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(submission.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubmissionHistory;
