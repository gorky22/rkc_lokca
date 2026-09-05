import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { requireAdmin } from '@/lib/auth';

const ALLOWED = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.doc', '.docx'];

export async function POST(req) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Neprihlásený' }, { status: 401 });
  }
  const form = await req.formData();
  const file = form.get('file');
  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'Chýba súbor' }, { status: 400 });
  }
  const ext = path.extname(file.name || '').toLowerCase();
  if (!ALLOWED.includes(ext)) {
    return NextResponse.json({ error: `Nepovolený typ súboru (${ext})` }, { status: 400 });
  }
  if (file.size > 20 * 1024 * 1024) {
    return NextResponse.json({ error: 'Súbor je príliš veľký (max 20 MB)' }, { status: 400 });
  }
  const buf = Buffer.from(await file.arrayBuffer());
  const dir = path.join(process.cwd(), 'public', 'uploads', String(new Date().getFullYear()));
  fs.mkdirSync(dir, { recursive: true });
  const base = path.basename(file.name, ext).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9_-]+/g, '-').slice(0, 60);
  const name = `${base}-${crypto.randomBytes(3).toString('hex')}${ext}`;
  fs.writeFileSync(path.join(dir, name), buf);
  return NextResponse.json({ ok: true, url: `/uploads/${new Date().getFullYear()}/${name}` });
}
