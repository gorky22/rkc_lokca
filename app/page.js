import Link from 'next/link';
import { getDb, getSetting } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const quote = getSetting(
    'home_quote',
    ''
  );
  const quoteAuthor = getSetting('home_quote_author', '');
  const news = getDb()
    .prepare('SELECT slug, title, image, created_at FROM news WHERE published = 1 ORDER BY created_at DESC LIMIT 9')
    .all();

  return (
    <>
      {quote && (
        <div className="quote-block">
          <div>{quote}</div>
          {quoteAuthor && <div className="quote-author">({quoteAuthor})</div>}
        </div>
      )}

      <h2 className="script-heading">Aktuality</h2>

      <div className="cards">
        {news.map((n) => (
          <Link key={n.slug} href={`/aktuality/${n.slug}`} className="card">
            {n.image ? (
              <img className="card-img" src={n.image} alt="" />
            ) : (
              <div className="card-img" />
            )}
            <div className="card-body">
              <div className="card-title">{n.title}</div>
              <div className="card-date">
                {new Date(n.created_at).toLocaleDateString('sk-SK')}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Link href="/aktuality" className="more-link">
        … viac článkov
      </Link>
    </>
  );
}
