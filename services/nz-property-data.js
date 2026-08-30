const LINZ_WFS_URL = "https://data.linz.govt.nz/services;key=";
const ADDRESS_LAYER = "data.linz.govt.nz:layer-123113";

export async function getNZPropertyData(address, apiKey) {
  if (!apiKey) {
    return {
      address,
      source: {
        name: "LINZ Data Service",
        type: "external",
        status: "missing_api_key"
      },
      data: {}
    };
  }

  try {
    const params = new URLSearchParams({
      service: "WFS",
      version: "2.0.0",
      request: "GetFeature",
      typeNames: ADDRESS_LAYER,
      outputFormat: "application/json",
      cql_filter: `full_address ILIKE '%${address.replace(/'/g, "''")}%'`,
      count: "10"
    });

    const url =
      `${LINZ_WFS_URL}${encodeURIComponent(apiKey)}/wfs?${params}`;

    const response = await fetch(url);
    const text = await response.text();

    if (!response.ok) {
      return {
        address,
        source: {
          name: "LINZ Data Service",
          type: "external",
          status: "request_failed",
          httpStatus: response.status
        },
        data: {
          linzResponse: text.slice(0, 3000)
        }
      };
    }

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = {
        rawResponse: text.slice(0, 3000)
      };
    }

    return {
      address,
      source: {
        name: "LINZ Data Service",
        type: "external",
        status: "connected"
      },
      data
    };

  } catch (error) {
    return {
      address,
      source: {
        name: "LINZ Data Service",
        type: "external",
        status: "request_failed"
      },
      data: {
        error: error.message
      }
    };
  }
}