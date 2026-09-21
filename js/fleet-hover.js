/* Landing fleet cards — on hover, swipe left through the family's boat photos.
   Each card's <div class="fleet-card__media" data-family data-cover> is filled with
   a slide per photo: the cover first, then every boat in that family (its main photo).
   A cloned cover at the end makes the loop seamless (snap back invisibly). */
(function () {
  if (typeof BOATS === 'undefined') return;
  var STEP = 1100; // ms between photos while hovered
  var EXCLUDE = { specialist: 1, egoist: 1 }; // no good photos yet — keep out of the gallery
  var ORDER = { trex: ['trex-44cr', 'trex-44fly', 'trex-40', 'trex-37'] }; // gallery order per family

  document.querySelectorAll('.fleet-card__media[data-family]').forEach(function (media) {
    var fam = media.dataset.family;
    var track = media.querySelector('.fleet-card__track');
    if (!track) return;

    // one photo per family boat, in the configured order, de-duplicated (no separate
    // cover — it duplicated a boat; the first boat is the resting frame)
    var famBoats = BOATS.filter(function (b) { return b.family === fam && !EXCLUDE[b.id]; });
    var ord = ORDER[fam];
    if (ord) famBoats.sort(function (a, b) {
      var ia = ord.indexOf(a.id); if (ia < 0) ia = 999;
      var ib = ord.indexOf(b.id); if (ib < 0) ib = 999;
      return ia - ib;
    });
    var photos = famBoats.map(function (b) { return 'assets/img/' + (b.img || b.cardImg); })
      .filter(function (p, i, a) { return p && p.indexOf('boat-ph') < 0 && a.indexOf(p) === i; });

    var base = photos.length;
    var seq = base > 1 ? photos.concat([photos[0]]) : photos; // clone cover for seamless loop
    track.innerHTML = seq.map(function (p) {
      return '<div class="fleet-card__slide" style="background-image:url(\'' + p + '\')"></div>';
    }).join('');
    if (base < 2) return; // only the cover — nothing to cycle

    var i = 0, timer = null;
    function to(n, animate) {
      track.style.transition = animate ? '' : 'none';
      track.style.transform = 'translateX(-' + (n * 100) + '%)';
      if (!animate) { void track.offsetWidth; track.style.transition = ''; } // flush, restore
    }
    function next() { i++; to(i, true); }

    track.addEventListener('transitionend', function () {
      if (i === base) { i = 0; to(0, false); } // reached the cloned cover → snap back
    });
    media.addEventListener('mouseenter', function () {
      if (timer) return;
      next();
      timer = setInterval(next, STEP);
    });
    media.addEventListener('mouseleave', function () {
      clearInterval(timer); timer = null; i = 0; to(0, false);
    });
  });
})();
