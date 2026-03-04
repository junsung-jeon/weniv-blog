import { useState } from 'react';
import { summarizePost } from '../api/blogApi';

export default function AISummary({ content }) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('openai_key') || '');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSummarize = async () => {
    if (!apiKey.trim()) {
      setError('OpenAI API 키를 입력해주세요.');
      return;
    }
    if (!content.trim()) {
      setError('요약할 본문이 없습니다.');
      return;
    }

    setLoading(true);
    setError('');
    setSummary('');

    try {
      localStorage.setItem('openai_key', apiKey);
      const result = await summarizePost(content, apiKey);
      setSummary(result);
    } catch (err) {
      setError(err.message || 'AI 요약에 실패했습니다. API 키를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-summary-section">
      <div className="ai-summary-header">
        <div className="ai-summary-label">
          ✨ AI 글 요약
          <span className="ai-summary-badge">GPT</span>
        </div>
      </div>

      <div className="ai-apikey-input">
        <input
          type="password"
          placeholder="OpenAI API Key를 입력하세요"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <button
          className="btn btn-primary btn-sm"
          onClick={handleSummarize}
          disabled={loading}
        >
          {loading ? <span className="spinner" /> : '요약하기'}
        </button>
      </div>

      {error && <p className="form-error">{error}</p>}

      {(summary || loading) && (
        <div className={`ai-summary-box ${loading ? 'loading' : ''}`}>
          {loading ? '요약을 생성하고 있습니다...' : summary}
        </div>
      )}
    </div>
  );
}
