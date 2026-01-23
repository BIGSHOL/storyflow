/**
 * 구독 Mock 데이터
 * 테스트에서 사용하는 구독/사용량 Mock
 */

import type {
  Subscription,
  SubscriptionWithUsage,
  Usage,
  PlanLimits,
  SubscriptionRow,
} from '../../types/subscription';
import { PLAN_LIMITS } from '../../services/planLimitService';

// ========== Mock 사용자 ==========

export const MOCK_USER_ID = 'mock-user-001';
export const MOCK_USER = {
  id: MOCK_USER_ID,
  email: 'test@example.com',
};

// ========== Mock 구독 (Frontend camelCase) ==========

export const mockFreeSubscription: Subscription = {
  id: 'mock-sub-free',
  userId: MOCK_USER_ID,
  planType: 'free',
  status: 'active',
  currentPeriodStart: '2024-01-01T00:00:00Z',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

export const mockProSubscription: Subscription = {
  id: 'mock-sub-pro',
  userId: MOCK_USER_ID,
  planType: 'pro',
  status: 'active',
  currentPeriodStart: '2024-01-01T00:00:00Z',
  currentPeriodEnd: '2024-02-01T00:00:00Z',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

export const mockTeamSubscription: Subscription = {
  id: 'mock-sub-team',
  userId: MOCK_USER_ID,
  planType: 'team',
  status: 'active',
  currentPeriodStart: '2024-01-01T00:00:00Z',
  currentPeriodEnd: '2024-02-01T00:00:00Z',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

export const mockCanceledSubscription: Subscription = {
  id: 'mock-sub-canceled',
  userId: MOCK_USER_ID,
  planType: 'pro',
  status: 'canceled',
  currentPeriodStart: '2024-01-01T00:00:00Z',
  currentPeriodEnd: '2024-02-01T00:00:00Z',
  canceledAt: '2024-01-15T00:00:00Z',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-15T00:00:00Z',
};

// ========== Mock 구독 Row (Supabase snake_case) ==========

export const mockFreeSubscriptionRow: SubscriptionRow = {
  id: 'mock-sub-free',
  user_id: MOCK_USER_ID,
  plan_type: 'free',
  status: 'active',
  billing_key: null,
  current_period_start: '2024-01-01T00:00:00Z',
  current_period_end: null,
  canceled_at: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const mockProSubscriptionRow: SubscriptionRow = {
  id: 'mock-sub-pro',
  user_id: MOCK_USER_ID,
  plan_type: 'pro',
  status: 'active',
  billing_key: 'billing-key-123',
  current_period_start: '2024-01-01T00:00:00Z',
  current_period_end: '2024-02-01T00:00:00Z',
  canceled_at: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

// ========== Mock 사용량 ==========

export const mockUsageUnderLimit: Usage = {
  projectCount: 1,
  todayExportCount: 2,
  collaboratorCount: 0,
};

export const mockUsageAtLimit: Usage = {
  projectCount: 3,
  todayExportCount: 10,
  collaboratorCount: 1,
};

export const mockUsageOverLimit: Usage = {
  projectCount: 5,
  todayExportCount: 15,
  collaboratorCount: 3,
};

export const mockUsageEmpty: Usage = {
  projectCount: 0,
  todayExportCount: 0,
  collaboratorCount: 0,
};

// ========== Mock SubscriptionWithUsage ==========

export const mockFreeWithUsage: SubscriptionWithUsage = {
  ...mockFreeSubscription,
  limits: PLAN_LIMITS.free,
  usage: mockUsageUnderLimit,
};

export const mockFreeAtLimit: SubscriptionWithUsage = {
  ...mockFreeSubscription,
  limits: PLAN_LIMITS.free,
  usage: mockUsageAtLimit,
};

export const mockProWithUsage: SubscriptionWithUsage = {
  ...mockProSubscription,
  limits: PLAN_LIMITS.pro,
  usage: mockUsageUnderLimit,
};

export const mockTeamWithUsage: SubscriptionWithUsage = {
  ...mockTeamSubscription,
  limits: PLAN_LIMITS.team,
  usage: mockUsageUnderLimit,
};

// ========== Supabase 응답 Mock 헬퍼 ==========

export function mockSupabaseSubscriptionResponse(row: SubscriptionRow | null, error: any = null) {
  return {
    data: row,
    error,
  };
}

export function mockSupabaseCountResponse(count: number, error: any = null) {
  return {
    count,
    data: null,
    error,
  };
}

export function mockSupabaseUsageLogResponse(exportCount: number = 0, error: any = null) {
  return {
    data: exportCount > 0
      ? { id: 'usage-1', user_id: MOCK_USER_ID, usage_date: '2024-01-15', export_count: exportCount }
      : null,
    error,
  };
}
