import React from 'react';
import { Menu, X, Mic } from 'lucide-react';

const Navigation = ({ currentPage, setPage, setMenuOpen, menuOpen }) => {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-indigo-600 to-blue-600 p-2 rounded-lg">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              SpeakClear
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => setPage('home')}
              className={`font-medium transition-colors ${
                currentPage === 'home' ? 'text-indigo-600' : 'text-gray-700 hover:text-indigo-600'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setPage('about')}
              className={`font-medium transition-colors ${
                currentPage === 'about' ? 'text-indigo-600' : 'text-gray-700 hover:text-indigo-600'
              }`}
            >
              About
            </button>
            {currentPage !== 'home' && (
              <button
                onClick={() => setPage('home')}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all"
              >
                Back
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-700"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-in fade-in slide-in-from-top-2">
            <button
              onClick={() => { setPage('home'); setMenuOpen(false); }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 rounded-lg transition"
            >
              Home
            </button>
            <button
              onClick={() => { setPage('about'); setMenuOpen(false); }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 rounded-lg transition"
            >
              About
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
