import { getDb } from '@/lib/db';
import EditLink from '@/components/EditLink';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Oznamy – Farnosť Lokca' };

export default function OznamyPage() {
  const oznamy = getDb()
    .prepare('SELECT * FROM oznamy WHERE published = 1 ORDER BY created_at DESC LIMIT 4')
    .all();

  return (
    <div className="container page-block">
      <h1 className="page-title">Oznamy na tento týždeň</h1>
      <div className="entry">
        {oznamy.length === 0 && <p style={{ textAlign: 'center' }}>Momentálne nie sú zverejnené žiadne oznamy.</p>}
        {oznamy.map((o) => (
          <div className="oznam-item" key={o.id}>
            {o.week_label && <div className="oznam-week">{o.week_label}</div>}
            <div className="oznam-title">{o.title}</div>
            <div dangerouslySetInnerHTML={{ __html: o.content }} />
            {o.attachment && (
              <a className="attachment-link" href={o.attachment} target="_blank" rel="noopener noreferrer">
                Stiahnuť oznamy (príloha)
              </a>
            )}
          </div>
        ))}
      </div>
      <EditLink href="/admin/oznamy" />
    </div>
  );
}
