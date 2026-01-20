import React, { memo, useState } from 'react';
import { Section } from '../../types';
import Video from 'lucide-react/dist/esm/icons/video';
import ImageOff from 'lucide-react/dist/esm/icons/image-off';

interface VideoHeroLayoutProps {
  section: Section;
}

const VideoHeroLayout: React.FC<VideoHeroLayoutProps> = memo(({ section }) => {
  const { videoUrl, videoHeroSettings } = section;
  const autoPlay = videoHeroSettings?.autoPlay ?? true;
  const muted = videoHeroSettings?.muted ?? true;
  const loop = videoHeroSettings?.loop ?? true;
  const fallbackImageUrl = videoHeroSettings?.fallbackImageUrl || section.mediaUrl;

  const [videoError, setVideoError] = useState(false);

  const containerStyle: React.CSSProperties = {
    backgroundColor: section.backgroundColor || '#000000',
    color: section.textColor || '#ffffff',
    minHeight: section.sectionHeight || '100vh',
  };

  const handleVideoError = () => {
    setVideoError(true);
  };

  // 비디오 없는 상태
  if (!videoUrl) {
    return (
      <section className="section-preview relative w-full flex flex-col items-center justify-center" style={containerStyle}>
        <Video size={48} className="mb-4 opacity-50" />
        <p className="text-lg opacity-70">비디오를 업로드하세요</p>
      </section>
    );
  }

  return (
    <section className="section-preview relative w-full flex flex-col items-center justify-center overflow-hidden" style={containerStyle}>
      {/* 비디오 또는 폴백 이미지 */}
      <div className="absolute inset-0 z-0">
        {videoError && fallbackImageUrl && fallbackImageUrl.length > 0 ? (
          <img
            src={fallbackImageUrl}
            alt="Video fallback"
            className="w-full h-full object-cover"
          />
        ) : videoError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-900">
            <ImageOff size={48} className="opacity-50" />
          </div>
        ) : (
          <video
            src={videoUrl}
            className="w-full h-full object-cover"
            autoPlay={autoPlay}
            muted={muted}
            loop={loop}
            playsInline
            onError={handleVideoError}
          />
        )}
      </div>

      {/* 오버레이 */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          backgroundColor: section.backgroundColor || '#000000',
          opacity: section.overlayOpacity ?? 0.4,
        }}
      />

      {/* 콘텐츠 */}
      <div className="relative z-10 text-center px-8 max-w-4xl">
        {section.title && (
          <h1
            className="font-serif font-bold mb-6 tracking-tight leading-tight"
            style={{ fontSize: `${section.titleFontSize || 64}px` }}
          >
            {section.title}
          </h1>
        )}
        {section.description && (
          <p
            className="font-light opacity-90 leading-relaxed max-w-2xl mx-auto"
            style={{ fontSize: `${section.descriptionFontSize || 20}px` }}
          >
            {section.description}
          </p>
        )}

        {/* CTA 버튼 */}
        {section.ctaButton?.enabled && (
          <a
            href={section.ctaButton.link || '#'}
            target={section.ctaButton.link?.startsWith('http') ? '_blank' : undefined}
            rel={section.ctaButton.link?.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="inline-block mt-8 px-8 py-4 rounded-full font-medium transition-all duration-300 hover:scale-105"
            style={
              section.ctaButton.style === 'solid'
                ? { backgroundColor: section.ctaButton.color || '#ffffff', color: '#000000' }
                : { border: `2px solid ${section.ctaButton.color || '#ffffff'}`, color: section.ctaButton.color || '#ffffff' }
            }
          >
            {section.ctaButton.text || '자세히 보기'}
          </a>
        )}
      </div>
    </section>
  );
});

VideoHeroLayout.displayName = 'VideoHeroLayout';

export default VideoHeroLayout;
