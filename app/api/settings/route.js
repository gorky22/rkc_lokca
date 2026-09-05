import { NextResponse } from 'next/server';
import { getSetting } from '@/lib/db';
import { CONTACT, LIVE_URL } from '@/lib/site';

export async function GET() {
  return NextResponse.json({
    home_quote: getSetting('home_quote'),
    home_quote_author: getSetting('home_quote_author'),
    live_url: getSetting('live_url', LIVE_URL),
    contact_phone: getSetting('contact_phone', CONTACT.phone),
    contact_email: getSetting('contact_email', CONTACT.email),
    contact_address: getSetting('contact_address', CONTACT.address),
  });
}
