'use client';
import { useState } from 'react';

export default function SubscribeBox() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ ok: true, text: data.message });
        setEmail('');
      } else {
        setMsg({ ok: false, text: data.error || 'Nastala chyba.' });
      }
    } catch {
      setMsg({ ok: false, text: 'Nastala chyba. Skúste to prosím neskôr.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="subscribe-box">
      <h3>Odber noviniek</h3>
      <p>Dostávajte nové farské oznamy a aktuality priamo na váš e-mail.</p>
      <form className="subscribe-form" onSubmit={submit}>
        <input
          type="email"
          required
          placeholder="váš e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button disabled={busy}>{busy ? 'Odosielam…' : 'Prihlásiť sa'}</button>
      </form>
      {msg && <div className={`subscribe-msg ${msg.ok ? 'ok' : 'err'}`}>{msg.text}</div>}
    </div>
  );
}
