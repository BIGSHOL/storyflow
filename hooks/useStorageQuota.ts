import { useState, useEffect, useCallback } from 'react';
import { getStorageUsage, formatBytes, type StorageInfo } from '../services/mediaService';
import { useAuth } from './useAuth';

interface UseStorageQuotaResult {
  storageInfo: StorageInfo | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  formatBytes: (bytes: number) => string;
  isOverQuota: boolean;
  isNearQuota: boolean; // 80% 이상 사용 시
}

export const useStorageQuota = (): UseStorageQuotaResult => {
  const { isAuthenticated } = useAuth();
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setStorageInfo(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await getStorageUsage();
      if (fetchError) {
        setError(fetchError);
      } else {
        setStorageInfo(data);
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // 로그인 상태 변경 시 용량 정보 새로고침
  useEffect(() => {
    if (isAuthenticated) {
      refresh();
    } else {
      setStorageInfo(null);
    }
  }, [isAuthenticated, refresh]);

  const isOverQuota = storageInfo ? storageInfo.percentage >= 100 : false;
  const isNearQuota = storageInfo ? storageInfo.percentage >= 80 : false;

  return {
    storageInfo,
    loading,
    error,
    refresh,
    formatBytes,
    isOverQuota,
    isNearQuota,
  };
};

export default useStorageQuota;
