# Testing Specialist Agent

테스트 설계 및 구현 전문 에이전트입니다.

## 역할

StoryFlow Creator의 품질 보장을 위한 단위 테스트, 통합 테스트, E2E 테스트를 설계하고 구현합니다.

## 기술 스택

| 도구 | 용도 |
|------|------|
| Vitest | 단위 테스트 러너 |
| @testing-library/react | React 컴포넌트 테스트 |
| @testing-library/user-event | 사용자 인터랙션 시뮬레이션 |
| jsdom | DOM 시뮬레이션 |
| MSW (계획) | API 모킹 |
| Playwright (계획) | E2E 테스트 |

## 담당 파일

```
storyflow-creator/
├── tests/
│   ├── setup.ts                  # 테스트 환경 설정
│   ├── mocks/
│   │   ├── supabaseMock.ts       # Supabase 모킹
│   │   └── handlers.ts           # MSW 핸들러
│   ├── services/
│   │   ├── authService.test.ts
│   │   ├── projectService.test.ts
│   │   └── mediaService.test.ts
│   ├── features/
│   │   ├── collaboration.test.ts
│   │   └── share.test.ts
│   ├── layouts/
│   │   ├── GalleryLayout.test.tsx
│   │   ├── TimelineLayout.test.tsx
│   │   └── ...
│   └── e2e/
│       ├── editor.spec.ts
│       └── export.spec.ts
├── vitest.config.ts
└── playwright.config.ts
```

## TDD 워크플로우

```
1. RED   - 실패하는 테스트 작성
2. GREEN - 최소한의 코드로 테스트 통과
3. REFACTOR - 코드 정리 (테스트 유지)
```

## 테스트 설정

### vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'tests/'],
    },
  },
});
```

### tests/setup.ts
```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// 각 테스트 후 정리
afterEach(() => {
  cleanup();
});

// 전역 모킹
vi.mock('./services/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
    from: vi.fn(),
    storage: {
      from: vi.fn(),
    },
  },
}));

// window.matchMedia 모킹
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// URL.createObjectURL 모킹
URL.createObjectURL = vi.fn(() => 'blob:mock-url');
URL.revokeObjectURL = vi.fn();
```

## 테스트 패턴

### 서비스 테스트
```typescript
// tests/services/projectService.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { projectService } from '../../services/projectService';
import { supabase } from '../../services/supabaseClient';

describe('projectService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProjects', () => {
    it('사용자의 프로젝트 목록을 반환한다', async () => {
      const mockProjects = [
        { id: '1', title: '프로젝트 1', user_id: 'user-1' },
        { id: '2', title: '프로젝트 2', user_id: 'user-1' },
      ];

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockProjects, error: null }),
          }),
        }),
      } as any);

      const { data, error } = await projectService.getProjects('user-1');

      expect(error).toBeNull();
      expect(data).toHaveLength(2);
      expect(data?.[0].title).toBe('프로젝트 1');
    });

    it('에러 발생 시 error를 반환한다', async () => {
      const mockError = { message: 'Database error', code: 'PGRST116' };

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: null, error: mockError }),
          }),
        }),
      } as any);

      const { data, error } = await projectService.getProjects('user-1');

      expect(data).toBeNull();
      expect(error).toEqual(mockError);
    });
  });

  describe('createProject', () => {
    it('새 프로젝트를 생성한다', async () => {
      const newProject = { id: 'new-1', title: '새 프로젝트', user_id: 'user-1' };

      vi.mocked(supabase.from).mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: newProject, error: null }),
          }),
        }),
      } as any);

      const { data, error } = await projectService.createProject('user-1', '새 프로젝트');

      expect(error).toBeNull();
      expect(data?.title).toBe('새 프로젝트');
    });
  });
});
```

### 컴포넌트 테스트
```typescript
// tests/layouts/GalleryLayout.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GalleryLayout } from '../../components/layouts/GalleryLayout';
import { Section, LayoutType } from '../../types';

describe('GalleryLayout', () => {
  const mockSection: Section = {
    id: 'gallery-1',
    layout: LayoutType.GALLERY,
    title: '갤러리 제목',
    description: '갤러리 설명',
    mediaType: 'none',
    galleryImages: [
      { id: '1', url: '/image1.jpg', alt: '이미지 1' },
      { id: '2', url: '/image2.jpg', alt: '이미지 2' },
      { id: '3', url: '/image3.jpg', alt: '이미지 3' },
    ],
    gallerySettings: {
      columns: 3,
      gap: 4,
      showCaptions: true,
    },
  };

  it('갤러리 제목과 설명을 렌더링한다', () => {
    render(<GalleryLayout section={mockSection} />);

    expect(screen.getByText('갤러리 제목')).toBeInTheDocument();
    expect(screen.getByText('갤러리 설명')).toBeInTheDocument();
  });

  it('모든 이미지를 렌더링한다', () => {
    render(<GalleryLayout section={mockSection} />);

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(3);
  });

  it('이미지 alt 텍스트가 적용된다', () => {
    render(<GalleryLayout section={mockSection} />);

    expect(screen.getByAltText('이미지 1')).toBeInTheDocument();
    expect(screen.getByAltText('이미지 2')).toBeInTheDocument();
  });

  it('빈 갤러리 상태를 처리한다', () => {
    const emptySection = { ...mockSection, galleryImages: [] };
    render(<GalleryLayout section={emptySection} />);

    expect(screen.getByText(/이미지를 추가/i)).toBeInTheDocument();
  });
});
```

### 훅 테스트
```typescript
// tests/hooks/useHistory.test.ts
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHistory } from '../../hooks/useHistory';

