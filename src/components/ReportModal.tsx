import React, { useState } from 'react';
import type { Provider, ReportReason } from '../types';
import { DataService } from '../services/dataService';
import { AlertCircle, X, CheckCircle } from 'lucide-react';

interface ReportModalProps {
  provider: Provider;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ provider, isOpen, onClose }) => {
  const [reason, setReason] = useState<ReportReason>('incorrect_whatsapp');
  const [description, setDescription] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || description.trim().length < 5) {
      setError('Please provide a brief explanation (at least 5 characters).');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await DataService.submitReport({
        providerId: provider.id,
        providerName: provider.name,
        reason,
        description: description.trim(),
        contactEmail: contactEmail.trim() || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError('Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#e5dec9] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-modal-title"
      >
        <div className="bg-[#1b4332] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-300" />
            <h2 id="report-modal-title" className="font-serif font-bold text-base">
              Report Listing Issue
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-white" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          {submitted ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-gray-900 font-serif">Thank You</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Your report regarding <strong>{provider.name}</strong> has been submitted securely
                to our administrator queue. We investigate all discrepancies to ensure community trust.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-[#1b4332] text-white text-xs font-semibold rounded-lg"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <p className="text-gray-600">
                Help us keep YatraPrasadam trustworthy for fellow railway pilgrims by reporting any
                outdated or inaccurate information.
              </p>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Reason for Report</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as ReportReason)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-[#1b4332] focus:border-[#1b4332]"
                >
                  <option value="incorrect_whatsapp">Incorrect or unreachable WhatsApp number</option>
                  <option value="inactive_provider">Provider is no longer providing service</option>
                  <option value="incorrect_station">Station or platform delivery is incorrect</option>
                  <option value="inaccurate_dietary">Dietary preparation does not match listing</option>
                  <option value="misleading_info">Misleading description or commercial proxy</option>
                  <option value="other">Other listing issue</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Details / Explanation <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what occurred or what detail needs correction..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-[#1b4332] focus:border-[#1b4332]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Your Email (Optional, for admin follow-up)
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-[#1b4332] focus:border-[#1b4332]"
                />
              </div>

              {error && <p className="text-xs text-red-600 bg-red-50 p-2 rounded">{error}</p>}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-lg shadow-xs disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
