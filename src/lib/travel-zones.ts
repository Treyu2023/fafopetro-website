/** Travel zones radiate from FAFO home base (Siler City, NC) — road-biased, not crow-flies. */

export const HOME_BASE = {
  label: "Siler City, NC",
  address: "1787 W 3rd St, Siler City, NC 27344",
  lat: 35.7235,
  lng: -79.4622,
} as const;

/** Published travel rates */
export const TRAVEL_RATES = {
  hourly: 65,
  perMile: 0.75,
  milesPerZone: 55,
  /** Flat Verifone onboarding fee — per site, not per mile */
  verifoneOnboardingFlat: 100,
} as const;

/** Zone color tokens for map + legend */
export const ZONE_COLORS = [
  { zone: 1, fill: "rgba(52, 211, 153, 0.26)", stroke: "#34d399", label: "Zone 1" },
  { zone: 2, fill: "rgba(56, 189, 248, 0.24)", stroke: "#38bdf8", label: "Zone 2" },
  { zone: 3, fill: "rgba(251, 191, 36, 0.26)", stroke: "#fbbf24", label: "Zone 3" },
  { zone: 4, fill: "rgba(251, 146, 60, 0.26)", stroke: "#fb923c", label: "Zone 4" },
  { zone: 5, fill: "rgba(248, 113, 113, 0.26)", stroke: "#f87171", label: "Zone 5+" },
] as const;

export type TravelQuote = {
  zone: number;
  hours: number;
  milesBilled: number;
  laborTravel: number;
  mileage: number;
  /** Travel portion only (once per trip / day to the area) */
  travelTotal: number;
  /** Onboarding flats for N sites */
  onboarding: number;
  sites: number;
  /** travelTotal + onboarding */
  total: number;
  /** Misleading "if you paid full stack per site" comparison */
  ifPerSiteStack: number;
};

/**
 * Each zone step = +1 hour travel time + +55 miles billed.
 * Zone from road-biased miles: ceil(miles / 55), minimum 1.
 */
export function zoneFromMiles(miles: number): number {
  if (!Number.isFinite(miles) || miles <= 0) return 1;
  return Math.max(1, Math.ceil(miles / TRAVEL_RATES.milesPerZone));
}

export function quoteForZone(
  zone: number,
  sites = 1,
  includeOnboarding = true,
): TravelQuote {
  const z = Math.max(1, Math.floor(zone));
  const siteCount = Math.max(1, Math.floor(sites));
  const hours = z;
  const milesBilled = z * TRAVEL_RATES.milesPerZone;
  const laborTravel = hours * TRAVEL_RATES.hourly;
  const mileage = milesBilled * TRAVEL_RATES.perMile;
  const travelTotal = laborTravel + mileage;
  const onboarding = includeOnboarding
    ? TRAVEL_RATES.verifoneOnboardingFlat * siteCount
    : 0;
  const total = travelTotal + onboarding;
  const ifPerSiteStack = (travelTotal + (includeOnboarding ? TRAVEL_RATES.verifoneOnboardingFlat : 0)) * siteCount;
  return {
    zone: z,
    hours,
    milesBilled,
    laborTravel,
    mileage,
    travelTotal,
    onboarding,
    sites: siteCount,
    total,
    ifPerSiteStack,
  };
}

export function quoteFromMiles(
  miles: number,
  sites = 1,
  includeOnboarding = true,
): TravelQuote {
  return quoteForZone(zoneFromMiles(miles), sites, includeOnboarding);
}

