import { createServerFn } from "@tanstack/react-start";
import { readAccessCode } from "@/lib/access-code";

/** Partner vault unlock. The expected code stays on the server. */
export const unlockSumranVault = createServerFn({ method: "POST" })
  .validator((data: unknown) => ({
    code: String((data as { code?: string })?.code ?? ""),
  }))
  .handler(async ({ data }) => {
    const expected = readAccessCode("SUMRAN_ACCESS_CODE");
    const raw = data.code.trim().toUpperCase();
    const hyphenated = raw.replace(/\s+/g, "-");
    const ok = Boolean(expected && (raw === expected || hyphenated === expected));
    if (!ok) throw new Error("Invalid access code");
    return { ok: true as const };
  });
