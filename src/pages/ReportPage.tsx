import React, { useState, useEffect } from 'react';
import type { Provider, ReportReason } from '../types';
import { DataService } from '../services/dataService';
import { CheckCircle, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../utils/seo';

export const ReportPage: React.FC = () => {
  useDocumentTitle({
    title: 'Report Incorrect Information',
    description: 'Submit an issue report regarding outdated numbers or inactive prasadam services.',
  });

  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProviderId, setSelectedProviderId] = useState('');
  const [providerNameText, setProviderNameText] = useState('');
  const [reason, setReason] = useState<ReportReason>('incorrect_whatsapp');
  const [description, setDescription] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    DataService.getProviders().then(setProviders);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || description.trim().length < 5) {
      setError('Please provide a brief description of the issue (at least 5 characters).');
      return;
    }

    const matched = providers.find((p) => p.id === selectedProviderId);
    const resolvedName = matched ? matched.name : providerNameText.trim() || 'General / Unspecified';

    setSubmitting(true);
    setError(null);

    try {
      await DataService.submitReport({
        providerId: selectedProviderId || 'general',
        providerName: resolvedName,
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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-red-700">
          Quality Control & Auditing
        </span>
        <h1 className="text-3xl font-bold font-serif text-gray-900">
          Report Incorrect Information
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          Notice an unreachable phone number, an inactive service, or an inaccurate dietary claim?
          Submit a private report below so our admin team can investigate and rectify the listing.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#e5dec9] p-6 sm:p-10 shadow-sm">
        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle className="w-14 h-14 text-emerald-600 mx-auto" />
            <h2 className="text-2xl font-bold font-serif text-gray-900">Report Received</h2>
            <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
              Hare Krishna! Thank you for helping keep YatraPrasadam authentic and reliable.
              Our administrators have queued your report for prompt verification.
            </p>
            <div className="pt-4">
              <Link
                to="/"
                className="px-5 py-2.5 bg-[#1b4332] text-white text-xs font-semibold rounded-xl hover:bg-[#245841]"
              >
                Return to Home
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Select Provider (If applicable)
              </label>
              <select
                value={selectedProviderId}
                onChange={(e) => setSelectedProviderId(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#1b4332] bg-white"
              >
                <option value="">-- Choose from active providers or enter below --</option>
                {providers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.city} - {p.stationCodes.join(', ')})
                  </option>
                ))}
              </select>
            </div>

            {!selectedProviderId && (
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Or Type Provider / Station Name
                </label>
                <input
                  type="text"
                  value={providerNameText}
                  onChange={(e) => setProviderNameText(e.target.value)}
                  placeholder="e.g. Pune Prasadam Seva"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#1b4332]"
                />
              </div>
            )}

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Reason for Report</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as ReportReason)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#1b4332] bg-white"
              >
                <option value="incorrect_whatsapp">Incorrect or unreachable WhatsApp number</option>
                <option value="inactive_provider">Provider is no longer providing service</option>
                <option value="incorrect_station">Station or platform delivery is inaccurate</option>
                <option value="inaccurate_dietary">Dietary preparation does not match listing</option>
                <option value="misleading_info">Misleading description or commercial proxy</option>
                <option value="other">Other listing issue</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Description of the Issue <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe what happened (e.g. provider stated they no longer serve this train, or phone number was invalid)..."
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#1b4332]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Your Email (Optional, kept strictly private)
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#1b4332]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <Link
                to="/"
                className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Submitting...' : 'Submit Report'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
