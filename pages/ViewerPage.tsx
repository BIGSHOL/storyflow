import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PreviewRender from '../components/PreviewRender';
import { getSharedProject } from '../services/shareService';
import type { Section } from '../types';
import type { Project } from '../types/database';
import Loader from 'lucide-react/dist/esm/icons/loader';
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle';
import Home from 'lucide-react/dist/esm/icons/home';

const ViewerPage: React.FC = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ViewerPage에서는 body 스크롤 활성화
  useEffect(() => {
    document.body.classList.remove('overflow-hidden');
    document.body.style.overflow = 'auto';

    return () => {
      // 페이지 떠날 때 원래대로 복구
      document.body.classList.add('overflow-hidden');
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      if (!shareId) {
        setError('잘못된 공유 링크예요.');
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await getSharedProject(shareId);

        if (fetchError || !data) {
          setError('프로젝트를 찾을 수 없어요. 링크가 만료되었거나 비공개 상태일 수 있어요.');
        } else {
          setProject(data);
          // 탭 제목을 프로젝트 이름으로 설정
          document.title = `${data.title} | StoryFlow`;
        }
      } catch (err) {
        setError('프로젝트를 불러오는데 실패했어요.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [shareId]);

  // 컴포넌트 언마운트 시 기본 제목 복원
  useEffect(() => {
    return () => {
      document.title = 'StoryFlow Creator';
    };
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">불러오는 중...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !project) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">페이지를 찾을 수 없어요</h1>
          <p className="text-gray-400 mb-6">
            {error || '요청하신 프로젝트를 찾을 수 없어요.'}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
          >
            <Home size={18} />
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  // Parse sections from JSONB
  const sections = (project.sections as unknown as Section[]) || [];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">
                S
              </div>
              <span className="font-serif font-bold text-white text-sm">StoryFlow</span>
            </Link>
            <span className="text-gray-600">|</span>
            <h1 className="text-gray-300 truncate max-w-[200px] md:max-w-md">{project.title}</h1>
          </div>
          <Link
            to="/"
            className="px-4 py-1.5 bg-indigo-600 text-white text-sm rounded-full hover:bg-indigo-500 transition-colors"
          >
            나도 만들기
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="pt-14">
        {sections.length > 0 ? (
          <PreviewRender sections={sections} isPreviewMode={true} />
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-500">아직 콘텐츠가 없어요</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            Made with{' '}
            <Link to="/" className="text-indigo-400 hover:text-indigo-300">
              StoryFlow
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ViewerPage;
