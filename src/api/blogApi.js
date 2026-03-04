const BASE = 'https://dev.wenivops.co.kr/services/fastapi-crud/1';

const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const req = async (method, path, body) => {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json', ...authHeader() },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(BASE + path, opts);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
};

export const api = {
  signup: (data) => req('POST', '/signup', data),
  login:  (data) => req('POST', '/login', data),
  getPosts: ()     => req('GET',  '/blog'),
  getPost:  (id)   => req('GET',  `/blog/${id}`),
  createPost: (d)  => req('POST', '/blog', d),
  updatePost: (id, d) => req('PUT', `/blog/${id}`, d),
  deletePost: (id) => req('DELETE', `/blog/${id}`),
};
