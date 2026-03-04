import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPostDetail, deletePost } from '../api/blogApi';
import ConfirmModal from '../components/ConfirmModal';
import AISummary from '../components/AISummary';

const RANDOM_THUMBS = [
  'https://picsum.photos/seed/d1/800/400',
  'https://picsum.photos/seed/d2/800/400',
  'https://picsum.photos/seed/d3/800/400',
  'https://picsum.photos/seed/d4/800/400',
];

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, username } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getPostDetail(id);
        setPost(data);
      } catch (err) {
        console.error('포스트 로딩 실패:', err);
        navigate('/');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  const handleDelete = async () => {
    try {
      await deletePost(token, id);
      navigate('/');
    } catch (err) {
      alert('삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="empty-state">
        <span className="spinner" />
      </div>
    );
  }

  if (!post) return null;

  const thumb =
    post.thumbnail || RANDOM_THUMBS[post.id % RANDOM_THUMBS.length];
  const isAuthor = token && username === post.author;

  return (
    <article className="post-detail">
      <div className="post-detail-header">
        <h1 className="post-detail-title">{post.title}</h1>
        <div className="post-detail-meta">
          <span>{post.author || '익명'}</span>
          <span>{formatDate(post.created_at)}</span>
          {isAuthor && (
            <div className="post-detail-actions">
              <Link to={`/edit/${post.id}`} className="btn btn-secondary btn-sm">
                수정
              </Link>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => setShowModal(true)}
              >
                삭제
              </button>
            </div>
          )}
        </div>
      </div>

      <img
        className="post-detail-thumb"
        src={thumb}
        alt={post.title}
        onError={(e) => {
          e.target.src = RANDOM_THUMBS[0];
        }}
      />

      <div className="post-detail-content">{post.content}</div>

      {/* AI 글 요약 */}
      <AISummary content={post.content || ''} />

      {showModal && (
        <ConfirmModal
          message="정말로 이 포스트를 삭제하시겠습니까?"
          onConfirm={handleDelete}
          onCancel={() => setShowModal(false)}
        />
      )}
    </article>
  );
}
