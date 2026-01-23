import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { PlanType } from '../../types/subscription';
import { PLAN_NAMES } from '../../services/planLimitService';

interface PlanBadgeProps {
  planType: PlanType;
  onClick?: () => void;
}

const BADGE_STYLES: Record<PlanType, string> = {
  free: 'bg-gray-600 hover:bg-gray-500',
  pro: 'bg-violet-600 hover:bg-violet-500',
  team: 'bg-blue-600 hover:bg-blue-500',
};

export const PlanBadge: React.FC<PlanBadgeProps> = ({ planType, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center px-3 py-1 text-xs font-semibold
                  text-white rounded-md cursor-pointer transition-colors
                  ${BADGE_STYLES[planType]}`}
      aria-label={`현재 플랜: ${PLAN_NAMES[planType]}`}
    >
      {PLAN_NAMES[planType]}
      <ChevronDown className="w-3 h-3 ml-1" />
    </button>
  );
};

export default PlanBadge;
