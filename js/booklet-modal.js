/* Shared booklet pop-up — injects one modal and opens a PDF viewer from any
   .js-booklet-open trigger. The trigger carries:
     data-booklet        — the PDF url
     data-booklet-title  — heading shown in the modal header (optional) */
(function () {
  var triggers = document.querySelectorAll(".js-booklet-open");
  if (!triggers.length) return;

  var MODAL_HTML =
    '<div class="bmodal" id="bookletModal" hidden>' +
      '<div class="bmodal__overlay" data-bmodal-close></div>' +
      '<div class="bmodal__box" role="dialog" aria-modal="true" aria-label="Буклет">' +
        '<div class="bmodal__head">' +
          '<h2 class="bmodal__title"></h2>' +
          '<div class="bmodal__actions">' +
            '<a class="bmodal__dl" href="#" download target="_blank" rel="noopener">' +
              '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3v12m0 0 4-4m-4 4-4-4M4 19h16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
              '<span>Скачать</span></a>' +
            '<button class="bmodal__close" type="button" data-bmodal-close aria-label="Закрыть">&times;</button>' +
          '</div>' +
        '</div>' +
        '<iframe class="bmodal__frame" title="Буклет" src="about:blank"></iframe>' +
      '</div>' +
    '</div>';

  var wrap = document.createElement("div");
  wrap.innerHTML = MODAL_HTML;
  var modal = wrap.firstElementChild;
  document.body.appendChild(modal);

  var frame = modal.querySelector(".bmodal__frame");
  var titleEl = modal.querySelector(".bmodal__title");
  var dlEl = modal.querySelector(".bmodal__dl");

  var openedAt = 0;
  function open(url, title) {
    titleEl.textContent = title || "Буклет";
    dlEl.href = url;
    frame.src = url + "#view=FitH";
    modal.hidden = false;
    document.documentElement.style.overflow = "hidden"; document.body.style.overflow = "hidden";
    openedAt = Date.now();
  }
  function close() {
    modal.hidden = true;
    document.documentElement.style.overflow = ""; document.body.style.overflow = "";
    frame.src = "about:blank"; // stop the PDF rendering in the background
  }

  triggers.forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      open(el.getAttribute("data-booklet"), el.getAttribute("data-booklet-title"));
    });
  });
  modal.addEventListener("click", function (e) {
    // ignore the tail of the opening gesture bleeding onto the overlay
    if (e.target.hasAttribute("data-bmodal-close") && Date.now() - openedAt > 300) close();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hidden) close();
  });
})();
