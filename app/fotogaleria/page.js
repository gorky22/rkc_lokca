import Link from 'next/link';
import { getDb } from '@/lib/db';
import EditLink from '@/components/EditLink';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Fotogaléria – Farnosť Lokca' };

export default function GalleryPage() {
  const albums = getDb()
    .prepare(`
      SELECT a.*, (SELECT COUNT(*) FROM photos p WHERE p.album_id = a.id) AS cnt,
             COALESCE(NULLIF(a.cover, ''), (SELECT src FROM photos p WHERE p.album_id = a.id LIMIT 1)) AS coverSrc
      FROM albums a ORDER BY a.created_at DESC
    `)
    .all();

  return (
    <div className="container page-block">
      <h1 className="page-title">Fotogaléria</h1>
      <div className="album-grid">
        {albums.length === 0 && <p>Galéria je zatiaľ prázdna.</p>}
        {albums.map((a) => (
          <Link key={a.slug} href={`/fotogaleria/${a.slug}`} className="album-card">
            {a.coverSrc ? <img src={a.coverSrc} alt={a.title} /> : <div style={{ aspectRatio: '4/3', background: '#f3f3f3' }} />}
            <div className="album-title">{a.title} ({a.cnt})</div>
          </Link>
        ))}
      </div>
      <EditLink href="/admin/galeria" />
    </div>
  );
}
