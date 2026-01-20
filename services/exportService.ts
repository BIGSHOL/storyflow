import { Section, LayoutType } from '../types';
import { GOOGLE_FONTS_URL } from '../data/constants';

// 이미지 Blob URL을 Base64로 변환
const imageToBase64 = async (blobUrl: string): Promise<string> => {
  try {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    console.error('이미지 변환 실패:', blobUrl);
    return '';
  }
};

// CSS 스타일 (내보낼 HTML에 포함)
const CSS_STYLES = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Noto Sans KR', Georgia, 'Times New Roman', serif;
  background-color: #000;
  color: #fff;
  line-height: 1.6;
}

.section {
  position: relative;
  display: flex;
  overflow: hidden;
}

.section .bg-media {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.section .overlay {
  position: absolute;
  inset: 0;
  background-color: #000;
}

.section .gradient-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.section .content {
  position: relative;
  z-index: 10;
  max-width: 1200px;
  width: 100%;
}

.section h1,
.section h2 {
  font-weight: bold;
  margin-bottom: 1.5rem;
  line-height: 1.1;
}

.section p {
  opacity: 0.9;
  max-width: 600px;
  white-space: pre-wrap;
}

.section.split {
  display: flex;
  flex-direction: row;
}

.section.split .media-side {
  position: relative;
  height: 100vh;
}

.section.split .text-side {
  display: flex;
  padding: 3rem;
  height: 100vh;
}

.section.simple-text {
  min-height: 70vh;
}

.divider {
  width: 5rem;
  height: 4px;
  margin-bottom: 1.5rem;
  opacity: 0.5;
}

.footer {
  padding: 3rem;
  text-align: center;
  background: #111;
  color: #666;
  font-size: 0.875rem;
}

/* Text Alignment */
.text-left { text-align: left; }
.text-center { text-align: center; }
.text-right { text-align: right; }

/* Items Alignment */
.items-start { align-items: flex-start; }
.items-center { align-items: center; }
.items-end { align-items: flex-end; }

/* Justify Alignment */
.justify-start { justify-content: flex-start; }
.justify-center { justify-content: center; }
.justify-end { justify-content: flex-end; }

/* Flex Direction */
.flex-col { flex-direction: column; }

/* CTA Button Styles */
.cta-button {
  display: inline-block;
  border-radius: 9999px;
  font-weight: 500;
  transition: all 0.3s ease;
  text-decoration: none;
  margin-top: 2rem;
}

.cta-button:hover {
  transform: scale(1.05);
}

.cta-button.small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.cta-button.medium {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

.cta-button.large {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

.cta-button.solid {
  color: #000;
}

.cta-button.outline {
  background: transparent;
  border: 2px solid currentColor;
}

.cta-button.ghost {
  background: transparent;
}

@media (max-width: 768px) {
  .section .content {
    padding: 1.5rem;
  }

  .section.split {
    flex-direction: column;
  }

  .section.split .media-side,
  .section.split .text-side {
    width: 100% !important;
    height: 50vh;
  }

  .section.split .text-side {
    padding: 2rem;
  }
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideLeft {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes slideRight {
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes zoomIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes zoomOut {
  from { opacity: 0; transform: scale(1.1); }
  to { opacity: 1; transform: scale(1); }
}

.animate-on-scroll {
  opacity: 0;
}

.animate-on-scroll.visible {
  animation-fill-mode: forwards;
}
`;

// 이미지 필터 CSS 생성
const getImageFilterStyle = (section: Section): string => {
  if (!section.imageFilter || section.imageFilter === 'none') return '';
  const intensity = section.imageFilterIntensity || 100;

  switch (section.imageFilter) {
    case 'grayscale':
      return `filter: grayscale(${intensity}%);`;
    case 'sepia':
      return `filter: sepia(${intensity}%);`;
    case 'blur':
      return `filter: blur(${intensity / 20}px);`;
    case 'brightness':
      return `filter: brightness(${intensity}%);`;
    case 'contrast':
      return `filter: contrast(${intensity}%);`;
    case 'saturate':
      return `filter: saturate(${intensity}%);`;
    default:
      return '';
  }
};

// 그라데이션 오버레이 스타일 생성
const getGradientOverlayStyle = (section: Section): string => {
  if (!section.gradientOverlay?.enabled) return '';

  const { startColor, endColor, direction, opacity } = section.gradientOverlay;
  const directionMap: Record<string, string> = {
    'to-bottom': 'to bottom',
    'to-top': 'to top',
    'to-right': 'to right',
    'to-left': 'to left',
    'to-bottom-right': 'to bottom right',
    'to-bottom-left': 'to bottom left',
  };

  return `background: linear-gradient(${directionMap[direction] || 'to bottom'}, ${startColor}, ${endColor}); opacity: ${opacity || 0.5};`;
};

// 텍스트 그림자 스타일 생성
const getTextShadowStyle = (section: Section): string => {
  if (!section.textShadow?.enabled) return '';

  const { color, blur, offsetX, offsetY } = section.textShadow;
  return `text-shadow: ${offsetX || 2}px ${offsetY || 2}px ${blur || 4}px ${color || '#000000'};`;
};

// 애니메이션 스타일 생성
const getAnimationStyle = (section: Section): string => {
  if (!section.animation || section.animation === 'none') return '';

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

  return `animation: ${animationMap[section.animation]} ${duration}s ease-out ${delay}s forwards;`;
};

// 텍스트 위치 클래스 생성
const getPositionClasses = (section: Section): string => {
  const vPos = section.textVerticalPosition || 'center';
  const hPos = section.textHorizontalPosition || 'center';

  const verticalMap: Record<string, string> = {
    top: 'justify-start',
    center: 'justify-center',
    bottom: 'justify-end',
  };

  const horizontalMap: Record<string, string> = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  };

  return `flex-col ${verticalMap[vPos]} ${horizontalMap[hPos]}`;
};

// CTA 버튼 HTML 생성
const getCTAButtonHTML = (section: Section): string => {
  if (!section.ctaButton?.enabled) return '';

  const { text, link, style, color, size } = section.ctaButton;

  const buttonStyle = style === 'solid'
    ? `background-color: ${color || '#ffffff'};`
    : `border-color: ${color || '#ffffff'}; color: ${color || '#ffffff'};`;

  return `<a href="${link || '#'}" class="cta-button ${style || 'solid'} ${size || 'medium'}" style="${buttonStyle}" ${link?.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''}>${text || '자세히 보기'}</a>`;
};

// 섹션을 HTML로 변환
const sectionToHTML = (section: Section, mediaBase64: string): string => {
  const positionClasses = getPositionClasses(section);
  const textColor = section.textColor || '#ffffff';
  const bgColor = section.backgroundColor || '#000000';
  const overlayOpacity = section.overlayOpacity ?? 0.4;
  const fontFamily = section.fontFamily || "'Noto Sans KR', sans-serif";
  const titleFontSize = section.titleFontSize || 48;
  const descFontSize = section.descriptionFontSize || 18;
  const paddingX = section.paddingX || 24;
  const paddingY = section.paddingY || 24;
  const sectionHeight = section.sectionHeight || '100vh';

  const textShadow = getTextShadowStyle(section);
  const animationStyle = getAnimationStyle(section);
  const imageFilter = getImageFilterStyle(section);
  const gradientOverlay = getGradientOverlayStyle(section);
  const ctaButton = getCTAButtonHTML(section);

  const mediaHTML = mediaBase64
    ? section.mediaType === 'video'
      ? `<video class="bg-media" style="${imageFilter}" src="${mediaBase64}" autoplay muted loop playsinline></video>`
      : `<img class="bg-media" style="${imageFilter}" src="${mediaBase64}" alt="${section.title}" />`
    : '';

  const contentStyle = `padding: ${paddingY}px ${paddingX}px; font-family: ${fontFamily}; ${animationStyle}`;
  const titleStyle = `font-size: ${titleFontSize}px; ${textShadow}`;
  const descStyle = `font-size: ${descFontSize}px; ${textShadow}`;

  const gradientHTML = gradientOverlay
    ? `<div class="gradient-overlay" style="${gradientOverlay}"></div>`
    : '';

  switch (section.layout) {
    case LayoutType.HERO:
      return `
    <section class="section ${positionClasses}" style="color: ${textColor}; min-height: ${sectionHeight}; height: ${sectionHeight === 'auto' ? 'auto' : sectionHeight};">
      ${mediaHTML}
      <div class="overlay" style="opacity: ${overlayOpacity}; background-color: ${bgColor};"></div>
      ${gradientHTML}
      <div class="content ${positionClasses}" style="${contentStyle}">
        <h1 style="${titleStyle}">${section.title}</h1>
        <p style="${descStyle}">${section.description}</p>
        ${ctaButton}
      </div>
    </section>`;

    case LayoutType.SPLIT_LEFT:
      return `
    <section class="section split" style="background-color: ${bgColor}; color: ${textColor}; min-height: ${sectionHeight};">
      <div class="media-side" style="width: ${section.splitRatio || 50}%;">
        ${mediaHTML || `<div style="width:100%;height:100%;background:#1a1a1a;"></div>`}
        ${gradientHTML}
      </div>
      <div class="text-side ${positionClasses}" style="width: ${100 - (section.splitRatio || 50)}%; font-family: ${fontFamily};">
        <div class="content" style="${contentStyle}">
          <h2 style="${titleStyle}">${section.title}</h2>
          <p style="${descStyle}">${section.description}</p>
          ${ctaButton}
        </div>
      </div>
    </section>`;

    case LayoutType.SPLIT_RIGHT:
      return `
    <section class="section split" style="background-color: ${bgColor}; color: ${textColor}; min-height: ${sectionHeight};">
      <div class="text-side ${positionClasses}" style="width: ${100 - (section.splitRatio || 50)}%; font-family: ${fontFamily};">
        <div class="content" style="${contentStyle}">
          <h2 style="${titleStyle}">${section.title}</h2>
          <p style="${descStyle}">${section.description}</p>
          ${ctaButton}
        </div>
      </div>
      <div class="media-side" style="width: ${section.splitRatio || 50}%;">
        ${mediaHTML || `<div style="width:100%;height:100%;background:#1a1a1a;"></div>`}
        ${gradientHTML}
      </div>
    </section>`;

    case LayoutType.FULL_IMAGE_TEXT_OVERLAY:
      return `
    <section class="section ${positionClasses}" style="color: ${textColor}; min-height: ${sectionHeight}; height: ${sectionHeight === 'auto' ? 'auto' : sectionHeight};">
      ${mediaHTML}
      <div class="overlay" style="opacity: ${overlayOpacity}; background-color: ${bgColor};"></div>
      ${gradientHTML}
      <div class="content ${positionClasses}" style="${contentStyle} max-width: 800px;">
        <h2 style="${titleStyle}">${section.title}</h2>
        <div class="divider" style="background-color: ${textColor}; ${section.textHorizontalPosition === 'center' ? 'margin-left:auto;margin-right:auto;' : section.textHorizontalPosition === 'right' ? 'margin-left:auto;' : ''}"></div>
        <p style="${descStyle}">${section.description}</p>
        ${ctaButton}
      </div>
    </section>`;

    case LayoutType.SIMPLE_TEXT:
      return `
    <section class="section simple-text ${positionClasses}" style="background-color: ${bgColor}; color: ${textColor}; min-height: ${sectionHeight}; height: ${sectionHeight === 'auto' ? 'auto' : sectionHeight}; font-family: ${fontFamily};">
      ${gradientHTML}
      <div class="content ${positionClasses}" style="${contentStyle} max-width: 900px;">
        <h2 style="${titleStyle}">${section.title}</h2>
        <p style="${descStyle} margin-top: 2rem;">${section.description}</p>
        ${ctaButton}
      </div>
    </section>`;

    // ========== 신규 레이아웃 ==========

    case LayoutType.GALLERY:
      const galleryImages = section.galleryImages || [];
      const galleryCols = section.gallerySettings?.columns || 3;
      const galleryGap = section.gallerySettings?.gap || 16;
      const showCaptions = section.gallerySettings?.showCaptions ?? true;
      const galleryItemsHTML = galleryImages.map(img => `
        <div class="gallery-item" style="break-inside: avoid; margin-bottom: ${galleryGap}px;">
          <img src="${img.url}" alt="${img.caption || ''}" style="width: 100%; border-radius: 8px;" />
          ${showCaptions && img.caption ? `<p style="font-size: 14px; opacity: 0.7; margin-top: 8px;">${img.caption}</p>` : ''}
        </div>
      `).join('');
      return `
    <section class="section gallery" style="background-color: ${bgColor}; color: ${textColor}; min-height: ${sectionHeight}; font-family: ${fontFamily}; padding: ${paddingY}px ${paddingX}px;">
      ${gradientHTML}
      <div class="content" style="max-width: 1200px; margin: 0 auto;">
        <h2 style="${titleStyle}; margin-bottom: 2rem;">${section.title}</h2>
        ${section.description ? `<p style="${descStyle}; margin-bottom: 2rem; opacity: 0.8;">${section.description}</p>` : ''}
        <div class="gallery-grid" style="column-count: ${galleryCols}; column-gap: ${galleryGap}px;">
          ${galleryItemsHTML}
        </div>
        ${ctaButton}
      </div>
    </section>`;

    case LayoutType.TIMELINE:
      const timelineItems = section.timelineItems || [];
      const tlAlign = section.timelineAlignment || 'alternate';
      const timelineItemsHTML = timelineItems.map((item, idx) => {
        const isLeft = tlAlign === 'left' || (tlAlign === 'alternate' && idx % 2 === 0);
        return `
        <div class="timeline-item" style="display: flex; margin-bottom: 2rem; flex-direction: ${isLeft ? 'row' : 'row-reverse'};">
          <div style="flex: 1; padding: 0 2rem; text-align: ${isLeft ? 'right' : 'left'};">
            <span style="font-size: 14px; opacity: 0.6;">${item.date}</span>
            <h3 style="font-size: 1.5rem; margin: 0.5rem 0;">${item.title}</h3>
            <p style="opacity: 0.8;">${item.description}</p>
          </div>
          <div style="width: 20px; display: flex; flex-direction: column; align-items: center;">
            <div style="width: 12px; height: 12px; background: ${textColor}; border-radius: 50%;"></div>
            <div style="flex: 1; width: 2px; background: ${textColor}; opacity: 0.3;"></div>
          </div>
          <div style="flex: 1;"></div>
        </div>`;
      }).join('');
      return `
    <section class="section timeline" style="background-color: ${bgColor}; color: ${textColor}; min-height: ${sectionHeight}; font-family: ${fontFamily}; padding: ${paddingY}px ${paddingX}px;">
      ${gradientHTML}
      <div class="content" style="max-width: 900px; margin: 0 auto;">
        <h2 style="${titleStyle}; text-align: center; margin-bottom: 3rem;">${section.title}</h2>
        ${section.description ? `<p style="${descStyle}; text-align: center; margin-bottom: 3rem; opacity: 0.8;">${section.description}</p>` : ''}
        <div class="timeline-container">
          ${timelineItemsHTML}
        </div>
        ${ctaButton}
      </div>
    </section>`;

    case LayoutType.CARDS:
      const cards = section.cards || [];
      const cardCols = section.cardsSettings?.columns || 3;
      const cardRadius = section.cardsSettings?.borderRadius || 12;
      const cardShadow = section.cardsSettings?.showShadow ? 'box-shadow: 0 4px 20px rgba(0,0,0,0.3);' : '';
      const cardsHTML = cards.map(card => `
        <div class="card" style="background: rgba(255,255,255,0.05); border-radius: ${cardRadius}px; overflow: hidden; ${cardShadow}">
          ${card.imageUrl ? `<img src="${card.imageUrl}" alt="${card.title}" style="width: 100%; height: 200px; object-fit: cover;" />` : ''}
          <div style="padding: 1.5rem;">
            <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">${card.title}</h3>
            <p style="opacity: 0.8; font-size: 0.9rem;">${card.description}</p>
            ${card.link ? `<a href="${card.link}" style="color: ${textColor}; display: inline-block; margin-top: 1rem; text-decoration: underline;">자세히 보기</a>` : ''}
          </div>
        </div>
      `).join('');
      return `
    <section class="section cards" style="background-color: ${bgColor}; color: ${textColor}; min-height: ${sectionHeight}; font-family: ${fontFamily}; padding: ${paddingY}px ${paddingX}px;">
      ${gradientHTML}
      <div class="content" style="max-width: 1200px; margin: 0 auto;">
        <h2 style="${titleStyle}; text-align: center; margin-bottom: 2rem;">${section.title}</h2>
        ${section.description ? `<p style="${descStyle}; text-align: center; margin-bottom: 3rem; opacity: 0.8;">${section.description}</p>` : ''}
        <div class="cards-grid" style="display: grid; grid-template-columns: repeat(${cardCols}, 1fr); gap: 2rem;">
          ${cardsHTML}
        </div>
        ${ctaButton}
      </div>
    </section>`;

    case LayoutType.QUOTE:
      const quoteText = section.quoteText || section.description || '';
      const quoteAuthor = section.quoteAuthor || '';
      const quoteStyle = section.quoteSettings?.quoteStyle || 'double';
      const authorPrefix = section.quoteSettings?.authorPrefix || '—';
      const quoteChar = quoteStyle === 'double' ? '"' : quoteStyle === 'single' ? "'" : '';
      return `
    <section class="section quote ${positionClasses}" style="background-color: ${bgColor}; color: ${textColor}; min-height: ${sectionHeight}; font-family: ${fontFamily}; padding: ${paddingY}px ${paddingX}px;">
      ${mediaHTML}
      <div class="overlay" style="opacity: ${overlayOpacity}; background-color: ${bgColor};"></div>
      ${gradientHTML}
      <div class="content" style="position: relative; z-index: 10; max-width: 900px; margin: 0 auto; text-align: center;">
        ${section.title ? `<h2 style="${titleStyle}; margin-bottom: 2rem;">${section.title}</h2>` : ''}
        <blockquote style="font-size: 2rem; font-style: italic; line-height: 1.6; ${textShadow}">
          ${quoteChar}${quoteText}${quoteChar}
        </blockquote>
        ${quoteAuthor ? `<cite style="display: block; margin-top: 1.5rem; font-size: 1.2rem; opacity: 0.8;">${authorPrefix} ${quoteAuthor}</cite>` : ''}
        ${ctaButton}
      </div>
    </section>`;

    case LayoutType.STATS:
      const stats = section.stats || [];
      const statCols = section.statsSettings?.columns || 3;
      const statsHTML = stats.map(stat => `
        <div class="stat-item" style="text-align: center; padding: 2rem;">
          <div style="font-size: 3rem; font-weight: bold; margin-bottom: 0.5rem;">${stat.value}</div>
          <div style="font-size: 1.2rem; opacity: 0.9;">${stat.label}</div>
          ${stat.description ? `<div style="font-size: 0.9rem; opacity: 0.6; margin-top: 0.5rem;">${stat.description}</div>` : ''}
        </div>
      `).join('');
      return `
    <section class="section stats" style="background-color: ${bgColor}; color: ${textColor}; min-height: ${sectionHeight}; font-family: ${fontFamily}; padding: ${paddingY}px ${paddingX}px;">
      ${gradientHTML}
      <div class="content" style="max-width: 1200px; margin: 0 auto;">
        ${section.title ? `<h2 style="${titleStyle}; text-align: center; margin-bottom: 3rem;">${section.title}</h2>` : ''}
        ${section.description ? `<p style="${descStyle}; text-align: center; margin-bottom: 3rem; opacity: 0.8;">${section.description}</p>` : ''}
        <div class="stats-grid" style="display: grid; grid-template-columns: repeat(${statCols}, 1fr); gap: 2rem;">
          ${statsHTML}
        </div>
        ${ctaButton}
      </div>
    </section>`;

    case LayoutType.VIDEO_HERO:
      const videoUrl = section.videoUrl || section.mediaUrl || '';
      const videoSettings = section.videoHeroSettings || { autoPlay: true, muted: true, loop: true };
      const fallbackImg = section.videoHeroSettings?.fallbackImageUrl || '';
      return `
    <section class="section video-hero ${positionClasses}" style="position: relative; color: ${textColor}; min-height: ${sectionHeight}; height: ${sectionHeight === 'auto' ? 'auto' : sectionHeight}; overflow: hidden;">
      <video class="bg-media" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; ${imageFilter}"
        ${videoSettings.autoPlay ? 'autoplay' : ''} ${videoSettings.muted ? 'muted' : ''} ${videoSettings.loop ? 'loop' : ''} playsinline
        ${fallbackImg ? `poster="${fallbackImg}"` : ''}>
        <source src="${videoUrl}" type="video/mp4" />
      </video>
      <div class="overlay" style="opacity: ${overlayOpacity}; background-color: ${bgColor};"></div>
      ${gradientHTML}
      <div class="content ${positionClasses}" style="position: relative; z-index: 10; ${contentStyle}">
        <h1 style="${titleStyle}">${section.title}</h1>
        <p style="${descStyle}">${section.description}</p>
        ${ctaButton}
      </div>
    </section>`;

    default:
      return '';
  }
};

// 전체 HTML 생성
export const generateHTML = async (
  sections: Section[],
  title: string = 'My Story',
  onProgress?: (progress: number) => void
): Promise<string> => {
  const totalSteps = sections.length + 1;
  let currentStep = 0;

  // 이미지를 Base64로 변환
  const sectionsWithBase64: { section: Section; mediaBase64: string }[] = [];

  for (const section of sections) {
    let mediaBase64 = '';
    if (section.mediaUrl && section.mediaType !== 'none') {
      mediaBase64 = await imageToBase64(section.mediaUrl);
    }
    sectionsWithBase64.push({ section, mediaBase64 });
    currentStep++;
    onProgress?.(Math.round((currentStep / totalSteps) * 100));
  }

  // HTML 조합
  const sectionsHTML = sectionsWithBase64
    .map(({ section, mediaBase64 }) => sectionToHTML(section, mediaBase64))
    .join('\n');

  onProgress?.(100);

  const currentYear = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${GOOGLE_FONTS_URL}" rel="stylesheet">
  <style>${CSS_STYLES}</style>
</head>
<body>
${sectionsHTML}

  <footer class="footer">
    <p>&copy; ${currentYear} Made with StoryFlow</p>
  </footer>

  <script>
    // Scroll Animation Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
  </script>
</body>
</html>`;
};

// HTML 파일 다운로드
export const downloadHTML = (html: string, filename: string = 'my-story.html') => {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// 내보내기 실행 (진행 상태 콜백 지원)
export const exportToHTML = async (
  sections: Section[],
  title?: string,
  onProgress?: (progress: number) => void
): Promise<void> => {
  const html = await generateHTML(sections, title, onProgress);
  downloadHTML(html, `${title || 'my-story'}.html`);
};
