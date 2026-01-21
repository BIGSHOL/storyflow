import React, { useState, useCallback, useEffect, useRef, lazy, Suspense } from 'react';
import { Section } from './types';
import Editor from './components/Editor';
import PreviewRender from './components/PreviewRender';
// lucide-react 직접 import (번들 최적화)
import Eye from 'lucide-react/dist/esm/icons/eye';
import Edit3 from 'lucide-react/dist/esm/icons/edit-3';
import Download from 'lucide-react/dist/esm/icons/download';
import Smartphone from 'lucide-react/dist/esm/icons/smartphone';
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
import { exportToHTML, hasBlobUrls } from './services/exportService';
import { saveProject, loadProject, loadAutoSave, autoSave, hasSavedProject } from './services/storageService';
import { uploadMedia } from './services/mediaService';
import UserMenu from './components/UserMenu';
import { useAuth } from './hooks/useAuth';
import { useProject } from './hooks/useProject';
import { useIsMobile } from './hooks/useIsMobile';
import Menu from 'lucide-react/dist/esm/icons/menu';
import MobileLayout from './components/MobileLayout';

// blob URL을 Supabase Storage URL로 마이그레이션
const migrateBlobUrlsToStorage = async (sections: Section[]): Promise<Section[]> => {
  const migratedSections = await Promise.all(
    sections.map(async (section) => {
      // blob URL인 경우만 마이그레이션
      if (section.mediaUrl?.startsWith('blob:')) {
        try {
          const response = await fetch(section.mediaUrl);
          const blob = await response.blob();
          const fileName = `media-${Date.now()}.${blob.type.split('/')[1] || 'jpg'}`;
          const file = new File([blob], fileName, { type: blob.type });

          const { data, error } = await uploadMedia(file);
          if (error || !data?.public_url) {
            console.error('미디어 마이그레이션 실패:', error);
            return section; // 실패 시 원본 유지
          }

          // blob URL 해제
          URL.revokeObjectURL(section.mediaUrl);

          return { ...section, mediaUrl: data.public_url };
        } catch (err) {
          console.error('blob URL 변환 실패:', err);
          return section;
        }
      }
      return section;
    })
  );
  return migratedSections;
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

  const [sections, setSections] = useState<Section[]>([]);
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'mobile'>('desktop');
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

  // 프로젝트 개수 제한
  const MAX_PROJECTS = 3;

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (projectDropdownRef.current && !projectDropdownRef.current.contains(event.target as Node)) {
        setShowProjectDropdown(false);
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
      // 프로젝트의 섹션 데이터를 에디터에 로드
      const projectSections = (currentProject.sections as unknown as Section[]) || [];
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

  // 로그인 후 가장 최근 프로젝트 자동 로드
  useEffect(() => {
    if (isAuthenticated && !authLoading && projects.length > 0 && !currentProject) {
      // 가장 최근에 업데이트된 프로젝트 로드 (이미 fetch된 데이터 사용)
      const sortedProjects = [...projects].sort((a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
      const latestProject = sortedProjects[0];
      if (latestProject) {
        setCurrentProject(latestProject);
      }
    }
  }, [isAuthenticated, authLoading, projects, currentProject, setCurrentProject]);

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

  // 섹션 변경 래퍼
  const handleSetSections: React.Dispatch<React.SetStateAction<Section[]>> = useCallback((action) => {
    setSections(prev => {
      const newSections = typeof action === 'function' ? action(prev) : action;
      pushHistory(newSections);
      return newSections;
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

    if (hasSavedProject(userId)) {
      const saved = loadProject(userId) || loadAutoSave(userId);
      if (saved && saved.length > 0) {
        setPendingRecoveryData(saved);
        setShowRecoveryModal(true);
      }
    }
  }, [authLoading, userId]);

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

  // 복구 취소
  const handleRecoveryCancel = useCallback(() => {
    setShowRecoveryModal(false);
    setPendingRecoveryData(null);
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
        const hasBlobUrls = sections.some(s => s.mediaUrl?.startsWith('blob:'));
        let sectionsToSave = sections;

        if (hasBlobUrls) {
          sectionsToSave = await migrateBlobUrlsToStorage(sections);
          // 마이그레이션된 섹션으로 상태 업데이트
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
  }, [sections, isAuthenticated, currentProject, saveAsNewProject, userId, setSections]);

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

  // 모바일 레이아웃 렌더링
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
          onCreateProject={handleCreateNewProject}
          onSwitchProject={handleSwitchProject}
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
              <h3 className="text-lg font-bold text-white mb-2">프로젝트 복구</h3>
              <p className="text-gray-300 mb-6">
                이전에 작업하던 프로젝트가 있어요.<br />
                <span className="text-gray-500 text-sm">({pendingRecoveryData?.length || 0}개 섹션)</span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleRecoveryCancel}
                  className="flex-1 px-4 py-2.5 bg-gray-800 text-gray-300 rounded-lg"
                >
                  새로 시작
                </button>
                <button
                  onClick={handleRecoveryConfirm}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium"
                >
                  불러오기
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // 데스크탑 레이아웃
  return (
    <div className="h-screen w-screen flex flex-col bg-black overflow-hidden">
      {/* Top Navigation Bar */}
      <nav className="h-14 border-b border-gray-800 bg-gray-900 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white text-lg">S</div>
            <span className="font-serif font-bold text-white tracking-wide hidden sm:inline">StoryFlow</span>
          </div>

          {/* 프로젝트 선택 드롭다운 (로그인 시에만 표시) */}
          {isAuthenticated && (
            <div className="relative" ref={projectDropdownRef}>
              <button
                onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 hover:text-white hover:border-gray-600 transition-colors max-w-[180px]"
              >
                <FileText size={14} className="flex-shrink-0" />
                <span className="truncate">
                  {currentProject?.title || '프로젝트 선택'}
                </span>
                <ChevronDown size={14} className={`flex-shrink-0 transition-transform ${showProjectDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showProjectDropdown && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                  {/* 프로젝트 목록 */}
                  <div className="max-h-48 overflow-y-auto">
                    {projects.length === 0 ? (
                      <div className="px-3 py-4 text-center text-gray-500 text-sm">
                        프로젝트가 없어요
                      </div>
                    ) : (
                      projects.map((project) => (
                        <button
                          key={project.id}
                          onClick={() => handleSwitchProject(project)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 text-left text-sm transition-colors ${
                            currentProject?.id === project.id
                              ? 'bg-indigo-600/20 text-indigo-300'
                              : 'text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          <span className="truncate flex-1">{project.title}</span>
                          <button
                            onClick={(e) => handleDeleteProject(project.id, e)}
                            className="p-1 text-gray-500 hover:text-red-400 transition-colors ml-2"
                            title="삭제"
                          >
                            <Trash2 size={14} />
                          </button>
                        </button>
                      ))
                    )}
                  </div>

                  {/* 새 프로젝트 버튼 */}
                  <div className="border-t border-gray-700">
                    <button
                      onClick={handleCreateNewProject}
                      disabled={projects.length >= MAX_PROJECTS}
                      className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm transition-colors ${
                        projects.length >= MAX_PROJECTS
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

        <div className="flex items-center bg-gray-800 rounded-lg p-1 border border-gray-700">
           <button 
             onClick={() => setViewMode('editor')}
             className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-2 transition-colors ${viewMode === 'editor' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
           >
             <Edit3 size={14} /> 편집
           </button>
           <button 
             onClick={() => setViewMode('preview')}
             className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-2 transition-colors ${viewMode === 'preview' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
           >
             <Eye size={14} /> 미리보기
           </button>
        </div>

        <div className="flex items-center gap-2">
          {viewMode === 'editor' && (
            <>
              <div className="hidden md:flex bg-gray-800 rounded p-1 mr-2">
                <button onClick={() => setDevicePreview('desktop')} className={`p-1.5 rounded ${devicePreview === 'desktop' ? 'bg-gray-600 text-white' : 'text-gray-400'}`}>
                  <Monitor size={16} />
                </button>
                <button onClick={() => setDevicePreview('mobile')} className={`p-1.5 rounded ${devicePreview === 'mobile' ? 'bg-gray-600 text-white' : 'text-gray-400'}`}>
                  <Smartphone size={16} />
                </button>
              </div>
              <div className="hidden md:flex bg-gray-800 rounded p-1 mr-2">
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
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Download size={14} /> {isExporting ? '준비 중...' : '내보내기'}
          </button>
          <div className="ml-2 border-l border-gray-700 pl-3">
            <UserMenu />
          </div>
        </div>
      </nav>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden relative">
        {viewMode === 'editor' ? (
          <>
            {/* Editor Sidebar */}
            <div className="w-80 md:w-96 flex-shrink-0 h-full z-10 shadow-xl">
              <Editor sections={sections} setSections={handleSetSections} />
            </div>

            {/* Live Canvas */}
            <div className="flex-1 bg-gray-950 flex items-center justify-center p-8 overflow-hidden relative">
               
               <div className={`transition-all duration-500 shadow-2xl overflow-hidden bg-black ${
                 devicePreview === 'mobile' 
                   ? 'w-[375px] h-[812px] rounded-[3rem] border-8 border-gray-800' 
                   : 'w-full h-full rounded-sm border border-gray-800'
               }`}>
                  <div className="w-full h-full overflow-y-auto no-scrollbar scroll-smooth">
                    <PreviewRender sections={sections} />
                  </div>
               </div>
            </div>
          </>
        ) : (
          /* Full Screen Preview Mode */
          <div className="w-full h-full">
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
              <h3 className="text-lg font-bold text-white">프로젝트 복구</h3>
              <button
                onClick={handleRecoveryCancel}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-300 mb-6">
              이전에 작업하던 프로젝트가 있어요.<br />
              <span className="text-gray-500 text-sm">({pendingRecoveryData?.length || 0}개 섹션)</span>
            </p>
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