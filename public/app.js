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

    console.log("Advance Paint quotation request:", {
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

if ("modelContext" in document && document.modelContext) {
  document.modelContext.registerTool({
    name: "get_property_report",
    description:
      "Start an Advance Paint property report using a property address.",
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
      const addressInput =
        document.getElementById("propertyAddress");

      if (!addressInput) {
        return "Property address field was not found.";
      }

      addressInput.value = address;

      propertyForm.requestSubmit();

      return `Property report started for ${address}.`;
    }
  });
}

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
