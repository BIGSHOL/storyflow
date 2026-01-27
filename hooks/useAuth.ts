import { useState, useEffect, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import {
  signInWithGoogle,
  signOut,
  getCurrentUser,
  getCurrentSession,
  onAuthStateChange,
} from '../services/authService';

export type UserTier = 'free' | 'pro' | 'business';

interface UseAuthReturn {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  logOut: () => Promise<void>;
  isAuthenticated: boolean;
  userTier: UserTier;
  isProOrAbove: boolean;
  isAdmin: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 사용자 티어 계산 (user_metadata에서 가져오거나 기본값 'free')
  const userTier: UserTier = (user?.user_metadata?.tier as UserTier) || 'free';
  const isProOrAbove = userTier === 'pro' || userTier === 'business';
  // 관리자 여부 확인 (user_metadata.role 또는 app_metadata.role)
  const isAdmin = user?.user_metadata?.role === 'admin' || user?.app_metadata?.role === 'admin';

  // 초기 세션 체크
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        const [currentUser, currentSession] = await Promise.all([
          getCurrentUser(),
          getCurrentSession(),
        ]);
        setUser(currentUser);
        setSession(currentSession);
      } catch (err) {
        console.error('Auth 초기화 오류:', err);
        setError('인증 상태를 확인할 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Auth 상태 변경 리스너
  useEffect(() => {
    const { data: { subscription } } = onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setError(null);

      if (event === 'SIGNED_OUT') {
        setUser(null);
        setSession(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Google 로그인
  const signIn = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const { error: signInError } = await signInWithGoogle();
      if (signInError) {
        setError(signInError.message);
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
      console.error('Sign in error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 로그아웃
  const logOut = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const { error: signOutError } = await signOut();
      if (signOutError) {
        setError(signOutError.message);
      }
    } catch (err) {
      setError('로그아웃 중 오류가 발생했습니다.');
      console.error('Sign out error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    session,
    loading,
    error,
    signIn,
    logOut,
    isAuthenticated: !!user,
    userTier,
    isProOrAbove,
    isAdmin,
  };
};

export default useAuth;
