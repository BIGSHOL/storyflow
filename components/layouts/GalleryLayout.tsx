import React, { memo } from 'react';
import { Section } from '../../types';
import ImageOff from 'lucide-react/dist/esm/icons/image-off';

interface GalleryLayoutProps {
  section: Section;
}

const GalleryLayout: React.FC<GalleryLayoutProps> = memo(({ section }) => {
  const { galleryImages = [], gallerySettings } = section;
  const columns = gallerySettings?.columns || 3;
  const gap = gallerySettings?.gap || 16;
  const showCaptions = gallerySettings?.showCaptions ?? true;

  const containerStyle: React.CSSProperties = {
    backgroundColor: section.backgroundColor || '#000000',
    color: section.textColor || '#ffffff',
    minHeight: section.sectionHeight || '100vh',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: `${gap}px`,
  };

  if (galleryImages.length === 0) {
    return (
      <section className="section-preview w-full flex flex-col items-center justify-center" style={containerStyle}>
        <ImageOff size={48} className="mb-4 opacity-50" />
        <p className="text-lg opacity-70">갤러리에 이미지를 추가하세요</p>
      </section>
    );
  }

  return (
    <section className="section-preview w-full py-16 px-8" style={containerStyle}>
      {section.title && (
        <h2 className="text-4xl font-serif font-bold text-center mb-12">{section.title}</h2>
      )}
      {section.description && (
        <p className="text-lg text-center opacity-80 mb-12 max-w-2xl mx-auto">{section.description}</p>
      )}
      <div className="max-w-6xl mx-auto" style={gridStyle}>
        {galleryImages.map((image) => (
          <div key={image.id} className="group relative overflow-hidden rounded-lg">
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
          </div>
        ))}
      </div>
    </section>
  );
});

GalleryLayout.displayName = 'GalleryLayout';

export default GalleryLayout;
