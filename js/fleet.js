/* Флот — renders the fleet from BOATS (js/boats-data.js), grouped by family,
   with status filters. Each card links to the boat detail page. */

/* Bump when a card image file is replaced in place (same filename) so browsers
   re-fetch it instead of serving the cached old picture. */
const IMG_V = 219;

/* Card image style: cardScale zooms, cardPos sets the anchor — as transform-origin
   when zoomed (to pan the zoom), else as object-position. The zoom is passed as the
   --card-scale custom property (not a fixed inline transform) so the CSS hover zoom
   can compose on top of it instead of being overridden. */
function cardImgStyle(b) {
  if (b.cardScale) {
    return ` style="--card-scale:${b.cardScale};transform-origin:${b.cardPos || "center"}"`;
  }
  if (b.cardPos) return ` style="object-position:${b.cardPos}"`;
  return "";
}

function boatCard(b) {
  const badge = `<span class="boat-card__badge boat-card__badge--${b.status}">${STATUS_LABEL[b.status]}</span>`;
  const tags = (b.tags || []).map((t) => `<span class="boat-card__tag">${t}</span>`).join("");
  const year = b.year ? `<div class="boat-card__year">${b.year}</div>` : "";
  const progress = (b.status === "build" && b.progress)
    ? `<div class="boat-card__progress"><span style="width:${b.progress}%"></span></div>`
    : "";
  // some boats (e.g. planning placeholders) have no detail page yet — render
  // them as a plain, non-clickable card instead of a link.
  const tag = b.noLink ? "div" : "a";
  const href = b.noLink ? "" : ` href="boat.html?id=${b.id}"`;
  const nolinkClass = b.noLink ? " boat-card--nolink" : "";
  return `
    <${tag} id="card-${b.id}" class="boat-card${nolinkClass}"${href} data-status="${b.status}" aria-label="${b.name}">
      <img class="boat-card__img" src="assets/img/${b.cardImg || b.img}?v=${IMG_V}"${cardImgStyle(b)} alt="${b.name}">
      <div class="boat-card__scrim"></div>
      <div class="boat-card__badges">${badge}${tags}</div>
      <div class="boat-card__meta">
        <div class="boat-card__name">${b.name}</div>
        ${year}
        ${progress}
      </div>
    </${tag}>`;
}

function render() {
  const root = document.getElementById("fleetSections");
  if (!root) return;
  root.innerHTML = FAMILIES.map((f) => {
    const cards = BOATS.filter((b) => b.family === f.key).map(boatCard).join("");
    if (!cards) return "";
    return `
      <section class="fleet-fam" id="${f.id}" data-family="${f.key}">
        <h2 class="fleet-fam__title">${f.name}</h2>
        <div class="fleet-grid">${cards}</div>
      </section>`;
  }).join("");
}

function boatWord(n) {
  const d = n % 10, dd = n % 100;
  if (d === 1 && dd !== 11) return "судно";
  if (d >= 2 && d <= 4 && (dd < 12 || dd > 14)) return "судна";
  return "судов";
}

function applyFilter(filter) {
  let total = 0;
  document.querySelectorAll(".fleet-fam").forEach((fam) => {
    let visible = 0;
    fam.querySelectorAll(".boat-card").forEach((card) => {
      const s = card.dataset.status;
      // "inproject" groups the not-yet-available boats: planned + under construction
      const show = filter === "all" || s === filter ||
        (filter === "inproject" && (s === "planning" || s === "build"));
      card.style.display = show ? "" : "none";
      if (show) { visible++; total++; }
    });
    fam.classList.toggle("is-empty", visible === 0);
  });
  const c = document.getElementById("fleetCount");
  if (c) c.textContent = total + " " + boatWord(total);
}

function initFilters() {
  const chips = Array.from(document.querySelectorAll("#fleetControls .fleet-tab"));
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      applyFilter(chip.dataset.filter);
    });
  });
}

render();
initFilters();
applyFilter("all");

// Sections are rendered here (not in the HTML). A family hash from another page
// (e.g. fleet.html#fam-trex from the landing) scrolls to the section; but a reload
// cleans the hash and returns to the top, so it doesn't jump on refresh.
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
if (location.hash) {
  const target = document.querySelector(location.hash);
  // a boat card (fleet.html#card-<id>) centers in view; a family section lands at the top
  const block = location.hash.indexOf("#card-") === 0 ? "center" : "start";
  let fromOther = false;
  try { fromOther = !!document.referrer && new URL(document.referrer).pathname !== location.pathname; } catch (e) {}
  history.replaceState(null, "", location.pathname + location.search);
  if (fromOther && target) requestAnimationFrame(() => target.scrollIntoView({ behavior: "instant", block: block }));
  else window.scrollTo({ top: 0, behavior: "instant" });
}

// Browser Back/Forward returning to the fleet: restore the exact scroll position
// the visitor left from, so a boat deep in the list (e.g. the Гулянки) doesn't
// dump them back at the top. The on-page "Назад" uses #card-… above instead.
// scrollRestoration is "manual", so restore on pageshow — it fires on both a full
// reload AND a back/forward-cache restore (where this script does not re-run).
window.addEventListener("pagehide", function () {
  try { sessionStorage.setItem("fleetY", String(window.scrollY || window.pageYOffset || 0)); } catch (e) {}
});
window.addEventListener("pageshow", function (ev) {
  var e = performance.getEntriesByType && performance.getEntriesByType("navigation")[0];
  var nav = e ? e.type : (performance.navigation && performance.navigation.type === 2 ? "back_forward" : "navigate");
  if (location.hash) return;                             // arriving at a specific card/section
  if (!ev.persisted && nav !== "back_forward") return;   // a fresh visit starts at the top
  var y = null;
  try { y = sessionStorage.getItem("fleetY"); } catch (e2) {}
  if (y !== null) requestAnimationFrame(function () { window.scrollTo(0, parseInt(y, 10) || 0); });
});

/* Back to top — same button as the gallery page */
(function () {
  var topBtn = document.getElementById("galTop");
  if (!topBtn) return;
  function onScroll() {
    var past = (window.pageYOffset || document.documentElement.scrollTop) > window.innerHeight * 0.6;
    topBtn.classList.toggle("is-visible", past);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
  topBtn.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
})();
