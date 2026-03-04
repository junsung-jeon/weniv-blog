import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../api/blogApi';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isValid = username.trim() && password.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    setError('');

    try {
      await signup(username, password);
      alert('회원가입이 완료되었습니다!');
      navigate('/login');
    } catch (err) {
      setError(err.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">회원가입</h1>
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
              autoComplete="new-password"
            />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!isValid || loading}
            style={{ width: '100%', marginTop: 8 }}
          >
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>
        <p className="auth-switch">
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </p>
      </div>
    </div>
  );
}
