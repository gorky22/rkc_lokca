'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import RichEditor from '@/components/admin/RichEditor';

export default function EditPage() {
  const { slug } = useParams();
  const isNew = slug === 'nova';
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [pageSlug, setPageSlug] = useState(isNew ? '' : slug);
  const [content, setContent] = useState('');
  const [loaded, setLoaded] = useState(isNew);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (isNew) return;
    fetch(`/api/pages/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        setTitle(d.title || '');
        setContent(d.content || '');
        setLoaded(true);
      });
  }, [slug, isNew]);

  async function save() {
    setMsg(null);
    const res = await fetch('/api/admin/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: pageSlug, title, content }),
    });
    const data = await res.json();
    if (res.ok) {
      setMsg({ ok: true, text: 'Uložené.' });
      if (isNew) router.push(`/admin/stranky/${pageSlug}`);
    } else setMsg({ ok: false, text: data.error });
  }

  if (!loaded) return <p>Načítavam…</p>;

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>{isNew ? 'Nová stránka' : `Úprava: ${title}`}</h2>
      <div className="form-row">
        <label>Titulok</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="form-row">
        <label>Adresa (slug) — napr. „historia“</label>
        <input type="text" value={pageSlug} onChange={(e) => setPageSlug(e.target.value)} disabled={!isNew} />
      </div>
      <div className="form-row">
        <label>Obsah</label>
        <RichEditor value={content} onChange={setContent} />
      </div>
      {msg && <div className={`msg ${msg.ok ? 'ok' : 'err'}`}>{msg.text}</div>}
      <button className="btn" onClick={save}>Uložiť</button>{' '}
      {!isNew && <a className="btn secondary" href={`/${pageSlug}`} target="_blank">Zobraziť stránku</a>}
    </div>
  );
}
