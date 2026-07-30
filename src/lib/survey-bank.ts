import type { SurveyContext } from "./sites-types";

export type SurveyQuestion = {
  id: string;
  prompt: string;
  placeholder?: string;
  kind: "text" | "select" | "yesno";
  options?: string[];
  /** How much this answer moves completeness (0–100 scale pieces). */
  weight: number;
  fieldKey: string;
};

/**
 * Progressive / contextual micro-survey bank.
 * Each tool session only asks a few unanswered questions for that context.
 */
export const SURVEY_BY_CONTEXT: Record<SurveyContext, SurveyQuestion[]> = {
  general: [
    {
      id: "hours",
      fieldKey: "hours",
      prompt: "Store hours (or 24hr)?",
      placeholder: "e.g. 6am–11pm / 24hr",
      kind: "text",
      weight: 5,
    },
    {
      id: "mgr_contact",
      fieldKey: "managerContact",
      prompt: "Manager or key-holder name / phone?",
      placeholder: "Optional",
      kind: "text",
      weight: 8,
    },
    {
      id: "chain",
      fieldKey: "chainFlag",
      prompt: "Independent or chain/branded?",
      kind: "select",
      options: ["Independent", "Chain / branded", "Dealer / jobber", "Not sure"],
      weight: 4,
    },
  ],
  create_site: [
    {
      id: "pump_count",
      fieldKey: "pumpCount",
      prompt: "About how many dispensers / MPDs?",
      placeholder: "e.g. 4, 8, 12",
      kind: "text",
      weight: 8,
    },
    {
      id: "pos_brand",
      fieldKey: "posBrand",
      prompt: "POS / console brand if known?",
      kind: "select",
      options: [
        "Gilbarco Passport",
        "Wayne Nucleus / Orbic",
        "Verifone Commander / Ruby",
        "Radiant / NCR",
        "Other / unknown",
      ],
      weight: 10,
    },
    {
      id: "atg_present",
      fieldKey: "hasAtg",
      prompt: "Is there an ATG / tank monitor on site?",
      kind: "yesno",
      weight: 6,
    },
  ],
  topography: [
    {
      id: "tank_side",
      fieldKey: "tankFarmSide",
      prompt: "Where is the tank farm relative to the building?",
      kind: "select",
      options: [
        "Front / street",
        "Rear of building",
        "Left side",
        "Right side",
        "Under canopy only",
        "Not sure",
      ],
      weight: 10,
    },
    {
      id: "grade",
      fieldKey: "siteGrade",
      prompt: "Site grade / drainage notes?",
      placeholder: "Slope, low spots, water issues…",
      kind: "text",
      weight: 6,
    },
    {
      id: "canopy_count",
      fieldKey: "canopyCount",
      prompt: "How many canopies?",
      placeholder: "1, 2…",
      kind: "text",
      weight: 4,
    },
  ],
  tanks: [
    {
      id: "tank_count",
      fieldKey: "tankCount",
      prompt: "How many USTs (if known)?",
      placeholder: "e.g. 3",
      kind: "text",
      weight: 10,
    },
    {
      id: "products",
      fieldKey: "products",
      prompt: "Products (regular / mid / premium / diesel)?",
      placeholder: "e.g. R/M/P + diesel",
      kind: "text",
      weight: 8,
    },
    {
      id: "atg_brand",
      fieldKey: "atgBrand",
      prompt: "ATG brand / model?",
      kind: "select",
      options: [
        "Veeder-Root TLS-450 / 450PLUS",
        "Veeder-Root TLS-350",
        "Incon / Franklin",
        "Other",
        "Unknown / none seen",
      ],
      weight: 10,
    },
  ],
  networking: [
    {
      id: "isp",
      fieldKey: "isp",
      prompt: "Who provides site internet?",
      placeholder: "Spectrum, AT&T, cellular…",
      kind: "text",
      weight: 6,
    },
    {
      id: "router_loc",
      fieldKey: "routerLocation",
      prompt: "Where is the main router / switch?",
      placeholder: "Office, electrical room…",
      kind: "text",
      weight: 8,
    },
    {
      id: "forecourt_net",
      fieldKey: "forecourtNetwork",
      prompt: "Forecourt network type?",
      kind: "select",
      options: ["Ethernet", "Serial / current loop", "Wireless bridge", "Mixed", "Unknown"],
      weight: 8,
    },
  ],
  forecourt: [
    {
      id: "dispenser_brand",
      fieldKey: "dispenserBrand",
      prompt: "Dispenser brand?",
      kind: "select",
      options: ["Gilbarco", "Wayne", "Bennett", "Tokheim", "Mixed", "Unknown"],
      weight: 10,
    },
    {
      id: "emv_readers",
      fieldKey: "emvReaders",
      prompt: "Card reader style on pumps?",
      kind: "select",
      options: ["UPM / outdoor PIN pad", "CRIND integrated", "Indoor only", "Unknown"],
      weight: 8,
    },
    {
      id: "island_count",
      fieldKey: "islandCount",
      prompt: "About how many pump islands?",
      placeholder: "e.g. 2, 4",
      kind: "text",
      weight: 5,
    },
  ],
  pos: [
    {
      id: "pos_brand2",
      fieldKey: "posBrand",
      prompt: "Indoor POS brand?",
      kind: "select",
      options: [
        "Gilbarco Passport",
        "Wayne",
        "Verifone Commander / Ruby",
        "Radiant / NCR",
        "Other",
        "Unknown",
      ],
      weight: 10,
    },
    {
      id: "register_count",
      fieldKey: "registerCount",
      prompt: "How many registers?",
      placeholder: "1, 2, 3…",
      kind: "text",
      weight: 5,
    },
    {
      id: "back_office",
      fieldKey: "backOffice",
      prompt: "Back-office PC on site?",
      kind: "yesno",
      weight: 4,
    },
  ],
  atg: [
    {
      id: "atg_brand2",
      fieldKey: "atgBrand",
      prompt: "ATG brand / model?",
      kind: "select",
      options: [
        "Veeder-Root TLS-450 / 450PLUS",
        "Veeder-Root TLS-350",
        "Incon / Franklin",
        "Other",
        "Unknown",
      ],
      weight: 10,
    },
    {
      id: "probe_style",
      fieldKey: "probeStyle",
      prompt: "Probe style if known?",
      kind: "select",
      options: ["Magnetostrictive", "Capacitance", "Unknown"],
      weight: 6,
    },
    {
      id: "phase_sep",
      fieldKey: "phaseSepFloats",
      prompt: "Phase-separation floats installed?",
      kind: "yesno",
      weight: 6,
    },
  ],
  service_call: [
    {
      id: "access",
      fieldKey: "accessNotes",
      prompt: "Gate / lockbox / after-hours access notes?",
      placeholder: "Codes, who to call…",
      kind: "text",
      weight: 8,
    },
    {
      id: "last_issue",
      fieldKey: "lastIssue",
      prompt: "What are they calling about today?",
      placeholder: "Pump down, reader, ATG alarm…",
      kind: "text",
      weight: 6,
    },
  ],
  quote: [
    {
      id: "urgency",
      fieldKey: "urgency",
      prompt: "How urgent is this visit?",
      kind: "select",
      options: ["Emergency / down", "Same week", "Flexible", "Just pricing"],
      weight: 4,
    },
    {
      id: "equipment_focus",
      fieldKey: "equipmentFocus",
      prompt: "Main equipment involved?",
      kind: "select",
      options: ["Dispensers", "Card readers", "POS", "ATG", "Concrete / site", "Other"],
      weight: 5,
    },
  ],
};

