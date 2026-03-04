export default function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div style={styles.overlay} onClick={onCancel}>
      <div style={styles.modal} onClick={e => e.stopPropagation()} className="fade-up">
        <p style={styles.msg}>{message}</p>
        <div style={styles.btns}>
          <button style={styles.cancel} onClick={onCancel}>취소</button>
          <button style={styles.confirm} onClick={onConfirm}>삭제</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, animation: 'fadeIn 0.2s ease',
  },
  modal: {
    background: '#fff', borderRadius: 16, padding: '32px 40px',
    boxShadow: 'var(--shadow-lg)', textAlign: 'center', minWidth: 300,
  },
  msg: { fontSize: 16, color: 'var(--text-dark)', marginBottom: 24, lineHeight: 1.5 },
  btns: { display: 'flex', gap: 12, justifyContent: 'center' },
  cancel: {
    padding: '10px 28px', borderRadius: 8, border: '1px solid var(--border)',
    fontSize: 14, fontWeight: 600, color: 'var(--text-mid)',
    background: '#fff', transition: 'background 0.2s',
  },
  confirm: {
    padding: '10px 28px', borderRadius: 8,
    fontSize: 14, fontWeight: 600, color: '#fff',
    background: 'var(--danger)', transition: 'opacity 0.2s',
  },
};
