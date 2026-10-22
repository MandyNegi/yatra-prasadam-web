import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Station, ProviderType, DietaryPreferences } from '../types';
import { DataService } from '../services/dataService';
import { isValidWhatsAppNumber, normalizeWhatsAppNumber } from '../utils/whatsapp';
import { useDocumentTitle } from '../utils/seo';
import {
  HeartHandshake,
  CheckCircle,
  AlertCircle,
  Send,
} from 'lucide-react';

export const BecomeProviderPage: React.FC = () => {
  useDocumentTitle({
    title: 'Become a Prasadam Provider',
    description: 'Register your temple kitchen or devotee seva group to serve travelling railway devotees.',
  });

  const [existingStations, setExistingStations] = useState<Station[]>([]);

  // Honeypot field for spam prevention
  const [honeypot, setHoneypot] = useState('');

  // Form Fields
  const [applicantName, setApplicantName] = useState('');
  const [providerName, setProviderName] = useState('');
  const [providerType, setProviderType] = useState<ProviderType>('devotee_kitchen');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [selectedStationCodes, setSelectedStationCodes] = useState<string[]>([]);
  const [customStationText, setCustomStationText] = useState('');
  const [serviceDetails, setServiceDetails] = useState('');
  const [serviceDays, setServiceDays] = useState('Daily (Mon - Sun)');
  const [serviceHours, setServiceHours] = useState('08:00 AM - 08:30 PM');
  const [advanceNoticeHours, setAdvanceNoticeHours] = useState(3);

  // Dietary checkboxes
  const [dietaryPreferences, setDietaryPreferences] = useState<DietaryPreferences>({
    krishnaPrasadam: true,
    noOnionGarlic: true,
    jainFriendly: false,
    sattvic: true,
    ekadashiFriendly: false,
  });
  const [dietaryNotes, setDietaryNotes] = useState('');

  // Consents
  const [publicationConsent, setPublicationConsent] = useState(false);
  const [accuracyConfirmed, setAccuracyConfirmed] = useState(false);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    DataService.getAllStations().then(setExistingStations);
  }, []);

  const handleStationToggle = (code: string) => {
    if (selectedStationCodes.includes(code)) {
      setSelectedStationCodes(selectedStationCodes.filter((c) => c !== code));
    } else {
      setSelectedStationCodes([...selectedStationCodes, code]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Spam honeypot detection
    if (honeypot) {
      setSubmitted(true);
      return;
    }

    // Validation
    if (!applicantName.trim() || applicantName.trim().length < 2) {
      setErrorMessage('Please provide your full contact name.');
      return;
    }
    if (!providerName.trim() || providerName.trim().length < 2) {
      setErrorMessage('Please enter the provider or temple name.');
      return;
    }

    const normalizedPhone = normalizeWhatsAppNumber(whatsappNumber);
    if (!isValidWhatsAppNumber(normalizedPhone)) {
      setErrorMessage(
        'Please provide a valid 10-digit Indian mobile number or international WhatsApp number.'
      );
      return;
    }

    if (!city.trim() || !state.trim()) {
      setErrorMessage('Please provide the city and state.');
      return;
    }

    // Stations
    const stationsCombined = [...selectedStationCodes];
    if (customStationText.trim()) {
      const customs = customStationText
        .split(',')
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean);
      stationsCombined.push(...customs);
    }

    if (stationsCombined.length === 0) {
      setErrorMessage('Please select or specify at least one railway station you serve.');
      return;
    }

    if (!serviceDetails.trim() || serviceDetails.trim().length < 10) {
      setErrorMessage('Please provide a brief description of the prasadam and delivery setup.');
      return;
    }

    if (!publicationConsent) {
      setErrorMessage(
        'Please consent to publishing your provider details on the public directory upon approval.'
      );
      return;
    }

    if (!accuracyConfirmed) {
      setErrorMessage('Please confirm that the dietary standards and information provided are true.');
      return;
    }

    setSubmitting(true);

    try {
      const normalizedStationCodes = stationsCombined.map((code) => code.trim().toUpperCase());
      const matchedStationIds = existingStations
        .filter((st) => {
          const stationCode = st.code?.trim().toUpperCase();
          const stationName = st.name?.trim().toUpperCase();
          const cityMatch = st.city?.trim().toLowerCase() === city.trim().toLowerCase();
          const stateMatch = st.state?.trim().toLowerCase() === state.trim().toLowerCase();

          return (
            normalizedStationCodes.includes(stationCode) ||
            normalizedStationCodes.includes(stationName) ||
            (cityMatch && stateMatch)
          );
        })
        .map((st) => st.id);

      await DataService.submitProviderApplication({
        applicantName: applicantName.trim(),
        providerName: providerName.trim(),
        providerType,
        stationIds: Array.from(new Set(matchedStationIds)),
        stationCodes: Array.from(new Set(normalizedStationCodes)),
        city: city.trim(),
        state: state.trim(),
        whatsappNumber: normalizedPhone,
        serviceDetails: serviceDetails.trim(),
        serviceDays: serviceDays.trim(),
        serviceHours: serviceHours.trim(),
        advanceNoticeHours: Number(advanceNoticeHours) || 3,
        dietaryPreferences,
        dietaryNotes: dietaryNotes.trim(),
        publicationConsent: true,
        accuracyConfirmed: true,
      });

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to submit application. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-[#1b4332] text-white rounded-3xl p-6 sm:p-10 shadow-lg space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c8963e]/20 border border-[#c8963e]/30 text-xs font-semibold text-[#f3efe6]">
          <HeartHandshake className="w-3.5 h-3.5 text-[#c8963e]" />
          Devotee Seva Registration
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold font-serif">
          Become a Prasadam Provider
        </h1>
        <p className="text-xs sm:text-base text-[#e2d9c8] leading-relaxed max-w-2xl">
          Register your temple kitchen, devotee group, or individual seva service.
          Help railway passengers maintain devotional eating standards while travelling through your city.
        </p>
      </div>

      {submitted ? (
        <div className="bg-white rounded-3xl border border-[#e5dec9] p-8 sm:p-12 shadow-sm text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold font-serif text-gray-900">
            Application Received in Seva Queue!
          </h2>
          <p className="text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
            Hare Krishna! Thank you for volunteering to serve travelling devotees. Your submission
            has been securely stored with <strong>pending status</strong>. Our admin team will
            verify your details and WhatsApp number before making your listing public.
          </p>

          <div className="p-4 bg-[#fbf9f4] border border-[#eee7d8] rounded-2xl max-w-md mx-auto text-xs text-left space-y-1 text-gray-700">
            <div>
              <strong>Provider Name:</strong> {providerName}
            </div>
            <div>
              <strong>WhatsApp:</strong> +{normalizeWhatsAppNumber(whatsappNumber)}
            </div>
            <div>
              <strong>City:</strong> {city}, {state}
            </div>
            <div>
              <strong>Status:</strong> Pending Administrator Review
            </div>
          </div>

          <div className="pt-4 flex items-center justify-center gap-3">
            <Link
              to="/"
              className="px-5 py-2.5 bg-[#1b4332] text-white text-xs font-semibold rounded-xl hover:bg-[#245841]"
            >
              Back to Home
            </Link>
            <Link
              to="/stations"
              className="px-5 py-2.5 border border-gray-300 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-50"
            >
              Browse Stations
            </Link>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-[#e5dec9] p-6 sm:p-10 shadow-sm space-y-8"
        >
          {/* Honeypot hidden input */}
          <div className="hidden" aria-hidden="true">
            <input
              type="text"
              name="bot_url_trap"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-2">
              <h2 className="text-base font-bold text-gray-900 font-serif">
                1. Contact & Kitchen Identity
              </h2>
              <p className="text-xs text-gray-500">
                Primary contact details for coordination and verification.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Contact Person / Devotee Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="e.g. Mukunda Das"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#1b4332]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Provider or Temple Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={providerName}
                  onChange={(e) => setProviderName(e.target.value)}
                  placeholder="e.g. Sri Krishna Prasadam Seva Trust"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#1b4332]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Provider Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={providerType}
                  onChange={(e) => setProviderType(e.target.value as ProviderType)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#1b4332] bg-white"
                >
                  <option value="devotee_kitchen">Devotee Seva Kitchen (Family / Grihastha)</option>
                  <option value="temple">Registered Temple</option>
                  <option value="ashram_math">Ashram / Math</option>
                  <option value="individual_devotee">Individual Devotee Sevadar</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  WhatsApp Number (For Direct Orders) <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="e.g. 9822012345 or +919822012345"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#1b4332]"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  Passengers will click-to-chat directly with this number.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mathura"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#1b4332]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Uttar Pradesh"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#1b4332]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Railway Stations Served */}
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-2">
              <h2 className="text-base font-bold text-gray-900 font-serif">
                2. Railway Station Delivery Coverage
              </h2>
              <p className="text-xs text-gray-500">
                Select from popular junctions or type specific station codes you serve.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <label className="block font-semibold text-gray-700">
                Choose Stations you can deliver to:
              </label>
              <div className="flex flex-wrap gap-2">
                {existingStations.map((st) => {
                  const selected = selectedStationCodes.includes(st.code);
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => handleStationToggle(st.code)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                        selected
                          ? 'bg-[#1b4332] text-white border-[#1b4332]'
                          : 'bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {st.name} ({st.code})
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="block font-medium text-gray-600 mb-1">
                  Other Station Codes (Comma separated if not listed above)
                </label>
                <input
                  type="text"
                  value={customStationText}
                  onChange={(e) => setCustomStationText(e.target.value)}
                  placeholder="e.g. BPL, GWL, KOTA"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#1b4332] text-xs font-mono uppercase"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Service Schedule & Notice */}
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-2">
              <h2 className="text-base font-bold text-gray-900 font-serif">
                3. Service Timing & Advance Notice
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Operating Days</label>
                <input
                  type="text"
                  value={serviceDays}
                  onChange={(e) => setServiceDays(e.target.value)}
                  placeholder="e.g. Daily, or Mon - Sat"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#1b4332]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Service Hours</label>
                <input
                  type="text"
                  value={serviceHours}
                  onChange={(e) => setServiceHours(e.target.value)}
                  placeholder="e.g. 08:00 AM - 09:30 PM"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#1b4332]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Advance Notice Required (Hours)
                </label>
                <input
                  type="number"
                  min="1"
                  max="48"
                  value={advanceNoticeHours}
                  onChange={(e) => setAdvanceNoticeHours(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#1b4332]"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block font-semibold text-gray-700 mb-1">
                  Service Description & Logistics Setup <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={serviceDetails}
                  onChange={(e) => setServiceDetails(e.target.value)}
                  placeholder="Explain your prasadam offering (e.g. packed thali with rotis, sabji, dal, rice, sweet), and how delivery to the platform or coach gate is handled..."
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#1b4332]"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Explicit Dietary Attributes */}
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-2">
              <h2 className="text-base font-bold text-gray-900 font-serif">
                4. Dietary Standards & Declarations
              </h2>
              <p className="text-xs text-gray-500">
                Check only the standards your kitchen strictly satisfies.
              </p>
            </div>

            <div className="space-y-3 text-xs bg-[#fbf9f4] p-5 rounded-2xl border border-[#eee7d8]">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dietaryPreferences.krishnaPrasadam}
                  onChange={(e) =>
                    setDietaryPreferences({
                      ...dietaryPreferences,
                      krishnaPrasadam: e.target.checked,
                    })
                  }
                  className="w-4 h-4 mt-0.5 rounded text-[#1b4332] focus:ring-[#1b4332]"
                />
                <div>
                  <span className="font-bold text-gray-900">Krishna Prasadam</span>
                  <p className="text-gray-500">
                    All items are cooked with pure devotional consciousness and offered with Tulasi to
                    Lord Krishna.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dietaryPreferences.noOnionGarlic}
                  onChange={(e) =>
                    setDietaryPreferences({
                      ...dietaryPreferences,
                      noOnionGarlic: e.target.checked,
                    })
                  }
                  className="w-4 h-4 mt-0.5 rounded text-[#1b4332] focus:ring-[#1b4332]"
                />
                <div>
                  <span className="font-bold text-gray-900">Strictly No Onion, No Garlic</span>
                  <p className="text-gray-500">
                    No alliums or eggs are used or stored in the preparation area.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dietaryPreferences.jainFriendly}
                  onChange={(e) =>
                    setDietaryPreferences({
                      ...dietaryPreferences,
                      jainFriendly: e.target.checked,
                    })
                  }
                  className="w-4 h-4 mt-0.5 rounded text-[#1b4332] focus:ring-[#1b4332]"
                />
                <div>
                  <span className="font-bold text-gray-900">Jain-Friendly Preparation Available</span>
                  <p className="text-gray-500">
                    Root vegetables (potatoes, carrots, radish, beets) are completely excluded from
                    Jain orders.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dietaryPreferences.sattvic}
                  onChange={(e) =>
                    setDietaryPreferences({
                      ...dietaryPreferences,
                      sattvic: e.target.checked,
                    })
                  }
                  className="w-4 h-4 mt-0.5 rounded text-[#1b4332] focus:ring-[#1b4332]"
                />
                <div>
                  <span className="font-bold text-gray-900">Sattvic Standard</span>
                  <p className="text-gray-500">
                    Fresh ingredients, pure ghee or refined oils, no stale food or chemical additives.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dietaryPreferences.ekadashiFriendly}
                  onChange={(e) =>
                    setDietaryPreferences({
                      ...dietaryPreferences,
                      ekadashiFriendly: e.target.checked,
                    })
                  }
                  className="w-4 h-4 mt-0.5 rounded text-[#1b4332] focus:ring-[#1b4332]"
                />
                <div>
                  <span className="font-bold text-gray-900">Ekadashi Fasting Options</span>
                  <p className="text-gray-500">
                    Grain-free fasting food (sabudana, samak, sendha namak) available on Ekadashi tithis.
                  </p>
                </div>
              </label>

              <div className="pt-3 border-t border-gray-200">
                <label className="block font-semibold text-gray-700 mb-1">
                  Preparation Notes / Specific Details for Pilgrims
                </label>
                <textarea
                  rows={2}
                  value={dietaryNotes}
                  onChange={(e) => setDietaryNotes(e.target.value)}
                  placeholder="Detail cooking fats (e.g. pure cow ghee / mustard oil), specific Jain practices, or special fasting flour used..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#1b4332] bg-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Consent & Submission */}
          <div className="space-y-4 pt-2">
            <div className="space-y-3 text-xs bg-gray-50 p-4 rounded-xl border border-gray-200">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={publicationConsent}
                  onChange={(e) => setPublicationConsent(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-[#1b4332]"
                />
                <span className="text-gray-700">
                  I consent to publishing the kitchen name, city, and WhatsApp contact on the public
                  YatraPrasadam website upon administrator approval.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={accuracyConfirmed}
                  onChange={(e) => setAccuracyConfirmed(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-[#1b4332]"
                />
                <span className="text-gray-700">
                  I confirm that all dietary and service information supplied is true and accurate in
                  the spirit of devotional integrity.
                </span>
              </label>
            </div>

            <div className="pt-2 flex items-center justify-end gap-4">
              <Link
                to="/"
                className="px-4 py-2.5 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-[#1b4332] hover:bg-[#245841] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Submitting Application...' : 'Submit for Review'}</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
