export default function Footer() {
  return (
    <footer style={styles.footer}>
      <span>©Wenaiv Corp.</span>
      <button style={styles.top} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        ↑<br/><span style={{ fontSize: 10 }}>TOP</span>
      </button>
    </footer>
  );
}

const styles = {
  footer: {
    background: '#fff', borderTop: '1px solid var(--border)',
    padding: '20px 40px', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    position: 'relative', fontSize: 13, color: 'var(--text-light)',
  },
  top: {
    position: 'fixed', bottom: 24, right: 24,
    background: 'var(--primary)', color: '#fff',
    width: 48, height: 48, borderRadius: 8,
    fontSize: 14, fontWeight: 700, lineHeight: 1.2,
    boxShadow: 'var(--shadow-md)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', border: 'none',
  },
};
