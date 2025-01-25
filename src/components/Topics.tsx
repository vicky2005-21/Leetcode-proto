import React from 'react';
import { Book, Atom, Calculator, FlaskRound as Flask, Zap, Brain, ArrowLeft } from 'lucide-react';

interface TopicCardProps {
  icon: React.ElementType;
  title: string;
  problemCount: number;
  completedCount: number;
  onSelect: () => void;
}

const TopicCard: React.FC<TopicCardProps> = ({ icon: Icon, title, problemCount, completedCount, onSelect }) => (
  <div
    onClick={onSelect}
    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
  >
    <div className="flex items-start space-x-4">
      <div className="p-3 bg-indigo-100 rounded-lg">
        <Icon className="h-8 w-8 text-indigo-600" />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{Math.round((completedCount / problemCount) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 rounded-full h-2 transition-all duration-300"
                style={{ width: `${(completedCount / problemCount) * 100}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-gray-600">
            {completedCount} of {problemCount} problems solved
          </p>
        </div>
      </div>
    </div>
  </div>
);

interface TopicsProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export default function Topics({ onNavigate, onBack }: TopicsProps) {
  const topics = [
    {
      icon: Calculator,
      title: 'Mathematics',
      categories: ['Calculus', 'Algebra', 'Trigonometry', 'Vectors'],
      problemCount: 150,
      completedCount: 85,
    },
    {
      icon: Atom,
      title: 'Physics',
      categories: ['Mechanics', 'Thermodynamics', 'Electrostatics', 'Optics'],
      problemCount: 120,
      completedCount: 65,
    },
    {
      icon: Flask,
      title: 'Chemistry',
      categories: ['Organic', 'Inorganic', 'Physical', 'Equilibrium'],
      problemCount: 100,
      completedCount: 45,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back
      </button>

      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Topics</h1>
        <p className="mt-2 text-gray-600">Master JEE concepts one topic at a time</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {topics.map((topic) => (
          <TopicCard
            key={topic.title}
            icon={topic.icon}
            title={topic.title}
            problemCount={topic.problemCount}
            completedCount={topic.completedCount}
            onSelect={() => onNavigate('problems')}
          />
        ))}
      </div>

      <div className="space-y-8">
        {topics.map((topic) => (
          <div key={topic.title} className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">{topic.title} Categories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {topic.categories.map((category) => (
                <div
                  key={category}
                  onClick={() => onNavigate('problems')}
                  className="p-4 border border-gray-200 rounded-lg hover:border-indigo-500 cursor-pointer transition-colors"
                >
                  <h3 className="font-medium text-gray-900">{category}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {Math.floor(Math.random() * 30 + 20)} problems
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}