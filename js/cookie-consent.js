/* Cookie consent banner — 152-ФЗ / РКН. Self-injects on first visit, remembers
   the choice in localStorage. On "accept" it fires a `cookie-consent-accepted`
   event — that's where Yandex.Metrika / Google Analytics should be initialised. */
(function () {
  var KEY = "kartel-cookie-consent";

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function save(v) {
    try { localStorage.setItem(KEY, v); } catch (e) { /* private mode — dismiss for session only */ }
  }

  // Already decided — nothing to show. If accepted, re-fire the hook for analytics.
  var prior = stored();
  if (prior) {
    if (prior === "accept") {
      document.dispatchEvent(new CustomEvent("cookie-consent-accepted"));
    }
    return;
  }

  var html =
    '<div class="cookie is-visible" role="dialog" aria-label="Cookies">' +
      '<div class="cookie__inner">' +
        '<p class="cookie__text">Мы используем cookies, чтобы сайт работал корректно и чтобы анализировать посещаемость. ' +
          'Нажимая «Принять всё», вы соглашаетесь с использованием аналитических cookies. ' +
          'Подробнее — в <a href="cookies.html">Политике cookies</a>.</p>' +
        '<div class="cookie__actions">' +
          '<button type="button" class="cookie__btn cookie__btn--decline" data-cookie-decline>Отклонить</button>' +
          '<button type="button" class="cookie__btn cookie__btn--accept" data-cookie-accept>Принять всё</button>' +
        '</div>' +
      '</div>' +
    '</div>';

  function build() {
    var wrap = document.createElement("div");
    wrap.innerHTML = html;
    var banner = wrap.firstChild;
    document.body.appendChild(banner);

    function close(v) {
      save(v);
      banner.parentNode && banner.parentNode.removeChild(banner);
      if (v === "accept") {
        document.dispatchEvent(new CustomEvent("cookie-consent-accepted"));
      }
    }
    banner.querySelector("[data-cookie-accept]").addEventListener("click", function () { close("accept"); });
    banner.querySelector("[data-cookie-decline]").addEventListener("click", function () { close("decline"); });
  }

  if (document.body) build();
  else document.addEventListener("DOMContentLoaded", build);
})();
