// Google Fonts 목록
export const GOOGLE_FONTS = [
  // 시스템 폰트
  { name: '기본 시스템 폰트', value: 'system-ui, -apple-system, sans-serif', category: 'system' },

  // 한글 - 고딕체 (산세리프)
  { name: '노토 산스', value: "'Noto Sans KR', sans-serif", category: 'korean-sans' },
  { name: '프리텐다드', value: "'Pretendard', sans-serif", category: 'korean-sans' },
  { name: '스포카 한 산스', value: "'Spoqa Han Sans Neo', sans-serif", category: 'korean-sans' },
  { name: 'IBM 플렉스 산스', value: "'IBM Plex Sans KR', sans-serif", category: 'korean-sans' },
  { name: '나눔고딕', value: "'Nanum Gothic', sans-serif", category: 'korean-sans' },
  { name: '고운돋움', value: "'Gowun Dodum', sans-serif", category: 'korean-sans' },
  { name: '고딕 A1', value: "'Gothic A1', sans-serif", category: 'korean-sans' },
  { name: '함렛', value: "'Hahmlet', serif", category: 'korean-sans' },

  // 한글 - 명조체 (세리프)
  { name: '노토 세리프', value: "'Noto Serif KR', serif", category: 'korean-serif' },
  { name: '나눔명조', value: "'Nanum Myeongjo', serif", category: 'korean-serif' },
  { name: '고운바탕', value: "'Gowun Batang', serif", category: 'korean-serif' },
  { name: '마루부리', value: "'Maruburi', serif", category: 'korean-serif' },

  // 한글 - 디스플레이/타이틀
  { name: '검은고딕', value: "'Black Han Sans', sans-serif", category: 'korean-display' },
  { name: '도현', value: "'Do Hyeon', sans-serif", category: 'korean-display' },
  { name: '주아', value: "'Jua', sans-serif", category: 'korean-display' },
  { name: '해바라기', value: "'Sunflower', sans-serif", category: 'korean-display' },
  { name: '싱글데이', value: "'Single Day', cursive", category: 'korean-display' },
  { name: '독도', value: "'Dokdo', cursive", category: 'korean-display' },
  { name: '동해독도', value: "'East Sea Dokdo', cursive", category: 'korean-display' },
  { name: '감자꽃', value: "'Gamja Flower', cursive", category: 'korean-display' },
  { name: '하이멜로디', value: "'Hi Melody', cursive", category: 'korean-display' },

  // 한글 - 손글씨/필기체
  { name: '나눔손글씨 펜', value: "'Nanum Pen Script', cursive", category: 'korean-handwriting' },
  { name: '개구', value: "'Gaegu', cursive", category: 'korean-handwriting' },
  { name: '푸어스토리', value: "'Poor Story', cursive", category: 'korean-handwriting' },
  { name: '스타일리쉬', value: "'Stylish', sans-serif", category: 'korean-handwriting' },
  { name: '귀여운 폰트', value: "'Cute Font', cursive", category: 'korean-handwriting' },
  { name: '구기', value: "'Gugi', sans-serif", category: 'korean-handwriting' },
  { name: '송명', value: "'Song Myung', serif", category: 'korean-handwriting' },

  // 영문 - 고딕 (산세리프)
  { name: 'Inter', value: "'Inter', sans-serif", category: 'english-sans' },
  { name: 'Roboto', value: "'Roboto', sans-serif", category: 'english-sans' },
  { name: 'Open Sans', value: "'Open Sans', sans-serif", category: 'english-sans' },
  { name: 'Montserrat', value: "'Montserrat', sans-serif", category: 'english-sans' },
  { name: 'Poppins', value: "'Poppins', sans-serif", category: 'english-sans' },
  { name: 'Lato', value: "'Lato', sans-serif", category: 'english-sans' },
  { name: 'Raleway', value: "'Raleway', sans-serif", category: 'english-sans' },
  { name: 'Oswald', value: "'Oswald', sans-serif", category: 'english-sans' },

  // 영문 - 세리프
  { name: 'Playfair Display', value: "'Playfair Display', serif", category: 'english-serif' },
  { name: 'Merriweather', value: "'Merriweather', serif", category: 'english-serif' },
  { name: 'Lora', value: "'Lora', serif", category: 'english-serif' },
  { name: 'Crimson Text', value: "'Crimson Text', serif", category: 'english-serif' },
  { name: 'Libre Baskerville', value: "'Libre Baskerville', serif", category: 'english-serif' },

  // 영문 - 디스플레이/아트
  { name: 'Bebas Neue', value: "'Bebas Neue', sans-serif", category: 'english-display' },
  { name: 'Anton', value: "'Anton', sans-serif", category: 'english-display' },
  { name: 'Abril Fatface', value: "'Abril Fatface', serif", category: 'english-display' },
  { name: 'Righteous', value: "'Righteous', sans-serif", category: 'english-display' },
  { name: 'Staatliches', value: "'Staatliches', sans-serif", category: 'english-display' },

  // 모노스페이스 (코드/타자기)
  { name: 'JetBrains Mono', value: "'JetBrains Mono', monospace", category: 'monospace' },
  { name: 'Fira Code', value: "'Fira Code', monospace", category: 'monospace' },
  { name: 'Source Code Pro', value: "'Source Code Pro', monospace", category: 'monospace' },
];

