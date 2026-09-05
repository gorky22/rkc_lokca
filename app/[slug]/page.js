import { notFound } from 'next/navigation';
import { getDb } from '@/lib/db';
import EditLink from '@/components/EditLink';

export const dynamic = 'force-dynamic';

export default function ContentPage({ params }) {
  const page = getDb().prepare('SELECT * FROM pages WHERE slug = ?').get(params.slug);
  if (!page) notFound();

  return (
    <div className="container page-block">
      <h1 className="page-title">{page.title}</h1>
      <div className="entry" dangerouslySetInnerHTML={{ __html: page.content }} />
      <EditLink href={`/admin/stranky/${page.slug}`} />
    </div>
  );
}

export function generateMetadata({ params }) {
  const page = getDb().prepare('SELECT title FROM pages WHERE slug = ?').get(params.slug);
  return { title: page ? `${page.title} – Farnosť Lokca` : 'Farnosť Lokca' };
}
