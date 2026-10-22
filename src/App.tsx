import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';

// Code-split pages for high performance on mobile networks
const StationsPage = lazy(() => import('./pages/StationsPage').then(m => ({ default: m.StationsPage })));
const StationDetailPage = lazy(() => import('./pages/StationDetailPage').then(m => ({ default: m.StationDetailPage })));
const ProviderDetailPage = lazy(() => import('./pages/ProviderDetailPage').then(m => ({ default: m.ProviderDetailPage })));
const BecomeProviderPage = lazy(() => import('./pages/BecomeProviderPage').then(m => ({ default: m.BecomeProviderPage })));
const AdminPage = lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then(m => ({ default: m.TermsPage })));
const DisclaimerPage = lazy(() => import('./pages/DisclaimerPage').then(m => ({ default: m.DisclaimerPage })));
const DonatePage = lazy(() => import('./pages/DonatePage').then(m => ({ default: m.DonatePage })));
const ReportPage = lazy(() => import('./pages/ReportPage').then(m => ({ default: m.ReportPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

// Scroll to top helper on navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const PageFallback: React.FC = () => (
  <div className="min-h-[50vh] flex items-center justify-center text-xs text-gray-500 font-medium">
    <div className="flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-[#1b4332] animate-ping" />
      <span>Loading prasadam services...</span>
    </div>
  </div>
);

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-[#fbf9f4] text-[#1f2937]">
        <Navbar />
        <main className="flex-1">
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/stations" element={<StationsPage />} />
              <Route path="/stations/:slug" element={<StationDetailPage />} />
              <Route path="/providers/:providerId" element={<ProviderDetailPage />} />
              <Route path="/become-a-provider" element={<BecomeProviderPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/donate" element={<DonatePage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/disclaimer" element={<DisclaimerPage />} />
              <Route path="/report" element={<ReportPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
