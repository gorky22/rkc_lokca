import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(req, { params }) {
  const page = getDb().prepare('SELECT * FROM pages WHERE slug = ?').get(params.slug);
  if (!page) return NextResponse.json({ error: 'Nenájdené' }, { status: 404 });
  return NextResponse.json(page);
}
