import { useState, useCallback } from 'react';
import type { Media } from '../types/database';
import {
  uploadMedia,
  deleteMedia,
  getMediaList,
  validateFile,
  migrateBlobToStorage,
} from '../services/mediaService';
import { useAuth } from './useAuth';

interface UseMediaReturn {
  // 상태
  mediaList: Media[];
  uploading: boolean;
  loading: boolean;
  error: string | null;

  // 업로드
  upload: (file: File, projectId?: string) => Promise<Media | null>;
  uploadMultiple: (files: File[], projectId?: string) => Promise<Media[]>;

  // 관리
  remove: (mediaId: string) => Promise<boolean>;
  fetchMediaList: (projectId?: string) => Promise<void>;

  // 유틸
  validate: (file: File) => { valid: boolean; error?: string };
  migrateBlob: (blobUrl: string, fileName: string, projectId?: string) => Promise<Media | null>;
  clearError: () => void;
}

export const useMedia = (): UseMediaReturn => {
  const { isAuthenticated } = useAuth();

  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 단일 파일 업로드
  const upload = useCallback(async (
    file: File,
    projectId?: string
  ): Promise<Media | null> => {
    if (!isAuthenticated) {
      setError('로그인이 필요합니다.');
      return null;
    }

    setUploading(true);
    setError(null);

    try {
      const { data, error: uploadError } = await uploadMedia(file, projectId);
      if (uploadError) throw uploadError;

      if (data) {
        setMediaList(prev => [data, ...prev]);
      }

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : '업로드에 실패했습니다.';
      setError(message);
      console.error('Upload error:', err);
      return null;
    } finally {
      setUploading(false);
    }
  }, [isAuthenticated]);

  // 여러 파일 업로드
  const uploadMultiple = useCallback(async (
    files: File[],
    projectId?: string
  ): Promise<Media[]> => {
    if (!isAuthenticated) {
      setError('로그인이 필요합니다.');
      return [];
    }

    setUploading(true);
    setError(null);

    const uploaded: Media[] = [];

    try {
      for (const file of files) {
        const { data, error: uploadError } = await uploadMedia(file, projectId);
        if (uploadError) {
          console.error(`Failed to upload ${file.name}:`, uploadError);
          continue;
        }
        if (data) {
          uploaded.push(data);
        }
      }

      if (uploaded.length > 0) {
        setMediaList(prev => [...uploaded, ...prev]);
      }

      return uploaded;
    } catch (err) {
      setError('일부 파일 업로드에 실패했습니다.');
      console.error('Upload multiple error:', err);
      return uploaded;
    } finally {
      setUploading(false);
    }
  }, [isAuthenticated]);

  // 미디어 삭제
  const remove = useCallback(async (mediaId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { success, error: deleteError } = await deleteMedia(mediaId);
      if (deleteError) throw deleteError;

      if (success) {
        setMediaList(prev => prev.filter(m => m.id !== mediaId));
      }

      return success;
    } catch (err) {
      setError('삭제에 실패했습니다.');
      console.error('Delete error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // 미디어 목록 조회
  const fetchMediaList = useCallback(async (projectId?: string) => {
    if (!isAuthenticated) {
      setMediaList([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await getMediaList(projectId);
      if (fetchError) throw fetchError;
      setMediaList(data || []);
    } catch (err) {
      setError('미디어 목록을 불러오는데 실패했습니다.');
      console.error('Fetch media list error:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // 파일 검증
  const validate = useCallback((file: File) => {
    return validateFile(file);
  }, []);

  // Blob URL 마이그레이션
  const migrateBlob = useCallback(async (
    blobUrl: string,
    fileName: string,
    projectId?: string
  ): Promise<Media | null> => {
    if (!isAuthenticated) {
      setError('로그인이 필요합니다.');
      return null;
    }

    setUploading(true);
    setError(null);

    try {
      const { data, error: migrateError } = await migrateBlobToStorage(
        blobUrl,
        fileName,
        projectId
      );
      if (migrateError) throw migrateError;

      if (data) {
        setMediaList(prev => [data, ...prev]);
      }

      return data;
    } catch (err) {
      setError('미디어 마이그레이션에 실패했습니다.');
      console.error('Migrate blob error:', err);
      return null;
    } finally {
      setUploading(false);
    }
  }, [isAuthenticated]);

  // 에러 초기화
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    mediaList,
    uploading,
    loading,
    error,
    upload,
    uploadMultiple,
    remove,
    fetchMediaList,
    validate,
    migrateBlob,
    clearError,
  };
};

export default useMedia;
