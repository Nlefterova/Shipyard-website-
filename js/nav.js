/* Sticky nav — fades a frosted navy background in once the page is scrolled.
   Only runs where the nav carries the .nav--sticky modifier. */
(function () {
  var nav = document.querySelector(".nav--sticky");
  if (!nav) return;
  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    nav.classList.toggle("is-scrolled", y > 20);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
