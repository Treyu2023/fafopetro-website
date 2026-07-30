import { createFileRoute } from "@tanstack/react-router";
import { loginToolboxWithPassword } from "@/lib/app-profiles-core.server";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const Route = createFileRoute("/api/toolbox/login")({
  server: {
    handlers: {
      OPTIONS: async () =>
        new Response(null, { status: 204, headers: cors }),
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as {
            email?: string;
            password?: string;
          };
          const result = await loginToolboxWithPassword(
            String(body.email || "").trim().toLowerCase(),
            String(body.password || ""),
          );
          return Response.json(result, {
            status: result.ok ? 200 : 401,
            headers: cors,
          });
        } catch (e) {
          return Response.json(
            {
              ok: false,
              message: e instanceof Error ? e.message : "Login failed",
            },
            { status: 500, headers: cors },
          );
        }
      },
    },
  },
});
