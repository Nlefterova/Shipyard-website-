/* Shared boat data — used by both the Fleet page (js/fleet.js) and the
   boat detail page (js/boat.js).

   To add a boat: add an entry to BOATS.
   - id:     unique url slug (used in boat.html?id=...). keep it short + latin.
   - family: one of the FAMILIES keys below.
   - status: 'planning' | 'build' | 'available' | 'sold'
   - year:   build year (string) or "" if not built yet.
   - img:    file in assets/img/ (portrait works best). 'boat-ph.jpg' = placeholder.
   - tags:   optional array of extra badges, e.g. ["На заказ"].
   Optional detail-page fields (shown on boat.html, placeholders if absent):
   - series: overrides the family name shown as the eyebrow.
   - desc:   short intro paragraph.
   - specs:  array of { label, value }. */

const FAMILIES = [
  { key: "trex",       name: "T-Rex",      id: "fam-trex" },
  { key: "expedition", name: "Expedition", id: "fam-expedition" },
  { key: "korabli",    name: "Корабли",    id: "fam-korabli" },
  { key: "traulery",   name: "Траулеры",   id: "fam-traulery" },
  { key: "gulyanki",   name: "Гулянки",    id: "fam-gulyanki" },
];

const STATUS_LABEL = { planning: "В проекте", build: "В постройке", available: "Готов к продаже", sold: "Продана" };

const BOATS = [
  // T-Rex
  { id: "specialist",family: "trex", name: "T-Rex Specialist", status: "planning", year: "", img: "trex-specialist.jpg" },
  { id: "egoist",    family: "trex", name: "T-Rex Egoist",     status: "build",    year: "2026", img: "trex-egoist.jpg", progress: 55 },
  { id: "trex-44fly",family: "trex", name: "T-Rex 44 Fly", status: "available", year: "2024", img: "trex44fly.jpg" },
  { id: "trex-44cr", family: "trex", name: "T-Rex 44 CR",  status: "available", year: "2023", img: "trex44cr.jpg", photos: { hero2: "trex44cr-2.jpg", overview: "trex44cr-dock.jpg?v=2", construction: "trex44cr-beach.jpg?v=2", thumbs: ["trex44cr-i1.jpg","trex44cr-i2.jpg","trex44cr-i3.jpg","trex44cr-i4.jpg","trex44cr-i5.jpg","trex44cr-i6.jpg"], captions: ["Камбуз","Камбуз","Мастер-каюта","Носовая каюта","Санузел","Душевая"], gallery: ["trex44cr-i5.jpg","trex44cr-i1.jpg","trex44cr-beach.jpg?v=2","trex44cr-i3.jpg","trex44cr-i4.jpg","trex44cr-dock.jpg?v=2","trex44cr-2.jpg","trex44cr-i2.jpg","trex44cr-i6.jpg"], plans: ["trex44cr-plan1.png","trex44cr-plan2.png"] } },
  { id: "trex-40",   family: "trex", name: "T-Rex 40",     status: "sold",      year: "2020", img: "trex40.jpg" },
  { id: "trex-37",   family: "trex", name: "T-Rex 37",     status: "sold",      year: "2018", img: "trex37.jpg" },
  // Expedition
  { id: "exp-65lux", family: "expedition", name: "Expedition 65 Lux",       status: "available", year: "2025", img: "fleet-expedition.jpg" },
  { id: "sibirsky",  family: "expedition", name: "Сибирский исследователь", status: "sold",      year: "2022", img: "verf-boat.jpg", tags: ["На заказ"] },
  // Корабли
  { id: "mius",      family: "korabli", name: "Миус",       status: "sold", year: "2019", img: "mius.jpg", tags: ["На заказ"] },
  { id: "kasatka",   family: "korabli", name: "Касатка",    status: "sold", year: "2017", img: "kasatka.jpg", tags: ["На заказ"] },
  { id: "natali-srt",family: "korabli", name: "Natali Srt", status: "sold", year: "2014", img: "fleet-korabli.jpg", tags: ["На заказ"] },
  { id: "rusich",    family: "korabli", name: "Русич",      status: "sold", year: "2013", img: "rusich.jpg" },
  { id: "fiesta",    family: "korabli", name: "Fiesta",     status: "sold", year: "2012", img: "fiesta.jpg", tags: ["На заказ"] },
  { id: "yul",       family: "korabli", name: "Юл",         status: "sold", year: "2011", img: "yul.jpg" },
  { id: "volnyi",    family: "korabli", name: "Вольный",    status: "sold", year: "2010", img: "volnyi.jpg", tags: ["На заказ"] },
  { id: "piligrim",  family: "korabli", name: "Пилигрим",   status: "sold", year: "2009", img: "pilgrim.jpg", tags: ["На заказ"] },
  { id: "yeti",      family: "korabli", name: "Yeti",       status: "sold", year: "2005", img: "yeti.jpg", tags: ["На заказ"] },
  { id: "dundukovsky-1", family: "korabli", name: "Дундуковский 1", status: "sold", year: "2001", img: "boat-ph.jpg", tags: ["На заказ"] },
  { id: "laita",     family: "korabli", name: "Лайта",      status: "sold", year: "2000", img: "laita.jpg", tags: ["На заказ"] },
  { id: "mara",      family: "korabli", name: "Мара",       status: "sold", year: "1999", img: "mara.jpg" },
  { id: "proekt-1",  family: "korabli", name: "Проект №1",  status: "sold", year: "1995", img: "boat-ph.jpg" },
  // Траулеры
  { id: "frank",     family: "traulery", name: "Frank",   status: "sold", year: "2006", img: "frank.jpg", tags: ["На заказ"] },
  { id: "sapfir",    family: "traulery", name: "Сапфир",  status: "sold", year: "2004", img: "fleet-traulery.jpg", tags: ["На заказ"] },
  { id: "bandido",   family: "traulery", name: "Bandido", status: "sold", year: "2002", img: "boat-ph.jpg", tags: ["На заказ"] },
  // Гулянки
  { id: "gulyanka-1",family: "gulyanki", name: "Гулянка №1", status: "sold", year: "2016", img: "gulyanka1.jpg", tags: ["На заказ"] },
  { id: "l-1050",    family: "gulyanki", name: "L-1050",     status: "sold", year: "2015", img: "l1050.jpg", tags: ["На заказ"] },
  { id: "gulyanka-3",family: "gulyanki", name: "Гулянка №3", status: "sold", year: "2008", img: "gulyanka3.jpg" },
  { id: "gulyanka-2",family: "gulyanki", name: "Гулянка №2", status: "sold", year: "2007", img: "boat-ph.jpg" },
  { id: "gulyanka-2005", family: "gulyanki", name: "Гулянка", status: "sold", year: "2003", img: "boat-ph.jpg" },
];

function familyName(key) {
  const f = FAMILIES.find((x) => x.key === key);
  return f ? f.name : "";
}
