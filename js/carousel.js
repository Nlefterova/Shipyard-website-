/* Hero carousel — cycles slides, swipe-down text, and a JS-driven progress bar.
   Slide count = number of .hero__slide; trackers/headings/descs/eyebrows auto-match.
   Everything is driven from one requestAnimationFrame loop so clicking around the
   trackers can't desync the fill (the old CSS-animation approach restarted badly). */
(function () {
  // Reload should return to the hero, not wherever the viewer last scrolled to.
  // (browser default 'auto' restores the previous scroll position on reload.)
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  // A leftover hash (e.g. #fleet from an earlier click) makes the browser jump to
  // that section on load. Genuine arrivals from another page (footer/nav deep-link)
  // still scroll to the section once; a reload / same-page load drops the hash and
  // returns to the hero.
  (function () {
    if (!location.hash) { window.scrollTo({ top: 0, behavior: 'instant' }); return; }
    let fromOtherPage = false;
    try { fromOtherPage = !!document.referrer && new URL(document.referrer).pathname !== location.pathname; } catch (e) {}
    const target = document.querySelector(location.hash);
    if (fromOtherPage && target) requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
    else window.scrollTo({ top: 0, behavior: 'instant' });
    history.replaceState(null, '', location.pathname + location.search);
  })();

  const slides = Array.from(document.querySelectorAll('#heroSlides .hero__slide'));
  const tracks = Array.from(document.querySelectorAll('#heroTrackers .hero__track'));
  const heads  = Array.from(document.querySelectorAll('#heroHeadings .hero__title'));
  const descs  = Array.from(document.querySelectorAll('#heroDescs .hero__desc'));
  const brows  = Array.from(document.querySelectorAll('#heroTrackers .hero__eyebrow'));
  const fills  = tracks.map((t) => t.querySelector('.hero__track__fill'));
  const btnP = document.querySelector('.hero__actions .btn--primary');
  const btnS = document.querySelector('.hero__actions .btn--secondary');
  if (slides.length < 2) return;

  /* per-slide CTAs — only slide 1 differs: fleet page (top) + scroll to "Наш подход".
     Slides 2–4 keep the generic pair. */
  const BTNS = [
    { p: ['Смотреть Флот', 'fleet.html'],                 s: ['Наш подход', '#approach'] },
    { p: ['Смотреть Флот', 'fleet.html#fam-trex'],        s: ['О верфи', 'about.html'] },
    { p: ['Смотреть Флот', 'fleet.html#fam-expedition'],  s: ['О верфи', 'about.html'] },
    { p: ['Смотреть Флот', 'fleet.html#fam-korabli'],     s: ['О верфи', 'about.html'] },
  ];
  function setButtons(n) {
    const b = BTNS[n]; if (!b) return;
    if (btnP) { btnP.textContent = b.p[0]; btnP.setAttribute('href', b.p[1]); }
    if (btnS) { btnS.textContent = b.s[0]; btnS.setAttribute('href', b.s[1]); }
  }

  const DURATION = 9000;   // ms per slide
  const SHIFT = 18;        // px the text travels on the swipe
  let i = 0, prev = -1, elapsed = 0, last = 0;

  /* --- swipe-down: incoming drops in from above, outgoing drops out below --- */
  function enter(el) {
    if (!el) return;
    el.style.transition = 'none';
    el.style.opacity = '0';
    el.style.transform = 'translateY(-' + SHIFT + 'px)';
    void el.offsetWidth;                       // reflow so the start state sticks
    el.classList.add('is-active');
    el.style.transition = 'opacity .5s ease .3s, transform .5s ease .3s';
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  }
  function leave(el) {
    if (!el) return;
    el.classList.remove('is-active');
    el.style.transition = 'opacity .4s ease, transform .4s ease';
    el.style.opacity = '0';
    el.style.transform = 'translateY(' + SHIFT + 'px)';
  }
  function rest(el) {                            // off-screen, no animation
    if (!el) return;
    el.classList.remove('is-active');
    el.style.transition = 'none';
    el.style.opacity = '0';
    el.style.transform = 'translateY(-' + SHIFT + 'px)';
  }
  function swap(list) {
    list.forEach((el, k) => (k === i ? enter(el) : k === prev ? leave(el) : rest(el)));
  }

  function go(n) {
    prev = i;
    i = (n + slides.length) % slides.length;
    elapsed = 0;
    slides.forEach((s, k) => s.classList.toggle('is-active', k === i));
    tracks.forEach((t, k) => t.classList.toggle('is-active', k === i));
    fills.forEach((f, k) => { if (f && k !== i) f.style.transform = 'scaleX(0)'; });
    swap(heads); swap(descs); swap(brows);
    setButtons(i);
  }

  function tick(ts) {
    if (!last) last = ts;
    const dt = ts - last; last = ts;
    elapsed += dt;
    const f = fills[i];
    if (f) f.style.transform = 'scaleX(' + Math.min(elapsed / DURATION, 1) + ')';
    if (elapsed >= DURATION) go(i + 1);
    requestAnimationFrame(tick);
  }

  // show first slide with no animation
  [heads, descs, brows].forEach((list) => list.forEach((el, k) => {
    if (!el) return;
    if (k === 0) { el.classList.add('is-active'); el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }
    else rest(el);
  }));

  tracks.forEach((t, k) => t.addEventListener('click', () => {
    if (k !== i) go(k);
    else { elapsed = 0; if (fills[i]) fills[i].style.transform = 'scaleX(0)'; }
    last = 0;
  }));

  setButtons(0);

  // in-page hero buttons (#approach, #fleet) scroll smoothly WITHOUT adding a hash
  // to the URL — so a reload always returns to the hero, not the anchored section.
  const actions = document.querySelector('.hero__actions');
  if (actions) actions.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });

  requestAnimationFrame(tick);
})();
