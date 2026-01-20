import { supabase } from './supabaseClient';
import type { Media, MediaInsert } from '../types/database';

const BUCKET_NAME = 'media';
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

// 파일 검증
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: '이미지 또는 비디오 파일만 업로드할 수 있어요 (PNG, JPG, GIF, WebP, MP4, WebM)',
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `파일 크기가 너무 커요. ${MAX_FILE_SIZE / (1024 * 1024)}MB 이하로 줄여주세요`,
    };
  }

  return { valid: true };
};

// 파일 업로드
export const uploadMedia = async (
  file: File,
  projectId?: string
): Promise<{ data: Media | null; error: Error | null }> => {
  try {
    // 사용자 확인
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error('로그인이 필요합니다.');
    }

    // 파일 검증
    const validation = validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // 고유한 파일 경로 생성
    const fileExt = file.name.split('.').pop() || 'jpg';
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const filePath = `${userData.user.id}/${timestamp}-${randomStr}.${fileExt}`;

    // Storage에 업로드
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // 공개 URL 가져오기
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    // 메타데이터 저장
    const mediaData: MediaInsert = {
      user_id: userData.user.id,
      project_id: projectId || null,
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
      mime_type: file.type,
      public_url: urlData.publicUrl,
    };

    const { data, error } = await supabase
      .from('media')
      .insert(mediaData as never)
      .select()
      .single();

    if (error) throw error;
    return { data: data as Media, error: null };
  } catch (error) {
    console.error('미디어 업로드 오류:', error);
    return { data: null, error: error as Error };
  }
};

// 미디어 삭제
export const deleteMedia = async (
  mediaId: string
): Promise<{ success: boolean; error: Error | null }> => {
  try {
    // 미디어 정보 조회
    const { data: media, error: fetchError } = await supabase
      .from('media')
      .select('*')
      .eq('id', mediaId)
      .single();

    if (fetchError) throw fetchError;
    if (!media) throw new Error('미디어를 찾을 수 없습니다.');

    const mediaRecord = media as Media;

    // Storage에서 파일 삭제
    const { error: storageError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([mediaRecord.file_path]);

    if (storageError) {
      console.warn('Storage 파일 삭제 실패:', storageError);
    }

    // DB에서 레코드 삭제
    const { error: deleteError } = await supabase
      .from('media')
      .delete()
      .eq('id', mediaId);

    if (deleteError) throw deleteError;
    return { success: true, error: null };
  } catch (error) {
    console.error('미디어 삭제 오류:', error);
    return { success: false, error: error as Error };
  }
};

// 사용자의 미디어 목록 조회
export const getMediaList = async (
  projectId?: string
): Promise<{ data: Media[] | null; error: Error | null }> => {
  try {
    let query = supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false });

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data: data as Media[], error: null };
  } catch (error) {
    console.error('미디어 목록 조회 오류:', error);
    return { data: null, error: error as Error };
  }
};

// 미디어 프로젝트 연결
export const linkMediaToProject = async (
  mediaId: string,
  projectId: string
): Promise<{ success: boolean; error: Error | null }> => {
  try {
    const { error } = await supabase
      .from('media')
      .update({ project_id: projectId } as never)
      .eq('id', mediaId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('미디어 프로젝트 연결 오류:', error);
    return { success: false, error: error as Error };
  }
};

// Blob URL을 Supabase Storage로 마이그레이션
export const migrateBlobToStorage = async (
  blobUrl: string,
  fileName: string,
  projectId?: string
): Promise<{ data: Media | null; error: Error | null }> => {
  try {
    // Blob URL에서 파일 가져오기
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    const file = new File([blob], fileName, { type: blob.type });

    // Storage에 업로드
    return await uploadMedia(file, projectId);
  } catch (error) {
    console.error('Blob 마이그레이션 오류:', error);
    return { data: null, error: error as Error };
  }
};

export default {
  validateFile,
  uploadMedia,
  deleteMedia,
  getMediaList,
  linkMediaToProject,
  migrateBlobToStorage,
};