// Google Fonts URL (모든 폰트 포함)
export const GOOGLE_FONTS_URL = 'https://fonts.googleapis.com/css2?' +
  // 한글 폰트
  'family=Noto+Sans+KR:wght@300;400;500;700&' +
  'family=Noto+Serif+KR:wght@400;700&' +
  'family=Pretendard:wght@400;500;600;700&' +
  'family=Spoqa+Han+Sans+Neo:wght@400;500;700&' +
  'family=IBM+Plex+Sans+KR:wght@400;500;700&' +
  'family=Nanum+Gothic:wght@400;700&' +
  'family=Nanum+Myeongjo:wght@400;700&' +
  'family=Nanum+Pen+Script&' +
  'family=Gowun+Dodum&' +
  'family=Gowun+Batang&' +
  'family=Gothic+A1:wght@400;500;700&' +
  'family=Hahmlet:wght@400;500;700&' +
  'family=Maruburi:wght@400;700&' +
  'family=Black+Han+Sans&' +
  'family=Do+Hyeon&' +
  'family=Jua&' +
  'family=Sunflower:wght@300;500;700&' +
  'family=Single+Day&' +
  'family=Dokdo&' +
  'family=East+Sea+Dokdo&' +
  'family=Gamja+Flower&' +
  'family=Hi+Melody&' +
  'family=Gaegu:wght@300;400;700&' +
  'family=Poor+Story&' +
  'family=Stylish&' +
  'family=Cute+Font&' +
  'family=Gugi&' +
  'family=Song+Myung&' +
  // 영문 폰트
  'family=Inter:wght@400;500;600;700&' +
  'family=Roboto:wght@400;500;700&' +
  'family=Open+Sans:wght@400;600;700&' +
  'family=Montserrat:wght@400;500;600;700&' +
  'family=Poppins:wght@400;500;600;700&' +
  'family=Lato:wght@400;700&' +
  'family=Raleway:wght@400;500;600;700&' +
  'family=Oswald:wght@400;500;700&' +
  'family=Playfair+Display:wght@400;500;700&' +
  'family=Merriweather:wght@400;700&' +
  'family=Lora:wght@400;500;700&' +
  'family=Crimson+Text:wght@400;600;700&' +
  'family=Libre+Baskerville:wght@400;700&' +
  'family=Bebas+Neue&' +
  'family=Anton&' +
  'family=Abril+Fatface&' +
  'family=Righteous&' +
  'family=Staatliches&' +
  // 모노스페이스
  'family=JetBrains+Mono:wght@400;500;700&' +
  'family=Fira+Code:wght@400;500;700&' +
  'family=Source+Code+Pro:wght@400;500;700&' +
  'display=swap';

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

// 파티클 이펙트 프리셋
export const PARTICLE_EFFECTS = [
  { name: '없음', value: 'none', emoji: '' },
  // 청첩장/축하용
  { name: '꽃잎', value: 'petals', emoji: '🌸', description: '분홍빛 꽃잎이 흩날림' },
  { name: '별', value: 'stars', emoji: '⭐', description: '반짝이는 별이 내려옴' },
  { name: '하트', value: 'hearts', emoji: '💕', description: '하트가 떠다님' },
  { name: '나비', value: 'butterflies', emoji: '🦋', description: '나비가 날아다님' },
  { name: '반짝임', value: 'sparkles', emoji: '✨', description: '반짝반짝 빛나는 효과' },
  // 시즌/계절용
  { name: '눈송이', value: 'snowflakes', emoji: '❄️', description: '겨울 느낌의 눈' },
  { name: '낙엽', value: 'leaves', emoji: '🍂', description: '가을 느낌의 낙엽' },
  { name: '벚꽃', value: 'sakura', emoji: '🌸', description: '봄 느낌의 벚꽃잎' },
  { name: '거품', value: 'bubbles', emoji: '🫧', description: '몽환적인 거품' },
  { name: '불티', value: 'embers', emoji: '🔥', description: '불티가 올라감' },
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
  particleEffect: {
    enabled: false,
    type: 'petals' as const,  // 기본값은 꽃잎 (활성화 시 바로 표시되도록)
    intensity: 5,
    speed: 1,
    opacity: 0.8,
  },
};
