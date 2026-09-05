import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Archív oznamov – Farnosť Lokca' };

export default function OznamyArchivPage() {
  const oznamy = getDb()
    .prepare('SELECT * FROM oznamy WHERE published = 1 ORDER BY created_at DESC')
    .all();

  return (
    <>
      <h1 className="page-title">Archív oznamov</h1>
      <div className="entry">
        {oznamy.map((o) => (
          <div className="oznam-item" key={o.id}>
            {o.week_label && <div className="oznam-week">{o.week_label}</div>}
            <div className="oznam-title">{o.title}</div>
            <div dangerouslySetInnerHTML={{ __html: o.content }} />
            {o.attachment && (
              <a className="attachment-link" href={o.attachment} target="_blank" rel="noopener noreferrer">
                Stiahnuť prílohu
              </a>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
