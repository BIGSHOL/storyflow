import React, { useState, useCallback } from 'react';
import X from 'lucide-react/dist/esm/icons/x';
import Link2 from 'lucide-react/dist/esm/icons/link-2';
import Copy from 'lucide-react/dist/esm/icons/copy';
import Check from 'lucide-react/dist/esm/icons/check';
import Globe from 'lucide-react/dist/esm/icons/globe';
import Lock from 'lucide-react/dist/esm/icons/lock';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';
import {
  enableShareLink,
  disableShareLink,
  getShareUrl,
  copyToClipboard,
} from '../services/shareService';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectTitle: string;
  isPublic: boolean;
  shareId: string | null;
  onShareStatusChange: (isPublic: boolean, shareId: string | null) => void;
}

const ShareDialog: React.FC<ShareDialogProps> = ({
  isOpen,
  onClose,
  projectId,
  projectTitle,
  isPublic,
  shareId,
  onShareStatusChange,
}) => {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shareUrl = shareId ? getShareUrl(shareId) : '';

  const handleToggleShare = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (isPublic) {
        const { success, error: disableError } = await disableShareLink(projectId);
        if (disableError) throw disableError;
        if (success) {
          onShareStatusChange(false, null);
        }
      } else {
        const { shareId: newShareId, error: enableError } = await enableShareLink(projectId);
        if (enableError) throw enableError;
        if (newShareId) {
          onShareStatusChange(true, newShareId);
        }
      }
    } catch (err) {
      setError('공유 설정 변경에 실패했어요.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [isPublic, projectId, onShareStatusChange]);

  const handleCopyLink = useCallback(async () => {
    if (!shareUrl) return;

    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [shareUrl]);

  const handleOpenLink = useCallback(() => {
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  }, [shareUrl]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center">
              <Link2 className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">공유 설정</h3>
              <p className="text-sm text-gray-400 truncate max-w-[200px]">{projectTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 공개 상태 토글 */}
        <div className="bg-gray-800/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isPublic ? (
                <Globe className="w-5 h-5 text-green-400" />
              ) : (
                <Lock className="w-5 h-5 text-gray-400" />
              )}
              <div>
                <p className="font-medium text-white">
                  {isPublic ? '공개 중' : '비공개'}
                </p>
                <p className="text-sm text-gray-400">
                  {isPublic
                    ? '링크가 있는 누구나 볼 수 있어요'
                    : '나만 볼 수 있어요'}
                </p>
              </div>
            </div>
            <button
              onClick={handleToggleShare}
              disabled={loading}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                isPublic ? 'bg-green-500' : 'bg-gray-600'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  isPublic ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 공유 링크 */}
        {isPublic && shareId && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 truncate"
              />
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  copied
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? '복사됨' : '복사'}
              </button>
            </div>

            <button
              onClick={handleOpenLink}
              className="w-full py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink size={16} />
              새 탭에서 열기
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Info */}
        <div className="mt-4 pt-4 border-t border-gray-800">
          <p className="text-xs text-gray-500 text-center">
            공유 링크는 언제든지 비활성화할 수 있어요
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShareDialog;
