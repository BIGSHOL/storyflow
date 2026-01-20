import React, { useState, useCallback, useEffect, useRef } from 'react';
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
import { exportToHTML } from './services/exportService';
import { saveProject, loadProject, loadAutoSave, autoSave, hasSavedProject } from './services/storageService';
import UserMenu from './components/UserMenu';
import ShareDialog from './components/ShareDialog';
import CollaborationDialog from './components/CollaborationDialog';
import { useAuth } from './hooks/useAuth';
import { useProject } from './hooks/useProject';

const MAX_HISTORY = 50;

function App() {
  const { isAuthenticated } = useAuth();
  const { currentProject, saveAsNewProject, updateCurrentProject } = useProject();

  const [sections, setSections] = useState<Section[]>([]);
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'mobile'>('desktop');
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

  // 현재 프로젝트 변경 시 공유 상태 동기화
  useEffect(() => {
    if (currentProject) {
      setShareStatus({
        isPublic: currentProject.is_public,
        shareId: currentProject.share_id,
      });
    }
  }, [currentProject]);

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
    if (hasSavedProject()) {
      const saved = loadProject() || loadAutoSave();
      if (saved && saved.length > 0) {
        setPendingRecoveryData(saved);
        setShowRecoveryModal(true);
      }
    }
  }, []);

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
      autoSave(sections);
    }
  }, [sections]);

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
        if (currentProject) {
          // 기존 프로젝트 업데이트
          const { updateProject } = await import('./services/projectService');
          const { error } = await updateProject(currentProject.id, { sections });
          if (error) throw error;
          setLastSaved(new Date().toLocaleTimeString());
          alert('클라우드에 저장되었어요!');
        } else {
          // 새 프로젝트 생성
          const title = prompt('프로젝트 제목을 입력하세요:', '새 프로젝트');
          if (!title) {
            setIsSaving(false);
            return;
          }
          const result = await saveAsNewProject(title, sections);
          if (result) {
            setLastSaved(new Date().toLocaleTimeString());
            alert('클라우드에 저장되었어요!');
          } else {
            throw new Error('저장 실패');
          }
        }
      } else {
        // 비로그인 상태면 로컬에 저장
        const success = await saveProject(sections);
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
  }, [sections, isAuthenticated, currentProject, saveAsNewProject]);

  // 프로젝트 불러오기
  const handleLoad = useCallback(() => {
    const saved = loadProject() || loadAutoSave();
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
  }, [sections]);

  // HTML 내보내기 기능
  const handleExport = useCallback(async () => {
    if (sections.length === 0) {
      alert('내보낼 섹션이 없어요. 먼저 섹션을 추가해주세요.');
      return;
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

  return (
    <div className="h-screen w-screen flex flex-col bg-black overflow-hidden">
      {/* Top Navigation Bar */}
      <nav className="h-14 border-b border-gray-800 bg-gray-900 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white text-lg">S</div>
          <span className="font-serif font-bold text-white tracking-wide">StoryFlow</span>
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
            <button
              onClick={() => setShowShareDialog(true)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="공유"
            >
              <Share2 size={18} />
            </button>
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

      {/* 공유 다이얼로그 */}
      {currentProject && (
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
      )}
    </div>
  );
}

export default App;