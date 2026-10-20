import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Provider } from '../types';
import { DataService } from '../services/dataService';
import { WhatsAppContactModal } from '../components/WhatsAppContactModal';
import { ReportModal } from '../components/ReportModal';
import {
  ShieldCheck,
  Clock,
  MapPin,
  MessageCircle,
  AlertCircle,
  Check,
  Calendar,
  AlertTriangle,
  ChevronLeft,
  Share2,
} from 'lucide-react';

export const ProviderDetailPage: React.FC = () => {
  const { providerId } = useParams<{ providerId: string }>();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadProvider() {
      if (!providerId) return;
      try {
        setLoading(true);
        const p = await DataService.getProviderById(providerId);
        setProvider(p);
      } catch (err) {
        console.error('Error fetching provider', err);
      } finally {
        setLoading(false);
      }
    }
    loadProvider();
  }, [providerId]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-sm text-gray-500">
        Loading provider details...
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-[#c8963e] mx-auto" />
        <h1 className="text-2xl font-bold text-gray-900 font-serif">Provider Not Found</h1>
        <p className="text-sm text-gray-600">
          The requested provider does not exist, or their listing is pending administrative review.
        </p>
        <Link
          to="/stations"
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#1b4332] hover:underline"
        >
          &larr; Return to Stations Directory
        </Link>
      </div>
    );
  }

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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link to="/stations" className="hover:text-[#1b4332] flex items-center gap-1">
          <ChevronLeft className="w-3.5 h-3.5" />
          Stations Directory
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">{provider.name}</span>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl border border-[#e5dec9] shadow-md overflow-hidden">
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-[#1b4332] to-[#2d6a4f] text-white p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0f281e] bg-[#c8963e] px-2.5 py-0.5 rounded">
                  {formatProviderType(provider.providerType)}
                </span>
                {provider.verificationStatus === 'verified' && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-200 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Verified by YatraPrasadam
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-bold font-serif">{provider.name}</h1>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#e2d9c8]">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#c8963e]" />
                  <span>
                    {provider.city}, {provider.state}
                  </span>
                </div>
                <span>•</span>
                <div>
                  Stations:{' '}
                  <span className="font-mono font-bold text-white">
                    {provider.stationCodes.join(', ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Top action buttons */}
            <div className="flex items-center gap-3 self-stretch sm:self-auto">
              <button
                type="button"
                onClick={handleShare}
                className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-colors flex items-center gap-1.5 text-xs"
                title="Share profile link"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
                {copied && <span>Copied</span>}
              </button>

              <button
                type="button"
                onClick={() => setIsContactOpen(true)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm rounded-xl shadow-lg transition-transform hover:scale-[1.02] cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-white text-transparent" />
                <span>Contact on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

        {/* Operational info bar */}
        <div className="bg-[#fbf9f4] border-b border-[#eee7d8] px-6 sm:px-10 py-4 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-700">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">Current Status:</span>
            {provider.availabilityStatus === 'available' ? (
              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-600" /> Available for Advance Orders
              </span>
            ) : (
              <span className="text-amber-700 font-semibold">
                Limited Notice (Confirm on WhatsApp)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#c8963e]" />
            <span>
              <strong>Advance Notice:</strong> Minimum {provider.advanceNoticeHours} hours before train
              arrival
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-500">
            <Calendar className="w-4 h-4 text-[#c8963e]" />
            <span>
              <strong>Schedule:</strong> {provider.serviceDays} ({provider.serviceHours})
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 space-y-8">
          {/* About the service */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 font-serif mb-2">About This Prasadam Seva</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
              {provider.description}
            </p>
          </div>

          {/* Declared Dietary Specifications */}
          <div className="bg-[#fcfaf6] border border-[#e5dec9] rounded-2xl p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 font-serif">
                Explicit Dietary Criteria Declared by Provider
              </h3>
              <p className="text-xs text-gray-500">
                These attributes are certified by the devotee provider during registration and regular
                audits.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div
                className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                  provider.dietaryPreferences.krishnaPrasadam
                    ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                    : 'bg-gray-50 border-gray-200 text-gray-400 opacity-60'
                }`}
              >
                <Check className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Krishna Prasadam</div>
                  <div className="text-[11px] opacity-80">Cooked with devotion and offered before dispatch</div>
                </div>
              </div>

              <div
                className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                  provider.dietaryPreferences.noOnionGarlic
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                    : 'bg-gray-50 border-gray-200 text-gray-400 opacity-60'
                }`}
              >
                <Check className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">No Onion, No Garlic</div>
                  <div className="text-[11px] opacity-80">Strictly excluded from entire kitchen premises</div>
                </div>
              </div>

              <div
                className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                  provider.dietaryPreferences.jainFriendly
                    ? 'bg-blue-50/70 border-blue-200 text-blue-900'
                    : 'bg-gray-50 border-gray-200 text-gray-400 opacity-60'
                }`}
              >
                <Check className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Jain-Friendly Preparation</div>
                  <div className="text-[11px] opacity-80">
                    No root vegetables (potatoes, carrots, etc.) when requested
                  </div>
                </div>
              </div>

              <div
                className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                  provider.dietaryPreferences.sattvic
                    ? 'bg-teal-50/70 border-teal-200 text-teal-900'
                    : 'bg-gray-50 border-gray-200 text-gray-400 opacity-60'
                }`}
              >
                <Check className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Sattvic Aahar Standard</div>
                  <div className="text-[11px] opacity-80">Prepared fresh with pure spices, milk, and ghee</div>
                </div>
              </div>

              <div
                className={`p-3 rounded-xl border flex items-start gap-2.5 sm:col-span-2 ${
                  provider.dietaryPreferences.ekadashiFriendly
                    ? 'bg-purple-50/70 border-purple-200 text-purple-900'
                    : 'bg-gray-50 border-gray-200 text-gray-400 opacity-60'
                }`}
              >
                <Check className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Ekadashi Fast Meals (Grain-Free)</div>
                  <div className="text-[11px] opacity-80">
                    Grain-free vrat items (sabudana, samak, fruit, kuttu) prepared on designated fasting days
                  </div>
                </div>
              </div>
            </div>

            {/* Preparation Notes & Specific Instructions */}
            {provider.dietaryNotes && (
              <div className="pt-3 border-t border-[#e5dec9]">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                  Preparation & Ingredient Notes from Kitchen:
                </h4>
                <p className="text-xs text-gray-700 leading-relaxed bg-white p-3 rounded-xl border border-[#eee7d8]">
                  {provider.dietaryNotes}
                </p>
              </div>
            )}
          </div>

          {/* Devotional Coordination & Safety Notice */}
          <div className="bg-amber-50/80 rounded-2xl p-5 border border-amber-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>Important Devotional Coordination Note</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              YatraPrasadam is an independent discovery platform. Contacting a devotee provider via
              WhatsApp initiates a mutual conversation, but does not constitute a guaranteed booking
              until confirmed by the provider. Please confirm train timing, platform accessibility,
              and dakshina/cost directly with the devotee.
            </p>
          </div>

          {/* Bottom Actions Bar */}
          <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setIsReportOpen(true)}
              className="text-xs text-gray-500 hover:text-red-700 flex items-center gap-1.5 cursor-pointer"
            >
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span>Report incorrect phone number or inactive service</span>
            </button>

            <button
              type="button"
              onClick={() => setIsContactOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-white text-transparent" />
              <span>Message Provider on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      <WhatsAppContactModal
        provider={provider}
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      <ReportModal
        provider={provider}
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </div>
  );
};
