/** Public service-call rates — single source of truth for the calculator. */
export const quoteRates = {
  laborPerHour: 65,
  mileagePerMile: 0.75,
  /** Currently bill one-way only (out to the site). */
  travelDirection: "one_way" as const,
  minOnSiteHours: 1,
  homeBase: {
    label: "FAFO Petro Services — Siler City, NC",
    address: "1787 W 3rd St, Siler City, NC 27344",
    /** Cached Nominatim result for home base */
    lat: 35.721064,
    lon: -79.4895419,
  },
  currency: "USD",
  note:
    "Estimates use drive distance/time from Siler City. Final invoice may adjust if traffic, access, or parts change the job. Minimum one hour on site.",
};

export type QuoteBreakdown = {
  milesOneWay: number;
  travelHoursOneWay: number;
  onSiteHours: number;
  laborCost: number;
  travelTimeCost: number;
  mileageCost: number;
  /** Minimum: 1 hr on-site + one-way travel time + one-way miles */
  minimumTotal: number;
  /** What round-trip travel would cost (same rates both ways) for savings display */
  roundTripTotal: number;
  savingsVsRoundTrip: number;
  laborRate: number;
  mileageRate: number;
};

export function computeQuote(
  milesOneWay: number,
  travelHoursOneWay: number,
  onSiteHours: number = quoteRates.minOnSiteHours,
): QuoteBreakdown {
  const onSite = Math.max(quoteRates.minOnSiteHours, onSiteHours);
  const miles = Math.max(0, milesOneWay);
  const travelH = Math.max(0, travelHoursOneWay);

  const laborCost = onSite * quoteRates.laborPerHour;
  const travelTimeCost = travelH * quoteRates.laborPerHour;
  const mileageCost = miles * quoteRates.mileagePerMile;

  const minimumTotal = laborCost + travelTimeCost + mileageCost;
  // Round-trip: 2× travel time + 2× mileage + same on-site labor
  const roundTripTotal =
    laborCost + 2 * travelTimeCost + 2 * mileageCost;
  const savingsVsRoundTrip = Math.max(0, roundTripTotal - minimumTotal);

  return {
    milesOneWay: round2(miles),
    travelHoursOneWay: round2(travelH),
    onSiteHours: round2(onSite),
    laborCost: round2(laborCost),
    travelTimeCost: round2(travelTimeCost),
    mileageCost: round2(mileageCost),
    minimumTotal: round2(minimumTotal),
    roundTripTotal: round2(roundTripTotal),
    savingsVsRoundTrip: round2(savingsVsRoundTrip),
    laborRate: quoteRates.laborPerHour,
    mileageRate: quoteRates.mileagePerMile,
  };
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export function formatMoney(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

export function formatHours(h: number) {
  if (h < 1 / 60) return "0 min";
  const mins = Math.round(h * 60);
  if (mins < 60) return `${mins} min`;
  const hr = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${hr}h ${m}m` : `${hr}h`;
}
