import { supabase } from './supabaseClient';
import type { Collaborator } from '../types/database';

export type Permission = 'view' | 'edit';

// 무료 티어 프로젝트당 협업자 제한
export const MAX_COLLABORATORS_FREE = 1;

export interface CollaboratorWithEmail extends Collaborator {
  email?: string;
  display_name?: string;
}

// 이메일로 사용자 ID 조회
const getUserIdByEmail = async (email: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email.toLowerCase().trim())
    .single();

  if (error || !data) return null;
  return (data as { id: string }).id;
};

// 협업자 초대 (async-parallel 최적화)
export const inviteCollaborator = async (
  projectId: string,
  email: string,
  permission: Permission = 'view'
): Promise<{ data: Collaborator | null; error: Error | null }> => {
  try {
    // 먼저 현재 사용자 확인
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error('로그인이 필요합니다.');
    }

    // 이메일로 사용자 ID 조회
    const targetUserId = await getUserIdByEmail(email);
    if (!targetUserId) {
      throw new Error('해당 이메일의 사용자를 찾을 수 없어요. 먼저 StoryFlow에 가입해야 해요.');
    }

    // 본인을 초대하는지 확인
    if (targetUserId === userData.user.id) {
      throw new Error('본인을 협업자로 초대할 수 없어요.');
    }

    // 기존 협업자인지 확인
    const { data: existingData } = await supabase
      .from('collaborators')
      .select('*')
      .eq('project_id', projectId)
      .eq('user_id', targetUserId)
      .single();

    if (existingData) {
      throw new Error('이미 초대된 사용자입니다.');
    }

    // 프로젝트의 현재 협업자 수 확인 (무료 티어 제한)
    const { count, error: countError } = await supabase
      .from('collaborators')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', projectId);

    if (countError) throw countError;

    if (count !== null && count >= MAX_COLLABORATORS_FREE) {
      throw new Error(
        `무료 플랜은 프로젝트당 최대 ${MAX_COLLABORATORS_FREE}명의 협업자만 초대할 수 있어요. ` +
        `더 많은 협업자를 초대하려면 Pro 플랜으로 업그레이드하세요.`
      );
    }

    const collaboratorData = {
      project_id: projectId,
      user_id: targetUserId,
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

// 협업자 목록 조회 (profiles를 별도 조회하여 안정적으로 처리)
export const getCollaborators = async (
  projectId: string
): Promise<{ data: CollaboratorWithEmail[] | null; error: Error | null }> => {
  try {
    // 1. 협업자 목록 조회
    const { data: collaboratorsData, error: collabError } = await supabase
      .from('collaborators')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (collabError) throw collabError;

    const collaborators = collaboratorsData as Collaborator[] | null;
    if (!collaborators || collaborators.length === 0) {
      return { data: [], error: null };
    }

    // 2. 협업자들의 user_id로 profiles 조회
    const userIds = collaborators.map(c => c.user_id);
    const { data: profilesData, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, display_name')
      .in('id', userIds);

    if (profileError) {
      console.warn('프로필 조회 실패, 협업자 정보만 반환:', profileError);
    }

    // 3. profiles를 Map으로 변환하여 빠른 조회
    const profiles = profilesData as { id: string; email?: string; display_name?: string }[] | null;
    const profileMap = new Map<string, { email?: string; display_name?: string }>();
    (profiles || []).forEach((p) => {
      profileMap.set(p.id, { email: p.email, display_name: p.display_name });
    });

    // 4. 협업자 데이터와 프로필 병합
    const collaboratorsWithEmail: CollaboratorWithEmail[] = collaborators.map((item) => {
      const profile = profileMap.get(item.user_id);
      return {
        id: item.id,
        project_id: item.project_id,
        user_id: item.user_id,
        permission: item.permission as Permission,
        invited_by: item.invited_by,
        created_at: item.created_at,
        email: profile?.email,
        display_name: profile?.display_name,
      };
    });

    return { data: collaboratorsWithEmail, error: null };
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
  MAX_COLLABORATORS_FREE,
};
