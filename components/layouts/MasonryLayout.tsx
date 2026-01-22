import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
import { Section } from '../../types';
import ImageOff from 'lucide-react/dist/esm/icons/image-off';

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

  const containerRef = useRef<HTMLDivElement>(null);

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

  if (masonryImages.length === 0) {
    return (
      <section className="section-preview w-full flex flex-col items-center justify-center" style={containerStyle}>
        <ImageOff size={48} className="mb-4 opacity-50" />
        <p className="text-lg opacity-70">Masonry 갤러리에 이미지를 추가하세요</p>
      </section>
    );
  }

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
                }`}
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
                    {image.link && (
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
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
});

MasonryLayout.displayName = 'MasonryLayout';

export default MasonryLayout;
