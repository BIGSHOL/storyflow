import React, { memo } from 'react';
import { Section } from '../../types';
import Quote from 'lucide-react/dist/esm/icons/quote';

interface QuoteLayoutProps {
  section: Section;
}

const QuoteLayout: React.FC<QuoteLayoutProps> = memo(({ section }) => {
  const { quoteText, quoteAuthor, quoteSettings } = section;
  const quoteStyle = quoteSettings?.quoteStyle || 'double';
  const authorPrefix = quoteSettings?.authorPrefix || '—';

  const containerStyle: React.CSSProperties = {
    backgroundColor: section.backgroundColor || '#000000',
    color: section.textColor || '#ffffff',
    minHeight: section.sectionHeight || '100vh',
    fontFamily: section.fontFamily || 'Georgia, serif',
  };

  const getQuoteSymbol = () => {
    switch (quoteStyle) {
      case 'double': return '"';
      case 'single': return "'";
      default: return '';
    }
  };

  if (!quoteText) {
    return (
      <section className="section-preview w-full flex flex-col items-center justify-center" style={containerStyle}>
        <Quote size={48} className="mb-4 opacity-50" />
        <p className="text-lg opacity-70">인용문을 입력하세요</p>
      </section>
    );
  }

  return (
    <section className="section-preview w-full flex flex-col items-center justify-center px-8" style={containerStyle}>
      {/* 배경 이미지 */}
      {section.mediaUrl && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${section.mediaUrl})` }}
          />
          <div
            className="absolute inset-0"
            style={{ backgroundColor: section.backgroundColor || '#000000', opacity: section.overlayOpacity ?? 0.6 }}
          />
        </>
      )}

      <div className="relative z-10 max-w-4xl text-center">
        {/* 큰 인용 부호 */}
        {quoteStyle !== 'none' && (
          <span className="text-8xl opacity-30 font-serif leading-none block mb-4">
            {getQuoteSymbol()}
          </span>
        )}

        {/* 인용문 */}
        <blockquote
          className="text-3xl md:text-5xl font-serif italic leading-relaxed"
          style={{ fontSize: `${section.titleFontSize || 48}px` }}
        >
          {quoteText}
        </blockquote>

        {/* 저자 */}
        {quoteAuthor && (
          <cite
            className="block mt-8 text-xl opacity-70 not-italic"
            style={{ fontSize: `${section.descriptionFontSize || 20}px` }}
          >
            {authorPrefix} {quoteAuthor}
          </cite>
        )}
      </div>
    </section>
  );
});

QuoteLayout.displayName = 'QuoteLayout';

export default QuoteLayout;
