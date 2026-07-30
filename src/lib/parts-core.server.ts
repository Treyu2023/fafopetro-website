/** Private parts / price book — server only. Never expose via public pages. */
import { randomBytes } from "node:crypto";
import { getSql } from "@/lib/db";
import type {
  PartPriceRow,
  PartRow,
  PartWithPrices,
  PriceSource,
  PriceType,
} from "@/lib/parts-types";

export const PARTS_ADMIN_CODE = () =>
  (
    process.env.SITES_ADMIN_CODE ||
    process.env.QUOTE_LEADS_CODE ||
    "FAFO-LEADS"
  ).toUpperCase();

function id() {
  return randomBytes(12).toString("hex");
}

/** Normalize part numbers for unique match: upper, strip spaces/dashes/underscores */
export function normalizePartNumber(raw: string): string {
  return String(raw || "")
    .trim()
    .toUpperCase()
    .replace(/[\s\-_/\\.]+/g, "");
}

export async function ensurePartsTables() {
  const sql = await getSql();
  await sql.query(`
    create table if not exists parts (
      id text primary key,
      part_number text not null,
      part_number_norm text not null,
      name text,
      brand text,
      category text,
      description text,
      unit text default 'ea',
      notes text,
      is_active boolean not null default true,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `);
  await sql.query(
    `create unique index if not exists parts_part_number_norm_uidx on parts (part_number_norm)`,
  );
  await sql.query(`
    create table if not exists part_prices (
      id text primary key,
      part_id text not null references parts(id) on delete cascade,
      amount numeric not null,
      cost_amount numeric,
      currency text not null default 'USD',
      price_type text not null default 'observed',
      source text not null default 'manual',
      source_detail text,
      is_xero_current boolean not null default false,
      observed_at timestamptz not null default now(),
      created_at timestamptz not null default now()
    )
  `);
  await sql.query(
    `create index if not exists part_prices_part_idx on part_prices (part_id)`,
  );
  return sql;
}

