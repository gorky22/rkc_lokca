import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(req) {
  const token = new URL(req.url).searchParams.get('token');
  if (token) {
    getDb().prepare('DELETE FROM subscribers WHERE token = ?').run(token);
  }
  return NextResponse.redirect(new URL('/?odber=odhlaseny', req.url));
}
