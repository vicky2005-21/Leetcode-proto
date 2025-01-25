import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import ProblemList from './components/ProblemList';
import ProblemDetail from './components/ProblemDetail';
import Leaderboard from './components/Leaderboard';
import About from './components/About';
import Topics from './components/Topics';
import Profile from './components/Profile';
import Contests from './components/Contests';
import FeaturedProblems from './components/FeaturedProblems';
import SubmissionHistory from './components/SubmissionHistory';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleStartPracticing = () => {
    navigate('/problems');
  };

  const handleExploreTopics = () => {
    navigate('/topics');
  };

  const handleProblemSelect = (id: string) => {
    navigate(`/problems/${id}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/') return '';
    if (path.startsWith('/problems/')) return 'problem';
    return path.slice(1); // Remove leading slash
  };

  const handleNavigate = (page: string) => {
    if (page === 'home') {
      navigate('/');
    } else {
      navigate(`/${page}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPage={getCurrentPage()} onNavigate={handleNavigate} />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={
            <div className="space-y-0">
              <Hero 
                onStartPracticing={handleStartPracticing} 
                onExploreTopics={handleExploreTopics} 
              />
              <Dashboard />
              <div className="py-12">
                <FeaturedProblems onProblemSelect={handleProblemSelect} />
              </div>
              <div className="bg-gray-100 py-12">
                <Leaderboard />
              </div>
            </div>
          } />
          <Route 
            path="/problems" 
            element={
              <div className="max-w-7xl mx-auto px-4 py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">All Problems</h2>
                <ProblemList onProblemSelect={handleProblemSelect} />
              </div>
            } 
          />
          <Route path="/problems/:id" element={<ProblemDetail onBack={handleBack} />} />
          <Route path="/topics" element={<Topics onNavigate={(page) => handleNavigate(page)} onBack={handleBack} />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/leaderboard" element={<div className="py-12"><Leaderboard /></div>} />
          <Route path="/contests" element={<Contests />} />
          <Route path="/submissions" element={<SubmissionHistory />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;