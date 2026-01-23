# Coding Convention & AI Collaboration Guide

> StoryFlow Creator 수익화 기능 - 개발 가이드

---

## MVP 캡슐

| # | 항목 | 내용 |
|---|------|------|
| 1 | 목표 | 지속 가능한 서비스 운영을 위한 수익화 기능 구현 |
| 2 | 페르소나 | 간단한 개인 페이지가 필요한 누구나 |
| 3 | 핵심 기능 | FEAT-1: 플랜별 기능 제한 시스템 |
| 4 | 성공 지표 (노스스타) | 월 유료 구독자 수 |
| 5 | 입력 지표 | 무료→유료 전환율, 플랜 업그레이드 클릭 수 |
| 6 | 비기능 요구 | 결제 처리 응답 시간 < 3초 |
| 7 | Out-of-scope | 커스텀 도메인 연결, 연간 결제 |
| 8 | Top 리스크 | 무료 사용자 이탈 |
| 9 | 완화/실험 | Notion 스타일의 관대한 무료 플랜 유지 |
| 10 | 다음 단계 | 플랜 제한 시스템 구현 |

---

## 1. 핵심 원칙

### 1.1 기존 코드 스타일 유지

StoryFlow Creator는 이미 완성도 높은 프로젝트입니다.
새로운 기능을 추가할 때 기존 패턴을 따릅니다:

- **상태 관리**: React useState (기존 패턴)
- **스타일링**: Tailwind CSS 인라인 클래스 (기존 패턴)
- **타입**: TypeScript strict mode (기존 설정)
- **컴포넌트**: 함수형 컴포넌트 + 훅 (기존 패턴)

### 1.2 신뢰하되, 검증하라

AI가 생성한 코드는 반드시 검증:

- [ ] 기존 코드 스타일과 일치하는지 확인
- [ ] TypeScript 에러 없는지 확인 (`npx tsc --noEmit`)
- [ ] 실제 동작 테스트

---

## 2. 프로젝트 구조 (추가될 파일)

### 2.1 현재 구조

```
storyflow-creator/
├── App.tsx                    # 메인 앱
├── components/
│   ├── Editor.tsx             # 편집 패널
│   ├── PreviewRender.tsx      # 프리뷰
│   └── layouts/               # 레이아웃 컴포넌트
├── services/
│   ├── authService.ts         # 인증
│   ├── projectService.ts      # 프로젝트 CRUD
│   ├── collaborationService.ts # 협업
│   ├── exportService.ts       # 내보내기
│   └── exportLimitService.ts  # 내보내기 제한 (기존)
├── data/
│   └── templates/             # 템플릿 데이터
├── types.ts                   # 타입 정의
└── index.tsx                  # 엔트리
```

### 2.2 추가될 구조

```
storyflow-creator/
├── services/
│   ├── subscriptionService.ts  # 구독 관련 API
│   ├── planLimitService.ts     # 플랜 제한 체크
│   └── paymentService.ts       # 결제 관련 (v2)
├── components/
│   ├── subscription/
│   │   ├── PlanBadge.tsx       # 플랜 배지
│   │   ├── UsageBar.tsx        # 사용량 바
│   │   ├── UpgradeModal.tsx    # 업그레이드 안내 모달
│   │   ├── PricingCard.tsx     # 플랜 카드
│   │   └── PricingPage.tsx     # 요금제 페이지
│   └── ...
├── hooks/
│   ├── useSubscription.ts      # 구독 정보 훅
│   └── usePlanLimits.ts        # 플랜 제한 체크 훅
├── types/
│   └── subscription.ts         # 구독 관련 타입
└── supabase/
    └── functions/
        ├── create-checkout/    # Edge Function
        ├── handle-webhook/
        └── cancel-subscription/
```

---

## 3. 네이밍 규칙 (기존 패턴)

| 대상 | 규칙 | 예시 |
|------|------|------|
| 파일 (컴포넌트) | PascalCase | `UpgradeModal.tsx` |
| 파일 (서비스) | camelCase | `subscriptionService.ts` |
| 파일 (훅) | camelCase (use 접두사) | `useSubscription.ts` |
| 컴포넌트 | PascalCase | `PlanBadge` |
| 함수 | camelCase | `checkPlanLimit` |
| 상수 | UPPER_SNAKE | `MAX_FREE_PROJECTS` |
| 타입/인터페이스 | PascalCase | `Subscription`, `PlanType` |

---

## 4. 타입 정의 패턴

### 4.1 구독 관련 타입 (types/subscription.ts)

