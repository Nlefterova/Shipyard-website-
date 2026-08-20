/* Hero carousel — cycles slides + segment trackers.
   Slide count = number of .hero__slide; trackers auto-match. */
(function () {
  const slides = Array.from(document.querySelectorAll('#heroSlides .hero__slide'));
  const tracks = Array.from(document.querySelectorAll('#heroTrackers .hero__track'));
  if (slides.length < 2) return;

  let i = 0;
  let timer;
  const DURATION = 6000;

  function go(n) {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('is-active', k === i));
    tracks.forEach((t, k) => t.classList.toggle('is-active', k === i));
  }
  function next() { go(i + 1); }
  function start() { stop(); timer = setInterval(next, DURATION); }
  function stop() { if (timer) clearInterval(timer); }

  tracks.forEach((t, k) => t.addEventListener('click', () => { go(k); start(); }));

  const hero = document.querySelector('.hero');
  hero.addEventListener('mouseenter', stop);
  hero.addEventListener('mouseleave', start);

  start();
})();
