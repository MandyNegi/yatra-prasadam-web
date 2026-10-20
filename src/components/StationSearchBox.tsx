import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, X, ArrowRight } from 'lucide-react';
import type { Station } from '../types';
import { DataService } from '../services/dataService';

interface StationSearchBoxProps {
  placeholder?: string;
  className?: string;
  onSelectStation?: (station: Station) => void;
  autoFocus?: boolean;
}

export const StationSearchBox: React.FC<StationSearchBoxProps> = ({
  placeholder = 'Search station name or station code (e.g. Pune, NDLS, MTJ, Varanasi)...',
  className = '',
  onSelectStation,
  autoFocus = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Station[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const matches = await DataService.searchStations(searchTerm);
        setSuggestions(matches.slice(0, 6));
        setIsOpen(true);
      } catch (err) {
        console.error('Station search error', err);
      } finally {
        setLoading(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSelect = (station: Station) => {
    setSearchTerm(`${station.name} (${station.code})`);
    setIsOpen(false);
    if (onSelectStation) {
      onSelectStation(station);
    } else {
      navigate(`/stations/${station.slug}`);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    // If there's an exact or top match
    if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
    } else {
      // Navigate to general search on stations page
      navigate(`/stations?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form onSubmit={handleFormSubmit} className="relative flex items-center">
        <div className="absolute left-3.5 sm:left-4.5 text-[#2d6a4f] pointer-events-none">
          <Search className="w-5 h-5 text-[#2d6a4f]" />
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm.trim() && setIsOpen(true)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full pl-11 sm:pl-12 pr-28 py-3.5 sm:py-4 bg-white border-2 border-[#1b4332]/30 rounded-xl text-gray-900 placeholder-gray-500 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#c8963e] focus:border-[#1b4332] shadow-sm transition-all"
        />

        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setSuggestions([]);
              setIsOpen(false);
            }}
            className="absolute right-24 text-gray-400 hover:text-gray-600 p-1"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="submit"
          className="absolute right-2 px-4 py-2 sm:py-2.5 bg-[#1b4332] hover:bg-[#245841] text-white text-xs sm:text-sm font-semibold rounded-lg shadow transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span>Search</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-[#e5dec9] overflow-hidden max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-sm text-gray-500">
              Searching railway stations...
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {suggestions.map((station) => (
                <li key={station.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(station)}
                    className="w-full text-left px-4 py-3 hover:bg-[#fbf9f4] flex items-center justify-between transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#f0ebd9] text-[#1b4332] flex items-center justify-center shrink-0 group-hover:bg-[#1b4332] group-hover:text-white transition-colors">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                          <span>{station.name}</span>
                          <span className="px-1.5 py-0.5 text-xs font-mono bg-[#1b4332]/10 text-[#1b4332] rounded font-bold">
                            {station.code}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {station.city}, {station.state}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-[#c8963e] font-medium hidden sm:inline-block">
                      View Prasadam &rarr;
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">
              No station found matching "{searchTerm}". Try station code like NDLS or PUNE.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
