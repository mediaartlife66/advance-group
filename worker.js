import { getPropertyData } from "./services/property-data.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/property-report") {
      if (request.method !== "POST") {
        return new Response(
          JSON.stringify({ error: "Method not allowed" }),
          {
            status: 405,
            headers: { "Content-Type": "application/json" }
          }
        );
      }

      try {
        const body = await request.json();
        const address = String(body.address || "").trim();

        if (!address) {
          return new Response(
            JSON.stringify({ error: "Property address is required" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" }
            }
          );
        }

        const result = await getPropertyData(
          address,
          env.LINZ_API_KEY
        );

        return new Response(
          JSON.stringify(result),
          {
            status: result.validation?.valid ? 200 : 400,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );

      } catch (error) {
        console.error("Property report error:", error);

        return new Response(
          JSON.stringify({
            error: "Property intelligence service failed."
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
      }
    }

    return env.ASSETS.fetch(request);
  }
};