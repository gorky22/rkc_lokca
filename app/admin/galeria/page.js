'use client';
import { useEffect, useState } from 'react';

export default function AdminGallery() {
  const [albums, setAlbums] = useState([]);
  const [title, setTitle] = useState('');
  const [openAlbum, setOpenAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  function load() {
    fetch('/api/gallery/list').then((r) => r.json()).then(setAlbums);
  }
  useEffect(load, []);

  async function createAlbum() {
    if (!title.trim()) return;
    const res = await fetch('/api/admin/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'createAlbum', title }),
    });
    if (res.ok) {
      setTitle('');
      load();
    }
  }

  async function openPhotos(album) {
    setOpenAlbum(album);
    const res = await fetch(`/api/gallery/photos?album=${album.id}`);
    setPhotos(await res.json());
  }

  async function uploadPhotos(e) {
    const files = [...(e.target.files || [])];
    if (!files.length) return;
    setBusy(true);
    for (const file of files) {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok) {
        await fetch('/api/admin/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'addPhoto', albumId: openAlbum.id, src: data.url }),
        });
      }
    }
    setBusy(false);
    openPhotos(openAlbum);
    e.target.value = '';
  }

  async function delPhoto(id) {
    await fetch('/api/admin/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deletePhoto', id }),
    });
    openPhotos(openAlbum);
  }

  async function delAlbum(id) {
    if (!confirm('Vymazať album aj s fotkami?')) return;
    await fetch('/api/admin/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deleteAlbum', id }),
    });
    setOpenAlbum(null);
    load();
  }

  if (openAlbum) {
    return (
      <div>
        <h2 style={{ marginBottom: 20 }}>Album: {openAlbum.title}</h2>
        <div className="form-row">
          <label>Pridať fotografie (možno vybrať viac naraz)</label>
          <input type="file" accept="image/*" multiple onChange={uploadPhotos} disabled={busy} />
          {busy && <p>Nahrávam…</p>}
        </div>
        <div className="photo-grid" style={{ marginTop: 20 }}>
          {photos.map((p) => (
            <div key={p.id} style={{ position: 'relative' }}>
              <img src={p.src} alt="" />
              <button
                className="btn danger"
                style={{ position: 'absolute', top: 6, right: 6, padding: '4px 10px' }}
                onClick={() => delPhoto(p.id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 24 }}>
          <button className="btn secondary" onClick={() => setOpenAlbum(null)}>← Späť na albumy</button>{' '}
          <button className="btn danger" onClick={() => delAlbum(openAlbum.id)}>Vymazať album</button>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Fotogaléria</h2>
      <div className="form-row" style={{ display: 'flex', gap: 10 }}>
        <input type="text" placeholder="Názov nového albumu" value={title} onChange={(e) => setTitle(e.target.value)} />
        <button className="btn" onClick={createAlbum}>Vytvoriť album</button>
      </div>
      {msg && <div className={`msg ${msg.ok ? 'ok' : 'err'}`}>{msg.text}</div>}
      <table className="admin-table">
        <thead><tr><th>Album</th><th>Fotiek</th><th></th></tr></thead>
        <tbody>
          {albums.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.cnt}</td>
              <td><a href="#" onClick={(e) => { e.preventDefault(); openPhotos(a); }}>Spravovať fotky</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
