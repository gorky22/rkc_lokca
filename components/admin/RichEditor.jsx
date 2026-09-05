'use client';
import { useRef, useEffect } from 'react';

export default function RichEditor({ value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || '';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function cmd(command, arg = null) {
    document.execCommand(command, false, arg);
    ref.current?.focus();
    onChange(ref.current?.innerHTML || '');
  }

  async function insertImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (res.ok) cmd('insertImage', data.url);
    else alert(data.error || 'Chyba nahrávania');
    e.target.value = '';
  }

  return (
    <div>
      <div className="editor-toolbar">
        <button type="button" onClick={() => cmd('bold')}><b>B</b></button>
        <button type="button" onClick={() => cmd('italic')}><i>I</i></button>
        <button type="button" onClick={() => cmd('underline')}><u>U</u></button>
        <button type="button" onClick={() => cmd('formatBlock', '<h2>')}>Nadpis</button>
        <button type="button" onClick={() => cmd('formatBlock', '<h3>')}>Podnadpis</button>
        <button type="button" onClick={() => cmd('formatBlock', '<p>')}>Odsek</button>
        <button type="button" onClick={() => cmd('insertUnorderedList')}>• Zoznam</button>
        <button type="button" onClick={() => cmd('insertOrderedList')}>1. Zoznam</button>
        <button type="button" onClick={() => { const u = prompt('Adresa odkazu (URL):'); if (u) cmd('createLink', u); }}>Odkaz</button>
        <label style={{ display: 'inline-block' }}>
          <span className="btn secondary" style={{ padding: '4px 10px', fontSize: 12 }}>Obrázok…</span>
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={insertImage} />
        </label>
        <button type="button" onClick={() => cmd('removeFormat')}>Vyčistiť</button>
      </div>
      <div
        ref={ref}
        className="rich-editor"
        contentEditable
        suppressContentEditableWarning
        onInput={() => onChange(ref.current?.innerHTML || '')}
      />
    </div>
  );
}
