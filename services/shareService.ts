import { supabase } from './supabaseClient';
import type { Project } from '../types/database';

// 공유 ID 생성
const generateShareId = (): string => {
  return Math.random().toString(36).substring(2, 10) +
         Math.random().toString(36).substring(2, 10);
};

// 공유 링크 활성화
export const enableShareLink = async (
  projectId: string
): Promise<{ shareId: string | null; error: Error | null }> => {
  try {
    const shareId = generateShareId();

    const { error } = await supabase
      .from('projects')
      .update({
        is_public: true,
        share_id: shareId,
      } as never)
      .eq('id', projectId);

    if (error) throw error;
    return { shareId, error: null };
  } catch (error) {
    console.error('공유 링크 활성화 오류:', error);
    return { shareId: null, error: error as Error };
  }
};

// 공유 링크 비활성화
export const disableShareLink = async (
  projectId: string
): Promise<{ success: boolean; error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('projects')
      .update({
        is_public: false,
        share_id: null,
      } as never)
      .eq('id', projectId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('공유 링크 비활성화 오류:', error);
    return { success: false, error: error as Error };
  }
};

// 공유 ID로 프로젝트 조회 (공개 프로젝트용)
export const getSharedProject = async (
  shareId: string
): Promise<{ data: Project | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('share_id', shareId)
      .eq('is_public', true)
      .single();

    if (error) throw error;
    return { data: data as Project, error: null };
  } catch (error) {
    console.error('공유 프로젝트 조회 오류:', error);
    return { data: null, error: error as Error };
  }
};

// 공유 URL 생성
export const getShareUrl = (shareId: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/view/${shareId}`;
};

// 클립보드에 복사
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('클립보드 복사 실패:', error);
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      return true;
    } catch {
      return false;
    } finally {
      document.body.removeChild(textArea);
    }
  }
};

export default {
  enableShareLink,
  disableShareLink,
  getSharedProject,
  getShareUrl,
  copyToClipboard,
};
