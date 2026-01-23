import { Section, LayoutType } from '../types';
import { GOOGLE_FONTS_URL } from '../data/constants';
// html2canvas, jsPDF는 동적 import로 번들 크기 최적화 (bundle-dynamic-imports)
// 사용 시점에만 로드됨

// 이미지 URL을 Base64로 변환 (blob, http, https 모두 지원)
const imageToBase64 = async (imageUrl: string): Promise<string> => {
  try {
    // 이미 Base64인 경우 그대로 반환
    if (imageUrl.startsWith('data:')) {
      return imageUrl;
    }

    // blob URL 또는 외부 URL 처리
    const response = await fetch(imageUrl, {
      mode: 'cors',
      credentials: 'omit',
    });

    if (!response.ok) {
      console.error('이미지 fetch 실패:', response.status, imageUrl);
      return '';
    }

    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('이미지 변환 실패:', imageUrl, error);
    // 변환 실패 시 원본 URL 반환 (외부 이미지는 그대로 사용)
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
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

  const imageAltText = section.imageAlt || section.title || '섹션 이미지';
  const mediaHTML = mediaBase64
    ? section.mediaType === 'video'
      ? `<video class="bg-media" style="${imageFilter}" src="${mediaBase64}" autoplay muted loop playsinline aria-label="${imageAltText}"></video>`
      : `<img class="bg-media" style="${imageFilter}" src="${mediaBase64}" alt="${imageAltText}" />`
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

    case LayoutType.CAROUSEL:
      const carouselImages = section.carouselImages || [];
      const carouselSettings = section.carouselSettings || {
        autoPlay: true,
        autoPlayInterval: 5000,
        showArrows: true,
        showDots: true,
        transition: 'slide',
        transitionDuration: 500,
        pauseOnHover: true,
        loop: true
      };
      const carouselId = `carousel-${section.id}`;

      if (carouselImages.length === 0) {
        return `
    <section class="section carousel" style="background-color: ${bgColor}; color: ${textColor}; min-height: ${sectionHeight}; display: flex; align-items: center; justify-content: center;">
      <div style="text-align: center; opacity: 0.5;">
        <p style="font-size: 1.2rem;">캐러셀에 이미지를 추가하세요</p>
      </div>
    </section>`;
      }

      const carouselSlidesHTML = carouselImages.map((img, idx) => `
        <div class="carousel-slide" data-index="${idx}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; ${carouselSettings.transition === 'fade'
          ? `opacity: ${idx === 0 ? 1 : 0}; transition: opacity ${carouselSettings.transitionDuration}ms ease-in-out;`
          : `transform: translateX(${idx * 100}%); transition: transform ${carouselSettings.transitionDuration}ms ease-in-out;`
        }">
          ${img.url ? `<img src="${img.url}" alt="${img.title || `슬라이드 ${idx + 1}`}" style="width: 100%; height: 100%; object-fit: cover;" />` : '<div style="width: 100%; height: 100%; background: #333;"></div>'}
          <div style="position: absolute; inset: 0; background-color: ${bgColor}; opacity: ${overlayOpacity};"></div>
        </div>
      `).join('');

      const carouselTextHTML = carouselImages.map((img, idx) => `
        <div class="carousel-text" data-index="${idx}" style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; z-index: 10; opacity: ${idx === 0 ? 1 : 0}; transition: opacity ${carouselSettings.transitionDuration}ms ease-in-out; pointer-events: none;">
          ${img.title ? `<h2 style="${titleStyle}; text-align: center;">${img.title}</h2>` : ''}
          ${img.description ? `<p style="${descStyle}; text-align: center; max-width: 600px; margin-top: 1rem;">${img.description}</p>` : ''}
          ${img.link ? `<a href="${img.link}" target="_blank" rel="noopener noreferrer" style="margin-top: 1.5rem; padding: 0.75rem 1.5rem; background: #fff; color: #000; border-radius: 9999px; text-decoration: none; font-weight: 500; pointer-events: auto;">자세히 보기</a>` : ''}
        </div>
      `).join('');

      const arrowsHTML = carouselSettings.showArrows && carouselImages.length > 1 ? `
        <button class="carousel-arrow carousel-prev" onclick="carouselPrev('${carouselId}')" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); z-index: 20; padding: 0.75rem; background: rgba(0,0,0,0.5); color: #fff; border: none; border-radius: 50%; cursor: pointer; transition: background 0.3s;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <button class="carousel-arrow carousel-next" onclick="carouselNext('${carouselId}')" style="position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); z-index: 20; padding: 0.75rem; background: rgba(0,0,0,0.5); color: #fff; border: none; border-radius: 50%; cursor: pointer; transition: background 0.3s;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      ` : '';

      const dotsHTML = carouselSettings.showDots && carouselImages.length > 1 ? `
        <div class="carousel-dots" style="position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); z-index: 20; display: flex; gap: 0.5rem;">
          ${carouselImages.map((_, idx) => `
            <button onclick="carouselGoTo('${carouselId}', ${idx})" style="width: 0.75rem; height: 0.75rem; border-radius: 50%; border: none; cursor: pointer; transition: all 0.3s; background: ${idx === 0 ? '#fff' : 'rgba(255,255,255,0.5)'}; transform: ${idx === 0 ? 'scale(1.1)' : 'scale(1)'};" data-dot="${idx}"></button>
          `).join('')}
        </div>
      ` : '';

      return `
    <section id="${carouselId}" class="section carousel" style="position: relative; background-color: ${bgColor}; color: ${textColor}; min-height: ${sectionHeight}; height: ${sectionHeight === 'auto' ? 'auto' : sectionHeight}; overflow: hidden;"
      data-autoplay="${carouselSettings.autoPlay}"
      data-interval="${carouselSettings.autoPlayInterval}"
      data-transition="${carouselSettings.transition}"
      data-duration="${carouselSettings.transitionDuration}"
      data-pause-on-hover="${carouselSettings.pauseOnHover}"
      data-loop="${carouselSettings.loop}"
      data-total="${carouselImages.length}"
      data-current="0"
      ${carouselSettings.pauseOnHover ? 'onmouseenter="carouselPause(this.id)" onmouseleave="carouselResume(this.id)"' : ''}>
      <div class="carousel-slides" style="position: relative; width: 100%; height: 100%; min-height: ${sectionHeight};">
        ${carouselSlidesHTML}
        ${carouselTextHTML}
      </div>
      ${arrowsHTML}
      ${dotsHTML}
      ${section.title && carouselImages.every(img => !img.title) ? `
      <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 10; pointer-events: none;">
        <h2 style="${titleStyle}; text-align: center;">${section.title}</h2>
      </div>
      ` : ''}
    </section>`;

    default:
      return '';
  }
};

