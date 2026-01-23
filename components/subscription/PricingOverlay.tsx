import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { PricingCard } from './PricingCard';
import type { PlanType } from '../../types/subscription';

interface PricingOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: PlanType;
}

const PLANS: PlanType[] = ['free', 'pro', 'team'];

export const PricingOverlay: React.FC<PricingOverlayProps> = ({
  isOpen,
  onClose,
  currentPlan,
}) => {
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (plan: PlanType) => {
    if (plan === currentPlan) return;
    setToast('결제 기능을 준비 중이에요. 조금만 기다려주세요!');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      onClick={onClose}
      data-testid="pricing-overlay-backdrop"
    >
      <div
        className="relative w-full h-full overflow-y-auto bg-gray-900 p-6 md:p-12"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pricing-overlay-title"
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 id="pricing-overlay-title" className="text-2xl md:text-3xl font-bold text-white">
              플랜 선택
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2"
              aria-label="닫기"
              data-testid="pricing-overlay-close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <PricingCard
                key={plan}
                planType={plan}
                isCurrentPlan={plan === currentPlan}
                isRecommended={plan === 'pro'}
                onSelect={() => handleSelect(plan)}
              />
            ))}
          </div>
        </div>

        {toast && (
          <div
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-700 text-white
                       px-6 py-3 rounded-lg shadow-lg text-sm"
            data-testid="pricing-overlay-toast"
          >
            {toast}
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingOverlay;
