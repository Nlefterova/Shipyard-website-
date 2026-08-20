/* Наш подход — tabbed capability explainer.
   Clicking a tab swaps the description panel and the photo. */
(function () {
  const tabs = Array.from(document.querySelectorAll('#approachTabs .approach__tab'));
  const panels = Array.from(document.querySelectorAll('#approachPanels .approach__panel'));
  const img = document.getElementById('approachImg');
  if (!tabs.length) return;

  function show(key, src) {
    tabs.forEach(t => t.classList.toggle('is-active', t.dataset.panel === key));
    panels.forEach(p => p.classList.toggle('is-active', p.dataset.panel === key));
    if (img && src) img.src = src;
  }

  tabs.forEach(t => t.addEventListener('click', () => show(t.dataset.panel, t.dataset.img)));
})();

/* FAQ accordion — one open at a time. */
(function () {
  const items = Array.from(document.querySelectorAll('#faqList .faq__item'));
  if (!items.length) return;

  items.forEach(item => {
    const q = item.querySelector('.faq__q');
    q.addEventListener('click', () => {
      const open = item.classList.contains('is-open');
      items.forEach(i => i.classList.remove('is-open'));
      if (!open) item.classList.add('is-open');
    });
  });
})();
