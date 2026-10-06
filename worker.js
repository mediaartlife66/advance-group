import { getPropertyData } from "./services/property-data.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/property-report") {
      if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

      try {
        const body = await request.json();
        const address = String(body.address || "").trim();
        if (!address) return json({ error: "Property address is required" }, 400);

        const report = await getPropertyData(address, env);

        if (report.status === "error") {
          return json({
            address: report.address,
            status: "error",
            message: report.message,
            sources: report.sources || [],
            property: report.data || {}
          }, 502);
        }

        return json({
          address: report.address,
          status: report.status,
          message: report.message,
          sources: report.sources,
          property: report.data
        });
      } catch (error) {
        console.error("Property report error:", error);
        return json({ error: "Unable to retrieve property data." }, 500);
      }
    }

    return env.ASSETS.fetch(request);
  }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