export function haversineMiles(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 3958.8;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Road-biased distance from home — not crow-flies.
 * NC corridors (I-40 / I-85 / US-421 style) stretch E–W more efficiently than
 * pure N–S "off-road" cuts. Factor is approximate for quoting ideas only.
 */
export function roadMilesFromHome(lat: number, lng: number): number {
  const straight = haversineMiles(HOME_BASE.lat, HOME_BASE.lng, lat, lng);
  const dLat = lat - HOME_BASE.lat;
  const dLng = lng - HOME_BASE.lng;
  // Prefer highway-like E–W: slightly lower multiplier; N–S more winding
  const eastWestShare =
    Math.abs(dLng) / (Math.abs(dLat) + Math.abs(dLng) + 1e-6);
  const corridorFactor = 1.18 + (1 - eastWestShare) * 0.22; // ~1.18–1.40
  return straight * corridorFactor;
}

/** Common NC markets with optional simplified road waypoints (lat/lng chains) for path draw */
export const PRESET_SITES: {
  name: string;
  lat: number;
  lng: number;
  /** Intermediate road-ish waypoints from home (excluding home & destination) */
  via?: { lat: number; lng: number }[];
  note?: string;
}[] = [
  { name: "Siler City (home)", lat: 35.7235, lng: -79.4622, note: "Local" },
  {
    name: "Asheboro",
    lat: 35.7079,
    lng: -79.8136,
    via: [{ lat: 35.72, lng: -79.64 }],
  },
  {
    name: "Greensboro",
    lat: 36.0726,
    lng: -79.792,
    via: [
      { lat: 35.85, lng: -79.55 },
      { lat: 36.0, lng: -79.72 },
    ],
  },
  {
    name: "High Point",
    lat: 35.9557,
    lng: -80.0053,
    via: [
      { lat: 35.85, lng: -79.65 },
      { lat: 35.92, lng: -79.9 },
    ],
  },
  {
    name: "Winston-Salem",
    lat: 36.0999,
    lng: -80.2442,
    via: [
      { lat: 35.9, lng: -79.7 },
      { lat: 36.05, lng: -80.05 },
    ],
  },
  {
    name: "Chapel Hill",
    lat: 35.9132,
    lng: -79.0558,
    via: [{ lat: 35.82, lng: -79.25 }],
  },
  {
    name: "Durham",
    lat: 35.994,
    lng: -78.8986,
    via: [
      { lat: 35.82, lng: -79.25 },
      { lat: 35.95, lng: -79.05 },
    ],
  },
  {
    name: "Raleigh",
    lat: 35.7796,
    lng: -78.6382,
    via: [
      { lat: 35.75, lng: -79.15 },
      { lat: 35.78, lng: -78.9 },
    ],
  },
  {
    name: "Cary",
    lat: 35.7915,
    lng: -78.7811,
    via: [
      { lat: 35.75, lng: -79.15 },
      { lat: 35.78, lng: -78.95 },
    ],
  },
  {
    name: "Burlington",
    lat: 36.0957,
    lng: -79.4378,
    via: [{ lat: 35.95, lng: -79.45 }],
  },
  {
    name: "Sanford",
    lat: 35.4799,
    lng: -79.1803,
    via: [{ lat: 35.6, lng: -79.32 }],
  },
  {
    name: "Fayetteville",
    lat: 35.0527,
    lng: -78.8784,
    via: [
      { lat: 35.55, lng: -79.2 },
      { lat: 35.25, lng: -79.0 },
    ],
  },
  {
    name: "Charlotte",
    lat: 35.2271,
    lng: -80.8431,
    via: [
      { lat: 35.65, lng: -79.9 },
      { lat: 35.4, lng: -80.4 },
    ],
  },
  {
    name: "Wilmington",
    lat: 34.2257,
    lng: -77.9447,
    via: [
      { lat: 35.5, lng: -79.0 },
      { lat: 34.8, lng: -78.4 },
    ],
  },
  {
    name: "Asheville",
    lat: 35.5951,
    lng: -82.5515,
    via: [
      { lat: 35.7, lng: -80.2 },
      { lat: 35.6, lng: -81.5 },
    ],
  },
];

export function formatUsd(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
}

/**
 * Irregular zone ring path for SVG — stretched along highway corridors
 * (more E–W reach than N–S) so it doesn't look like crow-flies circles.
 * `radiusMiles` is approximate outer edge of the zone band.
 */
export function zoneBlobPath(
  cx: number,
  cy: number,
  radiusPx: number,
  zone: number,
  points = 48,
): string {
  const parts: string[] = [];
  for (let i = 0; i <= points; i++) {
    const t = (i / points) * Math.PI * 2;
    // Highway bias: wider east-west; wobble so bands aren't perfect ellipses
    const corridor =
      1 +
      0.22 * Math.cos(t) * Math.cos(t) - // stretch E–W
      0.12 * Math.sin(t) * Math.sin(t); // squeeze N–S
    const wobble =
      1 +
      0.06 * Math.sin(t * 3 + zone) +
      0.04 * Math.cos(t * 5 - zone * 0.7);
    const r = radiusPx * corridor * wobble;
    const x = cx + Math.cos(t) * r;
    const y = cy + Math.sin(t) * r * 0.88;
    parts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return `${parts.join(" ")} Z`;
}

/** Project lat/lng to SVG coords for NC-ish map around Siler City */
export function projectToSvg(
  lat: number,
  lng: number,
  cx = 200,
  cy = 175,
  pxPerDegLat = 95,
  pxPerDegLng = 78,
): { x: number; y: number } {
  return {
    x: cx + (lng - HOME_BASE.lng) * pxPerDegLng,
    y: cy - (lat - HOME_BASE.lat) * pxPerDegLat,
  };
}
