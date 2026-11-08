/* Shared contact popup — injects the modal and opens it from any .js-contact-open trigger. */
(function () {
  var MODAL_HTML =
    '<div class="cmodal" id="contactModal" hidden>' +
      '<div class="cmodal__overlay" data-cmodal-close></div>' +
      '<div class="cmodal__box" role="dialog" aria-modal="true" aria-label="Связаться">' +
        '<button class="cmodal__close" type="button" data-cmodal-close aria-label="Закрыть">&times;</button>' +
        '<div class="cmodal__body">' +
          '<p class="cmodal__eyebrow">Корабельная Артель</p>' +
          '<h2 class="cmodal__title">Напишите нам</h2>' +
          '<p class="cmodal__sub">Позвоните или напишите — расскажем о верфи, судах и запишем на экскурсию.</p>' +
          '<ul class="cmodal__list">' +
            '<li><a href="tel:+79272231097">' +
              '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 4h3l2 4-2 2c1.5 3.5 3 5 6.5 6.5l2-2 4 2v3c0 1.5-1 2.5-2.5 2.5C10 22 2 14 2 6 2 4.5 3 4 4 4Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>' +
              '<span>+7 927 223-10-97</span></a></li>' +
            '<li><a href="mailto:info@k-artel.pro">' +
              '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="1" stroke="currentColor" stroke-width="1.6"/><path d="M2 6l10 7 10-7" stroke="currentColor" stroke-width="1.6"/></svg>' +
              '<span>info@k-artel.pro</span></a></li>' +
          '</ul>' +
          '<div class="cmodal__social">' +
            '<a class="cmodal__soc" href="https://t.me/KARTELBOATS_RU" target="_blank" rel="noopener" aria-label="Telegram">' +
              '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21.5 4 2 9.5 9 12l3 7 3-5 4.5 3L21.5 4Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>' +
            '</a>' +
          '</div>' +
          '<a class="btn btn--primary cmodal__cta" href="contact.html">Все адреса и контакты</a>' +
        '</div>' +
      '</div>' +
    '</div>';

  function init() {
    if (document.getElementById("contactModal")) return;
    var wrap = document.createElement("div");
    wrap.innerHTML = MODAL_HTML;
    var modal = wrap.firstElementChild;
    document.body.appendChild(modal);

    function open(e) { if (e) e.preventDefault(); modal.hidden = false; document.body.style.overflow = "hidden"; }
    function close() { modal.hidden = true; document.body.style.overflow = ""; }

    document.querySelectorAll(".js-contact-open").forEach(function (el) {
      el.addEventListener("click", open);
    });
    modal.addEventListener("click", function (e) {
      if (e.target.hasAttribute("data-cmodal-close")) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.hidden) close();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
