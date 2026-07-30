import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { quoteRates } from "@/lib/quote-rates";
import type { LeadPayload, LeadRow } from "@/lib/quote-types";

export type { LeadPayload, LeadRow };

function newId() {
  return `ql_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

async function ensureQuoteLeadsTable() {
  const sql = await getSql();
  await sql.query(`
    create table if not exists quote_leads (
      id text primary key,
      created_at timestamptz not null default now(),
      store_name text,
      contact_name text not null,
      phone text not null,
      email text,
      site_address text not null,
      city text,
      state text,
      zip text,
      equipment_notes text,
      issue_notes text,
      miles_one_way double precision,
      travel_hours_one_way double precision,
      on_site_hours double precision not null default 1,
      labor_rate double precision not null,
      mileage_rate double precision not null,
      labor_cost double precision,
      travel_time_cost double precision,
      mileage_cost double precision,
      minimum_total double precision,
      round_trip_total double precision,
      savings_vs_round_trip double precision,
      route_source text,
      raw_json text
    )
  `);
  await sql.query(
    `create index if not exists quote_leads_created_at_idx on quote_leads (created_at desc)`,
  );
  return sql;
}

export const submitQuoteLead = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const d = data as LeadPayload;
    if (!d || typeof d !== "object") throw new Error("Invalid payload");
    if (!String(d.contactName || "").trim()) throw new Error("Name is required");
    if (!String(d.phone || "").trim()) throw new Error("Phone is required");
    if (!String(d.siteAddress || "").trim())
      throw new Error("Site address is required");
    return d as LeadPayload;
  })
  .handler(async ({ data }): Promise<{ ok: true; id: string }> => {
    const sql = await ensureQuoteLeadsTable();
    const id = newId();
    const raw = JSON.stringify({
      ...data,
      rates: quoteRates,
      savedAt: new Date().toISOString(),
    });

    await sql`
      insert into quote_leads (
        id, store_name, contact_name, phone, email,
        site_address, city, state, zip, equipment_notes, issue_notes,
        miles_one_way, travel_hours_one_way, on_site_hours,
        labor_rate, mileage_rate, labor_cost, travel_time_cost, mileage_cost,
        minimum_total, round_trip_total, savings_vs_round_trip, route_source, raw_json
      ) values (
        ${id},
        ${data.storeName || null},
        ${data.contactName.trim()},
        ${data.phone.trim()},
        ${data.email?.trim() || null},
        ${data.siteAddress.trim()},
        ${data.city || null},
        ${data.state || null},
        ${data.zip || null},
        ${data.equipmentNotes || null},
        ${data.issueNotes || null},
        ${data.milesOneWay},
        ${data.travelHoursOneWay},
        ${data.onSiteHours},
        ${quoteRates.laborPerHour},
        ${quoteRates.mileagePerMile},
        ${data.laborCost},
        ${data.travelTimeCost},
        ${data.mileageCost},
        ${data.minimumTotal},
        ${data.roundTripTotal},
        ${data.savingsVsRoundTrip},
        ${data.routeSource || null},
        ${raw}
      )
    `;

    return { ok: true, id };
  });

export const listQuoteLeads = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const d = data as { code: string };
    return { code: String(d?.code || "") };
  })
  .handler(async ({ data }): Promise<{ ok: true; rows: LeadRow[] }> => {
    const expected = (
      process.env.QUOTE_LEADS_CODE || "FAFO-LEADS"
    ).toUpperCase();
    if (data.code.trim().toUpperCase() !== expected) {
      throw new Error("Invalid access code");
    }
    const sql = await ensureQuoteLeadsTable();
    const rows = await sql<LeadRow>`
      select id,
             created_at::text as created_at,
             store_name, contact_name, phone, email,
             site_address, city, state, zip, equipment_notes, issue_notes,
             miles_one_way, travel_hours_one_way, on_site_hours,
             labor_cost, travel_time_cost, mileage_cost, minimum_total,
             savings_vs_round_trip, route_source
      from quote_leads
      order by created_at desc
      limit 200
    `;
    return { ok: true, rows };
  });
