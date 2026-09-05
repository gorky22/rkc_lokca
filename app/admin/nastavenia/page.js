'use client';
import { useEffect, useState } from 'react';

export default function AdminSettings() {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    fetch('/api/settings').then((r) => r.json()).then((d) => {
      setQuote(d.home_quote || '');
      setAuthor(d.home_quote_author || '');
    });
  }, []);

  async function save() {
    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ home_quote: quote, home_quote_author: author }),
    });
    setMsg(res.ok ? { ok: true, text: 'Uložené.' } : { ok: false, text: 'Chyba.' });
  }

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Nastavenia úvodnej stránky</h2>
      <div className="form-row">
        <label>Citát na úvodnej stránke</label>
        <textarea style={{ minHeight: 140 }} value={quote} onChange={(e) => setQuote(e.target.value)} />
      </div>
      <div className="form-row">
        <label>Autor citátu</label>
        <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} />
      </div>
      {msg && <div className={`msg ${msg.ok ? 'ok' : 'err'}`}>{msg.text}</div>}
      <button className="btn" onClick={save}>Uložiť</button>
    </div>
  );
}
