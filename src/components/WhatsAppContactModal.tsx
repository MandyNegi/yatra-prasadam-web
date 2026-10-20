import React, { useState } from 'react';
import type { Provider } from '../types';
import {
  buildPrasadamWhatsAppMessage,
  getWhatsAppUrl,
  isValidWhatsAppNumber,
} from '../utils/whatsapp';
import { MessageCircle, X, Send, Clock, AlertTriangle } from 'lucide-react';

interface WhatsAppContactModalProps {
  provider: Provider;
  stationName?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppContactModal: React.FC<WhatsAppContactModalProps> = ({
  provider,
  stationName,
  isOpen,
  onClose,
}) => {
  const [trainNumber, setTrainNumber] = useState('');
  const [journeyDate, setJourneyDate] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [passengersCount, setPassengersCount] = useState('1');
  const [specialNotes, setSpecialNotes] = useState('');

  if (!isOpen) return null;

  // Active dietary tags for this provider
  const dietaryTags: string[] = [];
  if (provider.dietaryPreferences.krishnaPrasadam) dietaryTags.push('Krishna Prasadam');
  if (provider.dietaryPreferences.noOnionGarlic) dietaryTags.push('No Onion No Garlic');
  if (provider.dietaryPreferences.jainFriendly) dietaryTags.push('Jain-Friendly');
  if (provider.dietaryPreferences.sattvic) dietaryTags.push('Sattvic');
  if (provider.dietaryPreferences.ekadashiFriendly) dietaryTags.push('Ekadashi-Friendly');

  const selectedStation =
    stationName ||
    (provider.stationNames && provider.stationNames[0]) ||
    provider.stationCodes[0] ||
    provider.city;

  const messageText = buildPrasadamWhatsAppMessage({
    stationName: selectedStation,
    trainNumber,
    journeyDate,
    arrivalTime,
    passengersCount,
    dietaryRequirements: dietaryTags,
    specialNotes,
  });

  const isValidNumber = isValidWhatsAppNumber(provider.whatsappNumber);
  const waUrl = getWhatsAppUrl(provider.whatsappNumber, messageText);

  const handleOpenWhatsApp = () => {
    if (!waUrl) return;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#e5dec9] overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
      >
        {/* Header */}
        <div className="bg-[#1b4332] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow">
              <MessageCircle className="w-6 h-6 fill-white text-transparent" />
            </div>
            <div>
              <h2 id="contact-modal-title" className="font-serif font-bold text-base sm:text-lg">
                Connect via WhatsApp
              </h2>
              <p className="text-xs text-[#d6cdbe]">
                To: {provider.name} ({provider.city})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white p-1 rounded-lg"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Advance Notice Alert */}
        <div className="bg-amber-50 px-4 py-2.5 border-b border-amber-200 text-amber-900 text-xs flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Advance Notice Required:</strong> Please inform the provider at least{' '}
            <strong>{provider.advanceNoticeHours} hours</strong> before your scheduled arrival.
          </span>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          <p className="text-xs sm:text-sm text-gray-600">
            You can optionally specify your train and journey details below so the devotee receives a
            clear, pre-filled request in WhatsApp.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Train No. / Name (Optional)
              </label>
              <input
                type="text"
                value={trainNumber}
                onChange={(e) => setTrainNumber(e.target.value)}
                placeholder="e.g. 12260 Duronto"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-[#1b4332] focus:border-[#1b4332]"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Date of Journey (Optional)
              </label>
              <input
                type="date"
                value={journeyDate}
                onChange={(e) => setJourneyDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-[#1b4332] focus:border-[#1b4332]"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Arrival Time at Station (Optional)
              </label>
              <input
                type="text"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                placeholder="e.g. 02:45 PM"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-[#1b4332] focus:border-[#1b4332]"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Number of People (Optional)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={passengersCount}
                onChange={(e) => setPassengersCount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-[#1b4332] focus:border-[#1b4332]"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1 text-xs">
              Special Dietary / Delivery Notes (Optional)
            </label>
            <input
              type="text"
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              placeholder="e.g. Jain preparation required, Coach B4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-[#1b4332] focus:border-[#1b4332]"
            />
          </div>

          {/* Message Preview Box */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              WhatsApp Message Preview:
            </label>
            <div className="bg-[#fcfaf6] border border-[#e5dec9] p-3 rounded-xl text-xs text-gray-800 font-mono whitespace-pre-line max-h-36 overflow-y-auto">
              {messageText}
            </div>
          </div>

          {/* Safe disclaimer */}
          <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 text-[11px] text-gray-600 space-y-1">
            <div className="font-semibold text-gray-700 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Devotional Coordination Protocol:</span>
            </div>
            <p>
              Sending this message does not guarantee prasadam availability. The final confirmation
              and delivery logistics must be mutually agreed upon with the provider on WhatsApp.
              YatraPrasadam does not accept payments or assume liability for train delays.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-gray-50 px-4 sm:px-5 py-3 border-t border-gray-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            Cancel
          </button>

          {isValidNumber && waUrl ? (
            <button
              type="button"
              onClick={handleOpenWhatsApp}
              className="px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Open in WhatsApp</span>
            </button>
          ) : (
            <span className="text-xs text-red-600 font-medium">
              Invalid or unlisted contact number
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
