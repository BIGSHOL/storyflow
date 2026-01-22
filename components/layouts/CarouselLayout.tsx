import React, { memo, useState, useEffect, useCallback, useRef } from 'react';
import { Section } from '../../types';
import ImageOff from 'lucide-react/dist/esm/icons/image-off';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';

interface CarouselLayoutProps {
  section: Section;
}

const CarouselLayout: React.FC<CarouselLayoutProps> = memo(({ section }) => {
  const { carouselImages = [], carouselSettings } = section;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 기본 설정
  const autoPlay = carouselSettings?.autoPlay ?? true;
  const autoPlayInterval = carouselSettings?.autoPlayInterval || 5000;
  const showArrows = carouselSettings?.showArrows ?? true;
  const showDots = carouselSettings?.showDots ?? true;
  const transition = carouselSettings?.transition || 'slide';
  const transitionDuration = carouselSettings?.transitionDuration || 500;
  const pauseOnHover = carouselSettings?.pauseOnHover ?? true;
  const loop = carouselSettings?.loop ?? true;

  // 다음 슬라이드
  const goToNext = useCallback(() => {
    if (carouselImages.length === 0) return;
    setCurrentIndex((prev) => {
      if (prev >= carouselImages.length - 1) {
        return loop ? 0 : prev;
      }
      return prev + 1;
    });
  }, [carouselImages.length, loop]);

  // 이전 슬라이드
  const goToPrev = useCallback(() => {
    if (carouselImages.length === 0) return;
    setCurrentIndex((prev) => {
      if (prev <= 0) {
        return loop ? carouselImages.length - 1 : prev;
      }
      return prev - 1;
    });
  }, [carouselImages.length, loop]);

  // 특정 슬라이드로 이동
  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // 자동 재생
  useEffect(() => {
    if (!autoPlay || isPaused || carouselImages.length <= 1) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(goToNext, autoPlayInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoPlay, autoPlayInterval, isPaused, goToNext, carouselImages.length]);

  // 컨테이너 스타일
  const containerStyle: React.CSSProperties = {
    backgroundColor: section.backgroundColor || '#000000',
    color: section.textColor || '#ffffff',
    minHeight: section.sectionHeight || '100vh',
  };

  // 슬라이드 트랜지션 스타일
  const getSlideStyle = (index: number): React.CSSProperties => {
    if (transition === 'fade') {
      return {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: index === currentIndex ? 1 : 0,
        transition: `opacity ${transitionDuration}ms ease-in-out`,
        zIndex: index === currentIndex ? 1 : 0,
      };
    }
    // slide transition
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      transform: `translateX(${(index - currentIndex) * 100}%)`,
      transition: `transform ${transitionDuration}ms ease-in-out`,
    };
  };

  // 빈 상태
  if (carouselImages.length === 0) {
    return (
      <section className="section-preview w-full flex flex-col items-center justify-center" style={containerStyle}>
        <ImageOff size={48} className="mb-4 opacity-50" />
        <p className="text-lg opacity-70">캐러셀에 이미지를 추가하세요</p>
      </section>
    );
  }

  const currentImage = carouselImages[currentIndex];

  return (
    <section
      className="section-preview w-full relative overflow-hidden"
      style={containerStyle}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      {/* 슬라이드 컨테이너 */}
      <div className="relative w-full h-full" style={{ minHeight: section.sectionHeight || '100vh' }}>
        {carouselImages.map((image, index) => (
          <div key={image.id} style={getSlideStyle(index)}>
            {image.url ? (
              <img
                src={image.url}
                alt={image.title || `슬라이드 ${index + 1}`}
                className="w-full h-full object-cover"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <ImageOff size={48} className="opacity-50" />
              </div>
            )}
            {/* 오버레이 */}
            <div
              className="absolute inset-0"
              style={{ backgroundColor: section.backgroundColor || '#000', opacity: section.overlayOpacity || 0.3 }}
            />
          </div>
        ))}

        {/* 텍스트 콘텐츠 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-8">
          {currentImage?.title && (
            <h2
              className="text-4xl md:text-6xl font-serif font-bold text-center mb-4"
              style={{
                fontSize: section.titleFontSize || 48,
                fontFamily: section.fontFamily,
                color: section.textColor || '#ffffff',
              }}
            >
              {currentImage.title}
            </h2>
          )}
          {currentImage?.description && (
            <p
              className="text-lg md:text-xl text-center max-w-2xl opacity-90"
              style={{
                fontSize: section.descriptionFontSize || 18,
                fontFamily: section.fontFamily,
                color: section.textColor || '#ffffff',
              }}
            >
              {currentImage.description}
            </p>
          )}
          {currentImage?.link && (
            <a
              href={currentImage.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors"
            >
              자세히 보기
            </a>
          )}
        </div>

        {/* 화살표 네비게이션 */}
        {showArrows && carouselImages.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="이전 슬라이드"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="다음 슬라이드"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* 도트 인디케이터 */}
        {showDots && carouselImages.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-white scale-110'
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`슬라이드 ${index + 1}로 이동`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 섹션 제목 (선택적) */}
      {section.title && !currentImage?.title && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <h2
            className="text-4xl md:text-6xl font-serif font-bold text-center"
            style={{
              fontSize: section.titleFontSize || 48,
              fontFamily: section.fontFamily,
            }}
          >
            {section.title}
          </h2>
        </div>
      )}
    </section>
  );
});

CarouselLayout.displayName = 'CarouselLayout';

export default CarouselLayout;
