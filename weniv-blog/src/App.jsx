import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import PostDetailPage from './pages/PostDetailPage';
import PostWritePage from './pages/PostWritePage';
import PostEditPage from './pages/PostEditPage';

function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <>
      <Header />
      <main className="main-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/post/:id" element={<PostDetailPage />} />
          <Route
            path="/write"
            element={
              <PrivateRoute>
                <PostWritePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <PrivateRoute>
                <PostEditPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </>
  );
}
