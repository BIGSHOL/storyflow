import React from 'react';
import { Check } from 'lucide-react';
import type { PlanType } from '../../types/subscription';
import { PLAN_NAMES, PLAN_PRICES, PLAN_LIMITS, formatPrice } from '../../services/planLimitService';

interface PricingCardProps {
  planType: PlanType;
  isCurrentPlan: boolean;
  isRecommended?: boolean;
  onSelect: () => void;
}

const PLAN_FEATURES: Record<PlanType, string[]> = {
  free: [
    '프로젝트 3개',
    '내보내기 일 10회',
    '협업자 1명',
    '모든 레이아웃',
  ],
  pro: [
    '프로젝트 무제한',
    '내보내기 무제한',
    '협업자 5명',
    '브랜딩 제거',
  ],
  team: [
    '프로젝트 무제한',
    '내보내기 무제한',
    '협업자 무제한',
    '팀 관리 기능',
    '브랜딩 제거',
  ],
};

const PLAN_DESCRIPTIONS: Record<PlanType, string> = {
  free: '영원히 무료',
  pro: '/월',
  team: '/월',
};

export const PricingCard: React.FC<PricingCardProps> = ({
  planType,
  isCurrentPlan,
  isRecommended = false,
  onSelect,
}) => {
  const price = PLAN_PRICES[planType];
  const features = PLAN_FEATURES[planType];

  return (
    <div
      className={`relative rounded-xl p-6 bg-gray-800 border-2 transition-colors ${
        isRecommended ? 'border-violet-500' : 'border-gray-700'
      }`}
      data-testid={`pricing-card-${planType}`}
    >
      {isRecommended && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5
                         bg-violet-600 text-white text-xs font-semibold rounded-full">
          추천
        </span>
      )}

      <h3 className="text-xl font-bold text-white mb-2">
        {PLAN_NAMES[planType]}
      </h3>

      <div className="mb-1">
        <span className="text-3xl font-bold text-white">
          {price === 0 ? '무료' : `₩${price.toLocaleString()}`}
        </span>
        {price > 0 && (
          <span className="text-gray-400 text-sm ml-1">/월</span>
        )}
      </div>

      {price === 0 && (
        <p className="text-gray-400 text-sm mb-4">영원히 무료</p>
      )}
      {price > 0 && <div className="mb-4" />}

      <hr className="border-gray-700 mb-4" />

      <ul className="space-y-2 mb-6">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
            <Check className="w-4 h-4 text-violet-400 flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      <button
        onClick={onSelect}
        disabled={isCurrentPlan}
        className={`w-full py-2 rounded-lg font-medium transition-colors ${
          isCurrentPlan
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : isRecommended
              ? 'bg-violet-600 text-white hover:bg-violet-500'
              : 'border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400'
        }`}
      >
        {isCurrentPlan ? '현재 플랜' : '업그레이드'}
      </button>
    </div>
  );
};

export default PricingCard;
