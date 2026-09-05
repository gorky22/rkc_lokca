import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json([], { status: 401 });
  }
  const rows = getDb().prepare('SELECT * FROM oznamy ORDER BY created_at DESC').all();
  return NextResponse.json(rows);
}
