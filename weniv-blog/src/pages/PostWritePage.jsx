import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createPost } from '../api/blogApi';

export default function PostWritePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();

  const isValid = title.trim() && content.trim();

  const handleSubmit = async () => {
    if (!isValid) return;
    setLoading(true);

    try {
      await createPost(token, { title, content });
      navigate('/');
    } catch (err) {
      alert('글 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="write-page">
      <div className="write-page-header">
        <h1 className="write-page-title">새 글 작성</h1>
        <button
          className="btn btn-primary"
          disabled={!isValid || loading}
          onClick={handleSubmit}
        >
          {loading ? '발행 중...' : '발행'}
        </button>
      </div>

      <div className="form-group">
        <label className="form-label">제목</label>
        <input
          className="form-input"
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">본문</label>
        <textarea
          className="form-input form-textarea"
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
    </div>
  );
}
