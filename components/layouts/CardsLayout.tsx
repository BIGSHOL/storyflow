import React, { memo } from 'react';
import { Section } from '../../types';
import LayoutGrid from 'lucide-react/dist/esm/icons/layout-grid';

interface CardsLayoutProps {
  section: Section;
}

const CardsLayout: React.FC<CardsLayoutProps> = memo(({ section }) => {
  const { cards = [], cardsSettings } = section;
  const columns = cardsSettings?.columns || 3;
  const borderRadius = cardsSettings?.borderRadius ?? 12;
  const showShadow = cardsSettings?.showShadow ?? true;
  const hoverEffect = cardsSettings?.hoverEffect ?? true;

  const containerStyle: React.CSSProperties = {
    backgroundColor: section.backgroundColor || '#000000',
    color: section.textColor || '#ffffff',
    minHeight: section.sectionHeight || '100vh',
  };

  // 반응형 그리드 클래스: 모바일 1열 → 태블릿 2열 → 데스크탑 사용자 설정
  const gridClasses = `grid gap-6 grid-cols-1 sm:grid-cols-2 ${
    columns >= 3 ? 'lg:grid-cols-3' : ''
  } ${columns >= 4 ? 'xl:grid-cols-4' : ''}`;

  if (cards.length === 0) {
    return (
      <section className="section-preview w-full flex flex-col items-center justify-center" style={containerStyle}>
        <LayoutGrid size={48} className="mb-4 opacity-50" />
        <p className="text-lg opacity-70">카드를 추가하세요</p>
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

      <div className={`max-w-6xl mx-auto ${gridClasses}`}>
        {cards.map((card) => (
          <div
            key={card.id}
            className={`bg-gray-800 overflow-hidden transition-all duration-300 ${
              hoverEffect ? 'hover:scale-105 hover:bg-gray-700' : ''
            }`}
            style={{
              borderRadius: `${borderRadius}px`,
              boxShadow: showShadow ? '0 4px 20px rgba(0,0,0,0.3)' : 'none',
            }}
          >
            {card.imageUrl && (
              <img
                src={card.imageUrl}
                alt={card.title}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
            )}
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{card.title}</h3>
              <p className="opacity-80 text-sm">{card.description}</p>
              {card.link && (
                <a
                  href={card.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-sm text-blue-400 hover:text-blue-300"
                >
                  자세히 보기 →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});

CardsLayout.displayName = 'CardsLayout';

export default CardsLayout;
