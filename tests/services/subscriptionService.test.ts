import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSubscription, getUsage, getSubscriptionWithUsage } from '../../services/subscriptionService';
import { MOCK_USER_ID, mockFreeSubscriptionRow, mockProSubscriptionRow } from '../mocks/subscriptionMock';

// Supabase 모듈 Mock
const mockGetUser = vi.fn();
const mockFrom = vi.fn();

vi.mock('../../services/supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: () => mockGetUser(),
    },
    from: (table: string) => mockFrom(table),
  },
}));

// 체이닝 헬퍼
function createQueryChain(result: any) {
  const chain: any = {};
  chain.select = vi.fn().mockReturnValue(chain);
  chain.eq = vi.fn().mockReturnValue(chain);
  chain.single = vi.fn().mockResolvedValue(result);
  chain.maybeSingle = vi.fn().mockResolvedValue(result);
  return chain;
}

describe('subscriptionService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getSubscription', () => {
    it('사용자가 없으면 null을 반환한다', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } });

      const result = await getSubscription();
      expect(result).toBeNull();
    });

    it('구독 정보를 camelCase로 변환하여 반환한다', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: MOCK_USER_ID } } });

      const chain = createQueryChain({ data: mockFreeSubscriptionRow, error: null });
      mockFrom.mockReturnValue(chain);

      const result = await getSubscription();

      expect(mockFrom).toHaveBeenCalledWith('subscriptions');
      expect(result).not.toBeNull();
      expect(result?.userId).toBe(MOCK_USER_ID);
      expect(result?.planType).toBe('free');
      expect(result?.status).toBe('active');
    });

    it('Pro 구독 정보를 정상 반환한다', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: MOCK_USER_ID } } });

      const chain = createQueryChain({ data: mockProSubscriptionRow, error: null });
      mockFrom.mockReturnValue(chain);

      const result = await getSubscription();

      expect(result?.planType).toBe('pro');
      expect(result?.billingKey).toBe('billing-key-123');
      expect(result?.currentPeriodEnd).toBe('2024-02-01T00:00:00Z');
    });

    it('Supabase 에러 시 null을 반환한다', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: MOCK_USER_ID } } });

      const chain = createQueryChain({ data: null, error: { message: 'DB error' } });
      mockFrom.mockReturnValue(chain);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = await getSubscription();

      expect(result).toBeNull();
      consoleSpy.mockRestore();
    });
  });

  describe('getUsage', () => {
    it('사용량을 정상적으로 조회한다', async () => {
      mockFrom.mockImplementation((table: string) => {
        if (table === 'projects') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ count: 2, data: null, error: null }),
            }),
          };
        }
        if (table === 'usage_logs') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  maybeSingle: vi.fn().mockResolvedValue({ data: { export_count: 5 }, error: null }),
                }),
              }),
            }),
          };
        }
        if (table === 'collaborators') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ count: 1, data: null, error: null }),
            }),
          };
        }
        return createQueryChain({ data: null, error: null });
      });

      const result = await getUsage(MOCK_USER_ID);

      expect(result.projectCount).toBe(2);
      expect(result.todayExportCount).toBe(5);
      expect(result.collaboratorCount).toBe(1);
    });

    it('데이터가 없을 때 0을 반환한다', async () => {
      mockFrom.mockImplementation((table: string) => {
        if (table === 'usage_logs') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
                }),
              }),
            }),
          };
        }
        // projects, collaborators
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ count: null, data: null, error: null }),
          }),
        };
      });

      const result = await getUsage(MOCK_USER_ID);

      expect(result.projectCount).toBe(0);
      expect(result.todayExportCount).toBe(0);
      expect(result.collaboratorCount).toBe(0);
    });
  });

  describe('getSubscriptionWithUsage', () => {
    it('사용자가 없으면 null을 반환한다', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } });

      const result = await getSubscriptionWithUsage();
      expect(result).toBeNull();
    });

    it('구독 + 사용량 + 제한을 통합하여 반환한다', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: MOCK_USER_ID } } });

      mockFrom.mockImplementation((table: string) => {
        if (table === 'subscriptions') {
          const chain: any = {};
          chain.select = vi.fn().mockReturnValue(chain);
          chain.eq = vi.fn().mockReturnValue(chain);
          chain.single = vi.fn().mockResolvedValue({ data: mockFreeSubscriptionRow, error: null });
          return chain;
        }
        if (table === 'usage_logs') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
                }),
              }),
            }),
          };
        }
        // projects, collaborators
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ count: 0, data: null, error: null }),
          }),
        };
      });

      const result = await getSubscriptionWithUsage();

      expect(result).not.toBeNull();
      expect(result?.planType).toBe('free');
      expect(result?.limits).toBeDefined();
      expect(result?.limits.maxProjects).toBe(3);
      expect(result?.usage).toBeDefined();
      expect(result?.usage.projectCount).toBe(0);
    });
  });
});
