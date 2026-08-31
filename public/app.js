import { createProperty } from "./property-intelligence.js";

let currentProperty = null;
let selectedStreetKitAddress = null;

const propertyForm =
  document.getElementById("propertyForm");

const propertyReport =
  document.getElementById("propertyReport");

const reportAddress =
  document.getElementById("reportAddress");

const reportStatus =
  document.getElementById("reportStatus");

const reportSources =
  document.getElementById("reportSources");

const quoteForm =
  document.getElementById("quoteForm");

const success =
  document.getElementById("success");


/*
--------------------------------------------------
STREETKIT ADDRESS AUTOCOMPLETE
--------------------------------------------------
*/

window.addEventListener("DOMContentLoaded", () => {

  if (!window.StreetKit) {

    console.warn(
      "StreetKit did not load."
    );

    return;
  }


  const addressInput =
    document.getElementById(
      "propertyAddress"
    );


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

      selectedStreetKitAddress =
        address;


      addressInput.value =
        address.label;


      console.log(
        "StreetKit selected address:",
        address
      );

    },


    onClear() {

      selectedStreetKitAddress =
        null;

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

  propertyForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      const addressInput =
        document.getElementById(
          "propertyAddress"
        );


      const address =
        addressInput.value.trim();


      if (!address) {
        return;
      }


      reportAddress.textContent =
        address;

      reportStatus.textContent =
        "Analysing property...";

      reportSources.textContent =
        "Connecting to NZ property data...";


      propertyReport.classList.remove(
        "hidden"
      );


      propertyReport.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });


      /*
      ----------------------------------------------
      SEND STREETKIT DATA WHEN AVAILABLE
      ----------------------------------------------
      */

      const requestBody = {
        address
      };


      if (
        selectedStreetKitAddress?.location
      ) {

        requestBody.latitude =
          selectedStreetKitAddress.location.lat;

        requestBody.longitude =
          selectedStreetKitAddress.location.lon;

        requestBody.streetKitId =
          selectedStreetKitAddress.id || null;

      }


      console.log(
        "Advance Group property request:",
        requestBody
      );


      try {

        const response =
          await fetch(
            "/api/property-report",
            {

              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify(
                  requestBody
                )

            }
          );


        const result =
          await response.json();


        console.log(
          "Advance Group Property Report:",
          result
        );


        if (!response.ok) {

          reportStatus.textContent =
            result.error ||
            "Property report could not be created.";

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
          document.getElementById(
            "linzReport"
          );


        const propertyData =
          result.data || {};


        const parcelFeatures =
          propertyData.parcel?.features ||
          [];


        const parcel =
          parcelFeatures
            .map(
              feature =>
                feature.properties || {}
            )
            .find(
              parcel =>
                parcel.parcel_intent !==
                  "Road" &&
                (
                  parcel.appellation ||
                  parcel.titles ||
                  parcel.survey_area ||
                  parcel.calc_area
                )
            ) || {};


        const coordinates =
          propertyData.address
            ?.coordinates || {};


        if (linzReport) {

          document.getElementById(
            "reportParcel"
          ).textContent =
            parcel.appellation ||
            "Not available";


          document.getElementById(
            "reportTitle"
          ).textContent =
            parcel.titles ||
            "Not available";


          document.getElementById(
            "reportSurveyArea"
          ).textContent =
            parcel.survey_area != null
              ? `${parcel.survey_area} m²`
              : "Not available";


          document.getElementById(
            "reportCalcArea"
          ).textContent =
            parcel.calc_area != null
              ? `${parcel.calc_area} m²`
              : "Not available";


          document.getElementById(
            "reportLandDistrict"
          ).textContent =
            parcel.land_district ||
            "Not available";


          document.getElementById(
            "reportLatitude"
          ).textContent =
            coordinates.latitude != null
              ? coordinates.latitude
              : "Not available";


          document.getElementById(
            "reportLongitude"
          ).textContent =
            coordinates.longitude != null
              ? coordinates.longitude
              : "Not available";


          linzReport.classList.remove(
            "hidden"
          );

        }


        currentProperty =
          result;

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

    }

  );

}


/*
--------------------------------------------------
PROFESSIONAL QUOTATION
--------------------------------------------------
*/

if (quoteForm) {

  quoteForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const name =
        document.getElementById(
          "quoteName"
        ).value.trim();


      const phone =
        document.getElementById(
          "quotePhone"
        ).value.trim();


      if (!name || !phone) {
        return;
      }


      success.textContent =
        "Thanks. Your quotation request has been recorded for the next step.";


      success.classList.remove(
        "hidden"
      );


      success.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });


      console.log(
        "Advance Group quotation request:",
        {
          name,
          phone
        }
      );

    }
  );

}


/*
--------------------------------------------------
WEBMCP PROPERTY REPORT TOOL
--------------------------------------------------
*/

if (document.modelContext) {

  document.modelContext.registerTool({

    name:
      "get_property_report",

    description:
      "Start an Advance Group property report using a property address.",

    inputSchema: {

      type: "object",

      properties: {

        address: {

          type: "string",

          description:
            "The property address to analyse."

        }

      },

      required: [
        "address"
      ]

    },


    execute:
      async ({ address }) => {

        const cleanAddress =
          String(address || "")
            .trim();


        if (!cleanAddress) {

          return {

            success: false,

            error:
              "Property address is required."

          };

        }


        const addressInput =
          document.getElementById(
            "propertyAddress"
          );


        if (!addressInput) {

          return {

            success: false,

            error:
              "Property address field was not found."

          };

        }


        addressInput.value =
          cleanAddress;


        currentProperty =
          createProperty(
            cleanAddress
          );


        console.log(
          "Advance Group Property Intelligence:",
          currentProperty
        );


        const form =
          document.getElementById(
            "propertyForm"
          );


        if (form) {

          form.requestSubmit();

        }


        return {

          success: true,

          address:
            cleanAddress,

          message:
            `Property report started for ${cleanAddress}.`

        };

      }

  });


  console.log(
    "Advance Group WebMCP tool registered:",
    "get_property_report"
  );

}

// PHOTO PREVIEW
function setupPhotoPreview(inputId, previewId) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);

  if (!input || !preview) return;

  input.addEventListener("change", () => {
    preview.innerHTML = "";

    Array.from(input.files).forEach(file => {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      img.alt = "Property photo";
      preview.appendChild(img);
    });
  });
}

setupPhotoPreview("propertyPhotos", "photoPreview");
setupPhotoPreview("propertyPhotoLibrary", "photoPreview");