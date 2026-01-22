import { Section, LayoutType, Template, TemplateCategoryId } from '../types';

// 마켓플레이스 템플릿 인터페이스 (사용자 공유 템플릿)
export interface MarketplaceTemplate extends Template {
  author: string;
  downloads: number;
  createdAt: string;
  tags: string[];
  thumbnail?: string;
}

// 현재 섹션들을 템플릿으로 내보내기
export const exportAsTemplate = (
  sections: Section[],
  templateInfo: {
    name: string;
    description: string;
    category: TemplateCategoryId;
    author: string;
    tags: string[];
  }
): MarketplaceTemplate => {
  // 섹션에서 id 제거하고 미디어 URL 비우기 (공유 시 보안을 위해)
  const cleanSections = sections.map(section => {
    const { id, ...rest } = section;
    return {
      ...rest,
      mediaUrl: '', // 미디어 URL 비우기
      // 갤러리 이미지 URL 비우기
      galleryImages: section.galleryImages?.map(img => ({ ...img, url: '' })),
      // 캐러셀 이미지 URL 비우기
      carouselImages: section.carouselImages?.map(img => ({ ...img, url: '' })),
      // Masonry 이미지 URL 비우기
      masonryImages: section.masonryImages?.map(img => ({ ...img, url: '' })),
      // 카드 이미지 URL 비우기
      cards: section.cards?.map(card => ({ ...card, imageUrl: '' })),
      // 타임라인 이미지 URL 비우기
      timelineItems: section.timelineItems?.map(item => ({ ...item, imageUrl: '' })),
    };
  });

  return {
    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: templateInfo.name,
    description: templateInfo.description,
    category: templateInfo.category,
    author: templateInfo.author,
    downloads: 0,
    createdAt: new Date().toISOString(),
    tags: templateInfo.tags,
    sections: cleanSections as Omit<Section, 'id'>[],
  };
};

