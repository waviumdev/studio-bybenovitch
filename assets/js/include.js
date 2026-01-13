(function () {
  const isGithubPages = window.location.hostname.endsWith("github.io");

  // Compute prefix to reach site root (handles github.io/<repo>/... vs custom domain)
  function computePrefix() {
    let segments = window.location.pathname.split("/").filter(Boolean);

    // On github pages, first segment is usually the repo name
    if (isGithubPages && segments.length > 0) segments = segments.slice(1);

    const endsWithSlash = window.location.pathname.endsWith("/");
    const dirDepth = endsWithSlash ? segments.length : Math.max(0, segments.length - 1);
    return "../".repeat(dirDepth);
  }

  const BASE = computePrefix();

  async function inject(selector, partialFile) {
    const el = document.querySelector(selector);
    if (!el) return;

    const url = BASE + "partials/" + partialFile;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      el.innerHTML = `<!-- Missing partial: ${partialFile} (${res.status}) -->`;
      return;
    }
    let html = await res.text();
    html = html.replaceAll("{{BASE}}", BASE);
    el.innerHTML = html;

    // Highlight active pill in brand bar
    const active = el.querySelector('[data-active="studio"]');
    if (active) active.classList.add("active");
  }

  // Inject partials
  inject("#bb-brandbar", "brandbar.html");
  inject("#bb-studioheader", "studioheader.html");
  inject("#bb-footer", "footer.html");
// Local nav active state
(function () {
  const path = window.location.pathname.toLowerCase();
  const links = document.querySelectorAll(".navlink");
  links.forEach((a) => a.classList.remove("active"));

  const isServices = path.includes("/services");
  const isContact = path.includes("/contact");

  links.forEach((a) => {
    const key = a.getAttribute("data-nav");
    if (key === "services" && isServices) a.classList.add("active");
    if (key === "contact" && isContact) a.classList.add("active");
  });
})();

  // Year
  window.addEventListener("DOMContentLoaded", () => {
    const y = document.querySelectorAll("[data-year]");
    y.forEach((n) => (n.textContent = new Date().getFullYear()));
  });
})();
