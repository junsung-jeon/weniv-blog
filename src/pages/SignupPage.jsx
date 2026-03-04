import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/blogApi';
import Hero from '../components/Hero';
import Footer from '../components/Footer';

export default function SignupPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const valid = form.username.trim() && form.password.trim();

  const handleSubmit = async () => {
    if (!valid || loading) return;
    setLoading(true);
    setError('');
    try {
      await api.signup(form);
      navigate('/login');
    } catch (e) {
      setError(e.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <Hero><div /></Hero>
      <div style={styles.cardWrap}>
        <div style={styles.card} className="fade-up">
          <h2 style={styles.title}>REGISTER</h2>

          {/* 프로필 아바타 영역 */}
          <div style={styles.avatarSection}>
            <div style={styles.avatar}>
              <span style={{ fontSize: 28, opacity: 0.4 }}>👤</span>
            </div>
          </div>

          <label style={styles.label}>Username</label>
          <input
            style={styles.input}
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            autoFocus
          />

          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            placeholder="6+ characters"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />

          {error && <p style={styles.error}>{error}</p>}

          <button
            style={{ ...styles.btn, opacity: valid ? 1 : 0.5 }}
            onClick={handleSubmit}
            disabled={!valid || loading}
          >
            {loading ? '가입 중...' : 'REGISTER'}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  cardWrap: {
    flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
    padding: '40px 20px',
    marginTop: -160, position: 'relative', zIndex: 10,
  },
  card: {
    background: '#fff', borderRadius: 16, padding: '40px 48px',
    boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth: 380,
    display: 'flex', flexDirection: 'column',
  },
  title: { fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 900, marginBottom: 24 },
  avatarSection: { display: 'flex', justifyContent: 'center', marginBottom: 24 },
  avatar: {
    width: 80, height: 80, borderRadius: '50%',
    background: '#eee', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  label: { fontSize: 13, fontWeight: 600, color: 'var(--text-dark)', marginBottom: 6 },
  input: {
    width: '100%', padding: '11px 14px', borderRadius: 8,
    border: '1.5px solid var(--border)', fontSize: 14, outline: 'none',
    marginBottom: 16, transition: 'border-color 0.2s',
  },
  error: { color: 'var(--danger)', fontSize: 13, marginBottom: 12, textAlign: 'center' },
  btn: {
    width: '100%', padding: '13px', borderRadius: 8,
    background: 'var(--primary)', color: '#fff',
    fontSize: 15, fontWeight: 700, letterSpacing: 1,
    transition: 'opacity 0.2s',
  },
};
