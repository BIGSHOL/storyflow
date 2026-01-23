/**
 * 플랜 제한 서비스
 * 각 구독 플랜별 제한 사항 및 가격 정보 정의
 */

import { PlanType, PlanLimits } from '../types/subscription';

// 플랜별 제한 사항 정의
export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  free: {
    maxProjects: 3,
    maxExportsPerDay: 10,
    maxCollaborators: 1,
    canRemoveBranding: false,
    canManageTeam: false,
  },
  pro: {
    maxProjects: null,  // 무제한
    maxExportsPerDay: null,
    maxCollaborators: 5,
    canRemoveBranding: true,
    canManageTeam: false,
  },
  team: {
    maxProjects: null,
    maxExportsPerDay: null,
    maxCollaborators: null,  // 무제한
    canRemoveBranding: true,
    canManageTeam: true,
  },
};

// 플랜별 월 가격 (원화)
export const PLAN_PRICES: Record<PlanType, number> = {
  free: 0,
  pro: 9900,   // 월 9,900원
  team: 29900, // 월 29,900원
};

// 플랜 이름 (한글 표시용)
export const PLAN_NAMES: Record<PlanType, string> = {
  free: 'Free',
  pro: 'Pro',
  team: 'Team',
};

/**
 * 특정 플랜의 제한 사항을 반환합니다.
 * @param planType 플랜 타입
 * @returns 해당 플랜의 제한 사항
 */
export function getPlanLimits(planType: PlanType): PlanLimits {
  return PLAN_LIMITS[planType];
}

/**
 * 특정 플랜의 가격을 반환합니다.
 * @param planType 플랜 타입
 * @returns 월 가격 (원화)
 */
export function getPlanPrice(planType: PlanType): number {
  return PLAN_PRICES[planType];
}

/**
 * 가격을 포맷팅된 문자열로 변환합니다.
 * @param price 가격 (원화)
 * @returns 포맷팅된 가격 문자열
 */
export function formatPrice(price: number): string {
  return price === 0 ? '무료' : `₩${price.toLocaleString()}/월`;
}
