/**
 * Seeds the database from data/import/*.json (content extracted from the
 * parish's archived website). Run once: `npm run seed`
 * Safe to re-run — it overwrites pages, and only inserts news/quote if missing.
 */
const fs = require('fs');
const path = require('path');
const { getDb, setSetting, getSetting } = require('../lib/db');

const IMPORT = path.join(process.cwd(), 'data', 'import');

function fixContent(html) {
  if (!html) return '';
  return html
    .replace(/https?:\/\/rkclokca\.sk/g, '')
    .replace(/\/wp-content\/uploads\//g, '/assets/uploads/')
    .replace(/\/wp-content\/gallery\/[^"']*/g, '#'); // gallery originals were not archived
}

// old WP slug -> new site slug (null = skip, handled elsewhere)
const SLUG_MAP = {
  'historia': 'historia',
  'kostoly': 'kostoly',
  'knazi-vo-farnosti': 'knazi-vo-farnosti',
  'knazi-ktori-posobili-vo-farnosti': 'knazi-ktori-posobili-vo-farnosti',
  'knazi-pochovani-vo-farnosti': 'knazi-pochovani-vo-farnosti',
  'reholne-sestry-vo-farnosti': 'reholne-sestry-vo-farnosti',
  'duchovne-povolania-z-farnosti': 'duchovne-povolania-z-farnosti',
  'casy-sv-omsi-a-spovedania': 'casy-sv-omsi-a-spovedania',
  'umysly-sv-omsi-2': null, // parent menu only
  'vypomocny-duchovny': 'vypomocny-duchovny',
  'oznamy-na-tento-tyzden': 'umysly-lokca',
  'umysly-tapesovo': 'umysly-tapesovo',
  'oznamy-na-tento-tyzden-2': 'upratovanie-farskeho-kostola',
  'oznamy-na-tento-tyzden-3': null, // becomes the oznamy module
  'fotogaleria-2': null, // gallery module
  'krst': 'krst',
  'sviatost-zmierenia': 'sviatost-zmierenia',
  'prve-sv-prijimanie': 'prve-sv-prijimanie',
  'birmovanie': 'birmovanie',
  'sviatost-manzelstva': 'sviatost-manzelstva',
  'pomazanie-chorych': 'pomazanie-chorych',
  'modlitby-matiek-2': 'hospodarska-rada',
  'farska-pastoracna-rada': 'farska-pastoracna-rada',
  'farsky-klub': 'farsky-klub',
  'detske-svate-omse2': 'detske-svate-omse',
  'adoracia-za-farnost_': 'adoracia-za-farnost',
  'ministranti': 'ministranti',
  'zdruzenie-zazracnej-medaily': 'zdruzenie-zazracnej-medaily',
  'dobra-novina': 'dobra-novina',
  'lektori': 'lektori',
  'kontakt': 'kontakt',
};

function main() {
  const db = getDb();
  const pages = JSON.parse(fs.readFileSync(path.join(IMPORT, 'pages.json'), 'utf8'));
  const news = JSON.parse(fs.readFileSync(path.join(IMPORT, 'news.json'), 'utf8'));

  // --- pages ---
  const upsert = db.prepare(`
    INSERT INTO pages (slug, title, content) VALUES (?, ?, ?)
    ON CONFLICT(slug) DO UPDATE SET title = excluded.title, content = excluded.content, updated_at = datetime('now')
  `);
  let n = 0;
  for (const [oldSlug, pg] of Object.entries(pages)) {
    const slug = SLUG_MAP[oldSlug];
    if (!slug || !pg || pg.err) continue;
    upsert.run(slug, pg.title || slug, fixContent(pg.clean));
    n++;
  }
  console.log(`Pages seeded: ${n}`);

  // privacy page placeholder if missing
  if (!db.prepare('SELECT 1 FROM pages WHERE slug = ?').get('ochrana-osobnych-udajov')) {
    upsert.run(
      'ochrana-osobnych-udajov',
      'Ochrana osobných údajov',
      '<p>Informácie o spracúvaní osobných údajov farnosti doplňte v administrácii.</p>'
    );
  }

  // --- news (seed articles) ---
  const insNews = db.prepare(
    'INSERT OR IGNORE INTO news (slug, title, content, image, created_at) VALUES (?, ?, ?, ?, ?)'
  );
  let nn = 0;
  const entries = Object.entries(news);
  for (let i = 0; i < entries.length; i++) {
    const [oldPath, post] = entries[i];
    if (!post || post.err) continue;
    const slug = oldPath.replace(/\//g, '');
    const date = post.date && post.date.length >= 10 ? post.date.slice(0, 10) : null;
    const created = date ? `${date} 12:00:00` : new Date(Date.now() - i * 86400000).toISOString().slice(0, 19).replace('T', ' ');
    const img = post.img && post.img.includes('/wp-content') ? fixContent(post.img) : '';
    insNews.run(slug, post.title, fixContent(post.clean), img, created);
    nn++;
  }
  console.log(`News seeded: ${nn}`);

  // --- oznamy: seed from the old "oznamy na tento tyzden" page ---
  const oz = pages['oznamy-na-tento-tyzden-3'];
  if (oz && oz.clean && db.prepare('SELECT COUNT(*) c FROM oznamy').get().c === 0) {
    db.prepare('INSERT INTO oznamy (title, week_label, content) VALUES (?, ?, ?)').run(
      oz.title || 'Oznamy na tento týždeň',
      '',
      fixContent(oz.clean)
    );
    console.log('Oznamy seeded from archived page.');
  }

  // --- homepage quote ---
  if (!getSetting('home_quote')) {
    const meta = JSON.parse(fs.readFileSync(path.join(IMPORT, 'meta.json'), 'utf8'));
    setSetting('home_quote', meta.home_quote || '');
    setSetting('home_quote_author', meta.home_quote_author || '');
  }

  console.log('Done.');
}

main();
