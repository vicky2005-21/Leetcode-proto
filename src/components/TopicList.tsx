import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface TopicListProps {
  subject: string;
  onTopicSelect: (topic: string, subject: string) => void;
}

interface TopicStat {
  name: string;
  total: number;
  solved: number;
  firstProblemId?: string;
}

export default function TopicList({ subject, onTopicSelect }: TopicListProps) {
  const [topics, setTopics] = useState<TopicStat[]>([]);

  useEffect(() => {
    const fetchTopicStats = async () => {
      try {
        // Fetch problems and user answers
        const [problemsResponse, userAnswersResponse] = await Promise.all([
          fetch('/backend/data/problems.json'),
          fetch('/backend/data/user_answers.json')
        ]);
        
        const problemsData = await problemsResponse.json();
        const userAnswersData = await userAnswersResponse.json();

        // Create a map of solved problems
        const solvedProblems = new Set();
        const userAnswers = userAnswersData.answers.user1 || {};
        Object.entries(userAnswers).forEach(([problemId, data]: [string, any]) => {
          if (data.is_correct) {
            solvedProblems.add(problemId);
          }
        });

        // Group problems by topic
        const topicMap = new Map<string, { total: number; solved: number; firstProblemId?: string }>();

        problemsData.problems.forEach((problem: any) => {
          if ((problem.subject || '').toLowerCase() === subject.toLowerCase()) {
            // Extract topic from problem title (e.g., "Vectors Problem 17" -> "Vectors")
            const titleParts = (problem.title || '').split(' ');
            const topic = titleParts[0];
            
            if (!topicMap.has(topic)) {
              topicMap.set(topic, { 
                total: 0, 
                solved: 0,
                firstProblemId: problem.id.toString() 
              });
            }
            
            const stats = topicMap.get(topic)!;
            stats.total++;
            
            if (solvedProblems.has(problem.id.toString())) {
              stats.solved++;
            }
          }
        });

        // Convert map to array and sort by total problems
        const topicStats = Array.from(topicMap.entries()).map(([name, stats]) => ({
          name,
          ...stats
        }));

        setTopics(topicStats);
      } catch (error) {
        console.error('Error fetching topic stats:', error);
      }
    };

    fetchTopicStats();
  }, [subject]);

  const handleTopicClick = (topic: TopicStat) => {
    if (topic.firstProblemId) {
      onTopicSelect(topic.name, subject);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">{subject} Topics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((topic) => (
          <div
            key={topic.name}
            onClick={() => handleTopicClick(topic)}
            className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">{topic.name}</h4>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{topic.solved} / {topic.total}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${(topic.solved / topic.total) * 100}%` }}
              />
            </div>
          </div>
        ))}
        {topics.length === 0 && (
          <p className="text-gray-500 italic col-span-3">No topics found for {subject}</p>
        )}
      </div>
    </div>
  );
}
