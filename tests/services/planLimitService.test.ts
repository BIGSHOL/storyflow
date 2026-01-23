import { describe, it, expect } from 'vitest';
import {
  PLAN_LIMITS,
  PLAN_PRICES,
  PLAN_NAMES,
  getPlanLimits,
  getPlanPrice,
  formatPrice,
  checkProjectLimit,
  checkExportLimit,
  checkCollaboratorLimit,
  checkCanRemoveBranding,
} from '../../services/planLimitService';

describe('planLimitService', () => {
  describe('PLAN_LIMITS 상수', () => {
    it('free 플랜은 프로젝트 3개 제한', () => {
      expect(PLAN_LIMITS.free.maxProjects).toBe(3);
    });

    it('free 플랜은 일일 내보내기 10회 제한', () => {
      expect(PLAN_LIMITS.free.maxExportsPerDay).toBe(10);
    });

    it('free 플랜은 협업자 1명 제한', () => {
      expect(PLAN_LIMITS.free.maxCollaborators).toBe(1);
    });

    it('free 플랜은 브랜딩 제거 불가', () => {
      expect(PLAN_LIMITS.free.canRemoveBranding).toBe(false);
    });

    it('pro 플랜은 프로젝트 무제한', () => {
      expect(PLAN_LIMITS.pro.maxProjects).toBeNull();
    });

    it('pro 플랜은 내보내기 무제한', () => {
      expect(PLAN_LIMITS.pro.maxExportsPerDay).toBeNull();
    });

    it('pro 플랜은 협업자 5명 제한', () => {
      expect(PLAN_LIMITS.pro.maxCollaborators).toBe(5);
    });

    it('pro 플랜은 브랜딩 제거 가능', () => {
      expect(PLAN_LIMITS.pro.canRemoveBranding).toBe(true);
    });

    it('team 플랜은 모든 제한 무제한', () => {
      expect(PLAN_LIMITS.team.maxProjects).toBeNull();
      expect(PLAN_LIMITS.team.maxExportsPerDay).toBeNull();
      expect(PLAN_LIMITS.team.maxCollaborators).toBeNull();
    });

    it('team 플랜은 팀 관리 가능', () => {
      expect(PLAN_LIMITS.team.canManageTeam).toBe(true);
    });
  });

  describe('PLAN_PRICES 상수', () => {
    it('free는 0원', () => {
      expect(PLAN_PRICES.free).toBe(0);
    });

    it('pro는 9,900원', () => {
      expect(PLAN_PRICES.pro).toBe(9900);
    });

    it('team은 29,900원', () => {
      expect(PLAN_PRICES.team).toBe(29900);
    });
  });

  describe('PLAN_NAMES 상수', () => {
    it('플랜 이름이 정의되어 있다', () => {
      expect(PLAN_NAMES.free).toBe('Free');
      expect(PLAN_NAMES.pro).toBe('Pro');
      expect(PLAN_NAMES.team).toBe('Team');
    });
  });

  describe('getPlanLimits', () => {
    it('플랜 타입에 맞는 제한을 반환한다', () => {
      expect(getPlanLimits('free')).toBe(PLAN_LIMITS.free);
      expect(getPlanLimits('pro')).toBe(PLAN_LIMITS.pro);
      expect(getPlanLimits('team')).toBe(PLAN_LIMITS.team);
    });
  });

  describe('getPlanPrice', () => {
    it('플랜 타입에 맞는 가격을 반환한다', () => {
      expect(getPlanPrice('free')).toBe(0);
      expect(getPlanPrice('pro')).toBe(9900);
      expect(getPlanPrice('team')).toBe(29900);
    });
  });

  describe('formatPrice', () => {
    it('0원은 "무료"로 표시', () => {
      expect(formatPrice(0)).toBe('무료');
    });

    it('유료 가격은 ₩ 포맷으로 표시', () => {
      expect(formatPrice(9900)).toContain('9,900');
      expect(formatPrice(9900)).toContain('/월');
    });
  });

  describe('checkProjectLimit', () => {
    it('free 플랜 - 제한 미만이면 true', () => {
      expect(checkProjectLimit('free', 0)).toBe(true);
      expect(checkProjectLimit('free', 1)).toBe(true);
      expect(checkProjectLimit('free', 2)).toBe(true);
    });

    it('free 플랜 - 제한 도달이면 false', () => {
      expect(checkProjectLimit('free', 3)).toBe(false);
    });

    it('free 플랜 - 제한 초과이면 false', () => {
      expect(checkProjectLimit('free', 5)).toBe(false);
    });

    it('pro 플랜은 항상 true (무제한)', () => {
      expect(checkProjectLimit('pro', 0)).toBe(true);
      expect(checkProjectLimit('pro', 100)).toBe(true);
      expect(checkProjectLimit('pro', 9999)).toBe(true);
    });

    it('team 플랜은 항상 true (무제한)', () => {
      expect(checkProjectLimit('team', 1000)).toBe(true);
    });
  });

  describe('checkExportLimit', () => {
    it('free 플랜 - 제한 미만이면 true', () => {
      expect(checkExportLimit('free', 0)).toBe(true);
      expect(checkExportLimit('free', 9)).toBe(true);
    });

    it('free 플랜 - 제한 도달이면 false', () => {
      expect(checkExportLimit('free', 10)).toBe(false);
    });

    it('free 플랜 - 제한 초과이면 false', () => {
      expect(checkExportLimit('free', 15)).toBe(false);
    });

    it('pro 플랜은 항상 true (무제한)', () => {
      expect(checkExportLimit('pro', 0)).toBe(true);
      expect(checkExportLimit('pro', 1000)).toBe(true);
    });

    it('team 플랜은 항상 true (무제한)', () => {
      expect(checkExportLimit('team', 9999)).toBe(true);
    });
  });

  describe('checkCollaboratorLimit', () => {
    it('free 플랜 - 제한 미만이면 true', () => {
      expect(checkCollaboratorLimit('free', 0)).toBe(true);
    });

    it('free 플랜 - 제한 도달이면 false', () => {
      expect(checkCollaboratorLimit('free', 1)).toBe(false);
    });

    it('pro 플랜 - 5명 미만이면 true', () => {
      expect(checkCollaboratorLimit('pro', 0)).toBe(true);
      expect(checkCollaboratorLimit('pro', 4)).toBe(true);
    });

    it('pro 플랜 - 5명 도달이면 false', () => {
      expect(checkCollaboratorLimit('pro', 5)).toBe(false);
    });

    it('team 플랜은 항상 true (무제한)', () => {
      expect(checkCollaboratorLimit('team', 0)).toBe(true);
      expect(checkCollaboratorLimit('team', 100)).toBe(true);
    });
  });

  describe('checkCanRemoveBranding', () => {
    it('free 플랜은 false', () => {
      expect(checkCanRemoveBranding('free')).toBe(false);
    });

    it('pro 플랜은 true', () => {
      expect(checkCanRemoveBranding('pro')).toBe(true);
    });

    it('team 플랜은 true', () => {
      expect(checkCanRemoveBranding('team')).toBe(true);
    });
  });
});
