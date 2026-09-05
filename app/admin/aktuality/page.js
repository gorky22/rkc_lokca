'use client';
import { useEffect, useState } from 'react';
import RichEditor from '@/components/admin/RichEditor';

export default function AdminNews() {
  const [list, setList] = useState([]);
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  function load() {
    fetch('/api/news/list').then((r) => r.json()).then(setList);
  }
  useEffect(load, []);

  async function save(notify) {
    setBusy(true);
    setMsg(null);
    const res = await fetch('/api/admin/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editing, notify }),
    });
    const data = await res.json();
    setBusy(false);
    if (res.ok) {
      let text = 'Uložené.';
      if (notify) {
        text += data.mailError
          ? ` E-maily sa nepodarilo odoslať: ${data.mailError}`
          : ` Odoslané ${data.sent} odberateľom.`;
      }
      setMsg({ ok: !data.mailError, text });
      setEditing(null);
      load();
    } else setMsg({ ok: false, text: data.error });
  }

  async function del(id) {
    if (!confirm('Naozaj vymazať tento článok?')) return;
    await fetch('/api/admin/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id }),
    });
    load();
  }

  async function uploadImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (res.ok) setEditing({ ...editing, image: data.url });
    else alert(data.error);
    e.target.value = '';
  }

  if (editing) {
    return (
      <div>
        <h2 style={{ marginBottom: 20 }}>{editing.id ? 'Úprava článku' : 'Nový článok'}</h2>
        <div className="form-row">
          <label>Titulok</label>
          <input type="text" value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
        </div>
        <div className="form-row">
          <label>Úvodný obrázok</label>
          {editing.image ? (
            <p>
              <img src={editing.image} style={{ maxHeight: 120 }} alt="" />{' '}
              <button className="btn secondary" onClick={() => setEditing({ ...editing, image: '' })}>Odstrániť</button>
            </p>
          ) : (
            <input type="file" accept="image/*" onChange={uploadImage} />
          )}
        </div>
        <div className="form-row">
          <label>Obsah</label>
          <RichEditor value={editing.content || ''} onChange={(v) => setEditing({ ...editing, content: v })} />
        </div>
        {msg && <div className={`msg ${msg.ok ? 'ok' : 'err'}`}>{msg.text}</div>}
        <button className="btn" disabled={busy} onClick={() => save(false)}>Uložiť</button>{' '}
        <button className="btn" disabled={busy} onClick={() => save(true)}>Uložiť a poslať odberateľom</button>{' '}
        <button className="btn secondary" onClick={() => setEditing(null)}>Zrušiť</button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Aktuality</h2>
        <button className="btn" onClick={() => setEditing({})}>+ Nový článok</button>
      </div>
      {msg && <div className={`msg ${msg.ok ? 'ok' : 'err'}`}>{msg.text}</div>}
      <table className="admin-table">
        <thead><tr><th>Titulok</th><th>Dátum</th><th></th><th></th></tr></thead>
        <tbody>
          {list.map((n) => (
            <tr key={n.id}>
              <td>{n.title}</td>
              <td>{n.created_at?.slice(0, 10)}</td>
              <td><a href="#" onClick={(e) => { e.preventDefault(); setEditing(n); }}>Upraviť</a></td>
              <td><a href="#" onClick={(e) => { e.preventDefault(); del(n.id); }}>Vymazať</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
