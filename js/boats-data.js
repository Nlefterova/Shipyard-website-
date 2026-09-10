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
  { id: "specialist",family: "trex", name: "T-Rex Specialist", status: "planning", year: "", img: "trex-specialist.jpg", noLink: true },
  { id: "egoist", family: "trex", name: "T-Rex Egoist", status: "build", year: "2026", img: "trex-egoist.jpg", progress: 55, heroOnly: true, noLink: true,
    content: {
      eyebrow: "Глиссирующий катер",
      desc: "Новый катер линейки T-Rex — сейчас в постройке."
    } },
  { id: "trex-44fly", family: "trex", name: "T-Rex 44 Fly", status: "available", year: "2025", img: "trex44fly-2.jpg", cardImg: "trex44fly-card.jpg",
    photos: {
      hero2: "trex44fly-3.jpg", overview: "trex44fly-overview.jpg?v=2", construction: "trex44fly-story.jpg",
      thumbs: ["trex44fly-i1.jpg","trex44fly-i2.jpg","trex44fly-i3.jpg","trex44fly-i4.jpg","trex44fly-i5.jpg","trex44fly-i6.jpg"],
      captions: ["Салон","Салон","Камбуз","Мастер-каюта","Гостевая каюта","Санузел"],
      gallery: ["trex44fly-i2.jpg","trex44fly-i1.jpg","trex44fly-overview.jpg?v=2","trex44fly-i3.jpg","trex44fly-i4.jpg","trex44fly-story.jpg","trex44fly-2.jpg","trex44fly-i5.jpg","trex44fly-i6.jpg"],
      plans: ["trex44fly-plan3.png","trex44fly-plan1.png","trex44fly-plan2.png"]
    },
    content: {
      eyebrow: "Катер с флайбриджем",
      booklet: true,
      desc: "Круизный катер с флайбриджем — открытой верхней палубой для отдыха и второго поста управления.",
      heroSpecs: [["Длина","13,3 м"],["Ширина","3,67 м"],["Осадка","0,75 м"],["Спальных мест","6"]],
      overviewLead: "Главное отличие — флайбридж: открытая верхняя палуба, которую собирают под второй пост управления, зону солярия или солнечные панели.",
      overviewBody: [
        "На двух палубах — две каюты и шесть спальных мест, салон с камбузом и постом управления, два санузла с душем. Верхняя палуба отдана флайбриджу с бимини-тентом.",
        "Корпус — морской алюминий АМг5М. Запас топлива 1200 л и 250 л пресной воды, дизельный отопитель 8 кВт и генератор Westerbeke, подруливающее устройство Quick и транцевые плиты с электроприводом. По желанию — спарка подвесных Mercury Verado 400."
      ],
      storyLead: "Его история ещё не началась.",
      storyBody: [
        "T-Rex 44&nbsp;Fly — четвёртый в линейке и единственный с флайбриджем. Он совсем новый: палубы ещё хранят тишину, флайбридж пуст, а корпус ещё ни разу не касался воды.",
        "Впереди — первый спуск, первый горизонт, первый рассвет, встреченный с верхней палубы. Всё только начинается."
      ],
      specs: [
        ["Длина","13,3 м"],["Ширина","3,67 м"],["Осадка","0,6–0,75 м"],["Вместимость","12 человек"],
        ["Каюты","2"],["Спальных мест","6"],["Санузлы","2 (с душем)"],
        ["Двигатели","по выбору"],["Запас топлива","1200 л"],["Запас воды","250 л"],
        ["Генератор","Westerbeke 5 кВт"],["Отопление","дизель, 8 кВт"],["Материал корпуса","АМг5М"],["Год постройки","2025"]
      ],
      decks: [
        { name: "вид сбоку", items: ["флайбридж","второй пост управления","зона солярия"] },
        { name: "верхняя палуба", items: ["салон","камбуз","пост управления","кокпит"] },
        { name: "нижняя палуба", items: ["мастер-каюта","гостевая каюта","два санузла с душем"] }
      ]
    } },
  { id: "trex-44cr", family: "trex", name: "T-Rex 44 CR",  status: "available", year: "2023", img: "trex44cr.jpg", cardImg: "trex44cr-card.jpg",
    photos: { hero2: "trex44cr-2.jpg", overview: "trex44cr-dock.jpg?v=2", construction: "trex44cr-beach.jpg?v=2", thumbs: ["trex44cr-i1.jpg","trex44cr-i2.jpg","trex44cr-i3.jpg","trex44cr-i4.jpg","trex44cr-i5.jpg","trex44cr-i6.jpg"], captions: ["Камбуз","Камбуз","Мастер-каюта","Носовая каюта","Санузел","Душевая"], gallery: ["trex44cr-i5.jpg","trex44cr-i1.jpg","trex44cr-beach.jpg?v=2","trex44cr-i3.jpg","trex44cr-i4.jpg","trex44cr-dock.jpg?v=2","trex44cr-2.jpg","trex44cr-i2.jpg","trex44cr-i6.jpg"], plans: ["trex44cr-plan1.png","trex44cr-plan2.png"] },
    content: {
      eyebrow: "Глиссирующий катер",
      booklet: true,
      desc: "Круизный глиссирующий катер с двумя палубами и тремя каютами.",
      heroSpecs: [["Длина","13,3 м"],["Ширина","3,5 м"],["Осадка","0,75 м"],["Спальных мест","10"]],
      overviewLead: "По сути — квартира на воде: автономная, безопасная и готовая к долгим переходам.",
      overviewBody: [
        "На борту — три каюты и до 10 спальных мест на двух палубах. На верхней палубе разместились кают-компания, камбуз, пост управления и две открытые лаунж-зоны; на нижней — мастер-каюта, кормовая и средняя каюты, два санузла и душевая.",
        "Автономность обеспечивают топливные баки на 800 л, запас пресной воды 250 л, солнечная панель 360 Вт и независимые системы отопления и кондиционирования. Современная электрика и электроника позволяют подолгу оставаться вдали от берега."
      ],
      storyLead: "Его история только начинается.",
      storyBody: [
        "T-Rex 44&nbsp;CR появился на воде в 2023 году — третий в линейке. Каждый катер этой линейки единственный в своём роде: двух одинаковых не бывает. Он — один из самых больших и просторных: места на борту хватает, чтобы стать настоящим домом для семьи.",
        "Свой путь он начинает как <span style=\"font-weight:600\">участник Саратовского лодочного фестиваля 2026 года</span> — это его первое публичное появление и точка отсчёта собственной истории. Фестиваль прошёл с 31 июля по 2 августа и собрал более двадцати судостроительных компаний, представивших свои катера и яхты на воде и на берегу, — среди них был и он."
      ],
      specs: [
        ["Длина","13,3 м"],["Ширина","3,48 м"],["Осадка","0,55–0,75 м"],["Масса","8 000 кг"],
        ["Вместимость","12 человек"],["Каюты","3"],["Спальных мест","10"],
        ["Двигатели","2 × Yamaha F300"],["Мощность","600 л.с."],["Крейсерская скорость","50 км/ч"],
        ["Запас топлива","800 л (2×400)"],["Запас воды","250 л"],["Материал корпуса","АМг5М"],["Год постройки","2023"]
      ],
      decks: [
        { name: "верхняя палуба", items: ["камбуз","кокпит","зона отдыха","зона у воды","солярий на носу"] },
        { name: "нижняя палуба", items: ["мастер-каюта","носовая каюта","детская каюта","два санузла","душевая"] }
      ]
    } },
  { id: "trex-40", family: "trex", name: "T-Rex 40", status: "sold", year: "2020", img: "trex40-4.jpg",
    photos: {
      hero2: "trex40-2.jpg", hero2Pos: "center 28%", overview: "trex40-3.jpg", construction: "trex40-story2.jpg",
      thumbs: ["trex40-i1.jpg","trex40-i2.jpg","trex40-i3.jpg","trex40-i4.jpg","trex40-i5.jpg","trex40-i6.jpg"],
      captions: ["Пост управления","Салон","Кают-компания","Каюта","Камбуз","На воде"],
      gallery: ["trex40-i2.jpg","trex40-i1.jpg","trex40.jpg?v=2","trex40-i3.jpg","trex40-i4.jpg","trex40-overview.jpg","trex40-2.jpg","trex40-i5.jpg","trex40-story.jpg"],
      plans: ["trex40-plan-side.png","trex40-plan-top.png","trex40-plan-front.png"]
    },
    content: {
      eyebrow: "Глиссирующий катер",
      desc: "Глиссирующий катер из морского алюминия, построенный для автономных выходов по рекам и морю.",
      heroSpecs: [["Длина","12,1 м"],["Ширина","3,48 м"],["Осадка","0,8 м"],["Спальных мест","2–4"]],
      overviewLead: "Катер для автономных выходов — по рекам и морю, в северных широтах.",
      overviewBody: [
        "Корпус из морского алюминия АМг5М с усиленным килем и утеплением, рассчитанным на перепад температур до 40 градусов: T-Rex 40 спроектирован для северных широт и долгих переходов по рекам и морю.",
        "Два подвесных Mercury Verado V8 по 300 л.с. разгоняют его до 74 км/ч, запас топлива — 1000 л (2×500). Обводы обеспечивают быстрый выход на глиссирование и устойчивость на волне при любой погоде."
      ],
      storyLead: "Теперь у него своя дорога.",
      storyBody: [
        "T-Rex 40 сошёл на воду в 2020 году — второй катер линейки. Его продали как спасательный катер — в областную службу спасения: именно под такую задачу его и брали.",
        "Дальше его история пишется уже сама — сейчас он в Саратове, на большой воде. Всё, что будет с ним потом, — это уже только его собственный путь."
      ],
      specs: [
        ["Длина","12,1 м"],["Ширина","3,48 м"],["Осадка","0,54–0,8 м"],["Водоизмещение","7 т"],
        ["Вместимость","12 человек"],["Спальных мест","2–4"],["Высота борта","1,9 м"],
        ["Двигатели","2 × Mercury Verado V8"],["Мощность","600 л.с. (2×300)"],["Максимальная скорость","74 км/ч"],
        ["Крейсерская скорость","45 км/ч"],["Запас топлива","1000 л (2×500)"],["Материал корпуса","АМг5М"],["Год постройки","2020"]
      ],
      decks: [
        { name: "вид сбоку", items: [] },
        { name: "вид сверху", items: [] },
        { name: "вид спереди", items: [] }
      ]
    } },
  { id: "trex-37", family: "trex", name: "T-Rex 37", status: "sold", year: "2018", img: "trex37-2.jpg", cardPos: "40% 50%",
    photos: {
      hero2: "trex37.jpg?v=2", overview: "trex37-overview.jpg", construction: "trex37-story.jpg",
      thumbs: ["trex37-i1.jpg","trex37-i2.jpg","trex37-i3.jpg","trex37-i4.jpg","trex37-i5.jpg","trex37-i6.jpg"],
      captions: ["Пост управления","Салон","Кают-компания","Каюта","Камбуз","На воде"],
      gallery: ["trex37-i2.jpg","trex37-i1.jpg","trex37.jpg?v=2","trex37-i3.jpg","trex37-i4.jpg","trex37-overview.jpg","trex37-2.jpg","trex37-i5.jpg","trex37-i6.jpg"],
      plans: ["trex37-plan-side.png","trex37-plan-front.png"]
    },
    content: {
      eyebrow: "Глиссирующий катер",
      desc: "Первый катер линейки T-Rex — компактный, полностью автономный, с водолазным оснащением.",
      heroSpecs: [["Длина","10,75 м"],["Ширина","3,48 м"],["Осадка","0,75 м"],["Вместимость","12 человек"]],
      overviewLead: "Первый катер линейки — компактный, автономный, готовый к работе на воде.",
      overviewBody: [
        "T-Rex 37 — 10,75 метра морского алюминия АМг5М, первый катер серии. Два дизеля Mercruiser 2.0 по 170 л.с. дают до 55 км/ч и дальность до 400 миль на экономическом ходу; на борту — гидравлическое рулевое управление, носовое подруливающее устройство, генератор и полный комплект навигации.",
        "Внутри — климат-система, отопление, камбуз, душ и места для 12 человек. А на корме — площадка с трапом для водолаза и отсек под переносной компрессор: катер с самого начала готовили и к серьёзной, водолазной работе."
      ],
      storyLead: "Первый в линейке — и уехал дальше всех.",
      storyBody: [
        "T-Rex 37 сошёл на воду в 2018 году — самый первый катер линейки, тот, с которого началась вся семья T-Rex. И уже он был не для прогулок: на корме — площадка для водолаза, в корпусе — место под компрессор. Он был готов к серьёзной работе с первого дня.",
        "И работа нашла его далеко от дома. Сегодня он несёт службу в МЧС Казахстана — там, где счёт идёт на минуты, а от катера ждут не красоты, а надёжности. Первый T-Rex ушёл дальше всех — и стал нужнее всех."
      ],
      specs: [
        ["Длина","10,75 м"],["Ширина","3,48 м"],["Осадка","0,54–0,75 м"],["Водоизмещение","7,6 т"],
        ["Вместимость","12 человек"],["Высота борта","1,9 м"],["Двигатели","2 × Mercruiser 2.0 дизель"],
        ["Мощность","340 л.с. (2×170)"],["Максимальная скорость","55 км/ч"],["Дальность хода","400 миль"],
        ["Запас топлива","800 л"],["Запас воды","100 л"],["Материал корпуса","АМг5"],["Год постройки","2018"]
      ],
      decks: [
        { name: "вид сбоку", items: [] },
        { name: "вид спереди", items: [] }
      ]
    } },
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
