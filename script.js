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
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) {
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const recaptchaResponse =
      typeof grecaptcha !== "undefined" ? grecaptcha.getResponse() : "";

    if (!recaptchaResponse) {
      formStatus.textContent = "Please complete the reCAPTCHA check before sending.";
      return;
    }

    const formData = new FormData(form);

    formStatus.textContent = "Sending your message...";
    submitButton?.setAttribute("disabled", "true");

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "The form could not be sent.");
      }

      form.reset();
      updateOrganisationFields();
      if (typeof grecaptcha !== "undefined") {
        grecaptcha.reset();
      }
      formStatus.textContent = "Thank you. Your message has been sent to Tsireledzo Care.";
    } catch (error) {
      if (typeof grecaptcha !== "undefined") {
        grecaptcha.reset();
      }
      formStatus.textContent = error.message || "Your message could not be sent right now.";
    } finally {
      submitButton?.removeAttribute("disabled");
    }
  });
}
