import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default function AdminSubscribers() {
  const subs = getDb().prepare('SELECT email, confirmed, created_at FROM subscribers ORDER BY created_at DESC').all();
  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Odberatelia ({subs.filter((s) => s.confirmed).length} potvrdených)</h2>
      <table className="admin-table">
        <thead><tr><th>E-mail</th><th>Stav</th><th>Prihlásený</th></tr></thead>
        <tbody>
          {subs.map((s) => (
            <tr key={s.email}>
              <td>{s.email}</td>
              <td>{s.confirmed ? 'potvrdený' : 'čaká na potvrdenie'}</td>
              <td>{s.created_at?.slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
