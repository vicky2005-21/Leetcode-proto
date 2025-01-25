import React from 'react';
import { Book, Calculator, Atom, Flask, Function } from 'lucide-react';

interface StudyPlanProps {
  onPlanSelect?: (id: string) => void;
}

const studyPlans = [
  {
    id: 'physics',
    icon: <Atom className="w-8 h-8 text-blue-500" />,
    title: 'Physics Complete Course',
    description: 'Master JEE Physics with 200+ Problems',
    count: '200'
  },
  {
    id: 'chemistry',
    icon: <Flask className="w-8 h-8 text-purple-500" />,
    title: 'Chemistry Foundation',
    description: 'Essential Chemistry Topics for JEE',
    count: '175'
  },
  {
    id: 'maths',
    icon: <Function className="w-8 h-8 text-cyan-500" />,
    title: 'Mathematics 101',
    description: 'Core Mathematics Problems for JEE',
    count: '250'
  },
  {
    id: 'previous',
    icon: <Calculator className="w-8 h-8 text-green-500" />,
    title: 'Previous Year Papers',
    description: 'Last 15 Years JEE Papers',
    count: '15'
  },
  {
    id: 'crash',
    icon: <Book className="w-8 h-8 text-yellow-500" />,
    title: '60 Days Crash Course',
    description: 'Quick JEE Preparation Plan',
    count: '300'
  }
];

export default function StudyPlan({ onPlanSelect }: StudyPlanProps) {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">JEE Study Plans</h2>
        <button className="text-sm text-blue-600 hover:text-blue-700">
          See all
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {studyPlans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => onPlanSelect?.(plan.id)}
            className="bg-white rounded-xl shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="p-2 bg-gray-50 rounded-lg">
                {plan.icon}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{plan.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-medium text-gray-500">
                    {plan.count} Questions
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
