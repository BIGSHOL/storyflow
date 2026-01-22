/**
 * 색상 팔레트, 타이포그래피, 브랜드 세트 프리셋
 */

// 색상 팔레트 타입
export interface ColorPalette {
  id: string;
  name: string;
  description: string;
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
}

// 타이포그래피 프리셋 타입
export interface TypographyPreset {
  id: string;
  name: string;
  description: string;
  fontFamily: string;
  titleSize: number;
  descriptionSize: number;
}

// 브랜드 세트 타입 (색상 + 폰트 조합)
export interface BrandSet {
  id: string;
  name: string;
  description: string;
  category: 'modern' | 'elegant' | 'playful' | 'professional' | 'minimal';
  palette: ColorPalette;
  typography: TypographyPreset;
}

// ========== 색상 팔레트 ==========

export const colorPalettes: ColorPalette[] = [
  {
    id: 'dark-elegant',
    name: '다크 엘레강트',
    description: '세련된 검은색 기반 팔레트',
    primary: '#000000',
    secondary: '#1a1a1a',
    background: '#0a0a0a',
    text: '#ffffff',
    accent: '#fbbf24', // amber-400
  },
  {
    id: 'ocean-blue',
    name: '오션 블루',
    description: '차분한 바다색 팔레트',
    primary: '#0c4a6e', // sky-900
    secondary: '#0369a1', // sky-700
    background: '#082f49', // sky-950
    text: '#f0f9ff', // sky-50
    accent: '#38bdf8', // sky-400
  },
  {
    id: 'forest-green',
    name: '포레스트 그린',
    description: '자연스러운 녹색 팔레트',
    primary: '#14532d', // green-900
    secondary: '#166534', // green-800
    background: '#052e16', // green-950
    text: '#f0fdf4', // green-50
    accent: '#4ade80', // green-400
  },
  {
    id: 'sunset-orange',
    name: '선셋 오렌지',
    description: '따뜻한 노을빛 팔레트',
    primary: '#7c2d12', // orange-900
    secondary: '#9a3412', // orange-800
    background: '#431407', // orange-950
    text: '#fff7ed', // orange-50
    accent: '#fb923c', // orange-400
  },
  {
    id: 'royal-purple',
    name: '로얄 퍼플',
    description: '고급스러운 보라색 팔레트',
    primary: '#4c1d95', // violet-900
    secondary: '#5b21b6', // violet-800
    background: '#2e1065', // violet-950
    text: '#f5f3ff', // violet-50
    accent: '#a78bfa', // violet-400
  },
  {
    id: 'rose-gold',
    name: '로즈 골드',
    description: '우아한 핑크/골드 팔레트',
    primary: '#881337', // rose-900
    secondary: '#9f1239', // rose-800
    background: '#4c0519', // rose-950
    text: '#fff1f2', // rose-50
    accent: '#fb7185', // rose-400
  },
  {
    id: 'minimal-gray',
    name: '미니멀 그레이',
    description: '심플한 회색톤 팔레트',
    primary: '#1f2937', // gray-800
    secondary: '#374151', // gray-700
    background: '#111827', // gray-900
    text: '#f9fafb', // gray-50
    accent: '#6b7280', // gray-500
  },
  {
    id: 'vintage-brown',
    name: '빈티지 브라운',
    description: '클래식한 갈색 팔레트',
    primary: '#78350f', // amber-900
    secondary: '#92400e', // amber-800
    background: '#451a03', // amber-950
    text: '#fffbeb', // amber-50
    accent: '#fbbf24', // amber-400
  },
];

// ========== 타이포그래피 프리셋 ==========

export const typographyPresets: TypographyPreset[] = [
  {
    id: 'classic-serif',
    name: '클래식 세리프',
    description: '전통적이고 우아한 세리프 폰트',
    fontFamily: "'Noto Serif KR', Georgia, serif",
    titleSize: 56,
    descriptionSize: 18,
  },
  {
    id: 'modern-sans',
    name: '모던 산세리프',
    description: '깔끔하고 현대적인 산세리프',
    fontFamily: "'Noto Sans KR', -apple-system, sans-serif",
    titleSize: 48,
    descriptionSize: 16,
  },
  {
    id: 'bold-impact',
    name: '볼드 임팩트',
    description: '강렬한 타이틀용 조합',
    fontFamily: "'Black Han Sans', sans-serif",
    titleSize: 64,
    descriptionSize: 16,
  },
  {
    id: 'elegant-light',
    name: '엘레강트 라이트',
    description: '얇고 세련된 느낌',
    fontFamily: "'Noto Sans KR', sans-serif",
    titleSize: 52,
    descriptionSize: 17,
  },
  {
    id: 'compact-reader',
    name: '컴팩트 리더',
    description: '가독성 중심 조합',
    fontFamily: "'Noto Sans KR', sans-serif",
    titleSize: 40,
    descriptionSize: 18,
  },
  {
    id: 'display-large',
    name: '디스플레이 라지',
    description: '큰 화면용 타이틀',
    fontFamily: "'Noto Serif KR', serif",
    titleSize: 72,
    descriptionSize: 20,
  },
];

