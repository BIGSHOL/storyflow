# StoryFlow Creator 기술 아키텍처

## 시스템 개요

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client (Browser)                          │
├─────────────────────────────────────────────────────────────────┤
│  React 19 + TypeScript + Vite 6                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │   App    │  │  Editor  │  │ Preview  │  │ Services │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│       │              │             │              │              │
│       └──────────────┴─────────────┴──────────────┘              │
│                            │                                     │
│                     Supabase Client                              │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Supabase Backend                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  PostgreSQL  │  │   Storage    │  │     Auth     │          │
│  │  (Projects)  │  │   (Media)    │  │   (Google)   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 기술 스택 상세

### Frontend
| 기술 | 버전 | 용도 |
|------|------|------|
| React | 19 | UI 프레임워크 |
| TypeScript | 5.x | 타입 안전성 |
| Vite | 6 | 빌드 도구 |
| Tailwind CSS | 3.x | 스타일링 |
| Lucide React | 0.5x | 아이콘 |

### Backend (Supabase)
| 서비스 | 용도 |
|--------|------|
| PostgreSQL | 프로젝트/섹션 데이터 저장 |
| Storage | 이미지/GIF 파일 저장 |
| Auth | Google OAuth 인증 |
| Realtime | (선택) 실시간 동기화 |

### Hosting (미정)
| 후보 | 장점 |
|------|------|
| Vercel | React 최적화, 빠른 배포, 무료 티어 |
| Netlify | 정적 사이트 + 서버리스 |
| Firebase Hosting | 기존 경험 있음 |

---

## 디렉토리 구조

```
storyflow-creator/
├── index.html              # HTML 엔트리 + CSS 애니메이션
├── index.tsx               # React 엔트리
├── App.tsx                 # 메인 앱, 전역 상태
├── types.ts                # TypeScript 타입 정의
│
├── components/
│   ├── Editor.tsx          # 편집 패널
│   ├── PreviewRender.tsx   # 프리뷰 렌더러
│   ├── layouts/            # [NEW] 레이아웃 컴포넌트
│   │   ├── HeroLayout.tsx
│   │   ├── SplitLayout.tsx
│   │   ├── GalleryLayout.tsx
│   │   ├── TimelineLayout.tsx
│   │   ├── CardsLayout.tsx
│   │   ├── QuoteLayout.tsx
│   │   ├── StatsLayout.tsx
│   │   └── VideoHeroLayout.tsx
│   └── ui/                 # [NEW] 공통 UI 컴포넌트
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Modal.tsx
│
├── services/
│   ├── exportService.ts    # HTML 내보내기
│   ├── storageService.ts   # 로컬 저장
│   ├── supabaseClient.ts   # [NEW] Supabase 클라이언트
│   ├── authService.ts      # [NEW] 인증 서비스
│   ├── projectService.ts   # [NEW] 프로젝트 CRUD
│   └── mediaService.ts     # [NEW] 미디어 업로드
│
├── hooks/                  # [NEW] 커스텀 훅
│   ├── useAuth.ts
│   ├── useProject.ts
│   └── useMediaUpload.ts
│
├── docs/                   # 기획 문서
│   ├── OVERVIEW.md
│   ├── REQUIREMENTS.md
│   ├── ARCHITECTURE.md
│   ├── UX-SPEC.md
│   ├── DECISIONS.md
│   └── TASKS.md
│
└── .claude/                # AI 에이전트 설정
    ├── agents/
    └── commands/
```

---

## 데이터 모델

### 프로젝트 (projects)
```typescript
interface Project {
  id: string;              // UUID
  user_id: string;         // 소유자 ID
  title: string;           // 프로젝트 제목
  sections: Section[];     // 섹션 배열 (JSON)
  is_public: boolean;      // 공개 여부
  share_token?: string;    // 공유 토큰
  created_at: string;      // 생성일
  updated_at: string;      // 수정일
}
```

### 섹션 (Section) - 기존 확장
```typescript
interface Section {
  id: string;
  layout: LayoutType;
  title: string;
  description: string;

  // 미디어
  mediaUrl?: string;
  mediaType: 'image' | 'video' | 'none';

  // 스타일링
  backgroundColor?: string;
  textColor?: string;
  overlayOpacity?: number;
  fontFamily?: string;

  // 텍스트 위치
  textVerticalPosition?: 'top' | 'center' | 'bottom';
  textHorizontalPosition?: 'left' | 'center' | 'right';

  // 애니메이션
  animation?: string;
  animationDuration?: number;
  animationDelay?: number;

  // 레이아웃별 추가 속성
  galleryImages?: GalleryImage[];    // Gallery
  timelineItems?: TimelineItem[];    // Timeline
  cards?: CardItem[];                // Cards
  quoteText?: string;                // Quote
  quoteAuthor?: string;
  stats?: StatItem[];                // Stats

  // 기타
  ctaButton?: CTAButton;
  gradientOverlay?: GradientOverlay;
  textShadow?: TextShadow;
}
```

