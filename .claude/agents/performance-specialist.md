# Performance Specialist Agent

성능 최적화 전문 에이전트입니다.

## 역할

StoryFlow Creator의 로딩 속도, 렌더링 성능, 메모리 관리를 최적화합니다.

## 성능 목표

| 지표 | 목표 | 측정 도구 |
|------|------|----------|
| First Contentful Paint | < 1.5s | Lighthouse |
| Largest Contentful Paint | < 2.5s | Lighthouse |
| Time to Interactive | < 3.0s | Lighthouse |
| Cumulative Layout Shift | < 0.1 | Lighthouse |
| First Input Delay | < 100ms | Lighthouse |
| 스크롤 성능 | 60fps | Chrome DevTools |
| 번들 크기 | < 300KB (gzip) | Vite build |

## 담당 영역

```
storyflow-creator/
├── vite.config.ts                # 번들 최적화 설정
├── App.tsx                       # 메모리 관리, 상태 최적화
├── components/
│   ├── Editor.tsx                # 리렌더링 최적화
│   └── PreviewRender.tsx         # 스크롤 성능
├── services/
│   └── imageOptimizer.ts         # 이미지 최적화
└── hooks/
    └── useVirtualization.ts      # 가상화 (신규)
```

## 번들 최적화

### vite.config.ts
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 벤더 청크 분리
          'react-vendor': ['react', 'react-dom'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'export-vendor': ['html2canvas', 'jspdf'],
        },
      },
    },
    // 코드 분할 최적화
    chunkSizeWarningLimit: 500,
    // CSS 최적화
    cssCodeSplit: true,
    // 소스맵 (프로덕션에서 비활성화)
    sourcemap: false,
  },
  // 의존성 사전 번들링
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react'],
  },
});
```

### Lucide 아이콘 최적화
```typescript
// ❌ 비효율적 (전체 번들 포함)
import { Eye, Edit3, Trash2 } from 'lucide-react';

// ✅ 효율적 (개별 아이콘만 포함)
import Eye from 'lucide-react/dist/esm/icons/eye';
import Edit3 from 'lucide-react/dist/esm/icons/edit-3';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
```

### 동적 임포트
```typescript
// 내보내기 기능 지연 로딩
const handleExportHTML = async () => {
  const { exportService } = await import('./services/exportService');
  await exportService.exportToHTML(sections);
};

// 레이아웃 컴포넌트 지연 로딩
const GalleryLayout = lazy(() => import('./components/layouts/GalleryLayout'));
const TimelineLayout = lazy(() => import('./components/layouts/TimelineLayout'));
```

## 렌더링 최적화

### React.memo 활용
```typescript
// 순수 컴포넌트 메모이제이션
const SectionCard = memo<SectionCardProps>(({ section, onUpdate, onDelete }) => {
  return (
    <div className="section-card">
      {/* 컴포넌트 내용 */}
    </div>
  );
}, (prevProps, nextProps) => {
  // 커스텀 비교 함수
  return prevProps.section.id === nextProps.section.id
    && prevProps.section.title === nextProps.section.title
    && prevProps.section.layout === nextProps.section.layout;
});
```

### useMemo / useCallback
```typescript
const Editor: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);

  // 계산 비용이 높은 값 메모이제이션
  const sortedSections = useMemo(() => {
    return [...sections].sort((a, b) => a.order - b.order);
  }, [sections]);

  // 콜백 메모이제이션
  const handleUpdateSection = useCallback((id: string, updates: Partial<Section>) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  // 정적 JSX 호이스팅
  const emptyState = useMemo(() => (
    <div className="empty-state">
      <p>섹션을 추가해주세요</p>
    </div>
  ), []);

  return sections.length === 0 ? emptyState : (
    <div>
      {sortedSections.map(section => (
        <SectionCard
          key={section.id}
          section={section}
          onUpdate={handleUpdateSection}
        />
      ))}
    </div>
  );
};
```

### startTransition 활용
```typescript
import { startTransition } from 'react';

const handleBulkUpdate = (updates: Section[]) => {
  // 긴급하지 않은 업데이트는 startTransition으로 감싸기
  startTransition(() => {
    setSections(updates);
  });
};
```

## 메모리 관리

### Blob URL 정리
```typescript
// 이미지 변경 시 기존 URL 해제
const updateMedia = (id: string, file: File) => {
  const section = sections.find(s => s.id === id);

  // 기존 Blob URL 해제
  if (section?.mediaUrl?.startsWith('blob:')) {
    URL.revokeObjectURL(section.mediaUrl);
  }

  const newUrl = URL.createObjectURL(file);
  updateSection(id, { mediaUrl: newUrl });
};

