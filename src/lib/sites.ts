import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import stationsSeed from "@/data/stations-seed.json";
import {
  computeCompleteness,
  TERMS_VERSION,
} from "@/lib/survey-bank";
import type {
  ContributeInput,
  CreateSiteInput,
  ContributionRow,
  DuplicateMatch,
  FieldSite,
  SiteSuggestion,
  SurveyContext,
} from "@/lib/sites-types";

const ADMIN_CODE = () =>
  (process.env.SITES_ADMIN_CODE || process.env.QUOTE_LEADS_CODE || "FAFO-LEADS").toUpperCase();

function newId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeName(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function siteLabel(s: {
  name: string;
  street?: string | null;
  city?: string | null;
  state?: string | null;
}) {
  return [s.name, s.street, [s.city, s.state].filter(Boolean).join(", ")]
    .filter(Boolean)
    .join(" · ");
}

async function ensureSitesTables() {
  const sql = await getSql();
  await sql.query(`
    create table if not exists field_sites (
      id text primary key,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now(),
      name text not null,
      brand text,
      street text,
      city text,
      state text default 'NC',
      zip text,
      lat double precision,
      lon double precision,
      miles_from_base double precision,
      phone text,
      osm_id text,
      source text not null default 'manual',
      status text not null default 'approved',
      survey_json text not null default '{}',
      completeness smallint not null default 0,
      notes text,
      created_by text,
      last_touched_by text
    )
  `);
  await sql.query(`
    create table if not exists site_contributions (
      id text primary key,
      created_at timestamptz not null default now(),
      site_id text,
      contributor_name text,
      contributor_phone text,
      contributor_email text,
      context text not null default 'general',
      answers_json text not null default '{}',
      terms_accepted boolean not null default false,
      status text not null default 'pending',
      review_note text,
      reviewed_at timestamptz,
      raw_json text
    )
  `);
  await sql.query(`
    create table if not exists site_tech_sessions (
      id text primary key,
      created_at timestamptz not null default now(),
      tech_name text not null,
      tech_phone text,
      tech_email text,
      company text,
      terms_accepted_at timestamptz not null,
      terms_version text not null
    )
  `);
  return sql;
}

type SeedRow = {
  name: string;
  brand?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  lat?: number;
  lon?: number;
  miles_from_base?: number;
  osm_id?: string;
  phone?: string;
  source?: string;
};

async function seedIfEmpty(sql: Awaited<ReturnType<typeof getSql>>) {
  const countRows = await sql<{ n: number }>`
    select count(*)::int as n from field_sites
  `;
  if ((countRows[0]?.n ?? 0) > 0) return { seeded: false, count: countRows[0].n };

  const seed = stationsSeed as SeedRow[];
  for (const s of seed) {
    const id = newId("site");
    await sql`
      insert into field_sites (
        id, name, brand, street, city, state, zip, lat, lon,
        miles_from_base, phone, osm_id, source, status, survey_json, completeness
      ) values (
        ${id},
        ${s.name},
        ${s.brand || null},
        ${s.street || null},
        ${s.city || null},
        ${s.state || "NC"},
        ${s.zip || null},
        ${s.lat ?? null},
        ${s.lon ?? null},
        ${s.miles_from_base ?? null},
        ${s.phone || null},
        ${s.osm_id || null},
        ${s.source || "seed"},
        ${"approved"},
        ${"{}"},
        ${0}
      )
    `;
  }
  return { seeded: true, count: seed.length };
}

function rowToSuggestion(r: FieldSite, score: number): SiteSuggestion {
  return {
    id: r.id,
    name: r.name,
    brand: r.brand,
    street: r.street,
    city: r.city,
    state: r.state,
    zip: r.zip,
    miles_from_base: r.miles_from_base,
    status: r.status as SiteSuggestion["status"],
    completeness: r.completeness,
    label: siteLabel(r),
    score,
  };
}

function scoreMatch(
  q: string,
  r: Pick<FieldSite, "name" | "brand" | "street" | "city" | "zip">,
): number {
  const nq = normalizeName(q);
  if (!nq) return 0;
  const hay = normalizeName(
    [r.name, r.brand, r.street, r.city, r.zip].filter(Boolean).join(" "),
  );
  if (hay === nq) return 100;
  if (hay.startsWith(nq)) return 90;
  if (hay.includes(nq)) return 75;
  // token overlap
  const qt = new Set(nq.split(" ").filter(Boolean));
  const ht = hay.split(" ").filter(Boolean);
  let hit = 0;
  for (const t of qt) if (ht.some((h) => h.startsWith(t) || t.startsWith(h))) hit += 1;
  if (!qt.size) return 0;
  return Math.round((hit / qt.size) * 60);
}

export const bootstrapSites = createServerFn({ method: "POST" }).handler(
  async (): Promise<{ ok: true; count: number; seeded: boolean }> => {
    const sql = await ensureSitesTables();
    const result = await seedIfEmpty(sql);
    const countRows = await sql<{ n: number }>`
      select count(*)::int as n from field_sites where status != 'ghosted'
    `;
    return { ok: true, count: countRows[0]?.n ?? result.count, seeded: result.seeded };
  },
);

export const searchSites = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const d = data as { query?: string; limit?: number; includePending?: boolean };
    return {
      query: String(d?.query || "").trim(),
      limit: Math.min(40, Math.max(1, Number(d?.limit) || 12)),
      includePending: Boolean(d?.includePending),
    };
  })
  .handler(async ({ data }): Promise<{ suggestions: SiteSuggestion[]; total: number }> => {
    const sql = await ensureSitesTables();
    await seedIfEmpty(sql);

    const statuses = data.includePending
      ? ("approved', 'pending")
      : "approved";
    // Simple fetch then score in JS — fine for local ~few hundred rows
    const rows = await sql<FieldSite>`
      select id, created_at::text as created_at, updated_at::text as updated_at,
             name, brand, street, city, state, zip, lat, lon, miles_from_base,
             phone, osm_id, source, status, survey_json, completeness, notes,
             created_by, last_touched_by
      from field_sites
      where status in ('approved', 'pending')
      order by miles_from_base nulls last, name
      limit 800
    `;

    const q = data.query;
    let scored = rows
      .filter((r) => data.includePending || r.status === "approved")
      .map((r) => ({ r, score: q ? scoreMatch(q, r) : 50 - (r.miles_from_base ?? 50) / 2 }))
      .filter((x) => (q ? x.score >= 20 : true))
      .sort((a, b) => b.score - a.score || (a.r.miles_from_base ?? 99) - (b.r.miles_from_base ?? 99));

    if (!q) {
      scored = rows
        .filter((r) => r.status === "approved" || data.includePending)
        .map((r) => ({ r, score: 50 }))
        .sort(
          (a, b) =>
            (a.r.miles_from_base ?? 99) - (b.r.miles_from_base ?? 99),
        );
    }

    const suggestions = scored
      .slice(0, data.limit)
      .map(({ r, score }) => rowToSuggestion(r, score));

    void statuses;
    return { suggestions, total: rows.length };
  });

