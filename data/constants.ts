// Google Fonts 목록
export const GOOGLE_FONTS = [
  { name: '기본 (System)', value: 'system-ui, -apple-system, sans-serif' },
  { name: 'Noto Sans KR', value: "'Noto Sans KR', sans-serif" },
  { name: 'Noto Serif KR', value: "'Noto Serif KR', serif" },
  { name: 'Pretendard', value: "'Pretendard', sans-serif" },
  { name: 'Gowun Dodum', value: "'Gowun Dodum', sans-serif" },
  { name: 'Gowun Batang', value: "'Gowun Batang', serif" },
  { name: 'IBM Plex Sans KR', value: "'IBM Plex Sans KR', sans-serif" },
  { name: 'Nanum Gothic', value: "'Nanum Gothic', sans-serif" },
  { name: 'Nanum Myeongjo', value: "'Nanum Myeongjo', serif" },
  { name: 'Nanum Pen Script', value: "'Nanum Pen Script', cursive" },
  { name: 'Black Han Sans', value: "'Black Han Sans', sans-serif" },
  { name: 'Do Hyeon', value: "'Do Hyeon', sans-serif" },
  { name: 'Jua', value: "'Jua', sans-serif" },
  { name: 'Gaegu', value: "'Gaegu', cursive" },
  { name: 'Poor Story', value: "'Poor Story', cursive" },
];

// Google Fonts URL
export const GOOGLE_FONTS_URL = 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&family=Noto+Serif+KR:wght@400;700&family=Gowun+Dodum&family=Gowun+Batang&family=IBM+Plex+Sans+KR:wght@400;500;700&family=Nanum+Gothic:wght@400;700&family=Nanum+Myeongjo:wght@400;700&family=Nanum+Pen+Script&family=Black+Han+Sans&family=Do+Hyeon&family=Jua&family=Gaegu&family=Poor+Story&family=Pretendard:wght@400;500;600;700&display=swap';

// 이미지 필터 프리셋
export const IMAGE_FILTERS = [
  { name: '없음', value: 'none' },
  { name: '흑백', value: 'grayscale' },
  { name: '세피아', value: 'sepia' },
  { name: '블러', value: 'blur' },
  { name: '밝게', value: 'brightness' },
  { name: '대비', value: 'contrast' },
  { name: '채도', value: 'saturate' },
] as const;

// 애니메이션 프리셋
export const ANIMATIONS = [
  { name: '없음', value: 'none' },
  { name: '페이드 인', value: 'fade-in' },
  { name: '아래에서 위로', value: 'slide-up' },
  { name: '위에서 아래로', value: 'slide-down' },
  { name: '왼쪽에서', value: 'slide-left' },
  { name: '오른쪽에서', value: 'slide-right' },
  { name: '확대', value: 'zoom-in' },
  { name: '축소', value: 'zoom-out' },
] as const;

// 그라데이션 방향
export const GRADIENT_DIRECTIONS = [
  { name: '위에서 아래', value: 'to-bottom' },
  { name: '아래에서 위', value: 'to-top' },
  { name: '왼쪽에서 오른쪽', value: 'to-right' },
  { name: '오른쪽에서 왼쪽', value: 'to-left' },
  { name: '대각선 ↘', value: 'to-bottom-right' },
  { name: '대각선 ↙', value: 'to-bottom-left' },
] as const;

// 섹션 높이 옵션
export const SECTION_HEIGHTS = [
  { name: '전체 화면', value: '100vh' },
  { name: '3/4 화면', value: '75vh' },
  { name: '1/2 화면', value: '50vh' },
  { name: '자동', value: 'auto' },
] as const;

// 버튼 스타일
export const BUTTON_STYLES = [
  { name: '채움', value: 'solid' },
  { name: '윤곽선', value: 'outline' },
  { name: '투명', value: 'ghost' },
] as const;

// 버튼 크기
export const BUTTON_SIZES = [
  { name: '작게', value: 'small' },
  { name: '보통', value: 'medium' },
  { name: '크게', value: 'large' },
] as const;

// 기본값
export const DEFAULT_SECTION_VALUES = {
  fontFamily: 'system-ui, -apple-system, sans-serif',
  titleFontSize: 48,
  descriptionFontSize: 18,
  textShadow: {
    enabled: false,
    color: '#000000',
    blur: 4,
    offsetX: 2,
    offsetY: 2,
  },
  textVerticalPosition: 'center' as const,
  textHorizontalPosition: 'center' as const,
  sectionHeight: '100vh' as const,
  paddingX: 24,
  paddingY: 24,
  imageFilter: 'none' as const,
  imageFilterIntensity: 100,
  imageRotation: 0,
  imageBrightness: 0,
  imageContrast: 0,
  gradientOverlay: {
    enabled: false,
    startColor: '#000000',
    endColor: 'transparent',
    direction: 'to-bottom' as const,
    opacity: 0.5,
  },
  animation: 'fade-in' as const,
  animationDuration: 0.8,
  animationDelay: 0,
  ctaButton: {
    enabled: false,
    text: '자세히 보기',
    link: '#',
    style: 'solid' as const,
    color: '#ffffff',
    size: 'medium' as const,
  },
};
