const propertyForm = document.getElementById("propertyForm");
const success = document.getElementById("success");

if (propertyForm) {
  propertyForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const address =
      document.getElementById("propertyAddress").value.trim();

    const name =
      document.getElementById("quoteName").value.trim();

    const phone =
      document.getElementById("quotePhone").value.trim();

    if (!address || !name || !phone) {
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
      address,
      name,
      phone
    });
  });
}