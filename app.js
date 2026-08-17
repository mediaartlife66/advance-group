const photos = document.getElementById("photos");
const chooseBtn = document.getElementById("chooseBtn");
const preview = document.getElementById("preview");

const assessmentForm = document.getElementById("assessmentForm");

const report = document.getElementById("report");
const reportAddress = document.getElementById("reportAddress");
const reportScope = document.getElementById("reportScope");

const dataAddress = document.getElementById("dataAddress");
const customerNotes = document.getElementById("customerNotes");
const customerScope = document.getElementById("customerScope");
const photoCount = document.getElementById("photoCount");

const quoteForm = document.getElementById("quoteForm");
const success = document.getElementById("success");


/*
--------------------------------------------------
PHOTO UPLOAD
--------------------------------------------------
*/

chooseBtn.addEventListener("click", () => {
  photos.click();
});


photos.addEventListener("change", () => {

  preview.innerHTML = "";

  const files = [...photos.files];

  files.forEach((file) => {

    if (!file.type.startsWith("image/")) {
      return;
    }

    const image = document.createElement("img");

    image.alt = "Property photo preview";

    image.src = URL.createObjectURL(file);

    preview.appendChild(image);

  });

});


/*
--------------------------------------------------
BUILD PROPERTY REPORT
--------------------------------------------------
*/

assessmentForm.addEventListener("submit", (event) => {

  event.preventDefault();

  const address =
    document.getElementById("address").value.trim();

  const scope =
    document.getElementById("scope").value;

  const notes =
    document.getElementById("notes").value.trim();

  const numberOfPhotos =
    photos.files.length;


  /*
  Customer information
  */

  reportAddress.textContent =
    address || "Property address";


  dataAddress.textContent =
    address || "Awaiting property lookup";


  reportScope.textContent =
    scope;


  customerScope.textContent =
    scope;


  photoCount.textContent =
    numberOfPhotos;


  customerNotes.textContent =
    notes ||
    "No additional project notes were provided.";


  /*
  Display report
  */

  report.classList.remove("hidden");


  /*
  Move user to report
  */

  report.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

});


/*
--------------------------------------------------
PROFESSIONAL QUOTATION REQUEST
--------------------------------------------------
*/

quoteForm.addEventListener("submit", (event) => {

  event.preventDefault();

  success.classList.remove("hidden");

  success.textContent =
    "Thanks. Your quotation request has been recorded for the next step.";

  success.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

});


/*
--------------------------------------------------
FUTURE APA DATA LAYER
--------------------------------------------------

This is deliberately kept separate from the UI.

Future flow:

ADDRESS
   ↓
ADDRESS VALIDATION
   ↓
LINZ / NZ PUBLIC DATA
   ↓
AUCKLAND COUNCIL DATA
   ↓
PROPERTY PROFILE
   ↓
APA ANALYSIS
   ↓
PROPERTY REPORT

Never expose private API keys in this browser file.

The future API layer should live server-side.
--------------------------------------------------
*/
