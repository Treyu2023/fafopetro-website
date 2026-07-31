import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { getSql } from "@/lib/db";

const requestSchema = z.object({
  name: z.string().trim().min(1).max(200),
  business: z.string().trim().max(300).optional().default(""),
  phone: z.string().trim().min(7).max(40),
  email: z.string().trim().max(200).optional().default(""),
  city: z.string().trim().max(200).optional().default(""),
  equipment: z.string().trim().max(200).optional().default(""),
  urgency: z.string().trim().max(100).optional().default("Normal"),
  details: z.string().trim().max(5000).optional().default(""),
});

export type ServiceRequestInput = z.infer<typeof requestSchema>;

export type ServiceRequestRow = {
  id: string;
  created_at: string;
  name: string;
  business: string | null;
  phone: string;
  email: string | null;
  city: string | null;
  equipment: string | null;
  urgency: string | null;
  details: string | null;
  source: string;
  user_agent: string | null;
  ip_hint: string | null;
  status: string;
};

function newId() {
  return `sr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

/** Owner gate for listing / export. Set LEADS_ACCESS_CODE in deploy env for production. */
function leadsCodeOk(code: string) {
  const expected = (process.env.LEADS_ACCESS_CODE || "fafopetro-leads").trim();
  return code.trim() === expected && expected.length > 0;
}

/**
 * Defensive bootstrap if migration 0002 hasn't been applied yet on a long-lived
 * PGLite process (e.g. migration added mid-session). Migration file remains the
 * source of truth for deploys / cold starts.
 */
async function ensureServiceRequestsTable() {
  const sql = await getSql();
  await sql.query(`
    create table if not exists service_requests (
      id text primary key,
      created_at timestamptz not null default now(),
      name text not null,
      business text,
      phone text not null,
      email text,
      city text,
      equipment text,
      urgency text,
      details text,
      source text not null default 'web_form',
      user_agent text,
      ip_hint text,
      status text not null default 'new'
    )
  `);
  await sql.query(
    `create index if not exists service_requests_created_at_idx on service_requests (created_at desc)`,
  );
  await sql.query(
    `create index if not exists service_requests_phone_idx on service_requests (phone)`,
  );
}

async function appendHardFile(row: Record<string, unknown>) {
  try {
    const { mkdir, appendFile } = await import("node:fs/promises");
    const { join } = await import("node:path");
    const dir = join(process.cwd(), "data");
    await mkdir(dir, { recursive: true });
    await appendFile(
      join(dir, "service-requests.jsonl"),
      `${JSON.stringify(row)}\n`,
      "utf8",
    );
  } catch {
    /* ignore filesystem limits */
  }
}

export const submitServiceRequest = createServerFn({ method: "POST" })
  .validator((raw: unknown) => requestSchema.parse(raw))
  .handler(async ({ data }) => {
    await ensureServiceRequestsTable();
    const sql = await getSql();
    const id = newId();
    const ua = getRequestHeader("user-agent") ?? null;
    const fwd = getRequestHeader("x-forwarded-for");
    const ipHint = fwd ? fwd.split(",")[0]?.trim().slice(0, 64) : null;

    await sql`
      insert into service_requests (
        id, name, business, phone, email, city, equipment, urgency, details,
        source, user_agent, ip_hint, status
      ) values (
        ${id},
        ${data.name},
        ${data.business || null},
        ${data.phone},
        ${data.email || null},
        ${data.city || null},
        ${data.equipment || null},
        ${data.urgency || null},
        ${data.details || null},
        ${"web_form"},
        ${ua},
        ${ipHint},
        ${"new"}
      )
    `;

    const record = {
      id,
      created_at: new Date().toISOString(),
      ...data,
      source: "web_form",
      user_agent: ua,
      ip_hint: ipHint,
      status: "new",
    };
    await appendHardFile(record);

    return { ok: true as const, id };
  });

export const listServiceRequests = createServerFn({ method: "POST" })
  .validator((raw: unknown) =>
    z.object({ code: z.string().min(1).max(200) }).parse(raw),
  )
  .handler(async ({ data }) => {
    if (!leadsCodeOk(data.code)) {
      throw new Error("Invalid access code");
    }
    await ensureServiceRequestsTable();
    const sql = await getSql();
    const rows = await sql<ServiceRequestRow>`
      select
        id,
        created_at::text as created_at,
        name,
        business,
        phone,
        email,
        city,
        equipment,
        urgency,
        details,
        source,
        user_agent,
        ip_hint,
        status
      from service_requests
      order by created_at desc
      limit 2000
    `;
    return { ok: true as const, rows };
  });

export const exportServiceRequestsCsv = createServerFn({ method: "POST" })
  .validator((raw: unknown) =>
    z.object({ code: z.string().min(1).max(200) }).parse(raw),
  )
  .handler(async ({ data }) => {
    if (!leadsCodeOk(data.code)) {
      throw new Error("Invalid access code");
    }
    await ensureServiceRequestsTable();
    const sql = await getSql();
    const rows = await sql<ServiceRequestRow>`
      select
        id,
        created_at::text as created_at,
        name,
        business,
        phone,
        email,
        city,
        equipment,
        urgency,
        details,
        source,
        user_agent,
        ip_hint,
        status
      from service_requests
      order by created_at desc
      limit 10000
    `;

    const headers = [
      "id",
      "created_at",
      "name",
      "business",
      "phone",
      "email",
      "city",
      "equipment",
      "urgency",
      "details",
      "source",
      "user_agent",
      "ip_hint",
      "status",
    ] as const;

    const esc = (v: unknown) => {
      const s = v == null ? "" : String(v);
      if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    };

    const lines = [
      headers.join(","),
      ...rows.map((r) => headers.map((h) => esc(r[h])).join(",")),
    ];
    return { ok: true as const, csv: lines.join("\n"), count: rows.length };
  });
