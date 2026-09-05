import { notFound } from 'next/navigation';
import { getDb } from '@/lib/db';
import EditLink from '@/components/EditLink';

export const dynamic = 'force-dynamic';

export default function NewsPost({ params }) {
  const post = getDb().prepare('SELECT * FROM news WHERE slug = ? AND published = 1').get(params.slug);
  if (!post) notFound();

  return (
    <div className="container page-block">
      <h1 className="page-title">{post.title}</h1>
      <div className="entry">
        <p style={{ textAlign: 'center', color: '#888' }}>
          {new Date(post.created_at).toLocaleDateString('sk-SK')}
        </p>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
      <EditLink href={`/admin/aktuality/${post.id}`} />
    </div>
  );
}

export function generateMetadata({ params }) {
  const post = getDb().prepare('SELECT title FROM news WHERE slug = ?').get(params.slug);
  return { title: post ? `${post.title} – Farnosť Lokca` : 'Farnosť Lokca' };
}
