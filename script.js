const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const form = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");

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

if (form && formStatus) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form.reset();
    formStatus.textContent = "Thank you. Your message has been prepared for the Tsireledzo Care team.";
  });
}
