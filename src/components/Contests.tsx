import React, { useState } from 'react';
import { Calendar, Clock, Trophy, Users, ChevronRight, Star, BarChart2 } from 'lucide-react';
import { mockContests } from '../data/mockData/contests';

export default function Contests() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);

  const contests = mockContests;

  const upcomingContests = contests.filter(c => c.status === 'upcoming');
  const pastContests = contests.filter(c => c.status === 'past');

  const ContestCard = ({ contest }: { contest: Contest }) => (
    <div 
      className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
      onClick={() => setSelectedContest(contest)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{contest.name}</h3>
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(contest.date).toLocaleDateString()}
            </div>
            <div className="flex items-center text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              {contest.duration}
            </div>
            <div className="flex items-center text-gray-500">
              <Users className="h-4 w-4 mr-1" />
              {contest.registeredUsers} registered
            </div>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>
      
      {contest.status === 'past' && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-indigo-600">
                <Trophy className="h-4 w-4 mr-1" />
                Rank: #{contest.yourRank} of {contest.totalParticipants}
              </div>
              <div className="flex items-center text-green-600">
                <Star className="h-4 w-4 mr-1" />
                Score: {contest.score}/{contest.maxScore}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const ContestDetail = ({ contest }: { contest: Contest }) => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => setSelectedContest(null)}
          className="text-indigo-600 hover:text-indigo-700"
        >
          ← Back to Contests
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900">{contest.name}</h2>
        <div className="flex items-center space-x-6 mt-4">
          <div className="flex items-center text-gray-500">
            <Calendar className="h-5 w-5 mr-2" />
            {new Date(contest.date).toLocaleDateString()}
          </div>
          <div className="flex items-center text-gray-500">
            <Clock className="h-5 w-5 mr-2" />
            {contest.duration}
          </div>
          <div className="flex items-center text-gray-500">
            <Users className="h-5 w-5 mr-2" />
            {contest.registeredUsers} registered
          </div>
        </div>

        {contest.status === 'past' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-indigo-50 rounded-lg p-4">
                <div className="flex items-center text-indigo-600 mb-2">
                  <Trophy className="h-5 w-5 mr-2" />
                  Your Rank
                </div>
                <div className="text-2xl font-bold text-indigo-700">
                  #{contest.yourRank} <span className="text-sm font-normal text-indigo-600">of {contest.totalParticipants}</span>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center text-green-600 mb-2">
                  <Star className="h-5 w-5 mr-2" />
                  Your Score
                </div>
                <div className="text-2xl font-bold text-green-700">
                  {contest.score} <span className="text-sm font-normal text-green-600">/ {contest.maxScore}</span>
                </div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center text-yellow-600 mb-2">
                  <BarChart2 className="h-5 w-5 mr-2" />
                  Percentile
                </div>
                <div className="text-2xl font-bold text-yellow-700">
                  {((1 - (contest.yourRank || 0) / (contest.totalParticipants || 1)) * 100).toFixed(1)}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Question-wise Analysis</h3>
              <div className="space-y-4">
                {contest.questions?.map((question) => (
                  <div key={question.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{question.title}</h4>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-500 capitalize">{question.subject}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                            question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {question.difficulty}
                          </span>
                          <span className="text-sm text-gray-500">{question.marks} marks</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        question.status === 'correct' ? 'bg-green-100 text-green-800' :
                        question.status === 'incorrect' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {question.status}
                      </span>
                    </div>
                    {question.yourAnswer && (
                      <div className="mt-2 text-sm text-gray-600">
                        Your answer: {question.yourAnswer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {!selectedContest ? (
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Contests</h1>
            <div className="flex space-x-4">
              {(['upcoming', 'past'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    activeTab === tab
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {(activeTab === 'upcoming' ? upcomingContests : pastContests).map((contest) => (
              <ContestCard key={contest.id} contest={contest} />
            ))}
          </div>
        </>
      ) : (
        <ContestDetail contest={selectedContest} />
      )}
    </div>
  );
}
