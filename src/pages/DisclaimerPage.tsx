import React from 'react';
import { useDocumentTitle } from '../utils/seo';
import { Train } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DisclaimerPage: React.FC = () => {
  useDocumentTitle({
    title: 'Disclaimer & Devotional Statement',
    description: 'Devotional purpose, directory guidelines, Indian Railways compliance, and terms of coordination for YatraPrasadam.',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Centered Heading & Devotional Motif (Matching Image) */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-bold font-serif text-gray-900 tracking-tight">
          Disclaimer!
        </h1>

        {/* Train motif with green & orange accent bar */}
        <div className="flex items-center justify-center gap-3 py-1">
          <div className="w-16 h-0.5 bg-[#1b4332] rounded-full" />
          <div className="w-8 h-8 rounded-full bg-[#fbf9f4] border border-[#c8963e] flex items-center justify-center text-[#c8963e] shadow-xs">
            <Train className="w-4 h-4 text-[#1b4332]" />
          </div>
          <div className="w-16 h-0.5 bg-[#1b4332] rounded-full" />
        </div>

        <h2 className="text-lg sm:text-xl font-bold font-serif text-gray-800">
          All glories to Srila Prabhupada!
        </h2>
      </div>

      {/* Main Devotional Text Container */}
      <div className="bg-white rounded-3xl border border-[#e5dec9] p-6 sm:p-12 shadow-sm space-y-7 text-sm sm:text-base text-gray-700 leading-relaxed text-justify sm:text-left">
        <p>
          This website is an aggregator named as <strong>YatraPrasadam</strong>, dedicated to serving
          the members and associates of the <strong>Vaishnava and devotee community</strong>,
          specifically devotees who have taken the sacred vow of consuming only{' '}
          <strong>sattvik Krishna prasadam</strong> that is cooked and offered with love and devotion
          by devotees who chant the holy names of the Lord daily. The purpose of this platform is to
          facilitate the connection between devotees seeking <em>prasadam</em> during their train journeys
          (where it can often be challenging to find pure, sanctified food) and those who are offering it.
        </p>

        <p>
          <strong>YatraPrasadam</strong> functions strictly as a directory, providing contact
          information of devotees, seva kitchens, and temples who are offering prasadam. The website
          does <strong>not</strong> take any responsibility or provide any guarantees regarding the
          quality, preparation standards, hygiene, or delivery of the <em>prasadam</em>. Any communication,
          agreements, or arrangements regarding the provision of prasadam (including timing, dakshina/cost,
          or quantity) are solely between the devotee requesting the <em>prasadam</em> and the individual or
          temple providing it. Thus the sole responsibility lies with those who use the directory and
          offer their seva in the name of <strong>HARE KRISHNA</strong>.
        </p>

        <div className="bg-[#fbf9f4] p-4 sm:p-5 rounded-2xl border border-[#eee7d8] text-xs sm:text-sm text-gray-800">
          <p>
            It is important to emphasize that the prasadam offered through this platform is done purely
            out of devotion, and on a <strong>voluntary basis</strong>. <strong>YatraPrasadam is a
            non-commercial, non-profit initiative</strong>, and there is no intention of commercial
            profiteering by those providing prasadam.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 font-bold text-gray-900 text-base font-serif">
            <Train className="w-4 h-4 text-[#1b4332]" />
            <span>Compliance with Indian Railways Regulations</span>
          </div>
          <p>
            We express our <strong>heartfelt thanks to the Indian Railways</strong> for their selfless
            service to the public and urge all devotees and associates using YatraPrasadam to respect
            and <strong>comply with all rules and regulations of the Indian Railways</strong>. This
            includes ensuring the <strong>purchase of platform tickets</strong>, adhering to railway safety
            protocols, and obtaining any other required permissions when engaging in prasadam distribution
            or collection within railway station premises.
          </p>
        </div>

        <p>
          We humbly request that all devotees who use this platform do so with the understanding that
          it is a <strong>service-oriented initiative</strong>. Any concerns regarding the quality or
          delivery should be discussed directly with the service providers. YatraPrasadam is simply a
          facilitator as a platform enabler and bears no responsibility for any outcomes of such
          interactions between individuals, societies, or organizations if any.
        </p>

        <div className="pt-4 border-t border-[#eee7d8] text-center space-y-2">
          <p className="font-serif italic text-base text-[#1b4332] font-semibold">
            "In keeping with the spiritual tradition, we encourage everyone to approach this service
            with love, respect, and understanding, keeping the focus on the spiritual intent behind
            offering and consuming prasadam."
          </p>
          <p className="text-xs text-[#c8963e] font-serif tracking-wide pt-1">
            Hare Krishna Hare Krishna Krishna Krishna Hare Hare • Hare Rama Hare Rama Rama Rama Hare Hare
          </p>
        </div>
      </div>

      {/* Quick Navigation Action */}
      <div className="flex items-center justify-center gap-4 text-xs font-semibold">
        <Link
          to="/stations"
          className="px-5 py-2.5 bg-[#1b4332] text-white rounded-xl hover:bg-[#245841] transition-colors"
        >
          Find Prasadam by Station
        </Link>
        <Link
          to="/terms"
          className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Terms of Service
        </Link>
      </div>
    </div>
  );
};
