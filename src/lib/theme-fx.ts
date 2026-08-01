import type { ThemeId } from "@/lib/themes";

/** Visual personality for the canvas PointerFx layer per theme. */
export type ThemeFxProfile = {
  id: ThemeId;
  maxParticles: number;
  ambientRate: number;
  moveRate: number;
  trailDelayMs: number;
  trailCount: number;
  warpRadius: number;
  warpStrength: number;
  colors: string[];
  /** Secondary palette for blooms / ribbons */
  glowColors: string[];
  additive: boolean;
  windX: number;
  windY: number;
  gravity: number;
  sizeMin: number;
  sizeMax: number;
  lifeMin: number;
  lifeMax: number;
  style: "embers" | "sparks" | "motes" | "steel" | "dust";
  burst: number;
  /** Ribbon trail segments along pointer path */
  ribbon: boolean;
  ribbonWidth: number;
  /** Soft full-screen haze intensity 0–1 */
  haze: number;
  /** Shockwave rings on click */
  shockwave: boolean;
  label: string;
};

export const THEME_FX: Record<ThemeId, ThemeFxProfile> = {
  "amber-field": {
    id: "amber-field",
    maxParticles: 280,
    ambientRate: 22,
    moveRate: 110,
    trailDelayMs: 160,
    trailCount: 8,
    warpRadius: 160,
    warpStrength: 0.55,
    colors: ["#e8a317", "#f5c542", "#ff8c1a", "#ff6b00", "#ffe08a", "#ffb347"],
    glowColors: ["#ff6b00", "#e8a317", "#ffd27a"],
    additive: true,
    windX: 0.03,
    windY: -0.06,
    gravity: -0.018,
    sizeMin: 1.4,
    sizeMax: 5.5,
    lifeMin: 0.7,
    lifeMax: 2.2,
    style: "embers",
    burst: 48,
    ribbon: true,
    ribbonWidth: 2.4,
    haze: 0.12,
    shockwave: true,
    label: "Fuel embers + heat ribbon + delayed ghosts",
  },
  "hi-vis": {
    id: "hi-vis",
    maxParticles: 320,
    ambientRate: 14,
    moveRate: 140,
    trailDelayMs: 70,
    trailCount: 6,
    warpRadius: 130,
    warpStrength: 0.7,
    colors: ["#f97316", "#fb923c", "#38bdf8", "#7dd3fc", "#facc15", "#ffffff"],
    glowColors: ["#38bdf8", "#f97316", "#facc15"],
    additive: true,
    windX: 0.02,
    windY: 0.03,
    gravity: 0.025,
    sizeMin: 1.1,
    sizeMax: 4.2,
    lifeMin: 0.28,
    lifeMax: 1.0,
    style: "sparks",
    burst: 56,
    ribbon: true,
    ribbonWidth: 1.8,
    haze: 0.08,
    shockwave: true,
    label: "Jobsite sparks + cyan flash + shock rings",
  },
  daylight: {
    id: "daylight",
    maxParticles: 180,
    ambientRate: 18,
    moveRate: 48,
    trailDelayMs: 220,
    trailCount: 10,
    warpRadius: 180,
    warpStrength: 0.32,
    colors: ["#94a3b8", "#cbd5e1", "#0d9488", "#1e3a5f", "#e2e8f0", "#ffffff"],
    glowColors: ["#0d9488", "#94a3b8", "#1e3a5f"],
    additive: false,
    windX: 0.02,
    windY: -0.015,
    gravity: -0.006,
    sizeMin: 2.0,
    sizeMax: 6.5,
    lifeMin: 1.4,
    lifeMax: 3.2,
    style: "motes",
    burst: 28,
    ribbon: true,
    ribbonWidth: 3.2,
    haze: 0.06,
    shockwave: false,
    label: "Paper motes + soft light ribbon + calm warp",
  },
  pipeline: {
    id: "pipeline",
    maxParticles: 260,
    ambientRate: 12,
    moveRate: 95,
    trailDelayMs: 180,
    trailCount: 12,
    warpRadius: 170,
    warpStrength: 0.75,
    colors: ["#7eb8d4", "#94a3b8", "#38bdf8", "#e2e8f0", "#475569", "#bae6fd"],
    glowColors: ["#38bdf8", "#f87171", "#7eb8d4"],
    additive: true,
    windX: 0.04,
    windY: 0.015,
    gravity: 0.01,
    sizeMin: 1.0,
    sizeMax: 3.6,
    lifeMin: 0.55,
    lifeMax: 1.8,
    style: "steel",
    burst: 40,
    ribbon: true,
    ribbonWidth: 1.6,
    haze: 0.1,
    shockwave: true,
    label: "Steel chips + chromatic ghosts + hard warp",
  },
  sandstone: {
    id: "sandstone",
    maxParticles: 380,
    ambientRate: 42,
    moveRate: 130,
    trailDelayMs: 240,
    trailCount: 14,
    warpRadius: 200,
    warpStrength: 0.6,
    colors: ["#d6b98c", "#b45309", "#c4a574", "#8a7b6b", "#efe8dc", "#0f766e", "#a16207"],
    glowColors: ["#b45309", "#d6b98c", "#0f766e"],
    additive: false,
    windX: 0.14,
    windY: 0.02,
    gravity: 0.02,
    sizeMin: 1.5,
    sizeMax: 5.8,
    lifeMin: 0.9,
    lifeMax: 2.8,
    style: "dust",
    burst: 64,
    ribbon: true,
    ribbonWidth: 2.8,
    haze: 0.18,
    shockwave: true,
    label: "Full dust storm + wind sheets + sand ghosts",
  },
};

export function getThemeFx(id: ThemeId): ThemeFxProfile {
  return THEME_FX[id] ?? THEME_FX["amber-field"];
}
