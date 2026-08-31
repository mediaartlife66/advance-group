import { createProperty } from "./property-intelligence.js";

let currentProperty = null;

const propertyForm = document.getElementById("propertyForm");
const propertyReport = document.getElementById("propertyReport");

const reportAddress = document.getElementById("reportAddress");
const reportStatus = document.getElementById("reportStatus");
const reportSources = document.getElementById("reportSources");

const quoteForm = document.getElementById("quoteForm");
const success = document.getElementById("success");
/*
--------------------------------------------------
STREETKIT ADDRESS AUTOCOMPLETE
--------------------------------------------------
*/

let selectedStreetKitAddress = null;

window.addEventListener("DOMContentLoaded", () => {

  if (!window.StreetKit) {
    console.warn("StreetKit did not load.");
    return;
  }

  const addressInput =
    document.getElementById("propertyAddress");

  if (!addressInput) {
    return;
  }

  StreetKit.init({

    input: "#propertyAddress",

    publicMode: true,

    indexBaseUrl:
      "https://index.streetkit.smp.kiwi/public/v1",

    limit: 8,

    minQueryLength: 3,

    onSelect(address) {

      selectedStreetKitAddress = address;

      addressInput.value =
        address.label;

      const addressId =
        document.getElementById("selectedAddressId");

      const latitude =
        document.getElementById("selectedLatitude");

      const longitude =
        document.getElementById("selectedLongitude");

      if (addressId) {
        addressId.value =
          address.id || "";
      }

      if (latitude) {
        latitude.value =
          address.location?.lat ?? "";
      }

      if (longitude) {
        longitude.value =
          address.location?.lon ?? "";
      }

      console.log(
        "StreetKit selected address:",
        address
      );
    },

    onClear() {

      selectedStreetKitAddress = null;

      const addressId =
        document.getElementById("selectedAddressId");

      const latitude =
        document.getElementById("selectedLatitude");

      const longitude =
        document.getElementById("selectedLongitude");

      if (addressId) {
        addressId.value = "";
      }

      if (latitude) {
        latitude.value = "";
      }

      if (longitude) {
        longitude.value = "";
      }

    },

    onError(error) {

      console.warn(
        "StreetKit error:",
        error
      );

    }

  });

});

/*
--------------------------------------------------
PROPERTY REPORT
--------------------------------------------------
*/

if (propertyForm) {
  propertyForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const address =
      document.getElementById("propertyAddress").value.trim();

    if (!address) {
      return;
    }

    reportAddress.textContent = address;
    reportStatus.textContent = "Analysing property...";
    reportSources.textContent = "Connecting to NZ property data...";

    propertyReport.classList.remove("hidden");

    propertyReport.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    try {

      const response = await fetch(
        "/api/property-report",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            address
          })
        }
      );

      const result = await response.json();

      console.log(
        "Advance Group Property Report:",
        result
      );

      if (!response.ok) {

        reportStatus.textContent =
          result.error || "Property report could not be created.";

        reportSources.textContent =
          "Property data validation failed.";

        return;
      }

      reportStatus.textContent =
        result.validation?.valid
          ? "Property assessment ready"
          : "Property address requires verification";

      reportSources.textContent =
        result.status === "connected"
          ? "LINZ property data connected"
          : "NZ property data searched";

      const linzReport =
        document.getElementById("linzReport");

      const propertyData =
        result.data || {};

      const parcelFeature =
        propertyData.parcel?.features?.[0];

      const parcelFeatures =
  result.data.parcel.features || [];

const parcel =
  parcelFeatures
    .map(feature => feature.properties || {})
    .find(parcel =>
      parcel.parcel_intent !== "Road" &&
      (
        parcel.appellation ||
        parcel.titles ||
        parcel.survey_area ||
        parcel.calc_area
      )
    ) || {};
      const coordinates =
        propertyData.address?.coordinates || {};

      if (linzReport) {

        document.getElementById("reportParcel").textContent =
          parcel.appellation || "Not available";

        document.getElementById("reportTitle").textContent =
          parcel.titles || "Not available";

        document.getElementById("reportSurveyArea").textContent =
          parcel.survey_area != null
            ? `${parcel.survey_area} m²`
            : "Not available";

        document.getElementById("reportCalcArea").textContent =
          parcel.calc_area != null
            ? `${parcel.calc_area} m²`
            : "Not available";

        document.getElementById("reportLandDistrict").textContent =
          parcel.land_district || "Not available";

        document.getElementById("reportLatitude").textContent =
          coordinates.latitude != null
            ? coordinates.latitude
            : "Not available";

        document.getElementById("reportLongitude").textContent =
          coordinates.longitude != null
            ? coordinates.longitude
            : "Not available";

        linzReport.classList.remove("hidden");
      }

      currentProperty = result;
    } catch (error) {

      console.error(
        "Advance Group Property Report error:",
        error
      );

      reportStatus.textContent =
        "Unable to connect to property intelligence service.";

      reportSources.textContent =
        "Please try again.";
    }

  });
}


