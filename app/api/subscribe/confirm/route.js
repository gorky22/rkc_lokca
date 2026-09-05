import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(req) {
  const token = new URL(req.url).searchParams.get('token');
  if (token) {
    const res = getDb().prepare('UPDATE subscribers SET confirmed = 1 WHERE token = ?').run(token);
    if (res.changes > 0) {
      return NextResponse.redirect(new URL('/?odber=potvrdeny', req.url));
    }
  }
  return NextResponse.redirect(new URL('/?odber=chyba', req.url));
}
