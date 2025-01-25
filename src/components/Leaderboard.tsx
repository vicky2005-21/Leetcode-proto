import React from 'react';
import { Trophy, Medal } from 'lucide-react';

const leaderboardData = [
  { rank: 1, name: "Rahul Kumar", solvedCount: 450, accuracy: 92 },
  { rank: 2, name: "Priya Singh", solvedCount: 445, accuracy: 89 },
  { rank: 3, name: "Amit Patel", solvedCount: 442, accuracy: 87 },
  { rank: 4, name: "Sarah Khan", solvedCount: 438, accuracy: 85 },
  { rank: 5, name: "Raj Sharma", solvedCount: 435, accuracy: 84 }
];

export default function Leaderboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">Top Performers</h2>
        <p className="mt-2 text-gray-600">Compete with the best and climb the ranks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {leaderboardData.slice(0, 3).map((entry, index) => (
          <div key={entry.rank} className={`transform hover:-translate-y-2 transition-transform duration-300
            ${index === 0 ? 'md:order-2' : index === 1 ? 'md:order-1' : 'md:order-3'}`}>
            <div className="bg-white rounded-xl shadow-lg p-6 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Trophy className={`h-8 w-8 ${
                  index === 0 ? 'text-yellow-500' :
                  index === 1 ? 'text-gray-400' :
                  'text-bronze-500'
                }`} />
              </div>
              <div className="mt-4 text-center">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {entry.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{entry.name}</h3>
                <p className="text-gray-500">Rank #{entry.rank}</p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-indigo-600">{entry.solvedCount}</p>
                    <p className="text-sm text-gray-500">Solved</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-indigo-600">{entry.accuracy}%</p>
                    <p className="text-sm text-gray-500">Accuracy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Problems Solved</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {leaderboardData.map((entry) => (
              <tr key={entry.rank} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">#{entry.rank}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{entry.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{entry.solvedCount}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{entry.accuracy}%</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}