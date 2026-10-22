import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, AlertCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0f281e] text-[#d6cdbe] border-t border-[#1b4332] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#1b4332] border border-[#c8963e] flex items-center justify-center text-[#e9c46a]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M12 2C9.5 7 4 9 4 14a8 8 0 0 0 16 0c0-5-5.5-7-8-12Z" fill="#c8963e" fillOpacity="0.3" />
                  <path d="M12 6c-2 3.5-5.5 5.5-5.5 9a5.5 5.5 0 0 0 11 0c0-3.5-3.5-5.5-5.5-9Z" />
                </svg>
              </div>
              <div>
                <span className="text-xl font-bold text-white font-serif tracking-tight">
                  YatraPrasadam
                </span>
                <p className="text-xs text-[#c8963e]">Prasadam along your journey</p>
              </div>
            </div>

            <p className="text-sm text-[#b5a995] max-w-md leading-relaxed">
              YatraPrasadam is a community discovery platform connecting Indian railway travellers
              with verified Krishna prasadam kitchens, temples, and independent devotee providers.
              Travel in peace with pure, sattvic nourishment.
            </p>

            <div className="flex items-center gap-2 text-xs text-[#d4a373]">
              <Heart className="w-4 h-4 fill-[#d4a373] text-[#d4a373]" />
              <span>Served with bhakti and community seva across Indian Railways.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold text-[#c8963e] uppercase tracking-wider mb-4">
              Explore & Connect
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/stations" className="hover:text-white transition-colors">
                  Find Stations & Junctions
                </Link>
              </li>
              <li>
                <Link to="/become-a-provider" className="hover:text-white transition-colors">
                  Become a Prasadam Provider
                </Link>
              </li>
              <li>
                <Link to="/donate" className="hover:text-[#e9c46a] text-amber-200 transition-colors flex items-center gap-1.5 font-medium">
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  Support Our Seva (Donate)
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Our Seva & Guidelines
                </Link>
              </li>
              <li>
                <Link to="/report" className="hover:text-white transition-colors flex items-center gap-1.5 text-gray-300">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Report Incorrect Information
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Governance */}
          <div>
            <h3 className="text-xs font-semibold text-[#c8963e] uppercase tracking-wider mb-4">
              Governance & Policies
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy & Data Rights
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service & Devotional Code
                </Link>
              </li>
              <li>
                <Link to="/donate" className="hover:text-white transition-colors">
                  Financial Transparency & Dakshina
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1b4332] mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-[#8c806d] gap-4">
          <p>
            &copy; {new Date().getFullYear()} YatraPrasadam. Independent volunteer platform.
            Not affiliated with IRCTC or Indian Railways.{' '}
            <Link to="/admin" className="text-[#3b5e4f] hover:text-[#c8963e] transition-colors ml-1" title="Internal Coordinator Access">
              [Coordinator]
            </Link>
          </p>
          <p className="font-serif italic text-[#c8963e]">
            Hare Krishna Hare Krishna Krishna Krishna Hare Hare • Hare Rama Hare Rama Rama Rama Hare Hare
          </p>
        </div>
      </div>
    </footer>
  );
};
