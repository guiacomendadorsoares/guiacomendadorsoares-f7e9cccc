// Provider-agnostic geocoding. Today: Nominatim (OpenStreetMap). Tomorrow: swap
// the body of these functions for Google Geocoding without changing call sites
// or the database schema (we only ever persist {lat, lng}).

export interface GeocodeResult {
  lat: number;
  lng: number;
  displayName: string;
}

export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  const q = address.trim();
  if (!q) return null;
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&q=${encodeURIComponent(q)}`;
  const res = await fetch(url, { headers: { "Accept-Language": "pt-BR" } });
  if (!res.ok) return null;
  const data = (await res.json()) as Array<{ lat: string; lon: string; display_name: string }>;
  if (!data?.length) return null;
  return { lat: Number(data[0].lat), lng: Number(data[0].lon), displayName: data[0].display_name };
}

export function directionsUrl(lat: number, lng: number, label?: string): string {
  // Universal "Como chegar" — opens Google Maps in app or browser
  const q = label ? `${label} @${lat},${lng}` : `${lat},${lng}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${lat},${lng}`)}&destination_place_id=${encodeURIComponent(q)}`;
}
