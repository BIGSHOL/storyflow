import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
import { Section } from '../../types';
import ImageOff from 'lucide-react/dist/esm/icons/image-off';
import X from 'lucide-react/dist/esm/icons/x';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';

interface MasonryLayoutProps {
  section: Section;
}

const MasonryLayout: React.FC<MasonryLayoutProps> = memo(({ section }) => {
  const { masonryImages = [], masonrySettings } = section;
  const desktopColumns = masonrySettings?.columns || 3;
  const gap = masonrySettings?.gap || 16;
  const showCaptions = masonrySettings?.showCaptions ?? true;
  const hoverEffect = masonrySettings?.hoverEffect ?? true;
  const rounded = masonrySettings?.rounded ?? true;
  const enableLightbox = masonrySettings?.enableLightbox ?? false;

  const containerRef = useRef<HTMLDivElement>(null);

  // 라이트박스 상태
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // 반응형 컬럼 수 계산
  const getResponsiveColumns = useCallback(() => {
    if (typeof window === 'undefined') return desktopColumns;
    if (window.innerWidth < 640) return 1; // 모바일
    if (window.innerWidth < 1024) return Math.min(desktopColumns, 2); // 태블릿
    return desktopColumns;
  }, [desktopColumns]);

  const [columns, setColumns] = useState(getResponsiveColumns);

  // 윈도우 리사이즈 시 컬럼 수 업데이트
  useEffect(() => {
    const handleResize = () => {
      setColumns(getResponsiveColumns());
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // 초기 설정

    return () => window.removeEventListener('resize', handleResize);
  }, [getResponsiveColumns]);

  const containerStyle: React.CSSProperties = {
    backgroundColor: section.backgroundColor || '#000000',
    color: section.textColor || '#ffffff',
    minHeight: section.sectionHeight || '100vh',
  };

  // Distribute images into columns based on shortest column
  const distributeImages = () => {
    const cols: typeof masonryImages[] = Array.from({ length: columns }, () => []);
    const heights = Array(columns).fill(0);

    masonryImages.forEach((image) => {
      // Find the shortest column
      const shortestCol = heights.indexOf(Math.min(...heights));
      cols[shortestCol].push(image);

      // Estimate height based on aspect ratio
      let heightMultiplier = 1;
      switch (image.aspectRatio) {
        case 'portrait':
          heightMultiplier = 1.5;
          break;
        case 'landscape':
          heightMultiplier = 0.67;
          break;
        case 'square':
          heightMultiplier = 1;
          break;
        default:
          // Random variation for 'auto' to create visual interest
          heightMultiplier = 0.8 + Math.random() * 0.6;
      }
      heights[shortestCol] += heightMultiplier;
    });

    return cols;
  };

  const columnData = distributeImages();

  // 이미지 클릭 핸들러
  const handleImageClick = useCallback((imageId: string) => {
    if (enableLightbox) {
      const index = masonryImages.findIndex(img => img.id === imageId);
      if (index !== -1) {
        setLightboxIndex(index);
      }
    }
  }, [enableLightbox, masonryImages]);

  // 라이트박스 닫기
  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  // 이전 이미지
  const goToPrevious = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === 0 ? masonryImages.length - 1 : lightboxIndex - 1);
    }
  }, [lightboxIndex, masonryImages.length]);

  // 다음 이미지
  const goToNext = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === masonryImages.length - 1 ? 0 : lightboxIndex + 1);
    }
  }, [lightboxIndex, masonryImages.length]);

  // 키보드 네비게이션
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex(lightboxIndex === 0 ? masonryImages.length - 1 : lightboxIndex - 1);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex(lightboxIndex === masonryImages.length - 1 ? 0 : lightboxIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, masonryImages.length, closeLightbox]);

  // 라이트박스 열릴 때 스크롤 방지
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxIndex]);

  if (masonryImages.length === 0) {
    return (
      <section className="section-preview w-full flex flex-col items-center justify-center" style={containerStyle}>
        <ImageOff size={48} className="mb-4 opacity-50" />
        <p className="text-lg opacity-70">Masonry 갤러리에 이미지를 추가하세요</p>
      </section>
    );
  }

  const currentImage = lightboxIndex !== null ? masonryImages[lightboxIndex] : null;

  return (
    <section className="section-preview w-full py-16 px-8" style={containerStyle}>
      {section.title && (
        <h2
          className="font-serif font-bold text-center mb-6"
          style={{
            fontSize: section.titleFontSize || 48,
            fontFamily: section.fontFamily
          }}
        >
          {section.title}
        </h2>
      )}
      {section.description && (
        <p
          className="text-center opacity-80 mb-12 max-w-2xl mx-auto"
          style={{
            fontSize: section.descriptionFontSize || 18,
            fontFamily: section.fontFamily
          }}
        >
          {section.description}
        </p>
      )}

      <div
        ref={containerRef}
        className="max-w-7xl mx-auto flex"
        style={{ gap: `${gap}px` }}
      >
        {columnData.map((colImages, colIndex) => (
          <div
            key={colIndex}
            className="flex-1 flex flex-col"
            style={{ gap: `${gap}px` }}
          >
            {colImages.map((image) => (
              <div
                key={image.id}
                className={`group relative overflow-hidden ${rounded ? 'rounded-lg' : ''} ${
                  hoverEffect ? 'transition-transform duration-300 hover:scale-[1.02]' : ''
                } ${enableLightbox ? 'cursor-pointer' : ''}`}
                onClick={() => handleImageClick(image.id)}
              >
                {image.url ? (
                  <>
                    <img
                      src={image.url}
                      alt={image.caption || ''}
                      className={`w-full object-cover ${
                        image.aspectRatio === 'portrait' ? 'aspect-[2/3]' :
                        image.aspectRatio === 'landscape' ? 'aspect-[3/2]' :
                        image.aspectRatio === 'square' ? 'aspect-square' :
                        ''
                      }`}
                      loading="lazy"
                    />
                    {!enableLightbox && image.link && (
                      <a
                        href={image.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 z-10"
                        aria-label={image.caption || 'View image'}
                      />
                    )}
                  </>
                ) : (
                  <div className="w-full aspect-square bg-gray-800 flex items-center justify-center">
                    <ImageOff size={24} className="opacity-50" />
                  </div>
                )}
                {showCaptions && image.caption && (
                  <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 ${
                    hoverEffect ? 'opacity-0 group-hover:opacity-100 transition-opacity duration-300' : ''
                  }`}>
                    <p className="text-sm text-white">{image.caption}</p>
                  </div>
                )}
                {/* 라이트박스 활성화 시 호버 오버레이 */}
                {enableLightbox && image.url && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-medium">
                      클릭하여 확대
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 라이트박스 오버레이 */}
      {lightboxIndex !== null && currentImage && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* 닫기 버튼 */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-10"
            aria-label="닫기"
          >
            <X size={32} />
          </button>

          {/* 이전 버튼 */}
          {masonryImages.length > 1 && (
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors z-10"
              aria-label="이전 이미지"
            >
              <ChevronLeft size={40} />
            </button>
          )}

          {/* 이미지 */}
          <div
            className="max-w-[90vw] max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImage.url}
              alt={currentImage.caption || ''}
              className="max-w-full max-h-[80vh] object-contain"
            />
            {showCaptions && currentImage.caption && (
              <p className="mt-4 text-white text-center text-lg">{currentImage.caption}</p>
            )}
            {/* 이미지 카운터 */}
            <p className="mt-2 text-white/50 text-sm">
              {lightboxIndex + 1} / {masonryImages.length}
            </p>
          </div>

          {/* 다음 버튼 */}
          {masonryImages.length > 1 && (
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors z-10"
              aria-label="다음 이미지"
            >
              <ChevronRight size={40} />
            </button>
          )}
        </div>
      )}
    </section>
  );
});

MasonryLayout.displayName = 'MasonryLayout';

export default MasonryLayout;
