/**
 * Builds standard Google Maps search URL without needing a paid Maps SDK
 */
export function getGoogleMapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function getStationMapUrl(stationName: string, city: string): string {
  return getGoogleMapsUrl(`${stationName} Railway Station, ${city}, India`);
}
