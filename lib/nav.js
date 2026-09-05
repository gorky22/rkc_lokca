// Navigation structure — mirrors the original site menu.
// Slugs map to pages stored in the DB (table `pages`) unless `href` given.
const NAV = [
  { label: 'Domov', href: '/' },
  {
    label: 'O farnosti',
    children: [
      { label: 'História', slug: 'historia' },
      { label: 'Kostoly', slug: 'kostoly' },
      {
        label: 'Kňazi',
        children: [
          { label: 'Kňazi vo farnosti', slug: 'knazi-vo-farnosti' },
          { label: 'Kňazi, ktorí pôsobili vo farnosti', slug: 'knazi-ktori-posobili-vo-farnosti' },
          { label: 'Kňazi pochovaní vo farnosti', slug: 'knazi-pochovani-vo-farnosti' },
        ],
      },
      { label: 'Rehoľné sestry vo farnosti', slug: 'reholne-sestry-vo-farnosti' },
      { label: 'Duchovné povolania z farnosti', slug: 'duchovne-povolania-z-farnosti' },
    ],
  },
  {
    label: 'Oznamy',
    children: [
      { label: 'Oznamy na tento týždeň', href: '/oznamy' },
      { label: 'Archív oznamov', href: '/oznamy/archiv' },
      { label: 'Časy sv. omší a spovedania', slug: 'casy-sv-omsi-a-spovedania' },
      {
        label: 'Úmysly sv. omší',
        children: [
          { label: 'Úmysly – výpomocný duchovný', slug: 'vypomocny-duchovny' },
          { label: 'Úmysly Lokca', slug: 'umysly-lokca' },
          { label: 'Úmysly Ťapešovo', slug: 'umysly-tapesovo' },
        ],
      },
      { label: 'Upratovanie farského kostola', slug: 'upratovanie-farskeho-kostola' },
    ],
  },
  { label: 'Fotogaléria', href: '/fotogaleria' },
  {
    label: 'Sviatosti',
    children: [
      { label: 'Sviatosť krstu', slug: 'krst' },
      { label: 'Sviatosť zmierenia', slug: 'sviatost-zmierenia' },
      { label: 'Prvé sv. prijímanie', slug: 'prve-sv-prijimanie' },
      { label: 'Birmovanie', slug: 'birmovanie' },
      { label: 'Sviatosť manželstva', slug: 'sviatost-manzelstva' },
      { label: 'Pomazanie chorých', slug: 'pomazanie-chorych' },
    ],
  },
  {
    label: 'Aktivity',
    children: [
      { label: 'Hospodárska rada farnosti a filiálky', slug: 'hospodarska-rada' },
      { label: 'Farská pastoračná rada', slug: 'farska-pastoracna-rada' },
      { label: 'Farský klub', slug: 'farsky-klub' },
      { label: 'Detské sväté omše', slug: 'detske-svate-omse' },
      { label: 'Adorácia za farnosť', slug: 'adoracia-za-farnost' },
      { label: 'Miništranti', slug: 'ministranti' },
      { label: 'Združenie zázračnej medaily', slug: 'zdruzenie-zazracnej-medaily' },
      { label: 'Dobrá novina', slug: 'dobra-novina' },
      { label: 'Lektori', slug: 'lektori' },
    ],
  },
  { label: 'Kontakt', slug: 'kontakt' },
];

const SOCIALS = {
  instagram: 'https://www.instagram.com/rkc_lokca/',
  facebook: 'https://www.facebook.com/rkclokca',
  youtube: 'https://www.youtube.com/channel/UCgA9Yq65eVDZt4jLMbzD5YA',
};

module.exports = { NAV, SOCIALS };
