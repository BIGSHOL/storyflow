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
 * 모든 사용자를 Pro 플랜으로 제공
 */
export const getSubscription = async (): Promise<Subscription | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single();

  // DB에 구독 정보가 없으면 기본 Pro 구독을 DB에 생성
  if (error) {
    console.log('구독 정보가 없음, DB에 Pro 플랜 생성');
    const now = new Date().toISOString();
    const { data: newSubscription, error: insertError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        plan_type: 'pro',
        status: 'active',
        current_period_start: now,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Pro 구독 생성 실패:', insertError);
      // 실패해도 임시 Pro 구독 반환
      return {
        id: `temp-${user.id}`,
        userId: user.id,
        planType: 'pro',
        status: 'active',
        currentPeriodStart: now,
        createdAt: now,
        updatedAt: now,
      };
    }

    return toSubscription(newSubscription as SubscriptionRow);
  }

  const subscription = toSubscription(data as SubscriptionRow);

  // 기존 사용자가 free 플랜이면 DB를 Pro로 업데이트
  if (subscription.planType !== 'pro' || subscription.status !== 'active') {
    console.log(`사용자 ${user.id}를 Pro 플랜으로 업그레이드`);
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        plan_type: 'pro',
        status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Pro 플랜 업데이트 실패:', updateError);
    }

    // DB 업데이트와 관계없이 Pro 플랜으로 반환
    return {
      ...subscription,
      planType: 'pro',
      status: 'active',
    };
  }

  return subscription;
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
