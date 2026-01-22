import React, { memo, useState, useCallback, useEffect } from 'react';
import { Section } from '../../types';
import ImageOff from 'lucide-react/dist/esm/icons/image-off';
import X from 'lucide-react/dist/esm/icons/x';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';

interface GalleryLayoutProps {
  section: Section;
}

const GalleryLayout: React.FC<GalleryLayoutProps> = memo(({ section }) => {
  const { galleryImages = [], gallerySettings } = section;
  const columns = gallerySettings?.columns || 3;
  const gap = gallerySettings?.gap || 16;
  const showCaptions = gallerySettings?.showCaptions ?? true;
  const enableLightbox = gallerySettings?.enableLightbox ?? false;

  // 라이트박스 상태
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const containerStyle: React.CSSProperties = {
    backgroundColor: section.backgroundColor || '#000000',
    color: section.textColor || '#ffffff',
    minHeight: section.sectionHeight || '100vh',
  };

  // 반응형 그리드 클래스: 모바일 2열 → 태블릿 3열 → 데스크탑 사용자 설정
  const gridClasses = `grid grid-cols-2 sm:grid-cols-3 ${
    columns >= 4 ? 'lg:grid-cols-4' : ''
  } ${columns >= 5 ? 'xl:grid-cols-5' : ''}`;

  const gapStyle = { gap: `${gap}px` };

  // 이미지 클릭 핸들러
  const handleImageClick = useCallback((index: number) => {
    if (enableLightbox) {
      setLightboxIndex(index);
    }
  }, [enableLightbox]);

  // 라이트박스 닫기
  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  // 이전 이미지
  const goToPrevious = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === 0 ? galleryImages.length - 1 : lightboxIndex - 1);
    }
  }, [lightboxIndex, galleryImages.length]);

  // 다음 이미지
  const goToNext = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === galleryImages.length - 1 ? 0 : lightboxIndex + 1);
    }
  }, [lightboxIndex, galleryImages.length]);

  // 키보드 네비게이션
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex(lightboxIndex === 0 ? galleryImages.length - 1 : lightboxIndex - 1);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex(lightboxIndex === galleryImages.length - 1 ? 0 : lightboxIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, galleryImages.length, closeLightbox]);

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

  if (galleryImages.length === 0) {
    return (
      <section className="section-preview w-full flex flex-col items-center justify-center" style={containerStyle}>
        <ImageOff size={48} className="mb-4 opacity-50" />
        <p className="text-lg opacity-70">갤러리에 이미지를 추가하세요</p>
      </section>
    );
  }

  const currentImage = lightboxIndex !== null ? galleryImages[lightboxIndex] : null;

  return (
    <section className="section-preview w-full py-16 px-8" style={containerStyle}>
      {section.title && (
        <h2 className="text-4xl font-serif font-bold text-center mb-12">{section.title}</h2>
      )}
      {section.description && (
        <p className="text-lg text-center opacity-80 mb-12 max-w-2xl mx-auto">{section.description}</p>
      )}
      <div className={`max-w-6xl mx-auto ${gridClasses}`} style={gapStyle}>
        {galleryImages.map((image, index) => (
          <div
            key={image.id}
            className={`group relative overflow-hidden rounded-lg ${enableLightbox ? 'cursor-pointer' : ''}`}
            onClick={() => handleImageClick(index)}
          >
            {image.url ? (
              <img
                src={image.url}
                alt={image.caption || ''}
                className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="w-full aspect-square bg-gray-800 flex items-center justify-center">
                <ImageOff size={24} className="opacity-50" />
              </div>
            )}
            {showCaptions && image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
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
          {galleryImages.length > 1 && (
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
              {lightboxIndex + 1} / {galleryImages.length}
            </p>
          </div>

          {/* 다음 버튼 */}
          {galleryImages.length > 1 && (
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

GalleryLayout.displayName = 'GalleryLayout';

export default GalleryLayout;
