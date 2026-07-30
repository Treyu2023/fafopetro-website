/** Server-only profile / toolbox token logic. Do not import from client components. */
import { randomBytes, createHash } from "node:crypto";
import { getSql } from "@/lib/db";
import type { AppProfile } from "@/lib/app-profiles-types";

export type { AppProfile };

export const ADMIN_CODE = () =>
  (
    process.env.SITES_ADMIN_CODE ||
    process.env.QUOTE_LEADS_CODE ||
    "FAFO-LEADS"
  ).toUpperCase();

function bootstrapAdminEmails(): Set<string> {
  const raw = process.env.FAFO_ADMIN_EMAILS || "rkey@fafopetro.com";
  return new Set(
    raw
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
}

export async function ensureTables() {
  const sql = await getSql();
  await sql.query(`
    create table if not exists app_profiles (
      user_id text primary key,
      email text,
      display_name text,
      toolbox_access boolean not null default false,
      toolbox_status text not null default 'none',
      role text not null default 'member',
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `);
  await sql.query(`
    create table if not exists toolbox_sessions (
      token text primary key,
      user_id text not null,
      email text,
      created_at timestamptz not null default now(),
      expires_at timestamptz not null,
      revoked boolean not null default false
    )
  `);
  return sql;
}

export async function ensureProfile(
  userId: string,
  email?: string | null,
  name?: string | null,
): Promise<AppProfile> {
  const sql = await ensureTables();
  const existing = await sql<AppProfile>`
    select user_id, email, display_name, toolbox_access, toolbox_status, role
    from app_profiles where user_id = ${userId} limit 1
  `;
  if (existing[0]) {
    if (email || name) {
      await sql`
        update app_profiles
        set email = coalesce(${email || null}, email),
            display_name = coalesce(${name || null}, display_name),
            updated_at = now()
        where user_id = ${userId}
      `;
      const refreshed = await sql<AppProfile>`
        select user_id, email, display_name, toolbox_access, toolbox_status, role
        from app_profiles where user_id = ${userId} limit 1
      `;
      return refreshed[0];
    }
    return existing[0];
  }

  const em = (email || "").toLowerCase();
  const isBootstrapAdmin = Boolean(em && bootstrapAdminEmails().has(em));
  const role = isBootstrapAdmin ? "admin" : "member";
  const toolbox = isBootstrapAdmin;
  const status = isBootstrapAdmin ? "approved" : "none";

  await sql`
    insert into app_profiles (user_id, email, display_name, toolbox_access, toolbox_status, role)
    values (
      ${userId},
      ${email || null},
      ${name || null},
      ${toolbox},
      ${status},
      ${role}
    )
  `;
  return {
    user_id: userId,
    email: email || null,
    display_name: name || null,
    toolbox_access: toolbox,
    toolbox_status: status,
    role,
  };
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function issueToolboxToken(
  userId: string,
  email: string | null,
): Promise<{ token: string; expiresAt: string }> {
  const raw = randomBytes(32).toString("hex");
  const tokenHash = hashToken(raw);
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const sql = await ensureTables();
  await sql`
    insert into toolbox_sessions (token, user_id, email, expires_at)
    values (${tokenHash}, ${userId}, ${email}, ${expires.toISOString()})
  `;
  return { token: raw, expiresAt: expires.toISOString() };
}

export async function verifyToolboxToken(
  token: string,
): Promise<
  | { ok: true; email: string | null; userId: string }
  | { ok: false; message: string }
> {
  if (!token) return { ok: false, message: "Missing token" };
  const sql = await ensureTables();
  const tokenHash = hashToken(token);
  const rows = await sql<{
    user_id: string;
    email: string | null;
    expires_at: string;
    revoked: boolean;
  }>`
    select user_id, email, expires_at::text as expires_at, revoked
    from toolbox_sessions
    where token = ${tokenHash}
    limit 1
  `;
  const row = rows[0];
  if (!row || row.revoked) return { ok: false, message: "Invalid session" };
  if (new Date(row.expires_at).getTime() < Date.now()) {
    return { ok: false, message: "Session expired — sign in again" };
  }
  const profile = await ensureProfile(row.user_id, row.email);
  if (!profile.toolbox_access) {
    return { ok: false, message: "Toolbox access revoked" };
  }
  return { ok: true, email: row.email, userId: row.user_id };
}

export async function loginToolboxWithPassword(
  email: string,
  password: string,
): Promise<
  | {
      ok: true;
      token: string;
      email: string;
      name: string | null;
      expiresAt: string;
    }
  | { ok: false; message: string }
> {
  if (!email || !password) {
    return { ok: false, message: "Email and password required." };
  }
  try {
    const { auth } = await import("@/lib/auth/server");
    const result = await auth.api.signInEmail({
      body: { email, password },
    });
    const user = (
      result as { user?: { id: string; email: string; name?: string } }
    )?.user;
    if (!user?.id) {
      return { ok: false, message: "Invalid email or password." };
    }
    const profile = await ensureProfile(user.id, user.email, user.name ?? null);
    if (!profile.toolbox_access) {
      return {
        ok: false,
        message:
          "Account OK, but toolbox access is not approved yet. Sign in on the website → Account → request toolbox access.",
      };
    }
    const issued = await issueToolboxToken(user.id, user.email);
    return {
      ok: true,
      token: issued.token,
      email: user.email,
      name: user.name ?? null,
      expiresAt: issued.expiresAt,
    };
  } catch {
    return { ok: false, message: "Invalid email or password." };
  }
}
