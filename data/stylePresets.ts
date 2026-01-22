// 색상 팔레트 프리셋
export interface ColorPalette {
  id: string;
  name: string;
  description: string;
  colors: {
    background: string;
    text: string;
    accent: string;
    overlay: string;
  };
}

export const COLOR_PALETTES: ColorPalette[] = [
  // 다크 테마
  {
    id: 'dark-minimal',
    name: '다크 미니멀',
    description: '깔끔한 어두운 배경',
    colors: {
      background: '#000000',
      text: '#ffffff',
      accent: '#ffffff',
      overlay: '#000000',
    },
  },
  {
    id: 'dark-blue',
    name: '미드나잇 블루',
    description: '깊은 파란색 톤',
    colors: {
      background: '#0a1628',
      text: '#e2e8f0',
      accent: '#3b82f6',
      overlay: '#0a1628',
    },
  },
  {
    id: 'dark-purple',
    name: '코스믹 퍼플',
    description: '우주 느낌의 보라',
    colors: {
      background: '#1a0a2e',
      text: '#f3e8ff',
      accent: '#a855f7',
      overlay: '#1a0a2e',
    },
  },
  {
    id: 'dark-green',
    name: '포레스트',
    description: '자연스러운 녹색',
    colors: {
      background: '#0a1f0a',
      text: '#ecfccb',
      accent: '#22c55e',
      overlay: '#0a1f0a',
    },
  },
  // 라이트 테마
  {
    id: 'light-clean',
    name: '클린 화이트',
    description: '깨끗한 흰색 배경',
    colors: {
      background: '#ffffff',
      text: '#1a1a1a',
      accent: '#000000',
      overlay: '#ffffff',
    },
  },
  {
    id: 'light-cream',
    name: '크림',
    description: '따뜻한 크림색',
    colors: {
      background: '#faf7f2',
      text: '#3d3d3d',
      accent: '#8b7355',
      overlay: '#faf7f2',
    },
  },
  {
    id: 'light-blue',
    name: '스카이',
    description: '시원한 하늘색',
    colors: {
      background: '#f0f9ff',
      text: '#0c4a6e',
      accent: '#0284c7',
      overlay: '#f0f9ff',
    },
  },
  // 그라데이션/컬러풀
  {
    id: 'sunset',
    name: '선셋',
    description: '따뜻한 노을빛',
    colors: {
      background: '#1a0a0a',
      text: '#fff7ed',
      accent: '#f97316',
      overlay: '#1a0a0a',
    },
  },
  {
    id: 'ocean',
    name: '오션',
    description: '깊은 바다',
    colors: {
      background: '#042f2e',
      text: '#ccfbf1',
      accent: '#14b8a6',
      overlay: '#042f2e',
    },
  },
  {
    id: 'rose',
    name: '로즈',
    description: '우아한 장미색',
    colors: {
      background: '#1a0a10',
      text: '#fce7f3',
      accent: '#ec4899',
      overlay: '#1a0a10',
    },
  },
  {
    id: 'gold',
    name: '골드 럭셔리',
    description: '고급스러운 금색',
    colors: {
      background: '#1a1508',
      text: '#fef3c7',
      accent: '#d97706',
      overlay: '#1a1508',
    },
  },
  {
    id: 'monochrome',
    name: '모노크롬',
    description: '세련된 회색톤',
    colors: {
      background: '#171717',
      text: '#e5e5e5',
      accent: '#737373',
      overlay: '#171717',
    },
  },
];

// 타이포그래피 프리셋
export interface TypographyPreset {
  id: string;
  name: string;
  description: string;
  fontFamily: string;
  titleSize: number;
  descriptionSize: number;
  style: 'modern' | 'classic' | 'bold' | 'minimal';
}

export const TYPOGRAPHY_PRESETS: TypographyPreset[] = [
  {
    id: 'modern-sans',
    name: '모던 산스',
    description: '깔끔하고 현대적인',
    fontFamily: "'Noto Sans KR', sans-serif",
    titleSize: 48,
    descriptionSize: 18,
    style: 'modern',
  },
  {
    id: 'classic-serif',
    name: '클래식 세리프',
    description: '전통적이고 우아한',
    fontFamily: "'Noto Serif KR', serif",
    titleSize: 52,
    descriptionSize: 20,
    style: 'classic',
  },
  {
    id: 'bold-impact',
    name: '볼드 임팩트',
    description: '강렬하고 인상적인',
    fontFamily: "'Black Han Sans', sans-serif",
    titleSize: 64,
    descriptionSize: 18,
    style: 'bold',
  },
  {
    id: 'minimal-light',
    name: '미니멀 라이트',
    description: '가볍고 세련된',
    fontFamily: "'Nanum Gothic', sans-serif",
    titleSize: 40,
    descriptionSize: 16,
    style: 'minimal',
  },
  {
    id: 'elegant-cursive',
    name: '엘레강스',
    description: '부드럽고 우아한',
    fontFamily: "'Gowun Batang', serif",
    titleSize: 48,
    descriptionSize: 18,
    style: 'classic',
  },
  {
    id: 'tech-mono',
    name: '테크 모노',
    description: '개발자 스타일',
    fontFamily: "'IBM Plex Sans KR', monospace",
    titleSize: 44,
    descriptionSize: 16,
    style: 'modern',
  },
  {
    id: 'playful',
    name: '플레이풀',
    description: '재미있고 친근한',
    fontFamily: "'Jua', sans-serif",
    titleSize: 56,
    descriptionSize: 20,
    style: 'bold',
  },
  {
    id: 'headline',
    name: '헤드라인',
    description: '뉴스/매거진 스타일',
    fontFamily: "'Do Hyeon', sans-serif",
    titleSize: 60,
    descriptionSize: 18,
    style: 'bold',
  },
];

