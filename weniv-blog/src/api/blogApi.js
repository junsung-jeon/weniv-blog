const BASE_URL = 'https://dev.wenivops.co.kr/services/fastapi-crud/1';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const res = await fetch(url, config);
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || `요청 실패 (${res.status})`);
  }
  return res.json();
}

// ─── 인증 ───
export function signup(username, password) {
  return request('/signup', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export function login(username, password) {
  return request('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

// ─── 블로그 ───
export function getPostList() {
  return request('/blog');
}

export function getPostDetail(id) {
  return request(`/blog/${id}`);
}

export function createPost(token, data) {
  return request('/blog', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export function updatePost(token, id, data) {
  return request(`/blog/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export function deletePost(token, id) {
  return request(`/blog/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ─── AI 요약 (ChatGPT API) ───
export async function summarizePost(content, apiKey) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            '당신은 블로그 글을 간결하고 핵심적으로 요약해주는 AI 어시스턴트입니다. 한국어로 3~5문장으로 요약해주세요.',
        },
        {
          role: 'user',
          content: `다음 블로그 글을 요약해주세요:\n\n${content}`,
        },
      ],
      max_tokens: 500,
      temperature: 0.5,
    }),
  });

  if (!res.ok) throw new Error('AI 요약 요청에 실패했습니다.');
  const data = await res.json();
  return data.choices[0].message.content;
}
