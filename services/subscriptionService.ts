/**
 * 구독 서비스
 * 현재 사용자의 구독 정보 및 사용량 조회
 */

import { supabase } from './supabaseClient';
import { PLAN_LIMITS } from './planLimitService';
import {
  Subscription,
  SubscriptionWithUsage,
  Usage,
  SubscriptionRow,
  toSubscription,
} from '../types/subscription';

/**
 * 현재 사용자의 구독 정보 조회
 */
export const getSubscription = async (): Promise<Subscription | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('구독 정보 조회 실패:', error.message);
    return null;
  }

  return toSubscription(data as SubscriptionRow);
};

/**
 * 특정 사용자의 사용량 조회
 */
export const getUsage = async (userId: string): Promise<Usage> => {
  // 프로젝트 수 조회
  const { count: projectCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  // 오늘 내보내기 횟수 조회
  const today = new Date().toISOString().split('T')[0];
  const { data: usageLog } = await supabase
    .from('usage_logs')
    .select('export_count')
    .eq('user_id', userId)
    .eq('usage_date', today)
    .maybeSingle();

  // 협업자 수 조회
  const { count: collaboratorCount } = await supabase
    .from('collaborators')
    .select('*', { count: 'exact', head: true })
    .eq('invited_by', userId);

  return {
    projectCount: projectCount ?? 0,
    todayExportCount: usageLog?.export_count ?? 0,
    collaboratorCount: collaboratorCount ?? 0,
  };
};

/**
 * 현재 사용자의 구독 정보 + 사용량 + 제한 통합 조회
 */
export const getSubscriptionWithUsage = async (): Promise<SubscriptionWithUsage | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const subscription = await getSubscription();
  if (!subscription) return null;

  const usage = await getUsage(user.id);
  const limits = PLAN_LIMITS[subscription.planType];

  return {
    ...subscription,
    usage,
    limits,
  };
};