// 전체 HTML 생성
export const generateHTML = async (
  sections: Section[],
  title: string = 'My Story',
  onProgress?: (progress: number) => void,
  options?: { removeBranding?: boolean }
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

    // 갤러리 이미지 Base64 변환
    let updatedSection = { ...section };
    if (section.galleryImages && section.galleryImages.length > 0) {
      const galleryWithBase64 = await Promise.all(
        section.galleryImages.map(async (img) => ({
          ...img,
          url: img.url ? await imageToBase64(img.url) : '',
        }))
      );
      updatedSection = { ...updatedSection, galleryImages: galleryWithBase64 };
    }

    // 카드 이미지 Base64 변환
    if (section.cards && section.cards.length > 0) {
      const cardsWithBase64 = await Promise.all(
        section.cards.map(async (card) => ({
          ...card,
          imageUrl: card.imageUrl ? await imageToBase64(card.imageUrl) : undefined,
        }))
      );
      updatedSection = { ...updatedSection, cards: cardsWithBase64 };
    }

    // 캐러셀 이미지 Base64 변환
    if (section.carouselImages && section.carouselImages.length > 0) {
      const carouselWithBase64 = await Promise.all(
        section.carouselImages.map(async (img) => ({
          ...img,
          url: img.url ? await imageToBase64(img.url) : '',
        }))
      );
      updatedSection = { ...updatedSection, carouselImages: carouselWithBase64 };
    }

    sectionsWithBase64.push({ section: updatedSection, mediaBase64 });
    currentStep++;
    onProgress?.(Math.round((currentStep / totalSteps) * 100));
  }

  // HTML 조합
  const sectionsHTML = sectionsWithBase64
    .map(({ section, mediaBase64 }) => sectionToHTML(section, mediaBase64))
    .join('\n');

  onProgress?.(100);

  const currentYear = new Date().getFullYear();

  // 소셜 미디어 메타데이터 생성
  const firstSection = sections[0];
  const ogTitle = title || firstSection?.title || 'My Story';
  const ogDescription = firstSection?.description || '스토리플로우로 만든 아름다운 웹페이지';
  const ogImage = sectionsWithBase64[0]?.mediaBase64 || '';
  const ogUrl = typeof window !== 'undefined' ? window.location.href : '';

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>

  <!-- Primary Meta Tags -->
  <meta name="title" content="${ogTitle}">
  <meta name="description" content="${ogDescription}">
  <meta name="author" content="StoryFlow">
  <meta name="generator" content="StoryFlow Creator">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${ogUrl}">
  <meta property="og:title" content="${ogTitle}">
  <meta property="og:description" content="${ogDescription}">
  ${ogImage ? `<meta property="og:image" content="${ogImage}">` : ''}
  <meta property="og:site_name" content="StoryFlow">
  <meta property="og:locale" content="ko_KR">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${ogTitle}">
  <meta name="twitter:description" content="${ogDescription}">
  ${ogImage ? `<meta name="twitter:image" content="${ogImage}">` : ''}

  <!-- Additional SEO -->
  <meta name="robots" content="index, follow">
  <meta name="theme-color" content="#000000">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${GOOGLE_FONTS_URL}" rel="stylesheet">
  <style>${CSS_STYLES}</style>
