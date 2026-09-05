import { NextResponse } from 'next/server';
import { setSetting } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function POST(req) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Neprihlásený' }, { status: 401 });
  }
  const body = await req.json();
  for (const [k, v] of Object.entries(body)) {
    if (typeof v === 'string') setSetting(k, v);
  }
  return NextResponse.json({ ok: true });
}
