export enum LayoutType {
  // 기존 레이아웃
  HERO = 'hero',
  SPLIT_LEFT = 'split_left',
  SPLIT_RIGHT = 'split_right',
  FULL_IMAGE_TEXT_OVERLAY = 'full_image_overlay',
  SIMPLE_TEXT = 'simple_text',
  // 신규 레이아웃 (Phase 1 MVP)
  GALLERY = 'gallery',
  TIMELINE = 'timeline',
  CARDS = 'cards',
  QUOTE = 'quote',
  STATS = 'stats',
  VIDEO_HERO = 'video_hero',
  CAROUSEL = 'carousel',
  MASONRY = 'masonry',
  GUESTBOOK = 'guestbook',
  AUDIO = 'audio',
}

export type TextAlignment = 'left' | 'center' | 'right';
export type TextVerticalPosition = 'top' | 'center' | 'bottom';
export type TextHorizontalPosition = 'left' | 'center' | 'right';
export type SectionHeight = '100vh' | '75vh' | '50vh' | 'auto';
export type ImageFilter = 'none' | 'grayscale' | 'sepia' | 'blur' | 'brightness' | 'contrast' | 'saturate';
export type AnimationType = 'none' | 'fade-in' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'zoom-in' | 'zoom-out';

export interface GradientOverlay {
  enabled: boolean;
  startColor: string;
  endColor: string;
  direction: 'to-bottom' | 'to-top' | 'to-right' | 'to-left' | 'to-bottom-right' | 'to-bottom-left';
  opacity: number;
}

export interface CTAButton {
  enabled: boolean;
  text: string;
  link: string;
  style: 'solid' | 'outline' | 'ghost';
  color: string;
  size: 'small' | 'medium' | 'large';
}

export interface TextShadow {
  enabled: boolean;
  color: string;
  blur: number;
  offsetX: number;
  offsetY: number;
}

// ========== 신규 레이아웃 데이터 타입 (Phase 1 MVP) ==========

/** Gallery 레이아웃 - 이미지 그리드 */
export interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
}

export interface GallerySettings {
  columns: 2 | 3 | 4;
  gap: number;
  showCaptions: boolean;
}

/** Timeline 레이아웃 - 시간순 스토리 */
export interface TimelineItem {
  id: string;
  date: string;
  title: string;
  description: string;
  imageUrl?: string;
  icon?: string;
}

export type TimelineAlignment = 'alternate' | 'left' | 'right';

/** Cards 레이아웃 - 카드형 나열 */
export interface CardItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  link?: string;
}

export interface CardsSettings {
  columns: 2 | 3 | 4;
  borderRadius: number;
  showShadow: boolean;
  hoverEffect: boolean;
}

/** Quote 레이아웃 - 인용문 강조 */
export interface QuoteSettings {
  quoteStyle: 'double' | 'single' | 'none';
  authorPrefix: string;
}

/** Stats 레이아웃 - 숫자/통계 강조 */
export interface StatItem {
  id: string;
  value: string;
  label: string;
  description?: string;
  icon?: string;
}

export interface StatsSettings {
  columns: 2 | 3 | 4;
  animateNumbers: boolean;
}

/** Video Hero 레이아웃 - 비디오 배경 */
export interface VideoHeroSettings {
  autoPlay: boolean;
  muted: boolean;
  loop: boolean;
  fallbackImageUrl?: string;
}

/** Carousel 레이아웃 - 이미지 슬라이더 */
export interface CarouselImage {
  id: string;
  url: string;
  title?: string;
  description?: string;
  link?: string;
}

export interface CarouselSettings {
  autoPlay: boolean;
  autoPlayInterval: number; // 밀리초 (기본 5000)
  showArrows: boolean;
  showDots: boolean;
  transition: 'slide' | 'fade';
  transitionDuration: number; // 밀리초 (기본 500)
  pauseOnHover: boolean;
  loop: boolean;
}

/** Masonry 레이아웃 - Pinterest 스타일 불규칙 그리드 */
export interface MasonryImage {
  id: string;
  url: string;
  caption?: string;
  link?: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'auto';
}