</head>
<body>
${sectionsHTML}

  ${options?.removeBranding ? '' : `<footer class="footer">
    <p>&copy; ${currentYear} Made with StoryFlow</p>
  </footer>`}

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

    // Carousel Functions
    const carouselIntervals = {};

    function updateCarousel(carouselId, newIndex) {
      const carousel = document.getElementById(carouselId);
      if (!carousel) return;

      const total = parseInt(carousel.dataset.total);
      const transition = carousel.dataset.transition;
      const current = parseInt(carousel.dataset.current);

      // Handle loop
      if (newIndex < 0) newIndex = carousel.dataset.loop === 'true' ? total - 1 : 0;
      if (newIndex >= total) newIndex = carousel.dataset.loop === 'true' ? 0 : total - 1;

      carousel.dataset.current = newIndex;

      // Update slides
      const slides = carousel.querySelectorAll('.carousel-slide');
      const texts = carousel.querySelectorAll('.carousel-text');

      slides.forEach((slide, idx) => {
        if (transition === 'fade') {
          slide.style.opacity = idx === newIndex ? '1' : '0';
        } else {
          slide.style.transform = 'translateX(' + ((idx - newIndex) * 100) + '%)';
        }
      });

      texts.forEach((text, idx) => {
        text.style.opacity = idx === newIndex ? '1' : '0';
      });

      // Update dots
      const dots = carousel.querySelectorAll('.carousel-dots button');
      dots.forEach((dot, idx) => {
        dot.style.background = idx === newIndex ? '#fff' : 'rgba(255,255,255,0.5)';
        dot.style.transform = idx === newIndex ? 'scale(1.1)' : 'scale(1)';
      });
    }

    function carouselNext(carouselId) {
      const carousel = document.getElementById(carouselId);
      if (!carousel) return;
      const current = parseInt(carousel.dataset.current);
      updateCarousel(carouselId, current + 1);
    }

    function carouselPrev(carouselId) {
      const carousel = document.getElementById(carouselId);
      if (!carousel) return;
      const current = parseInt(carousel.dataset.current);
      updateCarousel(carouselId, current - 1);
    }

    function carouselGoTo(carouselId, index) {
      updateCarousel(carouselId, index);
    }

    function carouselPause(carouselId) {
      if (carouselIntervals[carouselId]) {
        clearInterval(carouselIntervals[carouselId]);
        carouselIntervals[carouselId] = null;
      }
    }

    function carouselResume(carouselId) {
      const carousel = document.getElementById(carouselId);
      if (!carousel || carousel.dataset.autoplay !== 'true') return;
      const interval = parseInt(carousel.dataset.interval);
      carouselIntervals[carouselId] = setInterval(() => carouselNext(carouselId), interval);
    }

    // Initialize all carousels
    document.querySelectorAll('.section.carousel').forEach(carousel => {
      if (carousel.dataset.autoplay === 'true') {
        const interval = parseInt(carousel.dataset.interval);
        carouselIntervals[carousel.id] = setInterval(() => carouselNext(carousel.id), interval);
      }
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

// blob URL이 포함된 섹션이 있는지 확인
export const hasBlobUrls = (sections: Section[]): boolean => {
  return sections.some(section => {
    // 메인 미디어 URL 체크
    if (section.mediaUrl?.startsWith('blob:')) return true;
    if (section.videoUrl?.startsWith('blob:')) return true;

    // Gallery 이미지 체크
    if (section.galleryImages?.some(img => img.url?.startsWith('blob:'))) return true;

    // Card 이미지 체크
    if (section.cards?.some(card => card.imageUrl?.startsWith('blob:'))) return true;

    // Carousel 이미지 체크
    if (section.carouselImages?.some(img => img.url?.startsWith('blob:'))) return true;

    return false;
  });
};

// 내보내기 실행 (진행 상태 콜백 지원)
export const exportToHTML = async (
  sections: Section[],
  title?: string,
  onProgress?: (progress: number) => void,
  options?: { removeBranding?: boolean }
): Promise<void> => {
  const html = await generateHTML(sections, title, onProgress, options);
  downloadHTML(html, `${title || 'my-story'}.html`);
};
// ========== PDF 및 이미지 내보내기 ==========

// html2canvas에서 oklch 색상 오류를 방지하기 위한 onclone 콜백
const removeOklchStyles = (clonedDoc: Document): void => {
  // 클론된 문서의 모든 스타일시트에서 oklch 관련 규칙 제거
  try {
    const styleSheets = clonedDoc.styleSheets;
    for (let i = 0; i < styleSheets.length; i++) {
      try {
        const sheet = styleSheets[i];
        const rules = sheet.cssRules || sheet.rules;
        if (!rules) continue;

        // 역순으로 순회하여 규칙 삭제
        for (let j = rules.length - 1; j >= 0; j--) {
          const rule = rules[j];
          if (rule.cssText && rule.cssText.includes('oklch')) {
            sheet.deleteRule(j);
          }
        }
      } catch {
        // CORS 제한으로 접근 불가한 스타일시트 무시
        continue;
      }
    }
  } catch {
    // 스타일시트 접근 오류 무시
  }

  // 모든 요소의 인라인 스타일에서 oklch 제거
  const allElements = clonedDoc.querySelectorAll('*');
  allElements.forEach(el => {
    if (el instanceof HTMLElement && el.style.cssText.includes('oklch')) {
      // oklch가 포함된 스타일 속성 제거
      el.style.cssText = el.style.cssText.replace(/[^;]*oklch[^;]*/gi, '');
    }
  });
};

// html2canvas 공통 옵션
const getHtml2CanvasOptions = (backgroundColor: string | null = '#000000') => ({
  scale: 2,
  useCORS: true,
  allowTaint: true,
  backgroundColor,
  logging: false,
  onclone: (clonedDoc: Document, _element: HTMLElement) => {
    removeOklchStyles(clonedDoc);
  }
});

// PDF로 내보내기 (동적 import로 번들 최적화)
export const exportToPDF = async (
  element: HTMLElement,
  filename: string = 'storyflow-page.pdf',
  onProgress?: (progress: number) => void
): Promise<void> => {
  try {
    onProgress?.(5);

    // html2canvas와 jsPDF를 동적으로 로드 (bundle-dynamic-imports)
    const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
      import('html2canvas'),
      import('jspdf')
    ]);

    onProgress?.(10);

    // html2canvas로 요소를 캡처 (oklch 색상 제거 포함)
    const canvas = await html2canvas(element, getHtml2CanvasOptions('#000000'));

    onProgress?.(60);

    // 캔버스 크기 계산
    const imgWidth = 210; // A4 너비 (mm)
    const pageHeight = 297; // A4 높이 (mm)
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    onProgress?.(80);

    // jsPDF로 PDF 생성
    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 0;

    // 첫 페이지
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // 여러 페이지로 분할
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    onProgress?.(90);

    // PDF 다운로드
    pdf.save(filename);

    onProgress?.(100);
  } catch (error) {
    console.error('PDF 내보내기 실패:', error);
    throw new Error('PDF 생성에 실패했습니다.');
  }
};

