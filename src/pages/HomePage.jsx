import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/blogApi';
import PostCard from '../components/PostCard';
import Hero from '../components/Hero';
import Footer from '../components/Footer';

const AVATAR_COLORS = ['#3b9edd','#e05252','#52c0a0','#e0952b','#8b52e0'];

export default function HomePage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getPosts()
      .then(data => {
        console.log('API 응답:', data);
        setPosts(Array.isArray(data) ? data : []);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = posts.filter(p =>
    !search ||
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    (p.username || p.author)?.toLowerCase().includes(search.toLowerCase())
  );

  const colorIdx = user ? user.username?.charCodeAt(0) % AVATAR_COLORS.length : 0;

  return (
    <div style={styles.page}>
      <Hero>
        <p style={styles.heroSub}>React & Node</p>
        <h1 style={styles.heroTitle}>My BLOG</h1>
        <p style={styles.heroDesc}>
          Lorem, ipsum dolor sit amet consectetur adipisicing<br/>
          elit. Iste error quibusdam ipsa quis quidem.
        </p>
      </Hero>

      <div style={styles.main}>
        {/* 왼쪽 사이드바 */}
        <aside style={styles.sidebar}>
          <div style={styles.aboutSection}>
            <p style={styles.sideLabel}>ABOUT ME</p>
            <div style={{ ...styles.bigAvatar, background: user ? AVATAR_COLORS[colorIdx] : '#ccc' }}>
              {user?.username?.[0]?.toUpperCase() || '?'}
            </div>
            <p style={styles.sideUsername}>{user?.username || 'Guest'}</p>
            <p style={styles.sideBio}>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
          </div>

          <div style={styles.catSection}>
            <p style={styles.sideLabel}>CATEGORIES</p>
            <div style={styles.cats}>
              {['Life','Style','Tech','Music','Sport','Photo','Develop'].map(c => (
                <span key={c} style={styles.catChip}>{c}</span>
              ))}
            </div>
          </div>

          <div style={styles.followSection}>
            <p style={styles.sideLabel}>FOLLOW</p>
            <div style={styles.socials}>
              {['f','t','◎','⊕'].map((s, i) => (
                <button key={i} style={styles.socialBtn}>{s}</button>
              ))}
            </div>
          </div>
        </aside>

        {/* 오른쪽 포스트 목록 */}
        <main style={styles.content}>
          {/* 검색 */}
          <div style={styles.searchWrap}>
            <input
              style={styles.searchInput}
              placeholder="🔍  제목 또는 작성자로 검색..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div style={styles.empty}>
              <div style={styles.spinner} />
            </div>
          ) : filtered.length === 0 ? (
            <div style={styles.empty}>
              <p style={styles.emptyText}>
                {search ? '검색 결과가 없습니다.' : '아직 작성된 글이 없습니다.'}
              </p>
            </div>
          ) : (
            <div style={styles.grid}>
              {filtered.map((post, i) => {
                const postId = post.id ?? post.post_id ?? post.blog_id ?? post._id ?? i;
                return (
                  <div key={postId} style={{ animationDelay: `${i * 0.06}s` }}>
                    <PostCard post={post} searchQuery={search} />
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  heroSub: { fontSize: 12, letterSpacing: 3, opacity: 0.7, marginBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: 8, display: 'inline-block' },
  heroTitle: { fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 900, lineHeight: 1, marginBottom: 16 },
  heroDesc: { fontSize: 13, opacity: 0.75, lineHeight: 1.7 },
  main: { display: 'flex', gap: 0, maxWidth: 1100, margin: '0 auto', width: '100%', padding: '0 0 60px', flex: 1 },
  sidebar: {
    width: 220, flexShrink: 0,
    background: '#fff', borderRadius: 16,
    margin: '-60px 24px 0 0', padding: '28px 20px',
    boxShadow: 'var(--shadow-md)', alignSelf: 'flex-start',
    position: 'sticky', top: 80,
    display: 'flex', flexDirection: 'column', gap: 28,
  },
  aboutSection: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 },
  sideLabel: { fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'var(--text-dark)', textDecoration: 'underline', marginBottom: 4 },
  bigAvatar: {
    width: 72, height: 72, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontWeight: 700, fontSize: 28,
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
  },
  sideUsername: { fontSize: 16, fontWeight: 700 },
  sideBio: { fontSize: 12, color: 'var(--text-light)', textAlign: 'center', lineHeight: 1.6 },
  catSection: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 },
  cats: { display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' },
  catChip: {
    fontSize: 12, padding: '4px 12px', borderRadius: 20,
    border: '1px solid var(--border)', color: 'var(--text-mid)',
    cursor: 'pointer',
  },
  followSection: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 },
  socials: { display: 'flex', gap: 10 },
  socialBtn: {
    width: 32, height: 32, borderRadius: '50%',
    border: '1px solid var(--border)', fontSize: 14,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', color: 'var(--text-dark)',
  },
  content: { flex: 1, paddingTop: 32 },
  searchWrap: { marginBottom: 24 },
  searchInput: {
    width: '100%', padding: '12px 18px', borderRadius: 10,
    border: '1px solid var(--border)', fontSize: 14,
    background: '#fff', outline: 'none',
    boxShadow: 'var(--shadow-sm)',
    transition: 'border-color 0.2s',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 20,
  },
  empty: { display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px 0' },
  emptyText: { color: 'var(--text-light)', fontSize: 15 },
  spinner: {
    width: 36, height: 36, border: '4px solid #e0e8f0',
    borderTopColor: 'var(--primary)', borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
};
