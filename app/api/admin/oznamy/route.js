import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { notifySubscribers } from '@/lib/mail';

export async function POST(req) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Neprihlásený' }, { status: 401 });
  }
  const body = await req.json();
  const db = getDb();

  if (body.action === 'delete') {
    db.prepare('DELETE FROM oznamy WHERE id = ?').run(body.id);
    return NextResponse.json({ ok: true });
  }

  const { id, title, week_label, content, attachment, notify } = body;
  if (!title) return NextResponse.json({ error: 'Chýba titulok' }, { status: 400 });

  if (id) {
    db.prepare('UPDATE oznamy SET title = ?, week_label = ?, content = ?, attachment = ? WHERE id = ?').run(
      title, week_label || '', content || '', attachment || '', id
    );
  } else {
    db.prepare('INSERT INTO oznamy (title, week_label, content, attachment) VALUES (?, ?, ?, ?)').run(
      title, week_label || '', content || '', attachment || ''
    );
  }

  let sent = 0;
  let mailError = null;
  if (notify) {
    try {
      const text = (content || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 220);
      sent = await notifySubscribers({
        subject: `Farské oznamy: ${title}`,
        heading: title,
        excerpt: text + '…',
        link: '/oznamy',
      });
    } catch (e) {
      mailError = e.message;
    }
  }
  return NextResponse.json({ ok: true, sent, mailError });
}
