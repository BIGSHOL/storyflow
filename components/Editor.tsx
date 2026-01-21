import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Section, LayoutType, TextAlignment, TextVerticalPosition, TextHorizontalPosition, SectionHeight, ImageFilter, AnimationType, GradientOverlay, CTAButton, TextShadow, GalleryImage, TimelineItem, CardItem, StatItem, GallerySettings, CardsSettings, StatsSettings, QuoteSettings, VideoHeroSettings, TimelineAlignment } from '../types';
// lucide-react 직접 import (번들 최적화)
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import Copy from 'lucide-react/dist/esm/icons/copy';
import GripVertical from 'lucide-react/dist/esm/icons/grip-vertical';
import ImageIcon from 'lucide-react/dist/esm/icons/image';
import ArrowUp from 'lucide-react/dist/esm/icons/arrow-up';
import ArrowDown from 'lucide-react/dist/esm/icons/arrow-down';
import Plus from 'lucide-react/dist/esm/icons/plus';
import AlignLeft from 'lucide-react/dist/esm/icons/align-left';
import AlignCenter from 'lucide-react/dist/esm/icons/align-center';
import AlignRight from 'lucide-react/dist/esm/icons/align-right';
import Layout from 'lucide-react/dist/esm/icons/layout';
import Type from 'lucide-react/dist/esm/icons/type';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import X from 'lucide-react/dist/esm/icons/x';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import ChevronUp from 'lucide-react/dist/esm/icons/chevron-up';
import Palette from 'lucide-react/dist/esm/icons/palette';
import Move from 'lucide-react/dist/esm/icons/move';
import Maximize from 'lucide-react/dist/esm/icons/maximize';
import Filter from 'lucide-react/dist/esm/icons/filter';
import Layers from 'lucide-react/dist/esm/icons/layers';
import Zap from 'lucide-react/dist/esm/icons/zap';
import MousePointer from 'lucide-react/dist/esm/icons/mouse-pointer';
import Grid from 'lucide-react/dist/esm/icons/grid-3x3';
import Clock from 'lucide-react/dist/esm/icons/clock';
import CreditCard from 'lucide-react/dist/esm/icons/credit-card';
import Quote from 'lucide-react/dist/esm/icons/quote';
import BarChart3 from 'lucide-react/dist/esm/icons/bar-chart-3';
import Video from 'lucide-react/dist/esm/icons/video';
import Link from 'lucide-react/dist/esm/icons/link';
import Upload from 'lucide-react/dist/esm/icons/upload';
import { TEMPLATES, applyTemplate, Template, TEMPLATE_CATEGORIES, TemplateCategoryId } from '../data/templates';
import { optimizeImage, needsOptimization, getRecommendedOptions, formatFileSize } from '../services/imageOptimizer';
import { GOOGLE_FONTS, IMAGE_FILTERS, ANIMATIONS, GRADIENT_DIRECTIONS, SECTION_HEIGHTS, BUTTON_STYLES, BUTTON_SIZES, DEFAULT_SECTION_VALUES } from '../data/constants';
import { uploadMedia } from '../services/mediaService';
import { supabase } from '../services/supabaseClient';

// 레이아웃 타입을 한글로 변환
const getLayoutName = (layout: LayoutType): string => {
  const layoutNames: Record<LayoutType, string> = {
    [LayoutType.HERO]: '전체화면',
    [LayoutType.SPLIT_LEFT]: '이미지 왼쪽',
    [LayoutType.SPLIT_RIGHT]: '이미지 오른쪽',
    [LayoutType.FULL_IMAGE_TEXT_OVERLAY]: '배경 이미지',
    [LayoutType.SIMPLE_TEXT]: '중앙 텍스트',
    [LayoutType.GALLERY]: '갤러리',
    [LayoutType.TIMELINE]: '타임라인',
    [LayoutType.CARDS]: '카드',
    [LayoutType.QUOTE]: '인용문',
    [LayoutType.STATS]: '통계',
    [LayoutType.VIDEO_HERO]: '비디오 배경',
  };
  return layoutNames[layout] || layout;
};

interface EditorProps {
  sections: Section[];
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
}

// 파일 크기 제한 (50MB)
const MAX_FILE_SIZE = 50 * 1024 * 1024;

// 정적 JSX 호이스팅 (렌더링 최적화)
const emptyEditorStateElement = (
  <div className="text-center py-8 text-gray-500">
    <p className="mb-2">아직 섹션이 없어요</p>
    <p className="text-xs">아래 버튼을 눌러 첫 섹션을 추가하세요</p>
  </div>
);

