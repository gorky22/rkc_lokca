import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(req) {
  const albumId = new URL(req.url).searchParams.get('album');
  const rows = getDb().prepare('SELECT * FROM photos WHERE album_id = ? ORDER BY id').all(albumId);
  return NextResponse.json(rows);
}