// 템플릿을 JSON 파일로 다운로드
export const downloadTemplateAsJson = (template: MarketplaceTemplate) => {
  const json = JSON.stringify(template, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${template.name.replace(/\s+/g, '-').toLowerCase()}.storyflow.json`;
  a.click();
  URL.revokeObjectURL(url);
};

// JSON 파일에서 템플릿 불러오기
export const loadTemplateFromJson = (file: File): Promise<MarketplaceTemplate> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = e.target?.result as string;
        const template = JSON.parse(json) as MarketplaceTemplate;

        // 기본 검증
        if (!template.name || !template.sections || !Array.isArray(template.sections)) {
          throw new Error('유효하지 않은 템플릿 파일입니다.');
        }

        resolve(template);
      } catch (error) {
        reject(new Error('템플릿 파일을 읽을 수 없습니다.'));
      }
    };
    reader.onerror = () => reject(new Error('파일을 읽는 중 오류가 발생했습니다.'));
    reader.readAsText(file);
  });
};

// 템플릿을 실제 섹션으로 변환
const generateId = () => Math.random().toString(36).substr(2, 9);

export const applyMarketplaceTemplate = (template: MarketplaceTemplate): Section[] => {
  return template.sections.map(section => ({
    ...section,
    id: generateId(),
  })) as Section[];
};

// 커뮤니티 샘플 템플릿 (프리셋)
export const COMMUNITY_TEMPLATES: MarketplaceTemplate[] = [
  {
    id: 'community-minimal-portfolio',
    name: '미니멀 포트폴리오',
    description: '깔끔하고 세련된 포트폴리오 템플릿',
    category: 'creative',
    author: 'StoryFlow 팀',
    downloads: 1250,
    createdAt: '2024-01-15T00:00:00.000Z',
    tags: ['미니멀', '포트폴리오', '모던'],
    sections: [
      {
        layout: LayoutType.HERO,
        title: '안녕하세요',
        description: '저는 크리에이터입니다',
        mediaType: 'none',
        mediaUrl: '',
        textAlignment: 'center',
        textColor: '#ffffff',
        backgroundColor: '#0a0a0a',
        overlayOpacity: 0.3,
        fontFamily: "'Noto Sans KR', sans-serif",
        titleFontSize: 72,
        descriptionFontSize: 24,
      },
      {
        layout: LayoutType.MASONRY,
        title: '작품',
        description: '',
        mediaType: 'none',
        mediaUrl: '',
        textAlignment: 'center',
        textColor: '#ffffff',
        backgroundColor: '#0a0a0a',
        masonryImages: [
          { id: '1', url: '', caption: '작품 1', aspectRatio: 'portrait' },
          { id: '2', url: '', caption: '작품 2', aspectRatio: 'landscape' },
          { id: '3', url: '', caption: '작품 3', aspectRatio: 'square' },
          { id: '4', url: '', caption: '작품 4', aspectRatio: 'portrait' },
          { id: '5', url: '', caption: '작품 5', aspectRatio: 'landscape' },
          { id: '6', url: '', caption: '작품 6', aspectRatio: 'square' },
        ],
        masonrySettings: { columns: 3, gap: 8, showCaptions: true, hoverEffect: true, rounded: false },
      },
      {
        layout: LayoutType.SIMPLE_TEXT,
        title: '연락처',
        description: 'hello@example.com',
        mediaType: 'none',
        mediaUrl: '',
        textAlignment: 'center',
        textColor: '#ffffff',
        backgroundColor: '#0a0a0a',
      },
    ],
  },
  {
    id: 'community-product-launch',
    name: '제품 런칭',
    description: '신제품 출시를 위한 모던한 랜딩 페이지',
    category: 'business',
    author: 'StoryFlow 팀',
    downloads: 890,
    createdAt: '2024-02-01T00:00:00.000Z',
    tags: ['제품', '런칭', '랜딩페이지', '모던'],
    sections: [
      {
        layout: LayoutType.HERO,
        title: '새로운 시작',
        description: '당신의 일상을 바꿔줄 혁신',
        mediaType: 'image',
        mediaUrl: '',
        textAlignment: 'center',
        textColor: '#ffffff',
        backgroundColor: '#000000',
        overlayOpacity: 0.5,
        fontFamily: "'Pretendard', sans-serif",
        titleFontSize: 64,
        animation: 'fade-in',
      },
      {
        layout: LayoutType.CAROUSEL,
        title: '주요 기능',
        description: '',
        mediaType: 'none',
        mediaUrl: '',
        textAlignment: 'center',
        textColor: '#ffffff',
        backgroundColor: '#111111',
        carouselImages: [
          { id: '1', url: '', title: '기능 1', description: '첫 번째 핵심 기능' },
          { id: '2', url: '', title: '기능 2', description: '두 번째 핵심 기능' },
          { id: '3', url: '', title: '기능 3', description: '세 번째 핵심 기능' },
        ],
        carouselSettings: {
          autoPlay: true,
          autoPlayInterval: 4000,
          showArrows: true,
          showDots: true,
          transition: 'fade',
          transitionDuration: 600,
          pauseOnHover: true,
          loop: true,
        },
      },
      {
        layout: LayoutType.STATS,
        title: '',
        description: '',
        mediaType: 'none',
        mediaUrl: '',
        textAlignment: 'center',
        textColor: '#ffffff',
        backgroundColor: '#000000',
        stats: [
          { id: '1', value: '50%', label: '효율성 향상' },
          { id: '2', value: '10K+', label: '사전 등록' },
          { id: '3', value: '4.9', label: '평점' },
        ],
      },
      {
        layout: LayoutType.SIMPLE_TEXT,
        title: '지금 사전 등록하세요',
        description: '출시 알림을 받아보세요',
        mediaType: 'none',
        mediaUrl: '',
        textAlignment: 'center',
        textColor: '#ffffff',
        backgroundColor: '#111111',
        ctaButton: {
          enabled: true,
          text: '사전 등록',
          link: '#',
          style: 'solid',
          color: '#ffffff',
          size: 'large',
        },
      },
    ],
  },
  {
    id: 'community-wedding-elegant',
    name: '엘레강스 웨딩',
    description: '우아하고 로맨틱한 결혼식 초대장',
    category: 'event',
    author: '웨딩스토리',
    downloads: 2100,
    createdAt: '2024-01-20T00:00:00.000Z',
    tags: ['웨딩', '결혼식', '초대장', '로맨틱'],
    sections: [
      {
        layout: LayoutType.HERO,
        title: 'We\'re Getting Married',
        description: '2024.12.25',
        mediaType: 'image',
        mediaUrl: '',
        textAlignment: 'center',
        textColor: '#ffffff',
        backgroundColor: '#be9b7b',
        overlayOpacity: 0.3,
        fontFamily: "'Gowun Batang', serif",
        titleFontSize: 56,
        descriptionFontSize: 28,
      },
      {
        layout: LayoutType.SIMPLE_TEXT,
        title: '신랑 홍길동 & 신부 김영희',
        description: '서로를 향한 마음을 모아\n평생을 함께하고자 합니다.\n\n소중한 분들을 초대합니다.',
        mediaType: 'none',
        mediaUrl: '',
        textAlignment: 'center',
        textColor: '#ffffff',
        backgroundColor: '#a68966',
        fontFamily: "'Gowun Batang', serif",
      },
      {
        layout: LayoutType.GALLERY,
        title: '',
        description: '',
        mediaType: 'none',
        mediaUrl: '',
        textAlignment: 'center',
        textColor: '#ffffff',
        backgroundColor: '#be9b7b',
        galleryImages: [
          { id: '1', url: '', caption: '' },
          { id: '2', url: '', caption: '' },
          { id: '3', url: '', caption: '' },
          { id: '4', url: '', caption: '' },
        ],
        gallerySettings: { columns: 2, gap: 8, showCaptions: false },
      },
      {
        layout: LayoutType.SPLIT_LEFT,
        title: '오시는 길',
        description: '서울 웨딩홀\n서울시 강남구 테헤란로 123\n\n지하철 2호선 강남역 5번출구\n도보 5분',
        mediaType: 'image',
        mediaUrl: '',
        textAlignment: 'left',
        splitRatio: 50,
        textColor: '#ffffff',
        backgroundColor: '#a68966',
        fontFamily: "'Gowun Batang', serif",
      },
    ],
  },
  {
    id: 'community-dark-creative',
    name: '다크 크리에이티브',
    description: '어두운 톤의 감각적인 포트폴리오',
    category: 'creative',
    author: '다크나이트',
    downloads: 780,
    createdAt: '2024-02-10T00:00:00.000Z',
    tags: ['다크', '크리에이티브', '감각적', '모던'],
    sections: [
      {
        layout: LayoutType.VIDEO_HERO,
        title: 'Creative Works',
        description: '',
        mediaType: 'video',
        mediaUrl: '',
        textAlignment: 'center',
        textColor: '#ffffff',
        backgroundColor: '#000000',
        overlayOpacity: 0.6,
        fontFamily: "'Black Han Sans', sans-serif",
        titleFontSize: 80,
        videoHeroSettings: { autoPlay: true, muted: true, loop: true },
      },
      {
        layout: LayoutType.CARDS,
        title: 'Projects',
        description: '',
        mediaType: 'none',
        mediaUrl: '',
        textAlignment: 'center',
        textColor: '#ffffff',
        backgroundColor: '#0a0a0a',
        cards: [
          { id: '1', title: 'Project A', description: '브랜딩 프로젝트' },
          { id: '2', title: 'Project B', description: 'UI/UX 디자인' },
          { id: '3', title: 'Project C', description: '모션 그래픽' },
        ],
        cardsSettings: { columns: 3, borderRadius: 0, showShadow: false, hoverEffect: true },
      },
      {
        layout: LayoutType.QUOTE,
        title: '',
        description: '',
        mediaType: 'none',
        mediaUrl: '',
        textAlignment: 'center',
        textColor: '#ffffff',
        backgroundColor: '#000000',
        quoteText: '창의성은 어둠 속에서 빛난다',
        quoteAuthor: '',
        fontFamily: "'Noto Serif KR', serif",
      },
      {
        layout: LayoutType.SIMPLE_TEXT,
        title: 'Contact',
        description: 'creative@example.com',
        mediaType: 'none',
        mediaUrl: '',
        textAlignment: 'center',
        textColor: '#ffffff',
        backgroundColor: '#0a0a0a',
      },
    ],
  },
  {
    id: 'community-travel-story',
    name: '여행 스토리',
    description: '여행의 추억을 담는 포토 에세이',
    category: 'personal',
    author: '트래블러',
    downloads: 1560,
    createdAt: '2024-01-25T00:00:00.000Z',
    tags: ['여행', '스토리', '포토', '에세이'],
    sections: [
      {
        layout: LayoutType.HERO,
        title: '제주에서의 3일',
        description: '2024년 1월의 기록',
        mediaType: 'image',
        mediaUrl: '',
        textAlignment: 'center',
        textColor: '#ffffff',
        backgroundColor: '#1e3a5f',
        overlayOpacity: 0.4,
        fontFamily: "'Noto Serif KR', serif",
        titleFontSize: 56,
      },
      {
        layout: LayoutType.TIMELINE,
        title: '여행 일정',
        description: '',
        mediaType: 'none',
        mediaUrl: '',
        textAlignment: 'left',
        textColor: '#ffffff',
        backgroundColor: '#0f2942',
        timelineItems: [
          { id: '1', date: 'Day 1', title: '성산일출봉', description: '일출을 보러 새벽 4시에 출발' },
          { id: '2', date: 'Day 2', title: '우도', description: '자전거로 섬 한 바퀴' },
          { id: '3', date: 'Day 3', title: '서귀포', description: '해안 절벽과 폭포' },
        ],
        timelineAlignment: 'alternate',
      },
      {
        layout: LayoutType.MASONRY,
        title: '사진들',
        description: '',
        mediaType: 'none',
        mediaUrl: '',
        textAlignment: 'center',
        textColor: '#ffffff',
        backgroundColor: '#1e3a5f',
        masonryImages: [
          { id: '1', url: '', caption: '성산일출봉', aspectRatio: 'landscape' },
          { id: '2', url: '', caption: '우도 해변', aspectRatio: 'portrait' },
          { id: '3', url: '', caption: '돌담길', aspectRatio: 'square' },
          { id: '4', url: '', caption: '카페', aspectRatio: 'landscape' },
          { id: '5', url: '', caption: '일몰', aspectRatio: 'landscape' },
        ],
        masonrySettings: { columns: 3, gap: 12, showCaptions: true, hoverEffect: true, rounded: true },
      },
      {
        layout: LayoutType.QUOTE,
        title: '',
        description: '',
        mediaType: 'none',
        mediaUrl: '',
        textAlignment: 'center',
        textColor: '#ffffff',
        backgroundColor: '#0f2942',
        quoteText: '여행은 목적지가 아니라 여정이다',
        quoteAuthor: '',
        fontFamily: "'Gowun Batang', serif",
      },
    ],
  },
];

// 검색 및 필터링
export const searchCommunityTemplates = (
  query: string,
  category?: TemplateCategoryId
): MarketplaceTemplate[] => {
  let results = COMMUNITY_TEMPLATES;

  if (category) {
    results = results.filter(t => t.category === category);
  }

  if (query.trim()) {
    const lowerQuery = query.toLowerCase();
    results = results.filter(t =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      t.author.toLowerCase().includes(lowerQuery)
    );
  }

  return results;
};

// 인기순 정렬
export const getPopularTemplates = (limit: number = 5): MarketplaceTemplate[] => {
  return [...getAllCommunityTemplates()]
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, limit);
};

// 최신순 정렬
export const getRecentTemplates = (limit: number = 5): MarketplaceTemplate[] => {
  return [...getAllCommunityTemplates()]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
};

// ========== 로컬 커뮤니티 저장소 (localStorage 기반) ==========

const LOCAL_COMMUNITY_KEY = 'storyflow-community-templates';
const MY_TEMPLATES_KEY = 'storyflow-my-templates';

// 로컬 커뮤니티에 등록된 템플릿 가져오기
export const getLocalCommunityTemplates = (): MarketplaceTemplate[] => {
  try {
    const stored = localStorage.getItem(LOCAL_COMMUNITY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// 모든 커뮤니티 템플릿 (프리셋 + 로컬)
export const getAllCommunityTemplates = (): MarketplaceTemplate[] => {
  const localTemplates = getLocalCommunityTemplates();
  return [...COMMUNITY_TEMPLATES, ...localTemplates];
};

// 로컬 커뮤니티에 템플릿 등록
export const registerToCommunity = (template: MarketplaceTemplate): boolean => {
  try {
    const existing = getLocalCommunityTemplates();

    // 중복 체크 (이름 기준)
    if (existing.some(t => t.name === template.name)) {
      return false;
    }

    const updated = [...existing, { ...template, downloads: 0 }];
    localStorage.setItem(LOCAL_COMMUNITY_KEY, JSON.stringify(updated));

    // 내 템플릿에도 등록
    addToMyTemplates(template);

    return true;
  } catch {
    return false;
  }
};

// 커뮤니티에서 템플릿 삭제 (내가 등록한 것만)
export const removeFromCommunity = (templateId: string): boolean => {
  try {
    const existing = getLocalCommunityTemplates();
    const filtered = existing.filter(t => t.id !== templateId);

    if (filtered.length === existing.length) {
      return false; // 찾지 못함
    }

    localStorage.setItem(LOCAL_COMMUNITY_KEY, JSON.stringify(filtered));
    return true;
  } catch {
    return false;
  }
};

// 다운로드 수 증가
export const incrementDownloads = (templateId: string): void => {
  try {
    const existing = getLocalCommunityTemplates();
    const updated = existing.map(t =>
      t.id === templateId ? { ...t, downloads: t.downloads + 1 } : t
    );
    localStorage.setItem(LOCAL_COMMUNITY_KEY, JSON.stringify(updated));
  } catch {
    // 무시
  }
};

// ========== 내 템플릿 관리 ==========

// 내가 만든 템플릿 목록 가져오기
export const getMyTemplates = (): MarketplaceTemplate[] => {
  try {
    const stored = localStorage.getItem(MY_TEMPLATES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// 내 템플릿에 추가
export const addToMyTemplates = (template: MarketplaceTemplate): boolean => {
  try {
    const existing = getMyTemplates();

    // 중복 체크
    if (existing.some(t => t.id === template.id)) {
      return false;
    }

    const updated = [...existing, template];
    localStorage.setItem(MY_TEMPLATES_KEY, JSON.stringify(updated));
    return true;
  } catch {
    return false;
  }
};

// 내 템플릿 업데이트
export const updateMyTemplate = (template: MarketplaceTemplate): boolean => {
  try {
    const existing = getMyTemplates();
    const idx = existing.findIndex(t => t.id === template.id);

    if (idx === -1) {
      return false;
    }

    existing[idx] = template;
    localStorage.setItem(MY_TEMPLATES_KEY, JSON.stringify(existing));

    // 커뮤니티에도 등록되어 있다면 업데이트
    const communityTemplates = getLocalCommunityTemplates();
    const communityIdx = communityTemplates.findIndex(t => t.id === template.id);
    if (communityIdx !== -1) {
      communityTemplates[communityIdx] = { ...template, downloads: communityTemplates[communityIdx].downloads };
      localStorage.setItem(LOCAL_COMMUNITY_KEY, JSON.stringify(communityTemplates));
    }

    return true;
  } catch {
    return false;
  }
};

// 내 템플릿 삭제
export const removeFromMyTemplates = (templateId: string): boolean => {
  try {
    const existing = getMyTemplates();
    const filtered = existing.filter(t => t.id !== templateId);

    if (filtered.length === existing.length) {
      return false;
    }

    localStorage.setItem(MY_TEMPLATES_KEY, JSON.stringify(filtered));

    // 커뮤니티에서도 삭제
    removeFromCommunity(templateId);

    return true;
  } catch {
    return false;
  }
};

// 내 템플릿이 커뮤니티에 등록되어 있는지 확인
export const isRegisteredToCommunity = (templateId: string): boolean => {
  const communityTemplates = getLocalCommunityTemplates();
  return communityTemplates.some(t => t.id === templateId);
};

// 검색 및 필터링 (업데이트: 로컬 커뮤니티 포함)
export const searchAllCommunityTemplates = (
  query: string,
  category?: TemplateCategoryId
): MarketplaceTemplate[] => {
  let results = getAllCommunityTemplates();

  if (category) {
    results = results.filter(t => t.category === category);
  }

  if (query.trim()) {
    const lowerQuery = query.toLowerCase();
    results = results.filter(t =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      t.author.toLowerCase().includes(lowerQuery)
    );
  }

  return results;
};