export const getSite = createServerFn({ method: "POST" })
  .validator((data: unknown) => ({
    id: String((data as { id?: string })?.id || ""),
  }))
  .handler(async ({ data }): Promise<{ site: FieldSite | null }> => {
    const sql = await ensureSitesTables();
    const rows = await sql<FieldSite>`
      select id, created_at::text as created_at, updated_at::text as updated_at,
             name, brand, street, city, state, zip, lat, lon, miles_from_base,
             phone, osm_id, source, status, survey_json, completeness, notes,
             created_by, last_touched_by
      from field_sites where id = ${data.id} limit 1
    `;
    return { site: rows[0] ?? null };
  });

export const findDuplicates = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const d = data as {
      name?: string;
      street?: string;
      city?: string;
      lat?: number | null;
      lon?: number | null;
    };
    return {
      name: String(d?.name || "").trim(),
      street: String(d?.street || "").trim(),
      city: String(d?.city || "").trim(),
      lat: d?.lat ?? null,
      lon: d?.lon ?? null,
    };
  })
  .handler(async ({ data }): Promise<{ matches: DuplicateMatch[] }> => {
    const sql = await ensureSitesTables();
    await seedIfEmpty(sql);
    const rows = await sql<FieldSite>`
      select id, created_at::text as created_at, updated_at::text as updated_at,
             name, brand, street, city, state, zip, lat, lon, miles_from_base,
             phone, osm_id, source, status, survey_json, completeness, notes,
             created_by, last_touched_by
      from field_sites
      where status in ('approved', 'pending')
      limit 800
    `;

    const matches: DuplicateMatch[] = [];
    const nName = normalizeName(data.name);
    const nStreet = normalizeName(data.street);
    const nCity = normalizeName(data.city);

    for (const r of rows) {
      let reason = "";
      let score = 0;

      // geo near-duplicate (~120m)
      if (
        data.lat != null &&
        data.lon != null &&
        r.lat != null &&
        r.lon != null
      ) {
        const dlat = (data.lat - r.lat) * 69;
        const dlon =
          (data.lon - r.lon) * 69 * Math.cos((data.lat * Math.PI) / 180);
        const miles = Math.sqrt(dlat * dlat + dlon * dlon);
        if (miles < 0.08) {
          score = 95;
          reason = "Almost the same map location";
        }
      }

      const nameScore = scoreMatch(data.name, r);
      if (nameScore >= 75 && (!nCity || normalizeName(r.city || "") === nCity || !r.city)) {
        if (nameScore > score) {
          score = nameScore;
          reason = "Same or very similar store name nearby";
        }
      }

      if (nStreet && normalizeName(r.street || "") === nStreet && nStreet.length > 4) {
        if (80 > score) {
          score = 80;
          reason = "Same street address already on file";
        }
      }

      // name + city
      if (
        nName &&
        normalizeName(r.name) === nName &&
        nCity &&
        normalizeName(r.city || "") === nCity
      ) {
        score = 98;
        reason = "Exact name + city already in the registry";
      }

      if (score >= 70) {
        matches.push({
          site: rowToSuggestion(r, score),
          reason,
        });
      }
    }

    matches.sort((a, b) => b.site.score - a.site.score);
    return { matches: matches.slice(0, 8) };
  });

