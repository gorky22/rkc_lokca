import Link from 'next/link';
import { getSetting } from '@/lib/db';
import { CONTACT, LIVE_URL } from '@/lib/site';

/** Thin utility bar above the header: contact details + live-stream button. */
export default function TopBar() {
  const phone = getSetting('contact_phone', CONTACT.phone);
  const email = getSetting('contact_email', CONTACT.email);
  const liveUrl = getSetting('live_url', LIVE_URL);

  return (
    <div className="topbar">
      <div className="topbar-inner container">
        <div className="topbar-contact">
          <a href={`tel:${phone.replace(/[\s/]/g, '')}`}>{phone}</a>
          <span className="topbar-sep" aria-hidden="true">·</span>
          <a href={`mailto:${email}`}>{email}</a>
        </div>
        <div className="topbar-links">
          <Link href="/oznamy">Oznamy</Link>
          <Link href="/kontakt">Kontakt</Link>
          <a className="btn-live" href={liveUrl} target="_blank" rel="noopener noreferrer">
            <span className="live-dot" aria-hidden="true" />
            Sv. omša naživo
          </a>
        </div>
      </div>
    </div>
  );
}
