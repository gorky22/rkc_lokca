import { NextResponse } from 'next/server';
import { setSetting } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

// Only these keys may be written, each with a validator.
const isUrl = (v) => v === '' || /^https?:\/\/\S+$/i.test(v);
const isEmail = (v) => v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isText = (v) => v.length <= 2000;

const ALLOWED = {
  home_quote: isText,
  home_quote_author: isText,
  live_url: isUrl,
  contact_phone: isText,
  contact_email: isEmail,
  contact_address: isText,
};

const ERRORS = {
  live_url: 'Odkaz na prenos musí začínať http:// alebo https://',
  contact_email: 'E-mail nemá platný tvar.',
};

export async function POST(req) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Neprihlásený' }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Neplatné údaje.' }, { status: 400 });
  }

  const updates = [];
  for (const [key, value] of Object.entries(body)) {
    const validate = ALLOWED[key];
    if (!validate) continue;
    if (typeof value !== 'string') {
      return NextResponse.json({ error: `Neplatná hodnota: ${key}` }, { status: 400 });
    }
    const trimmed = value.trim();
    if (!validate(trimmed)) {
      return NextResponse.json({ error: ERRORS[key] || `Neplatná hodnota: ${key}` }, { status: 400 });
    }
    updates.push([key, trimmed]);
  }

  updates.forEach(([key, value]) => setSetting(key, value));
  return NextResponse.json({ ok: true, saved: updates.length });
}
