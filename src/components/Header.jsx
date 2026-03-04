import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AVATAR_COLORS = ['#3b9edd','#e05252','#52c0a0','#e0952b','#8b52e0'];

export default function Header() {
  const { user, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const colorIdx = user ? user.username.charCodeAt(0) % AVATAR_COLORS.length : 0;

  return (
    <header style={styles.header}>
      <Link to="/" style={styles.logo}>
        <span style={styles.logoIcon}>:)</span>
        <span style={styles.logoText}>My Blog</span>
      </Link>

      <nav style={styles.nav}>
        {isLoggedIn ? (
          <>
            <Link to="/mypage" style={styles.avatarWrap} title={user?.username}>
              <div style={{ ...styles.avatar, background: AVATAR_COLORS[colorIdx] }}>
                {user?.username?.[0]?.toUpperCase()}
              </div>
            </Link>
            <Link to="/write" style={styles.btnWrite}>
              <span>✏️</span> Write
            </Link>
            <button onClick={handleLogout} style={styles.btnLogout}>
              ↩ Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.btnText}>👤 Login</Link>
            <Link to="/signup" style={styles.btnText}>👥 Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

const styles = {
  header: {
    position: 'sticky', top: 0, zIndex: 100,
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--border)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 32px', height: 64,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  logo: { display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 },
  logoIcon: { fontSize: 22, color: 'var(--primary)' },
  logoText: { fontSize: 18, color: 'var(--text-dark)', fontFamily: 'var(--font-body)' },
  nav: { display: 'flex', alignItems: 'center', gap: 12 },
  avatarWrap: { display: 'flex', alignItems: 'center' },
  avatar: {
    width: 34, height: 34, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
  },
  btnWrite: {
    display: 'flex', alignItems: 'center', gap: 6,
    background: 'var(--primary)', color: '#fff',
    padding: '7px 16px', borderRadius: 8,
    fontSize: 14, fontWeight: 600,
    transition: 'background 0.2s',
  },
  btnLogout: {
    color: 'var(--text-mid)', fontSize: 14, fontWeight: 500,
    display: 'flex', alignItems: 'center', gap: 4,
    padding: '6px 10px', borderRadius: 8,
    transition: 'background 0.2s',
  },
  btnText: { color: 'var(--text-mid)', fontSize: 14, fontWeight: 500, padding: '6px 10px' },
};
