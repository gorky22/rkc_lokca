import Link from 'next/link';
import { SHORTCUTS } from '@/lib/site';

/** Four quick entry points directly under the hero. */
export default function Shortcuts() {
  return (
    <div className="shortcuts container">
      {SHORTCUTS.map((s) => (
        <Link key={s.href} href={s.href} className="shortcut">
          <span className="shortcut-label">{s.label}</span>
          <span className="shortcut-note">{s.note}</span>
        </Link>
      ))}
    </div>
  );
}
