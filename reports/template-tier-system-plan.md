# 템플릿 티어 시스템 계획서

## 개요

기본 템플릿과 마켓플레이스 템플릿에 무료/Pro/Business 티어를 적용하여 수익화 기반을 마련합니다.

---

## 1. 티어 구조

### 1.1 사용자 티어
| 티어 | 설명 | 가격 (예상) |
|------|------|------------|
| Free | 무료 사용자 | 무료 |
| Pro | 개인 크리에이터, 프리랜서 | 월 9,900원 |
| Business | 기업, 팀 | 월 29,900원 |

### 1.2 템플릿 티어
| 티어 | 접근 가능 사용자 | 특징 |
|------|-----------------|------|
| free | 모든 사용자 | 기본 레이아웃 (Hero, Split, Simple Text) |
| pro | Pro 이상 | 고급 레이아웃 (Stats, Timeline, Cards, Gallery) |
| business | Business 전용 | 복합 레이아웃, Masonry, Carousel, 고급 애니메이션 |

---

## 2. 기존 템플릿 분류 계획

### 2.1 Business 카테고리
| 템플릿 | 현재 ID | 제안 티어 | 이유 |
|--------|---------|----------|------|
| 제품 소개 | product | free | 기본 템플릿 |
| 회사 소개 | company | pro | Stats 레이아웃 포함 |
| 스타트업 피칭 | startup-pitch | pro | Stats, Timeline 포함 |
| 서비스 런칭 | service-launch | pro | Cards, Stats 포함 |
| 포트폴리오 서비스 | portfolio-service | pro | Cards, Gallery 포함 |
| SaaS 랜딩 | saas-landing | business | 복합 레이아웃 |
| 이커머스 | ecommerce | business | Gallery, Cards 복합 |

### 2.2 Creative 카테고리
| 템플릿 | 현재 ID | 제안 티어 | 이유 |
|--------|---------|----------|------|
| 포트폴리오 | portfolio | free | 기본 템플릿 |
| 사진작가 | photographer | pro | Gallery 포함 |
| 아티스트 | artist | pro | Masonry 포함 |
| 디자이너 | designer | business | Masonry, Carousel 복합 |

### 2.3 Event 카테고리
| 템플릿 | 현재 ID | 제안 티어 | 이유 |
|--------|---------|----------|------|
| 초대장 | invitation | free | 기본 템플릿 |
| 웨딩 | wedding | pro | Timeline, Gallery 포함 |
| 컨퍼런스 | conference | business | Timeline, Cards, Stats 복합 |

### 2.4 Personal 카테고리
| 템플릿 | 현재 ID | 제안 티어 | 이유 |
|--------|---------|----------|------|
| 자기소개 | about-me | free | 기본 템플릿 |
| 여행기 | travel | pro | Gallery, Timeline 포함 |
| 추억 앨범 | memory-album | pro | Masonry, Carousel 포함 |

---

## 3. 타입 정의 변경

### 3.1 Template 인터페이스 수정
```typescript
// types.ts
export type TemplateTier = 'free' | 'pro' | 'business';

export interface Template {
  id: string;
  name: string;
  description: string;
  category: TemplateCategoryId;
  tier?: TemplateTier;  // 신규 추가, 기본값 'free'
  sections: Omit<Section, 'id'>[];
}
```

### 3.2 UserTier 활용 (이미 존재)
```typescript
// hooks/useAuth.ts에 이미 정의됨
export type UserTier = 'free' | 'pro' | 'business';
```

---

## 4. UI/UX 구현 계획

### 4.1 템플릿 카드 배지
```tsx
// 무료: 배지 없음
// Pro: 보라색 배지
<span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded">PRO</span>
// Business: 금색 배지
<span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded">BUSINESS</span>
```

### 4.2 잠금 상태 표시
- 반투명 오버레이 (opacity-50)
- 자물쇠 아이콘 (Lock from lucide-react)
- "Pro로 업그레이드" 또는 "Business로 업그레이드" 텍스트

### 4.3 클릭 시 동작
1. **접근 가능**: 템플릿 적용
2. **접근 불가**: 업그레이드 모달 표시
   - 해당 티어의 혜택 설명
   - "업그레이드" 버튼 → 결제 페이지로 이동

---

## 5. 접근 권한 로직

### 5.1 헬퍼 함수
```typescript
// utils/tierUtils.ts
export const canAccessTemplate = (
  userTier: UserTier,
  templateTier: TemplateTier
): boolean => {
  const tierOrder: Record<string, number> = {
    free: 0,
    pro: 1,
    business: 2,
  };
  return tierOrder[userTier] >= tierOrder[templateTier];
};
```

### 5.2 사용 예시
```tsx
const handleTemplateClick = (template: Template) => {
  const templateTier = template.tier || 'free';

  if (!canAccessTemplate(userTier, templateTier)) {
    setShowUpgradeModal(true);
    setRequiredTier(templateTier);
    return;
  }

  applyTemplate(template);
};
```

---

## 6. 마켓플레이스 (커뮤니티 템플릿) 적용

### 6.1 업로더 티어 기반
- Free 사용자: 무료 템플릿만 등록 가능
- Pro 사용자: Pro 템플릿까지 등록 가능
- Business 사용자: 모든 티어 등록 가능

### 6.2 수익 분배 (추후)
- 유료 템플릿 판매 시 70% 크리에이터, 30% 플랫폼

---

## 7. 구현 우선순위

### Phase 1: 기반 작업 (현재)
- [x] UserTier 타입 정의 (완료)
- [ ] TemplateTier 타입 추가
- [ ] Template 인터페이스에 tier 필드 추가
- [ ] canAccessTemplate 헬퍼 함수 작성

### Phase 2: 기본 템플릿 적용
- [ ] 각 템플릿에 tier 값 추가
- [ ] 템플릿 카드에 배지 표시
- [ ] 잠금 상태 UI 구현
- [ ] 업그레이드 모달 구현

### Phase 3: 마켓플레이스 적용
- [ ] 커뮤니티 템플릿 등록 시 티어 제한
- [ ] 커뮤니티 템플릿 검색/필터에 티어 추가

### Phase 4: 결제 연동
- [ ] Stripe/토스페이먼츠 연동
- [ ] 구독 관리 페이지
- [ ] 결제 완료 후 티어 자동 업그레이드

---

## 8. 현재 상태

**모든 템플릿 무료 개방 중**

추후 유료화 시점에 위 계획에 따라 티어 제한을 적용할 예정입니다.

---

## 9. 관련 파일

- `types.ts` - Template, UserTier 타입 정의
- `data/templates.ts` - 템플릿 목록
- `data/templates/*.ts` - 카테고리별 템플릿
- `hooks/useAuth.ts` - 사용자 인증 및 티어 정보
- `components/Editor.tsx` - 템플릿 선택 UI

---

*작성일: 2026-01-22*
*상태: 계획 수립 완료, 구현 대기*
