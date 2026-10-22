import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Station, Provider, DietaryPreferences, AvailabilityStatus } from '../types';
import { DataService } from '../services/dataService';
import { ProviderCard } from '../components/ProviderCard';
import { DietaryFilterBar } from '../components/DietaryFilterBar';
import { useDocumentTitle } from '../utils/seo';
import { getStationMapUrl } from '../utils/map';
import {
  MapPin,
  Train,
  Share2,
  Check,
  ChevronLeft,
  AlertCircle,
  PlusCircle,
  ExternalLink,
} from 'lucide-react';

export const StationDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [station, setStation] = useState<Station | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useDocumentTitle({
    title: station ? `${station.name} (${station.code}) Prasadam` : 'Station Prasadam',
    description: station
      ? `Discover verified Krishna prasadam and sattvic food at ${station.name} (${station.code}), ${station.city}.`
      : undefined,
  });

  // Filters
  const [dietaryFilters, setDietaryFilters] = useState<DietaryPreferences>({
    krishnaPrasadam: false,
    noOnionGarlic: false,
    jainFriendly: false,
    sattvic: false,
    ekadashiFriendly: false,
  });
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');

  useEffect(() => {
    async function loadStationAndProviders() {
      if (!slug) return;
      try {
        setLoading(true);
        const st = await DataService.getStationBySlug(slug);
        setStation(st);

        if (st) {
          const prvs = await DataService.getProviders({
            stationId: st.id,
            stationCode: st.code,
            dietary: dietaryFilters,
            availability:
              availabilityFilter !== 'all'
                ? (availabilityFilter as AvailabilityStatus)
                : undefined,
          });
          setProviders(prvs);
        }
      } catch (err) {
        console.error('Error loading station detail', err);
      } finally {
        setLoading(false);
      }
    }
    loadStationAndProviders();
  }, [slug, dietaryFilters, availabilityFilter]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-sm text-gray-500">
        Loading station details and prasadam providers...
      </div>
    );
  }

  if (!station) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <Train className="w-12 h-12 text-[#c8963e] mx-auto" />
        <h1 className="text-2xl font-bold text-gray-900 font-serif">Station Not Found</h1>
        <p className="text-sm text-gray-600">
          The station requested ("{slug}") does not exist in our directory or has been deactivated.
        </p>
        <Link
          to="/stations"
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#1b4332] hover:underline"
        >
          &larr; Back to Stations Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link to="/stations" className="hover:text-[#1b4332] flex items-center gap-1">
          <ChevronLeft className="w-3.5 h-3.5" />
          Stations Directory
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">{station.name}</span>
      </div>

      {/* Station Banner Header */}
      <div className="bg-[#1b4332] text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-sm font-bold bg-[#c8963e] text-[#0f281e] px-2.5 py-0.5 rounded-md">
              {station.code}
            </span>
            <span className="text-xs text-[#e2d9c8] uppercase tracking-wider font-semibold">
              Railway Junction
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold font-serif">{station.name}</h1>

          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[#e2d9c8]">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#c8963e]" />
              <span>
                {station.city}, {station.state}
              </span>
            </div>
            <span>•</span>
            <a
              href={getStationMapUrl(station.name, station.city)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#e9c46a] hover:underline"
              title="Open Station Location on Google Maps"
            >
              <span>View Station on Map</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            type="button"
            onClick={handleShare}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Link Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share Station</span>
              </>
            )}
          </button>

          <Link
            to="/become-a-provider"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#c8963e] hover:bg-[#d4a373] text-[#0f281e] text-xs font-bold transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Join as Provider</span>
          </Link>
        </div>
      </div>

      {/* Dietary & Availability Filter Panel */}
      <div className="space-y-4">
        <DietaryFilterBar
          selectedFilters={dietaryFilters}
          onChange={setDietaryFilters}
        />

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-white p-3 rounded-xl border border-[#e5dec9]">
          <span className="font-semibold text-gray-700">
            Showing {providers.length} verified {providers.length === 1 ? 'provider' : 'providers'} for{' '}
            {station.name} ({station.code})
          </span>

          <div className="flex items-center gap-2">
            <span className="text-gray-500">Availability:</span>
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="px-2.5 py-1 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-[#1b4332]"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available</option>
              <option value="limited">Limited Notice</option>
            </select>
          </div>
        </div>
      </div>

      {/* Providers Grid */}
      {providers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {providers.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              currentStationName={station.name}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#e5dec9] p-10 text-center space-y-4 max-w-lg mx-auto">
          <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
          <h2 className="text-base font-bold text-gray-900 font-serif">
            No Providers Match Your Selected Criteria
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            There are currently no verified providers serving {station.name} who fulfill all the
            selected dietary filters.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() =>
                setDietaryFilters({
                  krishnaPrasadam: false,
                  noOnionGarlic: false,
                  jainFriendly: false,
                  sattvic: false,
                  ekadashiFriendly: false,
                })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Clear Dietary Filters
            </button>

            <Link
              to="/become-a-provider"
              className="px-4 py-2 bg-[#1b4332] text-white text-xs font-semibold rounded-lg hover:bg-[#245841]"
            >
              Register a Kitchen for {station.code}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
