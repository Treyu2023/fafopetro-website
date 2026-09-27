/**
 * Shared access codes for private tools.
 *
 * Codes come only from environment variables. If the variable is missing or
 * blank, the check never succeeds — the feature stays locked. There is no
 * built-in default.
 */

export function readAccessCode(name: string): string | null {
  const value = process.env[name]?.trim();
  return value ? value.toUpperCase() : null;
}

/** Parts, media, sites review, and toolbox grants. */
export function sitesAdminCode(): string | null {
  return readAccessCode("SITES_ADMIN_CODE") ?? readAccessCode("QUOTE_LEADS_CODE");
}

export function quoteLeadsCode(): string | null {
  return readAccessCode("QUOTE_LEADS_CODE");
}

export function accessCodeMatches(provided: string, expected: string | null): boolean {
  if (!expected) return false;
  return provided.trim().toUpperCase() === expected;
}

export function assertAccessCode(provided: string, expected: string | null): void {
  if (!accessCodeMatches(provided, expected)) {
    throw new Error("Invalid access code");
  }
}
