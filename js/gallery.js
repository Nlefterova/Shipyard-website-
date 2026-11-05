/* Gallery page — theme toggle (Интерьеры / Экстерьеры) + tetris mosaic + lightbox.
   Photo lists are a rough auto-sort by filename; curate by editing these arrays. */
(function () {
  var IMG_V = 222;

  /* filename prefix -> boat name + year (prefixes differ from data ids) */
  var META = {
    exp65lux: { name: "Expedition 65 Lux", year: 2026 },
    gulyanka2003: { name: "Гулянка №1", year: 2000 },
    gulyanka2: { name: "Гулянка №2", year: 2003 },
    gulyanka3: { name: "Гулянка №3", year: 2004 },
    gulyanka5: { name: "Гулянка №5", year: 2017 },
    kasatka: { name: "Касатка", year: 2013 },
    l1050: { name: "L-1050", year: 2015 },
    mara: { name: "Мара", year: 1998 },
    mius: { name: "Миус", year: 2018 },
    natali: { name: "Natali SRT", year: 2014 },
    rusich: { name: "Русич", year: 2011 },
    sapfir: { name: "Сапфир", year: 2005 },
    sibirsky: { name: "Сибирский исследователь", year: 2022 },
    trex37: { name: "T-Rex 37", year: 2016 },
    trex40: { name: "T-Rex 40", year: 2020 },
    trex44cr: { name: "T-Rex 44 CR", year: 2023 },
    trex44fly: { name: "T-Rex 44 Fly", year: 2025 },
    volnyi: { name: "Вольный", year: 2010 },
    yeti: { name: "Yeti", year: 2009 },
    fiesta: { name: "Fiesta", year: 2012 },
    frank: { name: "Frenk", year: 2006 },
    laita: { name: "Лайта", year: 2002 },
    pilgrim: { name: "Пилигрим", year: 2007 },
    yul: { name: "Юл", year: 2008 },
    aleksandriya: { name: "Александрия", year: 2019 },
    dundukovsky: { name: "Дундуковский", year: 1999 },
    proekt1: { name: "Проект №1", year: 1995 },
    bandido: { name: "Bandido", year: 2001 }
  };

  // Resolve a filename to its boat by matching the known prefixes (longest first),
  // so any suffix (-2, -i1, -e5, -overview, -story, -drone, -dock-dusk, …) still
  // groups the photo with its boat and year. More robust than stripping suffixes.
  var PREFIXES = Object.keys(META).sort(function (a, b) { return b.length - a.length; });
  function prefixOf(f) {
    var base = f.replace(/\.(jpg|png)$/i, "");
    for (var i = 0; i < PREFIXES.length; i++) {
      var p = PREFIXES[i];
      if (base === p || base.indexOf(p + "-") === 0) return p;
    }
    return base;
  }
  function meta(f) { return META[prefixOf(f)] || null; }

  /* room tag per interior photo (classified by viewing each image) */
  var ROOM_ORDER = ["salon", "kitchen", "bedroom", "captain", "sauna", "outdoor", "bathroom"];
  var ROOMS = {
    "exp65lux-i1.jpg": "bedroom", "exp65lux-i2.jpg": "salon", "exp65lux-i3.jpg": "salon", "exp65lux-i4.jpg": "kitchen", "exp65lux-i5.jpg": "sauna", "exp65lux-i6.jpg": "bedroom",
    "exp65lux-e7.jpg": "captain", "exp65lux-e8.jpg": "salon", "exp65lux-e9.jpg": "salon", "exp65lux-e10.jpg": "kitchen", "exp65lux-e11.jpg": "kitchen", "exp65lux-e12.jpg": "kitchen", "exp65lux-e13.jpg": "bathroom", "exp65lux-e14.jpg": "bathroom", "exp65lux-e15.jpg": "bathroom", "exp65lux-e16.jpg": "kitchen", "exp65lux-e17.jpg": "kitchen", "exp65lux-e18.jpg": "bedroom", "exp65lux-e19.jpg": "bedroom", "exp65lux-e20.jpg": "sauna", "exp65lux-e21.jpg": "sauna",
    "gulyanka2003-i1.jpg": "outdoor", "gulyanka2003-i2.jpg": "salon", "gulyanka2003-i3.jpg": "kitchen", "gulyanka2003-i4.jpg": "salon", "gulyanka2003-i5.jpg": "bedroom", "gulyanka2003-i6.jpg": "bathroom",
    "kasatka-i1.jpg": "outdoor", "kasatka-i2.jpg": "captain", "kasatka-i3.jpg": "bedroom", "kasatka-i4.jpg": "kitchen", "kasatka-i5.jpg": "salon", "kasatka-i6.jpg": "sauna",
    "l1050-i1.jpg": "salon", "l1050-i2.jpg": "captain", "l1050-i3.jpg": "kitchen", "l1050-i4.jpg": "bedroom", "l1050-i6.jpg": "bathroom",
    "mara-i1.jpg": "salon", "mara-i2.jpg": "bedroom", "mara-i3.jpg": "bedroom", "mara-i4.jpg": "kitchen", "mara-i5.jpg": "bathroom", "mara-i6.jpg": "bathroom",
    "mius-i1.jpg": "captain", "mius-i2.jpg": "salon", "mius-i3.jpg": "salon", "mius-i4.jpg": "kitchen", "mius-i5.jpg": "bedroom", "mius-i6.jpg": "bathroom",
    "natali-i1.jpg": "salon", "natali-i2.jpg": "salon", "natali-i3.jpg": "kitchen", "natali-i4.jpg": "captain", "natali-i5.jpg": "bedroom", "natali-i6.jpg": "bedroom",
    "natali-i7.jpg": "salon", "natali-i8.jpg": "kitchen", "natali-i9.jpg": "bedroom", "natali-i10.jpg": "bedroom", "natali-i12.jpg": "bathroom",
    "rusich-i1.jpg": "salon", "rusich-i2.jpg": "captain", "rusich-i3.jpg": "kitchen", "rusich-i4.jpg": "bedroom", "rusich-i5.jpg": "kitchen", "rusich-i6.jpg": "bathroom",
    "rusich-i7.jpg": "bathroom", "rusich-i8.jpg": "bedroom", "rusich-i9.jpg": "bedroom",
    "sapfir-i1.jpg": "captain", "sapfir-i2.jpg": "salon", "sapfir-i3.jpg": "kitchen", "sapfir-i4.jpg": "outdoor", "sapfir-i5.jpg": "bedroom", "sapfir-i6.jpg": "bedroom",
    "sibirsky-i1.jpg": "captain", "sibirsky-i2.jpg": "salon", "sibirsky-i3.jpg": "kitchen", "sibirsky-i4.jpg": "bedroom", "sibirsky-i5.jpg": "bedroom", "sibirsky-i6.jpg": "bathroom",
    "sibirsky-e2.jpg": "captain", "sibirsky-e3.jpg": "salon", "sibirsky-e4.jpg": "salon",
    "trex37-i1.jpg": "captain", "trex37-i2.jpg": "salon", "trex37-i3.jpg": "salon", "trex37-i4.jpg": "bedroom", "trex37-i5.jpg": "kitchen",
    "trex40-i1.jpg": "captain", "trex40-i2.jpg": "salon", "trex40-i3.jpg": "salon", "trex40-i4.jpg": "bedroom", "trex40-i5.jpg": "kitchen",
    "trex44cr-i1.jpg": "salon", "trex44cr-i2.jpg": "salon", "trex44cr-i3.jpg": "salon", "trex44cr-i4.jpg": "bedroom", "trex44cr-i5.jpg": "bathroom", "trex44cr-i6.jpg": "bathroom",
    "trex44cr-sink.jpg": "bathroom", "trex44cr-frontcabin.jpg": "bedroom", "trex44cr-smallroom.jpg": "bedroom", "trex44cr-master2.jpg": "bedroom", "trex44cr-cuddy.jpg": "salon",
    "trex44fly-i1.jpg": "salon", "trex44fly-i2.jpg": "salon", "trex44fly-i3.jpg": "kitchen", "trex44fly-i4.jpg": "bedroom", "trex44fly-i5.jpg": "bedroom", "trex44fly-i6.jpg": "bathroom",
    "volnyi-i1.jpg": "salon", "volnyi-i2.jpg": "captain", "volnyi-i3.jpg": "salon", "volnyi-i4.jpg": "bedroom", "volnyi-i5.jpg": "bedroom", "volnyi-i6.jpg": "salon",
    "yeti-i1.jpg": "salon", "yeti-i2.jpg": "captain", "yeti-i3.jpg": "salon", "yeti-i4.jpg": "bedroom", "yeti-i5.jpg": "bedroom", "yeti-i6.jpg": "bedroom",
    "aleksandriya-i1.jpg": "salon", "aleksandriya-i2.jpg": "salon", "aleksandriya-i3.jpg": "kitchen", "aleksandriya-i4.jpg": "bedroom", "aleksandriya-i5.jpg": "bedroom", "aleksandriya-i6.jpg": "bathroom",
    "aleksandriya-e1.jpg": "salon", "aleksandriya-e2.jpg": "salon", "aleksandriya-e3.jpg": "salon", "aleksandriya-e4.jpg": "salon", "aleksandriya-e5.jpg": "salon",
    "laita-i1.jpg": "salon", "laita-i2.jpg": "captain", "laita-i3.jpg": "bedroom", "laita-i4.jpg": "bedroom",
    "frank-i1.jpg": "salon", "frank-i2.jpg": "kitchen", "frank-i3.jpg": "bedroom", "frank-i4.jpg": "bedroom", "frank-i5.jpg": "bathroom", "frank-i6.jpg": "captain"
  };

  var GALLERY = {
    interior: [
      "exp65lux-i1.jpg", "exp65lux-i2.jpg", "exp65lux-i3.jpg", "exp65lux-i4.jpg", "exp65lux-i5.jpg", "exp65lux-i6.jpg",
      "exp65lux-e7.jpg", "exp65lux-e8.jpg", "exp65lux-e9.jpg", "exp65lux-e10.jpg", "exp65lux-e11.jpg", "exp65lux-e12.jpg", "exp65lux-e13.jpg", "exp65lux-e14.jpg", "exp65lux-e15.jpg", "exp65lux-e16.jpg", "exp65lux-e17.jpg", "exp65lux-e18.jpg", "exp65lux-e19.jpg", "exp65lux-e20.jpg", "exp65lux-e21.jpg",
      "gulyanka2003-i1.jpg", "gulyanka2003-i2.jpg", "gulyanka2003-i3.jpg", "gulyanka2003-i4.jpg", "gulyanka2003-i5.jpg", "gulyanka2003-i6.jpg",
      "kasatka-i1.jpg", "kasatka-i2.jpg", "kasatka-i3.jpg", "kasatka-i4.jpg", "kasatka-i5.jpg", "kasatka-i6.jpg",
      "l1050-i1.jpg", "l1050-i2.jpg", "l1050-i3.jpg", "l1050-i4.jpg", "l1050-i6.jpg",
      "mara-i1.jpg", "mara-i2.jpg", "mara-i3.jpg", "mara-i4.jpg", "mara-i5.jpg", "mara-i6.jpg",
      "mius-i1.jpg", "mius-i2.jpg", "mius-i3.jpg", "mius-i4.jpg", "mius-i5.jpg", "mius-i6.jpg",
      "natali-i1.jpg", "natali-i2.jpg", "natali-i3.jpg", "natali-i4.jpg", "natali-i5.jpg", "natali-i6.jpg",
      "natali-i7.jpg", "natali-i8.jpg", "natali-i9.jpg", "natali-i10.jpg", "natali-i11.jpg", "natali-i12.jpg",
      "rusich-i1.jpg", "rusich-i2.jpg", "rusich-i3.jpg", "rusich-i4.jpg", "rusich-i5.jpg", "rusich-i6.jpg",
      "rusich-i7.jpg", "rusich-i8.jpg", "rusich-i9.jpg",
      "sapfir-i1.jpg", "sapfir-i2.jpg", "sapfir-i3.jpg", "sapfir-i4.jpg", "sapfir-i5.jpg", "sapfir-i6.jpg",
      "sibirsky-i1.jpg", "sibirsky-i2.jpg", "sibirsky-i3.jpg", "sibirsky-i4.jpg", "sibirsky-i5.jpg", "sibirsky-i6.jpg",
      "sibirsky-e2.jpg", "sibirsky-e3.jpg", "sibirsky-e4.jpg",
      "trex37-i1.jpg", "trex37-i2.jpg", "trex37-i3.jpg", "trex37-i4.jpg", "trex37-i5.jpg",
      "trex40-i1.jpg", "trex40-i2.jpg", "trex40-i3.jpg", "trex40-i4.jpg", "trex40-i5.jpg",
      "trex44cr-i1.jpg", "trex44cr-i2.jpg", "trex44cr-i3.jpg", "trex44cr-i4.jpg", "trex44cr-i5.jpg", "trex44cr-i6.jpg",
      "trex44cr-sink.jpg", "trex44cr-frontcabin.jpg", "trex44cr-smallroom.jpg", "trex44cr-master2.jpg", "trex44cr-cuddy.jpg",
      "trex44fly-i1.jpg", "trex44fly-i2.jpg", "trex44fly-i3.jpg", "trex44fly-i4.jpg", "trex44fly-i5.jpg", "trex44fly-i6.jpg",
      "volnyi-i1.jpg", "volnyi-i2.jpg", "volnyi-i3.jpg", "volnyi-i4.jpg", "volnyi-i5.jpg", "volnyi-i6.jpg",
      "yeti-i1.jpg", "yeti-i2.jpg", "yeti-i3.jpg", "yeti-i4.jpg", "yeti-i5.jpg", "yeti-i6.jpg",
      "aleksandriya-i1.jpg", "aleksandriya-i2.jpg", "aleksandriya-i3.jpg", "aleksandriya-i4.jpg", "aleksandriya-i5.jpg", "aleksandriya-i6.jpg",
      "aleksandriya-e1.jpg", "aleksandriya-e2.jpg", "aleksandriya-e3.jpg", "aleksandriya-e4.jpg", "aleksandriya-e5.jpg",
      "laita-i1.jpg", "laita-i2.jpg", "laita-i3.jpg", "laita-i4.jpg",
      "frank-i1.jpg", "frank-i2.jpg", "frank-i3.jpg", "frank-i4.jpg", "frank-i5.jpg", "frank-i6.jpg"
    ],
    exterior: [
      "trex44fly-2.jpg", "trex44fly-3.jpg", "trex44fly-overview.jpg", "trex44fly-story.jpg",
      "trex44cr.jpg", "trex44cr-2.jpg", "trex44cr-beach.jpg", "trex44cr-dock.jpg",
      "trex44cr-alpine.jpg", "trex44cr-drone.jpg", "trex44cr-yamaha.jpg", "trex44cr-dock-dusk.jpg",
      "trex40.jpg", "trex40-2.jpg", "trex40-3.jpg", "trex40-4.jpg", "trex40-overview.jpg", "trex40-story.jpg", "trex40-story2.jpg", "trex40-i6.jpg",
      "trex37.jpg", "trex37-2.jpg", "trex37-overview.jpg", "trex37-story.jpg", "trex37-i6.jpg",
      "exp65lux.jpg", "exp65lux-2.jpg", "exp65lux-overview.jpg", "exp65lux-story.jpg",
      "exp65lux-e1.jpg", "exp65lux-e2.jpg", "exp65lux-e3.jpg", "exp65lux-e4.jpg", "exp65lux-e5.jpg", "exp65lux-e6.jpg",
      "sibirsky.jpg", "sibirsky-2.jpg", "sibirsky-overview.jpg", "sibirsky-story.jpg", "sibirsky-e1.jpg",
      "aleksandriya.jpg", "aleksandriya-2.jpg", "aleksandriya-3.jpg", "aleksandriya-4.jpg", "aleksandriya-e6.jpg",
      "mius.jpg", "mius-2.jpg", "mius-overview.jpg", "mius-story.jpg",
      "natali.jpg", "natali-2.jpg", "natali-overview.jpg", "natali-story.jpg", "natali-e1.jpg", "natali-e2.jpg",
      "kasatka.jpg", "kasatka-2.jpg", "kasatka-overview.jpg", "kasatka-story.jpg",
      "fiesta.jpg", "fiesta-2.jpg", "fiesta-overview.jpg", "fiesta-story.jpg",
      "rusich.jpg", "rusich-2.jpg", "rusich-overview.jpg", "rusich-story.jpg",
      "volnyi.jpg", "volnyi-2.jpg", "volnyi-overview.jpg", "volnyi-story.jpg",
      "yeti.jpg", "yeti-2.jpg", "yeti-overview.jpg", "yeti-story.jpg",
      "yul.jpg", "yul-2.jpg", "yul-overview.jpg", "yul-story.jpg",
      "pilgrim.jpg", "pilgrim-2.jpg", "pilgrim-overview.jpg", "pilgrim-story.jpg",
      "laita.jpg", "laita-2.jpg", "laita-overview.jpg", "laita-story.jpg",
      "dundukovsky.jpg", "dundukovsky-2.jpg", "dundukovsky-3.jpg", "dundukovsky-4.jpg", "dundukovsky-5.jpg", "dundukovsky-6.jpg", "dundukovsky-7.jpg", "dundukovsky-8.jpg",
      "mara.jpg", "mara-2.jpg", "mara-overview.jpg", "mara-story.jpg",
      "proekt1.jpg", "proekt1-2.jpg", "proekt1-3.jpg", "proekt1-4.jpg", "proekt1-5.jpg", "proekt1-6.jpg", "proekt1-7.jpg", "proekt1-8.jpg",
      "sapfir.jpg", "sapfir-2.jpg", "sapfir-overview.jpg", "sapfir-story.jpg",
      "frank.jpg", "frank-2.jpg", "frank-overview.jpg", "frank-story.jpg",
      "bandido.jpg", "bandido-2.jpg", "bandido-3.jpg", "bandido-4.jpg", "bandido-5.jpg", "bandido-6.jpg", "bandido-7.jpg", "bandido-8.jpg",
      "gulyanka5.jpg", "gulyanka5-2.jpg", "gulyanka5-overview.jpg", "gulyanka5-story.jpg",
      "l1050.jpg", "l1050-2.jpg", "l1050-overview.jpg", "l1050-story.jpg", "l1050-i5.jpg",
      "gulyanka3.jpg", "gulyanka3-2.jpg", "gulyanka3-overview.jpg", "gulyanka3-story.jpg",
      "gulyanka2003.jpg", "gulyanka2003-2.jpg", "gulyanka2003-overview.jpg", "gulyanka2003-story.jpg",
      "gulyanka2.jpg", "gulyanka2-2.jpg", "gulyanka2-3.jpg", "gulyanka2-4.jpg", "gulyanka2-5.jpg", "gulyanka2-6.jpg", "gulyanka2-7.jpg", "gulyanka2-8.jpg"
    ]
  };

  var grid = document.getElementById("galGrid");
  var tabs = document.querySelectorAll(".gal-tab");
  var current = [];
  var currentTheme = "all";

  function src(f) { return "assets/img/" + f + "?v=" + IMG_V; }

  /* ---- Sorting ---- */
  var activeSort = "year";   // 'year' | 'boat' | 'room'
  var reversed = false;

  var SORTS = [
    { key: "year", label: "По году" },
    { key: "boat", label: "По судну" },
    { key: "room", label: "По помещению" }   // interiors only
  ];

  function sortList(list, theme) {
    var arr = list.slice();
    var tie = function (a, b) { return a.localeCompare(b); };
    if (activeSort === "boat") {
      arr.sort(function (a, b) {
        var c = ((meta(a) || {}).name || "").localeCompare((meta(b) || {}).name || "", "ru");
        return c || tie(a, b);
      });
    } else if (activeSort === "room" && theme === "interior") {
      arr.sort(function (a, b) {
        var ra = ROOM_ORDER.indexOf(ROOMS[a]); if (ra < 0) ra = 99;
        var rb = ROOM_ORDER.indexOf(ROOMS[b]); if (rb < 0) rb = 99;
        return (ra - rb) || tie(a, b);
      });
    } else { // year (newest first)
      arr.sort(function (a, b) {
        var ya = (meta(a) || {}).year || 0, yb = (meta(b) || {}).year || 0;
        return (yb - ya) || tie(a, b);
      });
    }
    return arr;
  }

  function render(theme) {
    currentTheme = theme;
    if (activeSort === "room" && theme !== "interior") activeSort = "year";
    var base = (theme === "all") ? GALLERY.interior.concat(GALLERY.exterior) : (GALLERY[theme] || []);
    var list = sortList(base, theme);
    if (reversed) list.reverse();
    current = list;
    grid.innerHTML = current.map(function (f, i) {
      return '<button class="gal-cell" type="button" data-idx="' + i + '" ' +
        'style="background-image:url(\'' + src(f) + '\')" aria-label="Открыть фото"></button>';
    }).join("");
  }

  tabs.forEach(function (t) {
    t.addEventListener("click", function () {
      tabs.forEach(function (x) { x.classList.remove("is-active"); });
      t.classList.add("is-active");
      render(t.dataset.theme);
    });
  });

  var dirBtn = document.getElementById("galDirBtn");
  dirBtn.addEventListener("click", function () {
    reversed = !reversed;
    dirBtn.classList.toggle("is-active", reversed);
    render(currentTheme);
  });

  /* ---- Sort dropdown ---- */
  var filterBtn = document.getElementById("galFilterBtn");
  var filterMenu = document.getElementById("galFilterMenu");

  function buildMenu() {
    filterMenu.innerHTML = SORTS
      .filter(function (s) { return s.key !== "room" || currentTheme === "interior"; })
      .map(function (s) {
        var act = (s.key === activeSort) ? " is-active" : "";
        return '<button type="button" class="gal-filter__item' + act + '" data-sort="' + s.key + '">' + s.label + "</button>";
      }).join("");
  }
  function openMenu() { buildMenu(); filterMenu.hidden = false; filterBtn.setAttribute("aria-expanded", "true"); }
  function closeMenu() { filterMenu.hidden = true; filterBtn.setAttribute("aria-expanded", "false"); }

  filterBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    if (filterMenu.hidden) openMenu(); else closeMenu();
  });
  filterMenu.addEventListener("click", function (e) {
    var it = e.target.closest(".gal-filter__item");
    if (!it) return;
    activeSort = it.dataset.sort;
    closeMenu();
    render(currentTheme);
  });
  document.addEventListener("click", function (e) {
    if (!filterMenu.hidden && !e.target.closest(".gal-filter")) closeMenu();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ---- Lightbox ---- */
  var lb = document.getElementById("galLb");
  var lbImg = document.getElementById("galLbImg");
  var lbCap = document.getElementById("galLbCap");
  var lbFig = lbImg.closest(".gal-lb__fig") || lbImg.parentNode;
  var idx = 0;

  function caption(f) {
    var m = meta(f);
    lbCap.innerHTML = m
      ? '<span class="gal-lb__name">' + m.name + '</span><span class="gal-lb__year">' + m.year + '</span>'
      : "";
  }
  // fixed frame per orientation: one size for landscape, one for portrait
  function applyOrient() {
    if (!lbImg.naturalWidth) return;
    lbFig.classList.remove("is-portrait", "is-landscape");
    lbFig.classList.add(lbImg.naturalHeight > lbImg.naturalWidth ? "is-portrait" : "is-landscape");
  }
  function show() {
    lbFig.classList.remove("is-portrait", "is-landscape");
    lbImg.onload = applyOrient;
    lbImg.src = src(current[idx]);
    if (lbImg.complete) applyOrient();
    caption(current[idx]);
  }
  function open(i) { idx = i; show(); lb.classList.add("is-open"); document.documentElement.style.overflow = "hidden"; document.body.style.overflow = "hidden"; }
  function close() { lb.classList.remove("is-open"); lbImg.src = ""; document.documentElement.style.overflow = ""; document.body.style.overflow = ""; }
  function step(d) { idx = (idx + d + current.length) % current.length; show(); }

  grid.addEventListener("click", function (e) {
    var cell = e.target.closest(".gal-cell");
    if (cell) open(parseInt(cell.dataset.idx, 10));
  });
  lb.addEventListener("click", function (e) {
    if (e.target.dataset.act === "close" || e.target === lb) close();
    if (e.target.dataset.act === "prev") step(-1);
    if (e.target.dataset.act === "next") step(1);
  });
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  /* ---- Back to top ---- */
  var topBtn = document.getElementById("galTop");
  if (topBtn) {
    function onScroll() {
      var past = (window.pageYOffset || document.documentElement.scrollTop) > window.innerHeight * 0.6;
      topBtn.classList.toggle("is-visible", past);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    topBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  render("all");
})();
