import { supabase } from './supabaseClient';
import type { Collaborator } from '../types/database';

export type Permission = 'view' | 'edit';

export interface CollaboratorWithEmail extends Collaborator {
  email?: string;
}

// 협업자 초대
export const inviteCollaborator = async (
  projectId: string,
  email: string,
  permission: Permission = 'view'
): Promise<{ data: Collaborator | null; error: Error | null }> => {
  try {
    // 현재 사용자 확인
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error('로그인이 필요합니다.');
    }

    // 이메일로 사용자 ID 조회 (auth.users는 직접 조회 불가, profiles 테이블 필요)
    // 일단 이메일을 user_id로 저장하고 나중에 매핑
    // 실제 구현에서는 별도의 profiles 테이블이 필요함

    // 이미 초대된 사용자인지 확인
    const { data: existing } = await supabase
      .from('collaborators')
      .select('*')
      .eq('project_id', projectId)
      .eq('user_id', email)
      .single();

    if (existing) {
      throw new Error('이미 초대된 사용자입니다.');
    }

    const collaboratorData = {
      project_id: projectId,
      user_id: email, // 실제로는 사용자 ID
      permission,
      invited_by: userData.user.id,
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

// 프로젝트에 대한 사용자 권한 확인
export const checkPermission = async (
  projectId: string
): Promise<{ permission: Permission | 'owner' | null; error: Error | null }> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      return { permission: null, error: null };
    }

    // 프로젝트 소유자인지 확인
    const { data: project } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', projectId)
      .single();

    if (project && (project as { user_id: string }).user_id === userData.user.id) {
      return { permission: 'owner', error: null };
    }

    // 협업자 권한 확인
    const { data: collaborator } = await supabase
      .from('collaborators')
      .select('permission')
      .eq('project_id', projectId)
      .eq('user_id', userData.user.id)
      .single();

    if (collaborator) {
      return { permission: (collaborator as { permission: Permission }).permission, error: null };
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
