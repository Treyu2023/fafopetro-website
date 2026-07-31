import { useMemo, useState } from "react";
import {
  HOME_BASE,
  PRESET_SITES,
  TRAVEL_RATES,
  ZONE_COLORS,
  formatUsd,
  projectToSvg,
  quoteForZone,
  quoteFromMiles,
  roadMilesFromHome,
  zoneBlobPath,
  zoneFromMiles,
} from "@/lib/travel-zones";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function TravelZoneMap({
  includeOnboarding = true,
  title = "Road-style travel zones from Siler City",
}: {
  includeOnboarding?: boolean;
  title?: string;
}) {
  const [milesInput, setMilesInput] = useState("55");
  const [selectedCity, setSelectedCity] = useState<string | null>("Raleigh");
  const [sites, setSites] = useState(1);
  const [routePts, setRoutePts] = useState<{ x: number; y: number }[]>(() => {
    const raleigh = PRESET_SITES.find((s) => s.name === "Raleigh")!;
    return buildRoute(raleigh.lat, raleigh.lng, raleigh.via);
  });

  const miles = Math.max(0, Number.parseFloat(milesInput) || 0);
  const quote = useMemo(
    () => quoteFromMiles(miles, sites, includeOnboarding),
    [miles, sites, includeOnboarding],
  );

  function pickCity(
    name: string,
    lat: number,
    lng: number,
    via?: { lat: number; lng: number }[],
  ) {
    setSelectedCity(name);
    const road = Math.round(roadMilesFromHome(lat, lng));
    setMilesInput(String(Math.max(1, road)));
    setRoutePts(buildRoute(lat, lng, via));
  }

  function pickZone(z: number) {
    setSelectedCity(null);
    // Mid-band road miles for that zone
    setMilesInput(String(z * TRAVEL_RATES.milesPerZone - 10));
    setRoutePts([]);
  }

  const cx = 200;
  const cy = 175;
  // Outer radius of zone N in px (road bands, not equal crow-flies rings)
  const zoneRadiusPx = (z: number) => 38 + z * 32;

  const routePath =
    routePts.length > 1
      ? routePts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ")
      : "";

  return (
    <div className="lit-panel overflow-hidden rounded-[var(--radius-2xl)]">
      <div className="relative z-[1] grid gap-6 p-5 md:grid-cols-2 md:p-7">
        <div>
          <p className="font-condensed text-xs font-bold uppercase tracking-[0.22em] text-primary">
            {title}
          </p>
          <p className="mt-2 text-sm text-muted leading-relaxed">
            Home base: {HOME_BASE.address}. Bands follow{" "}
            <strong className="text-fg">road-style reach</strong> (highway
            corridors stretch farther than “as the crow flies”) — approximate,
            for an idea only. Each band steps{" "}
            <strong className="text-fg">+1 hour</strong> and{" "}
            <strong className="text-fg">+{TRAVEL_RATES.milesPerZone} mi</strong>{" "}
            of travel billing.
          </p>
          <p className="mt-2 text-xs text-subtle">
            Rates: {formatUsd(TRAVEL_RATES.hourly)}/hr travel ·{" "}
            {formatUsd(TRAVEL_RATES.perMile)}/mi ·{" "}
            {includeOnboarding
              ? `${formatUsd(TRAVEL_RATES.verifoneOnboardingFlat)} onboarding flat per site`
              : "service fee quoted separately"}
            . Final pricing is available by text once we confirm addresses.
          </p>

          <div className="mt-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="miles">Road miles from base (approx.)</Label>
                <Input
                  id="miles"
                  type="number"
                  min={0}
                  step={1}
                  value={milesInput}
                  onChange={(e) => {
                    setSelectedCity(null);
                    setMilesInput(e.target.value);
                    setRoutePts([]);
                  }}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="sites">Sites same trip / day</Label>
                <Input
                  id="sites"
                  type="number"
                  min={1}
                  max={20}
                  step={1}
                  value={sites}
                  onChange={(e) =>
                    setSites(Math.max(1, Math.min(20, Number(e.target.value) || 1)))
                  }
                  className="mt-1.5"
                />
                <p className="mt-1 text-[11px] text-subtle">
                  Travel once · onboarding × sites
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {PRESET_SITES.map((s) => {
                const m = Math.round(roadMilesFromHome(s.lat, s.lng));
                const z = zoneFromMiles(m);
                const color = ZONE_COLORS[Math.min(z, 5) - 1];
                return (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => pickCity(s.name, s.lat, s.lng, s.via)}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                      selectedCity === s.name
                        ? "border-primary bg-primary/20 text-primary"
                        : "border-border text-muted hover:border-primary/40 hover:text-fg",
                    )}
                    style={
                      selectedCity === s.name
                        ? undefined
                        : { borderColor: color.stroke + "55" }
                    }
                  >
                    {s.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quote card */}
          <div className="mt-5 rounded-[var(--radius-lg)] border border-primary/25 bg-bg-elevated/80 p-4">
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-sign text-2xl uppercase tracking-wide text-primary">
                Zone {quote.zone}
                {selectedCity ? (
                  <span className="ml-2 font-condensed text-sm tracking-wide text-muted">
                    · {selectedCity}
                  </span>
                ) : null}
              </span>
              <span className="font-sign text-3xl text-fg sign-outline-amber">
                {formatUsd(quote.total)}
              </span>
            </div>

            <ul className="mt-3 space-y-1.5 text-sm text-muted">
              <li className="flex justify-between gap-4">
                <span>
                  Travel this trip ({quote.hours} hr × {formatUsd(TRAVEL_RATES.hourly)})
                </span>
                <span className="text-fg tabular-nums">{formatUsd(quote.laborTravel)}</span>
              </li>
              <li className="flex justify-between gap-4">
                <span>
                  Mileage band ({quote.milesBilled} mi × {formatUsd(TRAVEL_RATES.perMile)})
                </span>
                <span className="text-fg tabular-nums">{formatUsd(quote.mileage)}</span>
              </li>
              <li className="flex justify-between gap-4 text-xs text-subtle">
                <span>Travel subtotal (once per day / trip to the area)</span>
                <span className="tabular-nums">{formatUsd(quote.travelTotal)}</span>
              </li>
              {includeOnboarding ? (
                <li className="flex justify-between gap-4">
                  <span>
                    Onboarding ({formatUsd(TRAVEL_RATES.verifoneOnboardingFlat)} ×{" "}
                    {quote.sites} site{quote.sites === 1 ? "" : "s"})
                  </span>
                  <span className="text-fg tabular-nums">{formatUsd(quote.onboarding)}</span>
                </li>
              ) : null}
              <li className="flex justify-between gap-4 border-t border-border pt-2 font-medium text-fg">
                <span>Estimated total</span>
                <span className="tabular-nums">{formatUsd(quote.total)}</span>
              </li>
            </ul>

            {quote.sites > 1 ? (
              <p className="mt-3 rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-muted leading-relaxed">
                <strong className="text-fg">Multi-site same trip:</strong> you do{" "}
                <em>not</em> pay full travel per store. Example idea:{" "}
                {quote.sites} sites near each other → travel about{" "}
                <strong className="text-fg">{formatUsd(quote.travelTotal)}</strong>{" "}
                once, plus{" "}
                <strong className="text-fg">
                  {formatUsd(TRAVEL_RATES.verifoneOnboardingFlat)}
                </strong>{" "}
                per site (
                <strong className="text-fg">{formatUsd(quote.onboarding)}</strong>
                ). Not {formatUsd(quote.ifPerSiteStack)} as if travel stacked{" "}
                {quote.sites}×.
              </p>
            ) : null}

            <div className="mt-3 space-y-2 text-xs text-subtle leading-relaxed">
              <p>
                <strong className="text-muted">Pricing is available</strong> —
                this map is a planning guide. Text the addresses for a firm
                number.
              </p>
              <p>
                <strong className="text-muted">Time & materials caveat:</strong>{" "}
                zone travel covers the band for that trip (the included hour(s)
                for the zone). If actual travel or on-site work runs{" "}
                <strong className="text-fg">beyond that allotment</strong> (e.g.
                more than the included hour of travel time for Zone 1, or the
                job expands on site), we switch the overage to{" "}
                <strong className="text-fg">time & materials</strong> at
                published rates instead of pretending the zone still fits.
              </p>
            </div>
          </div>
        </div>

        {/* Map: road-ish blobs + route path */}
        <div className="flex flex-col">
          <div className="relative aspect-square w-full overflow-hidden rounded-[var(--radius-xl)] border border-border bg-[#0a121c]">
            <svg viewBox="0 0 400 350" className="h-full w-full" aria-hidden="true">
              <defs>
                <radialGradient id="asphalt2" cx="50%" cy="50%" r="70%">
                  <stop offset="0%" stopColor="#152838" />
                  <stop offset="100%" stopColor="#06090e" />
                </radialGradient>
                <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <rect width="400" height="350" fill="url(#asphalt2)" />
              {/* faint corridor lines (highway suggestion) */}
              <path
                d="M20 190 Q120 170 200 175 T380 160"
                fill="none"
                stroke="rgba(255,177,42,0.12)"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                d="M200 20 Q210 100 200 175 T190 330"
                fill="none"
                stroke="rgba(232,246,255,0.08)"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M40 80 Q120 40 200 55 T360 90 L340 280 Q200 320 60 270 Z"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="2"
              />

              {/* Zone bands: irregular road-style blobs (outer first) */}
              {[5, 4, 3, 2, 1].map((z) => {
                const color = ZONE_COLORS[Math.min(z, 5) - 1];
                const r = zoneRadiusPx(z);
                return (
                  <path
                    key={z}
                    d={zoneBlobPath(cx, cy, r, z)}
                    fill={color.fill}
                    stroke={color.stroke}
                    strokeWidth={quote.zone === z ? 2.5 : 1.25}
                    className="cursor-pointer"
                    onClick={() => pickZone(z)}
                    opacity={quote.zone === z ? 1 : 0.88}
                  />
                );
              })}

              {/* Travel path (road-ish polyline) */}
              {routePath ? (
                <>
                  <path
                    d={routePath}
                    fill="none"
                    stroke="rgba(255,177,42,0.35)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d={routePath}
                    fill="none"
                    stroke="#ffb12a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="6 5"
                    filter="url(#softGlow)"
                  />
                </>
              ) : null}

              {/* Home pin */}
              <circle
                cx={cx}
                cy={cy}
                r={7}
                fill="var(--color-primary)"
                stroke="#fff8e0"
                strokeWidth="2"
              />
              <text
                x={cx}
                y={cy - 14}
                textAnchor="middle"
                fill="#ffb12a"
                fontSize="11"
                fontFamily="Oswald, sans-serif"
                fontWeight="600"
              >
                HOME
              </text>

              {/* Destination pin */}
              {routePts.length > 1 ? (
                <>
                  <circle
                    cx={routePts[routePts.length - 1].x}
                    cy={routePts[routePts.length - 1].y}
                    r={5}
                    fill="#38bdf8"
                    stroke="#fff"
                    strokeWidth="1.5"
                  />
                </>
              ) : null}
            </svg>
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
              {ZONE_COLORS.map((c) => {
                const q = quoteForZone(c.zone, sites, includeOnboarding);
                return (
                  <button
                    key={c.zone}
                    type="button"
                    onClick={() => pickZone(c.zone)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-semibold uppercase tracking-wide backdrop-blur-sm",
                      quote.zone === c.zone
                        ? "border-white/40 bg-black/50 text-fg"
                        : "border-white/10 bg-black/35 text-muted",
                    )}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: c.stroke }}
                    />
                    Z{c.zone}
                    <span className="text-subtle normal-case tracking-normal">
                      {formatUsd(q.travelTotal)}
                      {includeOnboarding && sites > 1
                        ? `+${formatUsd(q.onboarding)}`
                        : includeOnboarding
                          ? `+${formatUsd(TRAVEL_RATES.verifoneOnboardingFlat)}`
                          : ""}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <p className="mt-2 text-center text-[11px] text-subtle">
            Amber dashed line = sample road-style path (not GPS). Bands ≠ perfect
            circles.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button asChild size="sm" className="font-condensed uppercase tracking-wider">
              <a href="sms:+19728771848">Text for firm pricing</a>
            </Button>
            <Button asChild size="sm" variant="secondary" className="font-condensed uppercase tracking-wider">
              <a href="/request">Request form</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function buildRoute(
  lat: number,
  lng: number,
  via?: { lat: number; lng: number }[],
): { x: number; y: number }[] {
  const pts = [
    { lat: HOME_BASE.lat, lng: HOME_BASE.lng },
    ...(via ?? []),
    { lat, lng },
  ];
  return pts.map((p) => projectToSvg(p.lat, p.lng));
}
