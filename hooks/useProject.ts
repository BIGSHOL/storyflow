import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { Project } from '../types/database';
import type { Section } from '../types';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  autoSaveProject,
  cancelAutoSave,
} from '../services/projectService';
import { useAuth } from './useAuth';

interface UseProjectReturn {
  // 상태
  projects: Project[];
  currentProject: Project | null;
  setCurrentProject: React.Dispatch<React.SetStateAction<Project | null>>;
  loading: boolean;
  saving: boolean;
  error: string | null;

  // 프로젝트 목록 관련
  fetchProjects: () => Promise<void>;

  // 현재 프로젝트 관련
  loadProject: (id: string) => Promise<void>;
  saveProject: (title?: string, description?: string) => Promise<Project | null>;
  saveAsNewProject: (title: string, sections: Section[], description?: string) => Promise<Project | null>;
  updateCurrentProject: (updates: Partial<Pick<Project, 'title' | 'description'>>) => Promise<void>;
  removeProject: (id: string) => Promise<void>;

  // 자동 저장
  enableAutoSave: (sections: Section[]) => void;
  disableAutoSave: () => void;

  // 유틸
  clearCurrentProject: () => void;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: boolean) => void;
}

export const useProject = (): UseProjectReturn => {
  const { user, isAuthenticated } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const autoSaveEnabledRef = useRef(false);

  // 프로젝트 목록 조회
  const fetchProjects = useCallback(async () => {
    if (!isAuthenticated) {
      setProjects([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await getProjects();
      if (fetchError) throw fetchError;
      setProjects(data || []);
    } catch (err) {
      setError('프로젝트 목록을 불러오는데 실패했습니다.');
      console.error('Fetch projects error:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // 로그인 상태 변경 시 프로젝트 목록 새로고침
  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
    } else {
      setProjects([]);
      setCurrentProject(null);
    }
  }, [isAuthenticated, fetchProjects]);

  // 단일 프로젝트 로드
  const loadProject = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await getProject(id);
      if (fetchError) throw fetchError;
      setCurrentProject(data);
      setHasUnsavedChanges(false);
    } catch (err) {
      setError('프로젝트를 불러오는데 실패했습니다.');
      console.error('Load project error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 현재 프로젝트 저장 (업데이트)
  const saveProject = useCallback(async (
    title?: string,
    description?: string
  ): Promise<Project | null> => {
    if (!currentProject) {
      setError('저장할 프로젝트가 없습니다.');
      return null;
    }

    setSaving(true);
    setError(null);

    try {
      const updates: Parameters<typeof updateProject>[1] = {};
      if (title) updates.title = title;
      if (description !== undefined) updates.description = description;

      const { data, error: updateError } = await updateProject(currentProject.id, updates);
      if (updateError) throw updateError;

      setCurrentProject(data);
      setHasUnsavedChanges(false);
      return data;
    } catch (err) {
      setError('프로젝트 저장에 실패했습니다.');
      console.error('Save project error:', err);
      return null;
    } finally {
      setSaving(false);
    }
  }, [currentProject]);

  // 새 프로젝트로 저장
  const saveAsNewProject = useCallback(async (
    title: string,
    sections: Section[],
    description?: string
  ): Promise<Project | null> => {
    if (!isAuthenticated) {
      setError('로그인이 필요합니다.');
      return null;
    }

    setSaving(true);
    setError(null);

    try {
      const { data, error: createError } = await createProject(title, sections, description);
      if (createError) throw createError;

      setCurrentProject(data);
      setHasUnsavedChanges(false);

      // 프로젝트 목록 새로고침
      await fetchProjects();

      return data;
    } catch (err) {
      setError('프로젝트 생성에 실패했습니다.');
      console.error('Create project error:', err);
      return null;
    } finally {
      setSaving(false);
    }
  }, [isAuthenticated, fetchProjects]);

  // 현재 프로젝트 업데이트
  const updateCurrentProject = useCallback(async (
    updates: Partial<Pick<Project, 'title' | 'description'>>
  ) => {
    if (!currentProject) return;

    setSaving(true);
    setError(null);

    try {
      const { data, error: updateError } = await updateProject(currentProject.id, updates);
      if (updateError) throw updateError;

      setCurrentProject(data);
    } catch (err) {
      setError('프로젝트 업데이트에 실패했습니다.');
      console.error('Update project error:', err);
    } finally {
      setSaving(false);
    }
  }, [currentProject]);

  // 프로젝트 삭제
  const removeProject = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await deleteProject(id);
      if (deleteError) throw deleteError;

      // 현재 프로젝트가 삭제된 경우 초기화
      if (currentProject?.id === id) {
        setCurrentProject(null);
      }

      // 프로젝트 목록 새로고침
      await fetchProjects();
    } catch (err) {
      setError('프로젝트 삭제에 실패했습니다.');
      console.error('Delete project error:', err);
    } finally {
      setLoading(false);
    }
  }, [currentProject, fetchProjects]);

  // 자동 저장 활성화
  const enableAutoSave = useCallback((sections: Section[]) => {
    if (!currentProject) return;

    autoSaveEnabledRef.current = true;
    autoSaveProject(currentProject.id, sections);
  }, [currentProject]);

  // 자동 저장 비활성화
  const disableAutoSave = useCallback(() => {
    autoSaveEnabledRef.current = false;
    cancelAutoSave();
  }, []);

  // 현재 프로젝트 초기화
  const clearCurrentProject = useCallback(() => {
    disableAutoSave();
    setCurrentProject(null);
    setHasUnsavedChanges(false);
    setError(null);
  }, [disableAutoSave]);

  // 컴포넌트 언마운트 시 자동 저장 취소
  useEffect(() => {
    return () => {
      cancelAutoSave();
    };
  }, []);

  return {
    projects,
    currentProject,
    setCurrentProject,
    loading,
    saving,
    error,
    fetchProjects,
    loadProject,
    saveProject,
    saveAsNewProject,
    updateCurrentProject,
    removeProject,
    enableAutoSave,
    disableAutoSave,
    clearCurrentProject,
    hasUnsavedChanges,
    setHasUnsavedChanges,
  };
};

export default useProject;
