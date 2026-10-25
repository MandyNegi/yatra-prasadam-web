import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Find Prasadam', path: '/stations' },
    { name: 'Become a Provider', path: '/become-a-provider' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#1b4332] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo & Name */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#c8963e] rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-full bg-[#2d6a4f] border border-[#c8963e] flex items-center justify-center text-[#e9c46a] shadow-inner group-hover:scale-105 transition-transform">
              {/* Devotional Lotus Symbol (SVG) */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-[#f3efe6]"
              >
                <path d="M12 2C9.5 7 4 9 4 14a8 8 0 0 0 16 0c0-5-5.5-7-8-12Z" fill="#c8963e" fillOpacity="0.3" />
                <path d="M12 6c-2 3.5-5.5 5.5-5.5 9a5.5 5.5 0 0 0 11 0c0-3.5-3.5-5.5-5.5-9Z" />
                <path d="M12 11c-.8 1.5-2.2 2.5-2.2 4a2.2 2.2 0 0 0 4.4 0c0-1.5-1.4-2.5-2.2-4Z" fill="#e9c46a" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1 font-serif">
                YatraPrasadam
              </span>
              <span className="text-[11px] block text-[#e2d9c8] font-normal tracking-wide">
                Prasadam along your journey
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-[#2d6a4f] text-[#fbf9f4] font-semibold border-b-2 border-[#c8963e]'
                    : 'text-[#e2d9c8] hover:bg-[#245841] hover:text-white'
                }`}
              >
                <span>{link.name}</span>
              </Link>
            ))}

            <Link
              to="/stations"
              className="ml-3 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-semibold rounded-lg text-[#0f281e] bg-[#c8963e] hover:bg-[#d4a373] shadow-sm transition-colors"
            >
              Find Prasadam
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/stations"
              className="px-3 py-1.5 text-xs font-semibold rounded-md text-[#0f281e] bg-[#c8963e]"
            >
              Search
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#e2d9c8] hover:text-white hover:bg-[#2d6a4f] focus:outline-none focus:ring-2 focus:ring-[#c8963e]"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#16382a] border-t border-[#2d6a4f] px-4 pt-2 pb-5 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive(link.path)
                  ? 'bg-[#2d6a4f] text-white font-semibold'
                  : 'text-[#e2d9c8] hover:bg-[#245841] hover:text-white'
              }`}
            >
              <span>{link.name}</span>
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
