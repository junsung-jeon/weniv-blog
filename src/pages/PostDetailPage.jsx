import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/blogApi';
import { useAuth } from '../context/AuthContext';
import AISummary from '../components/AISummary';
import ConfirmModal from '../components/ConfirmModal';
import Hero from '../components/Hero';
import Footer from '../components/Footer';

const FALLBACK_IMGS = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1200&auto=format&fit=crop',
];

function formatDate(str) {
  if (!str) return '';
  const d = new Date(str);
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
}

const AVATAR_COLORS = ['#3b9edd','#e05252','#52c0a0','#e0952b','#8b52e0'];

export default function PostDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    api.getPost(id)
      .then(setPost)
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    await api.deletePost(id);
    navigate('/');
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <div style={styles.spinner} />
    </div>
  );
  if (!post) return null;

  const isOwner = user && (user.username === post.username || user.username === post.author);
  const thumb = post.thumbnail || FALLBACK_IMGS[post.id % FALLBACK_IMGS.length];
  const authorColor = (post.username || post.author || '').charCodeAt(0) % AVATAR_COLORS.length;

  const now = new Date();
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['Jan.','Feb.','Mar.','Apr.','May','Jun.','Jul.','Aug.','Sep.','Oct.','Nov.','Dec.'];

  return (
    <div style={styles.page}>
      <Hero>
        <div style={styles.heroDate}>
          <p style={styles.heroMonth}>{months[now.getMonth()]}</p>
          <p style={styles.heroDay}>{now.getDate()}</p>
          <p style={styles.heroDow}>{days[now.getDay()]}</p>
        </div>
      </Hero>

      <div style={styles.main}>
        <div style={styles.card} className="fade-up">
          {/* 상단 메타 */}
          <div style={styles.metaRow}>
            <Link to="/" style={styles.back}>‹</Link>
            <div style={styles.authorInfo}>
              <div style={{ ...styles.miniAvatar, background: AVATAR_COLORS[authorColor] }}>
                {(post.username || post.author || '?')[0]?.toUpperCase()}
              </div>
              <span style={styles.authorName}>{post.username || post.author}</span>
              <span style={styles.sep}>|</span>
              <span style={styles.date}>{formatDate(post.created_at || post.createdAt)}</span>
            </div>
            {isOwner && (
              <div style={styles.actions}>
                <Link to={`/edit/${id}`} style={styles.editBtn}>✏️</Link>
                <button style={styles.delBtn} onClick={() => setShowModal(true)}>🗑️</button>
              </div>
            )}
          </div>

          {/* 태그 */}
          {post.category && (
            <div style={styles.tags}>
              {(Array.isArray(post.category) ? post.category : [post.category]).map((t,i) => (
                <span key={i} style={styles.tag}>{t}</span>
              ))}
            </div>
          )}

          {/* 제목 */}
          <h1 style={styles.title}>{post.title}</h1>
          <hr style={styles.divider} />

          {/* AI 요약 */}
          {post.content && <AISummary content={post.content} />}

          {/* 본문 */}
          <div style={styles.content}>{post.content}</div>

          {/* 썸네일 */}
          <img src={thumb} alt="" style={styles.img}
            onError={e => { e.target.src = FALLBACK_IMGS[0]; }} />
        </div>
      </div>

      {showModal && (
        <ConfirmModal
          message="정말로 이 포스트를 삭제할까요?"
          onConfirm={handleDelete}
          onCancel={() => setShowModal(false)}
        />
      )}
      <Footer />
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  heroDate: { color: '#fff' },
  heroMonth: { fontSize: 22, fontWeight: 500, opacity: 0.9 },
  heroDay: { fontSize: 80, fontWeight: 900, lineHeight: 1, fontFamily: 'var(--font-display)' },
  heroDow: { fontSize: 22, fontWeight: 400 },
  main: {
    flex: 1, maxWidth: 960, margin: '0 auto', width: '100%',
    padding: '0 24px 60px',
    marginTop: -80, position: 'relative', zIndex: 10,
  },
  card: {
    background: '#fff', borderRadius: 16, padding: '32px 48px',
    boxShadow: 'var(--shadow-lg)',
  },
  metaRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 },
  back: {
    fontSize: 28, color: 'var(--text-mid)', lineHeight: 1,
    display: 'flex', alignItems: 'center',
  },
  authorInfo: { display: 'flex', alignItems: 'center', gap: 8, flex: 1 },
  miniAvatar: {
    width: 32, height: 32, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontWeight: 700, fontSize: 13,
  },
  authorName: { fontSize: 14, fontWeight: 600 },
  sep: { color: 'var(--text-light)', fontSize: 12 },
  date: { fontSize: 13, color: 'var(--text-light)' },
  actions: { display: 'flex', gap: 8 },
  editBtn: { fontSize: 18, padding: '4px 8px', borderRadius: 6, background: '#f5f5f5' },
  delBtn: { fontSize: 18, padding: '4px 8px', borderRadius: 6, background: '#fff5f5', border: 'none', cursor: 'pointer' },
  tags: { display: 'flex', gap: 6, marginBottom: 12 },
  tag: { fontSize: 12, fontWeight: 600, color: 'var(--primary)', background: 'var(--primary-light)', padding: '3px 10px', borderRadius: 20 },
  title: { fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, lineHeight: 1.4, marginBottom: 16 },
  divider: { border: 'none', borderTop: '1px solid var(--border)', marginBottom: 24 },
  content: { fontSize: 15, lineHeight: 1.9, color: 'var(--text-dark)', whiteSpace: 'pre-wrap', marginBottom: 32 },
  img: { width: '100%', borderRadius: 12, objectFit: 'cover', maxHeight: 480 },
  spinner: { width: 36, height: 36, border: '4px solid #e0e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
};