// 아코디언 섹션 컴포넌트
const AccordionSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ title, icon, isOpen, onToggle, children }) => (
  <div className="border-t border-gray-700">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-3 px-1 text-left hover:bg-gray-700/30 transition-colors"
    >
      <span className="flex items-center gap-2 text-xs font-medium text-gray-300">
        {icon} {title}
      </span>
      {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
    </button>
    {isOpen && <div className="pb-4 space-y-4">{children}</div>}
  </div>
);

// Range input에서 부모의 드래그 이벤트가 시작되는 것을 방지
const preventDragProps = {
  onMouseDown: (e: React.MouseEvent) => e.stopPropagation(),
  onTouchStart: (e: React.TouchEvent) => e.stopPropagation(),
  onDragStart: (e: React.DragEvent) => e.preventDefault(),
  draggable: false,
};

const Editor: React.FC<EditorProps> = ({ sections, setSections }) => {
  // sections를 ref로 유지하여 콜백 재생성 방지 (rerender-functional-setstate)
  const sectionsRef = useRef(sections);
  useEffect(() => { sectionsRef.current = sections; }, [sections]);

  // O(1) 섹션 조회를 위한 Map (js-set-map-lookups 최적화)
  const sectionsMapRef = useRef(new Map<string, Section>());
  useEffect(() => {
    sectionsMapRef.current = new Map(sections.map(s => [s.id, s]));
  }, [sections]);
  const getSection = useCallback((id: string) => sectionsMapRef.current.get(id), []);

  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [dragOverSectionId, setDragOverSectionId] = useState<string | null>(null);
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategoryId | 'all'>('all');
  const [guestWarning, setGuestWarning] = useState<string | null>(null);

  // URL 입력 모드 상태
  const [urlInputMode, setUrlInputMode] = useState<Record<string, boolean>>({});
  const [urlInputValue, setUrlInputValue] = useState<Record<string, string>>({});

  // 비로그인 경고 표시 (5초 후 자동 닫힘)
  const showGuestWarning = useCallback((message: string) => {
    setGuestWarning(message);
    setTimeout(() => setGuestWarning(null), 5000);
  }, []);

  // 아코디언 상태
  const [openAccordions, setOpenAccordions] = useState<Record<string, string[]>>({});

  const toggleAccordion = (sectionId: string, accordionKey: string) => {
    setOpenAccordions(prev => {
      const current = prev[sectionId] || ['layout', 'text'];
      if (current.includes(accordionKey)) {
        return { ...prev, [sectionId]: current.filter(k => k !== accordionKey) };
      }
      return { ...prev, [sectionId]: [...current, accordionKey] };
    });
  };

  const isAccordionOpen = (sectionId: string, accordionKey: string) => {
    const current = openAccordions[sectionId] || ['layout', 'text'];
    return current.includes(accordionKey);
  };

  const addSection = useCallback(() => {
    const newSection: Section = {
      id: Math.random().toString(36).substr(2, 9),
      layout: LayoutType.FULL_IMAGE_TEXT_OVERLAY,
      title: '새로운 섹션',
      description: '내용을 입력해주세요.',
      mediaType: 'image',
      mediaUrl: '',
      textAlignment: 'left',
      splitRatio: 50,
      textColor: '#ffffff',
      backgroundColor: '#000000',
      overlayOpacity: 0.4,
      // 새로운 기본값들
      fontFamily: DEFAULT_SECTION_VALUES.fontFamily,
      titleFontSize: DEFAULT_SECTION_VALUES.titleFontSize,
      descriptionFontSize: DEFAULT_SECTION_VALUES.descriptionFontSize,
      textShadow: { ...DEFAULT_SECTION_VALUES.textShadow },
      textVerticalPosition: DEFAULT_SECTION_VALUES.textVerticalPosition,
      textHorizontalPosition: DEFAULT_SECTION_VALUES.textHorizontalPosition,
      sectionHeight: DEFAULT_SECTION_VALUES.sectionHeight,
      paddingX: DEFAULT_SECTION_VALUES.paddingX,
      paddingY: DEFAULT_SECTION_VALUES.paddingY,
      imageFilter: DEFAULT_SECTION_VALUES.imageFilter,
      imageFilterIntensity: DEFAULT_SECTION_VALUES.imageFilterIntensity,
      gradientOverlay: { ...DEFAULT_SECTION_VALUES.gradientOverlay },
      animation: DEFAULT_SECTION_VALUES.animation,
      animationDuration: DEFAULT_SECTION_VALUES.animationDuration,
      animationDelay: DEFAULT_SECTION_VALUES.animationDelay,
      ctaButton: { ...DEFAULT_SECTION_VALUES.ctaButton },
    };
    setSections(prev => [...prev, newSection]);
    setActiveSectionId(newSection.id);
  }, [setSections]);

  const handleApplyTemplate = useCallback((template: Template) => {
    sectionsRef.current.forEach(s => {
      if (s.mediaUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(s.mediaUrl);
      }
    });

    const newSections = applyTemplate(template);
    setSections(newSections);
    setShowTemplates(false);
    setActiveSectionId(newSections[0]?.id || null);
  }, [setSections]);

  const updateSection = useCallback((id: string, updates: Partial<Section>) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, [setSections]);

  const deleteSection = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const section = getSection(id);
    if (section?.mediaUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(section.mediaUrl);
    }
    setSections(prev => prev.filter(s => s.id !== id));
    setActiveSectionId(prev => prev === id ? null : prev);
  }, [setSections, getSection]);

  const moveSection = useCallback((index: number, direction: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    setSections(prev => {
      const newSections = [...prev];
      if (direction === 'up' && index > 0) {
        [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
      } else if (direction === 'down' && index < newSections.length - 1) {
        [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
      }
      return newSections;
    });
  }, [setSections]);

  const duplicateSection = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSections(prev => {
      const sectionIndex = prev.findIndex(s => s.id === id);
      if (sectionIndex === -1) return prev;

      const sectionToDuplicate = prev[sectionIndex];
      const newSection: Section = {
        ...sectionToDuplicate,
        id: `section-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        title: sectionToDuplicate.title + ' (복사본)',
      };

      const newSections = [...prev];
      newSections.splice(sectionIndex + 1, 0, newSection);
      return newSections;
    });
  }, [setSections]);

  // 키보드 단축키
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // input, textarea에서는 단축키 무시
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }

      // 활성화된 섹션이 있을 때만 작동
      if (activeSectionId) {
        const currentIndex = sections.findIndex(s => s.id === activeSectionId);

        // Ctrl+D: 섹션 복제
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
          e.preventDefault();
          duplicateSection(activeSectionId, e as any);
        }
        // Ctrl+K: 섹션 삭제
        else if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
          e.preventDefault();
          deleteSection(activeSectionId, e as any);
        }
        // Alt+↑: 섹션 위로 이동
        else if (e.altKey && e.key === 'ArrowUp') {
          e.preventDefault();
          if (currentIndex > 0) {
            moveSection(currentIndex, 'up', e as any);
          }
        }
        // Alt+↓: 섹션 아래로 이동
        else if (e.altKey && e.key === 'ArrowDown') {
          e.preventDefault();
          if (currentIndex < sections.length - 1) {
            moveSection(currentIndex, 'down', e as any);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSectionId, sections, duplicateSection, deleteSection, moveSection]);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      alert('이미지 또는 비디오 파일만 업로드할 수 있어요');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert('파일 크기가 너무 커요. 50MB 이하로 줄여주세요');
      return;
    }

    const currentSection = getSection(id);
    if (currentSection?.mediaUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(currentSection.mediaUrl);
    }

    const isVideo = file.type.startsWith('video');
    setUploadingId(id);

    try {
      // 로그인 여부 확인
      const { data: userData } = await supabase.auth.getUser();

      let fileToUpload = file;

      // 이미지 최적화 (비디오가 아닌 경우)
      if (!isVideo && needsOptimization(file)) {
        try {
          const options = getRecommendedOptions(file);
          const optimizedBlob = await optimizeImage(file, options);
          fileToUpload = new File([optimizedBlob], file.name, { type: optimizedBlob.type });

          if (optimizedBlob.size < file.size * 0.9) {
            console.log(`이미지 최적화: ${formatFileSize(file.size)} → ${formatFileSize(optimizedBlob.size)}`);
          }
        } catch (error) {
          console.error('이미지 최적화 실패, 원본 사용:', error);
        }
      }

      // 로그인한 경우 Supabase Storage에 업로드
      if (userData.user) {
        const { data, error } = await uploadMedia(fileToUpload);

        if (error) {
          throw error;
        }

        if (data?.public_url) {
          updateSection(id, {
            mediaUrl: data.public_url,
            mediaType: isVideo ? 'video' : 'image'
          });
          return;
        }
      }

      // 비로그인 시 로컬 blob URL 사용 + 경고 표시
      const url = URL.createObjectURL(fileToUpload);
      updateSection(id, {
        mediaUrl: url,
        mediaType: isVideo ? 'video' : 'image'
      });
      showGuestWarning('로그인하지 않으면 공유 링크에서 미디어가 표시되지 않아요. 로그인 후 다시 업로드해주세요.');
    } catch (error) {
      console.error('파일 업로드 오류:', error);
      // 오류 시 로컬 blob URL로 폴백
      const url = URL.createObjectURL(file);
      updateSection(id, {
        mediaUrl: url,
        mediaType: isVideo ? 'video' : 'image'
      });
    } finally {
      setUploadingId(null);
    }
  }, [updateSection, showGuestWarning]);

  const handleMediaDelete = useCallback((id: string) => {
    const section = getSection(id);
    if (section?.mediaUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(section.mediaUrl);
    }
    updateSection(id, { mediaUrl: '', mediaType: 'none' });
  }, [updateSection, getSection]);

  // URL 입력 모드 토글
  const toggleUrlInputMode = useCallback((id: string) => {
    setUrlInputMode(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  // URL로 미디어 추가
  const handleUrlSubmit = useCallback((id: string) => {
    const url = urlInputValue[id]?.trim();
    if (!url) {
      alert('URL을 입력해주세요.');
      return;
    }

    // 기본적인 URL 유효성 검사
    try {
      new URL(url);
    } catch {
      alert('올바른 URL 형식이 아니에요.');
      return;
    }

    // 기존 blob URL 해제
    const section = getSection(id);
    if (section?.mediaUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(section.mediaUrl);
    }

    // 비디오 확장자 체크
    const isVideo = /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);

    updateSection(id, {
      mediaUrl: url,
      mediaType: isVideo ? 'video' : 'image',
    });

    // 입력 필드 초기화 및 모드 종료
    setUrlInputValue(prev => ({ ...prev, [id]: '' }));
    setUrlInputMode(prev => ({ ...prev, [id]: false }));
  }, [urlInputValue, getSection, updateSection]);

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLElement>, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverSectionId(null);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      alert('이미지 또는 비디오 파일만 업로드할 수 있어요');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert('파일 크기가 너무 커요. 50MB 이하로 줄여주세요');
      return;
    }

    const currentSection = getSection(id);
    if (currentSection?.mediaUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(currentSection.mediaUrl);
    }

    const isVideo = file.type.startsWith('video');
    setUploadingId(id);

    try {
      // 로그인 여부 확인
      const { data: userData } = await supabase.auth.getUser();

      let fileToUpload = file;

      // 이미지 최적화 (비디오가 아닌 경우)
      if (!isVideo && needsOptimization(file)) {
        try {
          const options = getRecommendedOptions(file);
          const optimizedBlob = await optimizeImage(file, options);
          fileToUpload = new File([optimizedBlob], file.name, { type: optimizedBlob.type });
        } catch (error) {
          console.error('이미지 최적화 실패, 원본 사용:', error);
        }
      }

      // 로그인한 경우 Supabase Storage에 업로드
      if (userData.user) {
        const { data, error } = await uploadMedia(fileToUpload);

        if (error) {
          throw error;
        }

        if (data?.public_url) {
          updateSection(id, {
            mediaUrl: data.public_url,
            mediaType: isVideo ? 'video' : 'image'
          });
          return;
        }
      }

      // 비로그인 시 로컬 blob URL 사용 + 경고 표시
      const url = URL.createObjectURL(fileToUpload);
      updateSection(id, {
        mediaUrl: url,
        mediaType: isVideo ? 'video' : 'image'
      });
      showGuestWarning('로그인하지 않으면 공유 링크에서 미디어가 표시되지 않아요. 로그인 후 다시 업로드해주세요.');
    } catch (error) {
      console.error('파일 업로드 오류:', error);
      const url = URL.createObjectURL(file);
      updateSection(id, {
        mediaUrl: url,
        mediaType: isVideo ? 'video' : 'image'
      });
    } finally {
      setUploadingId(null);
    }
  }, [updateSection, showGuestWarning]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLElement>, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverSectionId(id);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverSectionId(null);
  }, []);

  const handleSectionDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, sectionId: string) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', sectionId);
    setDraggedSectionId(sectionId);
  }, []);

  const handleSectionDragEnd = useCallback(() => {
    setDraggedSectionId(null);
    setDropTargetId(null);
  }, []);

  const handleSectionDragOver = useCallback((e: React.DragEvent<HTMLDivElement>, sectionId: string) => {
    e.preventDefault();
    if (e.dataTransfer.types.includes('Files')) return;
    if (draggedSectionId && draggedSectionId !== sectionId) {
      setDropTargetId(sectionId);
    }
  }, [draggedSectionId]);

  const handleSectionDrop = useCallback((e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    if (e.dataTransfer.types.includes('Files')) return;

    const sourceId = e.dataTransfer.getData('text/plain');
    if (!sourceId || sourceId === targetId) return;

    setSections(prev => {
      const newSections = [...prev];
      const sourceIndex = newSections.findIndex(s => s.id === sourceId);
      const targetIndex = newSections.findIndex(s => s.id === targetId);

      if (sourceIndex === -1 || targetIndex === -1) return prev;

      const [removed] = newSections.splice(sourceIndex, 1);
      newSections.splice(targetIndex, 0, removed);

      return newSections;
    });

    setDraggedSectionId(null);
    setDropTargetId(null);
  }, [setSections]);

  // TextShadow 업데이트 헬퍼
  const updateTextShadow = useCallback((sectionId: string, shadowUpdates: Partial<TextShadow>) => {
    const section = sectionsRef.current.find(s => s.id === sectionId);
    const currentShadow = section?.textShadow || DEFAULT_SECTION_VALUES.textShadow;
    updateSection(sectionId, { textShadow: { ...currentShadow, ...shadowUpdates } });
  }, [updateSection]);

  // GradientOverlay 업데이트 헬퍼
  const updateGradientOverlay = useCallback((sectionId: string, gradientUpdates: Partial<GradientOverlay>) => {
    const section = sectionsRef.current.find(s => s.id === sectionId);
    const currentGradient = section?.gradientOverlay || DEFAULT_SECTION_VALUES.gradientOverlay;
    updateSection(sectionId, { gradientOverlay: { ...currentGradient, ...gradientUpdates } });
  }, [updateSection]);

  // CTAButton 업데이트 헬퍼
  const updateCtaButton = useCallback((sectionId: string, ctaUpdates: Partial<CTAButton>) => {
    const section = sectionsRef.current.find(s => s.id === sectionId);
    const currentCta = section?.ctaButton || DEFAULT_SECTION_VALUES.ctaButton;
    updateSection(sectionId, { ctaButton: { ...currentCta, ...ctaUpdates } });
  }, [updateSection]);

  // ========== 신규 레이아웃 헬퍼 함수 ==========

  // Gallery 이미지 추가
  const addGalleryImage = useCallback((sectionId: string) => {
    const section = sectionsRef.current.find(s => s.id === sectionId);
    const currentImages = section?.galleryImages || [];
    const newImage: GalleryImage = {
      id: Math.random().toString(36).substr(2, 9),
      url: '',
      caption: '',
    };
    updateSection(sectionId, { galleryImages: [...currentImages, newImage] });
  }, [updateSection]);

  // Gallery 이미지 업데이트
  const updateGalleryImage = useCallback((sectionId: string, imageId: string, updates: Partial<GalleryImage>) => {
    const section = sectionsRef.current.find(s => s.id === sectionId);
    const currentImages = section?.galleryImages || [];
    const updatedImages = currentImages.map(img =>
      img.id === imageId ? { ...img, ...updates } : img
    );
    updateSection(sectionId, { galleryImages: updatedImages });
  }, [updateSection]);

  // Gallery 이미지 삭제
  const removeGalleryImage = useCallback((sectionId: string, imageId: string) => {
    const section = sectionsRef.current.find(s => s.id === sectionId);
    const currentImages = section?.galleryImages || [];
    const image = currentImages.find(img => img.id === imageId);
    if (image?.url?.startsWith('blob:')) {
      URL.revokeObjectURL(image.url);
    }
    updateSection(sectionId, { galleryImages: currentImages.filter(img => img.id !== imageId) });
  }, [updateSection]);

  // Gallery 설정 업데이트
  const updateGallerySettings = useCallback((sectionId: string, updates: Partial<GallerySettings>) => {
    const section = sectionsRef.current.find(s => s.id === sectionId);
    const currentSettings = section?.gallerySettings || { columns: 3, gap: 16, showCaptions: true };
    updateSection(sectionId, { gallerySettings: { ...currentSettings, ...updates } });
  }, [updateSection]);

  // Timeline 아이템 추가
  const addTimelineItem = useCallback((sectionId: string) => {
    const section = sectionsRef.current.find(s => s.id === sectionId);
    const currentItems = section?.timelineItems || [];
    const newItem: TimelineItem = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString('ko-KR'),
      title: '새 이벤트',
      description: '설명을 입력하세요',
    };
    updateSection(sectionId, { timelineItems: [...currentItems, newItem] });
  }, [updateSection]);

  // Timeline 아이템 업데이트
  const updateTimelineItem = useCallback((sectionId: string, itemId: string, updates: Partial<TimelineItem>) => {
    const section = sectionsRef.current.find(s => s.id === sectionId);
    const currentItems = section?.timelineItems || [];
    const updatedItems = currentItems.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    );
    updateSection(sectionId, { timelineItems: updatedItems });
  }, [updateSection]);

  // Timeline 아이템 삭제
  const removeTimelineItem = useCallback((sectionId: string, itemId: string) => {
    const section = sectionsRef.current.find(s => s.id === sectionId);
    const currentItems = section?.timelineItems || [];
    updateSection(sectionId, { timelineItems: currentItems.filter(item => item.id !== itemId) });
  }, [updateSection]);

  // Cards 아이템 추가
  const addCard = useCallback((sectionId: string) => {
    const section = sectionsRef.current.find(s => s.id === sectionId);
    const currentCards = section?.cards || [];
    const newCard: CardItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: '새 카드',
      description: '설명을 입력하세요',
    };
    updateSection(sectionId, { cards: [...currentCards, newCard] });
  }, [updateSection]);

  // Cards 아이템 업데이트
  const updateCard = useCallback((sectionId: string, cardId: string, updates: Partial<CardItem>) => {
    const section = sectionsRef.current.find(s => s.id === sectionId);
    const currentCards = section?.cards || [];
    const updatedCards = currentCards.map(card =>
      card.id === cardId ? { ...card, ...updates } : card
    );
    updateSection(sectionId, { cards: updatedCards });
  }, [updateSection]);

  // Cards 아이템 삭제
  const removeCard = useCallback((sectionId: string, cardId: string) => {
    const section = sectionsRef.current.find(s => s.id === sectionId);
    const currentCards = section?.cards || [];
    const card = currentCards.find(c => c.id === cardId);
    if (card?.imageUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(card.imageUrl);
    }
    updateSection(sectionId, { cards: currentCards.filter(c => c.id !== cardId) });
  }, [updateSection]);

  // Cards 설정 업데이트
  const updateCardsSettings = useCallback((sectionId: string, updates: Partial<CardsSettings>) => {
    const section = sectionsRef.current.find(s => s.id === sectionId);
    const currentSettings = section?.cardsSettings || { columns: 3, borderRadius: 12, showShadow: true, hoverEffect: true };
    updateSection(sectionId, { cardsSettings: { ...currentSettings, ...updates } });
  }, [updateSection]);

  // Stats 아이템 추가
  const addStat = useCallback((sectionId: string) => {
    const section = sectionsRef.current.find(s => s.id === sectionId);
    const currentStats = section?.stats || [];
    const newStat: StatItem = {
      id: Math.random().toString(36).substr(2, 9),
      value: '100+',
      label: '항목',
    };
    updateSection(sectionId, { stats: [...currentStats, newStat] });
  }, [updateSection]);

  // Stats 아이템 업데이트
  const updateStat = useCallback((sectionId: string, statId: string, updates: Partial<StatItem>) => {
    const section = sectionsRef.current.find(s => s.id === sectionId);
    const currentStats = section?.stats || [];
    const updatedStats = currentStats.map(stat =>
      stat.id === statId ? { ...stat, ...updates } : stat
    );
    updateSection(sectionId, { stats: updatedStats });
  }, [updateSection]);

  // Stats 아이템 삭제
  const removeStat = useCallback((sectionId: string, statId: string) => {
    const section = sectionsRef.current.find(s => s.id === sectionId);
    const currentStats = section?.stats || [];
    updateSection(sectionId, { stats: currentStats.filter(stat => stat.id !== statId) });
  }, [updateSection]);

  // Stats 설정 업데이트
  const updateStatsSettings = useCallback((sectionId: string, updates: Partial<StatsSettings>) => {
    const section = sectionsRef.current.find(s => s.id === sectionId);
    const currentSettings = section?.statsSettings || { columns: 3, animateNumbers: true };
    updateSection(sectionId, { statsSettings: { ...currentSettings, ...updates } });
  }, [updateSection]);

  // Quote 설정 업데이트
  const updateQuoteSettings = useCallback((sectionId: string, updates: Partial<QuoteSettings>) => {
    const section = sectionsRef.current.find(s => s.id === sectionId);
    const currentSettings = section?.quoteSettings || { quoteStyle: 'double', authorPrefix: '—' };
    updateSection(sectionId, { quoteSettings: { ...currentSettings, ...updates } });
  }, [updateSection]);

  // Video Hero 설정 업데이트
  const updateVideoHeroSettings = useCallback((sectionId: string, updates: Partial<VideoHeroSettings>) => {
    const section = sectionsRef.current.find(s => s.id === sectionId);
    const currentSettings = section?.videoHeroSettings || { autoPlay: true, muted: true, loop: true };
    updateSection(sectionId, { videoHeroSettings: { ...currentSettings, ...updates } });
  }, [updateSection]);

  // Gallery 이미지 파일 업로드
  const handleGalleryImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>, sectionId: string, imageId: string) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const section = sectionsRef.current.find(s => s.id === sectionId);
    const image = section?.galleryImages?.find(img => img.id === imageId);
    if (image?.url?.startsWith('blob:')) {
      URL.revokeObjectURL(image.url);
    }

    try {
      const { data: userData } = await supabase.auth.getUser();

      if (userData.user) {
        const { data, error } = await uploadMedia(file);
        if (!error && data?.public_url) {
          updateGalleryImage(sectionId, imageId, { url: data.public_url });
          return;
        }
      }

      // 비로그인 시 blob URL 사용 + 경고 표시
      const url = URL.createObjectURL(file);
      updateGalleryImage(sectionId, imageId, { url });
      showGuestWarning('로그인하지 않으면 공유 링크에서 미디어가 표시되지 않아요.');
    } catch (error) {
      console.error('Gallery 이미지 업로드 오류:', error);
      const url = URL.createObjectURL(file);
      updateGalleryImage(sectionId, imageId, { url });
    }
  }, [sections, updateGalleryImage, showGuestWarning]);

  // Card 이미지 파일 업로드
  const handleCardImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>, sectionId: string, cardId: string) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const section = sectionsRef.current.find(s => s.id === sectionId);
    const card = section?.cards?.find(c => c.id === cardId);
    if (card?.imageUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(card.imageUrl);
    }

    try {
      const { data: userData } = await supabase.auth.getUser();

      if (userData.user) {
        const { data, error } = await uploadMedia(file);
        if (!error && data?.public_url) {
          updateCard(sectionId, cardId, { imageUrl: data.public_url });
          return;
        }
      }

      // 비로그인 시 blob URL 사용 + 경고 표시
      const url = URL.createObjectURL(file);
      updateCard(sectionId, cardId, { imageUrl: url });
      showGuestWarning('로그인하지 않으면 공유 링크에서 미디어가 표시되지 않아요.');
    } catch (error) {
      console.error('Card 이미지 업로드 오류:', error);
      const url = URL.createObjectURL(file);
      updateCard(sectionId, cardId, { imageUrl: url });
    }
  }, [sections, updateCard, showGuestWarning]);

  // Video 파일 업로드
  const handleVideoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>, sectionId: string) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('video/')) {
      alert('비디오 파일만 업로드할 수 있어요 (MP4, WebM)');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      alert('파일 크기가 너무 커요. 50MB 이하로 줄여주세요');
      return;
    }

    const section = sectionsRef.current.find(s => s.id === sectionId);
    if (section?.videoUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(section.videoUrl);
    }

    setUploadingId(sectionId);

    try {
      const { data: userData } = await supabase.auth.getUser();

      if (userData.user) {
        const { data, error } = await uploadMedia(file);
        if (!error && data?.public_url) {
          updateSection(sectionId, { videoUrl: data.public_url });
          return;
        }
      }

      // 비로그인 시 blob URL 사용 + 경고 표시
      const url = URL.createObjectURL(file);
      updateSection(sectionId, { videoUrl: url });
      showGuestWarning('로그인하지 않으면 공유 링크에서 미디어가 표시되지 않아요.');
    } catch (error) {
      console.error('비디오 업로드 오류:', error);
      const url = URL.createObjectURL(file);
      updateSection(sectionId, { videoUrl: url });
    } finally {
      setUploadingId(null);
    }
  }, [updateSection, showGuestWarning]);

  return (
    <div className="w-full h-full flex flex-col bg-gray-900 border-r border-gray-800 text-white relative">
      {/* 비로그인 경고 토스트 */}
      {guestWarning && (
        <div className="absolute top-4 left-4 right-4 z-50 animate-fade-in">
          <div className="bg-amber-500/90 text-black px-4 py-3 rounded-lg shadow-lg flex items-start gap-3">
            <span className="text-lg">⚠️</span>
            <div className="flex-1">
              <p className="text-sm font-medium">{guestWarning}</p>
            </div>
            <button
              onClick={() => setGuestWarning(null)}
              className="text-black/60 hover:text-black"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-4 border-b border-gray-800 bg-gray-900 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">섹션 편집</h2>
            <p className="text-xs text-gray-500 mt-1">이미지를 추가하고 텍스트를 편집하세요</p>
          </div>
          <button
            onClick={() => setShowTemplates(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-xs font-medium hover:from-purple-500 hover:to-indigo-500 transition-all"
          >
            <Sparkles size={14} /> 템플릿
          </button>
        </div>
      </div>

      {/* 템플릿 선택 패널 */}
      {showTemplates && (
        <div className="absolute inset-0 bg-gray-900 z-50 flex flex-col">
          {/* 헤더 */}
          <div className="p-4 border-b border-gray-700 flex items-center justify-between flex-shrink-0">
            <div>
              <h3 className="font-bold text-white">템플릿 선택</h3>
              <p className="text-xs text-gray-400 mt-1">원하는 스타일로 빠르게 시작하세요</p>
            </div>
            <button
              onClick={() => setShowTemplates(false)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* 카테고리 탭 */}
          <div className="flex flex-wrap gap-2 p-3 border-b border-gray-700 flex-shrink-0">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              전체 ({TEMPLATES.length})
            </button>
            {TEMPLATE_CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category.name} ({TEMPLATES.filter(t => t.category === category.id).length})
              </button>
            ))}
          </div>

          {/* 템플릿 목록 */}
          <div className="flex-1 relative overflow-hidden">
            {/* 상단 페이드 그라데이션 */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-gray-900 to-transparent pointer-events-none z-10"></div>

            <div className="h-full overflow-y-auto p-4">
            <div className="space-y-3">
              {TEMPLATES
                .filter(t => selectedCategory === 'all' || t.category === selectedCategory)
                .map(template => (
                  <button
                    key={template.id}
                    onClick={() => handleApplyTemplate(template)}
                    className="w-full p-4 bg-gray-800 hover:bg-gray-750 rounded-lg text-left transition-colors border border-gray-700 hover:border-indigo-500"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-white">{template.name}</p>
                        <p className="text-xs text-gray-400 mt-1">{template.description}</p>
                      </div>
                      <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded ml-3 flex-shrink-0">
                        {template.sections.length}개 섹션
                      </span>
                    </div>
                  </button>
                ))}
            </div>
            </div>

            {/* 하단 페이드 그라데이션 */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none z-10"></div>
          </div>

          {/* 푸터 */}
          <div className="p-4 border-t border-gray-700 bg-gray-800/50 flex-shrink-0">
            <p className="text-xs text-gray-400 text-center">
              템플릿을 선택하면 현재 내용이 대체됩니다
            </p>
          </div>
        </div>
      )}


      {/* Section List */}
      <div className="flex-1 relative overflow-hidden">
        {/* 상단 페이드 그라데이션 */}
        {sections.length > 0 && (
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-gray-900 to-transparent pointer-events-none z-10"></div>
        )}

        <div className="h-full overflow-y-auto p-4 space-y-3 no-scrollbar">
        {sections.length === 0 && emptyEditorStateElement}

        {sections.map((section, index) => (
          <div
            key={section.id}
            className={`editor-section-item bg-gray-800 rounded-lg overflow-hidden border transition-all ${dropTargetId === section.id
              ? 'border-blue-500 border-2 scale-[1.02]'
              : draggedSectionId === section.id
                ? 'opacity-50 border-gray-700'
                : 'border-gray-700'
              }`}
            draggable
            onDragStart={(e) => handleSectionDragStart(e, section.id)}
            onDragEnd={handleSectionDragEnd}
            onDragOver={(e) => handleSectionDragOver(e, section.id)}
            onDrop={(e) => handleSectionDrop(e, section.id)}
          >
            {/* Header/Summary of Section */}
            <div
              className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-700 ${activeSectionId === section.id ? 'bg-gray-700 border-b border-gray-600' : ''}`}
              onClick={() => setActiveSectionId(activeSectionId === section.id ? null : section.id)}
            >
              <div className="text-gray-500 cursor-grab active:cursor-grabbing"><GripVertical size={16} /></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{section.title || '제목 없음'}</p>
                <p className="text-xs text-gray-500 truncate">{getLayoutName(section.layout)}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={(e) => moveSection(index, 'up', e)} className="p-1 hover:text-white text-gray-500 disabled:opacity-30" disabled={index === 0} title="위로 이동"><ArrowUp size={14} /></button>
                <button onClick={(e) => moveSection(index, 'down', e)} className="p-1 hover:text-white text-gray-500 disabled:opacity-30" disabled={index === sections.length - 1} title="아래로 이동"><ArrowDown size={14} /></button>
                <button onClick={(e) => duplicateSection(section.id, e)} className="p-1 hover:text-blue-400 text-gray-500" title="복제"><Copy size={14} /></button>
                <button onClick={(e) => deleteSection(section.id, e)} className="p-1 hover:text-red-400 text-gray-500" title="삭제"><Trash2 size={14} /></button>
              </div>
            </div>

            {/* Detailed Editor for Active Section */}
            {activeSectionId === section.id && (
              <div className="p-4 bg-gray-800/50 space-y-1 animate-fade-in text-sm">

                {/* 레이아웃 & 기본 설정 */}
                <AccordionSection
                  title="레이아웃"
                  icon={<Layout size={12} />}
                  isOpen={isAccordionOpen(section.id, 'layout')}
                  onToggle={() => toggleAccordion(section.id, 'layout')}
                >
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-400 mb-2 block">레이아웃 타입</label>
                      <select
                        value={section.layout}
                        onChange={(e) => updateSection(section.id, { layout: e.target.value as LayoutType })}
                        className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1.5 focus:border-blue-500 outline-none"
                      >
                        <optgroup label="기본 레이아웃">
                          <option value={LayoutType.HERO}>Hero (전체화면)</option>
                          <option value={LayoutType.SPLIT_LEFT}>이미지 왼쪽 (분할)</option>
                          <option value={LayoutType.SPLIT_RIGHT}>이미지 오른쪽 (분할)</option>
                          <option value={LayoutType.FULL_IMAGE_TEXT_OVERLAY}>이미지 배경 + 텍스트</option>
                          <option value={LayoutType.SIMPLE_TEXT}>중앙 텍스트</option>
                        </optgroup>
                        <optgroup label="신규 레이아웃">
                          <option value={LayoutType.GALLERY}>갤러리 (이미지 그리드)</option>
                          <option value={LayoutType.TIMELINE}>타임라인 (시간순)</option>
                          <option value={LayoutType.CARDS}>카드 (그리드)</option>
                          <option value={LayoutType.QUOTE}>인용문</option>
                          <option value={LayoutType.STATS}>통계 (숫자 강조)</option>
                          <option value={LayoutType.VIDEO_HERO}>비디오 Hero</option>
                        </optgroup>
                      </select>
                    </div>

                    {/* 섹션 높이 */}
                    <div>
                      <label className="text-xs text-gray-400 mb-2 block">섹션 높이</label>
                      <select
                        value={section.sectionHeight || '100vh'}
                        onChange={(e) => updateSection(section.id, { sectionHeight: e.target.value as SectionHeight })}
                        className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1.5 focus:border-blue-500 outline-none"
                      >
                        {SECTION_HEIGHTS.map(h => (
                          <option key={h.value} value={h.value}>{h.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Split Ratio (Split layouts only) */}
                    {(section.layout === LayoutType.SPLIT_LEFT || section.layout === LayoutType.SPLIT_RIGHT) && (
                      <div>
                        <label className="text-xs text-gray-400 mb-2 flex justify-between">
                          <span>이미지 비율</span>
                          <span className="text-white">{section.splitRatio || 50}%</span>
                        </label>
                        <input
                          type="range"
                          min="20"
                          max="80"
                          value={section.splitRatio || 50}
                          onChange={(e) => updateSection(section.id, { splitRatio: parseInt(e.target.value) })}
                          className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                          {...preventDragProps}
                        />
                      </div>
                    )}

                    {/* Overlay Opacity (Overlay layouts only) */}
                    {(section.layout === LayoutType.HERO || section.layout === LayoutType.FULL_IMAGE_TEXT_OVERLAY) && (
                      <div>
                        <label className="text-xs text-gray-400 mb-2 flex justify-between">
                          <span>오버레이 투명도</span>
                          <span className="text-white">{Math.round((section.overlayOpacity || 0) * 100)}%</span>
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={section.overlayOpacity ?? 0.4}
                          onChange={(e) => updateSection(section.id, { overlayOpacity: parseFloat(e.target.value) })}
                          className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                          {...preventDragProps}
                        />
                      </div>
                    )}

                    {/* 여백 설정 */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-400 mb-2 flex justify-between">
                          <span>좌우 여백</span>
                          <span className="text-white">{section.paddingX || 24}px</span>
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={section.paddingX || 24}
                          onChange={(e) => updateSection(section.id, { paddingX: parseInt(e.target.value) })}
                          className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                          {...preventDragProps}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 mb-2 flex justify-between">
                          <span>상하 여백</span>
                          <span className="text-white">{section.paddingY || 24}px</span>
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={section.paddingY || 24}
                          onChange={(e) => updateSection(section.id, { paddingY: parseInt(e.target.value) })}
                          className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                          {...preventDragProps}
                        />
                      </div>
                    </div>
                  </div>
                </AccordionSection>

                {/* 텍스트 컨텐츠 */}
                <AccordionSection
                  title="텍스트 내용"
                  icon={<Type size={12} />}
                  isOpen={isAccordionOpen(section.id, 'text')}
                  onToggle={() => toggleAccordion(section.id, 'text')}
                >
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSection(section.id, { title: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1.5 focus:border-blue-500 outline-none font-bold text-white"
                      placeholder="제목"
                    />
                    <textarea
                      value={section.description}
                      onChange={(e) => updateSection(section.id, { description: e.target.value })}
                      rows={4}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1.5 focus:border-blue-500 outline-none resize-none text-white"
                      placeholder="내용"
                    />
                  </div>
                </AccordionSection>

                {/* 타이포그래피 */}
                <AccordionSection
                  title="타이포그래피"
                  icon={<Type size={12} />}
                  isOpen={isAccordionOpen(section.id, 'typography')}
                  onToggle={() => toggleAccordion(section.id, 'typography')}
                >
                  <div className="space-y-4">
                    {/* 폰트 선택 */}
                    <div>
                      <label className="text-xs text-gray-400 mb-2 block">폰트</label>
                      <select
                        value={section.fontFamily || DEFAULT_SECTION_VALUES.fontFamily}
                        onChange={(e) => updateSection(section.id, { fontFamily: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1.5 focus:border-blue-500 outline-none"
                      >
                        {GOOGLE_FONTS.map(font => (
                          <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                            {font.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 제목 폰트 크기 */}
                    <div>
                      <label className="text-xs text-gray-400 mb-2 flex justify-between">
                        <span>제목 크기</span>
                        <span className="text-white">{section.titleFontSize || 48}px</span>
                      </label>
                      <input
                        type="range"
                        min="24"
                        max="120"
                        value={section.titleFontSize || 48}
                        onChange={(e) => updateSection(section.id, { titleFontSize: parseInt(e.target.value) })}
                        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        {...preventDragProps}
                      />
                    </div>

                    {/* 본문 폰트 크기 */}
                    <div>
                      <label className="text-xs text-gray-400 mb-2 flex justify-between">
                        <span>본문 크기</span>
                        <span className="text-white">{section.descriptionFontSize || 18}px</span>
                      </label>
                      <input
                        type="range"
                        min="12"
                        max="36"
                        value={section.descriptionFontSize || 18}
                        onChange={(e) => updateSection(section.id, { descriptionFontSize: parseInt(e.target.value) })}
                        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        {...preventDragProps}
                      />
                    </div>

                    {/* 텍스트 정렬 */}
                    <div>
                      <label className="text-xs text-gray-400 mb-2 block">수평 정렬</label>
                      <div className="flex bg-gray-900 rounded border border-gray-700 p-0.5">
                        {(['left', 'center', 'right'] as const).map((align) => (
                          <button
                            key={align}
                            onClick={() => updateSection(section.id, { textHorizontalPosition: align as TextHorizontalPosition })}
                            className={`flex-1 flex items-center justify-center py-1.5 rounded hover:bg-gray-700 ${(section.textHorizontalPosition || 'center') === align ? 'bg-gray-700 text-white' : 'text-gray-400'}`}
                          >
                            {align === 'left' && <AlignLeft size={14} />}
                            {align === 'center' && <AlignCenter size={14} />}
                            {align === 'right' && <AlignRight size={14} />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 텍스트 색상 */}
                    <div>
                      <label className="text-xs text-gray-400 mb-2 block">텍스트 색상</label>
                      <div className="flex items-center gap-2 h-9 bg-gray-900 border border-gray-700 rounded px-2">
                        <input
                          type="color"
                          value={section.textColor || '#ffffff'}
                          onChange={(e) => updateSection(section.id, { textColor: e.target.value })}
                          className="w-5 h-5 rounded border-none bg-transparent cursor-pointer"
                        />
                        <span className="text-xs text-gray-400 font-mono">{section.textColor}</span>
                      </div>
                    </div>

                    {/* 텍스트 그림자 */}
                    <div className="space-y-3 p-3 bg-gray-900/50 rounded border border-gray-700">
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-gray-400">텍스트 그림자</label>
                        <button
                          onClick={() => updateTextShadow(section.id, { enabled: !(section.textShadow?.enabled) })}
                          className={`w-10 h-5 rounded-full transition-colors ${section.textShadow?.enabled ? 'bg-blue-500' : 'bg-gray-600'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transform transition-transform ${section.textShadow?.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </button>
                      </div>
                      {section.textShadow?.enabled && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <label className="text-xs text-gray-400 w-12">색상</label>
                            <input
                              type="color"
                              value={section.textShadow?.color || '#000000'}
                              onChange={(e) => updateTextShadow(section.id, { color: e.target.value })}
                              className="w-5 h-5 rounded border-none bg-transparent cursor-pointer"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-400 mb-1 flex justify-between">
                              <span>흐림</span>
                              <span className="text-white">{section.textShadow?.blur || 4}px</span>
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="20"
                              value={section.textShadow?.blur || 4}
                              onChange={(e) => updateTextShadow(section.id, { blur: parseInt(e.target.value) })}
                              className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              {...preventDragProps}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </AccordionSection>

                {/* 텍스트 위치 (9방향) */}
                <AccordionSection
                  title="텍스트 위치"
                  icon={<Move size={12} />}
                  isOpen={isAccordionOpen(section.id, 'position')}
                  onToggle={() => toggleAccordion(section.id, 'position')}
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-1 w-32 mx-auto">
                      {(['top', 'center', 'bottom'] as const).map(v => (
                        (['left', 'center', 'right'] as const).map(h => (
                          <button
                            key={`${v}-${h}`}
                            onClick={() => updateSection(section.id, {
                              textVerticalPosition: v as TextVerticalPosition,
                              textHorizontalPosition: h as TextHorizontalPosition
                            })}
                            className={`w-10 h-10 rounded border transition-colors ${section.textVerticalPosition === v && section.textHorizontalPosition === h
                              ? 'bg-blue-500 border-blue-400'
                              : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                              }`}
                          />
                        ))
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                      현재: {section.textVerticalPosition || 'center'} / {section.textHorizontalPosition || 'center'}
                    </p>
                  </div>
                </AccordionSection>

                {/* 색상 & 배경 */}
                <AccordionSection
                  title="색상 & 배경"
                  icon={<Palette size={12} />}
                  isOpen={isAccordionOpen(section.id, 'colors')}
                  onToggle={() => toggleAccordion(section.id, 'colors')}
                >
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-400 mb-2 block">배경 색상</label>
                      <div className="flex items-center gap-2 h-9 bg-gray-900 border border-gray-700 rounded px-2">
                        <input
                          type="color"
                          value={section.backgroundColor || '#000000'}
                          onChange={(e) => updateSection(section.id, { backgroundColor: e.target.value })}
                          className="w-5 h-5 rounded border-none bg-transparent cursor-pointer"
                        />
                        <span className="text-xs text-gray-400 font-mono">{section.backgroundColor}</span>
                      </div>
                    </div>

                    {/* 그라데이션 오버레이 */}
                    <div className="space-y-3 p-3 bg-gray-900/50 rounded border border-gray-700">
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-gray-400">그라데이션 오버레이</label>
                        <button
                          onClick={() => updateGradientOverlay(section.id, { enabled: !(section.gradientOverlay?.enabled) })}
                          className={`w-10 h-5 rounded-full transition-colors ${section.gradientOverlay?.enabled ? 'bg-blue-500' : 'bg-gray-600'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transform transition-transform ${section.gradientOverlay?.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </button>
                      </div>
                      {section.gradientOverlay?.enabled && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-xs text-gray-500 mb-1 block">시작 색상</label>
                              <input
                                type="color"
                                value={section.gradientOverlay?.startColor || '#000000'}
                                onChange={(e) => updateGradientOverlay(section.id, { startColor: e.target.value })}
                                className="w-full h-8 rounded border border-gray-600 bg-transparent cursor-pointer"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 mb-1 block">끝 색상</label>
                              <input
                                type="color"
                                value={section.gradientOverlay?.endColor || '#000000'}
                                onChange={(e) => updateGradientOverlay(section.id, { endColor: e.target.value })}
                                className="w-full h-8 rounded border border-gray-600 bg-transparent cursor-pointer"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 mb-1 block">방향</label>
                            <select
                              value={section.gradientOverlay?.direction || 'to-bottom'}
                              onChange={(e) => updateGradientOverlay(section.id, { direction: e.target.value as GradientOverlay['direction'] })}
                              className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs focus:border-blue-500 outline-none"
                            >
                              {GRADIENT_DIRECTIONS.map(d => (
                                <option key={d.value} value={d.value}>{d.name}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 mb-1 flex justify-between">
                              <span>투명도</span>
                              <span>{Math.round((section.gradientOverlay?.opacity || 0.5) * 100)}%</span>
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={section.gradientOverlay?.opacity || 0.5}
                              onChange={(e) => updateGradientOverlay(section.id, { opacity: parseFloat(e.target.value) })}
                              className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              {...preventDragProps}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </AccordionSection>

                {/* 이미지 필터 */}
                {section.layout !== LayoutType.SIMPLE_TEXT && (
                  <AccordionSection
                    title="이미지 필터"
                    icon={<Filter size={12} />}
                    isOpen={isAccordionOpen(section.id, 'filter')}
                    onToggle={() => toggleAccordion(section.id, 'filter')}
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-gray-400 mb-2 block">필터 타입</label>
                        <select
                          value={section.imageFilter || 'none'}
                          onChange={(e) => updateSection(section.id, { imageFilter: e.target.value as ImageFilter })}
                          className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1.5 focus:border-blue-500 outline-none"
                        >
                          {IMAGE_FILTERS.map(f => (
                            <option key={f.value} value={f.value}>{f.name}</option>
                          ))}
                        </select>
                      </div>

                      {section.imageFilter && section.imageFilter !== 'none' && (
                        <div>
                          <label className="text-xs text-gray-400 mb-2 flex justify-between">
                            <span>필터 강도</span>
                            <span className="text-white">{section.imageFilterIntensity || 100}%</span>
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="200"
                            value={section.imageFilterIntensity || 100}
                            onChange={(e) => updateSection(section.id, { imageFilterIntensity: parseInt(e.target.value) })}
                            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            {...preventDragProps}
                          />
                        </div>
                      )}
                    </div>
                  </AccordionSection>
                )}

                {/* 애니메이션 */}
                <AccordionSection
                  title="애니메이션"
                  icon={<Zap size={12} />}
                  isOpen={isAccordionOpen(section.id, 'animation')}
                  onToggle={() => toggleAccordion(section.id, 'animation')}
                >
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-400 mb-2 block">애니메이션 타입</label>
                      <select
                        value={section.animation || 'fade-in'}
                        onChange={(e) => updateSection(section.id, { animation: e.target.value as AnimationType })}
                        className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1.5 focus:border-blue-500 outline-none"
                      >
                        {ANIMATIONS.map(a => (
                          <option key={a.value} value={a.value}>{a.name}</option>
                        ))}
                      </select>
                    </div>

                    {section.animation && section.animation !== 'none' && (
                      <>
                        <div>
                          <label className="text-xs text-gray-400 mb-2 flex justify-between">
                            <span>지속 시간</span>
                            <span className="text-white">{section.animationDuration || 0.8}초</span>
                          </label>
                          <input
                            type="range"
                            min="0.1"
                            max="3"
                            step="0.1"
                            value={section.animationDuration || 0.8}
                            onChange={(e) => updateSection(section.id, { animationDuration: parseFloat(e.target.value) })}
                            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            {...preventDragProps}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 mb-2 flex justify-between">
                            <span>지연 시간</span>
                            <span className="text-white">{section.animationDelay || 0}초</span>
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="2"
                            step="0.1"
                            value={section.animationDelay || 0}
                            onChange={(e) => updateSection(section.id, { animationDelay: parseFloat(e.target.value) })}
                            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            {...preventDragProps}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </AccordionSection>

                {/* CTA 버튼 */}
                <AccordionSection
                  title="CTA 버튼"
                  icon={<MousePointer size={12} />}
                  isOpen={isAccordionOpen(section.id, 'cta')}
                  onToggle={() => toggleAccordion(section.id, 'cta')}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-gray-400">버튼 표시</label>
                      <button
                        onClick={() => updateCtaButton(section.id, { enabled: !(section.ctaButton?.enabled) })}
                        className={`w-10 h-5 rounded-full transition-colors ${section.ctaButton?.enabled ? 'bg-blue-500' : 'bg-gray-600'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transform transition-transform ${section.ctaButton?.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </button>
                    </div>

                    {section.ctaButton?.enabled && (
                      <div className="space-y-3 p-3 bg-gray-900/50 rounded border border-gray-700">
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">버튼 텍스트</label>
                          <input
                            type="text"
                            value={section.ctaButton?.text || '자세히 보기'}
                            onChange={(e) => updateCtaButton(section.id, { text: e.target.value })}
                            className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-xs focus:border-blue-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">링크 URL</label>
                          <input
                            type="text"
                            value={section.ctaButton?.link || '#'}
                            onChange={(e) => updateCtaButton(section.id, { link: e.target.value })}
                            className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-xs focus:border-blue-500 outline-none"
                            placeholder="https://..."
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-gray-500 mb-1 block">스타일</label>
                            <select
                              value={section.ctaButton?.style || 'solid'}
                              onChange={(e) => updateCtaButton(section.id, { style: e.target.value as CTAButton['style'] })}
                              className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs focus:border-blue-500 outline-none"
                            >
                              {BUTTON_STYLES.map(s => (
                                <option key={s.value} value={s.value}>{s.name}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 mb-1 block">크기</label>
                            <select
                              value={section.ctaButton?.size || 'medium'}
                              onChange={(e) => updateCtaButton(section.id, { size: e.target.value as CTAButton['size'] })}
                              className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs focus:border-blue-500 outline-none"
                            >
                              {BUTTON_SIZES.map(s => (
                                <option key={s.value} value={s.value}>{s.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">버튼 색상</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={section.ctaButton?.color || '#ffffff'}
                              onChange={(e) => updateCtaButton(section.id, { color: e.target.value })}
                              className="w-8 h-8 rounded border border-gray-600 bg-transparent cursor-pointer"
                            />
                            <span className="text-xs text-gray-400 font-mono">{section.ctaButton?.color}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionSection>

                {/* ========== 신규 레이아웃별 편집 UI ========== */}

                {/* Gallery 레이아웃 편집 */}
                {section.layout === LayoutType.GALLERY && (
                  <AccordionSection
                    title="갤러리 설정"
                    icon={<Grid size={12} />}
                    isOpen={isAccordionOpen(section.id, 'gallery')}
                    onToggle={() => toggleAccordion(section.id, 'gallery')}
                  >
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2">
                        {[2, 3, 4].map(cols => (
                          <button
                            key={cols}
                            onClick={() => updateGallerySettings(section.id, { columns: cols as 2 | 3 | 4 })}
                            className={`py-2 rounded text-xs font-medium ${(section.gallerySettings?.columns || 3) === cols
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              }`}
                          >
                            {cols}열
                          </button>
                        ))}
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 mb-2 flex justify-between">
                          <span>이미지 간격</span>
                          <span className="text-white">{section.gallerySettings?.gap || 16}px</span>
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="40"
                          value={section.gallerySettings?.gap || 16}
                          onChange={(e) => updateGallerySettings(section.id, { gap: parseInt(e.target.value) })}
                          className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                          {...preventDragProps}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-gray-400">캡션 표시</label>
                        <button
                          onClick={() => updateGallerySettings(section.id, { showCaptions: !(section.gallerySettings?.showCaptions ?? true) })}
                          className={`w-10 h-5 rounded-full transition-colors ${(section.gallerySettings?.showCaptions ?? true) ? 'bg-blue-500' : 'bg-gray-600'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transform transition-transform ${(section.gallerySettings?.showCaptions ?? true) ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </button>
                      </div>

                      {/* 이미지 목록 */}
                      <div className="space-y-2">
                        <label className="text-xs text-gray-400">이미지 ({section.galleryImages?.length || 0}개)</label>
                        {(section.galleryImages || []).map((image, idx) => (
                          <div key={image.id} className="flex items-center gap-2 p-2 bg-gray-800 rounded">
                            {image.url ? (
                              <img src={image.url} alt="" className="w-10 h-10 object-cover rounded" />
                            ) : (
                              <label className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center cursor-pointer hover:bg-gray-600">
                                <Plus size={16} className="text-gray-400" />
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleGalleryImageUpload(e, section.id, image.id)} />
                              </label>
                            )}
                            <input
                              type="text"
                              value={image.caption || ''}
                              onChange={(e) => updateGalleryImage(section.id, image.id, { caption: e.target.value })}
                              placeholder="캡션"
                              className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs"
                            />
                            <button onClick={() => removeGalleryImage(section.id, image.id)} className="p-1 text-gray-400 hover:text-red-400">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addGalleryImage(section.id)}
                          className="w-full py-2 border border-dashed border-gray-600 rounded text-xs text-gray-400 hover:text-white hover:border-gray-500"
                        >
                          + 이미지 추가
                        </button>
                      </div>
                    </div>
                  </AccordionSection>
                )}

                {/* Timeline 레이아웃 편집 */}
                {section.layout === LayoutType.TIMELINE && (
                  <AccordionSection
                    title="타임라인 설정"
                    icon={<Clock size={12} />}
                    isOpen={isAccordionOpen(section.id, 'timeline')}
                    onToggle={() => toggleAccordion(section.id, 'timeline')}
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-gray-400 mb-2 block">정렬</label>
                        <select
                          value={section.timelineAlignment || 'alternate'}
                          onChange={(e) => updateSection(section.id, { timelineAlignment: e.target.value as TimelineAlignment })}
                          className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-xs"
                        >
                          <option value="alternate">좌우 번갈아</option>
                          <option value="left">왼쪽 정렬</option>
                          <option value="right">오른쪽 정렬</option>
                        </select>
                      </div>

                      {/* 이벤트 목록 */}
                      <div className="space-y-2">
                        <label className="text-xs text-gray-400">이벤트 ({section.timelineItems?.length || 0}개)</label>
                        {(section.timelineItems || []).map((item, idx) => (
                          <div key={item.id} className="p-3 bg-gray-800 rounded space-y-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={item.date}
                                onChange={(e) => updateTimelineItem(section.id, item.id, { date: e.target.value })}
                                placeholder="날짜"
                                className="w-24 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs"
                              />
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => updateTimelineItem(section.id, item.id, { title: e.target.value })}
                                placeholder="제목"
                                className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs"
                              />
                              <button onClick={() => removeTimelineItem(section.id, item.id)} className="p-1 text-gray-400 hover:text-red-400">
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <textarea
                              value={item.description}
                              onChange={(e) => updateTimelineItem(section.id, item.id, { description: e.target.value })}
                              placeholder="설명"
                              rows={2}
                              className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs resize-none"
                            />
                          </div>
                        ))}
                        <button
                          onClick={() => addTimelineItem(section.id)}
                          className="w-full py-2 border border-dashed border-gray-600 rounded text-xs text-gray-400 hover:text-white hover:border-gray-500"
                        >
                          + 이벤트 추가
                        </button>
                      </div>
                    </div>
                  </AccordionSection>
                )}

                {/* Cards 레이아웃 편집 */}
                {section.layout === LayoutType.CARDS && (
                  <AccordionSection
                    title="카드 설정"
                    icon={<CreditCard size={12} />}
                    isOpen={isAccordionOpen(section.id, 'cards')}
                    onToggle={() => toggleAccordion(section.id, 'cards')}
                  >
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2">
                        {[2, 3, 4].map(cols => (
                          <button
                            key={cols}
                            onClick={() => updateCardsSettings(section.id, { columns: cols as 2 | 3 | 4 })}
                            className={`py-2 rounded text-xs font-medium ${(section.cardsSettings?.columns || 3) === cols
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              }`}
                          >
                            {cols}열
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-gray-400">그림자</label>
                        <button
                          onClick={() => updateCardsSettings(section.id, { showShadow: !(section.cardsSettings?.showShadow ?? true) })}
                          className={`w-10 h-5 rounded-full transition-colors ${(section.cardsSettings?.showShadow ?? true) ? 'bg-blue-500' : 'bg-gray-600'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transform transition-transform ${(section.cardsSettings?.showShadow ?? true) ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-gray-400">호버 효과</label>
                        <button
                          onClick={() => updateCardsSettings(section.id, { hoverEffect: !(section.cardsSettings?.hoverEffect ?? true) })}
                          className={`w-10 h-5 rounded-full transition-colors ${(section.cardsSettings?.hoverEffect ?? true) ? 'bg-blue-500' : 'bg-gray-600'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transform transition-transform ${(section.cardsSettings?.hoverEffect ?? true) ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </button>
                      </div>

                      {/* 카드 목록 */}
                      <div className="space-y-2">
                        <label className="text-xs text-gray-400">카드 ({section.cards?.length || 0}개)</label>
                        {(section.cards || []).map((card, idx) => (
                          <div key={card.id} className="p-3 bg-gray-800 rounded space-y-2">
                            <div className="flex items-center gap-2">
                              {card.imageUrl ? (
                                <img src={card.imageUrl} alt="" className="w-12 h-12 object-cover rounded" />
                              ) : (
                                <label className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center cursor-pointer hover:bg-gray-600">
                                  <ImageIcon size={16} className="text-gray-400" />
                                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleCardImageUpload(e, section.id, card.id)} />
                                </label>
                              )}
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={card.title}
                                  onChange={(e) => updateCard(section.id, card.id, { title: e.target.value })}
                                  placeholder="제목"
                                  className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs mb-1"
                                />
                                <input
                                  type="text"
                                  value={card.description}
                                  onChange={(e) => updateCard(section.id, card.id, { description: e.target.value })}
                                  placeholder="설명"
                                  className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs"
                                />
                              </div>
                              <button onClick={() => removeCard(section.id, card.id)} className="p-1 text-gray-400 hover:text-red-400">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={() => addCard(section.id)}
                          className="w-full py-2 border border-dashed border-gray-600 rounded text-xs text-gray-400 hover:text-white hover:border-gray-500"
                        >
                          + 카드 추가
                        </button>
                      </div>
                    </div>
                  </AccordionSection>
                )}

                {/* Quote 레이아웃 편집 */}
                {section.layout === LayoutType.QUOTE && (
                  <AccordionSection
                    title="인용문 설정"
                    icon={<Quote size={12} />}
                    isOpen={isAccordionOpen(section.id, 'quote')}
                    onToggle={() => toggleAccordion(section.id, 'quote')}
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-gray-400 mb-2 block">인용문</label>
                        <textarea
                          value={section.quoteText || ''}
                          onChange={(e) => updateSection(section.id, { quoteText: e.target.value })}
                          rows={4}
                          placeholder="인용문을 입력하세요..."
                          className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm resize-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 mb-2 block">저자/출처</label>
                        <input
                          type="text"
                          value={section.quoteAuthor || ''}
                          onChange={(e) => updateSection(section.id, { quoteAuthor: e.target.value })}
                          placeholder="저자 이름"
                          className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 mb-2 block">인용 부호 스타일</label>
                        <select
                          value={section.quoteSettings?.quoteStyle || 'double'}
                          onChange={(e) => updateQuoteSettings(section.id, { quoteStyle: e.target.value as 'double' | 'single' | 'none' })}
                          className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-xs"
                        >
                          <option value="double">큰따옴표 ("")</option>
                          <option value="single">작은따옴표 ('')</option>
                          <option value="none">없음</option>
                        </select>
                      </div>
                    </div>
                  </AccordionSection>
                )}

                {/* Stats 레이아웃 편집 */}
                {section.layout === LayoutType.STATS && (
                  <AccordionSection
                    title="통계 설정"
                    icon={<BarChart3 size={12} />}
                    isOpen={isAccordionOpen(section.id, 'stats')}
                    onToggle={() => toggleAccordion(section.id, 'stats')}
                  >
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2">
                        {[2, 3, 4].map(cols => (
                          <button
                            key={cols}
                            onClick={() => updateStatsSettings(section.id, { columns: cols as 2 | 3 | 4 })}
                            className={`py-2 rounded text-xs font-medium ${(section.statsSettings?.columns || 3) === cols
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              }`}
                          >
                            {cols}열
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-gray-400">숫자 애니메이션</label>
                        <button
                          onClick={() => updateStatsSettings(section.id, { animateNumbers: !(section.statsSettings?.animateNumbers ?? true) })}
                          className={`w-10 h-5 rounded-full transition-colors ${(section.statsSettings?.animateNumbers ?? true) ? 'bg-blue-500' : 'bg-gray-600'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transform transition-transform ${(section.statsSettings?.animateNumbers ?? true) ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </button>
                      </div>

                      {/* 통계 항목 */}
                      <div className="space-y-2">
                        <label className="text-xs text-gray-400">통계 항목 ({section.stats?.length || 0}개)</label>
                        {(section.stats || []).map((stat, idx) => (
                          <div key={stat.id} className="p-3 bg-gray-800 rounded space-y-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={stat.value}
                                onChange={(e) => updateStat(section.id, stat.id, { value: e.target.value })}
                                placeholder="숫자 (예: 1,234)"
                                className="w-24 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs font-bold"
                              />
                              <input
                                type="text"
                                value={stat.label}
                                onChange={(e) => updateStat(section.id, stat.id, { label: e.target.value })}
                                placeholder="라벨"
                                className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs"
                              />
                              <button onClick={() => removeStat(section.id, stat.id)} className="p-1 text-gray-400 hover:text-red-400">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={() => addStat(section.id)}
                          className="w-full py-2 border border-dashed border-gray-600 rounded text-xs text-gray-400 hover:text-white hover:border-gray-500"
                        >
                          + 통계 항목 추가
                        </button>
                      </div>
                    </div>
                  </AccordionSection>
                )}

                {/* Video Hero 레이아웃 편집 */}
                {section.layout === LayoutType.VIDEO_HERO && (
                  <AccordionSection
                    title="비디오 설정"
                    icon={<Video size={12} />}
                    isOpen={isAccordionOpen(section.id, 'videoHero')}
                    onToggle={() => toggleAccordion(section.id, 'videoHero')}
                  >
                    <div className="space-y-4">
                      {/* 비디오 업로드 */}
                      <div>
                        <label className="text-xs text-gray-400 mb-2 block">비디오 파일</label>
                        {section.videoUrl ? (
                          <div className="relative">
                            <video src={section.videoUrl} className="w-full h-24 object-cover rounded" muted />
                            <button
                              onClick={() => {
                                if (section.videoUrl?.startsWith('blob:')) URL.revokeObjectURL(section.videoUrl);
                                updateSection(section.id, { videoUrl: '' });
                              }}
                              className="absolute top-1 right-1 p-1 bg-red-500 rounded text-white"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <label className="w-full h-24 flex flex-col items-center justify-center bg-gray-900 border border-dashed border-gray-600 rounded cursor-pointer hover:border-gray-500">
                            <Video size={24} className="text-gray-500 mb-2" />
                            <span className="text-xs text-gray-400">MP4, WebM (최대 50MB)</span>
                            <input type="file" className="hidden" accept="video/*" onChange={(e) => handleVideoUpload(e, section.id)} />
                          </label>
                        )}
                      </div>

                      {/* 비디오 옵션 */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs text-gray-400">자동 재생</label>
                          <button
                            onClick={() => updateVideoHeroSettings(section.id, { autoPlay: !(section.videoHeroSettings?.autoPlay ?? true) })}
                            className={`w-10 h-5 rounded-full transition-colors ${(section.videoHeroSettings?.autoPlay ?? true) ? 'bg-blue-500' : 'bg-gray-600'}`}
                          >
                            <div className={`w-4 h-4 bg-white rounded-full transform transition-transform ${(section.videoHeroSettings?.autoPlay ?? true) ? 'translate-x-5' : 'translate-x-0.5'}`} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-xs text-gray-400">음소거</label>
                          <button
                            onClick={() => updateVideoHeroSettings(section.id, { muted: !(section.videoHeroSettings?.muted ?? true) })}
                            className={`w-10 h-5 rounded-full transition-colors ${(section.videoHeroSettings?.muted ?? true) ? 'bg-blue-500' : 'bg-gray-600'}`}
                          >
                            <div className={`w-4 h-4 bg-white rounded-full transform transition-transform ${(section.videoHeroSettings?.muted ?? true) ? 'translate-x-5' : 'translate-x-0.5'}`} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-xs text-gray-400">반복 재생</label>
                          <button
                            onClick={() => updateVideoHeroSettings(section.id, { loop: !(section.videoHeroSettings?.loop ?? true) })}
                            className={`w-10 h-5 rounded-full transition-colors ${(section.videoHeroSettings?.loop ?? true) ? 'bg-blue-500' : 'bg-gray-600'}`}
                          >
                            <div className={`w-4 h-4 bg-white rounded-full transform transition-transform ${(section.videoHeroSettings?.loop ?? true) ? 'translate-x-5' : 'translate-x-0.5'}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </AccordionSection>
                )}

                {/* 미디어 업로드 (기존 레이아웃용) */}
                {section.layout !== LayoutType.SIMPLE_TEXT &&
                  section.layout !== LayoutType.GALLERY &&
                  section.layout !== LayoutType.TIMELINE &&
                  section.layout !== LayoutType.CARDS &&
                  section.layout !== LayoutType.STATS &&
                  section.layout !== LayoutType.VIDEO_HERO && (
                    <AccordionSection
                      title="미디어"
                      icon={<ImageIcon size={12} />}
                      isOpen={isAccordionOpen(section.id, 'media')}
                      onToggle={() => toggleAccordion(section.id, 'media')}
                    >
                      <div
                        className="relative group"
                        onDrop={(e) => handleDrop(e, section.id)}
                        onDragOver={(e) => handleDragOver(e, section.id)}
                        onDragLeave={handleDragLeave}
                      >
                        {section.mediaUrl ? (
                          <div className={`w-full h-32 bg-black rounded border overflow-hidden relative transition-all ${dragOverSectionId === section.id
                            ? 'border-blue-500 border-2 scale-[1.02]'
                            : 'border-gray-700'
                            }`}>
                            {section.mediaType === 'video' ? (
                              <video
                                src={section.mediaUrl}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLVideoElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <img
                                src={section.mediaUrl}
                                alt="preview"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23333" width="100" height="100"/><text fill="%23666" x="50%" y="50%" text-anchor="middle" dy=".3em">이미지 오류</text></svg>';
                                }}
                              />
                            )}
                            <div className={`absolute inset-0 flex items-center justify-center transition-opacity gap-2 ${dragOverSectionId === section.id
                              ? 'bg-blue-500/30 opacity-100'
                              : 'bg-black/50 opacity-0 group-hover:opacity-100'
                              }`}>
                              {dragOverSectionId === section.id ? (
                                <span className="text-white font-bold text-sm">여기에 놓으세요</span>
                              ) : (
                                <>
                                  <label className="cursor-pointer bg-white text-black px-3 py-1.5 rounded text-xs font-bold hover:bg-gray-200">
                                    변경
                                    <input type="file" className="hidden" accept="image/*,video/*" onChange={(e) => handleFileUpload(e, section.id)} />
                                  </label>
                                  <button
                                    onClick={() => handleMediaDelete(section.id)}
                                    className="bg-red-500 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-red-600"
                                  >
                                    삭제
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {/* 업로드/URL 탭 */}
                            <div className="flex bg-gray-800 rounded-lg p-0.5">
                              <button
                                onClick={() => setUrlInputMode(prev => ({ ...prev, [section.id]: false }))}
                                className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded text-xs transition-colors ${
                                  !urlInputMode[section.id]
                                    ? 'bg-gray-700 text-white'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                              >
                                <Upload size={12} /> 파일 업로드
                              </button>
                              <button
                                onClick={() => setUrlInputMode(prev => ({ ...prev, [section.id]: true }))}
                                className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded text-xs transition-colors ${
                                  urlInputMode[section.id]
                                    ? 'bg-gray-700 text-white'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                              >
                                <Link size={12} /> URL 입력
                              </button>
                            </div>

                            {urlInputMode[section.id] ? (
                              /* URL 입력 모드 */
                              <div className="space-y-2">
                                <input
                                  type="url"
                                  value={urlInputValue[section.id] || ''}
                                  onChange={(e) => setUrlInputValue(prev => ({ ...prev, [section.id]: e.target.value }))}
                                  placeholder="https://example.com/image.jpg"
                                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      handleUrlSubmit(section.id);
                                    }
                                  }}
                                />
                                <button
                                  onClick={() => handleUrlSubmit(section.id)}
                                  className="w-full py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-500 transition-colors"
                                >
                                  이미지 적용
                                </button>
                                <p className="text-xs text-gray-500 text-center">
                                  웹 이미지 URL을 입력하세요
                                </p>
                              </div>
                            ) : (
                              /* 파일 업로드 모드 */
                              <label className={`w-full h-28 flex flex-col items-center justify-center bg-gray-900 border border-dashed rounded cursor-pointer transition-all ${dragOverSectionId === section.id
                                ? 'border-blue-500 border-2 bg-blue-500/10 scale-[1.02]'
                                : uploadingId === section.id
                                  ? 'border-purple-500 bg-purple-500/10'
                                  : 'border-gray-600 hover:border-gray-400 hover:bg-gray-800'
                                }`}>
                                {uploadingId === section.id ? (
                                  <>
                                    <Loader2 className="text-purple-400 mb-2 animate-spin" size={24} />
                                    <span className="text-sm text-purple-400 font-medium">이미지 최적화 중...</span>
                                  </>
                                ) : dragOverSectionId === section.id ? (
                                  <>
                                    <ImageIcon className="text-blue-400 mb-2" size={24} />
                                    <span className="text-sm text-blue-400 font-medium">여기에 놓으세요</span>
                                  </>
                                ) : (
                                  <>
                                    <ImageIcon className="text-gray-500 mb-2" size={20} />
                                    <span className="text-xs text-gray-400">드래그하거나 클릭해서 업로드</span>
                                    <span className="text-xs text-gray-500 mt-1">PNG, JPG, GIF, MP4 (최대 50MB)</span>
                                  </>
                                )}
                                <input type="file" className="hidden" accept="image/*,video/*" onChange={(e) => handleFileUpload(e, section.id)} disabled={uploadingId === section.id} />
                              </label>
                            )}
                          </div>
                        )}
                      </div>
                    </AccordionSection>
                  )}
              </div>
            )}
          </div>
        ))}

        <button
          onClick={addSection}
          className="w-full py-3 border border-dashed border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-gray-500 flex items-center justify-center gap-2 transition-colors"
        >
          <Plus size={16} /> 섹션 추가하기
        </button>
        </div>

        {/* 하단 페이드 그라데이션 */}
        {sections.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none z-10"></div>
        )}
      </div>
    </div>
  );
};

export default Editor;
