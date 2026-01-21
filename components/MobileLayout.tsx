import React, { useState, useCallback, lazy, Suspense } from 'react';
import { Section } from '../types';
import Editor from './Editor';
import PreviewRender from './PreviewRender';
import UserMenu from './UserMenu';
// lucide-react 직접 import (bundle-barrel-imports)
import Edit3 from 'lucide-react/dist/esm/icons/edit-3';
import Eye from 'lucide-react/dist/esm/icons/eye';
import Save from 'lucide-react/dist/esm/icons/save';
import Download from 'lucide-react/dist/esm/icons/download';
import Share2 from 'lucide-react/dist/esm/icons/share-2';
import Menu from 'lucide-react/dist/esm/icons/menu';
import X from 'lucide-react/dist/esm/icons/x';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import FileText from 'lucide-react/dist/esm/icons/file-text';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import Users from 'lucide-react/dist/esm/icons/users';
import Undo2 from 'lucide-react/dist/esm/icons/undo-2';
import Redo2 from 'lucide-react/dist/esm/icons/redo-2';
import Edit2 from 'lucide-react/dist/esm/icons/edit-2';
import type { Project } from '../types/database';

// bundle-dynamic-imports: 모달은 필요할 때만 로드
const ShareDialog = lazy(() => import('./ShareDialog'));
const CollaborationDialog = lazy(() => import('./CollaborationDialog'));

// rendering-hoist-jsx: 정적 스타일을 컴포넌트 외부로 호이스트
const mobileStyles = `
  @keyframes slide-in-right {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
  .animate-slide-in-right {
    animation: slide-in-right 0.2s ease-out;
  }
  .safe-area-bottom {
    padding-bottom: env(safe-area-inset-bottom, 0);
  }
`;

// rendering-hoist-jsx: 빈 프로젝트 메시지 호이스트
const emptyProjectsMessage = (
  <div className="text-center py-8 text-gray-500">
    프로젝트가 없어요
  </div>
);

