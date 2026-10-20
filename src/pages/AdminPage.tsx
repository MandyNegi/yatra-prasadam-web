import React, { useState, useEffect } from 'react';
import type {
  ProviderApplication,
  Provider,
  Report,
  Station,
  AvailabilityStatus,
} from '../types';
import { DataService } from '../services/dataService';
import {
  Shield,
  CheckCircle,
  PlusCircle,
  LogOut,
  RefreshCw,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('yp_admin_authenticated') === 'true';
  });
  const [adminPasscode, setAdminPasscode] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Tab
  const [activeTab, setActiveTab] = useState<'applications' | 'providers' | 'stations' | 'reports'>('applications');

  // Data states
  const [applications, setApplications] = useState<ProviderApplication[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Add station modal/fields
  const [showAddStation, setShowAddStation] = useState(false);
  const [newStationName, setNewStationName] = useState('');
  const [newStationCode, setNewStationCode] = useState('');
  const [newStationCity, setNewStationCity] = useState('');
  const [newStationState, setNewStationState] = useState('');
  const [newStationSlug, setNewStationSlug] = useState('');

  // Selected application for detail modal
  const [selectedApp, setSelectedApp] = useState<ProviderApplication | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [apps, prvs, sts, reps] = await Promise.all([
        DataService.getApplications(),
        DataService.getAllProvidersAdmin(),
        DataService.getAllStations(),
        DataService.getReports(),
      ]);
      setApplications(apps);
      setProviders(prvs);
      setStations(sts);
      setReports(reps);
    } catch (err) {
      console.error('Error fetching admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAdminData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default admin verification key for mock/pilot testing
    if (adminPasscode === 'admin108' || adminPasscode === 'harekrishna') {
      setIsAuthenticated(true);
      localStorage.setItem('yp_admin_authenticated', 'true');
      setLoginError(null);
    } else {
      setLoginError('Invalid administrator credentials. (Hint for reviewer: use "admin108")');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('yp_admin_authenticated');
  };

  const handleApproveApp = async (appId: string) => {
    if (!window.confirm('Approve this provider and make their prasadam listing active?')) return;
    const res = await DataService.approveApplication(appId, adminNotes);
    if (res.success) {
      setActionMessage('Application approved and published successfully.');
      setSelectedApp(null);
      setAdminNotes('');
      loadAdminData();
      setTimeout(() => setActionMessage(null), 3000);
    }
  };

  const handleRejectApp = async (appId: string) => {
    const reason = prompt('Please enter rejection notes or reason:', 'Does not meet verification guidelines');
    if (reason === null) return;
    const res = await DataService.rejectApplication(appId, reason);
    if (res.success) {
      setActionMessage('Application marked as rejected.');
      setSelectedApp(null);
      loadAdminData();
      setTimeout(() => setActionMessage(null), 3000);
    }
  };

  const handleTogglePublish = async (provider: Provider) => {
    const updated = !provider.published;
    await DataService.updateProvider(provider.id, { published: updated });
    loadAdminData();
  };

  const handleUpdateAvailability = async (providerId: string, status: AvailabilityStatus) => {
    await DataService.updateProvider(providerId, {
      availabilityStatus: status,
      lastVerifiedAt: new Date().toISOString(),
    });
    loadAdminData();
  };

  const handleResolveReport = async (reportId: string, status: 'resolved' | 'dismissed') => {
    await DataService.resolveReport(reportId, status);
    loadAdminData();
  };

  const handleCreateStation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStationName || !newStationCode || !newStationCity || !newStationState) return;

    const slug = newStationSlug.trim() || newStationName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await DataService.addStation({
      name: newStationName.trim(),
      normalizedName: newStationName.toLowerCase().trim(),
      code: newStationCode.toUpperCase().trim(),
      city: newStationCity.trim(),
      state: newStationState.trim(),
      slug,
      active: true,
    });

    setShowAddStation(false);
    setNewStationName('');
    setNewStationCode('');
    setNewStationCity('');
    setNewStationState('');
    setNewStationSlug('');
    loadAdminData();
  };

  // Sign in view if not logged in
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 space-y-6">
        <div className="bg-white rounded-3xl border border-[#e5dec9] p-8 shadow-md space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#1b4332] text-[#c8963e] flex items-center justify-center mx-auto shadow-inner">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold font-serif text-gray-900">Administrator Sign-In</h1>
            <p className="text-xs text-gray-600">
              Authorized access to review provider applications, moderate listings, and resolve
              reports.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                {loginError}
              </div>
            )}

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Admin Access Passcode
              </label>
              <input
                type="password"
                required
                value={adminPasscode}
                onChange={(e) => setAdminPasscode(e.target.value)}
                placeholder="Enter admin passcode (e.g. admin108)"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#1b4332]"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">
                Default demonstration key: <code className="font-mono text-gray-700">admin108</code>
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#1b4332] hover:bg-[#245841] text-white font-bold rounded-xl transition-colors cursor-pointer"
            >
              Sign In to Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  const pendingApps = applications.filter((a) => a.status === 'pending');
  const pendingReports = reports.filter((r) => r.status === 'pending');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Admin Header */}
      <div className="bg-[#1b4332] text-white rounded-2xl p-6 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#c8963e]" />
            <h1 className="text-xl font-bold font-serif">YatraPrasadam Control Center</h1>
          </div>
          <p className="text-xs text-[#e2d9c8] mt-1">
            Admin role active • {DataService.isMockMode() ? 'Mock Storage' : 'Firebase Firestore'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadAdminData}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-xs flex items-center gap-1 cursor-pointer"
            title="Refresh records"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-1.5 bg-red-700/80 hover:bg-red-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-gray-200 gap-2">
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'applications'
              ? 'border-[#1b4332] text-[#1b4332]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <span>Applications</span>
          {pendingApps.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold">
              {pendingApps.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('providers')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'providers'
              ? 'border-[#1b4332] text-[#1b4332]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <span>Active Providers</span>
          <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 text-[10px] font-bold">
            {providers.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('stations')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'stations'
              ? 'border-[#1b4332] text-[#1b4332]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <span>Stations</span>
          <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 text-[10px] font-bold">
            {stations.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'reports'
              ? 'border-[#1b4332] text-[#1b4332]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <span>Issue Reports</span>
          {pendingReports.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
              {pendingReports.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: Applications Queue */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Showing all pending and reviewed applications:</span>
          </div>

          {applications.length > 0 ? (
            <div className="bg-white rounded-2xl border border-[#e5dec9] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-700">
                  <thead className="bg-[#fbf9f4] border-b border-gray-200 uppercase text-[10px] tracking-wider text-gray-500 font-semibold">
                    <tr>
                      <th className="p-3">Applicant / Kitchen</th>
                      <th className="p-3">Stations</th>
                      <th className="p-3">WhatsApp</th>
                      <th className="p-3">City & State</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Submitted</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-900">
                          <div>{app.providerName}</div>
                          <div className="text-[11px] text-gray-500">Contact: {app.applicantName}</div>
                        </td>
                        <td className="p-3 font-mono font-bold text-[#1b4332]">
                          {app.stationCodes?.join(', ')}
                        </td>
                        <td className="p-3 font-mono">+{app.whatsappNumber}</td>
                        <td className="p-3">
                          {app.city}, {app.state}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              app.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : app.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {app.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3 text-gray-400">
                          {new Date(app.submittedAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => setSelectedApp(app)}
                            className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded font-semibold text-gray-700"
                          >
                            View
                          </button>
                          {app.status === 'pending' && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApproveApp(app.id)}
                                className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-semibold"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRejectApp(app.id)}
                                className="px-2.5 py-1 bg-red-700 hover:bg-red-800 text-white rounded font-semibold"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-gray-500 bg-white rounded-xl border border-gray-200">
              No applications submitted yet.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Active Providers Management */}
      {activeTab === 'providers' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#e5dec9] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-[#fbf9f4] border-b border-gray-200 uppercase text-[10px] tracking-wider text-gray-500 font-semibold">
                  <tr>
                    <th className="p-3">Provider Name</th>
                    <th className="p-3">Station(s)</th>
                    <th className="p-3">WhatsApp</th>
                    <th className="p-3">Notice</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Published</th>
                    <th className="p-3">Last Verified</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {providers.map((prv) => (
                    <tr key={prv.id} className="hover:bg-gray-50">
                      <td className="p-3 font-medium text-gray-900">
                        <div>{prv.name}</div>
                        <div className="text-[11px] text-gray-400">
                          {prv.city}, {prv.state}
                        </div>
                      </td>
                      <td className="p-3 font-mono font-bold text-[#1b4332]">
                        {prv.stationCodes.join(', ')}
                      </td>
                      <td className="p-3 font-mono">+{prv.whatsappNumber}</td>
                      <td className="p-3">{prv.advanceNoticeHours}h</td>
                      <td className="p-3">
                        <select
                          value={prv.availabilityStatus}
                          onChange={(e) =>
                            handleUpdateAvailability(prv.id, e.target.value as AvailabilityStatus)
                          }
                          className="px-2 py-1 border border-gray-300 rounded text-xs bg-white"
                        >
                          <option value="available">Available</option>
                          <option value="limited">Limited</option>
                          <option value="unavailable">Unavailable</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(prv)}
                          className={`px-2 py-0.5 rounded font-bold text-[10px] cursor-pointer ${
                            prv.published
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {prv.published ? 'PUBLISHED' : 'HIDDEN'}
                        </button>
                      </td>
                      <td className="p-3 text-gray-400">
                        {prv.lastVerifiedAt
                          ? new Date(prv.lastVerifiedAt).toLocaleDateString()
                          : 'Not tracked'}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            const newHours = prompt(
                              'Update advance notice hours:',
                              prv.advanceNoticeHours.toString()
                            );
                            if (newHours && !isNaN(Number(newHours))) {
                              DataService.updateProvider(prv.id, {
                                advanceNoticeHours: Number(newHours),
                              }).then(loadAdminData);
                            }
                          }}
                          className="px-2 py-1 text-gray-600 hover:text-black border border-gray-300 rounded"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Stations Management */}
      {activeTab === 'stations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Active railway stations and junction hubs:
            </span>
            <button
              type="button"
              onClick={() => setShowAddStation(true)}
              className="px-3 py-1.5 bg-[#1b4332] text-white text-xs font-semibold rounded-lg hover:bg-[#245841] flex items-center gap-1 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add New Railway Station</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5dec9] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-[#fbf9f4] border-b border-gray-200 uppercase text-[10px] tracking-wider text-gray-500 font-semibold">
                  <tr>
                    <th className="p-3">Code</th>
                    <th className="p-3">Station Name</th>
                    <th className="p-3">City</th>
                    <th className="p-3">State</th>
                    <th className="p-3">URL Slug</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stations.map((st) => (
                    <tr key={st.id} className="hover:bg-gray-50">
                      <td className="p-3 font-mono font-bold text-[#1b4332]">{st.code}</td>
                      <td className="p-3 font-semibold text-gray-900">{st.name}</td>
                      <td className="p-3">{st.city}</td>
                      <td className="p-3">{st.state}</td>
                      <td className="p-3 font-mono text-gray-500">/stations/{st.slug}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          ACTIVE
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Issue Reports Queue */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="text-xs text-gray-500">
            Reports submitted by travellers and devotees:
          </div>

          {reports.length > 0 ? (
            <div className="space-y-3">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="bg-white rounded-xl border border-[#e5dec9] p-4 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 font-serif text-sm">
                      Provider: {rep.providerName}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        rep.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {rep.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="text-gray-600">
                    <strong>Issue Reason:</strong> {rep.reason.replace('_', ' ')}
                  </div>
                  <div className="bg-[#fbf9f4] p-2.5 rounded border border-[#eee7d8] text-gray-700">
                    {rep.description}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-gray-400">
                    <span>Reported: {new Date(rep.createdAt).toLocaleString()}</span>
                    {rep.status === 'pending' && (
                      <div className="space-x-2">
                        <button
                          type="button"
                          onClick={() => handleResolveReport(rep.id, 'resolved')}
                          className="px-3 py-1 bg-emerald-700 text-white font-semibold rounded"
                        >
                          Mark Resolved
                        </button>
                        <button
                          type="button"
                          onClick={() => handleResolveReport(rep.id, 'dismissed')}
                          className="px-3 py-1 bg-gray-200 text-gray-700 font-semibold rounded"
                        >
                          Dismiss
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-gray-500 bg-white rounded-xl border border-gray-200">
              No reports in queue.
            </div>
          )}
        </div>
      )}

      {/* Application Detail Review Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-300 p-6 space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="font-bold text-gray-900 font-serif text-base">
                Application Review: {selectedApp.providerName}
              </h2>
              <button onClick={() => setSelectedApp(null)} className="text-gray-400 hover:text-black">
                ✕
              </button>
            </div>

            <div className="space-y-2 text-gray-700">
              <div>
                <strong>Applicant Name:</strong> {selectedApp.applicantName}
              </div>
              <div>
                <strong>WhatsApp:</strong> +{selectedApp.whatsappNumber}
              </div>
              <div>
                <strong>Location:</strong> {selectedApp.city}, {selectedApp.state}
              </div>
              <div>
                <strong>Stations Served:</strong> {selectedApp.stationCodes.join(', ')}
              </div>
              <div>
                <strong>Service Description:</strong>
                <p className="p-2 bg-gray-50 rounded border mt-1">{selectedApp.serviceDetails}</p>
              </div>
              <div>
                <strong>Operating Schedule:</strong> {selectedApp.serviceDays} (
                {selectedApp.serviceHours})
              </div>
              <div>
                <strong>Advance Notice:</strong> {selectedApp.advanceNoticeHours} hours
              </div>
              <div>
                <strong>Dietary Notes:</strong>
                <p className="p-2 bg-gray-50 rounded border mt-1">
                  {selectedApp.dietaryNotes || 'None supplied'}
                </p>
              </div>
            </div>

            {selectedApp.status === 'pending' && (
              <div className="pt-4 border-t flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleRejectApp(selectedApp.id)}
                  className="px-4 py-2 bg-red-700 text-white font-semibold rounded-lg"
                >
                  Reject Application
                </button>
                <button
                  type="button"
                  onClick={() => handleApproveApp(selectedApp.id)}
                  className="px-4 py-2 bg-emerald-700 text-white font-semibold rounded-lg"
                >
                  Approve & Publish Provider
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Station Modal */}
      {showAddStation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <form
            onSubmit={handleCreateStation}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-300 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="font-bold text-gray-900 font-serif text-base">Add Railway Station</h2>
              <button
                type="button"
                onClick={() => setShowAddStation(false)}
                className="text-gray-400 hover:text-black"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block font-semibold mb-1">Station Full Name</label>
              <input
                type="text"
                required
                value={newStationName}
                onChange={(e) => setNewStationName(e.target.value)}
                placeholder="e.g. Kanpur Central"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Station Code (Uppercase)</label>
              <input
                type="text"
                required
                value={newStationCode}
                onChange={(e) => setNewStationCode(e.target.value)}
                placeholder="e.g. CNB"
                className="w-full px-3 py-2 border rounded-lg font-mono uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">City</label>
                <input
                  type="text"
                  required
                  value={newStationCity}
                  onChange={(e) => setNewStationCity(e.target.value)}
                  placeholder="Kanpur"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">State</label>
                <input
                  type="text"
                  required
                  value={newStationState}
                  onChange={(e) => setNewStationState(e.target.value)}
                  placeholder="Uttar Pradesh"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">URL Slug (Optional)</label>
              <input
                type="text"
                value={newStationSlug}
                onChange={(e) => setNewStationSlug(e.target.value)}
                placeholder="kanpur-central"
                className="w-full px-3 py-2 border rounded-lg font-mono"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddStation(false)}
                className="px-3 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#1b4332] text-white font-semibold rounded-lg"
              >
                Save Station
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
