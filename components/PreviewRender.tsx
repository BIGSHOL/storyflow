import React, { memo, useState, useEffect, useRef, lazy, Suspense } from 'react';
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

const PreviewRender: React.FC<PreviewRenderProps> = ({ sections, isPreviewMode = false }) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className={`w-full h-full overflow-y-auto overflow-x-hidden bg-black text-white ${isPreviewMode ? 'scroll-smooth' : ''}`}>
      {sections.length === 0 && emptyStateElement}

      {sections.map((section, index) => (
        <SectionView key={section.id} section={section} isFirst={index === 0} />
      ))}

      {/* Footer / End of Story */}
      {sections.length > 0 && (
        <div className="h-[30vh] flex items-center justify-center bg-black text-gray-400 text-sm border-t border-gray-900">
          <p>© {currentYear} StoryFlow Created</p>
        </div>
      )}
    </div>
  );
};

const SectionView: React.FC<{ section: Section; isFirst: boolean }> = memo(({ section, isFirst }) => {
  const [mediaError, setMediaError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const mediaRatio = section.splitRatio ? section.splitRatio : 50;
  const textRatio = 100 - mediaRatio;

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

  const handleMediaError = () => {
    setMediaError(true);
  };

  // Image filter CSS
  const getImageFilterStyle = () => {
    if (!section.imageFilter || section.imageFilter === 'none') return {};
    const intensity = section.imageFilterIntensity || 100;

    switch (section.imageFilter) {
      case 'grayscale':
        return { filter: `grayscale(${intensity}%)` };
      case 'sepia':
        return { filter: `sepia(${intensity}%)` };
      case 'blur':
        return { filter: `blur(${intensity / 20}px)` };
      case 'brightness':
        return { filter: `brightness(${intensity}%)` };
      case 'contrast':
        return { filter: `contrast(${intensity}%)` };
      case 'saturate':
        return { filter: `saturate(${intensity}%)` };
      default:
        return {};
    }
  };

  // Gradient overlay CSS
  const getGradientOverlayStyle = () => {
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
  };

  // Animation CSS
  const getAnimationStyle = () => {
    if (!section.animation || section.animation === 'none' || !isVisible) {
      return { opacity: section.animation === 'none' ? 1 : 0 };
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
  };

  // Text shadow CSS
  const getTextShadowStyle = () => {
    if (!section.textShadow?.enabled) return {};

    const { color, blur, offsetX, offsetY } = section.textShadow;
    return {
      textShadow: `${offsetX || 2}px ${offsetY || 2}px ${blur || 4}px ${color || '#000000'}`,
    };
  };

  // Text position classes
  const getPositionClasses = () => {
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
  };

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
          style={getImageFilterStyle()}
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
        alt={section.title}
        className="w-full h-full object-cover"
        style={getImageFilterStyle()}
        loading="lazy"
        onError={handleMediaError}
      />
    );
  };

  // Common styles
  const containerStyle: React.CSSProperties = {
    backgroundColor: section.backgroundColor || '#000000',
    color: section.textColor || '#ffffff',
    fontFamily: section.fontFamily || 'system-ui, -apple-system, sans-serif',
    minHeight: section.sectionHeight || '100vh',
    height: section.sectionHeight === 'auto' ? 'auto' : section.sectionHeight,
  };

  const textStyle: React.CSSProperties = {
    ...getTextShadowStyle(),
  };

  const titleStyle: React.CSSProperties = {
    fontSize: `${section.titleFontSize || 48}px`,
    ...textStyle,
  };

  const descStyle: React.CSSProperties = {
    fontSize: `${section.descriptionFontSize || 18}px`,
    ...textStyle,
  };

  const paddingStyle: React.CSSProperties = {
    paddingLeft: `${section.paddingX || 24}px`,
    paddingRight: `${section.paddingX || 24}px`,
    paddingTop: `${section.paddingY || 24}px`,
    paddingBottom: `${section.paddingY || 24}px`,
  };

  const splitMediaStyle = {
    width: `${mediaRatio}%`,
  };
  const splitTextStyle = {
    width: `${textRatio}%`,
  };

  switch (section.layout) {
    case LayoutType.HERO:
      return (
        <section
          ref={sectionRef}
          className={`section-preview relative w-full flex flex-col overflow-hidden ${getPositionClasses()}`}
          style={containerStyle}
        >
          <div className="absolute inset-0 z-0">
            {renderMedia()}
          </div>
          {/* Color Overlay */}
          <div
            className="absolute inset-0 z-[1]"
            style={{ backgroundColor: section.backgroundColor || '#000000', opacity: section.overlayOpacity ?? 0.4 }}
          />
          {/* Gradient Overlay */}
          {section.gradientOverlay?.enabled && (
            <div className="absolute inset-0 z-[2]" style={getGradientOverlayStyle()} />
          )}
          <div
            className={`relative z-10 w-full max-w-5xl mx-auto flex flex-col ${getPositionClasses()}`}
            style={{ ...paddingStyle, ...getAnimationStyle() }}
          >
            <h1 className="font-serif font-bold mb-6 tracking-tight leading-tight" style={titleStyle}>{section.title}</h1>
            <p className="font-light opacity-90 leading-relaxed max-w-2xl" style={descStyle}>{section.description}</p>
            <CTAButtonComponent />
          </div>
          {isFirst && (
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce opacity-50 z-10">
              <ChevronDown size={32} />
            </div>
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
              <div className="absolute inset-0" style={getGradientOverlayStyle()} />
            )}
          </div>

          <div
            className={`w-full flex flex-col ${getPositionClasses()}`}
            style={{ ...splitTextStyle, ...paddingStyle, minHeight: '50vh', ...getAnimationStyle() }}
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
              <div className="absolute inset-0" style={getGradientOverlayStyle()} />
            )}
          </div>

          <div
            className={`w-full flex flex-col ${getPositionClasses()}`}
            style={{ ...splitTextStyle, ...paddingStyle, minHeight: '50vh', ...getAnimationStyle() }}
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
          className={`section-preview relative w-full flex flex-col overflow-hidden ${getPositionClasses()}`}
          style={containerStyle}
        >
          <div className="absolute inset-0 z-0">
            {renderMedia()}
          </div>
          {/* Color Overlay */}
          <div
            className="absolute inset-0 z-[1]"
            style={{ backgroundColor: section.backgroundColor || '#000000', opacity: section.overlayOpacity ?? 0.4 }}
          />
          {/* Gradient Overlay */}
          {section.gradientOverlay?.enabled && (
            <div className="absolute inset-0 z-[2]" style={getGradientOverlayStyle()} />
          )}
          <div
            className={`relative z-10 max-w-3xl flex flex-col ${getPositionClasses()}`}
            style={{ ...paddingStyle, ...getAnimationStyle() }}
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

    // ========== 기본 레이아웃 ==========

    case LayoutType.SIMPLE_TEXT:
    default:
      return (
        <section
          ref={sectionRef}
          className={`section-preview w-full flex flex-col ${getPositionClasses()}`}
          style={containerStyle}
        >
          {section.gradientOverlay?.enabled && (
            <div className="absolute inset-0" style={getGradientOverlayStyle()} />
          )}
          <div
            className={`w-full max-w-4xl mx-auto relative z-10 flex flex-col ${getPositionClasses()}`}
            style={{ ...paddingStyle, ...getAnimationStyle() }}
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
