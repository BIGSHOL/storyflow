import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePlanLimits } from '../../hooks/usePlanLimits';
import { mockFreeWithUsage, mockFreeAtLimit, mockProWithUsage, mockTeamWithUsage } from '../mocks/subscriptionMock';

// subscriptionService Mock
const mockGetSubscriptionWithUsage = vi.fn();

vi.mock('../../services/subscriptionService', () => ({
  getSubscriptionWithUsage: () => mockGetSubscriptionWithUsage(),
}));

describe('usePlanLimits', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('로딩 상태', () => {
    it('로딩 중일 때 모든 체크 함수는 false를 반환한다', () => {
      mockGetSubscriptionWithUsage.mockReturnValue(new Promise(() => {}));

      const { result } = renderHook(() => usePlanLimits());

      expect(result.current.loading).toBe(true);
      expect(result.current.canCreateProject()).toBe(false);
      expect(result.current.canExport()).toBe(false);
      expect(result.current.canInviteCollaborator(0)).toBe(false);
      expect(result.current.canRemoveBranding()).toBe(false);
    });

    it('구독 정보가 없으면 모든 체크 함수는 false를 반환한다', async () => {
      mockGetSubscriptionWithUsage.mockResolvedValue(null);

      const { result } = renderHook(() => usePlanLimits());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.canCreateProject()).toBe(false);
      expect(result.current.canExport()).toBe(false);
      expect(result.current.canInviteCollaborator(0)).toBe(false);
      expect(result.current.canRemoveBranding()).toBe(false);
    });
  });

  describe('Free 플랜 - 제한 미도달', () => {
    beforeEach(() => {
      mockGetSubscriptionWithUsage.mockResolvedValue(mockFreeWithUsage);
    });

    it('프로젝트 생성 가능 (1/3)', async () => {
      const { result } = renderHook(() => usePlanLimits());
      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.canCreateProject()).toBe(true);
    });

    it('내보내기 가능 (2/10)', async () => {
      const { result } = renderHook(() => usePlanLimits());
      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.canExport()).toBe(true);
    });

    it('협업자 초대 가능 (0/1)', async () => {
      const { result } = renderHook(() => usePlanLimits());
      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.canInviteCollaborator(0)).toBe(true);
    });

    it('브랜딩 제거 불가', async () => {
      const { result } = renderHook(() => usePlanLimits());
      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.canRemoveBranding()).toBe(false);
    });
  });

  describe('Free 플랜 - 제한 도달', () => {
    beforeEach(() => {
      mockGetSubscriptionWithUsage.mockResolvedValue(mockFreeAtLimit);
    });

    it('프로젝트 생성 불가 (3/3)', async () => {
      const { result } = renderHook(() => usePlanLimits());
      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.canCreateProject()).toBe(false);
    });

    it('내보내기 불가 (10/10)', async () => {
      const { result } = renderHook(() => usePlanLimits());
      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.canExport()).toBe(false);
    });

    it('협업자 초대 불가 (1/1)', async () => {
      const { result } = renderHook(() => usePlanLimits());
      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.canInviteCollaborator(1)).toBe(false);
    });
  });

  describe('Pro 플랜', () => {
    beforeEach(() => {
      mockGetSubscriptionWithUsage.mockResolvedValue(mockProWithUsage);
    });

    it('프로젝트 생성 항상 가능', async () => {
      const { result } = renderHook(() => usePlanLimits());
      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.canCreateProject()).toBe(true);
    });

    it('내보내기 항상 가능', async () => {
      const { result } = renderHook(() => usePlanLimits());
      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.canExport()).toBe(true);
    });

    it('협업자 5명 미만이면 초대 가능', async () => {
      const { result } = renderHook(() => usePlanLimits());
      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.canInviteCollaborator(4)).toBe(true);
      expect(result.current.canInviteCollaborator(5)).toBe(false);
    });

    it('브랜딩 제거 가능', async () => {
      const { result } = renderHook(() => usePlanLimits());
      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.canRemoveBranding()).toBe(true);
    });
  });

  describe('Team 플랜', () => {
    beforeEach(() => {
      mockGetSubscriptionWithUsage.mockResolvedValue(mockTeamWithUsage);
    });

    it('모든 기능 무제한', async () => {
      const { result } = renderHook(() => usePlanLimits());
      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.canCreateProject()).toBe(true);
      expect(result.current.canExport()).toBe(true);
      expect(result.current.canInviteCollaborator(100)).toBe(true);
      expect(result.current.canRemoveBranding()).toBe(true);
    });
  });
});
