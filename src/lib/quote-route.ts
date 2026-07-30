import { quoteRates } from "./quote-rates";

export type GeocodeResult = {
  lat: number;
  lon: number;
  displayName: string;
};

export type RouteEstimate = {
  milesOneWay: number;
  travelHoursOneWay: number;
  meters: number;
  seconds: number;
  source: "osrm" | "haversine";
  destination: GeocodeResult;
};

const UA = "FAFOPetroQuoteCalculator/1.0 (https://www.fafopetro.com; contact Rkey@FAFOPETRO.com)";

export async function geocodeAddress(query: string): Promise<GeocodeResult> {
  const q = query.trim();
  if (!q) throw new Error("Enter a site address.");

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", q);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");
  url.searchParams.set("countrycodes", "us");

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json", "User-Agent": UA },
  });
  if (!res.ok) throw new Error("Address lookup failed — try again in a moment.");
  const data = (await res.json()) as Array<{
    lat: string;
    lon: string;
    display_name: string;
  }>;
  if (!data?.length) {
    throw new Error(
      "Couldn’t find that address. Add city/state (e.g. Greensboro, NC) and try again.",
    );
  }
  return {
    lat: Number(data[0].lat),
    lon: Number(data[0].lon),
    displayName: data[0].display_name,
  };
}

/** Driving route from home base → customer site (one way). */
export async function estimateRouteTo(
  siteAddress: string,
): Promise<RouteEstimate> {
  const destination = await geocodeAddress(siteAddress);
  const { lat: oLat, lon: oLon } = quoteRates.homeBase;
  const { lat: dLat, lon: dLon } = destination;

  try {
    const osrm = `https://router.project-osrm.org/route/v1/driving/${oLon},${oLat};${dLon},${dLat}?overview=false`;
    const res = await fetch(osrm, {
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const body = (await res.json()) as {
        code?: string;
        routes?: Array<{ distance: number; duration: number }>;
      };
      if (body.code === "Ok" && body.routes?.[0]) {
        const meters = body.routes[0].distance;
        const seconds = body.routes[0].duration;
        return {
          meters,
          seconds,
          milesOneWay: meters / 1609.344,
          travelHoursOneWay: seconds / 3600,
          source: "osrm",
          destination,
        };
      }
    }
  } catch {
    /* fall through to haversine */
  }

  const meters = haversineMeters(oLat, oLon, dLat, dLon) * 1.25; // road factor
  const hours = meters / 1609.344 / 40; // ~40 mph avg rural/highway mix
  return {
    meters,
    seconds: hours * 3600,
    milesOneWay: meters / 1609.344,
    travelHoursOneWay: hours,
    source: "haversine",
    destination,
  };
}

function haversineMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
