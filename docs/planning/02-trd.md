# TRD (기술 요구사항 정의서)

> StoryFlow Creator 수익화 기능 - 기술 설계

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

## 1. 시스템 아키텍처

### 1.1 고수준 아키텍처

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   React App     │────▶│  Supabase       │────▶│  PostgreSQL     │
│   (Vite)        │     │  (Auth + DB)    │     │  (Supabase)     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │
        │                       ▼
        │               ┌─────────────────┐
        │               │  Edge Functions │
        │               │  (Deno/TS)      │
        │               └─────────────────┘
        │                       │
        ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│  토스페이먼츠    │◀───│  Webhook        │
│  (결제)         │     │  Handler        │
└─────────────────┘     └─────────────────┘
```

### 1.2 컴포넌트 설명

| 컴포넌트 | 역할 | 왜 이 선택? |
|----------|------|-------------|
| React + Vite | 프론트엔드 UI | 기존 프로젝트 유지, 변경 최소화 |
| Supabase | 인증/DB/실시간 | 이미 사용 중, 통합 관리 편리 |
| Edge Functions | 웹훅 처리, 결제 검증 | 별도 서버 없이 서버리스 |
| PostgreSQL | 데이터 저장 | Supabase 기본 DB |
| 토스페이먼츠 | 결제 처리 | 한국 결제에 최적화 |

---

## 2. 권장 기술 스택

### 2.1 프론트엔드 (기존 유지)

| 항목 | 선택 | 이유 | 벤더 락인 리스크 |
|------|------|------|-----------------|
| 프레임워크 | React 19 | 기존 프로젝트 | 낮음 |
| 빌드 도구 | Vite 6 | 기존 프로젝트 | 낮음 |
| 언어 | TypeScript | 기존 프로젝트 | - |
| 스타일링 | Tailwind CSS | 기존 프로젝트 | 낮음 |
| HTTP 클라이언트 | Supabase Client | 기존 사용 중 | 중간 |

### 2.2 백엔드

| 항목 | 선택 | 이유 | 벤더 락인 리스크 |
|------|------|------|-----------------|
| 서버 | Supabase Edge Functions | 별도 서버 불필요, 통합 관리 | 중간 |
| 언어 | TypeScript (Deno) | Edge Functions 기본 | 낮음 |
| 검증 | Zod | 타입 안전 검증 | 낮음 |

### 2.3 데이터베이스 (기존 유지)

| 항목 | 선택 | 이유 |
|------|------|------|
| 메인 DB | Supabase PostgreSQL | 기존 사용 중, 구독 테이블 추가 |
| 실시간 | Supabase Realtime | 플랜 변경 실시간 반영 |

### 2.4 결제 인프라

| 항목 | 선택 | 이유 |
|------|------|------|
| 결제사 | 토스페이먼츠 | 한국 결제 최적화, 원화 결제 |
| 구독 관리 | 토스페이먼츠 빌링 | 정기 결제 자동화 |

---

## 3. 비기능 요구사항

### 3.1 성능

| 항목 | 요구사항 | 측정 방법 |
|------|----------|----------|
| 결제 응답 시간 | < 3초 | 토스페이먼츠 응답 로그 |
| 플랜 확인 | < 100ms | Supabase 쿼리 시간 |
| 제한 체크 | 클라이언트 캐시 | React Query 캐싱 |

### 3.2 보안

| 항목 | 요구사항 |
|------|----------|
| 결제 정보 | 토스페이먼츠에서만 처리 (PCI DSS 준수) |
| 웹훅 검증 | 토스 시그니처 검증 필수 |
| 플랜 권한 | RLS (Row Level Security) 적용 |
| API 키 | 환경 변수로 관리 |

### 3.3 확장성

| 항목 | 현재 | 목표 |
|------|------|------|
| 유료 구독자 | 0명 | 100명 (6개월) |
| 결제 처리 | 개인 규모 | 소규모 사업 |

---

## 4. 외부 API 연동

### 4.1 토스페이먼츠 연동

| API | 용도 | 필수/선택 |
|-----|------|----------|
| 빌링키 발급 | 카드 등록 | 필수 |
| 자동 결제 | 정기 결제 | 필수 |
| 결제 취소 | 환불 처리 | 필수 |
| 웹훅 | 결제 상태 동기화 | 필수 |

### 4.2 연동 흐름

```
1. 카드 등록
   User → 토스 결제창 → 빌링키 발급 → Supabase 저장

2. 정기 결제
   Scheduler → Edge Function → 토스 자동결제 → Webhook → DB 업데이트

3. 결제 취소
   User → Edge Function → 토스 취소 → Webhook → 플랜 다운그레이드
```

---

## 5. 접근제어·권한 모델

### 5.1 플랜별 역할

| 역할 | 설명 | 권한 |
|------|------|------|
| Free | 무료 사용자 | 프로젝트 3개, 내보내기 10회/일, 협업자 1명 |
| Pro | Pro 구독자 | 프로젝트 무제한, 내보내기 무제한, 협업자 5명 |
| Team | Team 구독자 | Pro + 협업자 무제한, 팀 관리 |

### 5.2 권한 매트릭스

| 기능 | Free | Pro | Team |
|------|------|-----|------|
| 프로젝트 생성 | 3개 | 무제한 | 무제한 |
| 내보내기 | 10회/일 | 무제한 | 무제한 |
| 협업자 초대 | 1명 | 5명 | 무제한 |
| 브랜딩 제거 | X | O | O |
| 팀 관리 | X | X | O |

### 5.3 제한 체크 로직

```typescript
interface PlanLimits {
  maxProjects: number | null;  // null = 무제한
  maxExportsPerDay: number | null;
  maxCollaborators: number | null;
  canRemoveBranding: boolean;
  canManageTeam: boolean;
}