// 섹션 삭제 시 정리
const deleteSection = (id: string) => {
  const section = sections.find(s => s.id === id);
  if (section?.mediaUrl?.startsWith('blob:')) {
    URL.revokeObjectURL(section.mediaUrl);
  }
  setSections(prev => prev.filter(s => s.id !== id));
};

// 컴포넌트 언마운트 시 정리
useEffect(() => {
  return () => {
    sections.forEach(section => {
      if (section.mediaUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(section.mediaUrl);
      }
    });
  };
}, []);
```

### History 제한
```typescript
const MAX_HISTORY = 50;

const pushHistory = (newState: Section[]) => {
  historyRef.current = [
    ...historyRef.current.slice(-MAX_HISTORY),
    newState
  ];
};
```

## 스크롤 성능

### content-visibility 활용
```css
/* 화면 밖 섹션 렌더링 지연 */
.section {
  content-visibility: auto;
  contain-intrinsic-size: 0 100vh;
}
```

### 가상화 (긴 목록용)
```typescript
// hooks/useVirtualization.ts
import { useState, useRef, useEffect } from 'react';

interface UseVirtualizationOptions {
  itemHeight: number;
  overscan?: number;
}

export const useVirtualization = <T>(
  items: T[],
  options: UseVirtualizationOptions
) => {
  const { itemHeight, overscan = 3 } = options;
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const viewportHeight = container.clientHeight;

      const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
      const end = Math.min(
        items.length,
        Math.ceil((scrollTop + viewportHeight) / itemHeight) + overscan
      );

      setVisibleRange({ start, end });
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [items.length, itemHeight, overscan]);

  const visibleItems = items.slice(visibleRange.start, visibleRange.end);
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.start * itemHeight;

  return { containerRef, visibleItems, totalHeight, offsetY };
};
```

## 이미지 최적화

### 업로드 시 최적화
```typescript
// services/imageOptimizer.ts
export const optimizeImage = async (file: File): Promise<File> => {
  // 최대 크기 제한
  const MAX_WIDTH = 1920;
  const MAX_HEIGHT = 1080;
  const QUALITY = 0.85;

  const img = await createImageBitmap(file);

  // 리사이즈 필요 여부 확인
  if (img.width <= MAX_WIDTH && img.height <= MAX_HEIGHT) {
    return file;
  }

  // 비율 유지하며 리사이즈
  const ratio = Math.min(MAX_WIDTH / img.width, MAX_HEIGHT / img.height);
  const width = Math.round(img.width * ratio);
  const height = Math.round(img.height * ratio);

  // Canvas로 리사이즈
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx?.drawImage(img, 0, 0, width, height);

  // WebP로 변환 (지원되면)
  const blob = await canvas.convertToBlob({
    type: 'image/webp',
    quality: QUALITY,
  });

  return new File([blob], file.name.replace(/\.\w+$/, '.webp'), {
    type: 'image/webp',
  });
};
```

### 지연 로딩
```typescript
// 이미지 지연 로딩
<img
  src={imageUrl}
  alt={alt}
  loading="lazy"
  decoding="async"
/>

// Intersection Observer 기반
const LazyImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoaded(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <img
      ref={imgRef}
      src={loaded ? src : undefined}
      data-src={src}
      alt={alt}
      className={loaded ? 'opacity-100' : 'opacity-0'}
    />
  );
};
```

## 성능 모니터링

### 개발 중 프로파일링
```typescript
// React DevTools Profiler 활용
if (process.env.NODE_ENV === 'development') {
  // Why did you render 활성화
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
}
```

### 성능 측정
```typescript
// 컴포넌트 렌더링 시간 측정
const measureRender = (componentName: string, callback: () => void) => {
  const start = performance.now();
  callback();
  const end = performance.now();
  console.log(`${componentName} rendered in ${end - start}ms`);
};

// Web Vitals 수집
import { onCLS, onFID, onLCP } from 'web-vitals';

onCLS(console.log);
onFID(console.log);
onLCP(console.log);
```

## 작업 지침

### 성능 개선 시
1. Chrome DevTools로 병목 지점 식별
2. React DevTools Profiler로 리렌더링 추적
3. 최적화 적용
4. Lighthouse로 결과 측정

### 성능 회귀 방지
1. 번들 크기 CI 체크 추가
2. Lighthouse CI 설정
3. 주요 시나리오 성능 테스트

## 체크리스트

- [ ] 번들 크기가 300KB 이하인가?
- [ ] LCP가 2.5초 이하인가?
- [ ] 스크롤이 60fps로 동작하는가?
- [ ] 메모리 누수가 없는가?
- [ ] 불필요한 리렌더링이 없는가?
