import React, { useState, useRef, useEffect } from 'react';
import LogIn from 'lucide-react/dist/esm/icons/log-in';
import LogOut from 'lucide-react/dist/esm/icons/log-out';
import User from 'lucide-react/dist/esm/icons/user';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import { useAuth } from '../hooks/useAuth';

const UserMenu: React.FC = () => {
  const { user, loading, error, signIn, logOut, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 py-1">
          <div className="px-3 py-2 border-b border-gray-700">
            <p className="text-sm font-medium text-white truncate">{displayName}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
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
    </div>
  );
};

export default UserMenu;
