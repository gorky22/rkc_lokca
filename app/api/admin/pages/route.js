import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function POST(req) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Neprihlásený' }, { status: 401 });
  }
  const { slug, title, content } = await req.json();
  if (!slug || !title) return NextResponse.json({ error: 'Chýba slug alebo titulok' }, { status: 400 });
  getDb()
    .prepare(`
      INSERT INTO pages (slug, title, content, updated_at) VALUES (?, ?, ?, datetime('now'))
      ON CONFLICT(slug) DO UPDATE SET title = excluded.title, content = excluded.content, updated_at = datetime('now')
    `)
    .run(slug, title, content || '');
  return NextResponse.json({ ok: true });
}
