import React, { useState, useRef, useEffect, useCallback } from 'react';
import LogIn from 'lucide-react/dist/esm/icons/log-in';
import LogOut from 'lucide-react/dist/esm/icons/log-out';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import HardDrive from 'lucide-react/dist/esm/icons/hard-drive';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import { useAuth } from '../hooks/useAuth';
import { useStorageQuota } from '../hooks/useStorageQuota';
import { deleteAllUserMedia } from '../services/mediaService';

const UserMenu: React.FC = () => {
  const { user, loading, error, signIn, logOut, isAuthenticated } = useAuth();
  const { storageInfo, formatBytes, isNearQuota, isOverQuota, refresh: refreshStorage } = useStorageQuota();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 메뉴 열릴 때 저장 용량 새로고침
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      refreshStorage();
    }
  }, [isOpen, isAuthenticated, refreshStorage]);

  // 저장 공간 초기화
  const handleResetStorage = useCallback(async () => {
    if (!storageInfo || storageInfo.used === 0) {
      alert('삭제할 미디어가 없어요.');
      return;
    }

    const confirmDelete = window.confirm(
      `⚠️ 저장 공간 초기화\n\n` +
      `현재 ${formatBytes(storageInfo.used)}의 미디어가 저장되어 있어요.\n` +
      `모든 미디어 파일이 영구 삭제됩니다.\n\n` +
      `정말 삭제하시겠어요?`
    );

    if (!confirmDelete) return;

    // 이중 확인
    const doubleConfirm = window.confirm(
      `마지막 확인입니다.\n\n` +
      `이 작업은 되돌릴 수 없어요.\n` +
      `정말로 모든 미디어를 삭제하시겠어요?`
    );

    if (!doubleConfirm) return;

    setIsDeleting(true);
    try {
      const { success, deletedCount, error: deleteError } = await deleteAllUserMedia();

      if (deleteError) {
        throw deleteError;
      }

      if (success) {
        alert(`${deletedCount}개의 미디어가 삭제되었어요.\n저장 공간이 초기화되었습니다.`);
        refreshStorage();
      }
    } catch (err) {
      console.error('저장 공간 초기화 실패:', err);
      alert('초기화에 실패했어요. 다시 시도해주세요.');
    } finally {
      setIsDeleting(false);
    }
  }, [storageInfo, formatBytes, refreshStorage]);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 로딩 중
  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 text-gray-400">
        <Loader2 size={16} className="animate-spin" />
      </div>
    );
  }

  // 로그인되지 않은 상태
  if (!isAuthenticated) {
    return (
      <button
        onClick={signIn}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
      >
        <LogIn size={16} />
        <span>로그인</span>
      </button>
    );
  }

  // 로그인된 상태
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || '사용자';
  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1 text-sm text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-6 h-6 rounded-full"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-medium">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="hidden md:inline max-w-24 truncate">{displayName}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 py-1">
          {/* 사용자 정보 */}
          <div className="px-3 py-2 border-b border-gray-700">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-white truncate flex-1">{displayName}</p>
              <span className="ml-2 px-2 py-0.5 bg-green-600/20 text-green-400 text-xs font-medium rounded border border-green-600/30">
                무료
              </span>
            </div>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>

          {/* 저장 용량 표시 */}
          {storageInfo && (
            <div className="px-3 py-2 border-b border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <HardDrive size={14} className="text-gray-400" />
                <span className="text-xs text-gray-400">저장 공간</span>
              </div>
              {/* 프로그레스 바 */}
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-1.5">
                <div
                  className={`h-full rounded-full transition-all ${
                    isOverQuota
                      ? 'bg-red-500'
                      : isNearQuota
                      ? 'bg-yellow-500'
                      : 'bg-indigo-500'
                  }`}
                  style={{ width: `${Math.min(100, storageInfo.percentage)}%` }}
                />
              </div>
              {/* 용량 텍스트 */}
              <div className="flex items-center justify-between">
                <span className={`text-xs ${
                  isOverQuota
                    ? 'text-red-400'
                    : isNearQuota
                    ? 'text-yellow-400'
                    : 'text-gray-400'
                }`}>
                  {formatBytes(storageInfo.used)} / {formatBytes(storageInfo.quota)}
                </span>
                <span className={`text-xs font-medium ${
                  isOverQuota
                    ? 'text-red-400'
                    : isNearQuota
                    ? 'text-yellow-400'
                    : 'text-gray-400'
                }`}>
                  {storageInfo.percentage}%
                </span>
              </div>
              {isOverQuota && (
                <p className="text-xs text-red-400 mt-1">
                  용량이 꽉 찼어요! 미디어를 삭제해주세요.
                </p>
              )}
              {isNearQuota && !isOverQuota && (
                <p className="text-xs text-yellow-400 mt-1">
                  용량이 거의 다 찼어요.
                </p>
              )}
              {/* 저장 공간 초기화 버튼 */}
              {storageInfo.used > 0 && (
                <button
                  onClick={handleResetStorage}
                  disabled={isDeleting}
                  className="w-full mt-2 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 size={12} className="animate-spin" />
                      삭제 중...
                    </>
                  ) : (
                    <>
                      <Trash2 size={12} />
                      저장 공간 초기화
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          <button
            onClick={() => {
              setIsOpen(false);
              logOut();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <LogOut size={16} />
            <span>로그아웃</span>
          </button>
        </div>
      )}

      {/* 에러 표시 */}
      {error && (
        <div className="absolute right-0 mt-2 w-64 bg-red-900/80 border border-red-700 rounded-lg p-3 text-sm text-red-200">
          {error}
        </div>
      )}
    </div>
  );
};

export default UserMenu;
