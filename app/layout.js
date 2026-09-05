import './globals.css';
import Link from 'next/link';
import Nav from '@/components/Nav';
import TopBar from '@/components/TopBar';
import SubscribeBox from '@/components/SubscribeBox';
import { getDb, getSetting } from '@/lib/db';
import { SOCIALS } from '@/lib/nav';
import { PARISH, CONTACT, FOOTER_LINKS } from '@/lib/site';

export const metadata = {
  title: 'Rímskokatolícka farnosť Lokca',
  description: 'Oficiálna stránka Rímskokatolíckej farnosti Lokca, filiálka Ťapešovo.',
};

export default function RootLayout({ children }) {
  const phone = getSetting('contact_phone', CONTACT.phone);
  const email = getSetting('contact_email', CONTACT.email);
  const address = getSetting('contact_address', CONTACT.address);
  const latest = getDb()
    .prepare('SELECT slug, title FROM news WHERE published = 1 ORDER BY created_at DESC LIMIT 4')
    .all();

  return (
    <html lang="sk">
      <body>
        <TopBar />

        <header className="site-header">
          <div className="header-inner container">
            <Link href="/" className="site-logo">
              <img
                src="/assets/uploads/2017/10/header-5785.png"
                alt="Rímskokatolícka farnosť Lokca – filiálka Ťapešovo"
              />
            </Link>
            <Nav />
          </div>
        </header>

        <main className="page-main">{children}</main>

        <footer className="site-footer">
          <SubscribeBox />

          <div className="footer-main">
            <div className="footer-cols container">
              <div className="footer-col">
                <h4>Kontakt</h4>
                <p>
                  {PARISH.name}
                  <br />
                  {address}
                  <br />
                  Telefón: <a href={`tel:${phone.replace(/[\s/]/g, '')}`}>{phone}</a>
                  <br />
                  E-mail: <a href={`mailto:${email}`}>{email}</a>
                </p>
              </div>

              <div className="footer-col">
                <h4>Dôležité odkazy</h4>
                <ul>
                  {FOOTER_LINKS.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href}>{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="footer-col">
                <h4>Najnovšie články</h4>
                <ul>
                  {latest.map((n) => (
                    <li key={n.slug}>
                      <Link href={`/aktuality/${n.slug}`}>{n.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="footer-col">
                <h4>Sledujte nás</h4>
                <ul className="social-links">
                  <li><a href={SOCIALS.facebook} target="_blank" rel="noopener noreferrer">Facebook</a></li>
                  <li><a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>
                  <li><a href={SOCIALS.youtube} target="_blank" rel="noopener noreferrer">YouTube</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="container">
              © {new Date().getFullYear()} {PARISH.name} · {PARISH.filial}
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
