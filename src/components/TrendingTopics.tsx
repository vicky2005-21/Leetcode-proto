import React, { useEffect, useState } from 'react';
import { ApiService } from '../services/api';

interface TopicStat {
  topic: string;
  total: number;
  solved: number;
  subject: string;
}

interface TrendingTopicsProps {
  onTopicSelect: (topic: string, subject: string) => void;
  selectedTopic: string | null;
  selectedSubject?: string;
}

const subjectColors = {
  'Physics': 'blue',
  'Chemistry': 'purple',
  'Mathematics': 'green'
};

export default function TrendingTopics({ onTopicSelect, selectedTopic, selectedSubject }: TrendingTopicsProps) {
  const [topicStats, setTopicStats] = useState<TopicStat[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchTopicStats = async () => {
      try {
        // Fetch problems and user answers
        const [problemsResponse, userAnswersResponse] = await Promise.all([
          fetch('/backend/data/problems.json'),
          fetch('/backend/data/user_answers.json')
        ]);
        
        const problems = await problemsResponse.json();
        const userAnswersData = await userAnswersResponse.json();

        // Create a map to track user's solved problems
        const solvedProblems = new Set();
        const userAnswers = userAnswersData.answers.user1 || {};
        Object.entries(userAnswers).forEach(([problemId, data]: [string, any]) => {
          if (data.is_correct) {
            solvedProblems.add(problemId);
          }
        });

        // Group problems by subject and topic
        const topicMap = new Map<string, Map<string, {
          total: number;
          solved: number;
        }>>();

        problems.problems.forEach((problem: any) => {
          // Extract topic from problem title (e.g., "Vectors Problem 17" -> "Vectors")
          const titleParts = (problem.title || '').split(' ');
          const topic = titleParts[0];
          const subject = problem.subject || 'General';
          
          if (!topicMap.has(subject)) {
            topicMap.set(subject, new Map());
          }
          
          const subjectTopics = topicMap.get(subject)!;
          if (!subjectTopics.has(topic)) {
            subjectTopics.set(topic, {
              total: 0,
              solved: 0
            });
          }

          const stats = subjectTopics.get(topic)!;
          stats.total++;

          if (solvedProblems.has(problem.id.toString())) {
            stats.solved++;
          }
        });

        // Convert map to array and sort by total problems
        const stats: TopicStat[] = [];
        topicMap.forEach((subjectTopics, subject) => {
          subjectTopics.forEach((stat, topic) => {
            stats.push({
              topic,
              subject,
              ...stat
            });
          });
        });

        setTopicStats(stats);
      } catch (error) {
        console.error('Error fetching topic stats:', error);
      }
    };

    fetchTopicStats();
  }, []);

  // Filter topics by selected subject
  const filteredTopics = selectedSubject 
    ? topicStats.filter(t => t.subject === selectedSubject)
    : topicStats;

  const sortedTopics = [...filteredTopics].sort((a, b) => b.total - a.total);
  const totalPages = Math.ceil(sortedTopics.length / itemsPerPage);
  const displayedTopics = sortedTopics.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  // Reset page when subject changes
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedSubject]);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {selectedSubject ? `${selectedSubject} Topics` : 'All Topics'}
        </h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={prevPage}
            disabled={!displayedTopics.length}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
            aria-label="Previous topics"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={nextPage}
            disabled={!displayedTopics.length}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
            aria-label="Next topics"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {displayedTopics.map((topic) => {
          const color = subjectColors[topic.subject as keyof typeof subjectColors] || 'gray';
          const isSelected = selectedTopic === topic.topic && selectedSubject === topic.subject;
          const progressPercent = topic.total > 0 
            ? Math.round((topic.solved / topic.total) * 100)
            : 0;
          
          return (
            <button
              key={`${topic.subject}-${topic.topic}`}
              onClick={() => onTopicSelect(topic.topic, topic.subject)}
              className={`
                relative px-3 py-1.5 rounded-full text-sm font-medium
                ${isSelected 
                  ? `bg-${color}-600 text-white` 
                  : `bg-${color}-100 text-${color}-800 hover:bg-${color}-200`
                }
                transition-colors duration-200
              `}
            >
              <span className="relative z-10">
                {topic.topic}
                <span className="ml-1 opacity-75">
                  {topic.total}
                </span>
                {topic.solved > 0 && (
                  <span className="ml-1 text-xs opacity-75">
                    ({progressPercent}%)
                  </span>
                )}
              </span>
              {/* Progress bar background */}
              <div 
                className={`absolute inset-0 rounded-full bg-${color}-200 opacity-50`}
                style={{
                  width: `${progressPercent}%`,
                  transition: 'width 0.3s ease-in-out'
                }}
              />
            </button>
          );
        })}
        {!displayedTopics.length && (
          <p className="text-gray-500 italic">No topics available for this subject</p>
        )}
      </div>
    </div>
  );
}
