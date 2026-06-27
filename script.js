const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const form = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");
const contactTypeSelect = form?.querySelector('[name="contactType"]');
const organisationFields = form?.querySelector("[data-organisation-fields]");
const organisationNameInput = form?.querySelector('[name="organisationName"]');
const registrationNumberInput = form?.querySelector('[name="registrationNumber"]');
const donateOpen = document.querySelector("[data-donate-open]");
const donateClose = document.querySelector("[data-donate-close]");
const donationModal = document.querySelector("[data-donation-modal]");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      nav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

function updateOrganisationFields() {
  if (!contactTypeSelect || !organisationFields || !organisationNameInput || !registrationNumberInput) {
    return;
  }

  const isOrganisation = contactTypeSelect.value === "Organisation";
  organisationFields.hidden = !isOrganisation;
  organisationNameInput.required = isOrganisation;
  registrationNumberInput.required = isOrganisation;

  if (!isOrganisation) {
    organisationNameInput.value = "";
    registrationNumberInput.value = "";
  }
}

contactTypeSelect?.addEventListener("change", updateOrganisationFields);
updateOrganisationFields();

function openDonationModal() {
  if (!donationModal) {
    return;
  }

  donationModal.hidden = false;
  donateClose?.focus();
}

function closeDonationModal() {
  if (!donationModal) {
    return;
  }

  donationModal.hidden = true;
  donateOpen?.focus();
}

donateOpen?.addEventListener("click", openDonationModal);
donateClose?.addEventListener("click", closeDonationModal);
donationModal?.addEventListener("click", (event) => {
  if (event.target === donationModal) {
    closeDonationModal();
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && donationModal && !donationModal.hidden) {
    closeDonationModal();
  }
});

if (form && formStatus) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) {
      return;
    }

    const formData = new FormData(form);
    const name = formData.get("name");
    const email = formData.get("email");
    const contactType = formData.get("contactType");
    const organisationName = formData.get("organisationName");
    const registrationNumber = formData.get("registrationNumber");
    const message = formData.get("message");
    const organisationLines =
      contactType === "Organisation"
        ? [`Organisation name: ${organisationName}`, `Registration number: ${registrationNumber}`]
        : [];
    const subject = encodeURIComponent(`Website enquiry from ${name}`);
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Email: ${email}`,
        `Contacting as: ${contactType}`,
        ...organisationLines,
        "",
        "Message:",
        message,
      ].join("\n")
    );

    window.location.href = `mailto:intouch@tsirecare.org.za?subject=${subject}&body=${body}`;
    form.reset();
    formStatus.textContent = "Thank you. Your email draft has been prepared for intouch@tsirecare.org.za.";
  });
}
