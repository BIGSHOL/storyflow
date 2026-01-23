import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useSubscription } from '../../hooks/useSubscription';
import { mockFreeWithUsage, mockProWithUsage } from '../mocks/subscriptionMock';

// subscriptionService Mock
const mockGetSubscriptionWithUsage = vi.fn();

vi.mock('../../services/subscriptionService', () => ({
  getSubscriptionWithUsage: () => mockGetSubscriptionWithUsage(),
}));

describe('useSubscription', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('초기 상태는 loading=true, subscription=null이다', () => {
    mockGetSubscriptionWithUsage.mockReturnValue(new Promise(() => {})); // never resolves

    const { result } = renderHook(() => useSubscription());

    expect(result.current.loading).toBe(true);
    expect(result.current.subscription).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('구독 정보를 성공적으로 가져온다', async () => {
    mockGetSubscriptionWithUsage.mockResolvedValue(mockFreeWithUsage);

    const { result } = renderHook(() => useSubscription());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.subscription).toEqual(mockFreeWithUsage);
    expect(result.current.error).toBeNull();
  });

  it('Pro 구독 정보를 정상적으로 반환한다', async () => {
    mockGetSubscriptionWithUsage.mockResolvedValue(mockProWithUsage);

    const { result } = renderHook(() => useSubscription());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.subscription?.planType).toBe('pro');
    expect(result.current.subscription?.limits.maxProjects).toBeNull();
  });

  it('사용자가 없으면 subscription=null을 반환한다', async () => {
    mockGetSubscriptionWithUsage.mockResolvedValue(null);

    const { result } = renderHook(() => useSubscription());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.subscription).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('에러 발생 시 error 상태를 설정한다', async () => {
    const mockError = new Error('네트워크 오류');
    mockGetSubscriptionWithUsage.mockRejectedValue(mockError);

    const { result } = renderHook(() => useSubscription());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(mockError);
    expect(result.current.subscription).toBeNull();
  });

  it('refetch 호출 시 데이터를 다시 가져온다', async () => {
    mockGetSubscriptionWithUsage.mockResolvedValue(mockFreeWithUsage);

    const { result } = renderHook(() => useSubscription());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // 데이터 변경
    mockGetSubscriptionWithUsage.mockResolvedValue(mockProWithUsage);

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.subscription?.planType).toBe('pro');
  });

  it('refetch 시 에러를 초기화하고 다시 시도한다', async () => {
    // 첫 호출: 에러
    mockGetSubscriptionWithUsage.mockRejectedValue(new Error('실패'));

    const { result } = renderHook(() => useSubscription());

    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });

    // 재시도: 성공
    mockGetSubscriptionWithUsage.mockResolvedValue(mockFreeWithUsage);

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.subscription).toEqual(mockFreeWithUsage);
  });
});