export const createSite = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as CreateSiteInput)
  .handler(
    async ({
      data,
    }): Promise<
      | { ok: true; id: string; status: string; duplicate: false }
      | {
          ok: false;
          code: "duplicate";
          matches: DuplicateMatch[];
          message: string;
        }
      | { ok: false; code: "terms"; message: string }
      | { ok: false; code: "validation"; message: string }
    > => {
      if (!data?.termsAccepted) {
        return {
          ok: false,
          code: "terms",
          message: "Accept the contribution terms to add a site.",
        };
      }
      const name = String(data.name || "").trim();
      if (!name) {
        return { ok: false, code: "validation", message: "Store name is required." };
      }

      const sql = await ensureSitesTables();
      await seedIfEmpty(sql);

      // soft duplicate check unless force
      if (!data.forceCreate) {
        const rows = await sql<FieldSite>`
          select id, created_at::text as created_at, updated_at::text as updated_at,
                 name, brand, street, city, state, zip, lat, lon, miles_from_base,
                 phone, osm_id, source, status, survey_json, completeness, notes,
                 created_by, last_touched_by
          from field_sites
          where status in ('approved', 'pending')
          limit 800
        `;
        const matches: DuplicateMatch[] = [];
        const nName = normalizeName(name);
        const nStreet = normalizeName(data.street || "");
        const nCity = normalizeName(data.city || "");
        for (const r of rows) {
          let reason = "";
          let score = 0;
          if (
            nName &&
            normalizeName(r.name) === nName &&
            (!nCity || !r.city || normalizeName(r.city) === nCity)
          ) {
            score = 96;
            reason = "That store name is already on file";
          } else if (nStreet && nStreet.length > 5 && normalizeName(r.street || "") === nStreet) {
            score = 88;
            reason = "That street address is already on file";
          } else {
            const s = scoreMatch(name, r);
            if (s >= 80 && (!nCity || !r.city || normalizeName(r.city) === nCity)) {
              score = s;
              reason = "Very similar site already exists — open it instead of duplicating";
            }
          }
          if (score >= 80) {
            matches.push({ site: rowToSuggestion(r, score), reason });
          }
        }
        if (matches.length) {
          matches.sort((a, b) => b.site.score - a.site.score);
          return {
            ok: false,
            code: "duplicate",
            matches: matches.slice(0, 6),
            message:
              "Looks like this site may already be in the registry. Open an existing match — or confirm to add as a new site.",
          };
        }
      }

      const survey = { ...(data.answers || {}) };
      const completeness = computeCompleteness(survey);
      const id = newId("site");
      const status = data.forceCreate ? "pending" : "pending";

      await sql`
        insert into field_sites (
          id, name, brand, street, city, state, zip, lat, lon, phone,
          source, status, survey_json, completeness, notes, created_by, last_touched_by
        ) values (
          ${id},
          ${name},
          ${data.brand || null},
          ${data.street || null},
          ${data.city || null},
          ${data.state || "NC"},
          ${data.zip || null},
          ${data.lat ?? null},
          ${data.lon ?? null},
          ${data.phone || null},
          ${"tech"},
          ${status},
          ${JSON.stringify(survey)},
          ${completeness},
          ${data.notes || null},
          ${data.contributorName || null},
          ${data.contributorName || null}
        )
      `;

      const contribId = newId("contrib");
      await sql`
        insert into site_contributions (
          id, site_id, contributor_name, contributor_phone, contributor_email,
          context, answers_json, terms_accepted, status, raw_json
        ) values (
          ${contribId},
          ${id},
          ${data.contributorName || null},
          ${data.contributorPhone || null},
          ${data.contributorEmail || null},
          ${data.context || "create_site"},
          ${JSON.stringify(survey)},
          ${true},
          ${"pending"},
          ${JSON.stringify({ termsVersion: TERMS_VERSION, create: true })}
        )
      `;

      return { ok: true, id, status, duplicate: false };
    },
  );