// 스타일 조합 프리셋 (색상 + 타이포그래피)
export interface StyleCombo {
  id: string;
  name: string;
  description: string;
  colorPaletteId: string;
  typographyId: string;
  overlayOpacity: number;
}

export const STYLE_COMBOS: StyleCombo[] = [
  {
    id: 'dark-modern',
    name: '다크 모던',
    description: '세련된 다크 스타일',
    colorPaletteId: 'dark-minimal',
    typographyId: 'modern-sans',
    overlayOpacity: 0.5,
  },
  {
    id: 'classic-elegant',
    name: '클래식 엘레강스',
    description: '우아한 클래식 스타일',
    colorPaletteId: 'light-cream',
    typographyId: 'classic-serif',
    overlayOpacity: 0.3,
  },
  {
    id: 'bold-impact',
    name: '볼드 임팩트',
    description: '강렬한 인상',
    colorPaletteId: 'dark-blue',
    typographyId: 'bold-impact',
    overlayOpacity: 0.6,
  },
  {
    id: 'minimal-clean',
    name: '미니멀 클린',
    description: '깔끔한 미니멀',
    colorPaletteId: 'light-clean',
    typographyId: 'minimal-light',
    overlayOpacity: 0.2,
  },
  {
    id: 'sunset-warm',
    name: '웜 선셋',
    description: '따뜻한 감성',
    colorPaletteId: 'sunset',
    typographyId: 'elegant-cursive',
    overlayOpacity: 0.5,
  },
  {
    id: 'ocean-fresh',
    name: '프레시 오션',
    description: '시원한 바다 느낌',
    colorPaletteId: 'ocean',
    typographyId: 'modern-sans',
    overlayOpacity: 0.4,
  },
  {
    id: 'luxury-gold',
    name: '럭셔리 골드',
    description: '고급스러운 분위기',
    colorPaletteId: 'gold',
    typographyId: 'classic-serif',
    overlayOpacity: 0.5,
  },
  {
    id: 'tech-cyber',
    name: '사이버 테크',
    description: '미래적인 느낌',
    colorPaletteId: 'dark-purple',
    typographyId: 'tech-mono',
    overlayOpacity: 0.6,
  },
  {
    id: 'playful-fun',
    name: '펀 플레이풀',
    description: '재미있고 밝은',
    colorPaletteId: 'rose',
    typographyId: 'playful',
    overlayOpacity: 0.4,
  },
  {
    id: 'magazine-style',
    name: '매거진 스타일',
    description: '잡지 느낌',
    colorPaletteId: 'monochrome',
    typographyId: 'headline',
    overlayOpacity: 0.5,
  },
];

// 헬퍼 함수: ID로 팔레트 찾기
export const getColorPaletteById = (id: string): ColorPalette | undefined => {
  return COLOR_PALETTES.find(p => p.id === id);
};

// 헬퍼 함수: ID로 타이포그래피 찾기
export const getTypographyById = (id: string): TypographyPreset | undefined => {
  return TYPOGRAPHY_PRESETS.find(t => t.id === id);
};

// 헬퍼 함수: 스타일 콤보 적용
export const getStyleComboSettings = (comboId: string): {
  colors: ColorPalette['colors'];
  typography: Omit<TypographyPreset, 'id' | 'name' | 'description'>;
  overlayOpacity: number;
} | null => {
  const combo = STYLE_COMBOS.find(c => c.id === comboId);
  if (!combo) return null;

  const palette = getColorPaletteById(combo.colorPaletteId);
  const typography = getTypographyById(combo.typographyId);

  if (!palette || !typography) return null;

  return {
    colors: palette.colors,
    typography: {
      fontFamily: typography.fontFamily,
      titleSize: typography.titleSize,
      descriptionSize: typography.descriptionSize,
      style: typography.style,
    },
    overlayOpacity: combo.overlayOpacity,
  };
};
