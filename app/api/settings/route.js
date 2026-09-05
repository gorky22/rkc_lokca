import { NextResponse } from 'next/server';
import { getSetting } from '@/lib/db';

export async function GET() {
  return NextResponse.json({
    home_quote: getSetting('home_quote'),
    home_quote_author: getSetting('home_quote_author'),
  });
}