// ========== 브랜드 세트 (색상 + 폰트 조합) ==========

export const brandSets: BrandSet[] = [
  {
    id: 'corporate-professional',
    name: '기업 프로페셔널',
    description: '전문적이고 신뢰감 있는 비즈니스 브랜드',
    category: 'professional',
    palette: colorPalettes.find(p => p.id === 'ocean-blue')!,
    typography: typographyPresets.find(t => t.id === 'modern-sans')!,
  },
  {
    id: 'luxury-elegant',
    name: '럭셔리 엘레강트',
    description: '고급스럽고 우아한 프리미엄 브랜드',
    category: 'elegant',
    palette: colorPalettes.find(p => p.id === 'dark-elegant')!,
    typography: typographyPresets.find(t => t.id === 'classic-serif')!,
  },
  {
    id: 'creative-bold',
    name: '크리에이티브 볼드',
    description: '창의적이고 대담한 스타일',
    category: 'playful',
    palette: colorPalettes.find(p => p.id === 'sunset-orange')!,
    typography: typographyPresets.find(t => t.id === 'bold-impact')!,
  },
  {
    id: 'nature-organic',
    name: '네이처 오가닉',
    description: '자연스럽고 친환경적인 브랜드',
    category: 'modern',
    palette: colorPalettes.find(p => p.id === 'forest-green')!,
    typography: typographyPresets.find(t => t.id === 'elegant-light')!,
  },
  {
    id: 'minimal-clean',
    name: '미니멀 클린',
    description: '깔끔하고 심플한 미니멀 디자인',
    category: 'minimal',
    palette: colorPalettes.find(p => p.id === 'minimal-gray')!,
    typography: typographyPresets.find(t => t.id === 'compact-reader')!,
  },
  {
    id: 'romantic-rose',
    name: '로맨틱 로즈',
    description: '로맨틱하고 여성스러운 브랜드',
    category: 'elegant',
    palette: colorPalettes.find(p => p.id === 'rose-gold')!,
    typography: typographyPresets.find(t => t.id === 'elegant-light')!,
  },
  {
    id: 'vintage-classic',
    name: '빈티지 클래식',
    description: '클래식하고 향수를 불러일으키는 스타일',
    category: 'elegant',
    palette: colorPalettes.find(p => p.id === 'vintage-brown')!,
    typography: typographyPresets.find(t => t.id === 'classic-serif')!,
  },
  {
    id: 'tech-modern',
    name: '테크 모던',
    description: '기술적이고 미래지향적인 스타일',
    category: 'modern',
    palette: colorPalettes.find(p => p.id === 'royal-purple')!,
    typography: typographyPresets.find(t => t.id === 'modern-sans')!,
  },
];

// ========== 프리셋 적용 헬퍼 함수 ==========

/**
 * 색상 팔레트를 섹션에 적용
 */
export const applyColorPalette = (section: any, palette: ColorPalette) => {
  return {
    ...section,
    backgroundColor: palette.primary,
    textColor: palette.text,
  };
};

/**
 * 타이포그래피 프리셋을 섹션에 적용
 */
export const applyTypography = (section: any, typography: TypographyPreset) => {
  return {
    ...section,
    fontFamily: typography.fontFamily,
    titleFontSize: typography.titleSize,
    descriptionFontSize: typography.descriptionSize,
  };
};

/**
 * 브랜드 세트를 섹션에 적용
 */
export const applyBrandSet = (section: any, brandSet: BrandSet) => {
  return {
    ...section,
    backgroundColor: brandSet.palette.primary,
    textColor: brandSet.palette.text,
    fontFamily: brandSet.typography.fontFamily,
    titleFontSize: brandSet.typography.titleSize,
    descriptionFontSize: brandSet.typography.descriptionSize,
  };
};

/**
 * 모든 섹션에 브랜드 세트 일괄 적용
 */
export const applyBrandSetToAllSections = (sections: any[], brandSet: BrandSet) => {
  return sections.map(section => applyBrandSet(section, brandSet));
};
