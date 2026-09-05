'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { NAV } from '@/lib/nav';

function itemHref(item) {
  if (item.href) return item.href;
  if (item.slug) return `/${item.slug}`;
  return '#';
}

/** True when the current path is this item or any of its descendants. */
function isActive(item, pathname) {
  const href = itemHref(item);
  if (href !== '#' && (href === '/' ? pathname === '/' : pathname.startsWith(href))) return true;
  return (item.children || []).some((c) => isActive(c, pathname));
}

function NavItem({ item, pathname, onNavigate }) {
  const has = item.children && item.children.length > 0;
  return (
    <li className={isActive(item, pathname) ? 'active' : undefined}>
      <Link
        href={itemHref(item)}
        onClick={has ? (e) => e.preventDefault() : onNavigate}
      >
        {item.label} {has ? '▾' : ''}
      </Link>
      {has && (
        <ul className="dropdown">
          {item.children.map((c) => (
            <NavItem key={c.label} item={c} pathname={pathname} onNavigate={onNavigate} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || '/';

  return (
    <nav className={`main-nav${open ? ' open' : ''}`}>
      <button
        className="nav-toggle"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        ☰ Menu
      </button>
      <ul className="nav-list">
        {NAV.map((item) => (
          <NavItem
            key={item.label}
            item={item}
            pathname={pathname}
            onNavigate={() => setOpen(false)}
          />
        ))}
      </ul>
    </nav>
  );
}
