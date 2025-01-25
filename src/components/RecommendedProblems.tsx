import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ApiService } from '../services/api';
import { Problem } from '../types';

interface RecommendedProblemsProps {
  currentProblem?: Problem;
  currentTopic?: string;
  onProblemSelect?: (id: number) => void;
}

export default function RecommendedProblems({ 
  currentProblem, 
  currentTopic, 
  onProblemSelect 
}: RecommendedProblemsProps) {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchRecommendedProblems = async () => {
      try {
        setLoading(true);
        const allProblems = await ApiService.getProblems();
        
        let recommendedProblems: Problem[] = [];
        
        if (currentTopic) {
          // Filter problems by the current topic
          recommendedProblems = allProblems.filter(
            p => p.topic === currentTopic && p.id !== currentProblem?.id
          );
        } else {
          // Get random problems from different topics
          const shuffled = allProblems
            .filter(p => p.id !== currentProblem?.id)
            .sort(() => 0.5 - Math.random());
          recommendedProblems = shuffled;
        }
        
        // Take only the first 6 problems
        setProblems(recommendedProblems.slice(0, 6));
      } catch (error) {
        console.error('Error fetching recommended problems:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedProblems();
  }, [currentProblem, currentTopic]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const container = scrollContainerRef.current;
      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (problems.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        Recommended Next Problems
      </h3>
      
      <div className="relative">
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 bg-white rounded-full shadow-lg p-2 hover:bg-gray-50 z-10"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory"
          style={{ scrollBehavior: 'smooth' }}
        >
          {problems.map((problem) => (
            <div
              key={problem.id}
              className="flex-shrink-0 w-72 snap-start cursor-pointer"
              onClick={() => onProblemSelect?.(problem.id)}
            >
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
                  {problem.title}
                </h4>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="px-2 py-1 rounded-full bg-gray-100">
                    {problem.topic}
                  </span>
                  <span className={`px-2 py-1 rounded-full ${
                    problem.difficulty === 'Hard' ? 'bg-red-100 text-red-800' :
                    problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {problem.difficulty}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 bg-white rounded-full shadow-lg p-2 hover:bg-gray-50 z-10"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
