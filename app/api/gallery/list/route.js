import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  const rows = getDb()
    .prepare('SELECT a.*, (SELECT COUNT(*) FROM photos p WHERE p.album_id = a.id) AS cnt FROM albums a ORDER BY a.created_at DESC')
    .all();
  return NextResponse.json(rows);
}
