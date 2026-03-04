import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPostDetail, updatePost } from '../api/blogApi';

export default function PostEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const post = await getPostDetail(id);
        setTitle(post.title || '');
        setContent(post.content || '');
      } catch (err) {
        alert('포스트를 불러올 수 없습니다.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  const isValid = title.trim() && content.trim();

  const handleSubmit = async () => {
    if (!isValid) return;
    setSubmitting(true);

    try {
      await updatePost(token, id, { title, content });
      navigate(`/post/${id}`);
    } catch (err) {
      alert('수정에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="empty-state">
        <span className="spinner" />
      </div>
    );
  }

  return (
    <div className="write-page">
      <div className="write-page-header">
        <h1 className="write-page-title">글 수정</h1>
        <button
          className="btn btn-primary"
          disabled={!isValid || submitting}
          onClick={handleSubmit}
        >
          {submitting ? '수정 중...' : '수정 완료'}
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
