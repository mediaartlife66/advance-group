const LINZ_ADDRESSES_LAYER = "layer-123113";

export async function getNZPropertyData(address, env) {
  if (!env?.LINZ_API_KEY) {
    return {
      source: { name: "LINZ Data Service", type: "official_public_data", status: "not_configured" },
      data: {},
      status: "error",
      message: "LINZ_API_KEY is not configured."
    };
  }

  const parsed = parseAddress(address);
  if (!parsed) {
    return {
      source: { name: "LINZ Data Service", type: "official_public_data", status: "invalid_address" },
      data: {},
      status: "error",
      message: "Enter a New Zealand street address, for example 111A King Avenue."
    };
  }

  const params = new URLSearchParams({
    service: "WFS",
    version: "2.0.0",
    request: "GetFeature",
    typeNames: LINZ_ADDRESSES_LAYER,
    outputFormat: "json",
    count: "5",
    propertyName: "address_id,address_number,address_number_suffix,address_number_high,full_road_name,suburb_locality,town_city",
    cql_filter: buildFilter(parsed)
  });

  const endpoint = `https://data.linz.govt.nz/services;key=${encodeURIComponent(env.LINZ_API_KEY)}/wfs?${params.toString()}`;
  const response = await fetch(endpoint, { headers: { Accept: "application/json" } });

  if (!response.ok) {
    return {
      source: { name: "LINZ Data Service", type: "official_public_data", status: "request_failed" },
      data: {},
      status: "error",
      message: `LINZ returned HTTP ${response.status}.`
    };
  }

  const payload = await response.json();
  const feature = payload?.features?.[0];

  if (!feature) {
    return {
      source: { name: "LINZ Data Service", type: "official_public_data", status: "no_match" },
      data: {},
      status: "not_found",
      message: "No matching LINZ address was found."
    };
  }

  const p = feature.properties || {};
  const coordinates = feature.geometry?.coordinates || null;

  const officialAddress = [
    formatNumber(p.address_number, p.address_number_suffix, p.address_number_high),
    p.full_road_name,
    p.suburb_locality,
    p.town_city
  ].filter(Boolean).join(", ");

  return {
    source: {
      name: "LINZ Data Service",
      type: "official_public_data",
      status: "connected",
      dataset: "NZ Addresses",
      layer: LINZ_ADDRESSES_LAYER
    },
    data: {
      address: officialAddress || address,
      addressId: p.address_id ?? null,
      streetNumber: p.address_number ?? null,
      streetNumberSuffix: p.address_number_suffix ?? null,
      streetNumberHigh: p.address_number_high ?? null,
      street: p.full_road_name ?? null,
      suburb: p.suburb_locality ?? null,
      city: p.town_city ?? null,
      coordinates
    },
    status: "ready",
    message: "Official LINZ address data found."
  };
}

function parseAddress(address) {
  const value = address.trim().replace(/\s+/g, " ");
  const match = value.match(/^(\d+)\s*([A-Za-z])?\s+(.+)$/);
  if (!match) return null;
  return { number: match[1], suffix: match[2] || "", street: match[3].trim() };
}

function buildFilter({ number, suffix, street }) {
  const safeStreet = escapeCql(street);
  const suffixFilter = suffix ? ` AND address_number_suffix='${escapeCql(suffix)}'` : "";
  return `address_number='${number}'${suffixFilter} AND full_road_name ILIKE '%${safeStreet}%'`;
}

function escapeCql(value) {
  return String(value).replace(/'/g, "''");
}

function formatNumber(number, suffix, high) {
  if (!number) return "";
  return `${number}${suffix || ""}${high ? `-${high}` : ""}`;
}
