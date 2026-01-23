import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { UsageBar } from './UsageBar';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewPlans?: () => void;
  limitType: 'project' | 'export' | 'collaborator';
  currentUsage: { used: number; limit: number };
}

const LIMIT_LABELS: Record<string, string> = {
  project: '프로젝트',
  export: '오늘 내보내기',
  collaborator: '협업자',
};

const LIMIT_MESSAGES: Record<string, string> = {
  project: '프로젝트를 무제한으로 만들 수 있어요.',
  export: '내보내기를 무제한으로 할 수 있어요.',
  collaborator: '더 많은 팀원을 초대할 수 있어요.',
};

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  onViewPlans,
  limitType,
  currentUsage,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
      data-testid="upgrade-modal-backdrop"
    >
      <div
        className="relative bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="upgrade-modal-title"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="닫기"
          data-testid="upgrade-modal-close"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 id="upgrade-modal-title" className="text-xl font-semibold text-white mb-4">
          더 많은 기능이 필요하신가요?
        </h2>

        <div className="mb-4">
          <UsageBar
            used={currentUsage.used}
            limit={currentUsage.limit}
            label={LIMIT_LABELS[limitType]}
          />
        </div>

        <p className="text-gray-300 text-sm mb-6">
          Pro 플랜으로 업그레이드하면 {LIMIT_MESSAGES[limitType]}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-300 hover:text-white
                       border border-gray-600 rounded-lg transition-colors"
            data-testid="upgrade-modal-later"
          >
            나중에
          </button>
          <button
            onClick={onViewPlans}
            className="flex-1 px-4 py-2 bg-violet-600 text-white
                       rounded-lg hover:bg-violet-500 transition-colors"
            data-testid="upgrade-modal-upgrade"
          >
            플랜 살펴보기
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
