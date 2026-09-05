import Link from 'next/link';
import { getDb, getSetting } from '@/lib/db';
import { excerpt } from '@/lib/text';
import Hero from '@/components/Hero';
import Shortcuts from '@/components/Shortcuts';
import HomeSidebar from '@/components/HomeSidebar';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const quote = getSetting('home_quote', '');
  const quoteAuthor = getSetting('home_quote_author', '');
  const news = getDb()
    .prepare('SELECT slug, title, content, image, created_at FROM news WHERE published = 1 ORDER BY created_at DESC LIMIT 9')
    .all();

  return (
    <>
      <Hero />
      <Shortcuts />

      {quote && (
        <section className="quote-band">
          <div className="quote-block container">
            <p>{quote}</p>
            {quoteAuthor && <p className="quote-author">({quoteAuthor})</p>}
          </div>
        </section>
      )}

      <div className="home-grid container">
        <div className="home-main">
          <h2 className="script-heading">Aktuality</h2>

          <div className="cards cards-2">
            {news.map((n) => (
              <Link key={n.slug} href={`/aktuality/${n.slug}`} className="card">
                {n.image ? (
                  <div className="card-media"><img className="card-img" src={n.image} alt="" /></div>
                ) : (
                  <div className="card-media card-media-empty" />
                )}
                <div className="card-body">
                  <div className="card-date">{new Date(n.created_at).toLocaleDateString('sk-SK')}</div>
                  <div className="card-title">{n.title}</div>
                  <p className="card-excerpt">{excerpt(n.content, 120)}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="center-action">
            <Link href="/aktuality" className="btn btn-outline">Zobraziť všetky aktuality</Link>
          </div>
        </div>

        <HomeSidebar />
      </div>
    </>
  );
}
