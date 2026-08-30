const LINZ_WFS_URL = "https://data.linz.govt.nz/services;key=";

const ADDRESS_LAYER = "data.linz.govt.nz:layer-123113";
const PARCEL_LAYER = "data.linz.govt.nz:layer-50772";

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
    // ------------------------------------------------------------
    // 1. FIND THE EXACT ADDRESS
    // ------------------------------------------------------------

    const addressParams = new URLSearchParams({
      service: "WFS",
      version: "2.0.0",
      request: "GetFeature",
      typeNames: ADDRESS_LAYER,
      outputFormat: "application/json",
      cql_filter: `full_address ILIKE '%${address.replace(/'/g, "''")}%'`,
      count: "10"
    });

    const addressUrl =
      `${LINZ_WFS_URL}${encodeURIComponent(apiKey)}/wfs?${addressParams}`;

    const addressResponse = await fetch(addressUrl);
    const addressText = await addressResponse.text();

    if (!addressResponse.ok) {
      return {
        address,
        source: {
          name: "LINZ Data Service",
          type: "external",
          status: "request_failed",
          httpStatus: addressResponse.status
        },
        data: {
          stage: "address_lookup",
          linzResponse: addressText.slice(0, 3000)
        }
      };
    }

    let addressData;

    try {
      addressData = JSON.parse(addressText);
    } catch {
      return {
        address,
        source: {
          name: "LINZ Data Service",
          type: "external",
          status: "request_failed"
        },
        data: {
          stage: "address_lookup",
          error: "LINZ returned invalid JSON",
          rawResponse: addressText.slice(0, 3000)
        }
      };
    }

    const features = addressData.features || [];

    if (features.length === 0) {
      return {
        address,
        source: {
          name: "LINZ Data Service",
          type: "external",
          status: "connected"
        },
        data: {
          stage: "address_lookup",
          addressFound: false,
          message: "No LINZ address match found."
        }
      };
    }

    // Use the first matching address.
    const addressFeature = features[0];
    const addressProperties = addressFeature.properties || {};
    const coordinates = addressFeature.geometry?.coordinates;

    if (
      !Array.isArray(coordinates) ||
      coordinates.length < 2
    ) {
      return {
        address,
        source: {
          name: "LINZ Data Service",
          type: "external",
          status: "request_failed"
        },
        data: {
          stage: "address_lookup",
          addressFound: true,
          error: "LINZ address has no usable coordinates",
          addressRecord: addressProperties
        }
      };
    }

    const longitude = Number(coordinates[0]);
    const latitude = Number(coordinates[1]);

    // ------------------------------------------------------------
    // 2. FIND THE PRIMARY PARCEL USING THE ADDRESS COORDINATES
    // ------------------------------------------------------------

    const parcelParams = new URLSearchParams({
      service: "WFS",
      version: "2.0.0",
      request: "GetFeature",
      typeNames: PARCEL_LAYER,
      outputFormat: "application/json",
      srsName: "EPSG:4326",
      bbox: `${longitude - 0.0002},${latitude - 0.0002},${longitude + 0.0002},${latitude + 0.0002},EPSG:4326`,
      count: "10"
    });

    const parcelUrl =
      `${LINZ_WFS_URL}${encodeURIComponent(apiKey)}/wfs?${parcelParams}`;

    const parcelResponse = await fetch(parcelUrl);
    const parcelText = await parcelResponse.text();

    if (!parcelResponse.ok) {
      return {
        address,
        source: {
          name: "LINZ Data Service",
          type: "external",
          status: "request_failed",
          httpStatus: parcelResponse.status
        },
        data: {
          stage: "parcel_lookup",
          addressFound: true,
          addressRecord: addressProperties,
          coordinates: {
            longitude,
            latitude
          },
          linzResponse: parcelText.slice(0, 3000)
        }
      };
    }

    let parcelData;

    try {
      parcelData = JSON.parse(parcelText);
    } catch {
      return {
        address,
        source: {
          name: "LINZ Data Service",
          type: "external",
          status: "request_failed"
        },
        data: {
          stage: "parcel_lookup",
          addressFound: true,
          addressRecord: addressProperties,
          coordinates: {
            longitude,
            latitude
          },
          error: "LINZ parcel response was not valid JSON",
          rawResponse: parcelText.slice(0, 3000)
        }
      };
    }

    // ------------------------------------------------------------
    // 3. RETURN ADDRESS + PARCEL DATA
    // ------------------------------------------------------------

    return {
      address,
      source: {
        name: "LINZ Data Service",
        type: "external",
        status: "connected"
      },
      data: {
        addressFound: true,

        address: {
          id: addressFeature.id || null,
          properties: addressProperties,
          coordinates: {
            longitude,
            latitude
          }
        },

        parcel: {
          found: Array.isArray(parcelData.features)
            ? parcelData.features.length > 0
            : false,
          featureCount: Array.isArray(parcelData.features)
            ? parcelData.features.length
            : 0,
          features: parcelData.features || []
        }
      }
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