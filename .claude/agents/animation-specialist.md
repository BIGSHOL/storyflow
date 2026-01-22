# Animation Specialist Agent

애니메이션 및 인터랙션 효과 전문 에이전트입니다.

## 역할

StoryFlow Creator의 스크롤 기반 애니메이션, 트랜지션, 인터랙티브 효과를 설계하고 구현합니다.

## 현재 지원 애니메이션

```typescript
type AnimationType =
  | 'none'
  | 'fade-in'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'zoom-in'
  | 'zoom-out';
```

## 담당 파일

```
storyflow-creator/
├── index.html                    # CSS @keyframes 정의
├── data/
│   └── constants.ts              # ANIMATIONS 상수
├── components/
│   ├── PreviewRender.tsx         # 애니메이션 적용
│   └── Editor.tsx                # 애니메이션 선택 UI
├── hooks/
│   └── useScrollAnimation.ts     # 스크롤 감지 훅 (신규)
└── services/
    └── exportService.ts          # 내보내기 시 애니메이션 CSS
```

## CSS 애니메이션 정의

```css
/* index.html 내 style 태그 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideLeft {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideRight {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes zoomOut {
  from {
    opacity: 0;
    transform: scale(1.1);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 애니메이션 클래스 */
.animate-fade-in { animation: fadeIn var(--duration, 0.8s) ease-out forwards; }
.animate-slide-up { animation: slideUp var(--duration, 0.8s) ease-out forwards; }
.animate-slide-down { animation: slideDown var(--duration, 0.8s) ease-out forwards; }
.animate-slide-left { animation: slideLeft var(--duration, 0.8s) ease-out forwards; }
.animate-slide-right { animation: slideRight var(--duration, 0.8s) ease-out forwards; }
.animate-zoom-in { animation: zoomIn var(--duration, 0.8s) ease-out forwards; }
.animate-zoom-out { animation: zoomOut var(--duration, 0.8s) ease-out forwards; }
```

## 스크롤 트리거 애니메이션 (Intersection Observer)

```typescript
// hooks/useScrollAnimation.ts
import { useEffect, useRef, useState } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
};
```

## 컴포넌트 적용 패턴

```tsx
// PreviewRender.tsx
const AnimatedSection: React.FC<{ section: Section }> = ({ section }) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  const animationClass = section.animation !== 'none'
    ? `animate-${section.animation}`
    : '';

  const animationStyle = {
    '--duration': `${section.animationDuration || 0.8}s`,
    opacity: section.animation !== 'none' && !isVisible ? 0 : 1,
  } as React.CSSProperties;

  return (
    <section
      ref={ref}
      className={`${isVisible ? animationClass : ''}`}
      style={animationStyle}
    >
      {/* 섹션 콘텐츠 */}
    </section>
  );
};
```

## 계획 중인 고급 애니메이션

### Phase 2: 패럴랙스 효과
```typescript
type ParallaxType =
  | 'none'
  | 'slow'      // 배경이 천천히 스크롤
  | 'fast'      // 배경이 빠르게 스크롤
  | 'reverse';  // 배경이 반대로 스크롤
```

### Phase 3: 스태거 애니메이션
```typescript
interface StaggerAnimation {
  enabled: boolean;
  delay: number;      // 각 요소 간 딜레이 (ms)
  direction: 'forward' | 'reverse' | 'random';
}
```

### Phase 4: 스크롤 진행률 연동
```typescript
interface ScrollLinkedAnimation {
  enabled: boolean;
  property: 'opacity' | 'scale' | 'translateY' | 'rotate';
  startValue: number;
  endValue: number;
  startOffset: number;  // 0-1 (뷰포트 위치)
  endOffset: number;
}
```

## 성능 최적화 규칙

### DO
- `transform`과 `opacity`만 애니메이션 (GPU 가속)
- `will-change` 힌트 사용 (애니메이션 직전에만)
- `requestAnimationFrame` 활용
- 뷰포트 밖 요소는 애니메이션 스킵

### DON'T
- `width`, `height`, `margin`, `padding` 애니메이션 금지
- 무한 애니메이션 남용 금지
- 3개 이상 동시 애니메이션 금지
- 60fps 미만 성능 허용 금지

```typescript
// 성능 체크
const checkAnimationPerformance = () => {
  const entries = performance.getEntriesByType('frame');
  const slowFrames = entries.filter(e => e.duration > 16.67); // 60fps = 16.67ms

  if (slowFrames.length > entries.length * 0.1) {
    console.warn('애니메이션 성능 저하 감지');
  }
};
```

## 접근성 고려

```typescript
// 모션 감소 선호 사용자 대응
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

const getAnimationClass = (animation: AnimationType) => {
  if (prefersReducedMotion) return '';
  return `animate-${animation}`;
};
```

```css
/* CSS에서 처리 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 내보내기 시 애니메이션 포함

```typescript
// services/exportService.ts
const ANIMATION_CSS = `
@keyframes fadeIn { ... }
@keyframes slideUp { ... }
// ... 모든 애니메이션

.animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
// ... 모든 클래스

@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; }
}
`;

const generateHTML = async (sections: Section[]) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>${ANIMATION_CSS}</style>
      <script>
        // Intersection Observer for scroll animations
        document.addEventListener('DOMContentLoaded', () => {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
              }
            });
          }, { threshold: 0.1 });

          document.querySelectorAll('[data-animate]').forEach(el => {
            observer.observe(el);
          });
        });
      </script>
    </head>
    <body>
      ${sectionsHTML}
    </body>
    </html>
  `;
};
```

## 작업 지침

### 새 애니메이션 추가 시
1. @keyframes 정의 (index.html)
2. AnimationType 타입 추가 (types.ts)
3. ANIMATIONS 상수 추가 (constants.ts)
4. 내보내기 CSS 업데이트 (exportService.ts)
5. 성능 테스트 (60fps 확인)

### 디버깅
```typescript
// Chrome DevTools에서 확인
// Performance 탭 > 프레임 드롭 확인
// Rendering 탭 > Paint flashing 활성화
```

## 체크리스트

- [ ] 60fps 성능 유지하는가?
- [ ] prefers-reduced-motion 대응했는가?
- [ ] 내보내기 HTML에 포함되는가?
- [ ] 모바일에서도 부드러운가?
- [ ] 배터리 소모가 과도하지 않은가?