```typescript
// 플랜 타입
export type PlanType = 'free' | 'pro' | 'team';

// 구독 상태
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'expired';

// 플랜 제한 설정
export interface PlanLimits {
  maxProjects: number | null;      // null = 무제한
  maxExportsPerDay: number | null;
  maxCollaborators: number | null;
  canRemoveBranding: boolean;
  canManageTeam: boolean;
}

// 구독 정보
export interface Subscription {
  id: string;
  userId: string;
  planType: PlanType;
  status: SubscriptionStatus;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  canceledAt: string | null;
}

// 사용량 정보
export interface Usage {
  projectCount: number;
  todayExportCount: number;
  collaboratorCount: number;
}

// 구독 + 사용량 통합
export interface SubscriptionWithUsage extends Subscription {
  limits: PlanLimits;
  usage: Usage;
}
```

### 4.2 상수 정의

```typescript
// services/planLimitService.ts

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  free: {
    maxProjects: 3,
    maxExportsPerDay: 10,
    maxCollaborators: 1,
    canRemoveBranding: false,
    canManageTeam: false,
  },
  pro: {
    maxProjects: null,
    maxExportsPerDay: null,
    maxCollaborators: 5,
    canRemoveBranding: true,
    canManageTeam: false,
  },
  team: {
    maxProjects: null,
    maxExportsPerDay: null,
    maxCollaborators: null,
    canRemoveBranding: true,
    canManageTeam: true,
  },
};

export const PLAN_PRICES: Record<PlanType, number> = {
  free: 0,
  pro: 9900,
  team: 29900,
};
```

---

## 5. 컴포넌트 패턴

### 5.1 기본 구조 (기존 패턴)

```tsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { PlanType } from '../types/subscription';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUsage: { used: number; limit: number };
  limitType: 'project' | 'export' | 'collaborator';
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  currentUsage,
  limitType,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}  // 배경 클릭으로 닫기
    >
      <div
        className="bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 내용 */}
        <h2 className="text-xl font-semibold text-white mb-4">
          더 많은 기능이 필요하신가요?
        </h2>

        {/* 사용량 바 */}
        <div className="mb-6">
          <UsageBar
            used={currentUsage.used}
            limit={currentUsage.limit}
            label={getLimitLabel(limitType)}
          />
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-300 hover:text-white
                       border border-gray-600 rounded-lg transition-colors"
          >
            나중에
          </button>
          <button
            onClick={() => window.location.href = '/pricing'}
            className="flex-1 px-4 py-2 bg-violet-600 text-white
                       rounded-lg hover:bg-violet-500 transition-colors"
          >
            플랜 살펴보기
          </button>
        </div>
      </div>
    </div>
  );
};
```

### 5.2 훅 패턴

```typescript
// hooks/useSubscription.ts

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { SubscriptionWithUsage, PlanType } from '../types/subscription';
import { PLAN_LIMITS } from '../services/planLimitService';

export function useSubscription() {
  const [subscription, setSubscription] = useState<SubscriptionWithUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setSubscription(null);
        return;
      }

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      // 사용량 조회
      const usage = await fetchUsage(user.id);

      setSubscription({
        ...data,
        limits: PLAN_LIMITS[data.plan_type as PlanType],
        usage,
      });
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { subscription, loading, error, refetch: fetchSubscription };
}
```

### 5.3 제한 체크 훅

```typescript
// hooks/usePlanLimits.ts

import { useSubscription } from './useSubscription';

export function usePlanLimits() {
  const { subscription, loading } = useSubscription();

  const canCreateProject = () => {
    if (loading || !subscription) return false;
    const { limits, usage } = subscription;
    if (limits.maxProjects === null) return true;
    return usage.projectCount < limits.maxProjects;
  };

  const canExport = () => {
    if (loading || !subscription) return false;
    const { limits, usage } = subscription;
    if (limits.maxExportsPerDay === null) return true;
    return usage.todayExportCount < limits.maxExportsPerDay;
  };

  const canInviteCollaborator = (projectCollaboratorCount: number) => {
    if (loading || !subscription) return false;
    const { limits } = subscription;
    if (limits.maxCollaborators === null) return true;
    return projectCollaboratorCount < limits.maxCollaborators;
  };

  const canRemoveBranding = () => {
    if (loading || !subscription) return false;
    return subscription.limits.canRemoveBranding;
  };

  return {
    canCreateProject,
    canExport,
    canInviteCollaborator,
    canRemoveBranding,
    subscription,
    loading,
  };
}
```

---

## 6. 서비스 패턴

### 6.1 기존 서비스 패턴 참조

