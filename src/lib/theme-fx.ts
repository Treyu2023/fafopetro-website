import type { ThemeId } from "@/lib/themes";

/** Visual personality for the canvas PointerFx layer per theme. */
export type ThemeFxProfile = {
  id: ThemeId;
  /** Max live particles (soft cap) */
  maxParticles: number;
  /** Ambient spawn rate while idle (per second) */
  ambientRate: number;
  /** Extra particles while pointer moves (per second, scaled by speed) */
  moveRate: number;
  /** Delayed ghost trail samples (ms lookback) */
  trailDelayMs: number;
  trailCount: number;
  /** Proximity warp radius in CSS px */
  warpRadius: number;
  warpStrength: number;
  /** Particle palette (css colors) */
  colors: string[];
  /** Glow / additive feel */
  additive: boolean;
  /** Wind bias (dust storms) */
  windX: number;
  windY: number;
  /** Gravity (embers rise = negative) */
  gravity: number;
  /** Base size range */
  sizeMin: number;
  sizeMax: number;
  /** Life seconds */
  lifeMin: number;
  lifeMax: number;
  /** Behavior preset */
  style: "embers" | "sparks" | "motes" | "steel" | "dust";
  /** Click burst intensity */
  burst: number;
  label: string;
};

export const THEME_FX: Record<ThemeId, ThemeFxProfile> = {
  "amber-field": {
    id: "amber-field",
    maxParticles: 140,
    ambientRate: 8,
    moveRate: 55,
    trailDelayMs: 140,
    trailCount: 5,
    warpRadius: 120,
    warpStrength: 0.35,
    colors: ["#e8a317", "#f5c542", "#ff8c1a", "#ff6b00", "#ffe08a"],
    additive: true,
    windX: 0.02,
    windY: -0.04,
    gravity: -0.012,
    sizeMin: 1.2,
    sizeMax: 3.8,
    lifeMin: 0.6,
    lifeMax: 1.8,
    style: "embers",
    burst: 28,
    label: "Fuel embers + delayed heat ghosts",
  },
  "hi-vis": {
    id: "hi-vis",
    maxParticles: 160,
    ambientRate: 6,
    moveRate: 70,
    trailDelayMs: 90,
    trailCount: 4,
    warpRadius: 100,
    warpStrength: 0.45,
    colors: ["#f97316", "#fb923c", "#38bdf8", "#7dd3fc", "#facc15"],
    additive: true,
    windX: 0.01,
    windY: 0.02,
    gravity: 0.02,
    sizeMin: 1,
    sizeMax: 3.2,
    lifeMin: 0.35,
    lifeMax: 1.1,
    style: "sparks",
    burst: 36,
    label: "Jobsite sparks + cyan flash trails",
  },
  daylight: {
    id: "daylight",
    maxParticles: 90,
    ambientRate: 10,
    moveRate: 28,
    trailDelayMs: 180,
    trailCount: 6,
    warpRadius: 140,
    warpStrength: 0.22,
    colors: ["#94a3b8", "#cbd5e1", "#0d9488", "#1e3a5f", "#e2e8f0"],
    additive: false,
    windX: 0.015,
    windY: -0.01,
    gravity: -0.004,
    sizeMin: 1.5,
    sizeMax: 4.5,
    lifeMin: 1.2,
    lifeMax: 2.8,
    style: "motes",
    burst: 16,
    label: "Soft paper motes + calm light ring",
  },
  pipeline: {
    id: "pipeline",
    maxParticles: 120,
    ambientRate: 5,
    moveRate: 48,
    trailDelayMs: 160,
    trailCount: 7,
    warpRadius: 130,
    warpStrength: 0.5,
    colors: ["#7eb8d4", "#94a3b8", "#38bdf8", "#e2e8f0", "#475569"],
    additive: true,
    windX: 0.03,
    windY: 0.01,
    gravity: 0.008,
    sizeMin: 0.9,
    sizeMax: 2.8,
    lifeMin: 0.5,
    lifeMax: 1.6,
    style: "steel",
    burst: 24,
    label: "Steel chips + chromatic delay ghosts",
  },
  sandstone: {
    id: "sandstone",
    maxParticles: 180,
    ambientRate: 18,
    moveRate: 60,
    trailDelayMs: 200,
    trailCount: 8,
    warpRadius: 160,
    warpStrength: 0.4,
    colors: ["#d6b98c", "#b45309", "#c4a574", "#8a7b6b", "#efe8dc", "#0f766e"],
    additive: false,
    windX: 0.08,
    windY: 0.01,
    gravity: 0.015,
    sizeMin: 1.2,
    sizeMax: 4.2,
    lifeMin: 0.8,
    lifeMax: 2.4,
    style: "dust",
    burst: 40,
    label: "Dust storm + wind drift + sand ghosts",
  },
};

export function getThemeFx(id: ThemeId): ThemeFxProfile {
  return THEME_FX[id] ?? THEME_FX["amber-field"];
}
