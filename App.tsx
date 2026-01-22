import React, { useState, useCallback, useEffect, useRef, lazy, Suspense, useMemo, startTransition } from 'react';
import { Section } from './types';
import Editor from './components/Editor';
import PreviewRender from './components/PreviewRender';
// lucide-react 직접 import (번들 최적화)
import Eye from 'lucide-react/dist/esm/icons/eye';
import Edit3 from 'lucide-react/dist/esm/icons/edit-3';
import Download from 'lucide-react/dist/esm/icons/download';
import Smartphone from 'lucide-react/dist/esm/icons/smartphone';
import Laptop from 'lucide-react/dist/esm/icons/laptop';
import Monitor from 'lucide-react/dist/esm/icons/monitor';
import Save from 'lucide-react/dist/esm/icons/save';
import FolderOpen from 'lucide-react/dist/esm/icons/folder-open';
import Undo2 from 'lucide-react/dist/esm/icons/undo-2';
import Redo2 from 'lucide-react/dist/esm/icons/redo-2';
import X from 'lucide-react/dist/esm/icons/x';
import Share2 from 'lucide-react/dist/esm/icons/share-2';
import Users from 'lucide-react/dist/esm/icons/users';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import FileText from 'lucide-react/dist/esm/icons/file-text';
import Edit2 from 'lucide-react/dist/esm/icons/edit-2';
import FileImage from 'lucide-react/dist/esm/icons/file-image';
import { exportToHTML, exportToPDF, exportToImage, hasBlobUrls } from './services/exportService';
import { saveProject, loadProject, loadAutoSave, autoSave, hasSavedProject, hasAnonymousSavedProject, loadAnonymousProject, clearAnonymousSavedProject } from './services/storageService';
import { uploadMedia } from './services/mediaService';
import UserMenu from './components/UserMenu';
import { useAuth } from './hooks/useAuth';
import { useProject } from './hooks/useProject';
import { useIsMobile } from './hooks/useIsMobile';
import { useDeviceType } from './hooks/useDeviceType';
import Menu from 'lucide-react/dist/esm/icons/menu';
import MobileLayout from './components/MobileLayout';

// blob URL을 Supabase Storage URL로 마이그레이션
// 실패한 blob URL은 미디어 없이 저장 (잘못된 blob URL이 DB에 저장되는 것을 방지)
const migrateBlobUrlsToStorage = async (sections: Section[]): Promise<{ sections: Section[]; failedCount: number }> => {
  let failedCount = 0;
  const migratedSections = await Promise.all(
    sections.map(async (section) => {
      // blob URL인 경우만 마이그레이션
      if (section.mediaUrl?.startsWith('blob:')) {
        try {
          const response = await fetch(section.mediaUrl);
          const blob = await response.blob();
          const fileName = `media-${Date.now()}-${Math.random().toString(36).slice(2)}.${blob.type.split('/')[1] || 'jpg'}`;
          const file = new File([blob], fileName, { type: blob.type });

          const { data, error } = await uploadMedia(file);
          if (error || !data?.public_url) {
            console.error('미디어 마이그레이션 실패:', error);
            failedCount++;
            // 실패 시 미디어 URL 제거 (잘못된 blob URL이 DB에 저장되는 것을 방지)
            URL.revokeObjectURL(section.mediaUrl);
            return { ...section, mediaUrl: undefined, mediaType: 'none' as const };
          }

          // blob URL 해제
          URL.revokeObjectURL(section.mediaUrl);

          return { ...section, mediaUrl: data.public_url };
        } catch (err) {
          console.error('blob URL 변환 실패:', err);
          failedCount++;
          // 실패 시 미디어 URL 제거
          if (section.mediaUrl) {
            URL.revokeObjectURL(section.mediaUrl);
          }
          return { ...section, mediaUrl: undefined, mediaType: 'none' as const };
        }
      }
      return section;
    })
  );
  return { sections: migratedSections, failedCount };
};

// Section 배열 유효성 검증 (DB에서 로드 시 사용)
const validateSections = (data: unknown): Section[] => {
  if (!Array.isArray(data)) return [];

  return data.filter((item): item is Section => {
    if (!item || typeof item !== 'object') return false;
    // 필수 필드 검증
    if (typeof item.id !== 'string' || typeof item.layout !== 'string') return false;
    return true;
  }).map(section => ({
    ...section,
    // mediaUrl이 blob:으로 시작하면 제거 (이전에 잘못 저장된 경우)
    mediaUrl: section.mediaUrl?.startsWith('blob:') ? undefined : section.mediaUrl,
    mediaType: section.mediaUrl?.startsWith('blob:') ? 'none' : section.mediaType,
  }));
};

