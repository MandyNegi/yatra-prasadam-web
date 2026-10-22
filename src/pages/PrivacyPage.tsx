import React from 'react';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../utils/seo';

export const PrivacyPage: React.FC = () => {
  useDocumentTitle({
    title: 'Privacy Policy & Data Rights',
    description: 'Privacy Policy for YatraPrasadam: explaining collected data, public listings, and provider rights.',
  });
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#c8963e]">
          Transparency & Protection
        </span>
        <h1 className="text-3xl font-bold font-serif text-gray-900">Privacy Policy</h1>
        <p className="text-xs text-gray-500">Last updated: March 2026</p>
      </div>

      <div className="bg-white rounded-3xl border border-[#e5dec9] p-6 sm:p-10 shadow-sm space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold font-serif text-[#1b4332]">1. Overview</h2>
          <p>
            YatraPrasadam is committed to respecting the privacy of pilgrims, travellers, and
            devotee food providers. This Privacy Policy describes how we collect, use, and protect
            information submitted through our platform.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold font-serif text-[#1b4332]">
            2. Information We Collect
          </h2>
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">A. For General Website Visitors:</h3>
            <p>
              You can search railway stations, review dietary standards, and find prasadam providers
              freely without registering, signing in, or submitting any personal information.
            </p>

            <h3 className="font-semibold text-gray-900 pt-2">B. For Provider Applicants:</h3>
            <p>When you submit an application to list your prasadam service, we collect:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Contact person name and organization/temple name.</li>
              <li>WhatsApp contact number.</li>
              <li>Railway station(s) served, city, and state.</li>
              <li>Service schedule, advance notice requirements, and operational details.</li>
              <li>Dietary attributes (Krishna Prasadam, Jain-compliant, No onion/garlic, etc.) and ingredient notes.</li>
            </ul>

            <h3 className="font-semibold text-gray-900 pt-2">C. For Issue Reports:</h3>
            <p>
              When reporting inaccurate listings, we collect your description of the issue and an
              optional contact email if you wish to receive updates.
            </p>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold font-serif text-[#1b4332]">
            3. What Information is Made Public
          </h2>
          <p>
            Only <strong>approved and verified</strong> provider listings are published publicly.
            Public listings show:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Provider/Temple Name, City, State, and Stations served.</li>
            <li>WhatsApp phone number for direct order coordination.</li>
            <li>Operational hours, advance notice hours, and declared dietary criteria.</li>
          </ul>
          <p className="font-semibold text-gray-900 mt-2">What remains private:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Pending or rejected applications are never publicly visible.</li>
            <li>Applicant personal notes or internal review feedback remain restricted to authorized admins.</li>
            <li>Reporter identities and email addresses are never published.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold font-serif text-[#1b4332]">
            4. How We Use the Information
          </h2>
          <p>
            We use the information solely to enable railway travellers to discover and coordinate
            with prasadam providers via WhatsApp. We do not sell, rent, monetize, or share your contact
            details with advertisers or third-party commercial marketing entities.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold font-serif text-[#1b4332]">
            5. Provider Rights: Updates, Corrections, and De-listing
          </h2>
          <p>
            As a registered provider, you have full control over your listing. If you wish to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Update your WhatsApp number or advance notice requirement,</li>
            <li>Temporarily mark your kitchen as unavailable, or</li>
            <li>Permanently remove your listing from YatraPrasadam,</li>
          </ul>
          <p>
            You may simply submit a request through our{' '}
            <Link to="/report" className="text-[#1b4332] underline font-semibold">
              Report / Request Form
            </Link>{' '}
            or contact our admin coordination team. We process removal requests promptly.
          </p>
        </section>
      </div>
    </div>
  );
};
