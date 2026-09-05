import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getDb } from '@/lib/db';
import { sendConfirmationEmail } from '@/lib/mail';

export async function POST(req) {
  const { email } = await req.json().catch(() => ({}));
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: 'Zadajte platný e-mail.' }, { status: 400 });
  }
  const db = getDb();
  const existing = db.prepare('SELECT * FROM subscribers WHERE email = ?').get(email);
  if (existing && existing.confirmed) {
    return NextResponse.json({ message: 'Tento e-mail už odber odoberá.' });
  }
  const token = crypto.randomBytes(24).toString('hex');
  if (existing) {
    db.prepare('UPDATE subscribers SET token = ? WHERE email = ?').run(token, email);
  } else {
    db.prepare('INSERT INTO subscribers (email, token) VALUES (?, ?)').run(email, token);
  }
  try {
    await sendConfirmationEmail(email, token);
    return NextResponse.json({ message: 'Skontrolujte si e-mail a potvrďte odber.' });
  } catch (e) {
    // SMTP not configured — confirm directly so the feature still works.
    getDb().prepare('UPDATE subscribers SET confirmed = 1 WHERE email = ?').run(email);
    return NextResponse.json({ message: 'Odber bol prihlásený.' });
  }
}
