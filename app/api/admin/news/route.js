import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { notifySubscribers } from '@/lib/mail';

function slugify(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export async function POST(req) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Neprihlásený' }, { status: 401 });
  }
  const body = await req.json();
  const db = getDb();

  if (body.action === 'delete') {
    db.prepare('DELETE FROM news WHERE id = ?').run(body.id);
    return NextResponse.json({ ok: true });
  }

  let { id, title, content, image, notify } = body;
  if (!title) return NextResponse.json({ error: 'Chýba titulok' }, { status: 400 });

  let slug;
  if (id) {
    db.prepare('UPDATE news SET title = ?, content = ?, image = ? WHERE id = ?').run(title, content || '', image || '', id);
    slug = db.prepare('SELECT slug FROM news WHERE id = ?').get(id).slug;
  } else {
    slug = slugify(title);
    const exists = db.prepare('SELECT 1 FROM news WHERE slug = ?').get(slug);
    if (exists) slug = `${slug}-${Date.now().toString(36)}`;
    db.prepare('INSERT INTO news (slug, title, content, image) VALUES (?, ?, ?, ?)').run(slug, title, content || '', image || '');
  }

  let sent = 0;
  let mailError = null;
  if (notify) {
    try {
      const text = (content || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 220);
      sent = await notifySubscribers({
        subject: `Nová aktualita: ${title}`,
        heading: title,
        excerpt: text + '…',
        link: `/aktuality/${slug}`,
      });
    } catch (e) {
      mailError = e.message;
    }
  }
  return NextResponse.json({ ok: true, slug, sent, mailError });
}
