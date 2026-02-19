// Theme Toggle
const toggle = document.getElementById("themeToggle");
const html = document.documentElement;
const icon = toggle.querySelector("i");

// Load saved theme
const saved = localStorage.getItem("theme");
if (saved) {
  html.setAttribute("data-bs-theme", saved);
  updateIcon(saved);
}

toggle.addEventListener("click", () => {
  const current = html.getAttribute("data-bs-theme");
  const next = current === "dark" ? "light" : "dark";
  html.setAttribute("data-bs-theme", next);
  localStorage.setItem("theme", next);
  updateIcon(next);
});

function updateIcon(theme) {
  icon.className = theme === "dark" ? "bi bi-moon-fill" : "bi bi-sun-fill";
}

// Active nav link on scroll
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY + 100;

  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute("id");

    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + id) {
          link.classList.add("active");
        }
      });
    }
  });
});

// Scroll fade-in animation
const fadeEls = document.querySelectorAll(".fade-in");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.1 }
);

fadeEls.forEach((el) => observer.observe(el));

// Close mobile nav on link click
const navCollapse = document.getElementById("navMenu");
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
    if (bsCollapse) bsCollapse.hide();
  });
});
