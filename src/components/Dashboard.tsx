import React, { useEffect, useState } from 'react';
import { Activity, Book, CheckCircle, Clock, Target, Trophy, XCircle, Zap } from 'lucide-react';
import { ApiService } from '../services/api';

export default function Dashboard() {
  const [userStats, setUserStats] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const unifiedStats = await ApiService.getUnifiedStats('vicky');
        setUserStats(unifiedStats.user.stats);
        setUserProfile({
          stats: unifiedStats.user.stats,
          submissions: unifiedStats.submissions,
          problemsByDifficulty: unifiedStats.problemsByDifficulty,
          recentActivity: unifiedStats.recentActivity
        });
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };

    fetchStats();
  }, []);

  const stats = [
    {
      title: "Problems Solved",
      value: userStats?.problemsSolved ?? 0,
      icon: CheckCircle,
      color: "text-green-500"
    },
    {
      title: "Accuracy Rate",
      value: userStats?.accuracyRate ?? 0,
      icon: Target,
      color: "text-blue-500"
    },
    {
      title: "Study Streak",
      value: userStats?.studyStreak ?? 0,
      icon: Zap,
      color: "text-yellow-500"
    },
    {
      title: "Time Spent",
      value: userStats?.timeSpent ?? "0h",
      icon: Clock,
      color: "text-purple-500"
    },
    {
      title: "Total Submissions",
      value: userProfile?.submissions?.total ?? 0,
      icon: Activity,
      color: "text-orange-500"
    },
    {
      title: "Current Rank",
      value: userStats?.rank ?? 1000,
      icon: Trophy,
      color: "text-indigo-500"
    }
  ];

  const recentActivity = userProfile?.recentActivity ?? [];
  const recentTopics = userProfile?.problemsByDifficulty ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Statistics Section */}
      {stats.length === 0 ? (
        <p>No data available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                  <span className="text-sm text-gray-500">
                    {stat.change > 0
                      ? `+${stat.change}`
                      : stat.change < 0
                      ? `${stat.change}`
                      : "0"}
                  </span>
                </div>
                <h3 className="text-gray-500 text-sm">{stat.title}</h3>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Progress Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-indigo-600" />
            Recent Progress
          </h2>
          <div className="space-y-6">
            {userProfile?.problemsByDifficulty && userProfile.problemsByDifficulty.length > 0 ? (
              userProfile.problemsByDifficulty.map((subject, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">{subject.subject}</span>
                    <span className="text-gray-500">{subject.accuracy}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 rounded-full h-2 transition-all duration-300"
                      style={{ width: `${subject.accuracy}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No recent progress available</p>
            )}
          </div>
        </div>

        {/* Study Recommendations Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <Book className="h-5 w-5 mr-2 text-indigo-600" />
            Study Recommendations
          </h2>
          <div className="space-y-4">
            <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
              <h3 className="font-medium text-yellow-800">Focus Area</h3>
              <p className="text-yellow-600 mt-1">
                Your accuracy in Thermodynamics is lower than other topics. 
                Consider spending more time here.
              </p>
            </div>
            <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-800">Strong Performance</h3>
              <p className="text-green-600 mt-1">
                Great work in Complex Numbers! You're in the top 15% of students.
              </p>
            </div>
            <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800">Next Steps</h3>
              <p className="text-blue-600 mt-1">
                Try attempting some advanced problems in Kinematics to challenge yourself.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-indigo-600" />
          Recent Activity
        </h2>
        <div className="space-y-4">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div
                  className={`p-2 rounded-full ${
                    activity.type === 'contest'
                      ? 'bg-yellow-100 text-yellow-600'
                      : activity.result === 'correct'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {activity.type === 'contest' ? (
                    <Trophy className="h-5 w-5" />
                  ) : activity.result === 'correct' ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <XCircle className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="text-gray-800">{activity.problemName}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(activity.date).toLocaleDateString()} -{' '}
                    {activity.type === 'contest'
                      ? `Scored ${activity.score} points`
                      : activity.result === 'correct'
                      ? 'Solved successfully'
                      : 'Attempted'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No recent activity available</p>
          )}
        </div>
      </div>
    </div>
  );
}
