export interface DietaryPreferences {
  krishnaPrasadam: boolean;
  noOnionGarlic: boolean;
  jainFriendly: boolean;
  sattvic: boolean;
  ekadashiFriendly: boolean;
}

export type AvailabilityStatus = 'available' | 'limited' | 'unavailable' | 'unknown';

export type ProviderType = 'temple' | 'devotee_kitchen' | 'ashram_math' | 'individual_devotee';

export interface Station {
  id: string;
  name: string;
  normalizedName: string;
  code: string;
  city: string;
  state: string;
  slug: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Provider {
  id: string;
  name: string;
  providerType: ProviderType;
  description: string;
  stationIds: string[]; // station IDs or Codes served
  stationCodes: string[];
  stationNames?: string[];
  city: string;
  state: string;
  whatsappNumber: string;
  serviceDays: string;
  serviceHours: string;
  advanceNoticeHours: number;
  availabilityStatus: AvailabilityStatus;
  dietaryPreferences: DietaryPreferences;
  dietaryNotes: string;
  verificationStatus: 'verified' | 'unverified' | 'pending';
  published: boolean;
  lastVerifiedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderApplication {
  id: string;
  applicantName: string;
  providerName: string;
  providerType: ProviderType;
  stationIds: string[];
  stationCodes: string[];
  city: string;
  state: string;
  whatsappNumber: string;
  serviceDetails: string;
  serviceDays: string;
  serviceHours: string;
  advanceNoticeHours: number;
  dietaryPreferences: DietaryPreferences;
  dietaryNotes: string;
  publicationConsent: boolean;
  accuracyConfirmed: boolean;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  adminNotes?: string;
}

export type ReportReason =
  | 'incorrect_whatsapp'
  | 'inactive_provider'
  | 'incorrect_station'
  | 'inaccurate_dietary'
  | 'misleading_info'
  | 'other';

export interface Report {
  id: string;
  providerId: string;
  providerName: string;
  reason: ReportReason;
  description: string;
  contactEmail?: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  createdAt: string;
  resolvedAt?: string;
}

export interface WhatsAppPrefillData {
  stationName: string;
  trainNumber?: string;
  journeyDate?: string;
  arrivalTime?: string;
  passengersCount?: string;
  dietaryRequirements?: string[];
  specialNotes?: string;
}
