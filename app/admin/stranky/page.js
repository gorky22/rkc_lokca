import Link from 'next/link';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default function AdminPages() {
  const pages = getDb().prepare('SELECT slug, title, updated_at FROM pages ORDER BY title').all();
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Stránky</h2>
        <Link className="btn" href="/admin/stranky/nova">+ Nová stránka</Link>
      </div>
      <table className="admin-table">
        <thead><tr><th>Titulok</th><th>Adresa</th><th>Upravené</th><th></th></tr></thead>
        <tbody>
          {pages.map((p) => (
            <tr key={p.slug}>
              <td>{p.title}</td>
              <td>/{p.slug}</td>
              <td>{p.updated_at?.slice(0, 10)}</td>
              <td><Link href={`/admin/stranky/${p.slug}`}>Upraviť</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
