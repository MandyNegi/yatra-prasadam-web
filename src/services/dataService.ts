import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import type {
  Station,
  Provider,
  ProviderApplication,
  Report,
  DietaryPreferences,
  AvailabilityStatus,
} from '../types';
import {
  INITIAL_STATIONS,
  INITIAL_PROVIDERS,
  INITIAL_APPLICATIONS,
  INITIAL_REPORTS,
} from '../data/seedData';

const STATIONS_KEY = 'yp_mock_stations_v2';
const PROVIDERS_KEY = 'yp_mock_providers_v2';
const APPLICATIONS_KEY = 'yp_mock_applications_v2';
const REPORTS_KEY = 'yp_mock_reports_v2';

// Initialize mock storage if not already present
function initMockStorage(): void {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem(STATIONS_KEY)) {
    localStorage.setItem(STATIONS_KEY, JSON.stringify(INITIAL_STATIONS));
  }
  if (!localStorage.getItem(PROVIDERS_KEY)) {
    localStorage.setItem(PROVIDERS_KEY, JSON.stringify(INITIAL_PROVIDERS));
  }
  if (!localStorage.getItem(APPLICATIONS_KEY)) {
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(INITIAL_APPLICATIONS));
  }
  if (!localStorage.getItem(REPORTS_KEY)) {
    localStorage.setItem(REPORTS_KEY, JSON.stringify(INITIAL_REPORTS));
  }
}

initMockStorage();

function getMockItem<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch (err) {
    console.error('Error reading from localStorage', err);
    return defaultVal;
  }
}

function setMockItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Error writing to localStorage', err);
  }
}

