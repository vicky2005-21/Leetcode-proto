import React from 'react';
import { Menu, User, Trophy, BookOpen, Home, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const getButtonClass = (page: string) => {
    const baseClass = "px-3 py-2 rounded-md text-sm font-medium transition-colors";
    return currentPage === page
      ? `${baseClass} text-indigo-600 bg-indigo-50`
      : `${baseClass} text-gray-700 hover:text-indigo-600`;
  };

  return (
    <nav className="fixed top-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <span className="font-bold text-xl">JEEnius</span>
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => onNavigate('problems')}
                className={getButtonClass('problems')}
              >
                Problems
              </button>
              <button
                onClick={() => onNavigate('contests')}
                className={getButtonClass('contests')}
              >
                <span className="flex items-center">
                  <Award className="h-4 w-4 mr-1" />
                  Contests
                </span>
              </button>
              <button
                onClick={() => onNavigate('topics')}
                className={getButtonClass('topics')}
              >
                Topics
              </button>
              <button
                onClick={() => onNavigate('leaderboard')}
                className={getButtonClass('leaderboard')}
              >
                <span className="flex items-center">
                  <Trophy className="h-4 w-4 mr-1" />
                  Leaderboard
                </span>
              </button>
              <button
                onClick={() => onNavigate('about')}
                className={getButtonClass('about')}
              >
                About
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => onNavigate('profile')}
              className={`flex items-center space-x-2 ${getButtonClass('profile')}`}
            >
              <User className="h-5 w-5" />
              <span className="hidden md:inline">Profile</span>
            </button>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
              Sign In
            </button>
            <button className="md:hidden">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}