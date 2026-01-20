import { supabase } from './supabaseClient';
import type { Collaborator } from '../types/database';

export type Permission = 'view' | 'edit';

export interface CollaboratorWithEmail extends Collaborator {
  email?: string;
}

// 협업자 초대 (async-parallel 최적화)
export const inviteCollaborator = async (
  projectId: string,
  email: string,
  permission: Permission = 'view'
): Promise<{ data: Collaborator | null; error: Error | null }> => {
  try {
    // 사용자 확인과 기존 협업자 확인을 병렬로 실행
    const [userResult, existingResult] = await Promise.all([
      supabase.auth.getUser(),
      supabase
        .from('collaborators')
        .select('*')
        .eq('project_id', projectId)
        .eq('user_id', email)
        .single(),
    ]);

    if (!userResult.data.user) {
      throw new Error('로그인이 필요합니다.');
    }

    if (existingResult.data) {
      throw new Error('이미 초대된 사용자입니다.');
    }

    const collaboratorData = {
      project_id: projectId,
      user_id: email,
      permission,
      invited_by: userResult.data.user.id,
    };

    const { data, error } = await supabase
      .from('collaborators')
      .insert(collaboratorData as never)
      .select()
      .single();

    if (error) throw error;
    return { data: data as Collaborator, error: null };
  } catch (error) {
    console.error('협업자 초대 오류:', error);
    return { data: null, error: error as Error };
  }
};

// 협업자 목록 조회
export const getCollaborators = async (
  projectId: string
): Promise<{ data: CollaboratorWithEmail[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('collaborators')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data as CollaboratorWithEmail[], error: null };
  } catch (error) {
    console.error('협업자 목록 조회 오류:', error);
    return { data: null, error: error as Error };
  }
};

// 협업자 권한 변경
export const updateCollaboratorPermission = async (
  collaboratorId: string,
  permission: Permission
): Promise<{ success: boolean; error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('collaborators')
      .update({ permission } as never)
      .eq('id', collaboratorId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('권한 변경 오류:', error);
    return { success: false, error: error as Error };
  }
};

// 협업자 제거
export const removeCollaborator = async (
  collaboratorId: string
): Promise<{ success: boolean; error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('collaborators')
      .delete()
      .eq('id', collaboratorId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('협업자 제거 오류:', error);
    return { success: false, error: error as Error };
  }
};

// 사용자의 협업 프로젝트 목록 조회
export const getCollaboratedProjects = async (): Promise<{
  data: { project_id: string; permission: Permission }[] | null;
  error: Error | null;
}> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      return { data: [], error: null };
    }

    const { data, error } = await supabase
      .from('collaborators')
      .select('project_id, permission')
      .eq('user_id', userData.user.id);

    if (error) throw error;
    return { data: data as { project_id: string; permission: Permission }[], error: null };
  } catch (error) {
    console.error('협업 프로젝트 조회 오류:', error);
    return { data: null, error: error as Error };
  }
};

// 프로젝트에 대한 사용자 권한 확인 (async-parallel 최적화)
export const checkPermission = async (
  projectId: string
): Promise<{ permission: Permission | 'owner' | null; error: Error | null }> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      return { permission: null, error: null };
    }

    // 프로젝트 소유자 확인과 협업자 확인을 병렬로 실행
    const [projectResult, collaboratorResult] = await Promise.all([
      supabase
        .from('projects')
        .select('user_id')
        .eq('id', projectId)
        .single(),
      supabase
        .from('collaborators')
        .select('permission')
        .eq('project_id', projectId)
        .eq('user_id', userData.user.id)
        .single(),
    ]);

    // 소유자 확인
    if (projectResult.data && (projectResult.data as { user_id: string }).user_id === userData.user.id) {
      return { permission: 'owner', error: null };
    }

    // 협업자 권한 확인
    if (collaboratorResult.data) {
      return { permission: (collaboratorResult.data as { permission: Permission }).permission, error: null };
    }

    return { permission: null, error: null };
  } catch (error) {
    console.error('권한 확인 오류:', error);
    return { permission: null, error: error as Error };
  }
};

export default {
  inviteCollaborator,
  getCollaborators,
  updateCollaboratorPermission,
  removeCollaborator,
  getCollaboratedProjects,
  checkPermission,
};