// 전체 페이지를 이미지로 내보내기 (동적 import로 번들 최적화)
export const exportToImage = async (
  element: HTMLElement,
  filename: string = 'storyflow-page.png',
  format: 'png' | 'jpeg' = 'png',
  onProgress?: (progress: number) => void
): Promise<void> => {
  try {
    onProgress?.(10);

    // html2canvas를 동적으로 로드 (bundle-dynamic-imports)
    const { default: html2canvas } = await import('html2canvas');

    onProgress?.(20);

    // html2canvas로 요소를 캡처 (oklch 색상 제거 포함)
    const canvas = await html2canvas(element, getHtml2CanvasOptions(format === 'jpeg' ? '#000000' : null));

    onProgress?.(80);

    // 캔버스를 Blob으로 변환 후 다운로드
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('이미지 생성에 실패했습니다.');
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      onProgress?.(100);
    }, `image/${format}`, format === 'jpeg' ? 0.95 : 1.0);
  } catch (error) {
    console.error('이미지 내보내기 실패:', error);
    throw new Error('이미지 생성에 실패했습니다.');
  }
};

// 각 섹션을 개별 이미지로 내보내기 (동적 import로 번들 최적화)
export const exportSectionsAsImages = async (
  sectionElements: HTMLElement[],
  baseFilename: string = 'section',
  format: 'png' | 'jpeg' = 'png',
  onProgress?: (progress: number, sectionIndex: number) => void
): Promise<void> => {
  try {
    // html2canvas를 동적으로 로드 (bundle-dynamic-imports)
    const { default: html2canvas } = await import('html2canvas');

    for (let i = 0; i < sectionElements.length; i++) {
      const element = sectionElements[i];

      // html2canvas로 요소를 캡처 (oklch 색상 제거 포함)
      const canvas = await html2canvas(element, getHtml2CanvasOptions(format === 'jpeg' ? '#000000' : null));

      const filename = `${baseFilename}-${i + 1}.${format}`;

      await new Promise<void>((resolve) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            console.error(`섹션 ${i + 1} 이미지 생성 실패`);
            resolve();
            return;
          }

          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          resolve();
        }, `image/${format}`, format === 'jpeg' ? 0.95 : 1.0);
      });

      const progress = Math.round(((i + 1) / sectionElements.length) * 100);
      onProgress?.(progress, i);

      // 다운로드 간 짧은 딜레이 (브라우저가 여러 다운로드를 처리할 시간)
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  } catch (error) {
    console.error('섹션 이미지 내보내기 실패:', error);
    throw new Error('섹션 이미지 생성에 실패했습니다.');
  }
};

