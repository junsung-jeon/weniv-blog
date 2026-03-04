import { Link } from 'react-router-dom';

const RANDOM_THUMBS = [
  'https://picsum.photos/seed/w1/400/200',
  'https://picsum.photos/seed/w2/400/200',
  'https://picsum.photos/seed/w3/400/200',
  'https://picsum.photos/seed/w4/400/200',
  'https://picsum.photos/seed/w5/400/200',
  'https://picsum.photos/seed/w6/400/200',
];

function getRandomThumb(id) {
  return RANDOM_THUMBS[id % RANDOM_THUMBS.length];
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function PostCard({ post }) {
  const thumb = post.thumbnail || getRandomThumb(post.id);

  return (
    <Link to={`/post/${post.id}`} className="post-card">
      <img
        className="post-card-thumb"
        src={thumb}
        alt={post.title}
        onError={(e) => {
          e.target.src = getRandomThumb(post.id);
        }}
      />
      <div className="post-card-body">
        <h3 className="post-card-title">{post.title}</h3>
        <div className="post-card-meta">
          <span>{post.author || '익명'}</span>
          <span>{formatDate(post.created_at)}</span>
        </div>
      </div>
    </Link>
  );
}