export interface MasonrySettings {
  columns: 2 | 3 | 4 | 5;
  gap: number;
  showCaptions: boolean;
  hoverEffect: boolean;
  rounded: boolean;
}

// Guestbook (방명록)
export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  timestamp: string;
  avatar?: string; // 프로필 이미지 URL (선택)
}

export interface GuestbookSettings {
  maxEntries: number; // 최대 표시 개수
  showTimestamp: boolean; // 작성 시간 표시 여부
  requireName: boolean; // 이름 필수 여부
  allowAnonymous: boolean; // 익명 허용 여부
  sortOrder: 'newest' | 'oldest'; // 정렬 순서
  cardStyle: 'default' | 'minimal' | 'bordered'; // 카드 스타일
  columns: 1 | 2 | 3; // 컬럼 수
}

// Audio (오디오 플레이어)
export interface AudioSettings {
  autoPlay: boolean; // 자동 재생
  loop: boolean; // 반복 재생
  showPlaylist: boolean; // 플레이리스트 표시
  playerStyle: 'minimal' | 'full' | 'waveform'; // 플레이어 스타일
  volume: number; // 기본 볼륨 (0-100)
}

export interface AudioTrack {
  id: string;
  title: string;
  artist?: string;
  url: string;
  duration?: string; // "3:45" 형식
  coverImage?: string; // 앨범 커버
}

// ========== Section 인터페이스 ==========

export interface Section {
  id: string;
  layout: LayoutType;
  title: string;
  description: string;
  mediaUrl?: string;
  mediaType: 'image' | 'video' | 'none';
  imageAlt?: string; // 접근성: 이미지 대체 텍스트
  backgroundColor?: string;
  textColor?: string;
  textAlignment?: TextAlignment;
  splitRatio?: number;
  overlayOpacity?: number;

  // Typography
  fontFamily?: string;
  titleFontSize?: number;
  descriptionFontSize?: number;
  textShadow?: TextShadow;

  // Text Position (9-way)
  textVerticalPosition?: TextVerticalPosition;
  textHorizontalPosition?: TextHorizontalPosition;

  // Section Size
  sectionHeight?: SectionHeight;
  paddingX?: number;
  paddingY?: number;

  // Image Effects
  imageFilter?: ImageFilter;
  imageFilterIntensity?: number;
  imageRotation?: number; // 0, 90, 180, 270
  imageBrightness?: number; // -100 ~ 100
  imageContrast?: number; // -100 ~ 100

  // Gradient Overlay
  gradientOverlay?: GradientOverlay;

  // Animation
  animation?: AnimationType;
  animationDuration?: number;
  animationDelay?: number;

  // CTA Button
  ctaButton?: CTAButton;

  // ========== 신규 레이아웃 전용 필드 ==========

  // Gallery 레이아웃
  galleryImages?: GalleryImage[];
  gallerySettings?: GallerySettings;

  // Timeline 레이아웃
  timelineItems?: TimelineItem[];
  timelineAlignment?: TimelineAlignment;

  // Cards 레이아웃
  cards?: CardItem[];
  cardsSettings?: CardsSettings;

  // Quote 레이아웃
  quoteText?: string;
  quoteAuthor?: string;
  quoteSettings?: QuoteSettings;

  // Stats 레이아웃
  stats?: StatItem[];
  statsSettings?: StatsSettings;

  // Video Hero 레이아웃
  videoUrl?: string;
  videoHeroSettings?: VideoHeroSettings;

  // Carousel 레이아웃
  carouselImages?: CarouselImage[];
  carouselSettings?: CarouselSettings;

  // Masonry 레이아웃
  masonryImages?: MasonryImage[];
  masonrySettings?: MasonrySettings;

  // Guestbook 레이아웃
  guestbookEntries?: GuestbookEntry[];
  guestbookSettings?: GuestbookSettings;

  // Audio 레이아웃
  audioTracks?: AudioTrack[];
  audioSettings?: AudioSettings;
}

// 배경음악 설정
export interface BackgroundMusic {
  enabled: boolean;
  url: string;
  volume: number; // 0-100
  loop: boolean;
}

export interface ProjectState {
  title: string;
  sections: Section[];
  bgm?: BackgroundMusic; // 배경음악 (선택)
}