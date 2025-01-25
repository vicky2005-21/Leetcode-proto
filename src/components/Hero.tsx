import React from 'react';
import { ArrowRight, Target, Clock, Award } from 'lucide-react';

interface HeroProps {
  onStartPracticing: () => void;
  onExploreTopics: () => void;
}

export default function Hero({ onStartPracticing, onExploreTopics }: HeroProps) {
  return (
    <div className="relative bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
      <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="relative z-10">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight animate-fade-in">
              Master JEE Mains
              <span className="block text-indigo-200">Like Never Before</span>
            </h1>
            <p className="mt-6 text-xl max-w-3xl mx-auto">
              Practice with thousands of JEE-level problems, track your progress,
              and compete with peers to achieve your dream rank.
            </p>
            <div className="mt-10 flex justify-center space-x-6">
              <button
                onClick={onStartPracticing}
                className="group bg-white text-indigo-600 px-8 py-3 rounded-full font-medium hover:bg-indigo-50 transition-all duration-200 flex items-center"
              >
                Start Practicing
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onExploreTopics}
                className="border-2 border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-indigo-600 transition-all duration-200"
              >
                Explore Topics
              </button>
            </div>
          </div>
          
          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center p-6 bg-white bg-opacity-10 rounded-xl backdrop-blur-lg">
              <Target className="h-12 w-12 mb-4" />
              <h3 className="text-xl font-semibold">Targeted Practice</h3>
              <p className="mt-2 text-center text-indigo-100">Focus on your weak areas with topic-wise practice</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white bg-opacity-10 rounded-xl backdrop-blur-lg">
              <Clock className="h-12 w-12 mb-4" />
              <h3 className="text-xl font-semibold">Time Management</h3>
              <p className="mt-2 text-center text-indigo-100">Practice with real exam time constraints</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white bg-opacity-10 rounded-xl backdrop-blur-lg">
              <Award className="h-12 w-12 mb-4" />
              <h3 className="text-xl font-semibold">Track Progress</h3>
              <p className="mt-2 text-center text-indigo-100">Monitor your improvement with detailed analytics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}