'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminShell({ children }) {
  const [state, setState] = useState('loading'); // loading | login | ok
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => setState(d.isAdmin ? 'ok' : 'login'))
      .catch(() => setState('login'));
  }, []);

  async function login(e) {
    e.preventDefault();
    setErr('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) setState('ok');
    else setErr((await res.json()).error || 'Chyba prihlásenia');
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setState('login');
  }

  if (state === 'loading') return <div className="admin-wrap">Načítavam…</div>;

  if (state === 'login') {
    return (
      <div className="admin-wrap" style={{ maxWidth: 420 }}>
        <h1 style={{ marginBottom: 24 }}>Administrácia</h1>
        <form onSubmit={login}>
          <div className="form-row">
            <label>Heslo</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus />
          </div>
          {err && <div className="msg err">{err}</div>}
          <button className="btn">Prihlásiť sa</button>
        </form>
      </div>
    );
  }

  const links = [
    ['/admin', 'Prehľad'],
    ['/admin/oznamy', 'Oznamy'],
    ['/admin/aktuality', 'Aktuality'],
    ['/admin/stranky', 'Stránky'],
    ['/admin/galeria', 'Galéria'],
    ['/admin/odberatelia', 'Odberatelia'],
    ['/admin/nastavenia', 'Nastavenia'],
  ];

  return (
    <div className="admin-wrap">
      <div className="admin-top">
        <h1>Administrácia</h1>
        <div className="admin-nav">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className={pathname === href ? 'on' : ''}>
              {label}
            </Link>
          ))}
          <a href="/" target="_blank">Zobraziť web ↗</a>
          <a href="#" onClick={(e) => { e.preventDefault(); logout(); }}>Odhlásiť</a>
        </div>
      </div>
      {children}
    </div>
  );
}
