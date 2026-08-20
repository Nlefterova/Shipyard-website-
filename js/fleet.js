/* Флот — renders the fleet from BOATS (js/boats-data.js), grouped by family,
   with status filters. Each card links to the boat detail page. */

function boatCard(b) {
  const badge = `<span class="boat-card__badge boat-card__badge--${b.status}">${STATUS_LABEL[b.status]}</span>`;
  const tags = (b.tags || []).map((t) => `<span class="boat-card__tag">${t}</span>`).join("");
  const year = b.year ? `<div class="boat-card__year">${b.year}</div>` : "";
  return `
    <a class="boat-card" href="boat.html?id=${b.id}" data-status="${b.status}" aria-label="${b.name}">
      <img class="boat-card__img" src="assets/img/${b.img}" alt="${b.name}">
      <div class="boat-card__scrim"></div>
      <div class="boat-card__badges">${badge}${tags}</div>
      <div class="boat-card__meta">
        <div class="boat-card__name">${b.name}</div>
        ${year}
      </div>
    </a>`;
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

function applyFilter(filter) {
  document.querySelectorAll(".fleet-fam").forEach((fam) => {
    let visible = 0;
    fam.querySelectorAll(".boat-card").forEach((card) => {
      const show = filter === "all" || card.dataset.status === filter;
      card.style.display = show ? "" : "none";
      if (show) visible++;
    });
    fam.classList.toggle("is-empty", visible === 0);
  });
}

function initFilters() {
  const chips = Array.from(document.querySelectorAll("#fleetControls .fleet-chip"));
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