export const TERMS_VERSION = "vibe-service-2026-07";

export const VIBE_SERVICE_TERMS = `
FAFO Field Contribution Terms (Vibe Service)

By checking the box and using FAFO Petro field tools / site registry software you agree:

1. You are using this software at your own risk. FAFO PETRO SERVICES L.L.C., its owner, contractors, and affiliates are not responsible for damages, lost data, downtime, bad parts decisions, incorrect procedures, or any loss arising from use of these tools, estimates, or shared site data.

2. This software is a field aid — not manufacturer authorization, not certified training, and not a substitute for OEM procedures, AHJ rules, or licensed work where required.

3. Information you enter about sites (addresses, equipment, tanks, network notes, contacts, photos descriptions, survey answers, etc.) may be stored in FAFO’s shared site database. Submissions may be approved, edited, rejected (“ghosted”), or held pending review at FAFO’s sole discretion.

4. You will not knowingly enter false safety-critical data. You understand incomplete or wrong site intel can mislead other techs.

5. Multi-tech growth: when multiple technicians use this software, contributions are pooled so the site library improves for everyone under FAFO review.

6. Personal contact info you provide may be used to follow up on contributions or service work.

If you do not agree, do not use the contribution features.
`.trim();

/** Pick up to `limit` questions whose fieldKeys are still empty in survey. */
export function pickUnansweredQuestions(
  context: SurveyContext,
  survey: Record<string, unknown>,
  limit = 3,
): SurveyQuestion[] {
  const bank = [
    ...SURVEY_BY_CONTEXT[context],
    // always mix one general if room
    ...SURVEY_BY_CONTEXT.general,
  ];
  const seen = new Set<string>();
  const out: SurveyQuestion[] = [];
  for (const q of bank) {
    if (seen.has(q.fieldKey)) continue;
    seen.add(q.fieldKey);
    const val = survey[q.fieldKey];
    if (val != null && String(val).trim() !== "") continue;
    out.push(q);
    if (out.length >= limit) break;
  }
  return out;
}

export function computeCompleteness(survey: Record<string, unknown>): number {
  const all = Object.values(SURVEY_BY_CONTEXT).flat();
  const byKey = new Map<string, SurveyQuestion>();
  for (const q of all) {
    if (!byKey.has(q.fieldKey)) byKey.set(q.fieldKey, q);
  }
  let total = 0;
  let got = 0;
  for (const q of byKey.values()) {
    total += q.weight;
    const val = survey[q.fieldKey];
    if (val != null && String(val).trim() !== "") got += q.weight;
  }
  if (!total) return 0;
  return Math.min(100, Math.round((got / total) * 100));
}
