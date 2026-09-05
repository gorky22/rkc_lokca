'use client';
import { useEffect, useState } from 'react';

const FIELDS = [
  { key: 'home_quote', label: 'Citát na úvodnej stránke', type: 'textarea' },
  { key: 'home_quote_author', label: 'Autor citátu', type: 'text' },
  { key: 'live_url', label: 'Odkaz na priamy prenos (Sv. omša naživo)', type: 'text' },
  { key: 'contact_phone', label: 'Telefón', type: 'text' },
  { key: 'contact_email', label: 'E-mail', type: 'text' },
  { key: 'contact_address', label: 'Adresa', type: 'text' },
];

export default function AdminSettings() {
  const [values, setValues] = useState({});
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => setValues(d))
      .catch(() => setMsg({ ok: false, text: 'Nastavenia sa nepodarilo načítať.' }));
  }, []);

  function update(key, value) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    setBusy(true);
    setMsg(null);
    try {
      const payload = Object.fromEntries(FIELDS.map((f) => [f.key, values[f.key] || '']));
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      setMsg(res.ok ? { ok: true, text: 'Uložené.' } : { ok: false, text: data.error || 'Chyba pri ukladaní.' });
    } catch {
      setMsg({ ok: false, text: 'Chyba pri ukladaní.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Nastavenia stránky</h2>

      {FIELDS.map((f) => (
        <div className="form-row" key={f.key}>
          <label>{f.label}</label>
          {f.type === 'textarea' ? (
            <textarea
              style={{ minHeight: 140 }}
              value={values[f.key] || ''}
              onChange={(e) => update(f.key, e.target.value)}
            />
          ) : (
            <input type="text" value={values[f.key] || ''} onChange={(e) => update(f.key, e.target.value)} />
          )}
        </div>
      ))}

      {msg && <div className={`msg ${msg.ok ? 'ok' : 'err'}`}>{msg.text}</div>}
      <button className="btn" onClick={save} disabled={busy}>
        {busy ? 'Ukladám…' : 'Uložiť'}
      </button>
    </div>
  );
}
