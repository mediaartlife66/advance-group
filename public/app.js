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
PROPERTY REPORT
--------------------------------------------------
*/

if (propertyForm) {
  propertyForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const address =
      document.getElementById("propertyAddress").value.trim();

    if (!address) {
      return;
    }

    reportAddress.textContent = address;

    reportStatus.textContent =
      "Initial property assessment ready";

    reportSources.textContent =
      "Public NZ property information";

    propertyReport.classList.remove("hidden");

    propertyReport.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

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
