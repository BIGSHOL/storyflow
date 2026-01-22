import React, { memo, useState, useEffect, useRef, lazy, Suspense, useCallback, useMemo } from 'react';
import { Section, LayoutType } from '../types';
// lucide-react 직접 import (번들 최적화)
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import ImageOff from 'lucide-react/dist/esm/icons/image-off';

// 신규 레이아웃 컴포넌트 (lazy loading으로 번들 최적화)
const GalleryLayout = lazy(() => import('./layouts/GalleryLayout'));
const TimelineLayout = lazy(() => import('./layouts/TimelineLayout'));
const CardsLayout = lazy(() => import('./layouts/CardsLayout'));
const QuoteLayout = lazy(() => import('./layouts/QuoteLayout'));
const StatsLayout = lazy(() => import('./layouts/StatsLayout'));
const VideoHeroLayout = lazy(() => import('./layouts/VideoHeroLayout'));
const CarouselLayout = lazy(() => import('./layouts/CarouselLayout'));
const MasonryLayout = lazy(() => import('./layouts/MasonryLayout'));
const GuestbookLayout = lazy(() => import('./layouts/GuestbookLayout'));

interface PreviewRenderProps {
  sections: Section[];
  isPreviewMode?: boolean;
}

// 정적 JSX 호이스팅 (렌더링 최적화)
const emptyStateElement = (
  <div className="h-screen flex flex-col items-center justify-center text-gray-500">
    <ImageOff size={48} className="mb-4 opacity-50" />
    <p className="text-lg">섹션을 추가하여 이야기를 시작하세요</p>
    <p className="text-sm mt-2 opacity-70">왼쪽 편집 패널에서 "섹션 추가하기"를 클릭하세요</p>
  </div>
);

// Suspense fallback 호이스팅 (rendering-hoist-jsx)
const suspenseFallback = (
  <div className="section-preview w-full min-h-screen flex items-center justify-center bg-black">
    <div className="animate-pulse text-gray-500">로딩 중...</div>
  </div>
);

// 현재 연도 호이스팅 (매 렌더마다 계산 방지)
const currentYear = new Date().getFullYear();

const PreviewRender: React.FC<PreviewRenderProps> = memo(({ sections, isPreviewMode = false }) => {
  // 스크롤 핸들러 - 첫 번째 섹션의 화살표 버튼 클릭 시 (useCallback으로 메모이제이션)
  const handleScrollDown = useCallback(() => {
    const secondSection = document.querySelector('.section-preview:nth-child(2)');
    if (secondSection) {
      secondSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    }
  }, []);

  // isPreviewMode일 때는 페이지 스크롤 사용, 에디터에서는 컨테이너 스크롤 사용 (useMemo로 캐싱)
  const containerClasses = useMemo(() => isPreviewMode
    ? 'w-full min-h-screen bg-black text-white'
    : 'w-full h-full overflow-y-auto overflow-x-hidden bg-black text-white', [isPreviewMode]);

  return (
    <div className={containerClasses} data-preview-container>
      {sections.length === 0 && emptyStateElement}

      {sections.map((section, index) => (
        <SectionView
          key={section.id}
          section={section}
          isFirst={index === 0}
          onScrollDown={index === 0 ? handleScrollDown : undefined}
        />
      ))}

      {/* Footer / End of Story */}
      {sections.length > 0 && (
        <div className="h-[30vh] flex items-center justify-center bg-black text-gray-400 text-sm border-t border-gray-900">
          <p>© {currentYear} StoryFlow Created</p>
        </div>
      )}
    </div>
  );
});

