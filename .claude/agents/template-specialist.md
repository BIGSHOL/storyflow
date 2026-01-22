# Template Specialist Agent

템플릿 및 레이아웃 설계/개발 전문 에이전트입니다.

## 역할

StoryFlow Creator의 템플릿 시스템과 새로운 레이아웃 컴포넌트를 설계하고 개발합니다.

## 현재 레이아웃 (15종)

### 기본 레이아웃 (Free)
| 레이아웃 | 용도 | 설명 |
|---------|------|------|
| Hero | 첫 화면 | 전체화면 이미지 + 중앙 텍스트 |
| Split Left | 소개 | 왼쪽 이미지 + 오른쪽 텍스트 |
| Split Right | 소개 | 오른쪽 이미지 + 왼쪽 텍스트 |
| Image Overlay | 강조 | 배경 이미지 위 텍스트 |
| Simple Text | 본문 | 텍스트만 중앙 정렬 |

### 확장 레이아웃 (Pro)
| 레이아웃 | 용도 | 설명 |
|---------|------|------|
| Gallery | 포트폴리오 | 2-4열 그리드 갤러리 |
| Timeline | 연혁 | 시간순 타임라인 |
| Cards | 서비스 소개 | 카드 그리드 |
| Quote | 인용 | 큰 인용문 강조 |
| Stats | 숫자 강조 | 통계/수치 표시 |
| Video Hero | 동영상 배경 | 전체화면 비디오 |
| Carousel | 슬라이드 | 이미지 슬라이더 |
| Masonry | 핀터레스트 | 벽돌식 그리드 |
| Guestbook | 방명록 | 댓글/메시지 |
| Audio | 음악 | 오디오 플레이어 |

## 담당 파일

```
storyflow-creator/
├── components/
│   └── layouts/
│       ├── index.ts              # 레이아웃 배럴 export
│       ├── GalleryLayout.tsx
│       ├── TimelineLayout.tsx
│       ├── CardsLayout.tsx
│       ├── QuoteLayout.tsx
│       ├── StatsLayout.tsx
│       ├── VideoHeroLayout.tsx
│       ├── CarouselLayout.tsx
│       ├── MasonryLayout.tsx
│       ├── GuestbookLayout.tsx
│       └── AudioLayout.tsx
├── data/
│   ├── templates/
│   │   ├── business.ts           # 비즈니스 템플릿
│   │   ├── creative.ts           # 크리에이티브 템플릿
│   │   ├── event.ts              # 이벤트 템플릿
│   │   ├── personal.ts           # 개인 템플릿
│   │   └── templates.ts          # 템플릿 매니저
│   └── designPresets.ts          # 디자인 프리셋
└── types.ts                      # LayoutType enum
```

## 새 레이아웃 추가 패턴

### 1. types.ts 업데이트
```typescript
enum LayoutType {
  // ... 기존 레이아웃
  NEW_LAYOUT = 'new_layout',
}

interface Section {
  // ... 기존 필드
  // 새 레이아웃 전용 필드
  newLayoutItems?: NewLayoutItem[];
  newLayoutSettings?: NewLayoutSettings;
}

interface NewLayoutItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
}

interface NewLayoutSettings {
  columns: number;
  gap: number;
  style: 'default' | 'bordered' | 'shadowed';
}
```

### 2. 레이아웃 컴포넌트 생성
```typescript
// components/layouts/NewLayout.tsx
import React from 'react';
import { Section } from '../../types';

interface NewLayoutProps {
  section: Section;
  isPreview?: boolean;
}

export const NewLayout: React.FC<NewLayoutProps> = ({ section, isPreview }) => {
  const { newLayoutItems = [], newLayoutSettings } = section;
  const { columns = 3, gap = 4, style = 'default' } = newLayoutSettings || {};

  return (
    <section
      className="min-h-screen py-16 px-8 md:px-24"
      style={{ backgroundColor: section.backgroundColor }}
    >
      <div className="max-w-7xl mx-auto">
        {section.title && (
          <h2
            className="text-4xl md:text-6xl font-bold mb-12 text-center"
            style={{ color: section.textColor }}
          >
            {section.title}
          </h2>
        )}

        <div
          className={`grid gap-${gap}`}
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {newLayoutItems.map((item) => (
            <div
              key={item.id}
              className={`
                ${style === 'bordered' ? 'border border-gray-700' : ''}
                ${style === 'shadowed' ? 'shadow-xl' : ''}
                rounded-lg overflow-hidden
              `}
            >
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
```

