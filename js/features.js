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

/* Locations — click a location to show its map in the square. */
(function () {
  const box = document.getElementById('locBox');
  const map = document.getElementById('locMap');
  const mapBtn = document.getElementById('locMapBtn');
  const mapNote = document.querySelector('.loc__map-excursion');
  const phone = document.getElementById('locPhone');
  const email = document.getElementById('locEmail');
  const hours = document.getElementById('locHours');
  if (!box || !map) return;
  const items = Array.from(box.querySelectorAll('.loc__item'));
  items.forEach(it => it.addEventListener('click', () => {
    items.forEach(i => i.classList.remove('is-active'));
    it.classList.add('is-active');
    const d = it.dataset;
    if (d.map) map.style.backgroundImage = "url('" + d.map + "')";
    if (mapBtn && d.yandex) mapBtn.href = d.yandex;
    if (mapNote && d.note != null) mapNote.textContent = d.note;
    if (phone && d.tel) { phone.href = 'tel:' + d.tel; phone.querySelector('span').textContent = d.phone; }
    if (email && d.email) { email.href = 'mailto:' + d.email; email.querySelector('span').textContent = d.email; }
    if (hours && d.hours) hours.textContent = d.hours;
  }));
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
