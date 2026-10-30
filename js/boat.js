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
  // per-boat hook so a single boat can be styled without touching the others
  if (boat && boat.id) document.body.setAttribute("data-boat", boat.id);

  // lock BOTH <html> (the real scroll element here) and <body> so the page
  // behind a pop-up can't scroll or scroll-chain. Counted, so nested pop-ups
  // (e.g. gallery grid → photo lightbox) only unlock once the last one closes.
  let scrollLocks = 0;
  function lockScroll(on) {
    scrollLocks = Math.max(0, scrollLocks + (on ? 1 : -1));
    const locked = scrollLocks > 0 ? "hidden" : "";
    document.documentElement.style.overflow = locked;
    document.body.style.overflow = locked;
  }

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
    // "Назад" arrow → back to this boat's card on the fleet page (not the top)
    const back = document.querySelector(".wf-hero__fleet");
    if (back) back.href = "fleet.html#card-" + boat.id;
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
      // optional per-boat crop position for the overview photo
      if (boat.photos.overviewPos) {
        const ov = document.querySelector(".wf-overview__img");
        if (ov) ov.style.backgroundPosition = boat.photos.overviewPos;
      }
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

        // "Галерея" button → open the whole set in a large pop-up.
        // No per-photo descriptors here: the set mixes interiors and exteriors,
        // so captions would only cover some photos — keep it clean (counter only).
        const gbtn = document.querySelector(".wf-gallery__btn");
        if (gbtn && !(boat && boat.hideGalleryBtn)) {
          initGalleryModal(gbtn, boat.photos.gallery);
        }
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
      '<div class="lb__stage">' +
        '<figure class="lb__figure">' +
          '<button class="lb__nav lb__prev" aria-label="Назад">‹</button>' +
          '<img class="lb__img" alt="">' +
          '<button class="lb__nav lb__next" aria-label="Вперёд">›</button>' +
          '<figcaption class="lb__caption"><span class="lb__count"></span><span class="lb__room"></span></figcaption>' +
        '</figure>' +
        '<button class="lb__close" aria-label="Закрыть">×</button>' +
      '</div>';
    document.body.appendChild(lb);

    const imgEl = lb.querySelector(".lb__img");
    const figEl = lb.querySelector(".lb__figure");
    const countEl = lb.querySelector(".lb__count");
    const roomEl = lb.querySelector(".lb__room");
    let idx = 0;

    // give the figure a portrait/landscape class so the frame stays a fixed
    // size per orientation (styled for the gallery lightbox, .lb--over)
    function applyOrient() {
      if (!imgEl.naturalWidth) return;
      figEl.classList.remove("is-portrait", "is-landscape");
      figEl.classList.add(imgEl.naturalHeight > imgEl.naturalWidth ? "is-portrait" : "is-landscape");
    }

    function show(i) {
      idx = (i + files.length) % files.length;
      figEl.classList.remove("is-portrait", "is-landscape");
      imgEl.onload = applyOrient;
      imgEl.src = "assets/img/" + files[idx];
      if (imgEl.complete) applyOrient();
      countEl.textContent = (idx + 1) + " из " + files.length;
      roomEl.textContent = captions[idx] || "";
    }
    function open(i) { show(i); lb.classList.add("is-open"); lockScroll(true); }
    function close() { lb.classList.remove("is-open"); lockScroll(false); }

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

  /* Gallery pop-up — the "Галерея" button opens a large rectangular modal with
     a scrollable grid of every photo; clicking a photo expands it in the shared
     lightbox (layered above the modal). */
  function initGalleryModal(btn, files, captions) {
    files = (files || []).filter(Boolean);
    if (!btn || !files.length) return;

    const modal = document.createElement("div");
    modal.className = "gmodal";
    modal.hidden = true;
    modal.innerHTML =
      '<div class="gmodal__overlay" data-gmodal-close></div>' +
      '<div class="gmodal__box" role="dialog" aria-modal="true" aria-label="Галерея">' +
        '<div class="gmodal__head">' +
          '<h2 class="gmodal__title">Галерея</h2>' +
          '<button class="gmodal__close" type="button" data-gmodal-close aria-label="Закрыть">&times;</button>' +
        '</div>' +
        '<div class="gmodal__grid"></div>' +
      '</div>';
    document.body.appendChild(modal);

    const grid = modal.querySelector(".gmodal__grid");
    const cells = files.map((f) => {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "gmodal__cell";
      cell.style.backgroundImage = "url('assets/img/" + f + "')";
      grid.appendChild(cell);
      return cell;
    });

    // reuse the lightbox for the expand view, layered above the modal
    initLightbox(cells, files, captions, "lb--over");

    function open() { modal.hidden = false; lockScroll(true); }
    function close() { modal.hidden = true; lockScroll(false); }
    btn.addEventListener("click", (e) => { e.preventDefault(); open(); });
    modal.addEventListener("click", (e) => { if (e.target.hasAttribute("data-gmodal-close")) close(); });
    document.addEventListener("keydown", (e) => {
      // Esc closes the lightbox first (if open), then the modal
      if (e.key === "Escape" && !modal.hidden && !document.querySelector(".lb.is-open")) close();
    });
  }

  /* Full-spec pop-up — the "Полная спецификация" button opens a modal with the
     complete, grouped spec sheet. Data is per-boat (content.fullSpecs), so the
     button only appears for boats that supply it. */
  function initSpecModal(btn, groups, title) {
    if (!btn || !Array.isArray(groups)) return;
    title = title || "Полная спецификация";
    const modal = document.createElement("div");
    modal.className = "smodal";
    modal.hidden = true;
    modal.innerHTML =
      '<div class="smodal__overlay" data-smodal-close></div>' +
      '<div class="smodal__box" role="dialog" aria-modal="true" aria-label="' + title + '">' +
        '<div class="smodal__head">' +
          '<h2 class="smodal__title">' + title + '</h2>' +
          '<button class="smodal__close" type="button" data-smodal-close aria-label="Закрыть">&times;</button>' +
        '</div>' +
        '<div class="smodal__body">' +
          groups.map((g) =>
            '<div class="smodal__group"><h3 class="smodal__grouptitle">' + g[0] + "</h3>" +
              '<ul class="smodal__list">' +
                g[1].map((r) => "<li><span>" + r[0] + "</span><span>" + r[1] + "</span></li>").join("") +
              "</ul></div>"
          ).join("") +
        "</div>" +
      "</div>";
    document.body.appendChild(modal);

    let openedAt = 0;
    function open() { modal.hidden = false; lockScroll(true); openedAt = Date.now(); }
    function close() { modal.hidden = true; lockScroll(false); }
    btn.addEventListener("click", (e) => { e.preventDefault(); open(); });
    modal.addEventListener("click", (e) => {
      if (e.target.hasAttribute("data-smodal-close") && Date.now() - openedAt > 300) close();
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) close(); });
  }

  /* Spotlight — an annotated photo in a frosted modal. Markers sit over the
     photo (positioned by %); hover/tap a marker to reveal a technical callout
     with that boat's photo, name and year (pulled from the BOATS record). */
  function initSpotlight(triggers, cfg) {
    const markers = (cfg.markers || []).map((m) => {
      const b = (typeof BOATS !== "undefined") ? BOATS.find((x) => x.id === m.id) : null;
      if (!b) return null;
      return { x: m.x, y: m.y, size: m.size, shape: m.shape, color: m.color,
               name: b.name, year: b.year || "", img: (m.img || b.cardImg || b.img) };
    }).filter(Boolean);

    function callout(m) {
      return '<span class="spot__callout">' +
          '<span class="spot__thumb" style="background-image:url(\'assets/img/' + m.img + '\')"></span>' +
          '<span class="spot__meta"><span class="spot__name">' + m.name + "</span>" +
          '<span class="spot__year">' + m.year + "</span></span>" +
        "</span>";
    }
    function markerHTML(m, i) {
      // shape marker: a boat-silhouette hotspot (clip-path polygon over the stage)
      if (Array.isArray(m.shape) && m.shape.length) {
        const poly = m.shape.map((p) => p[0] + "% " + p[1] + "%").join(", ");
        const ax = (m.x != null ? m.x : 50), ay = (m.y != null ? m.y : 50);
        return '<div class="spot__hot" data-i="' + i + '"' + (m.color ? ' style="--mk:' + m.color + '"' : "") + ">" +
            '<button class="spot__shape" style="clip-path:polygon(' + poly + ')" aria-label="' + m.name + '"></button>' +
            '<div class="spot__anchor" style="left:' + ax + "%;top:" + ay + '%">' + callout(m) + "</div>" +
          "</div>";
      }
      // dot marker
      const sz = m.size ? ";width:" + m.size + "px;height:" + m.size + "px" : "";
      return '<button class="spot__marker" data-i="' + i + '" style="left:' + m.x + "%;top:" + m.y + "%" + sz + '" aria-label="' + m.name + '">' +
          '<span class="spot__dot"' + (m.size ? ' style="width:' + m.size + "px;height:" + m.size + 'px"' : "") + "></span>" +
          callout(m) +
        "</button>";
    }

    const sp = document.createElement("div");
    sp.className = "spot";
    sp.innerHTML =
      '<div class="spot__plate">' +
        '<button class="spot__close" aria-label="Закрыть">×</button>' +
        ((cfg.date || cfg.title) ? '<header class="spot__head">' +
          (cfg.date ? '<span class="spot__date">' + cfg.date + "</span>" : "") +
          (cfg.title ? '<span class="spot__title">' + cfg.title + "</span>" : "") +
        "</header>" : "") +
        '<div class="spot__stage">' +
          '<img class="spot__img" src="assets/img/' + cfg.photo + '" alt="">' +
          markers.map(markerHTML).join("") +
        "</div>" +
        (cfg.hint ? '<p class="spot__hint">' + cfg.hint + "</p>" : "") +
      "</div>";
    document.body.appendChild(sp);

    function open() { sp.classList.add("is-open"); lockScroll(true); }
    function clearActive() { sp.querySelectorAll(".is-active").forEach((el) => el.classList.remove("is-active")); }
    function close() { sp.classList.remove("is-open"); lockScroll(false); clearActive(); }
    triggers.forEach((t) => t.addEventListener("click", open));
    sp.querySelector(".spot__close").addEventListener("click", close);
    sp.addEventListener("click", function (e) { if (e.target === sp) close(); });
    document.addEventListener("keydown", function (e) {
      if (sp.classList.contains("is-open") && e.key === "Escape") close();
    });
    // tap to toggle a callout (one open at a time) — dot markers and shape hotspots
    function wireToggle(trigger, host) {
      trigger.addEventListener("click", function (e) {
        e.stopPropagation();
        const was = host.classList.contains("is-active");
        clearActive();
        if (!was) host.classList.add("is-active");
      });
    }
    sp.querySelectorAll(".spot__marker").forEach((mk) => wireToggle(mk, mk));
    sp.querySelectorAll(".spot__hot").forEach((hot) => {
      const shape = hot.querySelector(".spot__shape");
      shape.addEventListener("mouseenter", () => hot.classList.add("is-hover"));
      shape.addEventListener("mouseleave", () => hot.classList.remove("is-hover"));
      wireToggle(shape, hot);
    });

    // dev helper: open with ?coords to trace polygons by clicking the photo.
    // Each click adds a point; the badge shows the running [x,y],… list to copy.
    // Press "n" to start a new shape, "z" to undo the last point.
    if (/[?&]coords/.test(location.search)) {
      const stage = sp.querySelector(".spot__stage");
      const badge = document.createElement("div");
      badge.className = "spot__coords";
      badge.textContent = "click to add points · n = new · z = undo";
      stage.appendChild(badge);
      let pts = [];
      function render() { badge.textContent = pts.length ? pts.map((p) => "[" + p[0] + "," + p[1] + "]").join(",") : "(empty) · n = new · z = undo"; }
      stage.addEventListener("click", function (e) {
        if (e.target.closest(".spot__coords")) return;
        const r = stage.getBoundingClientRect();
        pts.push([Math.round(((e.clientX - r.left) / r.width) * 1000) / 10,
                  Math.round(((e.clientY - r.top) / r.height) * 1000) / 10]);
        render(); console.log("shape:", "[" + pts.map((p) => "[" + p[0] + "," + p[1] + "]").join(",") + "]");
      });
      document.addEventListener("keydown", function (e) {
        if (!sp.classList.contains("is-open")) return;
        if (e.key === "n") { pts = []; render(); }
        else if (e.key === "z") { pts.pop(); render(); }
      });
    }
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

  /* ---- No interior photos: drop the hero thumbnail strip and the "На борту"
     gallery section, but keep Overview / Construction / Specsheet. */
  if (boat && boat.noInteriors) {
    [".wf-thumbs", ".wf-gallery-sec"].forEach((sel) => {
      const el = document.querySelector(sel);
      if (el) el.remove();
    });
  }

  /* ---- No numeric specs yet (only the build year): drop the hero
     "Характеристики" block but keep the Год постройки. */
  if (boat && boat.noSpecs) {
    const el = document.querySelector(".wf-specs");
    if (el) el.remove();
  }

  /* ---- Hide the "Галерея" button in the На борту header (e.g. a boat with no
     further photos beyond the ones already shown on the page). */
  if (boat && boat.hideGalleryBtn) {
    const btn = document.querySelector(".wf-gallery__btn");
    if (btn) btn.remove();
  }

  /* ---- Floor plans not ready yet: blank the plan column (keeps the spec
     section's two-column layout; the space is reserved for the real plans). */
  if (boat && boat.noPlans) {
    const wp = document.querySelector(".wf-plans");
    if (wp) wp.innerHTML = "";
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
    fillBodies(".wf-overview__text .wf-body", c.overviewBody, true);
    // booklet button — kept only for boats that actually have a booklet.
    // A string booklet is a PDF path → the button opens it in a pop-up viewer
    // (js/booklet-modal.js). A bare `true` keeps the button as a placeholder.
    const bookBtn = document.querySelector(".wf-overview .wf-btns .btn--secondary");
    if (bookBtn) {
      if (c.booklet) {
        if (typeof c.booklet === "string") {
          bookBtn.href = c.booklet;
          bookBtn.classList.add("js-booklet-open");
          bookBtn.setAttribute("data-booklet", c.booklet);
          bookBtn.setAttribute("data-booklet-title", (boat && boat.name ? boat.name : "") + " — буклет");
        }
      }
      else bookBtn.remove();
    }
    // STORY
    if (c.storyTitle) setText(".wf-story .wf-sectitle", c.storyTitle);
    setText(".wf-story .wf-lead", c.storyLead);
    fillBodies(".wf-story__text .wf-body", c.storyBody, true);
    // drop the story-section buttons for every boat (no standalone story pages)
    const sb = document.querySelector(".wf-story .wf-btns");
    if (sb) sb.remove();
    // Inline story pop-up: a highlighted phrase opens an annotated photo
    if (c.storyPop && c.storyPop.photo) {
      const triggers = document.querySelectorAll(c.storyPop.sel || ".story-pop");
      if (triggers.length) initSpotlight(triggers, c.storyPop);
    }
    // SPEC TABLE
    if (Array.isArray(c.specs)) {
      const st = document.querySelector(".wf-spectable");
      const row = (r) => "<li><span>" + r[0] + "</span><span>" + r[1] + "</span></li>";
      // optional per-boat split: move the last `specsRight` rows under the floor
      // plan (right column) so a short plan column balances the spec table
      const splitN = (typeof c.specsRight === "number" && c.specsRight > 0) ? c.specsRight : 0;
      const leftSpecs = splitN ? c.specs.slice(0, c.specs.length - splitN) : c.specs;
      const rightSpecs = splitN ? c.specs.slice(c.specs.length - splitN) : [];
      if (st) st.innerHTML = leftSpecs.map(row).join("");
      if (rightSpecs.length) {
        const rcol = document.querySelector(".wf-specsheet__right");
        if (rcol) {
          const ul = document.createElement("ul");
          ul.className = "wf-spectable wf-spectable--underplan";
          ul.innerHTML = rightSpecs.map(row).join("");
          rcol.appendChild(ul);
        }
      }
      // boats with no floor plans: let the spec table span full width in two columns
      const grid = document.querySelector(".wf-specsheet__grid");
      if (grid) grid.classList.toggle("wf-specsheet--wide", !!boat.specsWide);
      // "Полная спецификация" button + pop-up — only for boats that supply fullSpecs
      if (st && Array.isArray(c.fullSpecs)) {
        const sb = document.createElement("a");
        sb.className = "btn btn--secondary wf-specsheet__btn js-spec-open";
        sb.href = "#";
        sb.textContent = c.fullSpecsLabel || "Полная спецификация";
        st.parentNode.appendChild(sb);
        initSpecModal(sb, c.fullSpecs, c.fullSpecsLabel || "Полная спецификация");
      }
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