// mediaUrl이 유효한지 검증
const isValidMediaUrl = (url: string | undefined): boolean => {
  if (!url) return true; // undefined는 유효
  if (url.startsWith('blob:')) return false; // blob URL은 저장하면 안됨
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// 모달 컴포넌트 동적 import (bundle-dynamic-imports)
const ShareDialog = lazy(() => import('./components/ShareDialog'));
const CollaborationDialog = lazy(() => import('./components/CollaborationDialog'));

const MAX_HISTORY = 50;

function App() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { currentProject, setCurrentProject, projects, loadProject: loadProjectFromDB, saveAsNewProject, updateCurrentProject, removeProject } = useProject();
  const userId = user?.id ?? null;
  const isMobile = useIsMobile();
  const deviceType = useDeviceType();

  const [sections, setSections] = useState<Section[]>([]);
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Undo/Redo 히스토리 관리
  const historyRef = useRef<Section[][]>([[]]);
  const historyIndexRef = useRef(0);
  const isUndoRedoRef = useRef(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // 복구 모달 상태
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [pendingRecoveryData, setPendingRecoveryData] = useState<Section[] | null>(null);

  // 로그인 후 익명 데이터 마이그레이션 모달 상태
  const [showMigrationModal, setShowMigrationModal] = useState(false);
  const [pendingMigrationData, setPendingMigrationData] = useState<Section[] | null>(null);

  // 공유 다이얼로그 상태
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareStatus, setShareStatus] = useState<{ isPublic: boolean; shareId: string | null }>({
    isPublic: false,
    shareId: null,
  });

  // 협업자 다이얼로그 상태
  const [showCollaborationDialog, setShowCollaborationDialog] = useState(false);

  // 프로젝트 드롭다운 상태
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const projectDropdownRef = useRef<HTMLDivElement>(null);

  // 내보내기 드롭다운 상태
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const exportDropdownRef = useRef<HTMLDivElement>(null);

  // 프로젝트 개수 제한
  const MAX_PROJECTS = 3;

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (projectDropdownRef.current && !projectDropdownRef.current.contains(event.target as Node)) {
        setShowProjectDropdown(false);
      }
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target as Node)) {
        setShowExportDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 현재 프로젝트 변경 시 공유 상태 동기화 및 섹션 로드
  useEffect(() => {
    if (currentProject) {
      setShareStatus({
        isPublic: currentProject.is_public,
        shareId: currentProject.share_id,
      });
      // 프로젝트의 섹션 데이터를 에디터에 로드 (유효성 검증 포함)
      const projectSections = validateSections(currentProject.sections);
      if (projectSections.length > 0) {
        setSections(projectSections);
        // 히스토리 초기화
        historyRef.current = [projectSections];
        historyIndexRef.current = 0;
        setCanUndo(false);
        setCanRedo(false);
      }
    }
  }, [currentProject]);

  // 정렬된 프로젝트 목록 (useMemo로 캐싱)
  const sortedProjects = useMemo(() =>
    [...projects].sort((a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    ), [projects]);

  // 로그인 후 가장 최근 프로젝트 자동 로드
  useEffect(() => {
    if (isAuthenticated && !authLoading && sortedProjects.length > 0 && !currentProject) {
      // 가장 최근에 업데이트된 프로젝트 로드 (이미 fetch된 데이터 사용)
      const latestProject = sortedProjects[0];
      if (latestProject) {
        setCurrentProject(latestProject);
      }
    }
  }, [isAuthenticated, authLoading, sortedProjects, currentProject, setCurrentProject]);

  // 로그인 후 익명 localStorage 데이터 마이그레이션 확인
  useEffect(() => {
    // 인증 로딩 완료 + 로그인 상태일 때만 확인
    if (authLoading || !isAuthenticated) return;

    // 익명 사용자의 저장 데이터가 있는지 확인
    if (hasAnonymousSavedProject()) {
      const anonymousData = loadAnonymousProject();
      if (anonymousData && anonymousData.length > 0) {
        setPendingMigrationData(anonymousData);
        setShowMigrationModal(true);
      }
    }
  }, [authLoading, isAuthenticated]);

  // 히스토리에 상태 추가
  const pushHistory = useCallback((newSections: Section[]) => {
    if (isUndoRedoRef.current) return;

    // 현재 위치 이후의 히스토리 삭제
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    historyRef.current.push(newSections);

    // 히스토리 크기 제한
    if (historyRef.current.length > MAX_HISTORY) {
      historyRef.current.shift();
    } else {
      historyIndexRef.current++;
    }

    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(false);
  }, []);

  // 섹션 변경 래퍼 (startTransition으로 비긴급 업데이트 처리)
  const handleSetSections: React.Dispatch<React.SetStateAction<Section[]>> = useCallback((action) => {
    startTransition(() => {
      setSections(prev => {
        const newSections = typeof action === 'function' ? action(prev) : action;
        pushHistory(newSections);
        return newSections;
      });
    });
  }, [pushHistory]);

  // Undo
  const handleUndo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      isUndoRedoRef.current = true;
      historyIndexRef.current--;
      setSections(historyRef.current[historyIndexRef.current]);
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(true);
      setTimeout(() => { isUndoRedoRef.current = false; }, 0);
    }
  }, []);

  // Redo
  const handleRedo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      isUndoRedoRef.current = true;
      historyIndexRef.current++;
      setSections(historyRef.current[historyIndexRef.current]);
      setCanUndo(true);
      setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
      setTimeout(() => { isUndoRedoRef.current = false; }, 0);
    }
  }, []);

  // 키보드 단축키 (Ctrl+Z, Ctrl+Y)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          handleUndo();
        } else if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
          e.preventDefault();
          handleRedo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // 초기 로드 시 저장된 프로젝트 확인 (커스텀 모달 사용)
  useEffect(() => {
    // 인증 로딩이 완료된 후에만 확인
    if (authLoading) return;

    // 로그인 상태이고 클라우드 프로젝트가 있으면 localStorage 복구 모달 표시 안함
    if (isAuthenticated && projects.length > 0) return;

    if (hasSavedProject(userId)) {
      const saved = loadProject(userId) || loadAutoSave(userId);
      if (saved && saved.length > 0) {
        setPendingRecoveryData(saved);
        setShowRecoveryModal(true);
      }
    }
  }, [authLoading, userId, isAuthenticated, projects.length]);

  // 복구 확인
  const handleRecoveryConfirm = useCallback(() => {
    if (pendingRecoveryData) {
      setSections(pendingRecoveryData);
      historyRef.current = [pendingRecoveryData];
      historyIndexRef.current = 0;
    }
    setShowRecoveryModal(false);
    setPendingRecoveryData(null);
  }, [pendingRecoveryData]);

  // 복구 취소 (새로 시작)
  const handleRecoveryCancel = useCallback(() => {
    setShowRecoveryModal(false);
    setPendingRecoveryData(null);
  }, []);

  // 로컬 데이터 삭제
  const handleRecoveryDelete = useCallback(() => {
    const confirmDelete = window.confirm(
      '브라우저에 저장된 데이터를 완전히 삭제할까요?\n\n삭제하면 복구할 수 없어요.'
    );
    if (confirmDelete) {
      // localStorage 데이터 삭제 (자동저장 타이머도 취소됨)
      if (!isAuthenticated) {
        clearAnonymousSavedProject();
      } else {
        // 동적 import 대신 이미 import된 함수 사용
        import('./services/storageService').then(({ clearSavedProject }) => {
          clearSavedProject(userId);
          // 삭제 완료 후 메모리 초기화
          setSections([]);
          historyRef.current = [[]];
          historyIndexRef.current = 0;
          setCanUndo(false);
          setCanRedo(false);
        });
      }
      // 비인증 사용자는 즉시 초기화
      if (!isAuthenticated) {
        setSections([]);
        historyRef.current = [[]];
        historyIndexRef.current = 0;
        setCanUndo(false);
        setCanRedo(false);
      }
      setShowRecoveryModal(false);
      setPendingRecoveryData(null);
    }
  }, [isAuthenticated, userId]);

  // 마이그레이션 확인 (익명 데이터를 클라우드에 저장)
  const handleMigrationConfirm = useCallback(async () => {
    if (!pendingMigrationData || pendingMigrationData.length === 0) {
      setShowMigrationModal(false);
      setPendingMigrationData(null);
      return;
    }

    setIsSaving(true);
    try {
      // blob URL을 Storage로 마이그레이션
      const hasBlobUrlsInData = pendingMigrationData.some(s => s.mediaUrl?.startsWith('blob:'));
      let sectionsToSave = pendingMigrationData;

      if (hasBlobUrlsInData) {
        const result = await migrateBlobUrlsToStorage(pendingMigrationData);
        sectionsToSave = result.sections;

        if (result.failedCount > 0) {
          alert(`${result.failedCount}개의 미디어 업로드에 실패했어요.\n해당 섹션은 미디어 없이 저장됩니다.`);
        }
      }

      // 새 프로젝트로 저장 (프로젝트 제한 확인)
      if (projects.length >= MAX_PROJECTS) {
        alert(`프로젝트는 최대 ${MAX_PROJECTS}개까지 만들 수 있어요.\n기존 프로젝트를 삭제하거나, 현재 프로젝트에 덮어쓰기 해주세요.`);
        // 현재 프로젝트가 있으면 덮어쓰기 옵션 제공
        if (currentProject) {
          const overwrite = window.confirm('현재 프로젝트에 덮어쓰시겠어요?');
          if (overwrite) {
            const { updateProject } = await import('./services/projectService');
            await updateProject(currentProject.id, { sections: sectionsToSave });
            setSections(sectionsToSave);
            historyRef.current = [sectionsToSave];
            historyIndexRef.current = 0;
            setCanUndo(false);
            setCanRedo(false);
            clearAnonymousSavedProject();
            alert('클라우드에 저장되었어요!');
          }
        }
      } else {
        const title = prompt('프로젝트 제목을 입력하세요:', '로컬 프로젝트');
        if (title) {
          const newProject = await saveAsNewProject(title, sectionsToSave);
          if (newProject) {
            setCurrentProject(newProject);
            setSections(sectionsToSave);
            historyRef.current = [sectionsToSave];
            historyIndexRef.current = 0;
            setCanUndo(false);
            setCanRedo(false);
            clearAnonymousSavedProject();
            alert('클라우드에 저장되었어요!');
          }
        }
      }
    } catch (err) {
      console.error('Migration error:', err);
      alert('마이그레이션에 실패했어요. 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
      setShowMigrationModal(false);
      setPendingMigrationData(null);
    }
  }, [pendingMigrationData, projects.length, currentProject, saveAsNewProject, setCurrentProject]);

  // 마이그레이션 취소 (익명 데이터 삭제)
  const handleMigrationCancel = useCallback(() => {
    const confirmDiscard = window.confirm(
      '로컬에 저장된 데이터를 삭제하시겠어요?\n\n삭제하면 복구할 수 없어요.'
    );
    if (confirmDiscard) {
      // localStorage 삭제 (자동저장 타이머도 취소됨)
      clearAnonymousSavedProject();
      // 메모리 초기화
      setSections([]);
      historyRef.current = [[]];
      historyIndexRef.current = 0;
      setCanUndo(false);
      setCanRedo(false);
    }
    setShowMigrationModal(false);
    setPendingMigrationData(null);
  }, []);

  // 마이그레이션 나중에 처리 (데이터 유지, 모달만 닫기)
  const handleMigrationLater = useCallback(() => {
    setShowMigrationModal(false);
    setPendingMigrationData(null);
  }, []);

  // 섹션 변경 시 자동 저장
  useEffect(() => {
    if (sections.length > 0) {
      autoSave(sections, userId);
    }
  }, [sections, userId]);

  // 프로젝트 저장
  const handleSave = useCallback(async () => {
    if (sections.length === 0) {
      alert('저장할 섹션이 없어요. 먼저 섹션을 추가해주세요.');
      return;
    }

    setIsSaving(true);
    try {
      // 로그인 상태면 클라우드에 저장
      if (isAuthenticated) {
        // blob URL을 Supabase Storage로 마이그레이션
        const hasBlobUrlsInSections = sections.some(s => s.mediaUrl?.startsWith('blob:'));
        let sectionsToSave = sections;
        let migrationFailedCount = 0;

        if (hasBlobUrlsInSections) {
          const result = await migrateBlobUrlsToStorage(sections);
          sectionsToSave = result.sections;
          migrationFailedCount = result.failedCount;
          // 마이그레이션된 섹션으로 상태 업데이트
          setSections(sectionsToSave);

          if (migrationFailedCount > 0) {
            alert(`${migrationFailedCount}개의 미디어 업로드에 실패했어요.\n해당 섹션은 미디어 없이 저장됩니다.`);
          }
        }

        // 최종 저장 전 모든 mediaUrl이 유효한지 확인
        const invalidUrls = sectionsToSave.filter(s => !isValidMediaUrl(s.mediaUrl));
        if (invalidUrls.length > 0) {
          // 유효하지 않은 URL을 가진 섹션에서 mediaUrl 제거
          sectionsToSave = sectionsToSave.map(s =>
            isValidMediaUrl(s.mediaUrl) ? s : { ...s, mediaUrl: undefined, mediaType: 'none' as const }
          );
          setSections(sectionsToSave);
        }

        if (currentProject) {
          // 기존 프로젝트 업데이트
          const { updateProject } = await import('./services/projectService');
          const { error } = await updateProject(currentProject.id, { sections: sectionsToSave });
          if (error) throw error;
          setLastSaved(new Date().toLocaleTimeString());
          alert('클라우드에 저장되었어요!');
        } else {
          // 새 프로젝트 생성 - 제한 체크
          if (projects.length >= MAX_PROJECTS) {
            alert(`프로젝트는 최대 ${MAX_PROJECTS}개까지 만들 수 있어요. 기존 프로젝트를 삭제해주세요.`);
            setIsSaving(false);
            return;
          }
          const title = prompt('프로젝트 제목을 입력하세요:', '새 프로젝트');
          if (!title) {
            setIsSaving(false);
            return;
          }
          const result = await saveAsNewProject(title, sectionsToSave);
          if (result) {
            setLastSaved(new Date().toLocaleTimeString());
            alert('클라우드에 저장되었어요!');
          } else {
            throw new Error('저장 실패');
          }
        }
      } else {
        // 비로그인 상태면 로컬에 저장
        const success = await saveProject(sections, userId);
        if (success) {
          setLastSaved(new Date().toLocaleTimeString());
          alert('로컬에 저장되었어요! (로그인하면 클라우드에 저장됩니다)');
        } else {
          throw new Error('저장 실패');
        }
      }
    } catch (err) {
      console.error('Save error:', err);
      alert('저장에 실패했어요. 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  }, [sections, isAuthenticated, currentProject, saveAsNewProject, userId, setSections, projects.length]);

  // 프로젝트 불러오기
  const handleLoad = useCallback(() => {
    const saved = loadProject(userId) || loadAutoSave(userId);
    if (saved && saved.length > 0) {
      // 기존 Blob URL 해제
      sections.forEach(s => {
        if (s.mediaUrl?.startsWith('blob:')) {
          URL.revokeObjectURL(s.mediaUrl);
        }
      });
      setSections(saved);
      // 히스토리 초기화
      historyRef.current = [saved];
      historyIndexRef.current = 0;
      setCanUndo(false);
      setCanRedo(false);
      alert('프로젝트를 불러왔어요!');
    } else {
      alert('저장된 프로젝트가 없어요.');
    }
  }, [sections, userId]);

  // 새 프로젝트 생성
  const handleCreateNewProject = useCallback(async () => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (projects.length >= MAX_PROJECTS) {
      alert(`프로젝트는 최대 ${MAX_PROJECTS}개까지 만들 수 있어요. 기존 프로젝트를 삭제해주세요.`);
      return;
    }

    const title = prompt('새 프로젝트 이름을 입력하세요:', `프로젝트 ${projects.length + 1}`);
    if (!title) return;

    const newProject = await saveAsNewProject(title, []);
    if (newProject) {
      setCurrentProject(newProject);
      setSections([]);
      historyRef.current = [[]];
      historyIndexRef.current = 0;
      setCanUndo(false);
      setCanRedo(false);
      setShowProjectDropdown(false);
    }
  }, [isAuthenticated, projects.length, saveAsNewProject, setCurrentProject]);

  // 프로젝트 전환
  const handleSwitchProject = useCallback((project: typeof projects[0]) => {
    setCurrentProject(project);
    setShowProjectDropdown(false);
  }, [setCurrentProject]);

  // 프로젝트 이름 변경 (공통 로직)
  const renameProjectById = useCallback(async (projectId: string) => {
    const projectToRename = projects.find(p => p.id === projectId);
    if (!projectToRename) return;

    const newTitle = prompt('새 프로젝트 이름을 입력하세요:', projectToRename.title);
    if (!newTitle || newTitle === projectToRename.title) return;

    try {
      const { updateProject: updateProjectService } = await import('./services/projectService');
      const { error } = await updateProjectService(projectId, { title: newTitle });
      if (error) throw error;

      if (currentProject?.id === projectId) {
        await updateCurrentProject({ title: newTitle });
      }
      alert('프로젝트 이름이 변경되었어요!');
    } catch (err) {
      console.error('프로젝트 이름 변경 실패:', err);
      alert('이름 변경에 실패했어요. 다시 시도해주세요.');
    }
  }, [projects, currentProject, updateCurrentProject]);

  // 프로젝트 이름 변경 (데스크탑 - 이벤트 핸들러)
  const handleRenameProject = useCallback((projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    renameProjectById(projectId);
  }, [renameProjectById]);

  // 프로젝트 삭제
  const handleDeleteProject = useCallback(async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const projectToDelete = projects.find(p => p.id === projectId);
    if (!projectToDelete) return;

    const confirmDelete = window.confirm(
      `"${projectToDelete.title}" 프로젝트를 삭제하시겠어요?\n\n이 작업은 되돌릴 수 없어요.`
    );
    if (!confirmDelete) return;

    await removeProject(projectId);

    // 현재 프로젝트가 삭제된 경우, 다른 프로젝트로 전환하거나 초기화
    if (currentProject?.id === projectId) {
      const remainingProjects = projects.filter(p => p.id !== projectId);
      if (remainingProjects.length > 0) {
        setCurrentProject(remainingProjects[0]);
      } else {
        setCurrentProject(null);
        setSections([]);
        historyRef.current = [[]];
        historyIndexRef.current = 0;
        setCanUndo(false);
        setCanRedo(false);
      }
    }
  }, [projects, currentProject, removeProject, setCurrentProject]);

  // HTML 내보내기 기능
  const handleExport = useCallback(async () => {
    if (sections.length === 0) {
      alert('내보낼 섹션이 없어요. 먼저 섹션을 추가해주세요.');
      return;
    }

    // blob URL 경고 (비로그인 사용자가 업로드한 미디어)
    if (hasBlobUrls(sections)) {
      const proceed = window.confirm(
        '⚠️ 로그인하지 않고 업로드한 미디어가 있어요.\n\n' +
        '이 미디어는 HTML 파일에 포함되지만, 파일 크기가 매우 커질 수 있어요.\n' +
        '로그인 후 미디어를 다시 업로드하면 더 효율적으로 관리할 수 있어요.\n\n' +
        '계속 내보내시겠어요?'
      );
      if (!proceed) return;
    }

    setIsExporting(true);
    setShowExportDropdown(false);
    try {
      await exportToHTML(sections, 'my-story');
      alert('HTML 파일이 다운로드되었어요!');
    } catch (error) {
      console.error('내보내기 실패:', error);
      alert('내보내기에 실패했어요. 다시 시도해주세요.');
    } finally {
      setIsExporting(false);
    }
  }, [sections]);

  // PDF로 내보내기
  const handleExportPDF = useCallback(async () => {
    if (sections.length === 0) {
      alert('내보낼 섹션이 없어요. 먼저 섹션을 추가해주세요.');
      return;
    }

    // 동영상 포함 여부 체크
    const videoSections = sections.filter(s => s.mediaType === 'video');
    if (videoSections.length > 0) {
      const proceed = window.confirm(
        `⚠️ 동영상이 포함된 섹션이 ${videoSections.length}개 있어요.\n\n` +
        `PDF에서는 동영상이 정적 이미지(첫 프레임)로 표시됩니다.\n` +
        `계속 진행하시겠어요?`
      );
      if (!proceed) return;
    }

    setIsExporting(true);
    setShowExportDropdown(false);
    try {
      const previewElement = document.querySelector('[data-preview-container]') as HTMLElement;
      if (!previewElement) {
        throw new Error('프리뷰 요소를 찾을 수 없습니다.');
      }

      await exportToPDF(previewElement, `${currentProject?.title || 'my-story'}.pdf`);
      alert('PDF 파일이 다운로드되었어요!');
    } catch (error) {
      console.error('PDF 내보내기 실패:', error);
      alert('PDF 내보내기에 실패했어요. 다시 시도해주세요.');
    } finally {
      setIsExporting(false);
    }
  }, [sections, currentProject]);

  // 이미지로 내보내기 (PNG)
  const handleExportImage = useCallback(async () => {
    if (sections.length === 0) {
      alert('내보낼 섹션이 없어요. 먼저 섹션을 추가해주세요.');
      return;
    }

    // 동영상 포함 여부 체크
    const videoSections = sections.filter(s => s.mediaType === 'video');
    if (videoSections.length > 0) {
      const proceed = window.confirm(
        `⚠️ 동영상이 포함된 섹션이 ${videoSections.length}개 있어요.\n\n` +
        `이미지에서는 동영상이 정적 이미지(첫 프레임)로 표시됩니다.\n` +
        `계속 진행하시겠어요?`
      );
      if (!proceed) return;
    }

    setIsExporting(true);
    setShowExportDropdown(false);
    try {
      const previewElement = document.querySelector('[data-preview-container]') as HTMLElement;
      if (!previewElement) {
        throw new Error('프리뷰 요소를 찾을 수 없습니다.');
      }

      await exportToImage(previewElement, `${currentProject?.title || 'my-story'}.png`, 'png');
      alert('이미지 파일이 다운로드되었어요!');
    } catch (error) {
      console.error('이미지 내보내기 실패:', error);
      alert('이미지 내보내기에 실패했어요. 다시 시도해주세요.');
    } finally {
      setIsExporting(false);
    }
  }, [sections, currentProject]);

  // 섹션별 이미지로 내보내기
  const handleExportSectionImages = useCallback(async () => {
    if (sections.length === 0) {
      alert('내보낼 섹션이 없어요. 먼저 섹션을 추가해주세요.');
      return;
    }

    // 동영상 포함 여부 체크
    const videoSections = sections.filter(s => s.mediaType === 'video');
    if (videoSections.length > 0) {
      const proceed = window.confirm(
        `⚠️ 동영상이 포함된 섹션이 ${videoSections.length}개 있어요.\n\n` +
        `이미지에서는 동영상이 정적 이미지(첫 프레임)로 표시됩니다.\n` +
        `계속 진행하시겠어요?`
      );
      if (!proceed) return;
    }

    setIsExporting(true);
    setShowExportDropdown(false);
    try {
      const previewContainer = document.querySelector('[data-preview-container]') as HTMLElement;
      if (!previewContainer) {
        throw new Error('프리뷰 요소를 찾을 수 없습니다.');
      }

      const sectionElements = Array.from(previewContainer.querySelectorAll('section')) as HTMLElement[];
      if (sectionElements.length === 0) {
        throw new Error('섹션을 찾을 수 없습니다.');
      }

      const { exportSectionsAsImages } = await import('./services/exportService');
      await exportSectionsAsImages(sectionElements, currentProject?.title || 'section', 'png');
      alert(`${sectionElements.length}개의 이미지가 다운로드되었어요!`);
    } catch (error) {
      console.error('섹션 이미지 내보내기 실패:', error);
      alert('섹션 이미지 내보내기에 실패했어요. 다시 시도해주세요.');
    } finally {
      setIsExporting(false);
    }
  }, [sections, currentProject]);

  // 썸네일 다운로드
  const handleExportThumbnail = useCallback(async () => {
    if (sections.length === 0) {
      alert('내보낼 섹션이 없어요. 먼저 섹션을 추가해주세요.');
      return;
    }

    setIsExporting(true);
    setShowExportDropdown(false);
    try {
      const previewContainer = document.querySelector('[data-preview-container]') as HTMLElement;
      if (!previewContainer) {
        throw new Error('프리뷰 요소를 찾을 수 없습니다.');
      }

      const firstSection = previewContainer.querySelector('section') as HTMLElement;
      if (!firstSection) {
        throw new Error('첫 번째 섹션을 찾을 수 없습니다.');
      }

      const { generateThumbnail } = await import('./services/exportService');
      const thumbnailData = await generateThumbnail(firstSection, 1200, 630); // OG 이미지 표준 사이즈

      if (!thumbnailData) {
        throw new Error('썸네일 생성에 실패했습니다.');
      }

      // 썸네일 다운로드
      const response = await fetch(thumbnailData);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentProject?.title || 'thumbnail'}-og.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert('썸네일이 다운로드되었어요!');
    } catch (error) {
      console.error('썸네일 다운로드 실패:', error);
      alert('썸네일 다운로드에 실패했어요. 다시 시도해주세요.');
    } finally {
      setIsExporting(false);
    }
  }, [sections, currentProject]);

  // 프로젝트 이름 변경 핸들러 (모바일용 - 공통 함수 재사용)
  const handleRenameProjectMobile = renameProjectById;

  // 프로젝트 삭제 핸들러 (모바일용)
  const handleDeleteProjectMobile = useCallback((projectId: string) => {
    const projectToDelete = projects.find(p => p.id === projectId);
    if (!projectToDelete) return;

    const confirmDelete = window.confirm(
      `"${projectToDelete.title}" 프로젝트를 삭제하시겠어요?\n\n이 작업은 되돌릴 수 없어요.`
    );
    if (!confirmDelete) return;

    removeProject(projectId);

    if (currentProject?.id === projectId) {
      const remainingProjects = projects.filter(p => p.id !== projectId);
      if (remainingProjects.length > 0) {
        setCurrentProject(remainingProjects[0]);
      } else {
        setCurrentProject(null);
        setSections([]);
        historyRef.current = [[]];
        historyIndexRef.current = 0;
        setCanUndo(false);
        setCanRedo(false);
      }
    }
  }, [projects, currentProject, removeProject, setCurrentProject]);

  // 모바일 레이아웃 렌더링 (실제 모바일 디바이스만)
  if (isMobile) {
    return (
      <>
        <MobileLayout
          sections={sections}
          setSections={handleSetSections}
          viewMode={viewMode}
          setViewMode={setViewMode}
          isAuthenticated={isAuthenticated}
          currentProject={currentProject}
          projects={projects}
          onSave={handleSave}
          onExport={handleExport}
          onExportPDF={handleExportPDF}
          onExportImage={handleExportImage}
          onExportSectionImages={handleExportSectionImages}
          onExportThumbnail={handleExportThumbnail}
          onCreateProject={handleCreateNewProject}
          onSwitchProject={handleSwitchProject}
          onRenameProject={handleRenameProjectMobile}
          onDeleteProject={handleDeleteProjectMobile}
          isSaving={isSaving}
          isExporting={isExporting}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={handleUndo}
          onRedo={handleRedo}
          maxProjects={MAX_PROJECTS}
          userId={userId}
          shareStatus={shareStatus}
          onShareStatusChange={(isPublic, shareId) => setShareStatus({ isPublic, shareId })}
        />

        {/* 프로젝트 복구 모달 */}
        {showRecoveryModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[200]">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-2">로컬 저장 데이터 발견</h3>
              <p className="text-gray-300 mb-2">
                브라우저에 임시 저장된 프로젝트가 있어요.<br />
                <span className="text-gray-500 text-sm">({pendingRecoveryData?.length || 0}개 섹션)</span>
              </p>
              <p className="text-yellow-400 text-sm mb-4">
                ⚠️ 로그인하면 클라우드에 안전하게 저장할 수 있어요.
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex gap-3">
                  <button
                    onClick={handleRecoveryCancel}
                    className="flex-1 px-4 py-2.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    새로 시작
                  </button>
                  <button
                    onClick={handleRecoveryConfirm}
                    className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-500 transition-colors"
                  >
                    불러오기
                  </button>
                </div>
                <button
                  onClick={handleRecoveryDelete}
                  className="w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors border border-red-900/30"
                >
                  로컬 데이터 완전히 삭제
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 로컬 데이터 마이그레이션 모달 */}
        {showMigrationModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[200]">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-2">로컬 데이터 발견</h3>
              <p className="text-gray-300 mb-4">
                로그인 전에 작업하던 프로젝트가 있어요.<br />
                <span className="text-gray-500 text-sm">({pendingMigrationData?.length || 0}개 섹션)</span>
              </p>
              <p className="text-yellow-400 text-sm mb-6">
                클라우드에 저장하면 어디서든 접근할 수 있어요.
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleMigrationConfirm}
                  disabled={isSaving}
                  className="w-full px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium disabled:opacity-50"
                >
                  {isSaving ? '저장 중...' : '클라우드에 저장'}
                </button>
                <button
                  onClick={handleMigrationLater}
                  className="w-full px-4 py-2.5 bg-gray-800 text-gray-300 rounded-lg"
                >
                  나중에 하기
                </button>
                <button
                  onClick={handleMigrationCancel}
                  className="w-full px-4 py-2.5 text-gray-500 text-sm"
                >
                  로컬 데이터 삭제
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // 태블릿 레이아웃 (컴팩트한 2행 네비게이션)
  if (deviceType === 'tablet') {
    return (
      <div className="h-screen w-screen flex flex-col bg-black overflow-hidden">
        {/* Top Navigation Bar - 태블릿용 컴팩트 2행 */}
        <nav className="border-b border-gray-800 bg-gray-900 z-50">
          {/* 1행: 로고 + 프로젝트 + 유저메뉴 */}
          <div className="h-11 flex items-center justify-between px-3">
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">S</div>
              <span className="font-serif font-bold text-white tracking-wide text-sm">StoryFlow</span>

              {/* 프로젝트 선택 드롭다운 */}
              {isAuthenticated && (
                <div className="relative ml-1" ref={projectDropdownRef}>
                  <button
                    onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                    className="flex items-center gap-1.5 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs text-gray-300 hover:text-white hover:border-gray-600 transition-colors max-w-[140px]"
                  >
                    <FileText size={12} className="flex-shrink-0" />
                    <span className="truncate">{currentProject?.title || '프로젝트'}</span>
                    <ChevronDown size={10} className={`flex-shrink-0 transition-transform ${showProjectDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showProjectDropdown && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[60] overflow-hidden">
                      <div className="max-h-48 overflow-y-auto">
                        {projects.length === 0 ? (
                          <div className="px-3 py-4 text-center text-gray-500 text-sm">프로젝트가 없어요</div>
                        ) : (
                          projects.map((project) => (
                            <button
                              key={project.id}
                              onClick={() => handleSwitchProject(project)}
                              className={`w-full flex items-center justify-between px-3 py-2.5 text-left text-sm transition-colors ${currentProject?.id === project.id
                                ? 'bg-indigo-600/20 text-indigo-300'
                                : 'text-gray-300 hover:bg-gray-700'
                                }`}
                            >
                              <span className="truncate flex-1">{project.title}</span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={(e) => handleRenameProject(project.id, e)}
                                  className="p-1 text-gray-500 hover:text-blue-400 transition-colors"
                                  title="이름 변경"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={(e) => handleDeleteProject(project.id, e)}
                                  className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                                  title="삭제"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                      <div className="border-t border-gray-700">
                        <button
                          onClick={handleCreateNewProject}
                          disabled={projects.length >= MAX_PROJECTS}
                          className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm transition-colors ${projects.length >= MAX_PROJECTS
                            ? 'text-gray-600 cursor-not-allowed'
                            : 'text-indigo-400 hover:bg-gray-700 hover:text-indigo-300'
                            }`}
                        >
                          <Plus size={14} />
                          <span>새 프로젝트</span>
                          <span className="text-gray-500 text-xs ml-auto">{projects.length}/{MAX_PROJECTS}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <UserMenu />
          </div>

          {/* 2행: 편집 도구들 (컴팩트) */}
          <div className="h-10 flex items-center justify-between px-3 border-t border-gray-800">
            {/* 편집/미리보기 토글 */}
            <div className="flex items-center bg-gray-800 rounded p-0.5 border border-gray-700">
              <button
                onClick={() => setViewMode('editor')}
                className={`px-2 py-1 rounded text-xs flex items-center gap-1 whitespace-nowrap transition-colors ${viewMode === 'editor' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Edit3 size={12} /> 편집
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`px-2 py-1 rounded text-xs flex items-center gap-1 whitespace-nowrap transition-colors ${viewMode === 'preview' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Eye size={12} /> 미리보기
              </button>
            </div>

            {/* 도구 버튼들 */}
            <div className="flex items-center gap-1">
              {viewMode === 'editor' && (
                <>
                  <div className="flex bg-gray-800 rounded p-0.5">
                    <button
                      onClick={() => setDevicePreview('desktop')}
                      className={`p-1 rounded ${devicePreview === 'desktop' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}
                      title="데스크탑"
                    >
                      <Monitor size={14} />
                    </button>
                    <button
                      onClick={() => setDevicePreview('tablet')}
                      className={`p-1 rounded ${devicePreview === 'tablet' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}
                      title="태블릿"
                    >
                      <Laptop size={14} />
                    </button>
                    <button
                      onClick={() => setDevicePreview('mobile')}
                      className={`p-1 rounded ${devicePreview === 'mobile' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}
                      title="모바일"
                    >
                      <Smartphone size={14} />
                    </button>
                  </div>
                  <div className="flex bg-gray-800 rounded p-0.5">
                    <button
                      onClick={handleUndo}
                      disabled={!canUndo}
                      className={`p-1 rounded ${canUndo ? 'text-gray-400 hover:text-white' : 'text-gray-600 cursor-not-allowed'}`}
                      title="실행 취소"
                    >
                      <Undo2 size={14} />
                    </button>
                    <button
                      onClick={handleRedo}
                      disabled={!canRedo}
                      className={`p-1 rounded ${canRedo ? 'text-gray-400 hover:text-white' : 'text-gray-600 cursor-not-allowed'}`}
                      title="다시 실행"
                    >
                      <Redo2 size={14} />
                    </button>
                  </div>
                </>
              )}
              <button onClick={handleLoad} className="p-1 text-gray-400 hover:text-white transition-colors" title="불러오기">
                <FolderOpen size={16} />
              </button>
              <button onClick={handleSave} disabled={isSaving} className="p-1 text-gray-400 hover:text-white transition-colors disabled:opacity-50" title="저장">
                <Save size={16} />
              </button>
              {isAuthenticated && currentProject && (
                <>
                  <button onClick={() => setShowShareDialog(true)} className="p-1 text-gray-400 hover:text-white transition-colors" title="공유">
                    <Share2 size={16} />
                  </button>
                  <button onClick={() => setShowCollaborationDialog(true)} className="p-1 text-gray-400 hover:text-white transition-colors" title="협업자">
                    <Users size={16} />
                  </button>
                </>
              )}
              <div className="relative" ref={exportDropdownRef}>
                <button
                  onClick={() => setShowExportDropdown(!showExportDropdown)}
                  disabled={isExporting}
                  className="bg-white text-black px-2 py-1 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors flex items-center gap-1 whitespace-nowrap disabled:opacity-50"
                >
                  <Download size={12} /> 내보내기 <ChevronDown size={10} />
                </button>
                {showExportDropdown && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[9999] overflow-hidden">
                    <button
                      onClick={handleExport}
                      className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                      <FileText size={14} />
                      <span>HTML 파일</span>
                    </button>
                    <button
                      onClick={handleExportPDF}
                      className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                      <Download size={14} />
                      <span>PDF 파일</span>
                    </button>
                    <button
                      onClick={handleExportImage}
                      className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                      <FileImage size={14} />
                      <span>이미지 (PNG)</span>
                    </button>
                    <button
                      onClick={handleExportSectionImages}
                      className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                      <FileImage size={14} />
                      <span>섹션별 이미지</span>
                    </button>
                    <button
                      onClick={handleExportThumbnail}
                      className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                      <FileImage size={14} />
                      <span>썸네일 (OG)</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Main Workspace - 태블릿용 */}
        <main className="flex-1 flex overflow-hidden relative">
          {viewMode === 'editor' ? (
            <>
              <div className="w-72 flex-shrink-0 h-full z-10 shadow-xl">
                <Editor sections={sections} setSections={handleSetSections} />
              </div>
              <div className="flex-1 bg-gray-950 flex items-center justify-center overflow-hidden relative">
                <div className={`transition-all duration-500 overflow-hidden bg-black ${devicePreview === 'mobile'
                  ? 'w-[375px] h-[812px] rounded-[3rem] border-8 border-gray-800 shadow-2xl'
                  : devicePreview === 'tablet'
                    ? 'w-[768px] h-[1024px] rounded-[2rem] border-8 border-gray-800 shadow-2xl'
                    : 'w-full h-full'
                  }`}>
                  <div className="w-full h-full overflow-y-auto no-scrollbar scroll-smooth">
                    <PreviewRender sections={sections} />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full overflow-y-auto scroll-smooth">
              <PreviewRender sections={sections} isPreviewMode={true} />
              <button
                onClick={() => setViewMode('editor')}
                className="fixed bottom-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full hover:bg-white/20 transition-all z-50 flex items-center gap-2"
              >
                <Edit3 size={16} /> 편집으로 돌아가기
              </button>
            </div>
          )}
        </main>

        {/* 모달들 - 태블릿 */}
        {showRecoveryModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100]">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">로컬 저장 데이터 발견</h3>
                <button onClick={handleRecoveryCancel} className="p-1 text-gray-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              <p className="text-gray-300 mb-2">
                브라우저에 임시 저장된 프로젝트가 있어요.<br />
                <span className="text-gray-500 text-sm">({pendingRecoveryData?.length || 0}개 섹션)</span>
              </p>
              <p className="text-yellow-400 text-sm mb-4">⚠️ 로그인하면 클라우드에 안전하게 저장할 수 있어요.</p>
              <div className="flex flex-col gap-2">
                <div className="flex gap-3">
                  <button onClick={handleRecoveryCancel} className="flex-1 px-4 py-2.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors">새로 시작</button>
                  <button onClick={handleRecoveryConfirm} className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors font-medium">불러오기</button>
                </div>
                <button onClick={handleRecoveryDelete} className="w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors border border-red-900/30">
                  로컬 데이터 완전히 삭제
                </button>
              </div>
            </div>
          </div>
        )}

        {showMigrationModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100]">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">로컬 데이터 발견</h3>
                <button onClick={handleMigrationLater} className="p-1 text-gray-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              <p className="text-gray-300 mb-4">
                로그인 전에 작업하던 프로젝트가 있어요.<br />
                <span className="text-gray-500 text-sm">({pendingMigrationData?.length || 0}개 섹션)</span>
              </p>
              <p className="text-yellow-400 text-sm mb-6">클라우드에 저장하면 어디서든 접근할 수 있어요.</p>
              <div className="flex flex-col gap-2">
                <button onClick={handleMigrationConfirm} disabled={isSaving} className="w-full px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors font-medium disabled:opacity-50">
                  {isSaving ? '저장 중...' : '클라우드에 저장'}
                </button>
                <button onClick={handleMigrationLater} className="w-full px-4 py-2.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors">나중에 하기</button>
                <button onClick={handleMigrationCancel} className="w-full px-4 py-2.5 text-gray-500 hover:text-gray-400 text-sm transition-colors">로컬 데이터 삭제</button>
              </div>
            </div>
          </div>
        )}

        {currentProject && showShareDialog && (
          <Suspense fallback={null}>
            <ShareDialog
              isOpen={showShareDialog}
              onClose={() => setShowShareDialog(false)}
              projectId={currentProject.id}
              projectTitle={currentProject.title}
              isPublic={shareStatus.isPublic}
              shareId={shareStatus.shareId}
              onShareStatusChange={(isPublic, shareId) => setShareStatus({ isPublic, shareId })}
            />
          </Suspense>
        )}

        {currentProject && showCollaborationDialog && (
          <Suspense fallback={null}>
            <CollaborationDialog
              isOpen={showCollaborationDialog}
              onClose={() => setShowCollaborationDialog(false)}
              projectId={currentProject.id}
              projectTitle={currentProject.title}
              isOwner={currentProject.user_id === userId}
            />
          </Suspense>
        )}
      </div>
    );
  }

  // 데스크탑 레이아웃 (고정 크기 + 가로 스크롤)
  return (
    <div className="h-screen w-screen flex flex-col bg-black overflow-hidden">
      {/* Top Navigation Bar - 고정 크기, 1400px 미만에서 가로 스크롤 */}
      <nav className="h-14 border-b border-gray-800 bg-gray-900 flex items-center justify-between px-4 z-50 min-w-[1200px] overflow-visible">
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white text-lg">S</div>
            <span className="font-serif font-bold text-white tracking-wide">StoryFlow</span>
          </div>

          {/* 프로젝트 선택 드롭다운 (로그인 시에만 표시) */}
          {isAuthenticated && (
            <div className="relative" ref={projectDropdownRef}>
              <button
                onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 hover:text-white hover:border-gray-600 transition-colors max-w-[200px]"
              >
                <FileText size={14} className="flex-shrink-0" />
                <span className="truncate">
                  {currentProject?.title || '프로젝트'}
                </span>
                <ChevronDown size={12} className={`flex-shrink-0 transition-transform ${showProjectDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showProjectDropdown && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[9999] overflow-hidden">
                  {/* 프로젝트 목록 */}
                  <div className="max-h-48 overflow-y-auto">
                    {projects.length === 0 ? (
                      <div className="px-3 py-4 text-center text-gray-500 text-sm">
                        프로젝트가 없어요
                      </div>
                    ) : (
                      projects.map((project) => (
                        <div
                          key={project.id}
                          onClick={() => handleSwitchProject(project)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 text-left text-sm transition-colors cursor-pointer ${currentProject?.id === project.id
                            ? 'bg-indigo-600/20 text-indigo-300'
                            : 'text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                          <span className="truncate flex-1">{project.title}</span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => handleRenameProject(project.id, e)}
                              className="p-1 text-gray-500 hover:text-blue-400 transition-colors"
                              title="이름 변경"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={(e) => handleDeleteProject(project.id, e)}
                              className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                              title="삭제"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* 새 프로젝트 버튼 */}
                  <div className="border-t border-gray-700">
                    <button
                      onClick={handleCreateNewProject}
                      disabled={projects.length >= MAX_PROJECTS}
                      className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm transition-colors ${projects.length >= MAX_PROJECTS
                        ? 'text-gray-600 cursor-not-allowed'
                        : 'text-indigo-400 hover:bg-gray-700 hover:text-indigo-300'
                        }`}
                    >
                      <Plus size={14} />
                      <span>새 프로젝트</span>
                      <span className="text-gray-500 text-xs ml-auto">
                        {projects.length}/{MAX_PROJECTS}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 중앙/우측 요소들 - 고정 크기 */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* 편집/미리보기 토글 */}
          <div className="flex items-center bg-gray-800 rounded-lg p-1 border border-gray-700">
            <button
              onClick={() => setViewMode('editor')}
              className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-2 whitespace-nowrap transition-colors ${viewMode === 'editor' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
            >
              <Edit3 size={14} /> 편집
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-2 whitespace-nowrap transition-colors ${viewMode === 'preview' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
            >
              <Eye size={14} /> 미리보기
            </button>
          </div>

          {/* 도구 버튼들 */}
          <div className="flex items-center gap-2">
            {viewMode === 'editor' && (
              <>
                <div className="flex bg-gray-800 rounded p-1">
                  <button
                    onClick={() => setDevicePreview('desktop')}
                    className={`p-1.5 rounded ${devicePreview === 'desktop' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    title="데스크탑 프리뷰"
                  >
                    <Monitor size={16} />
                  </button>
                  <button
                    onClick={() => setDevicePreview('tablet')}
                    className={`p-1.5 rounded ${devicePreview === 'tablet' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    title="태블릿 프리뷰"
                  >
                    <Laptop size={16} />
                  </button>
                  <button
                    onClick={() => setDevicePreview('mobile')}
                    className={`p-1.5 rounded ${devicePreview === 'mobile' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    title="모바일 프리뷰"
                  >
                    <Smartphone size={16} />
                  </button>
                </div>
                <div className="flex bg-gray-800 rounded p-1">
                  <button
                    onClick={handleUndo}
                    disabled={!canUndo}
                    className={`p-1.5 rounded ${canUndo ? 'text-gray-400 hover:text-white' : 'text-gray-600 cursor-not-allowed'}`}
                    title="실행 취소 (Ctrl+Z)"
                  >
                    <Undo2 size={16} />
                  </button>
                  <button
                    onClick={handleRedo}
                    disabled={!canRedo}
                    className={`p-1.5 rounded ${canRedo ? 'text-gray-400 hover:text-white' : 'text-gray-600 cursor-not-allowed'}`}
                    title="다시 실행 (Ctrl+Y)"
                  >
                    <Redo2 size={16} />
                  </button>
                </div>
              </>
            )}
            <button
              onClick={handleLoad}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="불러오기"
            >
              <FolderOpen size={18} />
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              title={lastSaved ? `마지막 저장: ${lastSaved}` : '저장'}
            >
              <Save size={18} />
            </button>
            {isAuthenticated && currentProject && (
              <>
                <button
                  onClick={() => setShowShareDialog(true)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  title="공유"
                >
                  <Share2 size={18} />
                </button>
                <button
                  onClick={() => setShowCollaborationDialog(true)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  title="협업자 관리"
                >
                  <Users size={18} />
                </button>
              </>
            )}
            <div className="relative" ref={exportDropdownRef}>
              <button
                onClick={() => setShowExportDropdown(!showExportDropdown)}
                disabled={isExporting}
                className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
              >
                <Download size={14} /> {isExporting ? '준비 중...' : '내보내기'} <ChevronDown size={12} />
              </button>
              {showExportDropdown && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[9999] overflow-hidden">
                  <button
                    onClick={handleExport}
                    className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <FileText size={14} />
                    <span>HTML 파일</span>
                  </button>
                  <button
                    onClick={handleExportPDF}
                    className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <Download size={14} />
                    <span>PDF 파일</span>
                  </button>
                  <button
                    onClick={handleExportImage}
                    className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <FileImage size={14} />
                    <span>이미지 (PNG)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 유저 메뉴 */}
        <div className="flex items-center flex-shrink-0">
          <UserMenu />
        </div>
      </nav>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden relative">
        {viewMode === 'editor' ? (
          <>
            {/* Editor Sidebar - 고정 크기 */}
            <div className="w-96 flex-shrink-0 h-full z-10 shadow-xl">
              <Editor sections={sections} setSections={handleSetSections} />
            </div>

            {/* Live Canvas */}
            <div className="flex-1 bg-gray-950 flex items-center justify-center overflow-hidden relative">
              <div className={`transition-all duration-500 overflow-hidden bg-black ${devicePreview === 'mobile'
                ? 'w-[375px] h-[812px] rounded-[3rem] border-8 border-gray-800 shadow-2xl'
                : devicePreview === 'tablet'
                  ? 'w-[768px] h-[1024px] rounded-[2rem] border-8 border-gray-800 shadow-2xl'
                  : 'w-full h-full'
                }`}>
                <div className="w-full h-full overflow-y-auto no-scrollbar scroll-smooth">
                  <PreviewRender sections={sections} />
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Full Screen Preview Mode */
          <div className="w-full h-full overflow-y-auto scroll-smooth">
            <PreviewRender sections={sections} isPreviewMode={true} />

            <button
              onClick={() => setViewMode('editor')}
              className="fixed bottom-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full hover:bg-white/20 transition-all z-50 flex items-center gap-2"
            >
              <Edit3 size={16} /> 편집으로 돌아가기
            </button>
          </div>
        )}
      </main>

      {/* 프로젝트 복구 모달 */}
      {showRecoveryModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">로컬 저장 데이터 발견</h3>
              <button
                onClick={handleRecoveryCancel}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-300 mb-2">
              브라우저에 임시 저장된 프로젝트가 있어요.<br />
              <span className="text-gray-500 text-sm">({pendingRecoveryData?.length || 0}개 섹션)</span>
            </p>
            <p className="text-yellow-400 text-sm mb-4">
              ⚠️ 로그인하면 클라우드에 안전하게 저장할 수 있어요.
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex gap-3">
                <button
                  onClick={handleRecoveryCancel}
                  className="flex-1 px-4 py-2.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  새로 시작
                </button>
                <button
                  onClick={handleRecoveryConfirm}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors font-medium"
                >
                  불러오기
                </button>
              </div>
              <button
                onClick={handleRecoveryDelete}
                className="w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors border border-red-900/30"
              >
                로컬 데이터 완전히 삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 로컬 데이터 마이그레이션 모달 */}
      {showMigrationModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">로컬 데이터 발견</h3>
              <button
                onClick={handleMigrationLater}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-300 mb-4">
              로그인 전에 작업하던 프로젝트가 있어요.<br />
              <span className="text-gray-500 text-sm">({pendingMigrationData?.length || 0}개 섹션)</span>
            </p>
            <p className="text-yellow-400 text-sm mb-6">
              클라우드에 저장하면 어디서든 접근할 수 있어요.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleMigrationConfirm}
                disabled={isSaving}
                className="w-full px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors font-medium disabled:opacity-50"
              >
                {isSaving ? '저장 중...' : '클라우드에 저장'}
              </button>
              <button
                onClick={handleMigrationLater}
                className="w-full px-4 py-2.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                나중에 하기
              </button>
              <button
                onClick={handleMigrationCancel}
                className="w-full px-4 py-2.5 text-gray-500 hover:text-gray-400 text-sm transition-colors"
              >
                로컬 데이터 삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 공유 다이얼로그 (동적 로드) */}
      {currentProject && showShareDialog && (
        <Suspense fallback={null}>
          <ShareDialog
            isOpen={showShareDialog}
            onClose={() => setShowShareDialog(false)}
            projectId={currentProject.id}
            projectTitle={currentProject.title}
            isPublic={shareStatus.isPublic}
            shareId={shareStatus.shareId}
            onShareStatusChange={(isPublic, shareId) => {
              setShareStatus({ isPublic, shareId });
            }}
          />
        </Suspense>
      )}

      {/* 협업자 관리 다이얼로그 (동적 로드) */}
      {currentProject && showCollaborationDialog && (
        <Suspense fallback={null}>
          <CollaborationDialog
            isOpen={showCollaborationDialog}
            onClose={() => setShowCollaborationDialog(false)}
            projectId={currentProject.id}
            projectTitle={currentProject.title}
            isOwner={currentProject.user_id === userId}
          />
        </Suspense>
      )}
    </div>
  );
}

export default App;