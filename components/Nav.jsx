'use client';
import { useState } from 'react';
import Link from 'next/link';
import { NAV } from '@/lib/nav';

function itemHref(item) {
  if (item.href) return item.href;
  if (item.slug) return `/${item.slug}`;
  return '#';
}

function NavItem({ item }) {
  const has = item.children && item.children.length > 0;
  return (
    <li>
      <Link href={itemHref(item)} onClick={has ? (e) => e.preventDefault() : undefined}>
        {item.label} {has ? '▾' : ''}
      </Link>
      {has && (
        <ul className="dropdown">
          {item.children.map((c) => (
            <NavItem key={c.label} item={c} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <nav className={`main-nav${open ? ' open' : ''}`}>
      <button className="nav-toggle" onClick={() => setOpen(!open)}>
        ☰ Menu
      </button>
      <ul className="nav-list">
        {NAV.map((item) => (
          <NavItem key={item.label} item={item} />
        ))}
      </ul>
    </nav>
  );
}
