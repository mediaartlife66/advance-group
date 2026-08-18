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

        return new Response(
          JSON.stringify({
            address,
            status: "ready",
            message: "Property address received.",
            sources: [],
            property: {
              address,
              council: "Pending public data lookup",
              propertyType: "Pending",
              yearBuilt: "Pending",
              landArea: "Pending",
              floorArea: "Pending"
            }
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" }
          }
        );

      } catch (error) {
        return new Response(
          JSON.stringify({ error: "Invalid request" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
    }

    return env.ASSETS.fetch(request);
  }
};
