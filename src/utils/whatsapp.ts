import type { WhatsAppPrefillData } from '../types';

/**
 * Normalizes phone numbers to standard international format without +, spaces or special chars.
 * If 10 digits are provided, assumes Indian country code (91).
 */
export function normalizeWhatsAppNumber(rawNumber: string): string {
  // Strip non-digits
  const digitsOnly = rawNumber.replace(/\D/g, '');

  if (!digitsOnly) return '';

  // If 10 digits (standard Indian mobile number), prepend 91
  if (digitsOnly.length === 10) {
    return `91${digitsOnly}`;
  }

  // If already starts with 91 and has 12 digits
  if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
    return digitsOnly;
  }

  // If starts with 0 and has 11 digits (e.g. 09876543210)
  if (digitsOnly.length === 11 && digitsOnly.startsWith('0')) {
    return `91${digitsOnly.slice(1)}`;
  }

  return digitsOnly;
}

/**
 * Validates whether the normalized number meets WhatsApp's international format
 */
export function isValidWhatsAppNumber(number: string): boolean {
  const normalized = normalizeWhatsAppNumber(number);
  // International format typically ranges from 10 to 15 digits
  return /^[1-9]\d{9,14}$/.test(normalized);
}

/**
 * Builds the prefilled message for WhatsApp coordination
 */
export function buildPrasadamWhatsAppMessage(data: WhatsAppPrefillData): string {
  const parts: string[] = [
    'Hare Krishna!',
    '',
    'I found your prasadam service through YatraPrasadam.',
    '',
    `*Station:* ${data.stationName || 'Not specified'}`,
  ];

  if (data.trainNumber?.trim()) {
    parts.push(`*Train number/name:* ${data.trainNumber.trim()}`);
  }

  if (data.journeyDate?.trim()) {
    parts.push(`*Journey date:* ${data.journeyDate.trim()}`);
  }

  if (data.arrivalTime?.trim()) {
    parts.push(`*Approximate arrival time:* ${data.arrivalTime.trim()}`);
  }

  if (data.passengersCount?.trim()) {
    parts.push(`*Number of people:* ${data.passengersCount.trim()}`);
  }

  if (data.dietaryRequirements && data.dietaryRequirements.length > 0) {
    parts.push(`*Dietary requirements:* ${data.dietaryRequirements.join(', ')}`);
  }

  if (data.specialNotes?.trim()) {
    parts.push(`*Additional note:* ${data.specialNotes.trim()}`);
  }

  parts.push('');
  parts.push('Could you please confirm whether prasadam can be arranged at the station/platform?');
  parts.push('');
  parts.push('Thank you. Hare Krishna!');

  return parts.join('\n');
}

/**
 * Generates the WhatsApp click-to-chat URL using the standard wa.me format
 */
export function getWhatsAppUrl(rawPhone: string, message: string): string | null {
  const normalized = normalizeWhatsAppNumber(rawPhone);
  if (!isValidWhatsAppNumber(normalized)) {
    return null;
  }
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${normalized}?text=${encodedText}`;
}
