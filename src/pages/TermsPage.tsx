import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useDocumentTitle } from '../utils/seo';

export const TermsPage: React.FC = () => {
  useDocumentTitle({
    title: 'Terms of Service & Devotional Code',
    description: 'Terms of Service and guidelines for travellers and providers coordinating on YatraPrasadam.',
  });
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#c8963e]">
          Devotional Code & Guidelines
        </span>
        <h1 className="text-3xl font-bold font-serif text-gray-900">Terms of Service</h1>
        <p className="text-xs text-gray-500">Effective: March 2026</p>
      </div>

      <div className="bg-white rounded-3xl border border-[#e5dec9] p-6 sm:p-10 shadow-sm space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold font-serif text-[#1b4332]">1. Acceptance of Terms</h2>
          <p>
            By accessing or using YatraPrasadam, you agree to these Terms of Service and commit to
            interacting with fellow devotees, pilgrims, and kitchens with mutual respect, honesty,
            and devotional etiquette.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold font-serif text-[#1b4332]">
            2. Platform Nature & Disclaimer of Liability
          </h2>
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-900 space-y-2">
            <div className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>Independent Directory Service:</span>
            </div>
            <p>
              YatraPrasadam functions solely as a discovery directory. We do not cook, package,
              deliver, inspect kitchens on-site, or process monetary transactions. All arrangements,
              dakshina/cost, train coach delivery points, and confirmations take place directly
              between the traveller and the provider on WhatsApp.
            </p>
          </div>
          <p>
            Neither YatraPrasadam nor its volunteer administrators shall be held liable for:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Train cancellations, platform diversions, or schedule delays by Indian Railways.</li>
            <li>Inability of a provider to deliver due to unforeseen circumstances or short notice.</li>
            <li>Any disputes arising over payments made directly outside of this platform.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold font-serif text-[#1b4332]">
            3. Devotional Etiquette for Travellers
          </h2>
          <p>When contacting a prasadam provider, please observe the following guidelines:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Respect Advance Notice:</strong> Devotee kitchens cook fresh food. Please give
              them the requested notice (typically 2 to 4 hours before station arrival).
            </li>
            <li>
              <strong>Live Train Updates:</strong> Keep the devotee updated on whether your train is
              running on time or delayed.
            </li>
            <li>
              <strong>Punctuality at Platform:</strong> Be ready at your coach door or designated
              meeting point when your train arrives at the station.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold font-serif text-[#1b4332]">
            4. Standards for Registered Providers
          </h2>
          <p>Providers agree to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Accurately represent all dietary criteria (Jain restrictions, allium exclusion, Ekadashi rules).</li>
            <li>Maintain hygienic and devotional kitchen environments.</li>
            <li>Promptly communicate via WhatsApp if unable to fulfill a requested order.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};