### 레이아웃 타입 확장
```typescript
enum LayoutType {
  // 기존
  HERO = 'hero',
  SPLIT_LEFT = 'split_left',
  SPLIT_RIGHT = 'split_right',
  FULL_IMAGE_TEXT_OVERLAY = 'full_image_overlay',
  SIMPLE_TEXT = 'simple_text',

  // 신규
  GALLERY = 'gallery',
  TIMELINE = 'timeline',
  CARDS = 'cards',
  QUOTE = 'quote',
  STATS = 'stats',
  VIDEO_HERO = 'video_hero',
}
```

### 신규 타입
```typescript
interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
}

interface TimelineItem {
  id: string;
  date: string;
  title: string;
  description: string;
  icon?: string;
  imageUrl?: string;
}

interface CardItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  link?: string;
}

interface StatItem {
  id: string;
  value: string;
  label: string;
  description?: string;
  icon?: string;
}
```

---

## Supabase 스키마

### projects 테이블
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled',
  sections JSONB NOT NULL DEFAULT '[]',
  is_public BOOLEAN DEFAULT false,
  share_token TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 정책
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 소유자만 CRUD
CREATE POLICY "Users can CRUD own projects"
  ON projects FOR ALL
  USING (auth.uid() = user_id);

-- 공개 프로젝트 읽기
CREATE POLICY "Public projects are viewable"
  ON projects FOR SELECT
  USING (is_public = true);
```

### Storage 버킷
```
media/
├── {user_id}/
│   ├── {project_id}/
│   │   ├── image_001.jpg
│   │   ├── image_002.png
│   │   └── animation.gif
```

---

## 상태 관리

### 전역 상태 (App.tsx)
```typescript
// 현재: useState
const [sections, setSections] = useState<Section[]>([]);

// Phase 2: Supabase 연동 후
const [project, setProject] = useState<Project | null>(null);
const [user, setUser] = useState<User | null>(null);
```

### 커스텀 훅
```typescript
// useAuth.ts
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signInWithGoogle = async () => { ... };
  const signOut = async () => { ... };

  return { user, loading, signInWithGoogle, signOut };
}

// useProject.ts
export function useProject(projectId?: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);

  const saveProject = async () => { ... };
  const loadProject = async () => { ... };

  return { project, setProject, saving, saveProject, loadProject };
}
```

---

## API 설계

### 프로젝트 API
| 작업 | 메서드 | 설명 |
|------|--------|------|
| 목록 조회 | `supabase.from('projects').select()` | 내 프로젝트 목록 |
| 단건 조회 | `supabase.from('projects').select().eq('id', id)` | 프로젝트 상세 |
| 생성 | `supabase.from('projects').insert()` | 새 프로젝트 |
| 수정 | `supabase.from('projects').update()` | 프로젝트 저장 |
| 삭제 | `supabase.from('projects').delete()` | 프로젝트 삭제 |

### 미디어 API
| 작업 | 메서드 | 설명 |
|------|--------|------|
| 업로드 | `supabase.storage.from('media').upload()` | 파일 업로드 |
| URL 조회 | `supabase.storage.from('media').getPublicUrl()` | 공개 URL |
| 삭제 | `supabase.storage.from('media').remove()` | 파일 삭제 |

---

## 성능 최적화

### 적용됨
- lucide-react 직접 import (번들 95% 감소)
- content-visibility CSS (오프스크린 렌더링 지연)
- 정적 JSX 호이스팅
- React.memo (SectionView)

### 추가 적용 예정
- 이미지 lazy loading
- Supabase 쿼리 캐싱
- 번들 코드 스플리팅

---

## 보안 고려사항

### 인증
- Supabase Auth + Google OAuth
- JWT 토큰 기반 세션

### 데이터 보호
- RLS (Row Level Security) 정책
- 사용자별 데이터 격리

### 파일 업로드
- 파일 타입 검증 (이미지/GIF만)
- 파일 크기 제한 (이미지 5MB, GIF 10MB)
- 악성 파일 스캔 (Supabase 내장)