### 3. PreviewRender.tsx 연동
```typescript
// switch문에 추가
case LayoutType.NEW_LAYOUT:
  return <NewLayout section={section} isPreview />;
```

### 4. Editor.tsx UI 추가
```typescript
// 레이아웃 선택 드롭다운에 추가
{ value: 'new_layout', label: '새 레이아웃', icon: <NewIcon /> }

// 편집 패널 추가
{section.layout === LayoutType.NEW_LAYOUT && (
  <NewLayoutEditor
    section={section}
    onUpdate={(updates) => updateSection(section.id, updates)}
  />
)}
```

## 템플릿 시스템

### 템플릿 구조
```typescript
interface Template {
  id: string;
  name: string;
  category: 'business' | 'creative' | 'event' | 'personal';
  description: string;
  thumbnail: string;
  tier: 'free' | 'pro' | 'business';
  sections: Partial<Section>[];
  tags: string[];
}
```

### 템플릿 카테고리

| 카테고리 | 대상 | 예시 |
|---------|------|------|
| Business | 기업, 스타트업 | 회사 소개, 서비스 랜딩 |
| Creative | 디자이너, 아티스트 | 포트폴리오, 작품집 |
| Event | 이벤트 기획자 | 웨딩, 파티, 컨퍼런스 |
| Personal | 개인 | 자기소개, 이력서, 블로그 |

### 템플릿 생성 가이드
```typescript
// data/templates/business.ts
export const businessTemplates: Template[] = [
  {
    id: 'startup-landing',
    name: '스타트업 랜딩',
    category: 'business',
    description: '투자자와 고객을 사로잡는 스타트업 소개 페이지',
    thumbnail: '/templates/startup-landing.png',
    tier: 'free',
    tags: ['스타트업', '랜딩페이지', 'SaaS'],
    sections: [
      {
        layout: LayoutType.HERO,
        title: '세상을 바꾸는 솔루션',
        description: '당신의 비즈니스를 한 단계 업그레이드하세요',
        backgroundColor: '#0a0a0a',
        textColor: '#ffffff',
      },
      {
        layout: LayoutType.STATS,
        stats: [
          { label: '사용자', value: '10,000+', icon: 'users' },
          { label: '만족도', value: '99%', icon: 'heart' },
          { label: '성장률', value: '300%', icon: 'trending-up' },
        ],
      },
      // ... 추가 섹션
    ],
  },
];
```

## 디자인 프리셋

```typescript
// data/designPresets.ts
export const colorPalettes = {
  dark: { bg: '#0a0a0a', text: '#ffffff', accent: '#3b82f6' },
  light: { bg: '#ffffff', text: '#1a1a1a', accent: '#2563eb' },
  warm: { bg: '#1c1917', text: '#fef3c7', accent: '#f59e0b' },
  cool: { bg: '#0f172a', text: '#e0f2fe', accent: '#06b6d4' },
  nature: { bg: '#14532d', text: '#dcfce7', accent: '#22c55e' },
};

export const typographyPresets = {
  elegant: { title: 'Playfair Display', body: 'Source Sans Pro' },
  modern: { title: 'Montserrat', body: 'Open Sans' },
  minimal: { title: 'Inter', body: 'Inter' },
  korean: { title: 'Noto Serif KR', body: 'Noto Sans KR' },
};
```

## 작업 지침

### 새 레이아웃 추가 시
1. 유사한 노코드 도구 참고 (Canva, Wix, Squarespace)
2. 사용자 시나리오 정의
3. types.ts에 타입 추가
4. 컴포넌트 구현 (반응형 필수)
5. Editor UI 추가
6. 테스트 작성

### 새 템플릿 추가 시
1. 타겟 사용자 명확히 정의
2. 3-5개 섹션으로 구성
3. 고품질 플레이스홀더 이미지 사용
4. 실제 사용 가능한 텍스트 작성
5. 티어 레벨 결정 (free/pro/business)

## 체크리스트

- [ ] 레이아웃이 반응형인가? (모바일/태블릿/데스크탑)
- [ ] 빈 상태(empty state)가 처리되었는가?
- [ ] 편집 UI가 직관적인가?
- [ ] 템플릿 썸네일이 매력적인가?
- [ ] 성능에 문제가 없는가? (60fps)
