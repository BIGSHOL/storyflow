/**
 * 구독 플랜 관련 타입 정의
 * StoryFlow Creator 구독 시스템
 * Supabase snake_case ↔ Frontend camelCase 변환 고려
 */

// ========== 기본 타입 ==========

/**
 * 구독 플랜 타입
 * - free: 무료 플랜 (기본)
 * - pro: 프로 플랜 (개인 유료)
 * - team: 팀 플랜 (팀/기업용)
 */
export type PlanType = 'free' | 'pro' | 'team';

/**
 * 구독 상태
 * - active: 활성 (정상 이용 중)
 * - canceled: 취소됨 (기간 만료 전까지 이용 가능)
 * - past_due: 결제 연체 (결제 실패 상태)
 * - expired: 만료됨 (이용 불가)
 */
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'expired';

// ========== 플랜 제한 ==========

/**
 * 플랜별 기능 제한
 */
export interface PlanLimits {
  /** 최대 프로젝트 수 (null = 무제한) */
  maxProjects: number | null;
  /** 일일 최대 내보내기 횟수 (null = 무제한) */
  maxExportsPerDay: number | null;
  /** 최대 협업자 수 (null = 무제한) */
  maxCollaborators: number | null;
  /** 브랜딩(워터마크) 제거 가능 여부 */
  canRemoveBranding: boolean;
  /** 팀 관리 기능 사용 가능 여부 */
  canManageTeam: boolean;
}

// ========== 구독 정보 ==========

/**
 * 구독 정보
 */
export interface Subscription {
  /** 구독 ID */
  id: string;
  /** 사용자 ID */
  userId: string;
  /** 플랜 타입 */
  planType: PlanType;
  /** 구독 상태 */
  status: SubscriptionStatus;
  /** 결제 빌링키 (PG사 연동용, 선택) */
  billingKey?: string;
  /** 현재 구독 기간 시작일 (ISO 8601) */
  currentPeriodStart: string;
  /** 현재 구독 기간 종료일 (ISO 8601, 선택) */
  currentPeriodEnd?: string;
  /** 취소 일시 (ISO 8601, 선택) */
  canceledAt?: string;
  /** 생성 일시 (ISO 8601) */
  createdAt: string;
  /** 수정 일시 (ISO 8601) */
  updatedAt: string;
}

// ========== 사용량 ==========

/**
 * 현재 사용량 정보
 */
export interface Usage {
  /** 현재 프로젝트 수 */
  projectCount: number;
  /** 오늘 내보내기 횟수 */
  todayExportCount: number;
  /** 현재 협업자 수 */
  collaboratorCount: number;
}

// ========== 통합 타입 ==========

/**
 * 구독 정보 + 사용량 + 제한 통합 타입
 * UI에서 구독 상태와 제한을 함께 표시할 때 사용
 */
export interface SubscriptionWithUsage extends Subscription {
  /** 현재 사용량 */
  usage: Usage;
  /** 플랜별 제한 */
  limits: PlanLimits;
}

// ========== 플랜별 기본 제한 상수 ==========

/**
 * 플랜별 기본 제한 설정
 * 실제 값은 서버에서 관리하며, 이는 클라이언트 참조용
 */
export const DEFAULT_PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  free: {
    maxProjects: 3,
    maxExportsPerDay: 5,
    maxCollaborators: 0,
    canRemoveBranding: false,
    canManageTeam: false,
  },
  pro: {
    maxProjects: null, // 무제한
    maxExportsPerDay: null, // 무제한
    maxCollaborators: 5,
    canRemoveBranding: true,
    canManageTeam: false,
  },
  team: {
    maxProjects: null, // 무제한
    maxExportsPerDay: null, // 무제한
    maxCollaborators: null, // 무제한
    canManageTeam: true,
    canRemoveBranding: true,
  },
};

// ========== Supabase 테이블 타입 (snake_case) ==========

/**
 * Supabase subscriptions 테이블 Row 타입
 * DB 스키마와 1:1 매핑
 */
export interface SubscriptionRow {
  id: string;
  user_id: string;
  plan_type: PlanType;
  status: SubscriptionStatus;
  billing_key: string | null;
  current_period_start: string;
  current_period_end: string | null;
  canceled_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Supabase subscriptions 테이블 Insert 타입
 */
export interface SubscriptionInsert {
  id?: string;
  user_id: string;
  plan_type?: PlanType;
  status?: SubscriptionStatus;
  billing_key?: string | null;
  current_period_start?: string;
  current_period_end?: string | null;
  canceled_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Supabase subscriptions 테이블 Update 타입
 */
export interface SubscriptionUpdate {
  id?: string;
  user_id?: string;
  plan_type?: PlanType;
  status?: SubscriptionStatus;
  billing_key?: string | null;
  current_period_start?: string;
  current_period_end?: string | null;
  canceled_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

// ========== 변환 헬퍼 ==========

/**
 * Supabase Row (snake_case) → Frontend (camelCase) 변환
 */
export function toSubscription(row: SubscriptionRow): Subscription {
  return {
    id: row.id,
    userId: row.user_id,
    planType: row.plan_type,
    status: row.status,
    billingKey: row.billing_key ?? undefined,
    currentPeriodStart: row.current_period_start,
    currentPeriodEnd: row.current_period_end ?? undefined,
    canceledAt: row.canceled_at ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Frontend (camelCase) → Supabase Insert (snake_case) 변환
 */
export function toSubscriptionInsert(
  subscription: Partial<Subscription> & { userId: string }
): SubscriptionInsert {
  return {
    id: subscription.id,
    user_id: subscription.userId,
    plan_type: subscription.planType,
    status: subscription.status,
    billing_key: subscription.billingKey ?? null,
    current_period_start: subscription.currentPeriodStart,
    current_period_end: subscription.currentPeriodEnd ?? null,
    canceled_at: subscription.canceledAt ?? null,
    created_at: subscription.createdAt,
    updated_at: subscription.updatedAt,
  };
}
