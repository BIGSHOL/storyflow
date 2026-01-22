import { supabase } from './supabaseClient';
import type { Project, ProjectInsert, ProjectUpdate } from '../types/database';
import type { Section } from '../types';

// 사용자의 프로젝트 목록 조회
export const getProjects = async (): Promise<{ data: Project[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return { data: data as Project[], error: null };
  } catch (error) {
    console.error('프로젝트 목록 조회 오류:', error);
    return { data: null, error: error as Error };
  }
};

// 단일 프로젝트 조회
export const getProject = async (
  id: string
): Promise<{ data: Project | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data: data as Project, error: null };
  } catch (error) {
    console.error('프로젝트 조회 오류:', error);
    return { data: null, error: error as Error };
  }
};

// 공유 ID로 프로젝트 조회 (공개 프로젝트용)
export const getProjectByShareId = async (
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

// 프로젝트 개수 제한
const MAX_PROJECTS_PER_USER = 3;

// 새 프로젝트 생성
export const createProject = async (
  title: string,
  sections: Section[] = [],
  description?: string
): Promise<{ data: Project | null; error: Error | null }> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error('로그인이 필요합니다.');
    }

    // 현재 프로젝트 개수 확인
    const { count, error: countError } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userData.user.id);

    if (countError) throw countError;

    if (count !== null && count >= MAX_PROJECTS_PER_USER) {
      throw new Error(`프로젝트는 최대 ${MAX_PROJECTS_PER_USER}개까지 만들 수 있어요.`);
    }

    const projectData: ProjectInsert = {
      user_id: userData.user.id,
      title,
      description: description || null,
      sections: JSON.parse(JSON.stringify(sections)), // JSONB로 저장
      is_public: false,
    };

    const { data, error } = await supabase
      .from('projects')
      .insert(projectData as never)
      .select()
      .single();

    if (error) throw error;
    return { data: data as Project, error: null };
  } catch (error) {
    console.error('프로젝트 생성 오류:', error);
    return { data: null, error: error as Error };
  }
};

// 프로젝트 업데이트
export const updateProject = async (
  id: string,
  updates: {
    title?: string;
    description?: string;
    sections?: Section[];
    is_public?: boolean;
  }
): Promise<{ data: Project | null; error: Error | null }> => {
  try {
    const updateData: ProjectUpdate = {};

    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.sections !== undefined) {
      updateData.sections = JSON.parse(JSON.stringify(updates.sections));
    }
    if (updates.is_public !== undefined) updateData.is_public = updates.is_public;

    const { error } = await supabase
      .from('projects')
      .update(updateData as never)
      .eq('id', id);

    if (error) throw error;

    // 업데이트된 프로젝트 다시 조회
    const { data: updatedProject, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (fetchError) throw fetchError;
    return { data: updatedProject as Project, error: null };
  } catch (error) {
    console.error('프로젝트 업데이트 오류:', error);
    return { data: null, error: error as Error };
  }
};

// 프로젝트 삭제
export const deleteProject = async (
  id: string
): Promise<{ success: boolean; error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('프로젝트 삭제 오류:', error);
    return { success: false, error: error as Error };
  }
};

// 프로젝트 복제
export const duplicateProject = async (
  id: string,
  newTitle?: string
): Promise<{ data: Project | null; error: Error | null }> => {
  try {
    const { data: original, error: fetchError } = await getProject(id);
    if (fetchError || !original) {
      throw fetchError || new Error('원본 프로젝트를 찾을 수 없습니다.');
    }

    const sections = (original.sections as unknown as Section[]) || [];
    const title = newTitle || `${original.title} (복사본)`;

    return await createProject(title, sections, original.description || undefined);
  } catch (error) {
    console.error('프로젝트 복제 오류:', error);
    return { data: null, error: error as Error };
  }
};

// 공유 링크 생성/토글
export const toggleShareLink = async (
  id: string,
  enable: boolean
): Promise<{ shareId: string | null; error: Error | null }> => {
  try {
    let shareId: string | null = null;

    if (enable) {
      // 고유한 공유 ID 생성
      shareId = Math.random().toString(36).substring(2, 10) +
                Math.random().toString(36).substring(2, 10);
    }

    const { error } = await supabase
      .from('projects')
      .update({
        is_public: enable,
        share_id: shareId,
      } as never)
      .eq('id', id);

    if (error) throw error;
    return { shareId, error: null };
  } catch (error) {
    console.error('공유 링크 토글 오류:', error);
    return { shareId: null, error: error as Error };
  }
};

// 자동 저장 (debounce 적용 권장)
let autoSaveTimer: ReturnType<typeof setTimeout> | null = null;

export const autoSaveProject = (
  id: string,
  sections: Section[],
  debounceMs: number = 2000
): void => {
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer);
  }

  autoSaveTimer = setTimeout(async () => {
    const { error } = await updateProject(id, { sections });
    if (error) {
      console.error('자동 저장 실패:', error);
    } else {
      console.log('자동 저장 완료:', new Date().toLocaleTimeString());
    }
  }, debounceMs);
};

// 자동 저장 취소
export const cancelAutoSave = (): void => {
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = null;
  }
};

export default {
  getProjects,
  getProject,
  getProjectByShareId,
  createProject,
  updateProject,
  deleteProject,
  duplicateProject,
  toggleShareLink,
  autoSaveProject,
  cancelAutoSave,
};
