import React from 'react';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../utils/seo';
import { CheckCircle } from 'lucide-react';

export const AboutPage: React.FC = () => {
  useDocumentTitle({
    title: 'About Our Seva',
    description: 'Learn why YatraPrasadam was created to solve the challenge of pure prasadam on Indian Railways.',
  });
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#c8963e]">
          Our Seva & Purpose
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif text-gray-900">
          About YatraPrasadam
        </h1>
        <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Connecting railway pilgrims with pure, loving Krishna prasadam across Indian railway stations.
        </p>
      </div>

      {/* Main Narrative Card */}
      <div className="bg-white rounded-3xl border border-[#e5dec9] p-6 sm:p-10 shadow-sm space-y-6 text-sm sm:text-base text-gray-700 leading-relaxed">
        <h2 className="text-xl font-bold font-serif text-[#1b4332]">
          The Challenge of Devotional Travel
        </h2>
        <p>
          Long-distance train travel across India is a cherished tradition for pilgrims visiting holy
          dhamas like Vrindavan, Varanasi, Puri, Ayodhya, and Tirupati. However, finding wholesome,
          sanctified food on Indian Railways has always posed a major challenge for practicing
          devotees, elderly pilgrims, and families adhering to strict dietary vows.
        </p>
        <p>
          Standard pantry cars and commercial food delivery services frequently mix cookware, use
          alliums (onion and garlic), or lack the sacred sanctity of offered prasadam. Meanwhile,
          countless devotee kitchens and temples situated just a few minutes from major railway
          junctions would gladly prepare fresh prasadam boxes for travelling devotees if only there
          were a simple way to connect.
        </p>

        <h2 className="text-xl font-bold font-serif text-[#1b4332] pt-4">
          Why YatraPrasadam is Different
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm pt-2">
          <div className="bg-[#fbf9f4] p-4 rounded-xl border border-[#eee7d8] space-y-2">
            <div className="font-bold text-gray-900 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-[#1b4332]" />
              <span>Explicit Dietary Rigor</span>
            </div>
            <p className="text-gray-600">
              We never lump dietary practices into a generic "vegetarian" label. We explicitly verify
              and separate Krishna Prasadam, No Onion/Garlic, Jain-compliant cooking, and grain-free
              Ekadashi fasting meals.
            </p>
          </div>

          <div className="bg-[#fbf9f4] p-4 rounded-xl border border-[#eee7d8] space-y-2">
            <div className="font-bold text-gray-900 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-[#1b4332]" />
              <span>Direct WhatsApp Coordination</span>
            </div>
            <p className="text-gray-600">
              No middleman commission, payment processing, or hidden markups. Travellers coordinate
              directly with the kitchen or temple volunteer on WhatsApp with contextual train arrival
              details.
            </p>
          </div>

          <div className="bg-[#fbf9f4] p-4 rounded-xl border border-[#eee7d8] space-y-2">
            <div className="font-bold text-gray-900 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-[#1b4332]" />
              <span>Vetted Devotee Providers</span>
            </div>
            <p className="text-gray-600">
              Every provider application is screened and verified by administrators before being
              published to the public directory.
            </p>
          </div>

          <div className="bg-[#fbf9f4] p-4 rounded-xl border border-[#eee7d8] space-y-2">
            <div className="font-bold text-gray-900 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-[#1b4332]" />
              <span>Seva-First, Non-Commercial Spirit</span>
            </div>
            <p className="text-gray-600">
              We do not take commissions from devotees. Our goal is solely to assist Vaishnava seva
              and ensure no devotee goes hungry or compromises their vows during a train journey.
            </p>
          </div>
        </div>

        {/* Independence Disclaimer */}
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
          <div className="font-bold">Affiliation Disclaimer:</div>
          <p>
            YatraPrasadam is an independent directory. Listing on this platform does not imply that
            every listed provider is an official branch of ISKCON or any specific central trust,
            unless explicitly noted and verified. Each provider operates independently.
          </p>
        </div>
      </div>

      {/* Seva Invitation */}
      <div className="bg-[#1b4332] text-white rounded-3xl p-8 sm:p-10 text-center space-y-4">
        <h2 className="text-2xl font-bold font-serif">Are You Ready to Serve?</h2>
        <p className="text-sm text-[#e2d9c8] max-w-lg mx-auto">
          Whether you run a temple kitchen or can prepare simple prasadam boxes from your home near a
          junction, we welcome your seva.
        </p>
        <Link
          to="/become-a-provider"
          className="inline-block px-6 py-3 bg-[#c8963e] hover:bg-[#d4a373] text-[#0f281e] font-bold text-xs sm:text-sm rounded-xl transition-colors"
        >
          Register as a Prasadam Provider
        </Link>
      </div>
    </div>
  );
};