export const DataService = {
  isMockMode(): boolean {
    return !isFirebaseConfigured || !db;
  },

  resetMockData(): void {
    localStorage.setItem(STATIONS_KEY, JSON.stringify(INITIAL_STATIONS));
    localStorage.setItem(PROVIDERS_KEY, JSON.stringify(INITIAL_PROVIDERS));
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(INITIAL_APPLICATIONS));
    localStorage.setItem(REPORTS_KEY, JSON.stringify(INITIAL_REPORTS));
  },

  async getStations(): Promise<Station[]> {
    if (!this.isMockMode() && db) {
      try {
        const q = query(collection(db, 'stations'), where('active', '==', true));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Station));
      } catch (e) {
        console.warn('Firestore fetch failed, falling back to mock storage', e);
      }
    }
    return getMockItem<Station[]>(STATIONS_KEY, INITIAL_STATIONS).filter(s => s.active);
  },

  async getAllStations(): Promise<Station[]> {
    if (!this.isMockMode() && db) {
      try {
        const snap = await getDocs(collection(db, 'stations'));
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Station));
      } catch (e) {
        console.warn('Firestore fetch failed, falling back to mock storage', e);
      }
    }
    return getMockItem<Station[]>(STATIONS_KEY, INITIAL_STATIONS);
  },

  async getStationBySlug(slugOrCode: string): Promise<Station | null> {
    const stations = await this.getAllStations();
    const normalized = slugOrCode.toLowerCase().trim();
    return (
      stations.find(
        s =>
          s.slug.toLowerCase() === normalized ||
          s.code.toLowerCase() === normalized ||
          s.id.toLowerCase() === normalized
      ) || null
    );
  },

  async searchStations(queryText: string): Promise<Station[]> {
    const stations = await this.getStations();
    if (!queryText.trim()) return stations;

    const term = queryText.toLowerCase().trim();
    return stations.filter(
      s =>
        s.name.toLowerCase().includes(term) ||
        s.code.toLowerCase().includes(term) ||
        s.city.toLowerCase().includes(term) ||
        s.state.toLowerCase().includes(term)
    );
  },

  async getProviders(filters?: {
    stationId?: string;
    stationCode?: string;
    dietary?: Partial<DietaryPreferences>;
    availability?: AvailabilityStatus;
  }): Promise<Provider[]> {
    let providers: Provider[] = [];

    if (!this.isMockMode() && db) {
      try {
        const q = query(
          collection(db, 'providers'),
          where('published', '==', true),
          where('verificationStatus', '==', 'verified')
        );
        const snap = await getDocs(q);
        providers = snap.docs.map(d => ({ id: d.id, ...d.data() } as Provider));
      } catch (e) {
        console.warn('Firestore fetch failed, falling back to mock storage', e);
        providers = getMockItem<Provider[]>(PROVIDERS_KEY, INITIAL_PROVIDERS).filter(
          p => p.published && p.verificationStatus === 'verified'
        );
      }
    } else {
      providers = getMockItem<Provider[]>(PROVIDERS_KEY, INITIAL_PROVIDERS).filter(
        p => p.published && p.verificationStatus === 'verified'
      );
    }

    // Filter by station
    if (filters?.stationId) {
      providers = providers.filter(
        p =>
          p.stationIds.includes(filters.stationId!) ||
          (filters.stationCode && p.stationCodes.includes(filters.stationCode))
      );
    } else if (filters?.stationCode) {
      providers = providers.filter(p => p.stationCodes.includes(filters.stationCode!));
    }

    // Filter by availability
    if (filters?.availability) {
      providers = providers.filter(p => p.availabilityStatus === filters.availability);
    }

    // Filter by dietary preferences (Strict AND matching)
    if (filters?.dietary) {
      const activeKeys = (Object.keys(filters.dietary) as (keyof DietaryPreferences)[]).filter(
        k => filters.dietary![k] === true
      );

      if (activeKeys.length > 0) {
        providers = providers.filter(p => {
          return activeKeys.every(k => p.dietaryPreferences && p.dietaryPreferences[k] === true);
        });
      }
    }

    return providers;
  },

  async getProviderById(id: string): Promise<Provider | null> {
    if (!this.isMockMode() && db) {
      try {
        const snap = await getDoc(doc(db, 'providers', id));
        if (snap.exists()) {
          return { id: snap.id, ...snap.data() } as Provider;
        }
      } catch (e) {
        console.warn('Firestore fetch failed', e);
      }
    }
    const providers = getMockItem<Provider[]>(PROVIDERS_KEY, INITIAL_PROVIDERS);
    return providers.find(p => p.id === id) || null;
  },

  async submitProviderApplication(
    data: Omit<ProviderApplication, 'id' | 'status' | 'submittedAt'>
  ): Promise<{ success: boolean; id: string }> {
    const id = `app-${Date.now()}`;
    const application: ProviderApplication = {
      ...data,
      id,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    if (!this.isMockMode() && db) {
      try {
        await setDoc(doc(db, 'providerApplications', id), {
          ...application,
          submittedAt: serverTimestamp(),
        });
        return { success: true, id };
      } catch (e) {
        console.warn('Firestore save failed, falling back to mock storage', e);
      }
    }

    const apps = getMockItem<ProviderApplication[]>(APPLICATIONS_KEY, INITIAL_APPLICATIONS);
    apps.unshift(application);
    setMockItem(APPLICATIONS_KEY, apps);
    return { success: true, id };
  },

  async submitReport(
    data: Omit<Report, 'id' | 'status' | 'createdAt'>
  ): Promise<{ success: boolean; id: string }> {
    const id = `rep-${Date.now()}`;
    const report: Report = {
      ...data,
      id,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    if (!this.isMockMode() && db) {
      try {
        await addDoc(collection(db, 'reports'), {
          ...report,
          createdAt: serverTimestamp(),
        });
        return { success: true, id };
      } catch (e) {
        console.warn('Firestore report save failed', e);
      }
    }

    const reports = getMockItem<Report[]>(REPORTS_KEY, INITIAL_REPORTS);
    reports.unshift(report);
    setMockItem(REPORTS_KEY, reports);
    return { success: true, id };
  },

  // ADMIN METHODS
  async getApplications(): Promise<ProviderApplication[]> {
    if (!this.isMockMode() && db) {
      try {
        const snap = await getDocs(collection(db, 'providerApplications'));
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as ProviderApplication));
      } catch (e) {
        console.warn('Firestore fetch failed', e);
      }
    }
    return getMockItem<ProviderApplication[]>(APPLICATIONS_KEY, INITIAL_APPLICATIONS);
  },

  async approveApplication(
    applicationId: string,
    adminNotes?: string
  ): Promise<{ success: boolean }> {
    const apps = getMockItem<ProviderApplication[]>(APPLICATIONS_KEY, INITIAL_APPLICATIONS);
    const appIndex = apps.findIndex(a => a.id === applicationId);
    if (appIndex === -1) return { success: false };

    const targetApp = apps[appIndex];
    targetApp.status = 'approved';
    targetApp.reviewedAt = new Date().toISOString();
    targetApp.reviewedBy = 'Administrator';
    targetApp.adminNotes = adminNotes;
    apps[appIndex] = targetApp;
    setMockItem(APPLICATIONS_KEY, apps);

    // Promote to published Provider
    const newProvider: Provider = {
      id: `pr-${Date.now()}`,
      name: targetApp.providerName,
      providerType: targetApp.providerType,
      description: targetApp.serviceDetails,
      stationIds: targetApp.stationIds,
      stationCodes: targetApp.stationCodes,
      city: targetApp.city,
      state: targetApp.state,
      whatsappNumber: targetApp.whatsappNumber,
      serviceDays: targetApp.serviceDays || 'Daily',
      serviceHours: targetApp.serviceHours || '08:00 AM - 08:00 PM',
      advanceNoticeHours: targetApp.advanceNoticeHours || 3,
      availabilityStatus: 'available',
      dietaryPreferences: targetApp.dietaryPreferences,
      dietaryNotes: targetApp.dietaryNotes,
      verificationStatus: 'verified',
      published: true,
      lastVerifiedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const providers = getMockItem<Provider[]>(PROVIDERS_KEY, INITIAL_PROVIDERS);
    providers.unshift(newProvider);
    setMockItem(PROVIDERS_KEY, providers);

    if (!this.isMockMode() && db) {
      try {
        await updateDoc(doc(db, 'providerApplications', applicationId), {
          status: 'approved',
          reviewedAt: serverTimestamp(),
          reviewedBy: 'admin',
          adminNotes: adminNotes || '',
        });
        await setDoc(doc(db, 'providers', newProvider.id), newProvider);
      } catch (e) {
        console.warn('Firestore approve failed', e);
      }
    }

    return { success: true };
  },

  async rejectApplication(
    applicationId: string,
    adminNotes?: string
  ): Promise<{ success: boolean }> {
    const apps = getMockItem<ProviderApplication[]>(APPLICATIONS_KEY, INITIAL_APPLICATIONS);
    const appIndex = apps.findIndex(a => a.id === applicationId);
    if (appIndex === -1) return { success: false };

    apps[appIndex].status = 'rejected';
    apps[appIndex].reviewedAt = new Date().toISOString();
    apps[appIndex].reviewedBy = 'Administrator';
    apps[appIndex].adminNotes = adminNotes;
    setMockItem(APPLICATIONS_KEY, apps);

    if (!this.isMockMode() && db) {
      try {
        await updateDoc(doc(db, 'providerApplications', applicationId), {
          status: 'rejected',
          reviewedAt: serverTimestamp(),
          adminNotes: adminNotes || '',
        });
      } catch (e) {
        console.warn('Firestore reject failed', e);
      }
    }

    return { success: true };
  },

  async getAllProvidersAdmin(): Promise<Provider[]> {
    if (!this.isMockMode() && db) {
      try {
        const snap = await getDocs(collection(db, 'providers'));
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Provider));
      } catch (e) {
        console.warn('Firestore fetch failed', e);
      }
    }
    return getMockItem<Provider[]>(PROVIDERS_KEY, INITIAL_PROVIDERS);
  },

  async updateProvider(id: string, updates: Partial<Provider>): Promise<boolean> {
    const providers = getMockItem<Provider[]>(PROVIDERS_KEY, INITIAL_PROVIDERS);
    const index = providers.findIndex(p => p.id === id);
    if (index === -1) return false;

    providers[index] = {
      ...providers[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    setMockItem(PROVIDERS_KEY, providers);

    if (!this.isMockMode() && db) {
      try {
        await updateDoc(doc(db, 'providers', id), {
          ...updates,
          updatedAt: serverTimestamp(),
        });
      } catch (e) {
        console.warn('Firestore provider update failed', e);
      }
    }
    return true;
  },

  async getReports(): Promise<Report[]> {
    if (!this.isMockMode() && db) {
      try {
        const snap = await getDocs(collection(db, 'reports'));
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Report));
      } catch (e) {
        console.warn('Firestore reports fetch failed', e);
      }
    }
    return getMockItem<Report[]>(REPORTS_KEY, INITIAL_REPORTS);
  },

  async resolveReport(reportId: string, status: 'resolved' | 'dismissed'): Promise<boolean> {
    const reports = getMockItem<Report[]>(REPORTS_KEY, INITIAL_REPORTS);
    const idx = reports.findIndex(r => r.id === reportId);
    if (idx === -1) return false;

    reports[idx].status = status;
    reports[idx].resolvedAt = new Date().toISOString();
    setMockItem(REPORTS_KEY, reports);

    if (!this.isMockMode() && db) {
      try {
        await updateDoc(doc(db, 'reports', reportId), {
          status,
          resolvedAt: serverTimestamp(),
        });
      } catch (e) {
        console.warn('Firestore report update failed', e);
      }
    }
    return true;
  },

  async addStation(data: Omit<Station, 'id' | 'createdAt' | 'updatedAt'>): Promise<Station> {
    const id = `st-${data.code.toLowerCase()}`;
    const newStation: Station = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const stations = getMockItem<Station[]>(STATIONS_KEY, INITIAL_STATIONS);
    stations.push(newStation);
    setMockItem(STATIONS_KEY, stations);

    if (!this.isMockMode() && db) {
      try {
        await setDoc(doc(db, 'stations', id), newStation);
      } catch (e) {
        console.warn('Firestore add station failed', e);
      }
    }
    return newStation;
  },
};
