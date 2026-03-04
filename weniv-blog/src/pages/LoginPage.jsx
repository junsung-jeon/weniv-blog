import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/blogApi';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

  const isValid = username.trim() && password.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    setError('');

    try {
      const data = await login(username, password);
      auth.login(data.access_token, username);
      navigate('/');
    } catch (err) {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">로그인</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">아이디</label>
            <input
              className="form-input"
              type="text"
              placeholder="아이디를 입력하세요"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label className="form-label">비밀번호</label>
            <input
              className="form-input"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!isValid || loading}
            style={{ width: '100%', marginTop: 8 }}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
        <p className="auth-switch">
          계정이 없으신가요? <Link to="/signup">회원가입</Link>
        </p>
      </div>
    </div>
  );
}
