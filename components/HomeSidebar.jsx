import Link from 'next/link';
import { getDb, getSetting } from '@/lib/db';
import { excerpt } from '@/lib/text';
import { QUICK_LINKS, LIVE_URL } from '@/lib/site';

/** Right-hand column of the home page: oznamy, live stream and useful links. */
export default function HomeSidebar() {
  const oznam = getDb()
    .prepare('SELECT * FROM oznamy WHERE published = 1 ORDER BY created_at DESC LIMIT 1')
    .get();
  const liveUrl = getSetting('live_url', LIVE_URL);

  return (
    <aside className="home-aside">
      <section className="aside-card">
        <h3 className="aside-title">Najnovšie oznamy</h3>
        {oznam ? (
          <>
            {oznam.week_label && <div className="oznam-week">{oznam.week_label}</div>}
            <div className="aside-heading">{oznam.title}</div>
            <p className="aside-text">{excerpt(oznam.content, 220)}</p>
            <div className="aside-actions">
              <Link className="btn btn-outline" href="/oznamy">Čítať oznamy</Link>
              {oznam.attachment && (
                <a className="btn btn-quiet" href={oznam.attachment} target="_blank" rel="noopener noreferrer">
                  Príloha
                </a>
              )}
            </div>
          </>
        ) : (
          <p className="aside-text">Momentálne nie sú zverejnené žiadne oznamy.</p>
        )}
      </section>

      <section className="aside-card aside-live">
        <h3 className="aside-title">Sv. omša naživo</h3>
        <p className="aside-text">
          Prenosy svätých omší a pobožností z farského kostola sledujte na našom YouTube kanáli.
        </p>
        <a className="btn btn-live-full" href={liveUrl} target="_blank" rel="noopener noreferrer">
          <span className="live-dot" aria-hidden="true" />
          Sledovať prenos
        </a>
      </section>

      <section className="aside-card">
        <h3 className="aside-title">Zaujímavé odkazy</h3>
        <ul className="link-list">
          {QUICK_LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
