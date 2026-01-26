/**
 * 플랜별 일일 내보내기 제한 서비스
 * - 무료티어: 하루 10회 제한
 * - Pro/Team: 무제한
 * - 초기화 시간: 한국시간 오전 6시 (UTC+9)
 */

import { getSubscription } from './subscriptionService';

const STORAGE_KEY = 'storyflow_export_limit';
const FREE_DAILY_LIMIT = 10;
const RESET_HOUR_KST = 6; // 한국시간 오전 6시

interface ExportLimitData {
  count: number;
  lastResetDate: string; // YYYY-MM-DD format in KST
}

/**
 * 현재 한국시간 기준 날짜 문자열 반환 (YYYY-MM-DD)
 * 오전 6시 이전이면 전날로 계산
 */
const getKSTDateString = (): string => {
  const now = new Date();
  // UTC to KST (+9 hours)
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstTime = new Date(now.getTime() + kstOffset);

  // 오전 6시 이전이면 전날로 계산
  if (kstTime.getUTCHours() < RESET_HOUR_KST) {
    kstTime.setUTCDate(kstTime.getUTCDate() - 1);
  }

  return kstTime.toISOString().split('T')[0];
};

/**
 * 저장된 내보내기 제한 데이터 가져오기
 */
const getExportLimitData = (): ExportLimitData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to parse export limit data:', e);
  }
  return { count: 0, lastResetDate: '' };
};

/**
 * 내보내기 제한 데이터 저장
 */
const saveExportLimitData = (data: ExportLimitData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save export limit data:', e);
  }
};

/**
 * 현재 남은 내보내기 횟수 확인
 */
export const getRemainingExports = async (): Promise<number> => {
  const subscription = await getSubscription();

  // Pro나 Team 플랜은 무제한
  if (subscription?.planType === 'pro' || subscription?.planType === 'team') {
    return Infinity;
  }

  const data = getExportLimitData();
  const currentDate = getKSTDateString();

  // 날짜가 다르면 리셋
  if (data.lastResetDate !== currentDate) {
    return FREE_DAILY_LIMIT;
  }

  return Math.max(0, FREE_DAILY_LIMIT - data.count);
};

/**
 * 내보내기 가능 여부 확인
 */
export const canExport = async (): Promise<boolean> => {
  const remaining = await getRemainingExports();
  return remaining > 0;
};

/**
 * 내보내기 사용 기록 (내보내기 성공 시 호출)
 */
export const recordExport = async (): Promise<void> => {
  const subscription = await getSubscription();

  // Pro나 Team 플랜은 기록하지 않음 (무제한)
  if (subscription?.planType === 'pro' || subscription?.planType === 'team') {
    return;
  }

  const data = getExportLimitData();
  const currentDate = getKSTDateString();

  // 날짜가 다르면 리셋
  if (data.lastResetDate !== currentDate) {
    saveExportLimitData({ count: 1, lastResetDate: currentDate });
  } else {
    saveExportLimitData({ count: data.count + 1, lastResetDate: currentDate });
  }
};

/**
 * 다음 리셋까지 남은 시간 (밀리초)
 */
export const getTimeUntilReset = (): number => {
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstTime = new Date(now.getTime() + kstOffset);

  // 다음 오전 6시 계산
  const nextReset = new Date(kstTime);
  nextReset.setUTCHours(RESET_HOUR_KST, 0, 0, 0);

  // 이미 6시가 지났으면 다음날 6시
  if (kstTime.getUTCHours() >= RESET_HOUR_KST) {
    nextReset.setUTCDate(nextReset.getUTCDate() + 1);
  }

  // KST에서 UTC로 변환
  const nextResetUTC = new Date(nextReset.getTime() - kstOffset);

  return nextResetUTC.getTime() - now.getTime();
};

/**
 * 다음 리셋 시간을 포맷된 문자열로 반환
 */
export const getNextResetTimeString = (): string => {
  const msUntilReset = getTimeUntilReset();
  const hours = Math.floor(msUntilReset / (1000 * 60 * 60));
  const minutes = Math.floor((msUntilReset % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}시간 ${minutes}분 후`;
  }
  return `${minutes}분 후`;
};

/**
 * 일일 제한 정보 반환
 */
export const getExportLimitInfo = async (): Promise<{
  remaining: number;
  limit: number;
  nextReset: string;
}> => {
  const subscription = await getSubscription();
  const remaining = await getRemainingExports();

  // Pro나 Team 플랜은 무제한
  if (subscription?.planType === 'pro' || subscription?.planType === 'team') {
    return {
      remaining: Infinity,
      limit: Infinity,
      nextReset: '무제한',
    };
  }

  return {
    remaining,
    limit: FREE_DAILY_LIMIT,
    nextReset: getNextResetTimeString(),
  };
};
