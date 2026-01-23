/**
 * 플랜 제한 체크 훅
 * 현재 구독 플랜의 제한에 따른 기능 사용 가능 여부를 제공
 */

import { useSubscription } from './useSubscription';
import {
  checkProjectLimit,
  checkExportLimit,
  checkCollaboratorLimit,
  checkCanRemoveBranding,
} from '../services/planLimitService';

interface UsePlanLimitsReturn {
  canCreateProject: () => boolean;
  canExport: () => boolean;
  canInviteCollaborator: (currentCount: number) => boolean;
  canRemoveBranding: () => boolean;
  subscription: ReturnType<typeof useSubscription>['subscription'];
  loading: boolean;
}

export function usePlanLimits(): UsePlanLimitsReturn {
  const { subscription, loading } = useSubscription();

  const canCreateProject = (): boolean => {
    if (loading || !subscription) return false;
    return checkProjectLimit(subscription.planType, subscription.usage.projectCount);
  };

  const canExport = (): boolean => {
    if (loading || !subscription) return false;
    return checkExportLimit(subscription.planType, subscription.usage.todayExportCount);
  };

  const canInviteCollaborator = (currentCount: number): boolean => {
    if (loading || !subscription) return false;
    return checkCollaboratorLimit(subscription.planType, currentCount);
  };

  const canRemoveBranding = (): boolean => {
    if (loading || !subscription) return false;
    return checkCanRemoveBranding(subscription.planType);
  };

  return {
    canCreateProject,
    canExport,
    canInviteCollaborator,
    canRemoveBranding,
    subscription,
    loading,
  };
}

export default usePlanLimits;
