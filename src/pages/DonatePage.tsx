import React, { useState } from 'react';
import { useDocumentTitle } from '../utils/seo';
import { Heart, Check, Copy, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DonatePage: React.FC = () => {
  useDocumentTitle({
    title: 'Support Our Seva — Donate',
    description: 'Support YatraPrasadam: A volunteer-run devotional initiative connecting railway passengers with pure Krishna prasadam.',
  });

  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);

  const upiId = 'yatraprasadam@upi'; // Replace with organization/trust UPI ID
  const bankDetails = {
    accountName: 'YatraPrasadam Seva Trust',
    accountNumber: '108108108108',
    ifsc: 'SBIN0001080',
    bankName: 'State Bank of India',
    branch: 'Vrindavan / Central Branch',
  };

  const handleCopyUpi = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    }
  };

  const handleCopyBank = () => {
    if (navigator.clipboard) {
      const details = `Account Name: ${bankDetails.accountName}\nAccount Number: ${bankDetails.accountNumber}\nIFSC: ${bankDetails.ifsc}\nBank: ${bankDetails.bankName}\nBranch: ${bankDetails.branch}`;
      navigator.clipboard.writeText(details);
      setCopiedBank(true);
      setTimeout(() => setCopiedBank(false), 2500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#c8963e]/15 border border-[#c8963e]/30 text-[#1b4332] text-xs font-semibold">
          <Heart className="w-3.5 h-3.5 fill-[#c8963e] text-[#c8963e]" />
          <span>Non-Commercial Devotional Initiative</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold font-serif text-gray-900">
          Support the YatraPrasadam Seva
        </h1>

        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
          YatraPrasadam is operated entirely by volunteers without commercial advertisements,
          sponsored listings, or transaction fees. Your voluntary dakshina keeps our servers running
          and helps expand prasadam discovery to every railway junction in India.
        </p>
      </div>

      {/* How donations are utilized */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#e5dec9] shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#1b4332]/10 text-[#1b4332] flex items-center justify-center font-bold">
            1
          </div>
          <h3 className="font-bold text-gray-900 text-sm">Server & Technology Costs</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Covers domain registration, secure Cloud Firestore database hosting, and high-speed CDN
            services for fast mobile loading.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#e5dec9] shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#1b4332]/10 text-[#1b4332] flex items-center justify-center font-bold">
            2
          </div>
          <h3 className="font-bold text-gray-900 text-sm">Provider Verification & Audits</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Funds phone verifications, kitchen standard audits, and continuous monitoring to keep
            dietary declarations authentic and trustworthy.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#e5dec9] shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#1b4332]/10 text-[#1b4332] flex items-center justify-center font-bold">
            3
          </div>
          <h3 className="font-bold text-gray-900 text-sm">Pilgrim Awareness Outreach</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Helps print seva guide cards and platform flyers distributed at major dham junctions for
            elderly pilgrims without smartphones.
          </p>
        </div>
      </div>

      {/* Contribution Methods Card */}
      <div className="bg-white rounded-3xl border border-[#e5dec9] shadow-md overflow-hidden">
        <div className="bg-[#1b4332] text-white p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold font-serif">Contribution Methods</h2>
          <p className="text-xs sm:text-sm text-[#e2d9c8] mt-1">
            Choose your preferred method to offer seva dakshina directly.
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* Method 1: UPI Transfer */}
          <div className="bg-[#fbf9f4] border border-[#eee7d8] rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#1b4332] bg-[#f0ebd9] px-2.5 py-1 rounded">
                  Method 1: Direct UPI (Instant)
                </span>
                <h3 className="text-lg font-bold text-gray-900 font-serif mt-2">
                  Scan or Pay via any UPI App
                </h3>
                <p className="text-xs text-gray-500">
                  Google Pay, PhonePe, Paytm, BHIM, or any banking UPI app.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold bg-white px-3 py-2 rounded-xl border border-gray-300 text-gray-800">
                  {upiId}
                </span>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="px-3.5 py-2 bg-[#1b4332] text-white rounded-xl text-xs font-semibold hover:bg-[#245841] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedUpi ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy UPI</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Method 2: Direct Bank Transfer (NEFT / IMPS) */}
          <div className="bg-[#fbf9f4] border border-[#eee7d8] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#1b4332] bg-[#f0ebd9] px-2.5 py-1 rounded">
                  Method 2: Bank Transfer (NEFT / IMPS)
                </span>
                <h3 className="text-lg font-bold text-gray-900 font-serif mt-2">
                  Direct Bank Account Details
                </h3>
              </div>

              <button
                type="button"
                onClick={handleCopyBank}
                className="px-3.5 py-2 border border-gray-300 bg-white text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedBank ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied Details!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy All Details</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-4 rounded-xl border border-gray-200">
              <div>
                <span className="text-gray-500 block">Account Name:</span>
                <span className="font-semibold text-gray-900">{bankDetails.accountName}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Account Number:</span>
                <span className="font-mono font-bold text-gray-900">{bankDetails.accountNumber}</span>
              </div>
              <div>
                <span className="text-gray-500 block">IFSC Code:</span>
                <span className="font-mono font-bold text-gray-900">{bankDetails.ifsc}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Bank & Branch:</span>
                <span className="font-semibold text-gray-900">
                  {bankDetails.bankName} ({bankDetails.branch})
                </span>
              </div>
            </div>
          </div>

          {/* Devotional message */}
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#c8963e]" />
              <span>Devotional Gratitude:</span>
            </div>
            <p>
              Every rupee received is dedicated transparently towards keeping prasadam accessible to
              railway travellers. May Sri Sri Radha Krishna shower their blessings upon you and your
              family for supporting this holy seva.
            </p>
          </div>
        </div>
      </div>

      {/* Volunteer Alternative CTA */}
      <div className="bg-gradient-to-r from-[#1b4332] to-[#2d6a4f] text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold font-serif">
            Want to contribute with time instead?
          </h2>
          <p className="text-xs sm:text-sm text-[#e2d9c8] max-w-xl">
            You can also serve by registering your local kitchen, helping verify stations in your state,
            or reporting new devotee kitchens along railway tracks.
          </p>
        </div>

        <Link
          to="/become-a-provider"
          className="shrink-0 px-5 py-3 bg-[#c8963e] hover:bg-[#d4a373] text-[#0f281e] font-bold text-xs sm:text-sm rounded-xl transition-colors"
        >
          Register as Provider &rarr;
        </Link>
      </div>
    </div>
  );
};
