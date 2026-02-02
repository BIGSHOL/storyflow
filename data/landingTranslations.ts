export type Language = 'ko' | 'en';

interface FeatureTranslation {
  title: string;
  description: string;
}

interface UseCaseTranslation {
  title: string;
  description: string;
  target: string;
}

interface StepTranslation {
  title: string;
  description: string;
}

interface FaqTranslation {
  question: string;
  answer: string;
}

export interface LandingTranslations {
  nav: {
    features: string;
    howItWorks: string;
    faq: string;
    cta: string;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
    subtitle: string;
  };
  features: {
    sectionTitle: string;
    sectionDescription: string;
    items: FeatureTranslation[];
  };
  howItWorks: {
    sectionTitle: string;
    sectionDescription: string;
    steps: StepTranslation[];
  };
  useCases: {
    sectionTitle: string;
    sectionDescription: string;
    items: UseCaseTranslation[];
  };
  faq: {
    sectionTitle: string;
    sectionDescription: string;
    items: FaqTranslation[];
  };
  cta: {
    title: string;
    descriptionLine1: string;
    descriptionLine2: string;
    button: string;
    benefits: [string, string, string];
  };
  footer: {
    description: string;
    productHeader: string;
    policyHeader: string;
    editor: string;
    featuresIntro: string;
    howToUse: string;
    faqLink: string;
    privacy: string;
    terms: string;
    contact: string;
    languageLabel: string;
  };
}

