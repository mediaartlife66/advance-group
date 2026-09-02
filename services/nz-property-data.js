const LINZ_WFS_URL =
  "https://data.linz.govt.nz/services;key=";

const ADDRESS_LAYER =
  "layer-123113";

const PARCEL_LAYER =
  "layer-50772";

export async function getNZPropertyData(
  address,
  apiKey,
  latitude = null,
  longitude = null
) {

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

    /*
    --------------------------------------------------
    1. ADDRESS SEARCH
    --------------------------------------------------
    */

    const cleanAddress =
      String(address || "")
        .trim()
        .replace(/\s+/g, " ");


    const searches = [
      cleanAddress,
      cleanAddress.replace(/,/g, "")
    ];


    const uniqueSearches =
      [...new Set(searches)];


    let addressData = null;


    for (const searchAddress of uniqueSearches) {

      const safeAddress =
        searchAddress.replace(/'/g, "''");


      const addressParams =
        new URLSearchParams({

          service: "WFS",

          version: "2.0.0",

          request: "GetFeature",

          typeNames: ADDRESS_LAYER,

          outputFormat:
            "application/json",

          cql_filter:
  `full_address ILIKE '${safeAddress}'`,

          count: "10"

        });


      const addressUrl =
        `${LINZ_WFS_URL}${encodeURIComponent(apiKey)}/wfs?${addressParams}`;

console.log(
  "LINZ ADDRESS URL:",
  addressUrl.replace(encodeURIComponent(apiKey), "[API_KEY]")
);


      console.log(
        "LINZ address search:",
        searchAddress
      );


      const response =
        await fetch(addressUrl);


      const text =
        await response.text();


      if (!response.ok) {

        console.warn(
          "LINZ address request failed:",
          response.status,
          text.slice(0, 500)
        );

        continue;

      }


      let result;

      try {

        result =
          JSON.parse(text);

      } catch {

        console.warn(
          "LINZ returned invalid JSON"
        );

        continue;

      }


      if (
        result.features &&
        result.features.length > 0
      ) {

        addressData =
          result;

        console.log(
          "LINZ address found:",
          searchAddress
        );

        break;

      }

    }


    /*
    --------------------------------------------------
    2. IF ADDRESS WAS NOT FOUND
    --------------------------------------------------
    */

    if (
      !addressData ||
      !addressData.features ||
      addressData.features.length === 0
    ) {

      /*
      If StreetKit supplied coordinates,
      we can still continue directly to parcel lookup.
      */

      if (
        latitude != null &&
        longitude != null
      ) {

        console.log(
          "LINZ address text not found. Using StreetKit coordinates:",
          latitude,
          longitude
        );

      } else {

        return {

          address,

          source: {

            name:
              "LINZ Data Service",

            type:
              "external",

            status:
              "connected"

          },

          data: {

            stage:
              "address_lookup",

            addressFound:
              false,

            message:
              "No LINZ address match found."

          },

          status:
            "connected"

        };

      }

    }


    /*
    --------------------------------------------------
    3. GET COORDINATES
    --------------------------------------------------
    */

    let finalLatitude =
      latitude != null
        ? Number(latitude)
        : null;

    let finalLongitude =
      longitude != null
        ? Number(longitude)
        : null;


    let addressFeature = null;

    let addressProperties = {};


    if (
      addressData &&
      addressData.features &&
      addressData.features.length > 0
    ) {

      addressFeature =
        addressData.features[0];

      addressProperties =
        addressFeature.properties || {};


      const coordinates =
        addressFeature.geometry?.coordinates;


      if (
        Array.isArray(coordinates) &&
        coordinates.length >= 2
      ) {

        finalLongitude =
          Number(coordinates[0]);

        finalLatitude =
          Number(coordinates[1]);

      }

    }


    if (
      !Number.isFinite(finalLatitude) ||
      !Number.isFinite(finalLongitude)
    ) {

      return {

        address,

        source: {

          name:
            "LINZ Data Service",

          type:
            "external",

          status:
            "request_failed"

        },

        data: {

          stage:
            "address_lookup",

          addressFound:
            false,

          error:
            "No usable property coordinates available."

        },

        status:
          "request_failed"

      };

    }


    /*
    --------------------------------------------------
    4. FIND PARCEL USING COORDINATES
    --------------------------------------------------
    */

    console.log(
      "LINZ parcel lookup coordinates:",
      finalLatitude,
      finalLongitude
    );


const parcelParams =
  new URLSearchParams({

    service: "WFS",

    version: "2.0.0",

    request: "GetFeature",

    typeNames: PARCEL_LAYER,

    outputFormat:
      "application/json",

    srsName:
      "EPSG:4167",

    cql_filter:
      `Intersects(shape,POINT(${finalLatitude} ${finalLongitude}))`,

    count:
      "20"

  });


    const parcelUrl =
      `${LINZ_WFS_URL}${encodeURIComponent(apiKey)}/wfs?${parcelParams}`;


    const parcelResponse =
      await fetch(parcelUrl);


    const parcelText =
      await parcelResponse.text();

console.log(
  "LINZ parcel response:",
  parcelText.slice(0, 5000)
);


    if (!parcelResponse.ok) {

      console.error(
        "LINZ parcel request failed:",
        parcelResponse.status,
        parcelText.slice(0, 1000)
      );


      return {

        address,

        source: {

          name:
            "LINZ Data Service",

          type:
            "external",

          status:
            "request_failed"

        },

        data: {

          stage:
            "parcel_lookup",

          addressFound:
            Boolean(addressFeature),

          coordinates: {

            longitude:
              finalLongitude,

            latitude:
              finalLatitude

          },

          linzResponse:
            parcelText.slice(0, 3000)

        },

        status:
          "request_failed"

      };

    }


    let parcelData;

    try {

      parcelData =
        JSON.parse(parcelText);

    } catch {

      return {

        address,

        source: {

          name:
            "LINZ Data Service",

          type:
            "external",

          status:
            "request_failed"

        },

        data: {

          stage:
            "parcel_lookup",

          error:
            "LINZ parcel response was not valid JSON",

          rawResponse:
            parcelText.slice(0, 3000)

        },

        status:
          "request_failed"

      };

    }


    /*
    --------------------------------------------------
    5. RETURN PROPERTY DATA
    --------------------------------------------------
    */

    return {

      address,

      source: {

        name:
          "LINZ Data Service",

        type:
          "external",

        status:
          "connected"

      },

      data: {

        addressFound:
          Boolean(addressFeature),

        address: {

          id:
            addressFeature?.id || null,

          properties:
            addressProperties,

          coordinates: {

            longitude:
              finalLongitude,

            latitude:
              finalLatitude

          }

        },

        parcel: {

          found:
            Array.isArray(parcelData.features)
              ? parcelData.features.length > 0
              : false,

          featureCount:
            Array.isArray(parcelData.features)
              ? parcelData.features.length
              : 0,

          features:
            parcelData.features || []

        }

      },

      status:
        "connected"

    };


  } catch (error) {

    console.error(
      "LINZ property data error:",
      error
    );


    return {

      address,

      source: {

        name:
          "LINZ Data Service",

        type:
          "external",

        status:
          "request_failed"

      },

      data: {

        error:
          error.message

      },

      status:
        "request_failed"

    };

  }

}