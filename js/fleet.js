/* Флот — renders the fleet from BOATS (js/boats-data.js), grouped by family,
   with status filters. Each card links to the boat detail page. */

/* Bump when a card image file is replaced in place (same filename) so browsers
   re-fetch it instead of serving the cached old picture. */
const IMG_V = 219;

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
    <${tag} class="boat-card${nolinkClass}"${href} data-status="${b.status}" aria-label="${b.name}">
      <img class="boat-card__img" src="assets/img/${b.cardImg || b.img}?v=${IMG_V}"${b.cardPos ? ` style="object-position:${b.cardPos}"` : ""} alt="${b.name}">
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

// sections are rendered here (not in the HTML), so a family hash from another page
// (e.g. fleet.html#fam-trex from the landing hero) needs a manual scroll after render.
if (location.hash) {
  const target = document.querySelector(location.hash);
  if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: "smooth", block: "start" }));
}
