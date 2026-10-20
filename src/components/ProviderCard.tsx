import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Provider } from '../types';
import { WhatsAppContactModal } from './WhatsAppContactModal';
import { ReportModal } from './ReportModal';
import {
  ShieldCheck,
  Clock,
  MapPin,
  MessageCircle,
  AlertCircle,
  Check,
} from 'lucide-react';

interface ProviderCardProps {
  provider: Provider;
  currentStationName?: string;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({
  provider,
  currentStationName,
}) => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Status visual mapping
  const getAvailabilityBadge = () => {
    switch (provider.availabilityStatus) {
      case 'available':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            Available
          </span>
        );
      case 'limited':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            Limited Notice
          </span>
        );
      case 'unavailable':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
            Unavailable
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
            Confirm on WhatsApp
          </span>
        );
    }
  };

  const formatProviderType = (type: Provider['providerType']) => {
    switch (type) {
      case 'temple':
        return 'Temple Prasadam Seva';
      case 'devotee_kitchen':
        return 'Devotee Seva Kitchen';
      case 'ashram_math':
        return 'Ashram / Math Seva';
      case 'individual_devotee':
        return 'Independent Sevadar';
      default:
        return 'Prasadam Provider';
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-[#e5dec9] shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
        <div className="p-5 sm:p-6 space-y-4">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1b4332] bg-[#f0ebd9] px-2 py-0.5 rounded">
                  {formatProviderType(provider.providerType)}
                </span>

                {provider.verificationStatus === 'verified' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Listing
                  </span>
                )}
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-gray-900 font-serif leading-tight">
                <Link
                  to={`/providers/${provider.id}`}
                  className="hover:text-[#1b4332] transition-colors"
                >
                  {provider.name}
                </Link>
              </h3>

              <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#2d6a4f]" />
                <span>
                  {provider.city}, {provider.state}
                </span>
                <span className="text-gray-300">•</span>
                <span className="font-mono text-gray-700 font-medium">
                  {provider.stationCodes.join(', ')}
                </span>
              </div>
            </div>

            <div className="shrink-0">{getAvailabilityBadge()}</div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {provider.description}
          </p>

          {/* Explicit Dietary Preferences Badges */}
          <div>
            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Declared Dietary Criteria:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {provider.dietaryPreferences.krishnaPrasadam && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-900 border border-amber-200">
                  <Check className="w-3 h-3 text-amber-700" />
                  Krishna Prasadam
                </span>
              )}
              {provider.dietaryPreferences.noOnionGarlic && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-900 border border-emerald-200">
                  <Check className="w-3 h-3 text-emerald-700" />
                  No Onion / Garlic
                </span>
              )}
              {provider.dietaryPreferences.jainFriendly && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-900 border border-blue-200">
                  <Check className="w-3 h-3 text-blue-700" />
                  Jain-Friendly
                </span>
              )}
              {provider.dietaryPreferences.sattvic && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-teal-50 text-teal-900 border border-teal-200">
                  <Check className="w-3 h-3 text-teal-700" />
                  Sattvic
                </span>
              )}
              {provider.dietaryPreferences.ekadashiFriendly && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-purple-50 text-purple-900 border border-purple-200">
                  <Check className="w-3 h-3 text-purple-700" />
                  Ekadashi Fast Options
                </span>
              )}
            </div>
          </div>

          {/* Operational timing */}
          <div className="bg-[#fbf9f4] p-2.5 rounded-xl border border-[#eee7d8] flex flex-wrap items-center justify-between text-xs text-gray-700 gap-2">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#c8963e]" />
              <span>
                <strong>Notice:</strong> {provider.advanceNoticeHours}h advance
              </span>
            </div>
            <div className="text-gray-500">
              {provider.serviceDays} • {provider.serviceHours}
            </div>
          </div>
        </div>

        {/* Card Footer actions */}
        <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setIsReportOpen(true)}
            className="text-[11px] text-gray-400 hover:text-red-700 flex items-center gap-1 transition-colors cursor-pointer"
            title="Report inaccurate info"
          >
            <AlertCircle className="w-3 h-3" />
            <span>Report</span>
          </button>

          <div className="flex items-center gap-2">
            <Link
              to={`/providers/${provider.id}`}
              className="text-xs font-semibold text-[#1b4332] hover:text-[#2d6a4f] px-3 py-1.5 rounded-lg border border-gray-200 hover:border-[#1b4332] bg-white transition-colors"
            >
              Details
            </Link>

            <button
              type="button"
              onClick={() => setIsContactOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white text-transparent" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      <WhatsAppContactModal
        provider={provider}
        stationName={currentStationName}
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      <ReportModal
        provider={provider}
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </>
  );
};
