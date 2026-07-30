import { createFileRoute } from "@tanstack/react-router";
import { verifyToolboxToken } from "@/lib/app-profiles-core.server";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const Route = createFileRoute("/api/toolbox/verify")({
  server: {
    handlers: {
      OPTIONS: async () =>
        new Response(null, { status: 204, headers: cors }),
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as { token?: string };
          const auth = request.headers.get("authorization") || "";
          const bearer = auth.toLowerCase().startsWith("bearer ")
            ? auth.slice(7).trim()
            : "";
          const token = String(body.token || bearer || "");
          const result = await verifyToolboxToken(token);
          return Response.json(result, {
            status: result.ok ? 200 : 401,
            headers: cors,
          });
        } catch (e) {
          return Response.json(
            {
              ok: false,
              message: e instanceof Error ? e.message : "Verify failed",
            },
            { status: 500, headers: cors },
          );
        }
      },
    },
  },
});