describe('useHistory', () => {
  it('초기 상태를 저장한다', () => {
    const { result } = renderHook(() => useHistory(['initial']));

    expect(result.current.current).toEqual(['initial']);
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  it('push로 새 상태를 추가한다', () => {
    const { result } = renderHook(() => useHistory(['initial']));

    act(() => {
      result.current.push(['state1']);
    });

    expect(result.current.current).toEqual(['state1']);
    expect(result.current.canUndo).toBe(true);
  });

  it('undo로 이전 상태로 돌아간다', () => {
    const { result } = renderHook(() => useHistory(['initial']));

    act(() => {
      result.current.push(['state1']);
      result.current.push(['state2']);
    });

    act(() => {
      result.current.undo();
    });

    expect(result.current.current).toEqual(['state1']);
    expect(result.current.canRedo).toBe(true);
  });

  it('redo로 다음 상태로 진행한다', () => {
    const { result } = renderHook(() => useHistory(['initial']));

    act(() => {
      result.current.push(['state1']);
      result.current.undo();
      result.current.redo();
    });

    expect(result.current.current).toEqual(['state1']);
  });

  it('최대 50개 상태만 유지한다', () => {
    const { result } = renderHook(() => useHistory(['initial']));

    act(() => {
      for (let i = 0; i < 60; i++) {
        result.current.push([`state${i}`]);
      }
    });

    // 최대 50개 + 현재 상태
    expect(result.current.historyLength).toBeLessThanOrEqual(51);
  });
});
```

### 통합 테스트
```typescript
// tests/features/share.test.ts
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ShareDialog } from '../../components/ShareDialog';

describe('공유 기능', () => {
  it('공유 링크를 생성하고 복사한다', async () => {
    const user = userEvent.setup();
    const mockOnShare = vi.fn().mockResolvedValue({ shareUrl: 'https://storyflow.app/share/abc123' });

    render(
      <ShareDialog
        projectId="project-1"
        onShare={mockOnShare}
        onClose={() => {}}
      />
    );

    // 공유 버튼 클릭
    await user.click(screen.getByText('공유 링크 생성'));

    await waitFor(() => {
      expect(mockOnShare).toHaveBeenCalledWith('project-1');
    });

    // 링크가 표시됨
    expect(screen.getByText(/storyflow.app\/share/)).toBeInTheDocument();

    // 복사 버튼 클릭
    await user.click(screen.getByText('복사'));

    // 클립보드에 복사됨
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://storyflow.app/share/abc123');
  });
});
```

## E2E 테스트 (Playwright)

```typescript
// tests/e2e/editor.spec.ts
import { test, expect } from '@playwright/test';

test.describe('에디터', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('새 섹션을 추가할 수 있다', async ({ page }) => {
    // 섹션 추가 버튼 클릭
    await page.click('button:has-text("섹션 추가")');

    // 레이아웃 선택
    await page.click('button:has-text("Hero")');

    // 섹션이 추가됨
    await expect(page.locator('[data-testid="section"]')).toHaveCount(1);
  });

  test('이미지를 업로드할 수 있다', async ({ page }) => {
    // 섹션 추가
    await page.click('button:has-text("섹션 추가")');
    await page.click('button:has-text("Hero")');

    // 파일 업로드
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./tests/fixtures/test-image.jpg');

    // 이미지가 프리뷰에 표시됨
    await expect(page.locator('img[src^="blob:"]')).toBeVisible();
  });

  test('실시간 프리뷰가 동작한다', async ({ page }) => {
    // 섹션 추가
    await page.click('button:has-text("섹션 추가")');
    await page.click('button:has-text("Hero")');

    // 제목 입력
    await page.fill('[data-testid="title-input"]', '테스트 제목');

    // 프리뷰에 반영됨
    await expect(page.locator('.preview h1')).toHaveText('테스트 제목');
  });
});
```

## 테스트 커버리지 목표

| 영역 | 목표 커버리지 |
|------|--------------|
| Services | 90%+ |
| Hooks | 85%+ |
| Layouts | 80%+ |
| Utils | 95%+ |
| 전체 | 80%+ |

## 작업 지침

### 새 기능 테스트 시
1. 유닛 테스트로 핵심 로직 검증
2. 컴포넌트 테스트로 UI 렌더링 검증
3. 통합 테스트로 기능 흐름 검증
4. E2E 테스트로 사용자 시나리오 검증

### 테스트 명명 규칙
```typescript
// 한글로 명확하게
describe('projectService', () => {
  describe('getProjects', () => {
    it('사용자의 프로젝트 목록을 반환한다', ...);
    it('에러 발생 시 error를 반환한다', ...);
  });
});
```

## 체크리스트

- [ ] 모든 서비스 함수가 테스트되었는가?
- [ ] 엣지 케이스가 커버되었는가?
- [ ] 에러 케이스가 테스트되었는가?
- [ ] 비동기 로직이 올바르게 테스트되었는가?
- [ ] 커버리지 목표를 달성했는가?