// 썸네일 이미지 생성 (미리보기용, 동적 import로 번들 최적화)
export const generateThumbnail = async (
  element: HTMLElement,
  maxWidth: number = 400,
  maxHeight: number = 300
): Promise<string> => {
  try {
    // html2canvas를 동적으로 로드 (bundle-dynamic-imports)
    const { default: html2canvas } = await import('html2canvas');

    const canvas = await html2canvas(element, {
      scale: 1,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#000000',
      logging: false,
      width: Math.min(element.scrollWidth, 1920),
      height: Math.min(element.scrollHeight, 1080),
    });

    // 썸네일 크기 계산 (비율 유지)
    const aspectRatio = canvas.width / canvas.height;
    let thumbWidth = maxWidth;
    let thumbHeight = maxHeight;

    if (aspectRatio > maxWidth / maxHeight) {
      thumbHeight = thumbWidth / aspectRatio;
    } else {
      thumbWidth = thumbHeight * aspectRatio;
    }

    // 리사이즈된 캔버스 생성
    const thumbCanvas = document.createElement('canvas');
    thumbCanvas.width = thumbWidth;
    thumbCanvas.height = thumbHeight;
    const ctx = thumbCanvas.getContext('2d');

    if (!ctx) {
      throw new Error('캔버스 컨텍스트를 가져올 수 없습니다.');
    }

    ctx.drawImage(canvas, 0, 0, thumbWidth, thumbHeight);

    return thumbCanvas.toDataURL('image/jpeg', 0.8);
  } catch (error) {
    console.error('썸네일 생성 실패:', error);
    return '';
  }
};
