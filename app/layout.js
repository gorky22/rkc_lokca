import './globals.css';
import Link from 'next/link';
import Nav from '@/components/Nav';
import SubscribeBox from '@/components/SubscribeBox';
import { SOCIALS } from '@/lib/nav';

export const metadata = {
  title: 'Rímskokatolícka farnosť Lokca',
  description: 'Oficiálna stránka Rímskokatolíckej farnosti Lokca, filiálka Ťapešovo.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="sk">
      <body>
        <header className="site-header container">
          <Link href="/" className="site-logo">
            <img src="/assets/uploads/2017/10/header-5785.png" alt="Rímskokatolícka farnosť Lokca – filiálka Ťapešovo" />
          </Link>
          <Nav />
        </header>

        <main className="page-main container">{children}</main>

        <footer className="site-footer">
          <SubscribeBox />
          <div className="follow container">
            <h3>Sledujte nás na</h3>
            <div className="social-links">
              <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href={SOCIALS.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href={SOCIALS.youtube} target="_blank" rel="noopener noreferrer">YouTube</a>
            </div>
          </div>
          <div className="footer-bottom">
            © {new Date().getFullYear()} Rímskokatolícka farnosť Lokca
            <Link href="/ochrana-osobnych-udajov">Ochrana osobných údajov</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
