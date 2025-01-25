import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Problem } from '../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  BookOpen, 
  Code, 
  Database, 
  Terminal, 
  Layers, 
  FileCode, 
  Star, 
  Zap, 
  Brain, 
  Calculator, 
  Camera, 
  Video, 
  Upload 
} from 'lucide-react';

interface ProblemListProps {
  onProblemSelect?: (id: string) => void;
  selectedTopic: string | null;
  selectedSubject: string | null;
}

const subjects = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    icon: <Calculator className="w-5 h-5" />,
    topics: ['Calculus', 'Algebra', 'Vectors', 'Trigonometry', 'Probability']
  },
  {
    id: 'physics',
    name: 'Physics',
    icon: <Zap className="w-5 h-5" />,
    topics: ['Mechanics', 'Optics', 'Thermodynamics', 'Modern Physics', 'Electrostatics']
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    icon: <Database className="w-5 h-5" />,
    topics: ['Organic', 'Inorganic', 'Physical', 'Coordination', 'Equilibrium']
  }
];

const studyPlans = [
  {
    id: 'top150',
    title: 'Top Interview 150',
    description: 'Must-do List for Interview Prep',
    icon: <Star className="w-12 h-12 text-yellow-500" />,
    progress: 45,
    total: 150
  },
  {
    id: 'physics75',
    title: 'Physics Mastery',
    description: 'Master Physics in 75 Questions',
    icon: <Code className="w-12 h-12 text-purple-500" />,
    progress: 30,
    total: 75
  },
  {
    id: 'chemistry50',
    title: 'Chemistry Prep',
    description: 'Essential Chemistry in 50 Questions',
    icon: <Database className="w-12 h-12 text-green-500" />,
    progress: 20,
    total: 50
  }
];

const styles = {
  hideScrollbar: {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    '-ms-overflow-style': 'none',
    scrollbarWidth: 'none',
  },
  pbSafe: {
    paddingBottom: 'env(safe-area-inset-bottom, 1rem)',
  },
};