export const translations: Record<Language, LandingTranslations> = {
  ko: {
    nav: {
      features: '기능',
      howItWorks: '사용법',
      faq: 'FAQ',
      cta: '무료로 시작하기',
    },
    hero: {
      badge: '코딩 없이 누구나 쉽게',
      titleLine1: '이미지로 만드는',
      titleLine2: '아름다운 웹페이지',
      description:
        '드래그 앤 드롭으로 이미지와 텍스트를 배치하고, 전문가 수준의 세로 스크롤 스토리텔링 페이지를 몇 분 만에 완성하세요. 코딩 지식은 전혀 필요 없습니다.',
      ctaPrimary: '무료로 시작하기',
      ctaSecondary: '사용법 알아보기',
      subtitle: '가입 없이도 바로 사용 가능 · 무료 플랜 영구 제공',
    },
    features: {
      sectionTitle: '강력하지만 쉬운 기능들',
      sectionDescription:
        '복잡한 코딩이나 디자인 도구 없이도 전문적인 웹페이지를 만들 수 있도록 직관적인 기능들을 제공합니다.',
      items: [
        {
          title: '드래그 앤 드롭',
          description:
            '이미지와 동영상을 드래그하여 놓기만 하면 됩니다. 코딩 지식이 전혀 필요 없어요.',
        },
        {
          title: '20가지 이상의 레이아웃',
          description:
            '히어로, 분할, 갤러리, 카드, 캐러셀, 통계, 방명록 등 다양한 레이아웃 템플릿을 제공합니다.',
        },
        {
          title: '실시간 프리뷰',
          description:
            '편집 내용이 즉시 오른쪽 프리뷰에 반영됩니다. 완성된 모습을 바로 확인하세요.',
        },
        {
          title: '타이포그래피 커스터마이징',
          description:
            '50종 이상의 한글/영문 폰트, 크기, 색상, 그림자 효과까지 자유롭게 설정할 수 있어요.',
        },
        {
          title: '이미지 필터 & 효과',
          description:
            '흑백, 세피아, 블러 등 이미지 필터와 오버레이 효과로 분위기를 연출하세요.',
        },
        {
          title: '동영상 히어로',
          description:
            '배경에 동영상을 넣어 역동적인 첫 화면을 만들 수 있습니다. YouTube URL도 지원해요.',
        },
        {
          title: '오디오 플레이어',
          description:
            '음악이나 팟캐스트를 삽입할 수 있어요. YouTube, SoundCloud URL을 바로 붙여넣기만 하면 됩니다.',
        },
        {
          title: '통계 & 숫자 애니메이션',
          description:
            '숫자가 카운트업 되는 애니메이션 효과로 인상적인 통계 섹션을 만들어보세요.',
        },
        {
          title: '반응형 디자인',
          description:
            '데스크탑, 태블릿, 모바일에서 모두 아름답게 보이는 반응형 페이지를 자동으로 생성합니다.',
        },
        {
          title: 'HTML/PDF/이미지 내보내기',
          description:
            '완성된 페이지를 HTML 파일, PDF 문서, PNG 이미지 등 다양한 형식으로 내보낼 수 있어요.',
        },
        {
          title: '링크 공유',
          description:
            '클릭 한 번으로 공유 링크를 생성하여 누구와든 웹페이지를 공유할 수 있습니다.',
        },
        {
          title: '30가지 이상의 템플릿',
          description:
            '포트폴리오, 비즈니스, 이벤트, 크리에이티브 등 목적에 맞는 완성형 템플릿을 골라 시작하세요.',
        },
      ],
    },
    howItWorks: {
      sectionTitle: '4단계로 완성하세요',
      sectionDescription:
        '복잡한 과정 없이 몇 번의 클릭만으로 웹페이지가 완성됩니다.',
      steps: [
        {
          title: '템플릿 선택 또는 새로 시작',
          description:
            '30가지 이상의 전문가 수준 템플릿에서 골라 시작하거나, 빈 캔버스에서 자유롭게 시작할 수 있어요.',
        },
        {
          title: '이미지와 텍스트 추가',
          description:
            '이미지를 드래그하여 놓고, 텍스트를 입력하세요. 레이아웃, 폰트, 색상을 자유롭게 변경할 수 있습니다.',
        },
        {
          title: '실시간으로 확인',
          description:
            '오른쪽 프리뷰에서 완성된 모습을 바로 확인하세요. 데스크탑과 모바일 뷰를 전환하며 볼 수 있어요.',
        },
        {
          title: '내보내기 또는 공유',
          description:
            'HTML, PDF, 이미지로 내보내거나 공유 링크를 생성하여 누구에게나 보여줄 수 있습니다.',
        },
      ],
    },
    useCases: {
      sectionTitle: '이런 분들에게 딱이에요',
      sectionDescription:
        'StoryFlow Creator는 다양한 목적에 맞는 웹페이지를 누구나 쉽게 만들 수 있도록 설계되었습니다.',
      items: [
        {
          title: '포트폴리오',
          description:
            '사진작가, 디자이너, 일러스트레이터를 위한 작품 포트폴리오 페이지를 만들어보세요. 갤러리와 매이슨리 레이아웃으로 작품을 아름답게 전시할 수 있습니다.',
          target: '프리랜서, 크리에이터',
        },
        {
          title: '비즈니스 소개',
          description:
            '카페, 레스토랑, 헬스장, 미용실 등 소규모 비즈니스의 소개 페이지를 쉽게 만들 수 있어요. 메뉴판, 가격표, 위치 정보까지 한 페이지에 담아보세요.',
          target: '소상공인, 자영업자',
        },
        {
          title: '이벤트 초대장',
          description:
            '결혼식, 생일파티, 동창회, 전시회 등 특별한 이벤트의 디지털 초대장을 제작하세요. 방명록 기능으로 참석 의사를 받을 수도 있어요.',
          target: '개인, 기업',
        },
        {
          title: '학교 과제 & 발표',
          description:
            '보고서, 프레젠테이션, 프로젝트 결과물을 웹페이지로 만들어 제출하세요. PDF로 내보내기하면 문서로도 활용할 수 있습니다.',
          target: '학생, 교사',
        },
        {
          title: '뮤지션 & 아티스트',
          description:
            'YouTube 음악을 임베드하고, 앨범 아트를 갤러리로 전시하고, 공연 일정을 소개하는 페이지를 만들어보세요.',
          target: '뮤지션, 밴드, DJ',
        },
        {
          title: '여행 & 추억 기록',
          description:
            '여행 사진과 글을 세로 스크롤로 이어붙여 멋진 여행기를 만들 수 있어요. 친구들에게 링크를 공유해보세요.',
          target: '여행자, 블로거',
        },
      ],
    },
    faq: {
      sectionTitle: '자주 묻는 질문',
      sectionDescription:
        'StoryFlow Creator에 대해 궁금한 점을 확인하세요.',
      items: [
        {
          question: 'StoryFlow Creator는 무료인가요?',
          answer:
            '네, StoryFlow Creator는 기본적으로 무료로 사용할 수 있습니다. 무료 플랜에서는 프로젝트 3개, 미디어 저장 100MB, 일 10회 내보내기를 제공합니다. 더 많은 기능이 필요하시면 Pro 플랜을 이용해주세요.',
        },
        {
          question: '코딩을 전혀 몰라도 사용할 수 있나요?',
          answer:
            '물론이에요! StoryFlow Creator는 코딩 지식이 전혀 필요 없습니다. 마우스로 클릭하고 드래그하는 것만으로 멋진 웹페이지를 만들 수 있어요. 텍스트를 입력하고, 이미지를 끌어다 놓고, 레이아웃을 선택하기만 하면 됩니다.',
        },
        {
          question: '어떤 형식으로 내보내기할 수 있나요?',
          answer:
            'HTML 파일, PDF 문서, PNG 이미지, 섹션별 개별 이미지, 썸네일(OG 이미지) 등 다양한 형식으로 내보내기가 가능합니다. HTML 파일은 외부 의존성 없이 독립적으로 작동하므로 어떤 웹 호스팅에서든 바로 사용할 수 있어요.',
        },
        {
          question: '만든 페이지를 다른 사람에게 보여줄 수 있나요?',
          answer:
            '네, 공유 기능을 사용하면 고유한 링크가 생성되어 누구에게나 보여줄 수 있습니다. 별도의 호스팅이나 도메인 없이도 바로 공유가 가능해요.',
        },
        {
          question: '이미지와 동영상은 어떤 형식을 지원하나요?',
          answer:
            'PNG, JPG, GIF, WebP 이미지와 MP4, WebM 동영상을 지원합니다. 오디오 섹션에서는 MP3 파일뿐만 아니라 YouTube와 SoundCloud URL도 지원하여 쉽게 음악을 삽입할 수 있어요.',
        },
        {
          question: '모바일에서도 사용할 수 있나요?',
          answer:
            '네, StoryFlow Creator는 데스크탑, 태블릿, 모바일 환경을 모두 지원합니다. 어디서든 편집하고 프리뷰할 수 있어요. 만들어진 웹페이지도 모든 기기에서 자동으로 반응형으로 표시됩니다.',
        },
        {
          question: '작업물은 자동으로 저장되나요?',
          answer:
            '로그인한 상태에서는 클라우드에 자동 저장됩니다. 브라우저를 닫아도 안전하게 보관되어 있으며, 다른 기기에서도 이어서 작업할 수 있어요. Ctrl+Z/Y로 실행 취소/다시 실행도 가능합니다.',
        },
        {
          question: '세로 스크롤 스토리텔링이란 무엇인가요?',
          answer:
            '세로 스크롤 스토리텔링은 사용자가 페이지를 아래로 스크롤하면서 이야기가 전개되는 웹 디자인 방식입니다. 각 섹션이 전체 화면을 차지하며, 이미지와 텍스트가 조화롭게 배치되어 몰입감 있는 경험을 제공합니다. suzag.com과 같은 고급 웹사이트에서 흔히 사용되는 기법이에요.',
        },
      ],
    },
    cta: {
      title: '지금 바로 시작하세요',
      descriptionLine1:
        '코딩 없이 아름다운 웹페이지를 만드는 가장 쉬운 방법입니다.',
      descriptionLine2: '무료로 시작하고, 필요할 때 업그레이드하세요.',
      button: '무료로 시작하기',
      benefits: [
        '무료 플랜 영구 제공',
        '가입 없이 체험 가능',
        '설치 불필요',
      ],
    },
    footer: {
      description:
        '코딩 없이 누구나 쉽게 이미지로 웹페이지를 만들 수 있는 노코드 웹 빌더입니다.',
      productHeader: '제품',
      policyHeader: '정책',
      editor: '에디터',
      featuresIntro: '기능 소개',
      howToUse: '사용법',
      faqLink: '자주 묻는 질문',
      privacy: '개인정보처리방침',
      terms: '이용약관',
      contact: '문의하기',
      languageLabel: '한국어',
    },
  },
  en: {
    nav: {
      features: 'Features',
      howItWorks: 'How It Works',
      faq: 'FAQ',
      cta: 'Start Free',
    },
    hero: {
      badge: 'No coding required',
      titleLine1: 'Create Beautiful',
      titleLine2: 'Web Pages with Images',
      description:
        'Drag and drop images and text to create professional vertical scroll storytelling pages in minutes. No coding knowledge needed at all.',
      ctaPrimary: 'Start Free',
      ctaSecondary: 'Learn How It Works',
      subtitle: 'No signup required \u00B7 Free plan forever',
    },
    features: {
      sectionTitle: 'Powerful Yet Easy Features',
      sectionDescription:
        'We provide intuitive features so you can create professional web pages without complex coding or design tools.',
      items: [
        {
          title: 'Drag & Drop',
          description:
            'Simply drag and drop images and videos. No coding knowledge required at all.',
        },
        {
          title: '20+ Layouts',
          description:
            'Hero, split, gallery, card, carousel, stats, guestbook and many more layout templates available.',
        },
        {
          title: 'Live Preview',
          description:
            'Your edits are instantly reflected in the preview panel. See the final result in real time.',
        },
        {
          title: 'Typography Customization',
          description:
            'Freely customize 50+ Korean/English fonts, sizes, colors, and shadow effects.',
        },
        {
          title: 'Image Filters & Effects',
          description:
            'Set the mood with image filters like grayscale, sepia, blur and overlay effects.',
        },
        {
          title: 'Video Hero',
          description:
            'Add videos as backgrounds to create dynamic hero sections. YouTube URLs are also supported.',
        },
        {
          title: 'Audio Player',
          description:
            'Embed music or podcasts easily. Just paste YouTube or SoundCloud URLs directly.',
        },
        {
          title: 'Stats & Number Animation',
          description:
            'Create impressive statistics sections with animated count-up number effects.',
        },
        {
          title: 'Responsive Design',
          description:
            'Automatically generates responsive pages that look great on desktop, tablet, and mobile.',
        },
        {
          title: 'HTML/PDF/Image Export',
          description:
            'Export your finished pages as HTML files, PDF documents, PNG images and more.',
        },
        {
          title: 'Link Sharing',
          description:
            'Generate a sharing link with one click to share your web page with anyone.',
        },
        {
          title: '30+ Templates',
          description:
            'Choose from ready-made templates for portfolios, business, events, creative projects and more.',
        },
      ],
    },
    howItWorks: {
      sectionTitle: 'Complete in 4 Steps',
      sectionDescription:
        'Create a web page with just a few clicks \u2014 no complex process needed.',
      steps: [
        {
          title: 'Choose a Template or Start Fresh',
          description:
            'Pick from 30+ professional templates or start freely on a blank canvas.',
        },
        {
          title: 'Add Images and Text',
          description:
            'Drag and drop images, type your text. Freely change layouts, fonts, and colors.',
        },
        {
          title: 'Preview in Real Time',
          description:
            'See the final result instantly in the preview panel. Switch between desktop and mobile views.',
        },
        {
          title: 'Export or Share',
          description:
            'Export as HTML, PDF, or image, or generate a sharing link to show anyone.',
        },
      ],
    },
    useCases: {
      sectionTitle: 'Perfect For You',
      sectionDescription:
        'StoryFlow Creator is designed so anyone can easily create web pages for any purpose.',
      items: [
        {
          title: 'Portfolio',
          description:
            'Create stunning portfolio pages for photographers, designers, and illustrators. Beautifully showcase your work with gallery and masonry layouts.',
          target: 'Freelancers, Creators',
        },
        {
          title: 'Business Introduction',
          description:
            'Easily create introduction pages for cafes, restaurants, gyms, salons and more. Include menus, pricing, and location info all in one page.',
          target: 'Small Business Owners',
        },
        {
          title: 'Event Invitations',
          description:
            'Create digital invitations for weddings, birthday parties, reunions, and exhibitions. Even collect RSVPs with the guestbook feature.',
          target: 'Individuals, Companies',
        },
        {
          title: 'School Projects',
          description:
            'Turn reports, presentations, and project results into web pages. Export as PDF for document use as well.',
          target: 'Students, Teachers',
        },
        {
          title: 'Musicians & Artists',
          description:
            'Embed YouTube music, showcase album art in galleries, and introduce your performance schedule all in one page.',
          target: 'Musicians, Bands, DJs',
        },
        {
          title: 'Travel & Memories',
          description:
            'Combine travel photos and stories into a beautiful vertical scroll travelogue. Share the link with friends.',
          target: 'Travelers, Bloggers',
        },
      ],
    },
    faq: {
      sectionTitle: 'Frequently Asked Questions',
      sectionDescription:
        'Find answers to common questions about StoryFlow Creator.',
      items: [
        {
          question: 'Is StoryFlow Creator free?',
          answer:
            'Yes, StoryFlow Creator is free to use. The free plan includes 3 projects, 100MB media storage, and 10 exports per day. Upgrade to the Pro plan if you need more features.',
        },
        {
          question: 'Can I use it with zero coding knowledge?',
          answer:
            'Absolutely! StoryFlow Creator requires no coding knowledge at all. You can create beautiful web pages just by clicking and dragging. Simply type text, drag and drop images, and choose a layout.',
        },
        {
          question: 'What export formats are available?',
          answer:
            'You can export as HTML files, PDF documents, PNG images, individual section images, and thumbnails (OG images). HTML files work independently with no external dependencies, so you can use them on any web hosting.',
        },
        {
          question: 'Can I share my page with others?',
          answer:
            'Yes, using the share feature generates a unique link that you can send to anyone. No separate hosting or domain needed \u2014 share instantly.',
        },
        {
          question: 'What image and video formats are supported?',
          answer:
            'We support PNG, JPG, GIF, WebP images and MP4, WebM videos. The audio section also supports MP3 files as well as YouTube and SoundCloud URLs for easy music embedding.',
        },
        {
          question: 'Can I use it on mobile?',
          answer:
            'Yes, StoryFlow Creator supports desktop, tablet, and mobile environments. You can edit and preview from anywhere. Pages you create are also automatically responsive on all devices.',
        },
        {
          question: 'Is my work saved automatically?',
          answer:
            'When logged in, your work is automatically saved to the cloud. It\'s safely stored even if you close the browser, and you can continue working from any device. Undo/redo with Ctrl+Z/Y is also available.',
        },
        {
          question: 'What is vertical scroll storytelling?',
          answer:
            'Vertical scroll storytelling is a web design approach where the story unfolds as users scroll down the page. Each section fills the entire screen, with images and text harmoniously arranged for an immersive experience. It\'s a technique commonly used on premium websites like suzag.com.',
        },
      ],
    },
    cta: {
      title: 'Get Started Today',
      descriptionLine1:
        'The easiest way to create beautiful web pages without coding.',
      descriptionLine2: 'Start free and upgrade when you need to.',
      button: 'Start Free',
      benefits: [
        'Free plan forever',
        'No signup needed',
        'No installation',
      ],
    },
    footer: {
      description:
        'A no-code web builder that lets anyone easily create web pages with images, no coding required.',
      productHeader: 'Product',
      policyHeader: 'Policies',
      editor: 'Editor',
      featuresIntro: 'Features',
      howToUse: 'How It Works',
      faqLink: 'FAQ',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      contact: 'Contact Us',
      languageLabel: 'English',
    },
  },
};
