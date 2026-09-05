// Site-wide constants used by the header, hero, sidebar and footer.
// Everything here is a *default* — values stored in the `settings` table
// (editable in /admin/nastavenia) take precedence where noted.

const PARISH = {
  name: 'Rímskokatolícka cirkev, farnosť Lokca',
  shortName: 'Farnosť Lokca',
  filial: 'filiálka Ťapešovo',
};

const CONTACT = {
  address: 'Trojičné námestie 5/9, 029 51 Lokca',
  phone: '043/55 912 26',
  email: 'farnost@rkclokca.sk',
};

// Fallback when `live_url` is not set in settings — the parish YouTube channel.
const LIVE_URL = 'https://www.youtube.com/channel/UCgA9Yq65eVDZt4jLMbzD5YA/live';

// Two panels: the parish church and the filial church. Splitting the band in
// two keeps the (small, 4:3) archive photos from being cropped to a sliver.
const HERO = {
  images: [
    { src: '/assets/uploads/2017/08/lokca-kostol-768x561.jpg', alt: 'Farský kostol v Lokci' },
    { src: '/assets/uploads/2017/08/tapesovo-kostol-1024x748.jpg', alt: 'Kostol v Ťapešove' },
  ],
  title: 'Rímskokatolícka farnosť',
  script: 'Lokca',
  subtitle: 'filiálka Ťapešovo',
};

// "Zaujímavé odkazy" tiles in the home sidebar.
const QUICK_LINKS = [
  { label: 'Sväté písmo', href: 'https://dkc.kbs.sk/', external: true },
  { label: 'Liturgické čítania na dnes', href: 'https://lc.kbs.sk/', external: true },
  { label: 'Katechizmus Katolíckej cirkvi', href: 'https://www.katechizmus.sk/', external: true },
  { label: 'Spišská diecéza', href: 'https://www.kapitula.sk/', external: true },
  { label: 'Obec Lokca', href: 'https://www.lokca.sk/', external: true },
];

// Small "na jeden pohľad" links shown under the hero.
const SHORTCUTS = [
  { label: 'Oznamy na tento týždeň', href: '/oznamy', note: 'Čo sa deje vo farnosti' },
  { label: 'Časy sv. omší a spovedania', href: '/casy-sv-omsi-a-spovedania', note: 'Lokca a Ťapešovo' },
  { label: 'Úmysly sv. omší', href: '/umysly-lokca', note: 'Zapísané úmysly' },
  { label: 'Fotogaléria', href: '/fotogaleria', note: 'Zo života farnosti' },
];

// Internal links repeated in the footer.
const FOOTER_LINKS = [
  { label: 'Oznamy na tento týždeň', href: '/oznamy' },
  { label: 'Archív oznamov', href: '/oznamy/archiv' },
  { label: 'Časy sv. omší a spovedania', href: '/casy-sv-omsi-a-spovedania' },
  { label: 'Fotogaléria', href: '/fotogaleria' },
  { label: 'Kontakt', href: '/kontakt' },
  { label: 'Ochrana osobných údajov', href: '/ochrana-osobnych-udajov' },
];

module.exports = { PARISH, CONTACT, LIVE_URL, HERO, QUICK_LINKS, SHORTCUTS, FOOTER_LINKS };