const SectionView: React.FC<{ section: Section; isFirst: boolean; onScrollDown?: () => void }> = memo(({ section, isFirst, onScrollDown }) => {
  const [mediaError, setMediaError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // 미디어 비율 계산 (useMemo로 캐싱)
  const { mediaRatio, textRatio } = useMemo(() => ({
    mediaRatio: section.splitRatio ?? 50,
    textRatio: 100 - (section.splitRatio ?? 50)
  }), [section.splitRatio]);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // 미디어 에러 핸들러 (useCallback으로 메모이제이션)
  const handleMediaError = useCallback(() => {
    setMediaError(true);
  }, []);

  // Image filter CSS (useMemo로 캐싱)
  const imageFilterStyle = useMemo((): React.CSSProperties => {
    const filters: string[] = [];
    const style: React.CSSProperties = {};

    // 기본 필터
    if (section.imageFilter && section.imageFilter !== 'none') {
      const intensity = section.imageFilterIntensity || 100;
      switch (section.imageFilter) {
        case 'grayscale':
          filters.push(`grayscale(${intensity}%)`);
          break;
        case 'sepia':
          filters.push(`sepia(${intensity}%)`);
          break;
        case 'blur':
          filters.push(`blur(${intensity / 20}px)`);
          break;
        case 'brightness':
          filters.push(`brightness(${intensity}%)`);
          break;
        case 'contrast':
          filters.push(`contrast(${intensity}%)`);
          break;
        case 'saturate':
          filters.push(`saturate(${intensity}%)`);
          break;
      }
    }

    // 밝기 조절
    if (section.imageBrightness && section.imageBrightness !== 0) {
      const brightness = 100 + section.imageBrightness; // -100~100 -> 0~200
      filters.push(`brightness(${brightness}%)`);
    }

    // 대비 조절
    if (section.imageContrast && section.imageContrast !== 0) {
      const contrast = 100 + section.imageContrast; // -100~100 -> 0~200
      filters.push(`contrast(${contrast}%)`);
    }

    if (filters.length > 0) {
      style.filter = filters.join(' ');
    }

    // 이미지 회전
    if (section.imageRotation && section.imageRotation !== 0) {
      style.transform = `rotate(${section.imageRotation}deg)`;
    }

    return style;
  }, [section.imageFilter, section.imageFilterIntensity, section.imageBrightness, section.imageContrast, section.imageRotation]);

  // Gradient overlay CSS (useMemo로 캐싱)
  const gradientOverlayStyle = useMemo(() => {
    if (!section.gradientOverlay?.enabled) return {};

    const { startColor, endColor, direction, opacity } = section.gradientOverlay;
    const directionMap: Record<string, string> = {
      'to-bottom': 'to bottom',
      'to-top': 'to top',
      'to-right': 'to right',
      'to-left': 'to left',
      'to-bottom-right': 'to bottom right',
      'to-bottom-left': 'to bottom left',
    };

    return {
      background: `linear-gradient(${directionMap[direction] || 'to bottom'}, ${startColor}, ${endColor})`,
      opacity: opacity || 0.5,
    };
  }, [section.gradientOverlay]);

  // Animation CSS (useMemo로 캐싱 - isVisible 의존)
  const animationStyle = useMemo(() => {
    // 애니메이션이 없거나 'none'이면 항상 보이도록 opacity: 1
    if (!section.animation || section.animation === 'none') {
      return { opacity: 1 };
    }
    // 애니메이션이 있지만 아직 화면에 안 보이면 opacity: 0 (애니메이션 대기)
    if (!isVisible) {
      return { opacity: 0 };
    }

    const duration = section.animationDuration || 0.8;
    const delay = section.animationDelay || 0;

    const animationMap: Record<string, string> = {
      'fade-in': 'fadeIn',
      'slide-up': 'slideUp',
      'slide-down': 'slideDown',
      'slide-left': 'slideLeft',
      'slide-right': 'slideRight',
      'zoom-in': 'zoomIn',
      'zoom-out': 'zoomOut',
    };

    return {
      animation: `${animationMap[section.animation]} ${duration}s ease-out ${delay}s forwards`,
      opacity: 0,
    };
  }, [section.animation, section.animationDuration, section.animationDelay, isVisible]);

  // Text shadow CSS (useMemo로 캐싱)
  const textShadowStyle = useMemo(() => {
    if (!section.textShadow?.enabled) return {};

    const { color, blur, offsetX, offsetY } = section.textShadow;
    return {
      textShadow: `${offsetX || 2}px ${offsetY || 2}px ${blur || 4}px ${color || '#000000'}`,
    };
  }, [section.textShadow]);

  // Text position classes (useMemo로 캐싱)
  const positionClasses = useMemo(() => {
    const vPos = section.textVerticalPosition || 'center';
    const hPos = section.textHorizontalPosition || 'center';

    const verticalMap: Record<string, string> = {
      top: 'justify-start pt-16',
      center: 'justify-center',
      bottom: 'justify-end pb-16',
    };

    const horizontalMap: Record<string, string> = {
      left: 'items-start text-left',
      center: 'items-center text-center',
      right: 'items-end text-right',
    };

    return `${verticalMap[vPos]} ${horizontalMap[hPos]}`;
  }, [section.textVerticalPosition, section.textHorizontalPosition]);

  // CTA Button component
  const CTAButtonComponent = () => {
    if (!section.ctaButton?.enabled) return null;

    const { text, link, style, color, size } = section.ctaButton;

    const sizeClasses: Record<string, string> = {
      small: 'px-4 py-2 text-sm',
      medium: 'px-6 py-3 text-base',
      large: 'px-8 py-4 text-lg',
    };

    const baseClasses = `inline-block rounded-full font-medium transition-all duration-300 hover:scale-105 ${sizeClasses[size || 'medium']}`;

    let styleClasses = '';
    if (style === 'solid') {
      styleClasses = `text-black`;
    } else if (style === 'outline') {
      styleClasses = `bg-transparent border-2`;
    } else {
      styleClasses = `bg-transparent`;
    }

    const buttonStyle: React.CSSProperties = style === 'solid'
      ? { backgroundColor: color || '#ffffff' }
      : { borderColor: color || '#ffffff', color: color || '#ffffff' };

    return (
      <a
        href={link || '#'}
        target={link?.startsWith('http') ? '_blank' : undefined}
        rel={link?.startsWith('http') ? 'noopener noreferrer' : undefined}
        className={`${baseClasses} ${styleClasses} mt-8`}
        style={buttonStyle}
      >
        {text || '자세히 보기'}
      </a>
    );
  };

  const renderMedia = () => {
    if (section.mediaType === 'none' || !section.mediaUrl || mediaError) {
      return (
        <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center">
          <ImageOff size={32} className="text-gray-700 mb-2" />
          <span className="text-gray-700 text-sm">
            {mediaError ? '이미지를 불러올 수 없어요' : '이미지 없음'}
          </span>
        </div>
      );
    }
    if (section.mediaType === 'video') {
      return (
        <video
          src={section.mediaUrl}
          className="w-full h-full object-cover"
          style={imageFilterStyle}
          autoPlay
          muted
          loop
          playsInline
          onError={handleMediaError}
        />
      );
    }
    return (
      <img
        src={section.mediaUrl}
        alt={section.imageAlt || section.title || '섹션 이미지'}
        className="w-full h-full object-cover"
        style={imageFilterStyle}
        loading="lazy"
        onError={handleMediaError}
      />
    );
  };

  // Common styles (useMemo로 캐싱)
  const containerStyle = useMemo((): React.CSSProperties => ({
    backgroundColor: section.backgroundColor || '#000000',
    color: section.textColor || '#ffffff',
    fontFamily: section.fontFamily || 'system-ui, -apple-system, sans-serif',
    minHeight: section.sectionHeight || '100vh',
    height: section.sectionHeight === 'auto' ? 'auto' : section.sectionHeight,
  }), [section.backgroundColor, section.textColor, section.fontFamily, section.sectionHeight]);

  const titleStyle = useMemo((): React.CSSProperties => ({
    fontSize: `${section.titleFontSize || 48}px`,
    ...textShadowStyle,
  }), [section.titleFontSize, textShadowStyle]);

  const descStyle = useMemo((): React.CSSProperties => ({
    fontSize: `${section.descriptionFontSize || 18}px`,
    ...textShadowStyle,
  }), [section.descriptionFontSize, textShadowStyle]);

  const paddingStyle = useMemo((): React.CSSProperties => ({
    paddingLeft: `${section.paddingX || 24}px`,
    paddingRight: `${section.paddingX || 24}px`,
    paddingTop: `${section.paddingY || 24}px`,
    paddingBottom: `${section.paddingY || 24}px`,
  }), [section.paddingX, section.paddingY]);

  const splitMediaStyle = useMemo(() => ({
    width: `${mediaRatio}%`,
  }), [mediaRatio]);

  const splitTextStyle = useMemo(() => ({
    width: `${textRatio}%`,
  }), [textRatio]);

  switch (section.layout) {
    case LayoutType.HERO:
      return (
        <section
          ref={sectionRef}
          className={`section-preview relative w-full flex flex-col overflow-hidden ${positionClasses}`}
          style={containerStyle}
        >
          <div className="absolute inset-0 z-0">
            {renderMedia()}
          </div>
          {/* Color Overlay */}
          <div
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{ backgroundColor: section.backgroundColor || '#000000', opacity: section.overlayOpacity ?? 0.4 }}
          />
          {/* Gradient Overlay */}
          {section.gradientOverlay?.enabled && (
            <div className="absolute inset-0 z-[2] pointer-events-none" style={gradientOverlayStyle} />
          )}
          <div
            className={`relative z-10 w-full max-w-5xl mx-auto flex flex-col ${positionClasses}`}
            style={{ ...paddingStyle, ...animationStyle }}
          >
            <h1 className="font-serif font-bold mb-6 tracking-tight leading-tight" style={titleStyle}>{section.title}</h1>
            <p className="font-light opacity-90 leading-relaxed max-w-2xl" style={descStyle}>{section.description}</p>
            <CTAButtonComponent />
          </div>
          {isFirst && onScrollDown && (
            <button
              onClick={onScrollDown}
              className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce opacity-50 z-10 hover:opacity-80 transition-opacity cursor-pointer bg-transparent border-none"
              aria-label="아래로 스크롤"
            >
              <ChevronDown size={32} />
            </button>
          )}
        </section>
      );

    case LayoutType.SPLIT_LEFT:
      return (
        <section ref={sectionRef} className="section-preview w-full flex flex-col md:flex-row" style={containerStyle}>
          {/* Mobile: Full Width, Desktop: Dynamic Width */}
          <div className="w-full md:hidden h-[50vh]">
             {renderMedia()}
          </div>
          <div className="hidden md:block h-screen sticky top-0" style={splitMediaStyle}>
            {renderMedia()}
            {section.gradientOverlay?.enabled && (
              <div className="absolute inset-0" style={gradientOverlayStyle} />
            )}
          </div>

          <div
            className={`w-full flex flex-col ${positionClasses}`}
            style={{ ...splitTextStyle, ...paddingStyle, minHeight: '50vh', ...animationStyle }}
          >
             <div className="max-w-xl">
              <h2 className="font-serif mb-6 leading-tight" style={titleStyle}>{section.title}</h2>
              <p className="opacity-80 leading-loose" style={descStyle}>{section.description}</p>
              <CTAButtonComponent />
            </div>
          </div>
        </section>
      );

    case LayoutType.SPLIT_RIGHT:
      return (
        <section ref={sectionRef} className="section-preview w-full flex flex-col md:flex-row-reverse" style={containerStyle}>
          <div className="w-full md:hidden h-[50vh]">
             {renderMedia()}
          </div>
          <div className="hidden md:block h-screen sticky top-0" style={splitMediaStyle}>
            {renderMedia()}
            {section.gradientOverlay?.enabled && (
              <div className="absolute inset-0" style={gradientOverlayStyle} />
            )}
          </div>

          <div
            className={`w-full flex flex-col ${positionClasses}`}
            style={{ ...splitTextStyle, ...paddingStyle, minHeight: '50vh', ...animationStyle }}
          >
            <div className="max-w-xl">
              <h2 className="font-serif mb-6 leading-tight" style={titleStyle}>{section.title}</h2>
              <p className="opacity-80 leading-loose" style={descStyle}>{section.description}</p>
              <CTAButtonComponent />
            </div>
          </div>
        </section>
      );

    case LayoutType.FULL_IMAGE_TEXT_OVERLAY:
      return (
        <section
          ref={sectionRef}
          className={`section-preview relative w-full flex flex-col overflow-hidden ${positionClasses}`}
          style={containerStyle}
        >
          <div className="absolute inset-0 z-0">
            {renderMedia()}
          </div>
          {/* Color Overlay */}
          <div
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{ backgroundColor: section.backgroundColor || '#000000', opacity: section.overlayOpacity ?? 0.4 }}
          />
          {/* Gradient Overlay */}
          {section.gradientOverlay?.enabled && (
            <div className="absolute inset-0 z-[2] pointer-events-none" style={gradientOverlayStyle} />
          )}
          <div
            className={`relative z-10 max-w-3xl flex flex-col ${positionClasses}`}
            style={{ ...paddingStyle, ...animationStyle }}
          >
            <h2 className="font-bold font-serif leading-tight mb-6" style={titleStyle}>{section.title}</h2>
            <div className={`w-20 h-1 mb-6 bg-current opacity-50 ${section.textHorizontalPosition === 'center' ? 'mx-auto' : section.textHorizontalPosition === 'right' ? 'ml-auto' : ''}`}></div>
            <p className="opacity-90 leading-relaxed" style={descStyle}>{section.description}</p>
            <CTAButtonComponent />
          </div>
        </section>
      );

    // ========== 신규 레이아웃 (Phase 1 MVP) ==========

    case LayoutType.GALLERY:
      return (
        <Suspense fallback={suspenseFallback}>
          <GalleryLayout section={section} />
        </Suspense>
      );

    case LayoutType.TIMELINE:
      return (
        <Suspense fallback={suspenseFallback}>
          <TimelineLayout section={section} />
        </Suspense>
      );

    case LayoutType.CARDS:
      return (
        <Suspense fallback={suspenseFallback}>
          <CardsLayout section={section} />
        </Suspense>
      );

    case LayoutType.QUOTE:
      return (
        <Suspense fallback={suspenseFallback}>
          <QuoteLayout section={section} />
        </Suspense>
      );

    case LayoutType.STATS:
      return (
        <Suspense fallback={suspenseFallback}>
          <StatsLayout section={section} />
        </Suspense>
      );

    case LayoutType.VIDEO_HERO:
      return (
        <Suspense fallback={suspenseFallback}>
          <VideoHeroLayout section={section} />
        </Suspense>
      );

    case LayoutType.CAROUSEL:
      return (
        <Suspense fallback={suspenseFallback}>
          <CarouselLayout section={section} />
        </Suspense>
      );

    case LayoutType.MASONRY:
      return (
        <Suspense fallback={suspenseFallback}>
          <MasonryLayout section={section} />
        </Suspense>
      );

    case LayoutType.GUESTBOOK:
      return (
        <Suspense fallback={suspenseFallback}>
          <GuestbookLayout
            title={section.title}
            description={section.description}
            entries={section.guestbookEntries || []}
            settings={section.guestbookSettings || {
              maxEntries: 10,
              showTimestamp: true,
              requireName: false,
              allowAnonymous: true,
              sortOrder: 'newest',
              cardStyle: 'default',
              columns: 1,
            }}
            backgroundColor={section.backgroundColor}
            textColor={section.textColor}
            isPreview={true}
          />
        </Suspense>
      );

    // ========== 기본 레이아웃 ==========

    case LayoutType.SIMPLE_TEXT:
    default:
      return (
        <section
          ref={sectionRef}
          className={`section-preview w-full flex flex-col ${positionClasses}`}
          style={containerStyle}
        >
          {section.gradientOverlay?.enabled && (
            <div className="absolute inset-0" style={gradientOverlayStyle} />
          )}
          <div
            className={`w-full max-w-4xl mx-auto relative z-10 flex flex-col ${positionClasses}`}
            style={{ ...paddingStyle, ...animationStyle }}
          >
            <h2 className="font-serif leading-tight tracking-tight mb-10" style={titleStyle}>{section.title}</h2>
            <p className="opacity-70 leading-relaxed whitespace-pre-wrap" style={descStyle}>{section.description}</p>
            <CTAButtonComponent />
          </div>
        </section>
      );
  }
});

export default PreviewRender;
