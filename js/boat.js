/* Boat detail page — template behaviour.

   The static markup in boat.html is the FILLED version for T-Rex 44 CR — the
   one card whose real content we've placed. For every OTHER boat (and any
   non-boat card), this swaps that content for wireframe placeholders:
     • name    → placeholder name
     • copy    → lorem ipsum
     • specs   → measurements removed (dashed out)
   To fill another boat later, add a branch here (or its own markup) with the
   real name / description / specs, the way T-Rex 44 CR is done. */
(function () {
  const id = new URLSearchParams(location.search).get("id");
  if (id === "trex-44cr") return; // the one filled card — leave exactly as-is

  const LOREM =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod " +
    "tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim " +
    "veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea.";

  document.title = "Судно — Корабельная артель";

  // HERO — name, type, short description, year
  document.querySelectorAll(".wf-name").forEach((el) => (el.textContent = "Название судна"));
  const series = document.querySelector(".wf-hero__info .wf-field .wf-label");
  if (series) series.textContent = "Тип судна";
  document.querySelectorAll(".wf-desc").forEach((el) => (el.textContent = "Lorem ipsum dolor sit amet consectetur."));
  document.querySelectorAll(".wf-year__num").forEach((el) => (el.textContent = "—"));

  // BODY COPY — Overview + Construction
  document.querySelectorAll(".wf-body").forEach((el) => (el.textContent = LOREM));

  // HERO SPEC LIST — keep the labels, remove the measurements
  document.querySelectorAll(".spec-list li").forEach((li) => {
    const label = li.textContent.split("—")[0].trim();
    li.textContent = label + " — —";
  });

  // FULL SPEC TABLE — dash out every value
  document.querySelectorAll(".wf-spectable li > span:last-child").forEach((v) => (v.textContent = "—"));
})();
