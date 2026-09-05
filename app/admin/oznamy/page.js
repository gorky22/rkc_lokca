'use client';
import { useEffect, useState } from 'react';
import RichEditor from '@/components/admin/RichEditor';

export default function AdminOznamy() {
  const [list, setList] = useState([]);
  const [editing, setEditing] = useState(null); // null | {} | row
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  function load() {
    fetch('/api/oznamy/list').then((r) => r.json()).then(setList);
  }
  useEffect(load, []);

  async function save(notify) {
    setBusy(true);
    setMsg(null);
    const res = await fetch('/api/admin/oznamy', {
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
    if (!confirm('Naozaj vymazať tento oznam?')) return;
    await fetch('/api/admin/oznamy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id }),
    });
    load();
  }

  async function uploadAttachment(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (res.ok) setEditing({ ...editing, attachment: data.url });
    else alert(data.error);
    e.target.value = '';
  }

  if (editing) {
    return (
      <div>
        <h2 style={{ marginBottom: 20 }}>{editing.id ? 'Úprava oznamu' : 'Nový oznam'}</h2>
        <div className="form-row">
          <label>Titulok (napr. „Oznamy na 14. nedeľu v cezročnom období“)</label>
          <input type="text" value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
        </div>
        <div className="form-row">
          <label>Týždeň / obdobie (napr. „7. 7. – 13. 7. 2026“)</label>
          <input type="text" value={editing.week_label || ''} onChange={(e) => setEditing({ ...editing, week_label: e.target.value })} />
        </div>
        <div className="form-row">
          <label>Obsah oznamov</label>
          <RichEditor value={editing.content || ''} onChange={(v) => setEditing({ ...editing, content: v })} />
        </div>
        <div className="form-row">
          <label>Príloha (PDF / obrázok / dokument)</label>
          {editing.attachment ? (
            <p>
              <a href={editing.attachment} target="_blank">{editing.attachment}</a>{' '}
              <button className="btn secondary" onClick={() => setEditing({ ...editing, attachment: '' })}>Odstrániť</button>
            </p>
          ) : (
            <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={uploadAttachment} />
          )}
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
        <h2>Farské oznamy</h2>
        <button className="btn" onClick={() => setEditing({})}>+ Nový oznam</button>
      </div>
      {msg && <div className={`msg ${msg.ok ? 'ok' : 'err'}`}>{msg.text}</div>}
      <table className="admin-table">
        <thead><tr><th>Titulok</th><th>Týždeň</th><th>Dátum</th><th></th><th></th></tr></thead>
        <tbody>
          {list.map((o) => (
            <tr key={o.id}>
              <td>{o.title}</td>
              <td>{o.week_label}</td>
              <td>{o.created_at?.slice(0, 10)}</td>
              <td><a href="#" onClick={(e) => { e.preventDefault(); setEditing(o); }}>Upraviť</a></td>
              <td><a href="#" onClick={(e) => { e.preventDefault(); del(o.id); }}>Vymazať</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