export const contributeToSite = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as ContributeInput)
  .handler(
    async ({
      data,
    }): Promise<
      | { ok: true; contributionId: string; completeness: number }
      | { ok: false; message: string }
    > => {
      if (!data?.termsAccepted) {
        return { ok: false, message: "Accept the contribution terms first." };
      }
      if (!data.siteId) return { ok: false, message: "Missing site." };
      const answers = data.answers || {};
      if (!Object.keys(answers).length) {
        return { ok: false, message: "Answer at least one question." };
      }

      const sql = await ensureSitesTables();
      const sites = await sql<FieldSite>`
        select id, created_at::text as created_at, updated_at::text as updated_at,
               name, brand, street, city, state, zip, lat, lon, miles_from_base,
               phone, osm_id, source, status, survey_json, completeness, notes,
               created_by, last_touched_by
        from field_sites where id = ${data.siteId} limit 1
      `;
      const site = sites[0];
      if (!site) return { ok: false, message: "Site not found." };

      // Merge answers into pending contribution; do NOT auto-merge to live survey until approved
      // But for UX growth, merge soft fields into survey_json as pending-enriched data
      // with review gate on contributions table.
      let survey: Record<string, unknown> = {};
      try {
        survey = JSON.parse(site.survey_json || "{}") as Record<string, unknown>;
      } catch {
        survey = {};
      }
      // Only fill empty keys live; non-empty changes go through review as contribution
      for (const [k, v] of Object.entries(answers)) {
        if (v == null || String(v).trim() === "") continue;
        if (survey[k] == null || String(survey[k]).trim() === "") {
          survey[k] = v;
        }
      }
      const completeness = computeCompleteness(survey);

      await sql`
        update field_sites
        set survey_json = ${JSON.stringify(survey)},
            completeness = ${completeness},
            updated_at = now(),
            last_touched_by = ${data.contributorName || site.last_touched_by}
        where id = ${site.id}
      `;

      const contribId = newId("contrib");
      await sql`
        insert into site_contributions (
          id, site_id, contributor_name, contributor_phone, contributor_email,
          context, answers_json, terms_accepted, status, raw_json
        ) values (
          ${contribId},
          ${site.id},
          ${data.contributorName || null},
          ${data.contributorPhone || null},
          ${data.contributorEmail || null},
          ${data.context || "general"},
          ${JSON.stringify(answers)},
          ${true},
          ${"pending"},
          ${JSON.stringify({ termsVersion: TERMS_VERSION, context: data.context })}
        )
      `;

      return { ok: true, contributionId: contribId, completeness };
    },
  );

