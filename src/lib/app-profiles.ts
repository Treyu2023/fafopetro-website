/**
 * Client-safe surface: createServerFn RPC only.
 * All node/db/auth work lives in app-profiles-core.server.ts and is imported
 * only inside handlers (or from API route server handlers).
 */
import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import type { AppProfile } from "@/lib/app-profiles-types";

export type { AppProfile };

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<AppProfile> => {
    const { ensureProfile } = await import("@/lib/app-profiles-core.server");
    return ensureProfile(context.userId);
  });

export const syncMyProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => {
    const d = data as { email?: string; name?: string };
    return {
      email: String(d?.email || "").trim() || null,
      name: String(d?.name || "").trim() || null,
    };
  })
  .handler(async ({ context, data }): Promise<AppProfile> => {
    const { ensureProfile } = await import("@/lib/app-profiles-core.server");
    return ensureProfile(context.userId, data.email, data.name);
  });

export const requestToolboxAccess = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<AppProfile> => {
    const { ensureProfile, ensureTables } = await import(
      "@/lib/app-profiles-core.server"
    );
    const sql = await ensureTables();
    const profile = await ensureProfile(context.userId);
    if (profile.toolbox_access) return profile;
    await sql`
      update app_profiles
      set toolbox_status = 'pending', updated_at = now()
      where user_id = ${context.userId}
    `;
    return { ...profile, toolbox_status: "pending" };
  });

export const listToolboxRequests = createServerFn({ method: "POST" })
  .validator((data: unknown) => ({
    code: String((data as { code?: string })?.code || ""),
  }))
  .handler(async ({ data }): Promise<{ rows: AppProfile[] }> => {
    const { ADMIN_CODE, ensureTables } = await import(
      "@/lib/app-profiles-core.server"
    );
    if (data.code.trim().toUpperCase() !== ADMIN_CODE()) {
      throw new Error("Invalid access code");
    }
    const sql = await ensureTables();
    const rows = await sql<AppProfile>`
      select user_id, email, display_name, toolbox_access, toolbox_status, role
      from app_profiles
      where toolbox_status in ('pending', 'approved') or toolbox_access = true
      order by updated_at desc nulls last
      limit 100
    `;
    return { rows };
  });

export const setToolboxAccess = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const d = data as { code?: string; userId?: string; allow?: boolean };
    return {
      code: String(d?.code || ""),
      userId: String(d?.userId || ""),
      allow: Boolean(d?.allow),
    };
  })
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const { ADMIN_CODE, ensureTables } = await import(
      "@/lib/app-profiles-core.server"
    );
    if (data.code.trim().toUpperCase() !== ADMIN_CODE()) {
      throw new Error("Invalid access code");
    }
    if (!data.userId) throw new Error("userId required");
    const sql = await ensureTables();
    await sql`
      update app_profiles
      set toolbox_access = ${data.allow},
          toolbox_status = ${data.allow ? "approved" : "revoked"},
          role = case
            when ${data.allow} and role = 'member' then 'tech'
            when not ${data.allow} and role = 'tech' then 'member'
            else role
          end,
          updated_at = now()
      where user_id = ${data.userId}
    `;
    return { ok: true };
  });
