import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPostList } from '../api/blogApi';
import PostCard from '../components/PostCard';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const data = await getPostList();
        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('포스트 목록 로딩 실패:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="empty-state">
        <span className="spinner" />
      </div>
    );
  }

  return (
    <div>
      <div className="home-header">
        <h1 className="home-title">전체 포스트</h1>
        {token && (
          <Link to="/write" className="btn btn-primary">
            새 글 작성
          </Link>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="empty-state">
          <p>아직 작성된 글이 없습니다.</p>
        </div>
      ) : (
        <div className="post-grid">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
