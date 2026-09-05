import Link from 'next/link';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default function AdminHome() {
  const db = getDb();
  const counts = {
    pages: db.prepare('SELECT COUNT(*) c FROM pages').get().c,
    news: db.prepare('SELECT COUNT(*) c FROM news').get().c,
    oznamy: db.prepare('SELECT COUNT(*) c FROM oznamy').get().c,
    subs: db.prepare('SELECT COUNT(*) c FROM subscribers WHERE confirmed = 1').get().c,
    albums: db.prepare('SELECT COUNT(*) c FROM albums').get().c,
  };
  return (
    <div>
      <p style={{ marginBottom: 24 }}>Vitajte v administrácii stránky farnosti.</p>
      <table className="admin-table">
        <tbody>
          <tr><td>Farské oznamy</td><td>{counts.oznamy}</td><td><Link href="/admin/oznamy">Spravovať</Link></td></tr>
          <tr><td>Aktuality (novinky)</td><td>{counts.news}</td><td><Link href="/admin/aktuality">Spravovať</Link></td></tr>
          <tr><td>Stránky</td><td>{counts.pages}</td><td><Link href="/admin/stranky">Spravovať</Link></td></tr>
          <tr><td>Fotoalbumy</td><td>{counts.albums}</td><td><Link href="/admin/galeria">Spravovať</Link></td></tr>
          <tr><td>Potvrdení odberatelia</td><td>{counts.subs}</td><td><Link href="/admin/odberatelia">Zobraziť</Link></td></tr>
        </tbody>
      </table>
    </div>
  );
}
