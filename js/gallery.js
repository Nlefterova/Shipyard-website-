/* Галерея — click a tile to open it full-size in a lightbox.
   Supports prev/next (buttons + arrow keys), Esc / click-outside to close. */
(function () {
  const grid = document.querySelector('.gallery__grid');
  const box = document.getElementById('lightbox');
  const img = document.getElementById('lbImg');
  const caption = document.getElementById('lbCaption');
  const btnClose = document.getElementById('lbClose');
  const btnPrev = document.getElementById('lbPrev');
  const btnNext = document.getElementById('lbNext');
  if (!grid || !box || !img) return;

  // collect the picture tiles (skip the seal logo tile)
  const cells = Array.from(grid.querySelectorAll('.gallery__cell'));
  const urls = cells.map((c) => {
    const bg = getComputedStyle(c).backgroundImage;
    const m = bg.match(/url\((['"]?)(.*?)\1\)/);
    return m ? m[2] : '';
  });
  const names = cells.map((c) => c.dataset.name || '');

  let i = 0;

  function show(n) {
    i = (n + cells.length) % cells.length;
    img.src = urls[i];
    img.alt = names[i];
    if (caption) caption.textContent = names[i];
  }
  function open(n) {
    show(n);
    box.classList.add('is-open');
    box.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    box.classList.remove('is-open');
    box.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    img.src = '';
  }

  cells.forEach((c, n) => {
    c.setAttribute('role', 'button');
    c.setAttribute('tabindex', '0');
    c.addEventListener('click', () => open(n));
    c.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(n); }
    });
  });

  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', () => show(i - 1));
  btnNext.addEventListener('click', () => show(i + 1));
  // click the dark backdrop (not the image or a button) to close
  box.addEventListener('click', (e) => { if (e.target === box) close(); });

  document.addEventListener('keydown', (e) => {
    if (!box.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(i - 1);
    else if (e.key === 'ArrowRight') show(i + 1);
  });
})();
