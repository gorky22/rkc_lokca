import Link from 'next/link';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Aktuality – Farnosť Lokca' };

export default function AktualityPage() {
  const news = getDb()
    .prepare('SELECT slug, title, image, created_at FROM news WHERE published = 1 ORDER BY created_at DESC')
    .all();

  return (
    <>
      <h1 className="script-heading" style={{ margin: '10px 0 40px' }}>Aktuality</h1>
      <div className="cards">
        {news.map((n) => (
          <Link key={n.slug} href={`/aktuality/${n.slug}`} className="card">
            {n.image ? <img className="card-img" src={n.image} alt="" /> : <div className="card-img" />}
            <div className="card-body">
              <div className="card-title">{n.title}</div>
              <div className="card-date">{new Date(n.created_at).toLocaleDateString('sk-SK')}</div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
