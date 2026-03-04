import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import Footer from '../components/Footer';

const AVATAR_COLORS = ['#3b9edd','#e05252','#52c0a0','#e0952b','#8b52e0'];

export default function MyPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) { navigate('/login'); return null; }

  const colorIdx = user.username.charCodeAt(0) % AVATAR_COLORS.length;

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
        <div style={styles.card} className="fade-up">
          <h2 style={styles.cardTitle}>UPDATE ACCOUNT</h2>

          <div style={styles.avatarWrap}>
            <div style={{ ...styles.avatar, background: AVATAR_COLORS[colorIdx] }}>
              {user.username[0].toUpperCase()}
            </div>
          </div>

          <label style={styles.label}>Username</label>
          <input style={styles.input} defaultValue={user.username} readOnly />

          <p style={styles.note}>계정 정보 수정은 현재 지원되지 않습니다.</p>

          <button style={styles.logoutBtn} onClick={() => { logout(); navigate('/login'); }}>
            로그아웃
          </button>
        </div>
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
  main: {
    flex: 1, display: 'flex', justifyContent: 'flex-end',
    maxWidth: 1100, margin: '0 auto', width: '100%',
    padding: '0 24px 60px',
    marginTop: -160, position: 'relative', zIndex: 10,
  },
  card: {
    background: '#fff', borderRadius: 16, padding: '40px 48px',
    boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth: 480,
    display: 'flex', flexDirection: 'column',
    alignSelf: 'flex-start',
  },
  cardTitle: { fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, letterSpacing: 1, marginBottom: 28, textAlign: 'center' },
  avatarWrap: { display: 'flex', justifyContent: 'center', marginBottom: 28 },
  avatar: {
    width: 88, height: 88, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontWeight: 700, fontSize: 36,
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
  },
  label: { fontSize: 13, fontWeight: 600, marginBottom: 6 },
  input: {
    width: '100%', padding: '11px 14px', borderRadius: 8,
    border: '1.5px solid var(--border)', fontSize: 14,
    marginBottom: 12, background: '#fafafa',
  },
  note: { fontSize: 13, color: 'var(--text-light)', marginBottom: 20, textAlign: 'center' },
  logoutBtn: {
    width: '100%', padding: '13px', borderRadius: 8,
    background: 'var(--danger)', color: '#fff',
    fontSize: 14, fontWeight: 700, cursor: 'pointer',
    border: 'none',
  },
};
