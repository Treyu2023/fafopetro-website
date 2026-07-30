/**
 * Client-safe RPC for private parts / price book.
 * All DB work is dynamically imported server-side.
 */
import { createServerFn } from "@tanstack/react-start";
import type { PartWithPrices } from "@/lib/parts-types";

export type { PartWithPrices };

function assertCode(code: string, expected: string) {
  if (code.trim().toUpperCase() !== expected) {
    throw new Error("Invalid access code");
  }
}

export const partsUnlock = createServerFn({ method: "POST" })
  .validator((data: unknown) => ({
    code: String((data as { code?: string })?.code || ""),
  }))
  .handler(async ({ data }) => {
    const { PARTS_ADMIN_CODE, stats } = await import("@/lib/parts-core.server");
    assertCode(data.code, PARTS_ADMIN_CODE());
    return { ok: true as const, stats: await stats() };
  });

export const partsSearch = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const d = data as { code?: string; q?: string };
    return {
      code: String(d?.code || ""),
      q: String(d?.q || ""),
    };
  })
  .handler(async ({ data }): Promise<{ rows: PartWithPrices[] }> => {
    const { PARTS_ADMIN_CODE, listParts } = await import(
      "@/lib/parts-core.server"
    );
    assertCode(data.code, PARTS_ADMIN_CODE());
    return { rows: await listParts(data.q, 300) };
  });

export const partsUpsert = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const d = data as {
      code?: string;
      part_number?: string;
      name?: string;
      brand?: string;
      category?: string;
      description?: string;
      notes?: string;
      // price optional on create
      amount?: number | string;
      cost_amount?: number | string;
      price_type?: string;
      source?: string;
      source_detail?: string;
      is_xero_current?: boolean;
      observed_at?: string;
    };
    return {
      code: String(d?.code || ""),
      part_number: String(d?.part_number || "").trim(),
      name: d?.name != null ? String(d.name) : null,
      brand: d?.brand != null ? String(d.brand) : null,
      category: d?.category != null ? String(d.category) : null,
      description: d?.description != null ? String(d.description) : null,
      notes: d?.notes != null ? String(d.notes) : null,
      amount:
        d?.amount === "" || d?.amount == null
          ? null
          : Number(d.amount),
      cost_amount:
        d?.cost_amount === "" || d?.cost_amount == null
          ? null
          : Number(d.cost_amount),
      price_type: d?.price_type ? String(d.price_type) : "observed",
      source: d?.source ? String(d.source) : "manual",
      source_detail: d?.source_detail != null ? String(d.source_detail) : null,
      is_xero_current: Boolean(d?.is_xero_current),
      observed_at: d?.observed_at ? String(d.observed_at) : null,
    };
  })
  .handler(async ({ data }) => {
    const { PARTS_ADMIN_CODE, upsertPart, addPrice } = await import(
      "@/lib/parts-core.server"
    );
    assertCode(data.code, PARTS_ADMIN_CODE());
    if (!data.part_number) throw new Error("Part number required");
    const part = await upsertPart({
      part_number: data.part_number,
      name: data.name,
      brand: data.brand,
      category: data.category,
      description: data.description,
      notes: data.notes,
    });
    if (data.amount != null && Number.isFinite(data.amount)) {
      await addPrice({
        part_id: part.id,
        amount: data.amount,
        cost_amount: data.cost_amount,
        price_type: data.price_type,
        source: data.source,
        source_detail: data.source_detail,
        is_xero_current: data.is_xero_current || data.source === "xero",
        observed_at: data.observed_at,
      });
    }
    return { ok: true as const, part_id: part.id };
  });

export const partsAddPrice = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const d = data as {
      code?: string;
      part_id?: string;
      amount?: number | string;
      cost_amount?: number | string;
      price_type?: string;
      source?: string;
      source_detail?: string;
      is_xero_current?: boolean;
      observed_at?: string;
    };
    return {
      code: String(d?.code || ""),
      part_id: String(d?.part_id || ""),
      amount: Number(d?.amount),
      cost_amount:
        d?.cost_amount === "" || d?.cost_amount == null
          ? null
          : Number(d.cost_amount),
      price_type: String(d?.price_type || "observed"),
      source: String(d?.source || "manual"),
      source_detail: d?.source_detail != null ? String(d.source_detail) : null,
      is_xero_current: Boolean(d?.is_xero_current),
      observed_at: d?.observed_at ? String(d.observed_at) : null,
    };
  })
  .handler(async ({ data }) => {
    const { PARTS_ADMIN_CODE, addPrice } = await import(
      "@/lib/parts-core.server"
    );
    assertCode(data.code, PARTS_ADMIN_CODE());
    if (!data.part_id) throw new Error("part_id required");
    if (!Number.isFinite(data.amount)) throw new Error("amount required");
    const price = await addPrice({
      part_id: data.part_id,
      amount: data.amount,
      cost_amount: data.cost_amount,
      price_type: data.price_type,
      source: data.source,
      source_detail: data.source_detail,
      is_xero_current: data.is_xero_current || data.source === "xero",
      observed_at: data.observed_at,
    });
    return { ok: true as const, price };
  });

export const partsImportXero = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const d = data as { code?: string; csv?: string; detail?: string };
    return {
      code: String(d?.code || ""),
      csv: String(d?.csv || ""),
      detail: d?.detail != null ? String(d.detail) : null,
    };
  })
  .handler(async ({ data }) => {
    const { PARTS_ADMIN_CODE, importXeroCsv } = await import(
      "@/lib/parts-core.server"
    );
    assertCode(data.code, PARTS_ADMIN_CODE());
    if (!data.csv.trim()) throw new Error("CSV content required");
    return importXeroCsv(data.csv, data.detail || undefined);
  });
