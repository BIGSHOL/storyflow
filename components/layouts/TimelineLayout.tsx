import React, { memo } from 'react';
import { Section } from '../../types';
import Clock from 'lucide-react/dist/esm/icons/clock';

interface TimelineLayoutProps {
  section: Section;
}

const TimelineLayout: React.FC<TimelineLayoutProps> = memo(({ section }) => {
  const { timelineItems = [], timelineAlignment = 'alternate' } = section;

  const containerStyle: React.CSSProperties = {
    backgroundColor: section.backgroundColor || '#000000',
    color: section.textColor || '#ffffff',
    minHeight: section.sectionHeight || '100vh',
  };

  if (timelineItems.length === 0) {
    return (
      <section className="section-preview w-full flex flex-col items-center justify-center" style={containerStyle}>
        <Clock size={48} className="mb-4 opacity-50" />
        <p className="text-lg opacity-70">타임라인에 이벤트를 추가하세요</p>
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

      <div className="max-w-4xl mx-auto relative">
        {/* 라인: 모바일은 왼쪽, 데스크탑은 중앙 */}
        <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 w-0.5 h-full bg-gray-700" />

        {timelineItems.map((item, index) => {
          const isLeft = timelineAlignment === 'left' ||
            (timelineAlignment === 'alternate' && index % 2 === 0);

          return (
            <div
              key={item.id}
              className="relative mb-12"
            >
              {/* 모바일 레이아웃: 항상 왼쪽 정렬 */}
              <div className="md:hidden pl-12 relative">
                <div className="absolute left-2 top-1 w-4 h-4 bg-white rounded-full border-4 border-gray-900 z-10" />
                <span className="text-sm opacity-60 block mb-1">{item.date}</span>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="opacity-80 text-sm">{item.description}</p>
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="mt-4 rounded-lg max-w-full"
                    loading="lazy"
                  />
                )}
              </div>

              {/* 데스크탑 레이아웃: 교대 또는 단일 정렬 */}
              <div className={`hidden md:flex items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-5/12 ${isLeft ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                  <span className="text-sm opacity-60 block mb-1">{item.date}</span>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="opacity-80 text-sm">{item.description}</p>
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="mt-4 rounded-lg max-w-full"
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full border-4 border-gray-900 z-10" />
                <div className="w-5/12" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
});

TimelineLayout.displayName = 'TimelineLayout';

export default TimelineLayout;
