import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

function slugify(s) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}

export async function POST(req) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Neprihlásený' }, { status: 401 });
  }
  const body = await req.json();
  const db = getDb();

  switch (body.action) {
    case 'createAlbum': {
      let slug = slugify(body.title);
      if (db.prepare('SELECT 1 FROM albums WHERE slug = ?').get(slug)) slug += '-' + Date.now().toString(36);
      db.prepare('INSERT INTO albums (slug, title) VALUES (?, ?)').run(slug, body.title);
      return NextResponse.json({ ok: true, slug });
    }
    case 'deleteAlbum':
      db.prepare('DELETE FROM albums WHERE id = ?').run(body.id);
      return NextResponse.json({ ok: true });
    case 'addPhoto':
      db.prepare('INSERT INTO photos (album_id, src) VALUES (?, ?)').run(body.albumId, body.src);
      return NextResponse.json({ ok: true });
    case 'deletePhoto':
      db.prepare('DELETE FROM photos WHERE id = ?').run(body.id);
      return NextResponse.json({ ok: true });
    default:
      return NextResponse.json({ error: 'Neznáma akcia' }, { status: 400 });
  }
}
