import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { token, username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-logo">
          위니브 블로그
        </Link>
        <nav className="header-nav">
          {token ? (
            <>
              <span className="header-username">{username}님</span>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                로그아웃
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
