import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { Station } from '../types';
import { DataService } from '../services/dataService';
import { useDocumentTitle } from '../utils/seo';
import { Search, MapPin, Train, ArrowRight } from 'lucide-react';

export const StationsPage: React.FC = () => {
  useDocumentTitle({
    title: 'Railway Stations Directory',
    description: 'Browse Indian railway stations to find verified Krishna prasadam, Jain food, and sattvic meal providers.',
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedState, setSelectedState] = useState<string>('all');
  const [stations, setStations] = useState<Station[]>([]);
  const [providerCounts, setProviderCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStationsAndCounts() {
      try {
        setLoading(true);
        const [allStations, allProviders] = await Promise.all([
          DataService.getStations(),
          DataService.getProviders(),
        ]);

        // Calculate count of verified providers for each station
        const counts: Record<string, number> = {};
        allStations.forEach((s) => {
          const stationId = s.id.toLowerCase();
          const stationCode = s.code.toLowerCase();
          const stationCity = s.city.toLowerCase();
          const stationState = s.state.toLowerCase();

          counts[s.id] = allProviders.filter((p) => {
            const stationIds = (p.stationIds || []).map((id) => String(id).toLowerCase());
            const stationCodes = (p.stationCodes || []).map((code) => String(code).toLowerCase());
            const stationNames = (p.stationNames || []).map((name) => String(name).toLowerCase());
            const sameCityState =
              p.city.toLowerCase() === stationCity && p.state.toLowerCase() === stationState;

            return (
              stationIds.includes(stationId) ||
              stationCodes.includes(stationCode) ||
              stationNames.includes(s.name.toLowerCase()) ||
              sameCityState
            );
          }).length;
        });

        setStations(allStations);
        setProviderCounts(counts);
      } catch (err) {
        console.error('Error fetching stations', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStationsAndCounts();
  }, []);

  // Sync url param
  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    if (val.trim()) {
      setSearchParams({ q: val.trim() });
    } else {
      setSearchParams({});
    }
  };

  // Filter stations by search term and state
  const filteredStations = stations.filter((st) => {
    const matchesSearch =
      !searchTerm.trim() ||
      st.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.state.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesState = selectedState === 'all' || st.state === selectedState;

    return matchesSearch && matchesState;
  });

  // Extract unique states for filter
  const states = Array.from(new Set(stations.map((s) => s.state))).sort();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="bg-[#1b4332] text-white rounded-2xl p-6 sm:p-10 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-[#c8963e]">
            Railway Station Directory
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold font-serif">
            Find Prasadam by Railway Station
          </h1>
          <p className="text-xs sm:text-sm text-[#e2d9c8] leading-relaxed">
            Select a station along your journey to view verified prasadam providers, check dietary
            standards, and coordinate delivery on WhatsApp.
          </p>
        </div>

        <Link
          to="/become-a-provider"
          className="shrink-0 px-4 py-2.5 bg-[#c8963e] hover:bg-[#d4a373] text-[#0f281e] font-bold text-xs sm:text-sm rounded-xl transition-colors"
        >
          + Add Your Station Kitchen
        </Link>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-xl border border-[#e5dec9] p-4 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Filter by station name, code (e.g. NDLS, PUNE), city, or state..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#1b4332] focus:border-[#1b4332]"
          />
        </div>

        <div className="sm:w-56">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#1b4332] focus:border-[#1b4332] bg-white text-gray-800"
          >
            <option value="all">All States & Regions</option>
            {states.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stations Grid */}
      {loading ? (
        <div className="py-20 text-center text-sm text-gray-500">
          Loading railway stations directory...
        </div>
      ) : filteredStations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStations.map((station) => {
            const count = providerCounts[station.id] || 0;
            return (
              <Link
                key={station.id}
                to={`/stations/${station.slug}`}
                className="bg-white rounded-xl border border-[#e5dec9] hover:border-[#1b4332] hover:shadow-md p-5 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-[#1b4332] bg-[#f0ebd9] px-2.5 py-1 rounded-md">
                      {station.code}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        count > 0
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {count} {count === 1 ? 'provider' : 'providers'}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-base font-serif group-hover:text-[#1b4332] transition-colors mb-1">
                    {station.name}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <MapPin className="w-3.5 h-3.5 text-[#2d6a4f]" />
                    <span>
                      {station.city}, {station.state}
                    </span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#1b4332] group-hover:text-[#2d6a4f]">
                  <span>Explore prasadam options</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#e5dec9] p-12 text-center space-y-4 max-w-lg mx-auto">
          <Train className="w-12 h-12 text-[#c8963e] mx-auto opacity-70" />
          <h3 className="text-lg font-bold text-gray-900 font-serif">
            No Stations Matching "{searchTerm}"
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            We haven't listed this railway station yet, or there are no active prasadam providers
            registered under this code.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedState('all');
                setSearchParams({});
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Reset Filters
            </button>
            <Link
              to="/become-a-provider"
              className="px-4 py-2 bg-[#1b4332] text-white text-xs font-semibold rounded-lg hover:bg-[#245841]"
            >
              Register as Provider for this Station
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