```typescript
// services/subscriptionService.ts

import { supabase } from '../lib/supabase';
import { Subscription, Usage, PlanType } from '../types/subscription';

/**
 * 현재 사용자의 구독 정보 조회
 */
export const getSubscription = async (): Promise<Subscription | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Failed to fetch subscription:', error);
    return null;
  }

  return data;
};

/**
 * 사용량 조회
 */
export const getUsage = async (userId: string): Promise<Usage> => {
  // 프로젝트 개수
  const { count: projectCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  // 오늘 내보내기 횟수 (기존 exportLimitService 활용)
  const todayExportCount = getRemainingExports();

  // 협업자 수
  const { count: collaboratorCount } = await supabase
    .from('collaborators')
    .select('*', { count: 'exact', head: true })
    .eq('inviter_id', userId);

  return {
    projectCount: projectCount || 0,
    todayExportCount: 10 - todayExportCount, // 사용량으로 변환
    collaboratorCount: collaboratorCount || 0,
  };
};

/**
 * 플랜 업그레이드 (v2: 결제 연동 후)
 */
export const upgradePlan = async (planType: PlanType): Promise<boolean> => {
  // TODO: 토스페이먼츠 결제 연동
  throw new Error('Not implemented yet');
};
```

---

## 7. 보안 체크리스트

### 7.1 결제 관련 (v2)

- [ ] 빌링키는 Supabase에 암호화 저장
- [ ] 결제 금액은 서버에서 검증 (클라이언트 값 신뢰 X)
- [ ] 토스 웹훅 시그니처 검증 필수
- [ ] 환경 변수로 API 키 관리

### 7.2 플랜 제한 관련

- [ ] 클라이언트 + 서버 양쪽에서 제한 검증
- [ ] RLS로 다른 사용자 데이터 접근 차단
- [ ] 프로젝트 생성 시 서버 측 제한 체크

---

## 8. 테스트 전략

### 8.1 단위 테스트

```typescript
// __tests__/planLimitService.test.ts

import { describe, it, expect } from 'vitest';
import { PLAN_LIMITS } from '../services/planLimitService';

describe('PLAN_LIMITS', () => {
  it('free plan should have 3 project limit', () => {
    expect(PLAN_LIMITS.free.maxProjects).toBe(3);
  });

  it('pro plan should have unlimited projects', () => {
    expect(PLAN_LIMITS.pro.maxProjects).toBeNull();
  });

  it('free plan should not remove branding', () => {
    expect(PLAN_LIMITS.free.canRemoveBranding).toBe(false);
  });

  it('pro plan should remove branding', () => {
    expect(PLAN_LIMITS.pro.canRemoveBranding).toBe(true);
  });
});
```

### 8.2 통합 테스트

```typescript
// __tests__/useSubscription.test.ts

import { renderHook, waitFor } from '@testing-library/react';
import { useSubscription } from '../hooks/useSubscription';

describe('useSubscription', () => {
  it('should return subscription with limits', async () => {
    const { result } = renderHook(() => useSubscription());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.subscription).toBeDefined();
    expect(result.current.subscription?.limits).toBeDefined();
  });
});
```

---

## 9. Git 커밋 메시지

### 9.1 형식

```
<type>(subscription): <subject>

<body>
```

### 9.2 예시

```
feat(subscription): 플랜 제한 체크 훅 추가

- usePlanLimits 훅 구현
- 프로젝트/내보내기/협업자 제한 체크
- PRD FEAT-1 구현
```

```
feat(subscription): 업그레이드 모달 컴포넌트 추가

- 비공격적 UI 적용
- "나중에" 버튼 포함
- Design System 문서 반영
```

---

## 10. AI 협업 프롬프트 템플릿

### 10.1 기능 구현 요청

```
## 작업
FEAT-1: 플랜 제한 시스템의 usePlanLimits 훅을 구현해주세요.

## 참조 문서
- 02-trd.md 섹션 5 (권한 모델)
- 04-database-design.md (테이블 구조)
- 07-coding-convention.md (훅 패턴)

## 제약 조건
- 기존 코드 스타일 유지 (useState, Tailwind)
- TypeScript strict 준수

## 예상 결과
- hooks/usePlanLimits.ts 파일 생성
- 프로젝트/내보내기/협업자 제한 체크 함수
```

### 10.2 컴포넌트 구현 요청

```
## 작업
업그레이드 안내 모달 컴포넌트를 구현해주세요.

## 참조 문서
- 05-design-system.md 섹션 4.3 (업그레이드 모달)
- 03-user-flow.md (비공격적 UX)

## 제약 조건
- X 버튼, "나중에" 버튼 필수
- 배경 클릭으로 닫기
- 기존 모달 스타일 참조

## 예상 결과
- components/subscription/UpgradeModal.tsx
```

---

## Decision Log

| # | 결정 | 이유 |
|---|------|------|
| D1 | 기존 useState 패턴 유지 | 변경 최소화, 일관성 |
| D2 | Supabase RLS 활용 | 보안 강화, 별도 미들웨어 불필요 |
| D3 | 훅으로 로직 분리 | 재사용성, 테스트 용이성 |
| D4 | 클라이언트+서버 이중 검증 | 보안, 사용자 경험 |
