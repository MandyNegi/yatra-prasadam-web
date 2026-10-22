import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StationSearchBox } from '../components/StationSearchBox';
import { DietaryFilterBar } from '../components/DietaryFilterBar';
import { ProviderCard } from '../components/ProviderCard';
import type { Station, Provider, DietaryPreferences } from '../types';
import { DataService } from '../services/dataService';
import { useDocumentTitle } from '../utils/seo';
import {
  HelpCircle,
  MapPin,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  useDocumentTitle({
    title: 'Prasadam along your journey',
    description: 'Find pure Krishna prasadam, connect directly with devotee kitchens, and travel with devotion across Indian Railways.',
  });

  const [stations, setStations] = useState<Station[]>([]);
  const [featuredProviders, setFeaturedProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  const [dietaryFilters, setDietaryFilters] = useState<DietaryPreferences>({
    krishnaPrasadam: false,
    noOnionGarlic: false,
    jainFriendly: false,
    sattvic: false,
    ekadashiFriendly: false,
  });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [sts, prvs] = await Promise.all([
          DataService.getStations(),
          DataService.getProviders({ dietary: dietaryFilters }),
        ]);
        setStations(sts);
        setFeaturedProviders(prvs.slice(0, 4));
      } catch (err) {
        console.error('Error loading homepage data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [dietaryFilters]);

  // Frequently Asked Questions
  const faqs = [
    {
      q: 'What is YatraPrasadam and how does it work?',
      a: 'YatraPrasadam is a devotional discovery directory that connects train travellers across India with verified Krishna prasadam kitchens, temples, and devotee seva groups situated near railway stations. You simply search your station, view declared dietary details, and click to coordinate directly with the devotee on WhatsApp before your train arrives.',
    },
    {
      q: 'Is this an official IRCTC or Indian Railways service?',
      a: 'No. YatraPrasadam is an independent, non-commercial seva initiative by devotees. We are not affiliated with IRCTC, e-catering, or Indian Railways. All coordination and prasadam delivery is carried out on a voluntary basis between you and the respective devotee kitchen.',
    },
    {
      q: 'How are dietary preferences verified?',
      a: 'Providers explicitly declare their dietary standards (such as No Onion/Garlic, Jain-compliant preparation, or Ekadashi vrat food). We verify the devotee group before listing, but we advise travellers to confirm specific preparation practices directly on WhatsApp.',
    },
    {
      q: 'Do I have to pay online or create an account?',
      a: 'No sign-up or online payment is required on this website. All communications take place directly on WhatsApp with the provider, maintaining maximum simplicity and privacy.',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#1b4332] via-[#21533e] to-[#2d6a4f] text-white pt-14 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-inner">
        {/* Subtle devotional background watermark pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
          <svg className="w-[800px] h-[800px]" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1" fill="none" />
            <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1" fill="none" />
          </svg>
        </div>

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c8963e]/20 border border-[#c8963e]/40 text-[#f3efe6] text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-[#c8963e]" />
            Pure Krishna Prasadam Across Railway Stations
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-serif tracking-tight text-white drop-shadow-xs">
            Prasadam along your journey.
          </h1>

          <p className="text-base sm:text-xl text-[#e2d9c8] max-w-2xl mx-auto font-light leading-relaxed">
            Discover prasadam providers at railway stations and connect directly with devotees
            before you travel.
          </p>

          {/* Prominent Station Search Interface */}
          <div className="pt-4 max-w-2xl mx-auto">
            <StationSearchBox
              placeholder="Search station or code (e.g. Pune, NDLS, MTJ, Varanasi, Puri)..."
              autoFocus={false}
            />
          </div>

          {/* Popular stations quick pills */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-[#e2d9c8]">
            <span className="text-[#c8963e] font-medium">Frequent Stations:</span>
            {stations.slice(0, 6).map((st) => (
              <Link
                key={st.id}
                to={`/stations/${st.slug}`}
                className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white font-mono transition-colors"
              >
                {st.code} ({st.city})
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Dietary Filters & Dynamic Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-[#e5dec9] p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 font-serif mb-1">
              Filter by Your Dietary Standards
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Each provider has explicitly declared their dietary practices. Multi-select filters
              apply strict AND matching.
            </p>
          </div>

          <DietaryFilterBar
            selectedFilters={dietaryFilters}
            onChange={setDietaryFilters}
          />

          {/* Filtered providers preview */}
          <div className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900 font-serif">
                {Object.values(dietaryFilters).some(Boolean)
                  ? 'Providers Matching Your Dietary Requirements'
                  : 'Recently Verified Prasadam Providers'}
              </h3>
              <Link
                to="/stations"
                className="text-xs sm:text-sm font-semibold text-[#1b4332] hover:text-[#2d6a4f] flex items-center gap-1"
              >
                View all stations directory &rarr;
              </Link>
            </div>

            {loading ? (
              <div className="py-12 text-center text-sm text-gray-500">
                Loading verified prasadam services...
              </div>
            ) : featuredProviders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredProviders.map((provider) => (
                  <ProviderCard key={provider.id} provider={provider} />
                ))}
              </div>
            ) : (
              <div className="bg-[#fbf9f4] border border-[#eee7d8] rounded-xl p-8 text-center space-y-3">
                <p className="text-sm text-gray-700 font-medium">
                  No verified providers currently match every selected dietary filter.
                </p>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Try unchecking some filters or consider registering as a devotee provider to serve
                  pilgrims with these specific standards.
                </p>
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
                  className="px-4 py-2 bg-[#1b4332] text-white text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How YatraPrasadam Works (4-Step Process) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#c8963e]">
            Simple Devotional Coordination
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif">
            How YatraPrasadam Works
          </h2>
          <p className="text-sm text-gray-600 max-w-xl mx-auto">
            Travel without worrying about pure food. Connect directly with authentic kitchens
            in four straightforward steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#e5dec9] shadow-xs relative text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#1b4332]/10 text-[#1b4332] flex items-center justify-center font-bold font-serif text-lg">
              1
            </div>
            <h3 className="font-bold text-gray-900 text-base">Search Station</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Enter your junction code or station name to discover active prasadam services along your
              train route.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e5dec9] shadow-xs relative text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#1b4332]/10 text-[#1b4332] flex items-center justify-center font-bold font-serif text-lg">
              2
            </div>
            <h3 className="font-bold text-gray-900 text-base">Choose Dietary Option</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Filter strictly by Krishna Prasadam, Jain-compliant, No Onion/Garlic, Sattvic, or
              Ekadashi fasting criteria.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e5dec9] shadow-xs relative text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#1b4332]/10 text-[#1b4332] flex items-center justify-center font-bold font-serif text-lg">
              3
            </div>
            <h3 className="font-bold text-gray-900 text-base">Contact on WhatsApp</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Open a prefilled message with your train number, passenger count, and expected platform
              arrival time.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e5dec9] shadow-xs relative text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#1b4332]/10 text-[#1b4332] flex items-center justify-center font-bold font-serif text-lg">
              4
            </div>
            <h3 className="font-bold text-gray-900 text-base">Confirm & Receive</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Mutually agree on delivery details with the devotee kitchen and receive hot, fresh
              prasadam on your coach/platform.
            </p>
          </div>
        </div>
      </section>

      {/* Verified Stations Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-serif">
              Key Railway Stations Served
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Pilgrim centers and major junctions with active prasadam seva.
            </p>
          </div>
          <Link
            to="/stations"
            className="text-xs sm:text-sm font-semibold text-[#1b4332] hover:text-[#2d6a4f] flex items-center gap-1"
          >
            All Stations &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stations.map((st) => (
            <Link
              key={st.id}
              to={`/stations/${st.slug}`}
              className="bg-white p-4 rounded-xl border border-[#e5dec9] hover:border-[#1b4332] hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-[#1b4332] bg-[#f0ebd9] px-2 py-0.5 rounded">
                    {st.code}
                  </span>
                  <MapPin className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#1b4332]" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm font-serif group-hover:text-[#1b4332] transition-colors">
                  {st.name}
                </h3>
              </div>
              <div className="text-[11px] text-gray-500 mt-2">
                {st.city}, {st.state}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Become a Provider Seva Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#1b4332] to-[#2d6a4f] rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#c8963e] bg-white/10 px-3 py-1 rounded-full">
              Seva Opportunity
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif">
              Do you prepare prasadam near a railway station?
            </h2>
            <p className="text-sm sm:text-base text-[#e2d9c8] leading-relaxed">
              Join our network of devotee kitchens, temples, and volunteer sevadars. Help thousands of
              travelling Vaishnavas, elderly pilgrims, and families maintain pure dietary standards
              during long train journeys.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <Link
              to="/become-a-provider"
              className="px-6 py-3.5 bg-[#c8963e] hover:bg-[#d4a373] text-[#0f281e] font-bold text-sm rounded-xl shadow-lg transition-colors text-center"
            >
              Register Your Kitchen
            </Link>
            <Link
              to="/about"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-xl border border-white/20 transition-colors text-center"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 font-serif">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Everything you need to know about finding and arranging prasadam.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-[#e5dec9] p-5 shadow-xs space-y-2"
            >
              <h3 className="font-bold text-gray-900 text-sm sm:text-base flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-[#c8963e] shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 pl-6 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
