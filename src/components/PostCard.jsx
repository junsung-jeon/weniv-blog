import { Link } from 'react-router-dom';

const FALLBACK_IMGS = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&auto=format&fit=crop',
];

function formatDate(str) {
  if (!str) return '';
  const d = new Date(str);
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
}

export default function PostCard({ post, searchQuery }) {
  const thumb = post.thumbnail || FALLBACK_IMGS[post.id % FALLBACK_IMGS.length];

  const highlight = (text) => {
    if (!searchQuery || !text) return text;
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    const parts = text.split(regex);
    return parts.map((p, i) =>
      regex.test(p)
        ? <mark key={i} style={{ background: 'none', color: 'var(--primary)', fontWeight: 700 }}>{p}</mark>
        : p
    );
  };

  return (
    <Link to={`/post/${post.id}`} style={styles.card} className="fade-up">
      <div style={styles.thumbWrap}>
        <img src={thumb} alt={post.title} style={styles.thumb}
          onError={e => { e.target.src = FALLBACK_IMGS[0]; }} />
      </div>
      <div style={styles.body}>
        <div style={styles.tags}>
          {(post.category || ['Life', 'Style']).slice(0,2).map((t,i) => (
            <span key={i} style={styles.tag}>{t}</span>
          ))}
        </div>
        <h3 style={styles.title}>{highlight(post.title)}</h3>
        <div style={styles.meta}>
          <span style={styles.author}>{highlight(post.username || post.author)}</span>
          <span style={styles.dot}>·</span>
          <span style={styles.date}>{formatDate(post.created_at || post.createdAt)}</span>
        </div>
        <p style={styles.excerpt}>
          {post.content?.slice(0, 100)}...
        </p>
      </div>
    </Link>
  );
}

const styles = {
  card: {
    background: 'var(--white)', borderRadius: 'var(--radius)',
    overflow: 'hidden', boxShadow: 'var(--shadow-sm)',
    transition: 'transform 0.25s, box-shadow 0.25s',
    display: 'flex', flexDirection: 'column',
    cursor: 'pointer',
    ':hover': { transform: 'translateY(-4px)', boxShadow: 'var(--shadow-md)' },
  },
  thumbWrap: { width: '100%', paddingTop: '62%', position: 'relative', overflow: 'hidden' },
  thumb: {
    position: 'absolute', top: 0, left: 0,
    width: '100%', height: '100%', objectFit: 'cover',
    transition: 'transform 0.4s',
  },
  body: { padding: '16px 18px 20px' },
  tags: { display: 'flex', gap: 6, marginBottom: 8 },
  tag: {
    fontSize: 11, fontWeight: 600, color: 'var(--primary)',
    background: 'var(--primary-light)', padding: '2px 8px',
    borderRadius: 20, textTransform: 'capitalize',
  },
  title: {
    fontSize: 15, fontWeight: 700, lineHeight: 1.45,
    marginBottom: 8, color: 'var(--text-dark)',
    display: '-webkit-box', WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical', overflow: 'hidden',
  },
  meta: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 },
  author: { fontSize: 12, color: 'var(--text-light)', fontWeight: 500 },
  dot: { fontSize: 12, color: 'var(--text-light)' },
  date: { fontSize: 12, color: 'var(--text-light)' },
  excerpt: {
    fontSize: 13, color: 'var(--text-mid)', lineHeight: 1.6,
    display: '-webkit-box', WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical', overflow: 'hidden',
  },
};