function num(v: unknown): number | null {
  if (v == null || v === "") return null;
  const n = typeof v === "number" ? v : Number(String(v).replace(/[$,]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function mapPart(r: Record<string, unknown>): PartRow {
  return {
    id: String(r.id),
    part_number: String(r.part_number),
    part_number_norm: String(r.part_number_norm),
    name: r.name != null ? String(r.name) : null,
    brand: r.brand != null ? String(r.brand) : null,
    category: r.category != null ? String(r.category) : null,
    description: r.description != null ? String(r.description) : null,
    unit: r.unit != null ? String(r.unit) : null,
    notes: r.notes != null ? String(r.notes) : null,
    is_active: Boolean(r.is_active),
    created_at: String(r.created_at ?? ""),
    updated_at: String(r.updated_at ?? ""),
  };
}

function mapPrice(r: Record<string, unknown>): PartPriceRow {
  return {
    id: String(r.id),
    part_id: String(r.part_id),
    amount: Number(r.amount),
    cost_amount: r.cost_amount != null ? Number(r.cost_amount) : null,
    currency: String(r.currency || "USD"),
    price_type: String(r.price_type || "observed"),
    source: String(r.source || "manual"),
    source_detail: r.source_detail != null ? String(r.source_detail) : null,
    is_xero_current: Boolean(r.is_xero_current),
    observed_at: String(r.observed_at ?? ""),
    created_at: String(r.created_at ?? ""),
  };
}

export async function upsertPart(input: {
  part_number: string;
  name?: string | null;
  brand?: string | null;
  category?: string | null;
  description?: string | null;
  unit?: string | null;
  notes?: string | null;
}): Promise<PartRow> {
  const sql = await ensurePartsTables();
  const pn = input.part_number.trim();
  if (!pn) throw new Error("Part number required");
  const norm = normalizePartNumber(pn);
  const existing = await sql.query<Record<string, unknown>>(
    `select * from parts where part_number_norm = $1 limit 1`,
    [norm],
  );
  if (existing[0]) {
    const e = existing[0];
    await sql.query(
      `update parts set
        name = coalesce($1, name),
        brand = coalesce($2, brand),
        category = coalesce($3, category),
        description = coalesce($4, description),
        unit = coalesce($5, unit),
        notes = case
          when $6::text is null then notes
          when notes is null or notes = '' then $6
          else notes || E'\\n' || $6
        end,
        updated_at = now()
      where id = $7`,
      [
        input.name ?? null,
        input.brand ?? null,
        input.category ?? null,
        input.description ?? null,
        input.unit ?? null,
        input.notes ?? null,
        String(e.id),
      ],
    );
    const refreshed = await sql.query<Record<string, unknown>>(
      `select * from parts where id = $1 limit 1`,
      [String(e.id)],
    );
    return mapPart(refreshed[0]);
  }
  const newId = id();
  await sql.query(
    `insert into parts (id, part_number, part_number_norm, name, brand, category, description, unit, notes)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      newId,
      pn,
      norm,
      input.name ?? null,
      input.brand ?? null,
      input.category ?? null,
      input.description ?? null,
      input.unit ?? "ea",
      input.notes ?? null,
    ],
  );
  const rows = await sql.query<Record<string, unknown>>(
    `select * from parts where id = $1 limit 1`,
    [newId],
  );
  return mapPart(rows[0]);
}

export async function addPrice(input: {
  part_id: string;
  amount: number;
  cost_amount?: number | null;
  currency?: string;
  price_type?: PriceType | string;
  source?: PriceSource | string;
  source_detail?: string | null;
  is_xero_current?: boolean;
  observed_at?: string | null;
}): Promise<PartPriceRow> {
  const sql = await ensurePartsTables();
  if (!Number.isFinite(input.amount)) throw new Error("Valid amount required");

  const priceType = input.price_type || "observed";
  if (input.is_xero_current) {
    await sql.query(
      `update part_prices set is_xero_current = false
       where part_id = $1 and is_xero_current = true and price_type = $2`,
      [input.part_id, priceType],
    );
  }

  const priceId = id();
  const observed =
    input.observed_at && input.observed_at.trim()
      ? input.observed_at
      : new Date().toISOString();

  await sql.query(
    `insert into part_prices (
      id, part_id, amount, cost_amount, currency, price_type, source,
      source_detail, is_xero_current, observed_at
    ) values (
      $1, $2, $3::numeric, $4::numeric, $5, $6, $7, $8, $9::boolean, $10::timestamptz
    )`,
    [
      priceId,
      input.part_id,
      input.amount,
      input.cost_amount != null && Number.isFinite(input.cost_amount)
        ? input.cost_amount
        : null,
      input.currency || "USD",
      priceType,
      input.source || "manual",
      input.source_detail ?? null,
      Boolean(input.is_xero_current),
      observed,
    ],
  );
  await sql.query(`update parts set updated_at = now() where id = $1`, [
    input.part_id,
  ]);
  const rows = await sql.query<Record<string, unknown>>(
    `select * from part_prices where id = $1 limit 1`,
    [priceId],
  );
  return mapPrice(rows[0]);
}

export async function listParts(
  q?: string,
  limit = 200,
): Promise<PartWithPrices[]> {
  const sql = await ensurePartsTables();
  const query = (q || "").trim();
  let parts: Record<string, unknown>[];
  if (query) {
    const like = `%${query.toLowerCase()}%`;
    const norm = `%${normalizePartNumber(query)}%`;
    parts = await sql.query(
      `select * from parts
       where is_active = true
         and (
           lower(part_number) like $1
           or part_number_norm like $2
           or lower(coalesce(name, '')) like $1
           or lower(coalesce(brand, '')) like $1
           or lower(coalesce(category, '')) like $1
           or lower(coalesce(notes, '')) like $1
         )
       order by updated_at desc
       limit $3`,
      [like, norm, limit],
    );
  } else {
    parts = await sql.query(
      `select * from parts where is_active = true
       order by updated_at desc limit $1`,
      [limit],
    );
  }

  if (!parts.length) return [];

  const ids = parts.map((p) => String(p.id));
  const allPrices: Record<string, unknown>[] = [];
  for (const pid of ids) {
    const rows = await sql.query<Record<string, unknown>>(
      `select * from part_prices where part_id = $1 order by observed_at desc`,
      [pid],
    );
    allPrices.push(...rows);
  }

  const byPart = new Map<string, PartPriceRow[]>();
  for (const pr of allPrices) {
    const p = mapPrice(pr);
    const list = byPart.get(p.part_id) || [];
    list.push(p);
    byPart.set(p.part_id, list);
  }

  return parts.map((raw) => {
    const part = mapPart(raw);
    const prices = byPart.get(part.id) || [];
    const xeroSell =
      prices.find((p) => p.is_xero_current && p.price_type === "sell") ||
      prices.find((p) => p.source === "xero" && p.price_type === "sell");
    const xeroCostRow =
      prices.find((p) => p.is_xero_current && p.price_type === "cost") ||
      prices.find((p) => p.source === "xero" && p.price_type === "cost");
    const cost =
      xeroCostRow?.amount ??
      xeroSell?.cost_amount ??
      null;
    const latestObserved = prices.find(
      (p) => !p.is_xero_current && p.price_type !== "cost",
    );
    const sell = xeroSell?.amount ?? latestObserved?.amount ?? null;
    let margin_pct: number | null = null;
    if (sell != null && cost != null && sell > 0) {
      margin_pct = Math.round(((sell - cost) / sell) * 1000) / 10;
    }
    return {
      ...part,
      prices,
      xero_sell: xeroSell?.amount ?? null,
      xero_cost: cost,
      latest_observed: latestObserved?.amount ?? null,
      margin_pct,
    };
  });
}

export async function getPart(partId: string): Promise<PartWithPrices | null> {
  const all = await listParts("", 5000);
  return all.find((p) => p.id === partId) || null;
}

/**
 * Parse Xero Items CSV export (common columns).
 */
export function parseXeroItemsCsv(csv: string): {
  part_number: string;
  name: string;
  sell?: number;
  cost?: number;
  description?: string;
}[] {
  const lines = csv
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((l) => l.trim());
  if (lines.length < 2) return [];

  const parseRow = (line: string): string[] => {
    const cells: string[] = [];
    let cur = "";
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQ && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else inQ = !inQ;
      } else if (c === "," && !inQ) {
        cells.push(cur);
        cur = "";
      } else cur += c;
    }
    cells.push(cur);
    return cells.map((s) => s.trim());
  };

  const headers = parseRow(lines[0]).map((h) =>
    h.toLowerCase().replace(/\s+/g, ""),
  );
  const idx = (names: string[]) => {
    for (const n of names) {
      const i = headers.indexOf(n);
      if (i >= 0) return i;
    }
    return -1;
  };

  const iCode = idx(["itemcode", "code", "item", "sku", "inventoryitemcode"]);
  const iName = idx(["name", "itemname", "description", "itemdescription"]);
  const iSell = idx([
    "salesprice",
    "saleprice",
    "sellingprice",
    "unitprice",
    "price",
    "salesunitprice",
  ]);
  const iCost = idx([
    "purchaseprice",
    "costprice",
    "cost",
    "purchaseunitprice",
    "standardcost",
  ]);
  const iDesc = idx(["description", "purchasedescription", "salesdescription"]);

  if (iCode < 0) {
    throw new Error(
      "CSV needs an Item Code / SKU column (export Items from Xero).",
    );
  }

  const out: {
    part_number: string;
    name: string;
    sell?: number;
    cost?: number;
    description?: string;
  }[] = [];

  for (let li = 1; li < lines.length; li++) {
    const cells = parseRow(lines[li]);
    const code = cells[iCode]?.trim();
    if (!code) continue;
    const name = (iName >= 0 ? cells[iName] : "") || code;
    const sell = iSell >= 0 ? num(cells[iSell]) : null;
    const cost = iCost >= 0 ? num(cells[iCost]) : null;
    const description = iDesc >= 0 ? cells[iDesc] : undefined;
    out.push({
      part_number: code,
      name,
      sell: sell ?? undefined,
      cost: cost ?? undefined,
      description: description || undefined,
    });
  }
  return out;
}

export async function importXeroCsv(
  csv: string,
  detail?: string,
): Promise<{ parts: number; prices: number }> {
  const rows = parseXeroItemsCsv(csv);
  let parts = 0;
  let prices = 0;
  const observed = new Date().toISOString();
  const sourceDetail =
    detail?.trim() || `Xero items export ${observed.slice(0, 10)}`;

  for (const row of rows) {
    const part = await upsertPart({
      part_number: row.part_number,
      name: row.name,
      description: row.description ?? null,
      notes: null,
    });
    parts++;
    if (row.sell != null) {
      await addPrice({
        part_id: part.id,
        amount: row.sell,
        cost_amount: row.cost ?? null,
        price_type: "sell",
        source: "xero",
        source_detail: sourceDetail,
        is_xero_current: true,
        observed_at: observed,
      });
      prices++;
    }
    if (row.cost != null) {
      await addPrice({
        part_id: part.id,
        amount: row.cost,
        price_type: "cost",
        source: "xero",
        source_detail: sourceDetail,
        is_xero_current: true,
        observed_at: observed,
      });
      prices++;
    }
  }
  return { parts, prices };
}

export async function stats(): Promise<{
  parts: number;
  prices: number;
  xero_tagged: number;
}> {
  const sql = await ensurePartsTables();
  const p = await sql.query<{ c: number }>(
    `select count(*)::int as c from parts`,
  );
  const pr = await sql.query<{ c: number }>(
    `select count(*)::int as c from part_prices`,
  );
  const x = await sql.query<{ c: number }>(
    `select count(*)::int as c from part_prices where is_xero_current = true or source = 'xero'`,
  );
  return {
    parts: p[0]?.c ?? 0,
    prices: pr[0]?.c ?? 0,
    xero_tagged: x[0]?.c ?? 0,
  };
}