const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
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
```

---

## 6. 데이터 생명주기

### 6.1 구독 데이터

| 데이터 유형 | 보존 기간 | 삭제/익명화 |
|------------|----------|------------|
| 구독 정보 | 구독 취소 후 30일 | 익명화 |
| 결제 내역 | 5년 (법적 의무) | 보관 |
| 빌링키 | 구독 취소 시 | 토스에서 삭제 |

### 6.2 기존 사용자 마이그레이션

```
1. 기존 사용자 → 자동으로 Free 플랜 배정
2. 기존 프로젝트 → 개수 상관없이 유지 (grandfather 정책)
3. 새 프로젝트 생성 시 → 제한 체크 적용
```

---

## 7. 테스트 전략

### 7.1 테스트 범위

| 레벨 | 도구 | 커버리지 목표 |
|------|------|-------------|
| Unit | Vitest | ≥ 80% (제한 로직) |
| Integration | Vitest + MSW | 결제 플로우 |
| E2E | Playwright | 구독/취소 흐름 |

### 7.2 Mock 전략

```typescript
// MSW로 토스페이먼츠 API Mock
export const tossPaymentHandlers = [
  // 빌링키 발급 Mock
  http.post('/v1/billing/authorizations/card', () => {
    return HttpResponse.json({
      billingKey: 'mock_billing_key',
      customerKey: 'mock_customer_key',
    });
  }),

  // 자동 결제 Mock
  http.post('/v1/billing/:billingKey', () => {
    return HttpResponse.json({
      paymentKey: 'mock_payment_key',
      orderId: 'mock_order_id',
      status: 'DONE',
    });
  }),
];
```

### 7.3 테스트 시나리오

| 시나리오 | 기대 결과 |
|----------|----------|
| 무료 사용자가 4번째 프로젝트 생성 시도 | 업그레이드 안내 모달 표시 |
| Pro 사용자가 프로젝트 생성 | 제한 없이 생성 성공 |
| 결제 성공 웹훅 수신 | 플랜 업그레이드 및 DB 반영 |
| 결제 실패 웹훅 수신 | 사용자 알림 및 재시도 안내 |
| 구독 취소 요청 | 다음 결제일까지 Pro 유지, 이후 Free |

---

## 8. API 설계

### 8.1 플랜 관련 API

```
GET  /api/subscription          # 현재 구독 정보 조회
POST /api/subscription/checkout # 결제 세션 생성
POST /api/subscription/cancel   # 구독 취소
GET  /api/subscription/usage    # 사용량 조회 (프로젝트 수 등)
```

### 8.2 웹훅 API

```
POST /api/webhooks/toss         # 토스페이먼츠 웹훅 수신
```

### 8.3 응답 형식

**구독 정보 응답:**
```json
{
  "data": {
    "plan": "pro",
    "status": "active",
    "currentPeriodEnd": "2024-02-15T00:00:00Z",
    "limits": {
      "maxProjects": null,
      "maxExportsPerDay": null,
      "maxCollaborators": 5,
      "canRemoveBranding": true
    },
    "usage": {
      "projectCount": 12,
      "todayExportCount": 3,
      "collaboratorCount": 2
    }
  }
}
```

**제한 도달 에러:**
```json
{
  "error": {
    "code": "PLAN_LIMIT_REACHED",
    "message": "프로젝트 한도에 도달했습니다",
    "details": {
      "limit": 3,
      "current": 3,
      "upgradeUrl": "/pricing"
    }
  }
}
```

---

## 9. 파일 구조 (추가될 파일)

```
storyflow-creator/
├── services/
│   ├── subscriptionService.ts   # 구독 관련 비즈니스 로직
│   ├── planLimitService.ts      # 플랜 제한 체크 로직
│   └── exportLimitService.ts    # 기존 (일일 내보내기 제한)
├── components/
│   ├── PricingModal.tsx         # 요금제 비교 모달
│   ├── UpgradePrompt.tsx        # 업그레이드 유도 UI
│   └── SubscriptionStatus.tsx   # 현재 구독 상태 표시
├── hooks/
│   ├── useSubscription.ts       # 구독 정보 조회 훅
│   └── usePlanLimits.ts         # 플랜 제한 체크 훅
├── types/
│   └── subscription.ts          # 구독 관련 타입 정의
└── supabase/
    └── functions/
        ├── create-checkout/     # 결제 세션 생성
        ├── handle-webhook/      # 웹훅 처리
        └── cancel-subscription/ # 구독 취소
```

---

## Decision Log

| # | 결정 | 이유 |
|---|------|------|
| D1 | Supabase Edge Functions | 별도 서버 없이 웹훅 처리 가능 |
| D2 | 토스페이먼츠 빌링 | 한국 정기결제에 최적화 |
| D3 | 클라이언트 캐싱 | 플랜 체크 성능 최적화 |
| D4 | Grandfather 정책 | 기존 사용자 불만 방지 |
| D5 | 서버 측 제한 검증 | 클라이언트 우회 방지 |