export const listPendingContributions = createServerFn({ method: "POST" })
  .validator((data: unknown) => ({
    code: String((data as { code?: string })?.code || ""),
  }))
  .handler(async ({ data }): Promise<{ rows: ContributionRow[] }> => {
    if (data.code.trim().toUpperCase() !== ADMIN_CODE()) {
      throw new Error("Invalid access code");
    }
    const sql = await ensureSitesTables();
    const rows = await sql<ContributionRow>`
      select c.id,
             c.created_at::text as created_at,
             c.site_id,
             c.contributor_name,
             c.contributor_phone,
             c.contributor_email,
             c.context,
             c.answers_json,
             c.terms_accepted,
             c.status,
             c.review_note,
             s.name as site_name
      from site_contributions c
      left join field_sites s on s.id = c.site_id
      where c.status = 'pending'
      order by c.created_at desc
      limit 100
    `;
    return { rows };
  });

export const reviewContribution = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const d = data as {
      code?: string;
      id?: string;
      decision?: "approved" | "ghosted";
      note?: string;
    };
    return {
      code: String(d?.code || ""),
      id: String(d?.id || ""),
      decision: (d?.decision === "ghosted" ? "ghosted" : "approved") as
        | "approved"
        | "ghosted",
      note: String(d?.note || ""),
    };
  })
  .handler(async ({ data }): Promise<{ ok: true }> => {
    if (data.code.trim().toUpperCase() !== ADMIN_CODE()) {
      throw new Error("Invalid access code");
    }
    const sql = await ensureSitesTables();
    const rows = await sql<{
      id: string;
      site_id: string | null;
      answers_json: string;
    }>`
      select id, site_id, answers_json from site_contributions where id = ${data.id} limit 1
    `;
    const row = rows[0];
    if (!row) throw new Error("Contribution not found");

    await sql`
      update site_contributions
      set status = ${data.decision},
          review_note = ${data.note || null},
          reviewed_at = now()
      where id = ${data.id}
    `;

    if (data.decision === "approved" && row.site_id) {
      const sites = await sql<FieldSite>`
        select id, survey_json, status from field_sites where id = ${row.site_id} limit 1
      `;
      const site = sites[0];
      if (site) {
        let survey: Record<string, unknown> = {};
        try {
          survey = JSON.parse(site.survey_json || "{}") as Record<string, unknown>;
        } catch {
          survey = {};
        }
        let answers: Record<string, unknown> = {};
        try {
          answers = JSON.parse(row.answers_json || "{}") as Record<string, unknown>;
        } catch {
          answers = {};
        }
        for (const [k, v] of Object.entries(answers)) {
          if (v != null && String(v).trim() !== "") survey[k] = v;
        }
        const completeness = computeCompleteness(survey);
        await sql`
          update field_sites
          set survey_json = ${JSON.stringify(survey)},
              completeness = ${completeness},
              status = case when status = 'pending' then 'approved' else status end,
              updated_at = now()
          where id = ${site.id}
        `;
      }
    }

    if (data.decision === "ghosted" && row.site_id) {
      // If site was created only via this pending path and still pending with no other data, ghost it
      await sql`
        update field_sites
        set status = case when status = 'pending' then 'ghosted' else status end,
            updated_at = now()
        where id = ${row.site_id} and status = 'pending'
      `;
    }

    return { ok: true };
  });

export type { SurveyContext };
