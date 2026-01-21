import { supabase } from './supabaseClient';
import type { Media, MediaInsert } from '../types/database';

const BUCKET_NAME = 'media';
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

// 사용자별 저장 용량 제한 (100MB)
export const STORAGE_QUOTA = 100 * 1024 * 1024; // 100MB

// 저장 용량 정보 타입
export interface StorageInfo {
  used: number;       // 사용 중인 용량 (bytes)
  quota: number;      // 총 할당 용량 (bytes)
  remaining: number;  // 남은 용량 (bytes)
  percentage: number; // 사용률 (0-100)
}

// 사용자의 저장 용량 사용량 조회
export const getStorageUsage = async (): Promise<{ data: StorageInfo | null; error: Error | null }> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      return { data: null, error: new Error('로그인이 필요합니다.') };
    }

    // 사용자의 모든 미디어 파일 크기 합산
    const { data, error } = await supabase
      .from('media')
      .select('file_size')
      .eq('user_id', userData.user.id);

    if (error) throw error;

    const used = (data || []).reduce((sum, item) => sum + ((item as { file_size: number }).file_size || 0), 0);
    const remaining = Math.max(0, STORAGE_QUOTA - used);
    const percentage = Math.min(100, Math.round((used / STORAGE_QUOTA) * 100));

    return {
      data: {
        used,
        quota: STORAGE_QUOTA,
        remaining,
        percentage,
      },
      error: null,
    };
  } catch (error) {
    console.error('저장 용량 조회 오류:', error);
    return { data: null, error: error as Error };
  }
};

// 용량 초과 여부 확인 (업로드 전 체크용)
export const checkStorageQuota = async (
  fileSize: number
): Promise<{ allowed: boolean; storageInfo: StorageInfo | null; error: Error | null }> => {
  const { data: storageInfo, error } = await getStorageUsage();

  if (error || !storageInfo) {
    return { allowed: false, storageInfo: null, error: error || new Error('용량 정보를 가져올 수 없습니다.') };
  }

  const allowed = storageInfo.remaining >= fileSize;

  return { allowed, storageInfo, error: null };
};

// 용량을 읽기 쉬운 형태로 포맷
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

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

    // 저장 용량 확인
    const { allowed, storageInfo, error: quotaError } = await checkStorageQuota(file.size);
    if (quotaError) {
      throw quotaError;
    }
    if (!allowed && storageInfo) {
      const usedStr = formatBytes(storageInfo.used);
      const quotaStr = formatBytes(storageInfo.quota);
      const fileSizeStr = formatBytes(file.size);
      const remainingStr = formatBytes(storageInfo.remaining);
      throw new Error(
        `저장 공간이 부족해요!\n\n` +
        `• 현재 사용량: ${usedStr} / ${quotaStr}\n` +
        `• 남은 공간: ${remainingStr}\n` +
        `• 업로드 파일: ${fileSizeStr}\n\n` +
        `기존 미디어를 삭제하거나 더 작은 파일을 사용해주세요.`
      );
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

// 사용자의 모든 미디어 삭제 (저장 공간 초기화)
export const deleteAllUserMedia = async (): Promise<{
  success: boolean;
  deletedCount: number;
  error: Error | null;
}> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error('로그인이 필요합니다.');
    }

    // 1. 사용자의 모든 미디어 조회
    const { data: mediaList, error: fetchError } = await supabase
      .from('media')
      .select('id, file_path')
      .eq('user_id', userData.user.id);

    if (fetchError) throw fetchError;

    if (!mediaList || mediaList.length === 0) {
      return { success: true, deletedCount: 0, error: null };
    }

    // 2. Storage에서 모든 파일 삭제
    const filePaths = mediaList.map((m: { file_path: string }) => m.file_path);
    const { error: storageError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove(filePaths);

    if (storageError) {
      console.warn('Storage 파일 삭제 일부 실패:', storageError);
    }

    // 3. DB에서 모든 미디어 레코드 삭제
    const { error: deleteError } = await supabase
      .from('media')
      .delete()
      .eq('user_id', userData.user.id);

    if (deleteError) throw deleteError;

    return { success: true, deletedCount: mediaList.length, error: null };
  } catch (error) {
    console.error('저장 공간 초기화 오류:', error);
    return { success: false, deletedCount: 0, error: error as Error };
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
  deleteAllUserMedia,
  getMediaList,
  linkMediaToProject,
  migrateBlobToStorage,
  getStorageUsage,
  checkStorageQuota,
  formatBytes,
  STORAGE_QUOTA,
};
