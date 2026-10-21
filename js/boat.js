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
    // optional per-boat crop position for the main hero photo
    if (boat.heroPos) {
      const h = document.querySelector(".wf-hero__img");
      if (h) h.style.backgroundPosition = boat.heroPos;
    }
    // extra per-boat photos (secondary hero image, thumbnail squares, etc.)
    if (boat.photos) {
      setPhoto(".wf-hero__img2", boat.photos.hero2);
      // optional per-boat crop position for the second hero photo
      if (boat.photos.hero2Pos) {
        const el2 = document.querySelector(".wf-hero__img2");
        if (el2) el2.style.backgroundPosition = boat.photos.hero2Pos;
      }
      setPhoto(".wf-overview__img", boat.photos.overview);
      setPhoto(".wf-story__img", boat.photos.construction);
      if (Array.isArray(boat.photos.thumbs)) {
        const strip = document.querySelector(".wf-thumbs");
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
        // OPT-IN ONLY (boat.fitMedia): drop empty slots + tighten the grid.
        // By default the empty placeholders stay — Natalia often sends photos
        // incrementally, so never collapse on our own. (feedback_photo_placeholders_ask)
        if (boat.fitMedia) {
          boxes.forEach((el) => { if (!el.classList.contains("is-photo")) el.remove(); });
          const n = document.querySelectorAll(".wf-thumbs .wf-box").length;
          if (strip && n && n < 6) strip.style.gridTemplateColumns = "repeat(" + n + ",1fr)";
        }
        initLightbox(document.querySelectorAll(".wf-thumbs .wf-box"), boat.photos.thumbs, boat.photos.captions);
      }
      // "На борту" gallery grid — fill boxes in order, then drop any unfilled slots
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
        if (boat.fitMedia) gboxes.forEach((el) => { if (!el.classList.contains("is-photo")) el.remove(); });
      }
      // (floor plans are rendered in fillContent, so the box count follows the data)
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

  /* ---- Hero-only boats (e.g. under construction) — show just the hero and
     drop everything after it, plus the empty hero sub-boxes. */
  if (boat && boat.heroOnly) {
    [".wf-overview", ".wf-story", ".wf-gallery-sec", ".wf-specsheet",
     ".wf-hero__img2", ".wf-specs", ".wf-thumbs"].forEach((sel) => {
      const el = document.querySelector(sel);
      if (el) el.remove();
    });
  }

  /* ---- Drop the sections below the hero (Overview / Construction / Gallery /
     Specsheet) but keep the ENTIRE hero intact and the footer. */
  if (boat && boat.dropSections) {
    [".wf-overview", ".wf-story", ".wf-gallery-sec", ".wf-specsheet"].forEach((sel) => {
      const el = document.querySelector(sel);
      if (el) el.remove();
    });
  }

  /* ---- Editorial content ------------------------------------------------
     Wireframe is the base layer (so a partially-filled boat never leaks the
     static T-Rex 44 CR defaults). A `content` block in js/boats-data.js then
     overrides whichever fields it provides; anything it omits stays wireframe. */
  fillWireframe();
  if (boat && boat.content) fillContent(boat);

  // tiny DOM helpers
  function setText(sel, txt) { const el = document.querySelector(sel); if (el && txt != null) el.textContent = txt; }
  function setAll(sel, txt) { document.querySelectorAll(sel).forEach((el) => { if (txt != null) el.textContent = txt; }); }
  function fillBodies(sel, arr, asHtml) {
    if (!Array.isArray(arr)) return;
    const els = Array.from(document.querySelectorAll(sel));
    if (!els.length) return;
    // fill one paragraph per array item; clone extra slots when the copy has
    // more paragraphs than the static markup (e.g. Мара's 3-paragraph story)
    let last = els[els.length - 1];
    arr.forEach((txt, i) => {
      let el = els[i];
      if (!el) { el = last.cloneNode(false); last.after(el); last = el; els.push(el); }
      if (asHtml) el.innerHTML = txt; else el.textContent = txt;
      el.hidden = false;
    });
    // empty + hide any surplus static slots (copy shorter than the markup)
    for (let i = arr.length; i < els.length; i++) { els[i].textContent = ""; els[i].hidden = true; }
  }

  function fillContent(boat) {
    const c = boat.content;
    document.title = boat.name + " — Корабельная артель";
    // HERO
    setText(".wf-hero__info .wf-field .wf-label", c.eyebrow);
    setAll(".wf-name", boat.name);
    setText(".wf-desc", c.desc);
    setAll(".wf-year__num", boat.year || "—");
    if (Array.isArray(c.heroSpecs)) {
      const ul = document.querySelector(".spec-list");
      if (ul) ul.innerHTML = c.heroSpecs.map((r) => "<li>" + r[0] + " — " + r[1] + "</li>").join("");
    }
    // OVERVIEW
    setText(".wf-overview .wf-lead", c.overviewLead);
    fillBodies(".wf-overview__text .wf-body", c.overviewBody);
    // booklet button — kept only for boats that actually have a booklet
    const bookBtn = document.querySelector(".wf-overview .wf-btns .btn--secondary");
    if (bookBtn) {
      if (c.booklet) { if (typeof c.booklet === "string") bookBtn.href = c.booklet; }
      else bookBtn.remove();
    }
    // STORY
    if (c.storyTitle) setText(".wf-story .wf-sectitle", c.storyTitle);
    setText(".wf-story .wf-lead", c.storyLead);
    fillBodies(".wf-story__text .wf-body", c.storyBody, true);
    // SPEC TABLE
    if (Array.isArray(c.specs)) {
      const st = document.querySelector(".wf-spectable");
      if (st) st.innerHTML = c.specs.map((r) => "<li><span>" + r[0] + "</span><span>" + r[1] + "</span></li>").join("");
      // boats with no floor plans: let the spec table span full width in two columns
      const grid = document.querySelector(".wf-specsheet__grid");
      if (grid) grid.classList.toggle("wf-specsheet--wide", !!boat.specsWide);
    }
    // FLOOR PLANS — build one box per deck (2 for CR, 3 for Fly, …); drop in
    // the line-art drawing where one exists (boat.photos.plans[i]).
    if (Array.isArray(c.decks)) {
      const wrap = document.querySelector(".wf-plans");
      if (wrap) {
        wrap.classList.add("wf-plans--" + c.decks.length);
        wrap.innerHTML = c.decks.map((d) =>
          '<div class="wf-box wf-plans__img"><ul class="wf-plan__label">' +
            '<li class="wf-plan__deck">' + d.name + "</li>" +
            d.items.map((it) => "<li>" + it + "</li>").join("") +
          "</ul></div>"
        ).join("");
        const plans = (boat.photos && boat.photos.plans) || [];
        wrap.querySelectorAll(".wf-plans__img").forEach((el, i) => {
          if (plans[i]) {
            el.style.backgroundImage = "url('assets/img/" + plans[i] + "')";
            el.style.backgroundSize = "contain";
            el.style.backgroundRepeat = "no-repeat";
            el.style.backgroundPosition = "center";
          }
        });
      }
    }
  }

  function fillWireframe() {
    const LOREM =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod " +
      "tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim " +
      "veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea.";
    document.title = "Судно — Корабельная артель";
    document.querySelectorAll(".wf-name").forEach((el) => (el.textContent = "Название судна"));
    const series = document.querySelector(".wf-hero__info .wf-field .wf-label");
    if (series) series.textContent = "Тип судна";
    document.querySelectorAll(".wf-desc").forEach((el) => (el.textContent = "Lorem ipsum dolor sit amet consectetur."));
    document.querySelectorAll(".wf-lead").forEach((el) => (el.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit."));
    document.querySelectorAll(".wf-year__num").forEach((el) => (el.textContent = "—"));
    const LOREMS = [
      LOREM,
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.",
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis.",
    ];
    document.querySelectorAll(".wf-body").forEach((el, i) => (el.textContent = LOREMS[i % LOREMS.length]));
    document.querySelectorAll(".spec-list li").forEach((li) => {
      const label = li.textContent.split("—")[0].trim();
      li.textContent = label + " — —";
    });
    document.querySelectorAll(".wf-spectable li > span:last-child").forEach((v) => (v.textContent = "—"));
  }
})();
