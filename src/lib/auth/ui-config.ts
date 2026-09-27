import { createServerFn } from "@tanstack/react-start";

/**
 * Public sign-in flags. Google/X buttons render only when broker credentials
 * are actually configured. The client never receives the secrets.
 */
export const getAuthUiConfig = createServerFn({ method: "GET" }).handler(async () => {
  const clientId = process.env.GROK_AUTH_CLIENT_ID?.trim();
  const clientSecret = process.env.GROK_AUTH_CLIENT_SECRET?.trim();
  return { socialEnabled: Boolean(clientId && clientSecret) };
});
