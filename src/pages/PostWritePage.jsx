import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/blogApi';
import { useAuth } from '../context/AuthContext';
import Hero from '../components/Hero';
import Footer from '../components/Footer';

export default function PostWritePage({ isEdit }) {
  const { id } = useParams();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) { navigate('/login'); return; }
    if (isEdit && id) {
      setLoading(true);
      api.getPost(id).then(p => {
        setForm({ title: p.title || '', content: p.content || '' });
      }).finally(() => setLoading(false));
    }
  }, [id]);

  const valid = form.title.trim() && form.content.trim();

  const handleSave = async () => {
    if (!valid || saving) return;
    setSaving(true);
    try {
      if (isEdit) {
        await api.updatePost(id, form);
        navigate(`/post/${id}`);
      } else {
        const res = await api.createPost(form);
        navigate(`/post/${res.id || res.post_id || ''}`);
      }
    } catch (e) {
      alert(e.message || '저장 실패');
    } finally {
      setSaving(false);
    }
  };

  const now = new Date();
  const months = ['Jan.','Feb.','Mar.','Apr.','May','Jun.','Jul.','Aug.','Sep.','Oct.','Nov.','Dec.'];
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

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
          <div style={styles.toolbar}>
            <button style={styles.backBtn} onClick={() => navigate(-1)}>‹</button>
            <input
              style={styles.titleInput}
              placeholder="Title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              disabled={loading}
            />
            <div style={styles.toolActions}>
              <button style={styles.delBtn} onClick={() => setForm({ title: '', content: '' })}>🗑️</button>
              <button
                style={{ ...styles.saveBtn, opacity: valid ? 1 : 0.4 }}
                onClick={handleSave}
                disabled={!valid || saving}
              >
                💾 {saving ? '저장 중...' : (isEdit ? 'Update' : 'Save')}
              </button>
            </div>
          </div>

          <textarea
            style={styles.textarea}
            placeholder="Tell your story..."
            value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })}
            disabled={loading}
          />
        </div>
      </div>
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
    background: '#fff', borderRadius: 16,
    boxShadow: 'var(--shadow-lg)', overflow: 'hidden',
    minHeight: 520,
    display: 'flex', flexDirection: 'column',
  },
  toolbar: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '20px 24px', borderBottom: '1px solid var(--border)',
  },
  backBtn: { fontSize: 24, color: 'var(--text-mid)', cursor: 'pointer', background: 'none', border: 'none', lineHeight: 1 },
  titleInput: {
    flex: 1, border: 'none', outline: 'none',
    fontSize: 18, fontWeight: 600, color: 'var(--text-dark)',
    fontFamily: 'var(--font-body)',
  },
  toolActions: { display: 'flex', gap: 8, alignItems: 'center' },
  delBtn: { fontSize: 18, padding: '4px 8px', borderRadius: 6, background: '#fff5f5', border: 'none', cursor: 'pointer' },
  saveBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    background: '#fff', border: '1.5px solid var(--border)',
    borderRadius: 8, padding: '8px 16px',
    fontSize: 14, fontWeight: 600, cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  textarea: {
    flex: 1, border: 'none', outline: 'none', resize: 'none',
    padding: '24px 28px', fontSize: 15, lineHeight: 1.8,
    color: 'var(--text-dark)', fontFamily: 'var(--font-body)',
    minHeight: 400,
  },
};