export default function ProblemList({ onProblemSelect, selectedTopic, selectedSubject }: ProblemListProps) {
  const navigate = useNavigate();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [showOnlyUnsolved, setShowOnlyUnsolved] = useState(false);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [captureType, setCaptureType] = useState<'photo' | 'video' | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const itemsPerPage = 50;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [problemsResponse, userAnswersResponse] = await Promise.all([
          fetch('/backend/data/problems.json'),
          fetch('/backend/data/user_answers.json')
        ]);
        
        const problemsData = await problemsResponse.json();
        const userAnswersData = await userAnswersResponse.json();
        
        setProblems(problemsData.problems || []);
        setUserAnswers(userAnswersData.answers?.user1 || {});
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Calculate solved and unsolved counts
  const solvedCount = problems.filter(problem => userAnswers[problem.id]?.is_correct).length;
  const unsolvedCount = problems.length - solvedCount;

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = !selectedDifficulty || problem.difficulty === selectedDifficulty;
    const matchesSubject = !activeSubject || 
      (problem.subject || '').toLowerCase() === activeSubject.toLowerCase();
    const matchesTopic = !activeTopic || 
      (problem.title || '').toLowerCase().includes(activeTopic.toLowerCase());
    const matchesSolvedStatus = showOnlyUnsolved ? !userAnswers[problem.id]?.is_correct : true;
    return matchesSearch && matchesDifficulty && matchesSubject && matchesTopic && matchesSolvedStatus;
  });

  const handleTopicSelect = (topic: string, subject: string) => {
    setActiveTopic(topic);
    setActiveSubject(subject);
  };

  const progressStats = {
    total: filteredProblems.length,
    solved: filteredProblems.filter(p => userAnswers[p.id]?.is_correct).length,
    easy: {
      total: filteredProblems.filter(p => p.difficulty === 'Easy').length,
      solved: filteredProblems.filter(p => p.difficulty === 'Easy' && userAnswers[p.id]?.is_correct).length,
    },
    medium: {
      total: filteredProblems.filter(p => p.difficulty === 'Medium').length,
      solved: filteredProblems.filter(p => p.difficulty === 'Medium' && userAnswers[p.id]?.is_correct).length,
    },
    hard: {
      total: filteredProblems.filter(p => p.difficulty === 'Hard').length,
      solved: filteredProblems.filter(p => p.difficulty === 'Hard' && userAnswers[p.id]?.is_correct).length,
    }
  };

  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProblems = filteredProblems.slice(startIndex, startIndex + itemsPerPage);

  const startCamera = async (type: 'photo' | 'video') => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: type === 'video'
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      
      streamRef.current = stream;
      setCaptureType(type);
      setIsCameraOpen(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please make sure you have granted camera permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
    setCaptureType(null);
    setIsRecording(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      const photoUrl = canvas.toDataURL('image/jpeg');
      setMediaPreview(photoUrl);
      stopCamera();
    }
  };

  const toggleRecording = () => {
    if (!isRecording && streamRef.current) {
      const mediaRecorder = new MediaRecorder(streamRef.current);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        setMediaPreview(videoUrl);
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } else if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopCamera();
    }
  };

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMediaPreview(url);
    }
  };

  const handleProblemClick = (problemId: string) => {
    if (onProblemSelect) {
      onProblemSelect(problemId);
    } else {
      navigate(`/problems/${problemId}`);
    }
  };

  const goToNextProblem = () => {
    if (currentProblemIndex < filteredProblems.length - 1) {
      setCurrentProblemIndex(currentProblemIndex + 1);
      const nextProblem = filteredProblems[currentProblemIndex + 1];
      if (nextProblem && onProblemSelect) {
        onProblemSelect(nextProblem.id);
      }
    }
  };

  const goToPreviousProblem = () => {
    if (currentProblemIndex > 0) {
      setCurrentProblemIndex(currentProblemIndex - 1);
      const prevProblem = filteredProblems[currentProblemIndex - 1];
      if (prevProblem && onProblemSelect) {
        onProblemSelect(prevProblem.id);
      }
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Study Plans Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Study Plans</h2>
            <button className="text-primary hover:text-primary-dark font-medium">View All Plans</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {studyPlans.map(plan => (
              <div key={plan.id} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-gray-50 rounded-lg">
                    {plan.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-medium text-gray-900 truncate">{plan.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{plan.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{Math.round((plan.progress / plan.total) * 100)}% Complete</span>
                      <span className="text-primary">{plan.progress}/{plan.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1.5">
                      <div
                        className="bg-primary h-1.5 rounded-full transition-all"
                        style={{ width: `${(plan.progress / plan.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">Overall Progress</h3>
            <div className="mt-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Solved</span>
                <span>{progressStats.solved} / {progressStats.total}</span>
              </div>
              <div className="mt-2 h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 bg-green-500 rounded-full"
                  style={{ width: `${(progressStats.solved / progressStats.total) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {(['easy', 'medium', 'hard'] as const).map((difficulty) => (
            <div key={difficulty} className="bg-white p-4 rounded-xl shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 capitalize">{difficulty}</h3>
              <div className="mt-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Solved</span>
                  <span>
                    {progressStats[difficulty].solved} / {progressStats[difficulty].total}
                  </span>
                </div>
                <div className="mt-2 h-2 bg-gray-200 rounded-full">
                  <div 
                    className={`h-2 rounded-full ${
                      difficulty === 'easy' ? 'bg-green-500' :
                      difficulty === 'medium' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ 
                      width: `${(progressStats[difficulty].solved / progressStats[difficulty].total) * 100}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Filters */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Filters</h2>
          
          {/* Subject Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => {
                setActiveSubject(null);
                setActiveTopic(null);
              }}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg border transition-all
                ${!activeSubject
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-gray-200 text-gray-600 hover:border-blue-500 hover:text-blue-600'
                }
              `}
            >
              <Layers className="w-5 h-5" />
              <span>All Subjects</span>
            </button>

            {subjects.map(subject => (
              <button
                key={subject.id}
                onClick={() => {
                  setActiveSubject(subject.id);
                  setActiveTopic(null);
                }}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg border transition-all
                  ${activeSubject === subject.id && !activeTopic
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-200 text-gray-600 hover:border-blue-500 hover:text-blue-600'
                  }
                `}
              >
                {subject.icon}
                <span>All {subject.name}</span>
              </button>
            ))}
          </div>

          {/* Popular Topics Carousel */}
          <div className="relative">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Popular Topics</h3>
            
            {/* Scroll Shadow Indicators */}
            <div className="absolute left-0 top-[40px] bottom-4 w-8 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="absolute right-0 top-[40px] bottom-4 w-8 bg-gradient-to-l from-white to-transparent z-10" />
            
            {/* Scrollable Topics */}
            <div className="hide-scrollbar overflow-x-auto pb-4">
              <div className="flex gap-2 min-w-min">
                {subjects.flatMap(subject => 
                  subject.topics.map(topic => (
                    <button
                      key={`${subject.id}-${topic}`}
                      onClick={() => handleTopicSelect(topic, subject.name)}
                      className={`
                        flex-none px-4 py-2 rounded-lg border text-sm transition-all
                        ${activeTopic === topic
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-gray-200 hover:border-blue-500 hover:text-blue-600'
                        }
                        ${activeTopic === topic ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          subject.id === 'mathematics' ? 'bg-blue-500' :
                          subject.id === 'physics' ? 'bg-green-500' :
                          subject.id === 'chemistry' ? 'bg-yellow-500' :
                          'bg-purple-500'
                        }`} />
                        {topic}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Mobile Subject/Topic Selector */}
            <div className="sm:hidden">
              <button
                onClick={() => setIsMobileDrawerOpen(true)}
                className="w-full px-4 py-2.5 bg-gray-50 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-2 truncate">
                  <BookOpen className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="font-medium truncate">
                    {activeTopic 
                      ? `${activeSubject}: ${activeTopic}`
                      : activeSubject
                      ? `All ${subjects.find(s => s.id === activeSubject)?.name}`
                      : 'Select Subject/Topic'
                    }
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </button>
            </div>

            {/* Desktop Subject/Topic Selector */}
            <div className="hidden sm:flex flex-1 items-center gap-3">
              <select
                value={activeSubject || ''}
                onChange={(e) => {
                  setActiveSubject(e.target.value || null);
                  setActiveTopic(null);
                }}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </select>
              {activeSubject && (
                <select
                  value={activeTopic || ''}
                  onChange={(e) => setActiveTopic(e.target.value || null)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Topics</option>
                  {subjects.find(s => s.id === activeSubject)?.topics.map(topic => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex flex-1 sm:flex-none gap-4 items-center">
              <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setShowOnlyUnsolved(false)}
                  className={`px-4 py-1.5 text-sm rounded-md transition-all ${
                    !showOnlyUnsolved 
                      ? 'bg-white text-indigo-700 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All ({solvedCount + unsolvedCount})
                </button>
                <button
                  onClick={() => setShowOnlyUnsolved(true)}
                  className={`px-4 py-1.5 text-sm rounded-md transition-all ${
                    showOnlyUnsolved 
                      ? 'bg-white text-indigo-700 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Unsolved ({unsolvedCount})
                </button>
              </div>
              <div className="relative flex-1 max-w-2xl">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Search problems..."
                />
              </div>
              <select
                value={selectedDifficulty || ''}
                onChange={(e) => setSelectedDifficulty(e.target.value || null)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
        </div>

        {/* Problems Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Success Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayedProblems.map((problem) => (
                  <tr 
                    key={problem.id}
                    onClick={() => handleProblemClick(problem.id.toString())}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`h-2.5 w-2.5 rounded-full ${
                          userAnswers[problem.id]?.is_correct ? 'bg-green-500' : 'bg-gray-300'
                        }`}></span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {problem.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {problem.success_rate ? `${Math.round(problem.success_rate * 100)}%` : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredProblems.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No problems found
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 bg-white">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min((currentPage) * itemsPerPage, filteredProblems.length)} of{' '}
              {filteredProblems.length} results
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {/* Mobile Dropdown */}
            <select
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
              className="md:hidden px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {[...Array(totalPages)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  Page {i + 1}
                </option>
              ))}
            </select>
            
            {/* Desktop Pagination */}
            <div className="hidden md:flex items-center gap-2">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                const isVisible = 
                  pageNum === 1 || 
                  pageNum === totalPages || 
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);
                
                if (!isVisible) {
                  if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                    return <span key={pageNum}>...</span>;
                  }
                  return null;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded-lg ${
                      currentPage === pageNum
                        ? 'bg-blue-500 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="fixed bottom-4 right-4 flex gap-2">
          <button
            onClick={goToPreviousProblem}
            disabled={currentProblemIndex === 0}
            className="p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNextProblem}
            disabled={currentProblemIndex === filteredProblems.length - 1}
            className="p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Media Upload Options */}
        <div className="flex items-center gap-4 ml-4">
          <button
            onClick={() => startCamera('photo')}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            title="Take Photo"
          >
            <Camera className="w-5 h-5" />
          </button>
          <button
            onClick={() => startCamera('video')}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            title="Record Video"
          >
            <Video className="w-5 h-5" />
          </button>
          <label className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 cursor-pointer" title="Upload Media">
            <Upload className="w-5 h-5" />
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleMediaUpload}
            />
          </label>
        </div>

        {/* Camera Interface */}
        {isCameraOpen && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg max-w-3xl w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {captureType === 'photo' ? 'Take Photo' : 'Record Video'}
                </h3>
                <button
                  onClick={stopCamera}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  ×
                </button>
              </div>
              
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ transform: 'scaleX(-1)' }} // Mirror the camera view
                />
                {isRecording && (
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    Recording
                  </div>
                )}
              </div>

              <div className="flex justify-center gap-4">
                {captureType === 'photo' ? (
                  <button
                    onClick={capturePhoto}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    <Camera className="w-5 h-5" />
                    Capture Photo
                  </button>
                ) : (
                  <button
                    onClick={toggleRecording}
                    className={`px-6 py-3 ${
                      isRecording 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    } text-white rounded-lg transition-colors flex items-center gap-2`}
                  >
                    {isRecording ? (
                      <>
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Video className="w-5 h-5" />
                        Start Recording
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={stopCamera}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Media Preview Modal */}
        {mediaPreview && !isCameraOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg max-w-2xl max-h-[80vh] overflow-auto">
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => setMediaPreview(null)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  ×
                </button>
              </div>
              {mediaPreview.startsWith('data:video') || mediaPreview.includes('video') ? (
                <video src={mediaPreview} controls className="max-w-full" />
              ) : (
                <img src={mediaPreview} alt="Preview" className="max-w-full" />
              )}
            </div>
          </div>
        )}

        {/* Mobile Drawer */}
        <div className={`
          fixed inset-0 bg-black/50 z-50 transition-opacity duration-300
          ${isMobileDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}>
          <div className={`
            fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50
            transform transition-transform duration-300 ease-out
            ${isMobileDrawerOpen ? 'translate-y-0' : 'translate-y-full'}
          `}>
            <div className="flex justify-center p-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>
            
            <div className="px-4 py-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Subject & Topic</h3>
              
              {/* Subjects */}
              <div className="space-y-4">
                {subjects.map((subject) => (
                  <div key={subject.id}>
                    <button
                      onClick={() => {
                        setActiveSubject(subject.id);
                        setActiveTopic(null);
                        setIsMobileDrawerOpen(false);
                      }}
                      className={`
                        w-full flex items-center justify-between p-3 rounded-lg border mb-2
                        ${activeSubject === subject.id && !activeTopic
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-gray-200'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2">
                        {subject.icon}
                        <span>All {subject.name}</span>
                      </div>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    
                    {/* Topics */}
                    <div className="grid grid-cols-2 gap-2 pl-8">
                      {subject.topics.map((topic) => (
                        <button
                          key={topic}
                          onClick={() => {
                            handleTopicSelect(topic, subject.name);
                            setIsMobileDrawerOpen(false);
                          }}
                          className={`
                            p-2 rounded-lg border text-left text-sm
                            ${activeTopic === topic
                              ? 'border-blue-500 bg-blue-50 text-blue-600'
                              : 'border-gray-200'
                            }
                          `}
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <style>
          {`
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .hide-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            .pb-safe {
              padding-bottom: env(safe-area-inset-bottom, 1rem);
            }
          `}
        </style>
      </div>
    </>
  );
}
