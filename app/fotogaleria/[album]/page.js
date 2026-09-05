import { notFound } from 'next/navigation';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default function AlbumPage({ params }) {
  const album = getDb().prepare('SELECT * FROM albums WHERE slug = ?').get(params.album);
  if (!album) notFound();
  const photos = getDb().prepare('SELECT * FROM photos WHERE album_id = ? ORDER BY id').all(album.id);

  return (
    <div className="container page-block">
      <h1 className="page-title">{album.title}</h1>
      <div className="photo-grid">
        {photos.map((p) => (
          <a key={p.id} href={p.src} target="_blank" rel="noopener noreferrer">
            <img src={p.src} alt={p.caption || ''} loading="lazy" />
          </a>
        ))}
      </div>
    </div>
  );
}
