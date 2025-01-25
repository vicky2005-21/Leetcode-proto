import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, CheckCircle } from 'lucide-react';
import { ApiService } from '../services/api';
import { Problem } from '../services/api';

interface FeaturedProblemsProps {
  onProblemSelect?: (id: string) => void;
}

export default function FeaturedProblems({ onProblemSelect }: FeaturedProblemsProps) {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const problemsData = await ApiService.getProblems();
        // Get top 6 problems based on a mix of criteria
        const featuredProblems = problemsData
          .slice(0, 6)
          .sort((a, b) => {
            // You can implement your own sorting logic here
            // For now, we'll just take the first 6
            return 0;
          });
        setProblems(featuredProblems);
      } catch (err) {
        console.error('Error fetching featured problems:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Featured Problems</h2>
          <p className="text-gray-600 mt-1">Top problems to get you started</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <TrendingUp className="w-4 h-4" />
          <span>Most solved</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {problems.map((problem) => (
          <div
            key={problem.id}
            onClick={() => onProblemSelect?.(problem.id.toString())}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100 overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{problem.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{problem.description}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    problem.difficulty === 'Easy'
                      ? 'bg-green-100 text-green-800'
                      : problem.difficulty === 'Medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {problem.difficulty}
                </span>
              </div>
              
              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-500">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  <span>{problem.category}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Users className="w-4 h-4 mr-1" />
                  <span>Many solved</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
