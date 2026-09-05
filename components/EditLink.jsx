'use client';
import { useEffect, useState } from 'react';

/**
 * Shows a small floating "Upraviť" button when the admin is logged in.
 * This gives on-site editing: browse the site, click edit on any page.
 */
export default function EditLink({ href }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => setIsAdmin(!!d.isAdmin))
      .catch(() => {});
  }, []);

  if (!isAdmin) return null;

  return (
    <a
      href={href}
      style={{
        position: 'fixed',
        right: 24,
        bottom: 24,
        background: '#1a1a1a',
        color: '#fff',
        padding: '12px 22px',
        fontSize: 13,
        letterSpacing: 2,
        textTransform: 'uppercase',
        zIndex: 100,
      }}
    >
      ✎ Upraviť
    </a>
  );
}
