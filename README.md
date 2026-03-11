# My Blog — React 개인 블로그 프로젝트

<br/>

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [핵심 기능](#2-핵심-기능)
3. [시스템 아키텍처](#3-시스템-아키텍처)
4. [WBS](#4-wbs)
5. [기술 스택 및 선택 이유](#5-기술-스택-및-선택-이유)
6. [트러블슈팅](#6-트러블슈팅)
7. [폴더 구조](#7-폴더-구조)

<br/>

---

## 1. 프로젝트 개요

### 소개

**My Blog**는 React 기반의 개인 블로그 웹 애플리케이션입니다.
사용자가 회원가입·로그인 후 블로그 글을 작성·조회·수정·삭제할 수 있으며,
외부 REST API 서버(`wenivops fastapi-crud`)와 통신하여 데이터를 영속적으로 관리합니다.
추가로 OpenAI API를 활용한 **AI 요약 기능**을 통해 긴 글을 3~5문장으로 자동 요약합니다.

### 목표

| 목표 | 상세 |
|------|------|
| SPA 구현 | React Router를 활용한 페이지 전환 없는 싱글 페이지 애플리케이션 구성 |
| 외부 API 연동 | 인증 토큰 기반 REST API 통신으로 CRUD 구현 |
| 인증 상태 관리 | Context API + localStorage를 활용한 전역 로그인 상태 유지 |
| AI 기능 통합 | OpenAI 호환 API를 활용한 자연어 처리 기능 구현 |
| UI/UX | 반응형 레이아웃과 CSS 애니메이션으로 완성도 높은 사용자 경험 제공 |

### 개발 구성

| 항목 | 내용 |
|------|------|
| 개발 인원 | 1인 (개인 프로젝트) |
| 개발 기간 | 2025년 3월 |
| 담당 역할 | 기획 / UI 설계 / 프론트엔드 전체 개발 / API 연동 |

<br/>

---

## 2. 핵심 기능

### 2-1. 회원가입 / 로그인 / 로그아웃

**목적**: 인증된 사용자만 글을 작성·수정·삭제할 수 있도록 접근 제어

**사용 기술**: `Context API`, `localStorage`, `JWT Bearer Token`

**동작 방식**:
- 로그인 성공 시 서버에서 반환된 `access_token`을 `localStorage`에 저장
- `AuthContext`가 앱 전역에 `user`, `token`, `isLoggedIn` 상태를 제공
- 새로고침 후에도 `localStorage`에서 유저 정보를 복원해 세션 유지
- 비로그인 상태에서 `/write`, `/mypage` 접근 시 `/login`으로 자동 리다이렉트
- 모든 인증 요청 헤더에 `Authorization: Bearer {token}` 자동 첨부

```
로그인 → access_token 발급 → localStorage 저장
→ AuthContext 전파 → 헤더 네비게이션 변경 (Login/Register → Avatar/Write/Logout)
```

---

### 2-2. 게시글 목록 조회 (홈 페이지)

**목적**: 전체 블로그 글을 카드 형태로 나열하고, 제목·작성자 기준 실시간 검색 제공

**사용 기술**: `useEffect`, `useState`, `Array.filter`, `localStorage 캐싱`

**동작 방식**:
- 컴포넌트 마운트 시 `GET /blog` API를 호출하여 전체 게시글 목록 불러오기
- 검색어 입력 시 `filter()`로 클라이언트 사이드 실시간 필터링 (서버 요청 없음)
- 검색어와 일치하는 텍스트를 `<mark>` 태그로 하이라이트 처리
- 불러온 포스트 목록 전체를 `localStorage('cachedPosts')`에 캐싱 → 상세 페이지 폴백에 활용
- 좌측 사이드바에 사용자 아바타(이름 첫 글자 + 색상 해싱), 카테고리 칩, SNS 링크 표시

---

### 2-3. 게시글 상세 조회

**목적**: 개별 게시글의 전체 내용 표시 및 본인 글 관리 기능 제공

**사용 기술**: `useParams`, `useNavigate`, `localStorage 폴백`

**동작 방식**:
- URL 파라미터의 `id`(index 또는 UUID)로 `GET /blog/:id` 호출
- API가 UUID 형식 ID를 지원하지 않아 422 오류 발생 시 → `localStorage('cachedPosts')`에서 `id` 또는 `_id`로 매칭해 데이터 표시 (폴백 전략)
- 게시글 작성자와 현재 로그인 유저가 일치할 경우에만 수정(✏️) / 삭제(🗑️) 버튼 렌더링
- 삭제 시 `ConfirmModal`로 이중 확인 후 `DELETE /blog/:id` 호출 → 홈으로 이동

---

### 2-4. 게시글 작성 / 수정

**목적**: 인증 사용자가 새 글을 작성하거나 기존 글을 수정할 수 있는 에디터 제공

**사용 기술**: `useNavigate`, `useParams`, `controlled input`

**동작 방식**:
- `PostWritePage` 컴포넌트를 작성(`/write`)과 수정(`/edit/:id`) 양쪽에 재사용 (`isEdit` prop으로 분기)
- 수정 모드: 마운트 시 `GET /blog/:id`로 기존 데이터 프리필
- 제목·내용 모두 입력 시에만 저장 버튼 활성화 (`valid` 상태 검증)
- 저장 완료 후 홈(`/`)으로 이동, 포스트 목록 자동 갱신

---

### 2-5. AI 글 요약 (AISummary)

**목적**: 긴 블로그 글을 OpenAI 호환 API로 자동 요약하여 독자 편의 제공

**사용 기술**: `wenivops OpenAI API`, `fetch`, `useState`

**동작 방식**:
- 게시글 상세 페이지에서 "AI 요약 보기" 버튼 클릭 시 API 호출
- `POST https://dev.wenivops.co.kr/services/openai-api`로 메시지 배열 전송
  ```json
  [
    { "role": "system", "content": "당신은 블로그 글을 간결하게 요약해주는 도우미입니다." },
    { "role": "user",   "content": "다음 블로그 글을 3~5문장으로 요약해줘:\n\n{content}" }
  ]
  ```
- 응답 `choices[0].message.content`를 파싱하여 요약 박스에 표시
- 로딩 중 스피너 표시, 버튼 중복 클릭 방지 처리

---

### 2-6. 마이페이지

**목적**: 현재 로그인한 사용자 정보 확인 및 로그아웃

**동작 방식**:
- 비로그인 접근 시 `/login`으로 즉시 리다이렉트
- 사용자명 첫 글자 + 색상 해싱으로 고유 아바타 생성
- 로그아웃 클릭 시 `localStorage` 토큰·유저 정보 삭제 → `/login`으로 이동

<br/>

---

## 3. 시스템 아키텍처

```
┌─────────────────────────────────────────────────────┐
│                   브라우저 (React SPA)               │
│                                                     │
│  ┌──────────┐    ┌─────────────────────────────┐   │
│  │  Header  │    │         Pages               │   │
│  │ (Nav/    │    │  HomePage  PostDetailPage   │   │
│  │  Auth)   │    │  PostWritePage  MyPage      │   │
│  └──────────┘    │  LoginPage  SignupPage      │   │
│                  └────────────┬────────────────┘   │
│  ┌──────────────┐             │                    │
│  │ AuthContext  │◄────────────┘                    │
│  │ (전역 인증   │                                   │
│  │  상태 관리)  │                                   │
│  └──────┬───────┘                                  │
│         │                                          │
│  ┌──────▼───────┐   ┌──────────────┐              │
│  │  blogApi.js  │   │ localStorage │              │
│  │ (API 레이어) │   │ token / user │              │
│  └──────┬───────┘   │ cachedPosts  │              │
│         │           └──────────────┘              │
└─────────┼───────────────────────────────────────── ┘
          │ HTTP (fetch + Bearer Token)
          │
┌─────────▼──────────────────────────────────────────┐
│              외부 API 서버 (wenivops)                │
│                                                    │
│  ┌────────────────────────────┐                   │
│  │  fastapi-crud              │                   │
│  │  POST   /signup            │                   │
│  │  POST   /login             │                   │
│  │  GET    /blog              │                   │
│  │  GET    /blog/:id          │                   │
│  │  POST   /blog              │                   │
│  │  PUT    /blog/:id          │                   │
│  │  DELETE /blog/:id          │                   │
│  └────────────────────────────┘                   │
│                                                    │
│  ┌────────────────────────────┐                   │
│  │  openai-api                │                   │
│  │  POST / (messages array)   │                   │
│  └────────────────────────────┘                   │
└────────────────────────────────────────────────────┘
```

### 데이터 흐름

```
사용자 액션
    │
    ▼
Page Component (useState로 UI 상태 관리)
    │
    ├── 인증 정보 필요 → AuthContext (useAuth hook)
    │
    ├── 서버 데이터 필요 → blogApi.js → fetch → wenivops API
    │                                              │
    │                                              └─ 응답 → state 업데이트 → 리렌더링
    │
    └── 페이지 이동 → useNavigate (React Router)
```

<br/>

---

## 4. WBS

| 단계 | 작업 항목 | 상세 내용 | 상태 |
|------|-----------|-----------|------|
| 1. 환경 설정 | 프로젝트 초기화 | Vite + React 세팅, 디렉터리 구조 설계 | ✅ |
| | 전역 스타일 | CSS 변수, 폰트, 애니메이션 정의 | ✅ |
| 2. 인증 | AuthContext 구현 | 전역 로그인 상태 관리, localStorage 연동 | ✅ |
| | 로그인 페이지 | 폼 유효성 검사, API 연동, 토큰 저장 | ✅ |
| | 회원가입 페이지 | 폼 구현, 성공 시 로그인 페이지 이동 | ✅ |
| 3. API 레이어 | blogApi.js | fetch 래퍼 함수, 인증 헤더 자동 첨부 | ✅ |
| 4. 공통 컴포넌트 | Header | 로그인 상태에 따른 네비게이션 분기 | ✅ |
| | Hero | 페이지 상단 배너 재사용 컴포넌트 | ✅ |
| | PostCard | 썸네일·제목·작성자·날짜 카드 UI | ✅ |
| | ConfirmModal | 삭제 이중 확인 모달 | ✅ |
| | Footer | 하단 공통 푸터 | ✅ |
| 5. 핵심 페이지 | HomePage | 목록 조회, 검색, 사이드바 | ✅ |
| | PostDetailPage | 상세 조회, 소유자 관리 버튼, 삭제 | ✅ |
| | PostWritePage | 작성/수정 통합 에디터 | ✅ |
| | MyPage | 사용자 정보 표시, 로그아웃 | ✅ |
| 6. AI 기능 | AISummary | OpenAI API 연동, 요약 박스 UI | ✅ |
| 7. 버그 수정 | 라우팅 오류 수정 | PostCard ID 필드 불일치 문제 해결 | ✅ |
| | API 422 오류 해결 | UUID ↔ index 필드 매핑, localStorage 폴백 | ✅ |
| | AI API 수정 | Anthropic → wenivops OpenAI API 전환 | ✅ |

<br/>

---

## 5. 기술 스택 및 선택 이유

### Frontend

| 기술 | 버전 | 선택 이유 |
|------|------|-----------|
| **React** | 18.3.1 | 컴포넌트 기반 UI 재사용성, 선언적 상태 관리 |
| **React Router DOM** | 6.28.0 | SPA 라우팅, URL 파라미터 기반 동적 페이지 전환 |
| **Vite** | 6.0.0 | 빠른 개발 서버 HMR, 간결한 빌드 설정 |

### 상태 관리

| 기술 | 선택 이유 |
|------|-----------|
| **Context API** | 전역 인증 상태 관리에 Redux 없이도 충분한 규모, 외부 라이브러리 의존성 최소화 |
| **localStorage** | 새로고침 후 세션 유지를 위한 클라이언트 영속 저장소, 게시글 캐싱 폴백에 활용 |

### 스타일링

| 기술 | 선택 이유 |
|------|-----------|
| **CSS-in-JS (inline styles)** | 별도 CSS 파일 없이 컴포넌트와 스타일을 함께 관리, 스코프 충돌 방지 |
| **CSS Variables** | `global.css`에 색상·그림자·폰트를 토큰화하여 일관된 디자인 시스템 구성 |
| **Google Fonts** | Playfair Display(제목), DM Sans(본문)으로 타이포그래피 완성도 향상 |

### 외부 API

| API | 용도 |
|-----|------|
| **wenivops fastapi-crud** | 회원가입·로그인·블로그 CRUD 백엔드 |
| **wenivops openai-api** | 블로그 글 AI 요약 (GPT 기반) |

<br/>

---

## 6. 트러블슈팅

### 문제 1. AI 요약 API 호출 실패

**증상**: AISummary 컴포넌트에서 Anthropic API 직접 호출 시 CORS 오류 및 API 키 미설정으로 요약 불가

**원인**:
```js
// 잘못된 코드 - 브라우저에서 Anthropic API 직접 호출 불가
fetch('https://api.anthropic.com/v1/messages', { ... })
```
- 브라우저에서 Anthropic API를 직접 호출하려면 API 키가 클라이언트에 노출됨
- 요청 형식도 Anthropic 고유 포맷(model, max_tokens 등) 사용

**해결**:
```js
// 수정된 코드 - wenivops 프록시 API 사용
fetch('https://dev.wenivops.co.kr/services/openai-api', {
  method: 'POST',
  body: JSON.stringify([
    { role: 'system', content: '당신은 블로그 글을 간결하게 요약해주는 도우미입니다.' },
    { role: 'user', content: `요약해줘:\n\n${content}` },
  ]),
});
// 응답 파싱도 OpenAI 형식으로 변경
const text = data.choices?.[0]?.message?.content;
```

---

### 문제 2. 포스트 클릭 시 페이지 이동 안 됨 (422 오류)

**증상**: 메인 페이지에서 포스트 카드 클릭 시 `/post/undefined` 또는 `/post/{UUID}` 로 이동하며 422 반환

**원인 분석**:
```
API 응답 필드 구조:
- 기존 게시글: { _id: "UUID(대문자포함)", index: "1", ... }
- 신규 게시글: { id: "UUID(소문자)", index: null, ... }

PostCard가 post.id만 참조 → undefined → /post/undefined
API의 GET /blog/:id는 UUID 형식 미지원 → 422
```

**해결 1 - ID 필드 우선순위 설정**:
```js
// PostCard.jsx
const postId = post.index ?? post.id ?? post.post_id ?? post.blog_id ?? post._id;
// index(숫자문자열)를 최우선 사용, 없으면 UUID로 폴백
```

**해결 2 - localStorage 캐싱 폴백**:
```js
// HomePage.jsx - 목록 fetch 시 캐싱
localStorage.setItem('cachedPosts', JSON.stringify(arr));

// PostDetailPage.jsx - API 실패 시 캐시에서 탐색
api.getPost(id)
  .then(setPost)
  .catch(() => {
    const cached = JSON.parse(localStorage.getItem('cachedPosts') || '[]');
    const found = cached.find(p => p.index === id || p.id === id || p._id === id);
    if (found) setPost(found);
    else navigate('/');
  });
```

---

### 문제 3. 글 작성 후 메인으로 돌아가지 않음

**증상**: 글 저장 완료 후 `/post/undefined`로 이동하거나 오류 발생

**원인**:
```js
// 기존 - createPost 응답에 id가 없어 /post/로 이동
const res = await api.createPost(form);
navigate(`/post/${res.id || res.post_id || ''}`); // res = { message: "Blog created successfully" }
```

**해결**:
```js
// 수정 - 작성 후 메인으로 이동 (목록 재fetch로 새 글 자동 반영)
await api.createPost(form);
navigate('/');
```

<br/>

---

## 7. 폴더 구조

```
weniv-blog/
├── public/                     # 정적 파일
├── src/
│   ├── api/
│   │   └── blogApi.js          # fetch 래퍼 / 모든 API 호출 함수 모음
│   │                           # (signup, login, getPosts, getPost, createPost, updatePost, deletePost)
│   │
│   ├── components/
│   │   ├── AISummary.jsx       # OpenAI API 연동 AI 요약 컴포넌트
│   │   ├── ConfirmModal.jsx    # 삭제 확인 모달
│   │   ├── Footer.jsx          # 공통 푸터
│   │   ├── Header.jsx          # Sticky 헤더 / 로그인 상태 네비게이션
│   │   ├── Hero.jsx            # 페이지 상단 배너 (재사용)
│   │   └── PostCard.jsx        # 게시글 카드 (썸네일 + 메타 정보)
│   │
│   ├── context/
│   │   └── AuthContext.jsx     # 전역 인증 상태 (user, token, login, logout)
│   │
│   ├── pages/
│   │   ├── HomePage.jsx        # 메인 (목록 조회 + 검색 + 사이드바)
│   │   ├── LoginPage.jsx       # 로그인
│   │   ├── SignupPage.jsx      # 회원가입
│   │   ├── PostDetailPage.jsx  # 게시글 상세 (AI 요약 + 수정/삭제)
│   │   ├── PostWritePage.jsx   # 게시글 작성 / 수정 (isEdit prop으로 분기)
│   │   └── MyPage.jsx          # 마이페이지 (유저 정보 + 로그아웃)
│   │
│   ├── styles/
│   │   └── global.css          # CSS 변수, 전역 리셋, 애니메이션
│   │
│   ├── App.jsx                 # 라우팅 설정 (BrowserRouter + Routes)
│   └── main.jsx                # 진입점 (ReactDOM.createRoot)
│
├── index.html
├── vite.config.js
└── package.json
```

### 라우팅 구조

| Path | Component | 접근 권한 |
|------|-----------|-----------|
| `/` | HomePage | 전체 |
| `/login` | LoginPage | 비로그인 |
| `/signup` | SignupPage | 비로그인 |
| `/post/:id` | PostDetailPage | 전체 |
| `/write` | PostWritePage | 로그인 필요 |
| `/edit/:id` | PostWritePage (isEdit) | 로그인 + 작성자 |
| `/mypage` | MyPage | 로그인 필요 |