interface MobileLayoutProps {
  sections: Section[];
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
  viewMode: 'editor' | 'preview';
  setViewMode: (mode: 'editor' | 'preview') => void;
  isAuthenticated: boolean;
  currentProject: Project | null;
  projects: Project[];
  onSave: () => void;
  onExport: () => void;
  onCreateProject: () => void;
  onSwitchProject: (project: Project) => void;
  onRenameProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  isSaving: boolean;
  isExporting: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  maxProjects: number;
  userId: string | null;
  shareStatus: { isPublic: boolean; shareId: string | null };
  onShareStatusChange: (isPublic: boolean, shareId: string | null) => void;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  sections,
  setSections,
  viewMode,
  setViewMode,
  isAuthenticated,
  currentProject,
  projects,
  onSave,
  onExport,
  onCreateProject,
  onSwitchProject,
  onRenameProject,
  onDeleteProject,
  isSaving,
  isExporting,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  maxProjects,
  userId,
  shareStatus,
  onShareStatusChange,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showCollaborationDialog, setShowCollaborationDialog] = useState(false);

  // rerender-functional-setstate: 안정적인 콜백을 위해 함수형 setState 사용
  const openMenu = useCallback(() => setShowMenu(true), []);
  const closeMenu = useCallback(() => setShowMenu(false), []);
  const openProjects = useCallback(() => setShowProjects(true), []);
  const closeProjects = useCallback(() => setShowProjects(false), []);
  const openShareDialog = useCallback(() => {
    setShowShareDialog(true);
    setShowMenu(false);
  }, []);
  const closeShareDialog = useCallback(() => setShowShareDialog(false), []);
  const openCollaborationDialog = useCallback(() => {
    setShowCollaborationDialog(true);
    setShowMenu(false);
  }, []);
  const closeCollaborationDialog = useCallback(() => setShowCollaborationDialog(false), []);
  const openProjectsFromMenu = useCallback(() => {
    setShowProjects(true);
    setShowMenu(false);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-black overflow-hidden">
      {/* 모바일 상단 바 */}
      <nav className="h-12 border-b border-gray-800 bg-gray-900 flex items-center justify-between px-2 z-50 flex-shrink-0">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
            S
          </div>
          {/* rendering-conditional-render: 삼항 연산자 사용 */}
          {currentProject ? (
            <button
              onClick={openProjects}
              className="flex items-center gap-0.5 text-sm text-gray-300 min-w-0"
            >
              <span className="truncate max-w-[100px]">{currentProject.title}</span>
              <ChevronRight size={12} className="flex-shrink-0" />
            </button>
          ) : null}
        </div>

        <div className="flex items-center gap-0.5 flex-shrink-0">
          {/* Undo/Redo 버튼 - rendering-conditional-render */}
          {viewMode === 'editor' ? (
            <div className="flex items-center">
              <button
                onClick={onUndo}
                disabled={!canUndo}
                className={`p-1.5 rounded ${canUndo ? 'text-gray-400' : 'text-gray-700'}`}
              >
                <Undo2 size={16} />
              </button>
              <button
                onClick={onRedo}
                disabled={!canRedo}
                className={`p-1.5 rounded ${canRedo ? 'text-gray-400' : 'text-gray-700'}`}
              >
                <Redo2 size={16} />
              </button>
            </div>
          ) : null}
          <UserMenu />
          <button
            onClick={openMenu}
            className="p-1.5 text-gray-400"
          >
            <Menu size={18} />
          </button>
        </div>
      </nav>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 overflow-hidden relative">
        {viewMode === 'editor' ? (
          <div className="h-full overflow-y-auto">
            <Editor sections={sections} setSections={setSections} />
          </div>
        ) : (
          <div className="h-full overflow-y-auto">
            <PreviewRender sections={sections} isPreviewMode={true} />
          </div>
        )}
      </main>

      {/* 하단 탭 바 */}
      <nav className="h-14 border-t border-gray-800 bg-gray-900 flex items-center justify-around flex-shrink-0 safe-area-bottom">
        <button
          onClick={() => setViewMode('editor')}
          className={`flex-1 flex flex-col items-center justify-center py-2 ${
            viewMode === 'editor' ? 'text-indigo-400' : 'text-gray-500'
          }`}
        >
          <Edit3 size={20} />
          <span className="text-xs mt-0.5">편집</span>
        </button>
        <button
          onClick={() => setViewMode('preview')}
          className={`flex-1 flex flex-col items-center justify-center py-2 ${
            viewMode === 'preview' ? 'text-indigo-400' : 'text-gray-500'
          }`}
        >
          <Eye size={20} />
          <span className="text-xs mt-0.5">미리보기</span>
        </button>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex-1 flex flex-col items-center justify-center py-2 text-gray-500 disabled:opacity-50"
        >
          <Save size={20} />
          <span className="text-xs mt-0.5">{isSaving ? '저장중...' : '저장'}</span>
        </button>
        <button
          onClick={onExport}
          disabled={isExporting}
          className="flex-1 flex flex-col items-center justify-center py-2 text-gray-500 disabled:opacity-50"
        >
          <Download size={20} />
          <span className="text-xs mt-0.5">{isExporting ? '준비중' : '내보내기'}</span>
        </button>
      </nav>

      {/* 사이드 메뉴 - rendering-conditional-render */}
      {showMenu ? (
        <div className="fixed inset-0 z-[100]">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={closeMenu}
          />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-gray-900 border-l border-gray-800 flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <span className="font-bold text-white">메뉴</span>
              <button
                onClick={closeMenu}
                className="p-1 text-gray-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {isAuthenticated && currentProject ? (
                <>
                  <button
                    onClick={openShareDialog}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Share2 size={18} />
                    <span>공유하기</span>
                  </button>
                  <button
                    onClick={openCollaborationDialog}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Users size={18} />
                    <span>협업자 관리</span>
                  </button>
                  <div className="border-t border-gray-800 my-3" />
                </>
              ) : null}

              <button
                onClick={openProjectsFromMenu}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <FileText size={18} />
                <span>프로젝트 관리</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* 프로젝트 목록 모달 - rendering-conditional-render */}
      {showProjects ? (
        <div className="fixed inset-0 z-[100]">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={closeProjects}
          />
          <div className="absolute inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-gray-900 border border-gray-800 rounded-2xl flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <span className="font-bold text-white">프로젝트</span>
              <button
                onClick={closeProjects}
                className="p-1 text-gray-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {projects.length === 0 ? (
                emptyProjectsMessage
              ) : (
                projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => {
                      onSwitchProject(project);
                      closeProjects();
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg mb-1 transition-colors ${
                      currentProject?.id === project.id
                        ? 'bg-indigo-600/20 text-indigo-300'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <span className="truncate flex-1 text-left">{project.title}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRenameProject(project.id);
                        }}
                        className="p-2 text-gray-500 hover:text-blue-400 transition-colors"
                        title="이름 변경"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteProject(project.id);
                        }}
                        className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                        title="삭제"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="p-3 border-t border-gray-800">
              <button
                onClick={() => {
                  onCreateProject();
                  closeProjects();
                }}
                disabled={projects.length >= maxProjects}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                  projects.length >= maxProjects
                    ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500'
                }`}
              >
                <Plus size={18} />
                <span>새 프로젝트</span>
                <span className="text-sm opacity-70">({projects.length}/{maxProjects})</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* 공유 다이얼로그 - rendering-conditional-render */}
      {currentProject && showShareDialog ? (
        <Suspense fallback={null}>
          <ShareDialog
            isOpen={showShareDialog}
            onClose={closeShareDialog}
            projectId={currentProject.id}
            projectTitle={currentProject.title}
            isPublic={shareStatus.isPublic}
            shareId={shareStatus.shareId}
            onShareStatusChange={onShareStatusChange}
          />
        </Suspense>
      ) : null}

      {/* 협업자 다이얼로그 - rendering-conditional-render */}
      {currentProject && showCollaborationDialog ? (
        <Suspense fallback={null}>
          <CollaborationDialog
            isOpen={showCollaborationDialog}
            onClose={closeCollaborationDialog}
            projectId={currentProject.id}
            projectTitle={currentProject.title}
            isOwner={currentProject.user_id === userId}
          />
        </Suspense>
      ) : null}

      {/* rendering-hoist-jsx: 호이스트된 스타일 사용 */}
      <style>{mobileStyles}</style>
    </div>
  );
};

export default MobileLayout;
