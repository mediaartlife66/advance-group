const cameraInput = document.getElementById("cameraInput");
const photoInput = document.getElementById("photoInput");
const photoPreview = document.getElementById("photoPreview");
const analyseButton = document.getElementById("analyseButton");
const analysisStatus = document.getElementById("analysisStatus");

let photos = [];

function addPhotos(files) {

  [...files].forEach(file => {

    if (!file.type.startsWith("image/")) return;

    photos.push(file);

    if (photoPreview) {

      const img = document.createElement("img");

      img.src = URL.createObjectURL(file);

      img.alt = "Site photo";

      photoPreview.appendChild(img);
    }

  });

}


/* CAMERA */

cameraInput?.addEventListener("change", event => {

  addPhotos(event.target.files);

});


/* ADD PHOTOS */

photoInput?.addEventListener("change", event => {

  addPhotos(event.target.files);

});


/* TRADE */

document
  .querySelectorAll(".trade-button")
  .forEach(button => {

    button.addEventListener("click", () => {

      document
        .querySelectorAll(".trade-button")
        .forEach(b =>
          b.classList.remove("active")
        );

      button.classList.add("active");

    });

  });


/* SITE OBSERVATIONS */

document
  .querySelectorAll(".suggestion-btn")
  .forEach(button => {

    button.addEventListener("click", () => {

      const input =
        document.getElementById("customObservation");

      if (!input) return;

      const text =
        button.textContent.trim();

      if (!input.value.trim()) {

        input.value = text;

      } else {

        input.value += ", " + text;

      }

    });

  });


/* ANALYSE PROPERTY */

analyseButton?.addEventListener("click", () => {

  const address =
    document
      .getElementById("propertyAddress")
      ?.value
      .trim();


  if (!address) {

    alert(
      "Please enter the property address first."
    );

    document
      .getElementById("propertyAddress")
      ?.focus();

    return;
  }


  /* PROCESSING */

  if (analysisStatus) {

    analysisStatus.classList.remove("hidden");

    analysisStatus.textContent =
      "ANALYSING PROPERTY...";

  }


  analyseButton.disabled = true;

  analyseButton.innerHTML =
    '<span class="analyse-icon">✦</span> ANALYSING PROPERTY...';


  /* SIMULATE ANALYSIS */

  setTimeout(() => {

    if (analysisStatus) {

      analysisStatus.textContent =
        "PROPERTY ANALYSIS READY";

    }


    analyseButton.innerHTML =
      '<span class="analyse-icon">✓</span> ANALYSIS COMPLETE';


    analyseButton.disabled = false;


    /* CREATE REPORT */

    showPropertyReport(address);

  }, 1800);

});


/* PROPERTY REPORT */

function showPropertyReport(address) {

  let report =
    document.getElementById("propertyReport");


  /*
    If the report does not exist,
    create it automatically.
  */

  if (!report) {

    report =
      document.createElement("section");

    report.id =
      "propertyReport";

    report.className =
      "property-report";

    const assessment =
      document.getElementById("assessment");

    const container =
      assessment?.querySelector(".container");

    if (container) {

      container.appendChild(report);

    } else {

      document
        .querySelector("main")
        ?.appendChild(report);

    }

  }


  const activeTrade =
    document.querySelector(
      ".trade-button.active"
    );


  const trade =
    activeTrade
      ? activeTrade.textContent.trim()
      : "Painting";


  report.innerHTML = `

    <div class="report-header">

      <div>

        <p class="eyebrow">
          PROPERTY INTELLIGENCE
        </p>

        <h2>
          Property analysis
        </h2>

        <p>
          Initial field assessment
          from today's site information.
        </p>

      </div>

      <div class="report-badge">
        ANALYSIS READY
      </div>

    </div>


    <div class="report-summary">

      <div>

        <span>PROPERTY</span>

        <strong>
          ${escapeHTML(address)}
        </strong>

      </div>


      <div>

        <span>TRADE</span>

        <strong>
          ${escapeHTML(trade)}
        </strong>

      </div>


      <div>

        <span>PHOTOS</span>

        <strong>
          ${photos.length}
        </strong>

      </div>

    </div>


    <div class="report-grid">


      <div class="report-card">

        <p class="card-kicker">
          SITE CONDITION
        </p>

        <h3>
          Initial observations
        </h3>

        <p>
          Review the captured site information
          before final pricing and scheduling.
        </p>

      </div>


      <div class="report-card">

        <p class="card-kicker">
          PHOTO ASSESSMENT
        </p>

        <h3>
          ${photos.length} photo${photos.length === 1 ? "" : "s"} captured
        </h3>

        <p>
          Photos are ready for detailed
          assessment and job documentation.
        </p>

      </div>


      <div class="report-card large">

        <p class="card-kicker">
          NEXT STEP
        </p>

        <h3>
          Prepare the job
        </h3>

        <p>
          Confirm preparation, access, materials,
          labour and customer requirements
          before preparing the quotation.
        </p>

      </div>


    </div>

  `;


  report.classList.remove("hidden");


  report.scrollIntoView({

    behavior: "smooth",

    block: "start"

  });

}


/* SAFELY DISPLAY USER TEXT */

function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;

}