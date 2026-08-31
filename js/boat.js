/* Boat detail page — template behaviour.

   The static markup in boat.html is the FILLED version for T-Rex 44 CR — the
   one card whose real content we've placed. For every OTHER boat (and any
   non-boat card), this swaps that content for wireframe placeholders:
     • name    → placeholder name
     • copy    → lorem ipsum
     • specs   → measurements removed (dashed out)

   The large hero photo (left) is set for EVERY boat from its fleet profile
   photo (boat.img in js/boats-data.js), so it always matches the fleet card. */
(function () {
  const id = new URLSearchParams(location.search).get("id");
  const boat = (typeof BOATS !== "undefined") ? BOATS.find((b) => b.id === id) : null;

  // fill a boxed photo slot from a filename
  function setPhoto(sel, file) {
    const el = document.querySelector(sel);
    if (el && file) {
      el.style.backgroundImage = "url('assets/img/" + file + "')";
      el.style.backgroundSize = "cover";
      el.style.backgroundPosition = "center";
    }
  }

  // Large hero photo (left) = the boat's fleet profile photo — applies to every boat.
  if (boat) {
    setPhoto(".wf-hero__img", boat.img);
    // extra per-boat photos (secondary hero image, thumbnail squares, etc.)
    if (boat.photos) {
      setPhoto(".wf-hero__img2", boat.photos.hero2);
      setPhoto(".wf-overview__img", boat.photos.overview);
      setPhoto(".wf-story__img", boat.photos.construction);
      if (Array.isArray(boat.photos.thumbs)) {
        const boxes = document.querySelectorAll(".wf-thumbs .wf-box");
        boat.photos.thumbs.forEach((f, i) => {
          const el = boxes[i];
          if (el && f) {
            el.style.backgroundImage = "url('assets/img/" + f + "')";
            el.style.backgroundSize = "cover";
            el.style.backgroundPosition = "center";
            el.classList.add("is-photo");
          }
        });
        initLightbox(document.querySelectorAll(".wf-thumbs .wf-box"), boat.photos.thumbs, boat.photos.captions);
      }
      // "На борту" gallery grid — fill boxes in order; unfilled ones stay empty
      if (Array.isArray(boat.photos.gallery)) {
        const gboxes = document.querySelectorAll(".wf-gallery .wf-box");
        boat.photos.gallery.forEach((f, i) => {
          const el = gboxes[i];
          if (el && f) {
            el.style.backgroundImage = "url('assets/img/" + f + "')";
            el.style.backgroundSize = "cover";
            el.style.backgroundPosition = "center";
            el.classList.add("is-photo");
          }
        });
      }
      // floor plans — line-art, shown fully (contain) on the cream box
      if (Array.isArray(boat.photos.plans)) {
        const pboxes = document.querySelectorAll(".wf-plans__img");
        boat.photos.plans.forEach((f, i) => {
          const el = pboxes[i];
          if (el && f) {
            el.style.backgroundImage = "url('assets/img/" + f + "')";
            el.style.backgroundSize = "contain";
            el.style.backgroundRepeat = "no-repeat";
            el.style.backgroundPosition = "center";
          }
        });
      }
    }
  }

  /* Lightbox — click a photo square to enlarge, arrows/keys to scroll through. */
  function initLightbox(boxes, files, captions, lbClass) {
    files = (files || []).filter(Boolean);
    captions = captions || [];
    if (!files.length) return;
    boxes = boxes || document.querySelectorAll(".wf-thumbs .wf-box");

    const lb = document.createElement("div");
    lb.className = "lb" + (lbClass ? " " + lbClass : "");
    lb.innerHTML =
      '<button class="lb__close" aria-label="Закрыть">×</button>' +
      '<button class="lb__nav lb__prev" aria-label="Назад">‹</button>' +
      '<figure class="lb__figure">' +
        '<img class="lb__img" alt="">' +
        '<figcaption class="lb__caption"><span class="lb__count"></span><span class="lb__room"></span></figcaption>' +
      '</figure>' +
      '<button class="lb__nav lb__next" aria-label="Вперёд">›</button>';
    document.body.appendChild(lb);

    const imgEl = lb.querySelector(".lb__img");
    const countEl = lb.querySelector(".lb__count");
    const roomEl = lb.querySelector(".lb__room");
    let idx = 0;

    function show(i) {
      idx = (i + files.length) % files.length;
      imgEl.src = "assets/img/" + files[idx];
      countEl.textContent = (idx + 1) + " из " + files.length;
      roomEl.textContent = captions[idx] || "";
    }
    function open(i) { show(i); lb.classList.add("is-open"); document.body.style.overflow = "hidden"; }
    function close() { lb.classList.remove("is-open"); document.body.style.overflow = ""; }

    boxes.forEach((b, i) => {
      if (files[i]) b.addEventListener("click", () => open(i));
    });
    lb.querySelector(".lb__close").addEventListener("click", close);
    lb.querySelector(".lb__prev").addEventListener("click", function (e) { e.stopPropagation(); show(idx - 1); });
    lb.querySelector(".lb__next").addEventListener("click", function (e) { e.stopPropagation(); show(idx + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(idx - 1);
      else if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  if (id === "trex-44cr") return; // the one filled card — leave the rest exactly as-is

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
  document.querySelectorAll(".wf-lead").forEach((el) => (el.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit."));
  document.querySelectorAll(".wf-year__num").forEach((el) => (el.textContent = "—"));

  // BODY COPY — Overview + Construction (vary so the two paragraphs differ)
  const LOREMS = [
    LOREM,
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis.",
  ];
  document.querySelectorAll(".wf-body").forEach((el, i) => (el.textContent = LOREMS[i % LOREMS.length]));

  // HERO SPEC LIST — keep the labels, remove the measurements
  document.querySelectorAll(".spec-list li").forEach((li) => {
    const label = li.textContent.split("—")[0].trim();
    li.textContent = label + " — —";
  });

  // FULL SPEC TABLE — dash out every value
  document.querySelectorAll(".wf-spectable li > span:last-child").forEach((v) => (v.textContent = "—"));
})();
