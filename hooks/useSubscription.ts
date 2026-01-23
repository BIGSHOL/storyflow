/**
 * 구독 정보 훅
 * 현재 사용자의 구독 상태, 사용량, 제한 정보를 관리
 */

import { useState, useEffect, useCallback } from 'react';
import { SubscriptionWithUsage } from '../types/subscription';
import { getSubscriptionWithUsage } from '../services/subscriptionService';

interface UseSubscriptionReturn {
  subscription: SubscriptionWithUsage | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useSubscription(): UseSubscriptionReturn {
  const [subscription, setSubscription] = useState<SubscriptionWithUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSubscription = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSubscriptionWithUsage();
      setSubscription(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  return {
    subscription,
    loading,
    error,
    refetch: fetchSubscription,
  };
}

export default useSubscription;
