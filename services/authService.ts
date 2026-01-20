import { supabase } from './supabaseClient';
import type { User, Session, AuthError } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

// Google OAuth 로그인
export const signInWithGoogle = async (): Promise<{ error: AuthError | null }> => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  return { error };
};

// 이메일/비밀번호 로그인 (선택적)
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<{ user: User | null; error: AuthError | null }> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { user: data?.user ?? null, error };
};

// 이메일/비밀번호 회원가입 (선택적)
export const signUpWithEmail = async (
  email: string,
  password: string
): Promise<{ user: User | null; error: AuthError | null }> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/`,
    },
  });

  return { user: data?.user ?? null, error };
};

// 로그아웃
export const signOut = async (): Promise<{ error: AuthError | null }> => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// 현재 사용자 가져오기
export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// 현재 세션 가져오기
export const getCurrentSession = async (): Promise<Session | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

// 비밀번호 재설정 이메일 보내기
export const sendPasswordResetEmail = async (
  email: string
): Promise<{ error: AuthError | null }> => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  return { error };
};

// Auth 상태 변경 리스너
export const onAuthStateChange = (
  callback: (event: string, session: Session | null) => void
) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
};

// 사용자 프로필 업데이트
export const updateUserProfile = async (
  updates: { displayName?: string; avatarUrl?: string }
): Promise<{ error: AuthError | null }> => {
  const { error } = await supabase.auth.updateUser({
    data: updates,
  });

  return { error };
};

export default {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  signOut,
  getCurrentUser,
  getCurrentSession,
  sendPasswordResetEmail,
  onAuthStateChange,
  updateUserProfile,
};
