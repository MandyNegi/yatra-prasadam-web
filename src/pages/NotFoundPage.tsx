import React from 'react';
import { Link } from 'react-router-dom';
import { Train, Home, Search } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-[#f0ebd9] text-[#1b4332] flex items-center justify-center mx-auto">
        <Train className="w-8 h-8 text-[#1b4332]" />
      </div>
      <div className="space-y-2">
        <span className="font-mono text-sm font-bold text-[#c8963e]">404 ERROR</span>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-gray-900">
          Station Platform Not Found
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          The page or station route you were looking for doesn't exist or has moved to another track.
        </p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1b4332] text-white text-xs font-semibold rounded-xl hover:bg-[#245841]"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <Link
          to="/stations"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-50"
        >
          <Search className="w-4 h-4" />
          <span>Find Stations</span>
        </Link>
      </div>
    </div>
  );
};