/*
--------------------------------------------------
PROFESSIONAL QUOTATION
--------------------------------------------------
*/

if (quoteForm) {

  quoteForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const name =
      document.getElementById("quoteName").value.trim();

    const phone =
      document.getElementById("quotePhone").value.trim();

    if (!name || !phone) {
      return;
    }

    success.textContent =
      "Thanks. Your quotation request has been recorded for the next step.";

    success.classList.remove("hidden");

    success.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    console.log("Advance Group quotation request:", {
      name,
      phone
    });

  });

}


/*
--------------------------------------------------
WEBMCP PROPERTY REPORT TOOL
--------------------------------------------------
*/

if (document.modelContext) {

  document.modelContext.registerTool({

    name: "get_property_report",

    description:
      "Start an Advance Group property report using a property address.",

    inputSchema: {
      type: "object",

      properties: {
        address: {
          type: "string",
          description: "The property address to analyse."
        }
      },

      required: ["address"]
    },

    execute: async ({ address }) => {

      const cleanAddress = String(address || "").trim();

      if (!cleanAddress) {
        return {
          success: false,
          error: "Property address is required."
        };
      }

      const addressInput =
        document.getElementById("propertyAddress");

      if (!addressInput) {
        return {
          success: false,
          error: "Property address field was not found."
        };
      }

      /*
      --------------------------------------------------
      CREATE LOCAL PROPERTY PROFILE
      --------------------------------------------------
      */

      addressInput.value = cleanAddress;

      currentProperty = createProperty(cleanAddress);

      console.log(
        "Advance Group Property Intelligence:",
        currentProperty
      );


      /*
      --------------------------------------------------
      START UI PROPERTY REPORT
      --------------------------------------------------
      */

      const form =
        document.getElementById("propertyForm");

      if (form) {
        form.requestSubmit();
      }


      /*
      --------------------------------------------------
      CALL CLOUDFLARE WORKER
      --------------------------------------------------
      */

      try {

        const response = await fetch(
          "/api/property-report",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json"
            },

            body: JSON.stringify({
              address: cleanAddress
            })
          }
        );

        const propertyReport =
          await response.json();

        console.log(
          "Advance Group Worker Property Report:",
          propertyReport
        );


        /*
        --------------------------------------------------
        WORKER ERROR
        --------------------------------------------------
        */

        if (!response.ok) {

          return {
            success: false,
            address: cleanAddress,
            error:
              propertyReport.error ||
              "Property report request failed."
          };

        }


        /*
        --------------------------------------------------
        SUCCESS
        --------------------------------------------------
        */

        return {
          success: true,

          address: cleanAddress,

          status:
            propertyReport.status,

          propertyId:
            currentProperty.id,

          workerReport:
            propertyReport,

          message:
            `Property report started for ${cleanAddress}.`
        };

      } catch (error) {

        console.error(
          "Advance Group Worker error:",
          error
        );

        return {
          success: false,

          address: cleanAddress,

          error:
            "Unable to connect to the property intelligence service."
        };

      }

    }

  });

  console.log(
    "Advance Group WebMCP tool registered:",
    "get_property_report"
  );

}


/*
--------------------------------------------------
FUTURE PROPERTY INTELLIGENCE DATA LAYER
--------------------------------------------------

Future flow:

PROPERTY ADDRESS
       ↓
ADDRESS VALIDATION
       ↓
NZ PUBLIC PROPERTY DATA
       ↓
COUNCIL DATA
       ↓
PROPERTY PROFILE
       ↓
APA ANALYSIS
       ↓
PROPERTY REPORT
       ↓
PAINTING PROJECT INTELLIGENCE

Private API keys must never be exposed
inside this browser file.

Future external APIs should be connected
through worker.js / server-side functions.
--------------------------------------------------
*/
