import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/blogApi';
import { useAuth } from '../context/AuthContext';
import Hero from '../components/Hero';
import Footer from '../components/Footer';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const valid = form.username.trim() && form.password.trim();

  const handleSubmit = async () => {
    if (!valid || loading) return;
    setLoading(true);
    setError('');
    try {
      const data = await api.login(form);
      login({ username: form.username }, data.access_token || data.token);
      navigate('/');
    } catch (e) {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <Hero>
        <div />
      </Hero>
      <div style={styles.cardWrap}>
        <div style={styles.card} className="fade-up">
          <h2 style={styles.title}>LOGIN</h2>

          <label style={styles.label}>Username</label>
          <input
            style={styles.input}
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
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
            {loading ? '로그인 중...' : 'LOGIN'}
          </button>

          <Link to="/signup" style={styles.link}>Register</Link>
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
    padding: '60px 20px',
    marginTop: -160, position: 'relative', zIndex: 10,
  },
  card: {
    background: '#fff', borderRadius: 16, padding: '48px 48px 40px',
    boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth: 380,
    display: 'flex', flexDirection: 'column',
  },
  title: { fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 900, marginBottom: 28 },
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
    marginBottom: 16, transition: 'opacity 0.2s',
  },
  link: { textAlign: 'right', fontSize: 13, color: 'var(--text-mid)', textDecoration: 'underline' },
};
