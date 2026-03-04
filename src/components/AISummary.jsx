import { useState } from 'react';

export default function AISummary({ content }) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const summarize = async () => {
    if (loading) return;
    setLoading(true);
    setOpen(true);
    setSummary('');
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `다음 블로그 글을 3~5문장으로 핵심만 간결하게 한국어로 요약해줘:\n\n${content}`,
          }],
        }),
      });
      const data = await res.json();
      const text = data.content?.find(b => b.type === 'text')?.text || '요약에 실패했습니다.';
      setSummary(text);
    } catch {
      setSummary('요약 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <button style={styles.btn} onClick={summarize} disabled={loading}>
        {loading ? '⏳ 요약 중...' : '✨ AI 요약 보기'}
      </button>

      {open && (
        <div style={styles.box} className="fade-up">
          <div style={styles.boxHeader}>
            <span style={styles.boxTitle}>✨ AI 요약</span>
            <button style={styles.close} onClick={() => setOpen(false)}>✕</button>
          </div>
          {loading ? (
            <div style={styles.loading}>
              <div style={styles.spinner} />
              <span style={{ color: 'var(--text-light)', fontSize: 13 }}>글을 분석하고 있어요...</span>
            </div>
          ) : (
            <p style={styles.summaryText}>{summary}</p>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  wrap: { margin: '24px 0' },
  btn: {
    background: 'linear-gradient(135deg, #3b9edd, #5b6ee1)',
    color: '#fff', border: 'none', borderRadius: 8,
    padding: '10px 20px', fontSize: 14, fontWeight: 600,
    cursor: 'pointer', transition: 'opacity 0.2s',
    display: 'flex', alignItems: 'center', gap: 6,
  },
  box: {
    marginTop: 16, background: 'linear-gradient(135deg, #f0f7ff, #f5f0ff)',
    border: '1px solid #c8d8f0', borderRadius: 12, padding: '20px 24px',
  },
  boxHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 12,
  },
  boxTitle: { fontSize: 15, fontWeight: 700, color: 'var(--primary)' },
  close: { fontSize: 16, color: 'var(--text-light)', cursor: 'pointer', background: 'none', border: 'none' },
  loading: { display: 'flex', alignItems: 'center', gap: 12 },
  spinner: {
    width: 20, height: 20, border: '3px solid #d0e8f8',
    borderTopColor: 'var(--primary)', borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  summaryText: { fontSize: 14, lineHeight: 1.8, color: 'var(--text-dark)' },
};
