import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PostDetailPage from './pages/PostDetailPage';
import PostWritePage from './pages/PostWritePage';
import MyPage from './pages/MyPage';
import './styles/global.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/"          element={<HomePage />} />
          <Route path="/login"     element={<LoginPage />} />
          <Route path="/signup"    element={<SignupPage />} />
          <Route path="/post/:id"  element={<PostDetailPage />} />
          <Route path="/write"     element={<PostWritePage />} />
          <Route path="/edit/:id"  element={<PostWritePage isEdit />} />
          <Route path="/mypage"    element={<MyPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
