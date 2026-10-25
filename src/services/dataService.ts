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
import { db } from '../lib/firebase';
import type {
  Station,
  Provider,
  ProviderApplication,
  Report,
  DietaryPreferences,
  AvailabilityStatus,
} from '../types';

function assertFirestoreReady(): void {
  if (!db) {
    throw new Error('Firestore is not initialized. Please add your Firebase env vars and redeploy.');
  }
}

async function runWithFirestoreTimeout<T>(
  operation: () => Promise<T>,
  timeoutMs = 8000
): Promise<T> {
  assertFirestoreReady();

  let timer: ReturnType<typeof setTimeout> | undefined;

  try {
    const result = await Promise.race([
      operation(),
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => {
          reject(new Error('Firestore request timed out'));
        }, timeoutMs);
      }),
    ]);
    return result;
  } catch (error) {
    console.error('Firestore operation failed in strict Firestore mode:', error);
    throw error;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export const DataService = {
  isMockMode(): boolean {
    return false;
  },

  async getStations(): Promise<Station[]> {
    assertFirestoreReady();
    const q = query(collection(db!, 'stations'), where('active', '==', true));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Station));
  },

  async getAllStations(): Promise<Station[]> {
    assertFirestoreReady();
    const snap = await getDocs(collection(db!, 'stations'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Station));
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
    assertFirestoreReady();

    const providersQuery = query(
      collection(db!, 'providers'),
      where('published', '==', true),
      where('verificationStatus', '==', 'verified')
    );

    // const snap = await getDocs(collection(db!, 'providers'));
    const snap = await getDocs(providersQuery);

    let providers = snap.docs
      .map(d => ({ id: d.id, ...d.data() } as Provider))
      .filter(
        p => p.published && p.verificationStatus === 'verified' && p.availabilityStatus !== 'unavailable'
      );

    const targetStationId = filters?.stationId?.toLowerCase().trim();
    const targetStationCode = filters?.stationCode?.toLowerCase().trim();

    if (targetStationId || targetStationCode) {
      providers = providers.filter((p) => {
        const stationIds = (p.stationIds || []).map(v => String(v).toLowerCase());
        const stationCodes = (p.stationCodes || []).map(v => String(v).toLowerCase());
        const stationNames = (p.stationNames || []).map(v => String(v).toLowerCase());

        return (
          (!targetStationId || stationIds.includes(targetStationId)) ||
          (!targetStationCode || stationCodes.includes(targetStationCode)) ||
          (!targetStationCode || stationNames.includes(targetStationCode))
        );
      });
    }

    if (filters?.availability) {
      providers = providers.filter(p => p.availabilityStatus === filters.availability);
    }

    if (filters?.dietary) {
      const activeKeys = (Object.keys(filters.dietary) as (keyof DietaryPreferences)[]).filter(
        k => filters.dietary![k] === true
      );

      if (activeKeys.length > 0) {
        providers = providers.filter(p =>
          activeKeys.every(k => p.dietaryPreferences && p.dietaryPreferences[k] === true)
        );
      }
    }

    return providers;
  },

  async getProviderById(id: string): Promise<Provider | null> {
    assertFirestoreReady();
    const snap = await getDoc(doc(db!, 'providers', id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Provider;
  },

  async submitProviderApplication(
    data: Omit<ProviderApplication, 'id' | 'status' | 'submittedAt'>
  ): Promise<{ success: boolean; id: string }> {
    assertFirestoreReady();

    const id = `app-${Date.now()}`;
    const application: ProviderApplication = {
      ...data,
      id,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    await runWithFirestoreTimeout(async () => {
      await setDoc(doc(db!, 'providerApplications', id), {
        ...application,
        submittedAt: serverTimestamp(),
      });
    });

    return { success: true, id };
  },

  async submitReport(
    data: Omit<Report, 'id' | 'status' | 'createdAt'>
  ): Promise<{ success: boolean; id: string }> {
    assertFirestoreReady();

    const id = `rep-${Date.now()}`;
    const report: Report = {
      ...data,
      id,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    await addDoc(collection(db!, 'reports'), {
      ...report,
      createdAt: serverTimestamp(),
    });

    return { success: true, id };
  },

  async getApplications(): Promise<ProviderApplication[]> {
    assertFirestoreReady();
    const snap = await getDocs(collection(db!, 'providerApplications'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as ProviderApplication));
  },

  async approveApplication(
    applicationId: string,
    adminNotes?: string
  ): Promise<{ success: boolean }> {
    assertFirestoreReady();

    const appSnap = await getDoc(doc(db!, 'providerApplications', applicationId));
    if (!appSnap.exists()) return { success: false };

    const targetApp = { id: appSnap.id, ...appSnap.data() } as ProviderApplication;
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

    await updateDoc(doc(db!, 'providerApplications', applicationId), {
      status: 'approved',
      reviewedAt: serverTimestamp(),
      reviewedBy: 'admin',
      adminNotes: adminNotes || '',
    });
    await setDoc(doc(db!, 'providers', newProvider.id), newProvider);
    return { success: true };
  },

  async rejectApplication(
    applicationId: string,
    adminNotes?: string
  ): Promise<{ success: boolean }> {
    assertFirestoreReady();

    const appSnap = await getDoc(doc(db!, 'providerApplications', applicationId));
    if (!appSnap.exists()) return { success: false };

    await updateDoc(doc(db!, 'providerApplications', applicationId), {
      status: 'rejected',
      reviewedAt: serverTimestamp(),
      reviewedBy: 'admin',
      adminNotes: adminNotes || '',
    });
    return { success: true };
  },

  async getAllProvidersAdmin(): Promise<Provider[]> {
    assertFirestoreReady();
    const snap = await getDocs(collection(db!, 'providers'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Provider));
  },

  async updateProvider(id: string, updates: Partial<Provider>): Promise<boolean> {
    assertFirestoreReady();
    await updateDoc(doc(db!, 'providers', id), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return true;
  },

  async getReports(): Promise<Report[]> {
    assertFirestoreReady();
    const snap = await getDocs(collection(db!, 'reports'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Report));
  },

  async resolveReport(reportId: string, status: 'resolved' | 'dismissed'): Promise<boolean> {
    assertFirestoreReady();
    await updateDoc(doc(db!, 'reports', reportId), {
      status,
      resolvedAt: serverTimestamp(),
    });
    return true;
  },

  async addStation(data: Omit<Station, 'id' | 'createdAt' | 'updatedAt'>): Promise<Station> {
    assertFirestoreReady();

    const id = `st-${data.code.toLowerCase()}`;
    const newStation: Station = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db!, 'stations', id), newStation);
    return newStation;
  },
};
