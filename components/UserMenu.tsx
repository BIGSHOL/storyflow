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
import { useProject } from '../hooks/useProject';
import { getExportLimitInfo } from '../services/exportLimitService';
import Download from 'lucide-react/dist/esm/icons/download';

const UserMenu: React.FC = () => {
  const { user, loading, error, signIn, logOut, isAuthenticated } = useAuth();
  const { storageInfo, formatBytes, isNearQuota, isOverQuota, refresh: refreshStorage } = useStorageQuota();
  const { projects } = useProject();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const menuRef = useRef<HTMLDivElement>(null);

  // MB 단위로 변환 (소수점 1자리)
  const formatMB = (bytes: number): string => {
    return (bytes / (1024 * 1024)).toFixed(1);
  };

  // 내보내기 제한 정보
  const [exportInfo, setExportInfo] = useState(getExportLimitInfo());

  // 메뉴 열릴 때 저장 용량 및 내보내기 정보 새로고침
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      refreshStorage();
      setExportInfo(getExportLimitInfo());
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
    <div ref={menuRef} className="relative z-[9999]">
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
        <div className="fixed right-4 top-14 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[9999] py-1">
          {/* 사용자 정보 */}
          <div className="px-3 py-2 border-b border-gray-700">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-white truncate flex-1">{displayName}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false); // 드롭다운 닫기
                  setShowPricingModal(true);
                }}
                className="ml-2 px-2 py-0.5 bg-green-600/20 text-green-400 text-xs font-medium rounded border border-green-600/30 hover:bg-green-600/30 transition-colors cursor-pointer"
                title="요금제 보기"
              >
                무료
              </button>
            </div>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>

          {/* 사용량 정보 */}
          <div className="px-3 py-2 border-b border-gray-700 space-y-2">
            {/* 프로젝트 수 */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">프로젝트</span>
              <span className="text-gray-300 font-medium">{projects.length} / 3</span>
            </div>

            {/* 내보내기 횟수 */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-1.5">
                  <Download size={12} className="text-gray-400" />
                  <span className="text-gray-400">오늘 내보내기</span>
                </div>
                <span className={`font-medium ${
                  exportInfo.remaining === 0
                    ? 'text-red-400'
                    : exportInfo.remaining <= 3
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                }`}>
                  {exportInfo.limit - exportInfo.remaining} / {exportInfo.limit}
                </span>
              </div>
              {exportInfo.remaining === 0 ? (
                <p className="text-xs text-red-400">
                  오늘 한도를 모두 사용했어요
                </p>
              ) : exportInfo.remaining <= 3 && (
                <p className="text-xs text-yellow-400">
                  {exportInfo.remaining}회 남음
                </p>
              )}
              <p className="text-xs text-gray-500 mt-0.5">
                초기화: {exportInfo.nextReset}
              </p>
            </div>

            {/* 저장 공간 */}
            {storageInfo && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <HardDrive size={12} className="text-gray-400" />
                    <span className="text-xs text-gray-400">저장 공간</span>
                  </div>
                  <span className={`text-xs font-medium ${isOverQuota
                      ? 'text-red-400'
                      : isNearQuota
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}>
                    {formatMB(storageInfo.used)} / {formatMB(storageInfo.quota)} MB
                  </span>
                </div>
                {/* 프로그레스 바 */}
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-1.5">
                  <div
                    className={`h-full rounded-full transition-all ${isOverQuota
                        ? 'bg-red-500'
                        : isNearQuota
                          ? 'bg-yellow-500'
                          : 'bg-indigo-500'
                      }`}
                    style={{ width: `${Math.min(100, storageInfo.percentage)}%` }}
                  />
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
          </div>

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

      {/* 요금제 비교 모달 */}
      {showPricingModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start md:items-center justify-center z-[10000] overflow-y-auto" onClick={() => setShowPricingModal(false)}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-4 md:p-6 max-w-2xl w-full m-4 my-8 md:my-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4 md:mb-6 sticky top-0 bg-gray-900 pb-2">
              <h3 className="text-lg md:text-xl font-bold text-white">요금제</h3>
              <button
                onClick={() => setShowPricingModal(false)}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            {/* 월간/연간 토글 */}
            <div className="flex items-center justify-center mb-6">
              <div className="inline-flex bg-gray-800 border border-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setBillingPeriod('monthly')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    billingPeriod === 'monthly'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  월간
                </button>
                <button
                  onClick={() => setBillingPeriod('yearly')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    billingPeriod === 'yearly'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  연간
                  <span className="ml-1 text-xs text-green-400">20% 할인</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              {/* Free 플랜 */}
              <div className="bg-gray-800 border-2 border-green-600/50 rounded-xl p-4 md:p-5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-white">Free</h4>
                  <span className="px-2 py-1 bg-green-600/20 text-green-400 text-xs font-medium rounded border border-green-600/30">
                    현재 플랜
                  </span>
                </div>
                <div className="mb-4">
                  <div className="text-3xl font-bold text-white">0원</div>
                  <div className="text-sm text-gray-400">영구 무료</div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2 text-gray-300">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>프로젝트 3개</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>미디어 100MB</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>일 10회 내보내기</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>협업자 1명</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-400">
                    <span className="text-gray-600 mt-0.5">✗</span>
                    <span>커스텀 도메인</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-400">
                    <span className="text-gray-600 mt-0.5">✗</span>
                    <span>워터마크 제거</span>
                  </li>
                </ul>
              </div>

              {/* Pro 플랜 */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 md:p-5 opacity-60">
                <div className="mb-4">
                  <h4 className="text-lg font-bold text-white">Pro</h4>
                  <span className="text-xs text-indigo-400">곧 출시 예정</span>
                </div>
                <div className="mb-4">
                  <div className="text-3xl font-bold text-white">
                    {billingPeriod === 'monthly' ? '10,000' : '8,000'}원
                  </div>
                  <div className="text-sm text-gray-400">
                    /월{billingPeriod === 'yearly' && ' (연간 결제)'}
                  </div>
                  {billingPeriod === 'yearly' && (
                    <div className="text-xs text-green-400 mt-1">
                      월간 대비 20% 할인
                    </div>
                  )}
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2 text-gray-300">
                    <span className="text-indigo-400 mt-0.5">✓</span>
                    <span>무제한 프로젝트</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <span className="text-indigo-400 mt-0.5">✓</span>
                    <span>미디어 5GB</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <span className="text-indigo-400 mt-0.5">✓</span>
                    <span>무제한 내보내기</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <span className="text-indigo-400 mt-0.5">✓</span>
                    <span>협업자 5명</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <span className="text-indigo-400 mt-0.5">✓</span>
                    <span>커스텀 도메인</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <span className="text-indigo-400 mt-0.5">✓</span>
                    <span>워터마크 제거</span>
                  </li>
                </ul>
              </div>

              {/* Business 플랜 */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 md:p-5 opacity-60">
                <div className="mb-4">
                  <h4 className="text-lg font-bold text-white">Business</h4>
                  <span className="text-xs text-purple-400">곧 출시 예정</span>
                </div>
                <div className="mb-4">
                  <div className="text-3xl font-bold text-white">
                    {billingPeriod === 'monthly' ? '30,000' : '24,000'}원
                  </div>
                  <div className="text-sm text-gray-400">
                    /월{billingPeriod === 'yearly' && ' (연간 결제)'}
                  </div>
                  {billingPeriod === 'yearly' && (
                    <div className="text-xs text-green-400 mt-1">
                      월간 대비 20% 할인
                    </div>
                  )}
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2 text-gray-300">
                    <span className="text-purple-400 mt-0.5">✓</span>
                    <span>무제한 프로젝트</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <span className="text-purple-400 mt-0.5">✓</span>
                    <span>미디어 50GB</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <span className="text-purple-400 mt-0.5">✓</span>
                    <span>무제한 내보내기</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <span className="text-purple-400 mt-0.5">✓</span>
                    <span>무제한 협업자</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <span className="text-purple-400 mt-0.5">✓</span>
                    <span>우선 고객지원</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <span className="text-purple-400 mt-0.5">✓</span>
                    <span>API 접근</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-gray-400 space-y-1">
              <p>💡 Pro 및 Business 플랜은 2026년 상반기 출시 예정입니다.</p>
              <p className="text-xs text-gray-500">* 부가세 별도</p>
              <p className="text-xs">
                문의:{' '}
                <a
                  href="mailto:st2000423@gmail.com"
                  className="text-indigo-400 hover:text-indigo-300 underline transition-colors"
                >
                  st2000423@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
