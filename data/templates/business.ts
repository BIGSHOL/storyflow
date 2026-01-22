import { LayoutType, Template } from '../../types';

export const businessTemplates: Template[] = [
    // ==================== Existing Templates ====================
    {
        id: 'product',
        name: '제품 소개',
        description: '제품이나 서비스를 소개하는 랜딩 페이지',
        category: 'business',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '혁신적인 제품',
                description: '당신의 일상을 바꿔줄 새로운 경험',
                mediaType: 'image',
                mediaUrl: '/images/templates/business/product-hero.png',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#000000',
                overlayOpacity: 0.5,
            },
            {
                layout: LayoutType.FULL_IMAGE_TEXT_OVERLAY,
                title: '특별한 기능',
                description: '왜 이 제품이 특별한지 설명해보세요. 사용자에게 어떤 가치를 제공하나요?',
                mediaType: 'image',
                mediaUrl: '/images/templates/business/product-feature.png',
                textAlignment: 'left',
                textColor: '#ffffff',
                backgroundColor: '#000000',
                overlayOpacity: 0.6,
            },
            {
                layout: LayoutType.SPLIT_LEFT,
                title: '편리한 사용법',
                description: '복잡한 설정 없이 바로 시작할 수 있습니다. 누구나 쉽게 사용할 수 있어요.',
                mediaType: 'image',
                mediaUrl: '/images/templates/business/product-usage.png',
                textAlignment: 'left',
                splitRatio: 50,
                textColor: '#ffffff',
                backgroundColor: '#111111',
            },
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '지금 시작하세요',
                description: '무료로 체험해보세요.\n\n문의: contact@example.com',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#000000',
            },
        ],
    },
    {
        id: 'company',
        name: '회사 소개',
        description: '기업의 비전과 가치를 전달하는 페이지',
        category: 'business',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '우리가 만드는 미래',
                description: '혁신과 신뢰로 세상을 바꿉니다',
                mediaType: 'image',
                mediaUrl: '/images/templates/business/company-hero.png',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#1a365d',
                overlayOpacity: 0.5,
            },
            {
                layout: LayoutType.STATS,
                title: '숫자로 보는 성과',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#2d3748',
                stats: [
                    { id: '1', value: '10+', label: '설립 연차' },
                    { id: '2', value: '500+', label: '고객사' },
                    { id: '3', value: '50+', label: '팀원' },
                ],
            },
            {
                layout: LayoutType.SPLIT_RIGHT,
                title: '우리의 미션',
                description: '기술과 창의력으로 고객의 성공을 돕습니다. 최고의 품질과 서비스를 약속드립니다.',
                mediaType: 'image',
                mediaUrl: '/images/templates/business/company-meeting.png',
                textAlignment: 'left',
                splitRatio: 50,
                textColor: '#ffffff',
                backgroundColor: '#1a365d',
            },
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '함께해요',
                description: 'partnership@company.com',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#2d3748',
            },
        ],
    },
    {
        id: 'service',
        name: '서비스 랜딩',
        description: '서비스의 핵심 기능을 소개하는 페이지',
        category: 'business',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '더 나은 방법이 있습니다',
                description: '업무 효율을 200% 높여주는 솔루션',
                mediaType: 'image',
                mediaUrl: '/images/templates/business/service-hero.png',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#4c1d95',
                overlayOpacity: 0.4,
            },
            {
                layout: LayoutType.CARDS,
                title: '핵심 기능',
                description: '왜 우리 서비스를 선택해야 하는지',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#2e1065',
                cards: [
                    { id: '1', title: '빠른 속도', description: '기존 대비 3배 빠른 처리 속도', imageUrl: '/images/templates/business/service-fast.png' },
                    { id: '2', title: '쉬운 사용', description: '직관적인 인터페이스', imageUrl: '/images/templates/business/service-ui.png' },
                    { id: '3', title: '24/7 지원', description: '언제든 도움을 받으세요', imageUrl: '/images/templates/business/service-support.png' },
                ],
            },
            {
                layout: LayoutType.QUOTE,
                title: '',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#4c1d95',
                quoteText: '이 서비스를 사용한 후 업무 시간이 절반으로 줄었습니다.',
                quoteAuthor: '김철수, ABC 기업 대표',
            },
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '지금 시작하세요',
                description: '14일 무료 체험 가능\nstart@service.com',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#2e1065',
            },
        ],
    },
    {
        id: 'pricing',
        name: '프라이싱',
        description: '가격 정책과 플랜을 소개하는 페이지',
        category: 'business',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '합리적인 가격',
                description: '필요한 만큼만 선택하세요',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#059669',
                overlayOpacity: 0.3,
            },
            {
                layout: LayoutType.CARDS,
                title: '요금제 선택',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#064e3b',
                cards: [
                    { id: '1', title: '스타터', description: '월 9,900원\n기본 기능 제공' },
                    { id: '2', title: '프로', description: '월 29,900원\n모든 기능 + 우선 지원' },
                    { id: '3', title: '엔터프라이즈', description: '문의\n맞춤형 솔루션' },
                ],
            },
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '자주 묻는 질문',
                description: '결제는 언제든 취소할 수 있습니다.\n모든 플랜에 14일 무료 체험 포함',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#059669',
            },
        ],
    },
    {
        id: 'restaurant',
        name: '레스토랑/카페',
        description: '레스토랑이나 카페를 소개하는 페이지',
        category: 'business',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '맛있는 순간',
                description: '당신을 위한 특별한 식사',
                mediaType: 'image',
                mediaUrl: '/images/templates/business/restaurant-hero.png',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#7c2d12',
                overlayOpacity: 0.4,
            },
            {
                layout: LayoutType.SPLIT_RIGHT,
                title: '오늘의 특선 메뉴',
                description: '계절의 신선한 재료로 만드는 정성 가득한 요리',
                mediaType: 'image',
                mediaUrl: '/images/templates/business/restaurant-dish.png',
                textAlignment: 'left',
                splitRatio: 50,
                textColor: '#ffffff',
                backgroundColor: '#431407',
            },
            {
                layout: LayoutType.CARDS,
                title: '시그니처 메뉴',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#7c2d12',
                cards: [
                    { id: '1', title: '스테이크', description: '35,000원\n프리미엄 한우', imageUrl: '/images/templates/business/restaurant-steak.png' },
                    { id: '2', title: '파스타', description: '18,000원\n수제 면발', imageUrl: '/images/templates/business/restaurant-pasta.png' },
                    { id: '3', title: '리조또', description: '22,000원\n이탈리안 스타일', imageUrl: '/images/templates/business/restaurant-risotto.png' },
                ],
            },
            {
                layout: LayoutType.SPLIT_LEFT,
                title: '방문 안내',
                description: '영업시간: 11:00 - 22:00 (라스트 오더 21:00)\n정기휴무: 매주 월요일\n\n주소: 서울시 강남구 테헤란로 123\n예약: 02-1234-5678',
                mediaType: 'image',
                mediaUrl: '/images/templates/business/restaurant-interior.png',
                textAlignment: 'left',
                splitRatio: 50,
                textColor: '#ffffff',
                backgroundColor: '#431407',
            },
        ],
    },
    {
        id: 'real-estate',
        name: '부동산 소개',
        description: '매물이나 부동산을 소개하는 페이지',
        category: 'business',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '당신의 꿈을 현실로',
                description: '완벽한 공간을 찾아드립니다',
                mediaType: 'image',
                mediaUrl: '/images/templates/business/realestate-hero.png',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#1e40af',
                overlayOpacity: 0.5,
            },
            {
                layout: LayoutType.SPLIT_LEFT,
                title: '프리미엄 아파트',
                description: '강남 중심부 위치\n전용면적 85㎡ / 3룸 2욕실\n남향 / 고층 / 한강뷰\n\n매매가: 15억원',
                mediaType: 'image',
                mediaUrl: '/images/templates/business/realestate-apartment.png',
                textAlignment: 'left',
                splitRatio: 50,
                textColor: '#ffffff',
                backgroundColor: '#1e3a8a',
            },
            {
                layout: LayoutType.GALLERY,
                title: '내부 사진',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#1e40af',
                galleryImages: [
                    { id: '1', url: '/images/templates/business/realestate-livingroom.png', caption: '거실' },
                    { id: '2', url: '/images/templates/business/realestate-kitchen.png', caption: '주방' },
                    { id: '3', url: '/images/templates/business/realestate-bedroom.png', caption: '안방' },
                    { id: '4', url: '/images/templates/business/realestate-bathroom.png', caption: '욕실' },
                ],
                gallerySettings: { columns: 2, gap: 16, showCaptions: true },
            },
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '문의하기',
                description: '방문 상담 환영\n\n담당 중개사: 홍길동\n연락처: 010-1234-5678\nestate@example.com',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#1e3a8a',
            },
        ],
    },
    {
        id: 'saas',
        name: 'SaaS 랜딩',
        description: 'SaaS 제품을 위한 모던한 랜딩 페이지',
        category: 'business',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '팀 협업의 새로운 기준',
                description: '모든 것을 한 곳에서, 더 스마트하게',
                mediaType: 'image',
                mediaUrl: '/images/templates/business/saas-hero.png',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#0f172a',
                overlayOpacity: 0.5,
            },
            {
                layout: LayoutType.SPLIT_LEFT,
                title: '실시간 협업',
                description: '팀원들과 실시간으로 문서를 편집하고 피드백을 주고받으세요.',
                mediaType: 'image',
                mediaUrl: '/images/templates/business/saas-collaboration.png',
                textAlignment: 'left',
                splitRatio: 50,
                textColor: '#ffffff',
                backgroundColor: '#1e293b',
            },
            {
                layout: LayoutType.SPLIT_RIGHT,
                title: '강력한 통합',
                description: '이미 사용 중인 도구들과 완벽하게 연동됩니다.',
                mediaType: 'image',
                mediaUrl: '/images/templates/business/saas-integration.png',
                textAlignment: 'left',
                splitRatio: 50,
                textColor: '#ffffff',
                backgroundColor: '#0f172a',
            },
            {
                layout: LayoutType.STATS,
                title: '',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#1e293b',
                stats: [
                    { id: '1', value: '99.9%', label: '가동률' },
                    { id: '2', value: '2M+', label: '사용자' },
                    { id: '3', value: '150+', label: '연동 앱' },
                ],
            },
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '무료로 시작하세요',
                description: '신용카드 없이 바로 시작',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#0f172a',
            },
        ],
    },

    // ==================== New Templates ====================
    {
        id: 'startup-pitch',
        name: '스타트업 피칭',
        description: '투자자에게 사업을 소개하는 피치덱',
        category: 'business',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '문제점과 해결책',
                description: '우리는 시장의 문제를 이렇게 해결합니다',
                mediaType: 'image',
                mediaUrl: '/images/templates/business/startup-presentation.png',
                textColor: '#ffffff',
                backgroundColor: '#111827',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.STATS,
                title: '시장 규모',
                description: '폭발적으로 성장하는 시장',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#ffffff',
                backgroundColor: '#1f2937',
                textAlignment: 'center',
                stats: [
                    { id: '1', value: '$50B', label: 'TAM' },
                    { id: '2', value: '$10B', label: 'SAM' },
                    { id: '3', value: '$100M', label: 'SOM' },
                ]
            },
            {
                layout: LayoutType.TIMELINE,
                title: '로드맵',
                description: '성장 계획',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#ffffff',
                backgroundColor: '#111827',
                textAlignment: 'left',
                timelineItems: [
                    { id: '1', date: '2025 Q1', title: 'MVP 출시', description: '' },
                    { id: '2', date: '2025 Q3', title: '50만 사용자', description: '' },
                    { id: '3', date: '2026 Q1', title: '글로벌 진출', description: '' },
                ]
            }
        ]
    },
    {
        id: 'app-landing',
        name: '앱 출시 랜딩',
        description: '모바일 앱 다운로드 유도 페이지',
        category: 'business',
        sections: [
            {
                layout: LayoutType.SPLIT_RIGHT,
                title: '내 손안의 모든 것',
                description: '지금 바로 다운로드하여 새로운 세상을 경험하세요.',
                mediaType: 'image',
                mediaUrl: '/images/templates/business/app-smartphone.png',
                textColor: '#ffffff',
                backgroundColor: '#4f46e5',
                textAlignment: 'left',
                ctaButton: {
                    enabled: true,
                    text: '다운로드',
                    link: '#',
                    style: 'solid',
                    color: '#000000',
                    size: 'large'
                }
            },
            {
                layout: LayoutType.CARDS,
                title: '주요 기능',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#ffffff',
                backgroundColor: '#4338ca',
                textAlignment: 'center',
                cards: [
                    { id: '1', title: '간편한 가입', description: '3초면 시작할 수 있습니다', imageUrl: '/images/templates/business/app-signup.png' },
                    { id: '2', title: '강력한 보안', description: '안전하게 데이터를 보호합니다', imageUrl: '/images/templates/business/app-security.png' },
                    { id: '3', title: '클라우드 동기화', description: '어디서나 이어서 사용하세요', imageUrl: '/images/templates/business/app-cloud.png' }
                ]
            }
        ]
    },
    {
        id: 'online-store',
        name: '온라인 스토어',
        description: '상품 판매를 위한 쇼핑몰 템플릿',
        category: 'business',
        sections: [
            {
                layout: LayoutType.HERO,
                title: 'SUMMER SALE',
                description: '최대 50% 할인, 여름 시즌 오프',
                mediaType: 'image',
                mediaUrl: '/images/templates/business/store-summer.png',
                textColor: '#000000',
                backgroundColor: '#fde047',
                textAlignment: 'center',
                ctaButton: { enabled: true, text: '쇼핑하기', link: '#', style: 'solid', color: '#000000', size: 'large' }
            },
            {
                layout: LayoutType.GALLERY,
                title: '베스트 셀러',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#000000',
                backgroundColor: '#ffffff',
                textAlignment: 'center',
                galleryImages: [
                    { id: '1', url: '/images/templates/business/store-dress.png', caption: '상품 A' },
                    { id: '2', url: '/images/templates/business/store-shirt.png', caption: '상품 B' },
                    { id: '3', url: '/images/templates/business/store-shoes.png', caption: '상품 C' },
                    { id: '4', url: '/images/templates/business/store-bag.png', caption: '상품 D' }
                ],
                gallerySettings: { columns: 2, gap: 10, showCaptions: true }
            }
        ]
    },
    {
        id: 'hotel-resort',
        name: '호텔/리조트',
        description: '숙박 시설 소개 및 예약',
        category: 'business',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '도심 속의 휴식',
                description: '프리미엄 럭셔리 스테이',
                mediaType: 'image',
                mediaUrl: '/images/templates/business/hotel-luxury.png',
                textColor: '#ffffff',
                backgroundColor: '#0c4a6e',
                textAlignment: 'center',
                overlayOpacity: 0.3
            },
            {
                layout: LayoutType.CAROUSEL,
                title: '객실 미리보기',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#ffffff',
                backgroundColor: '#075985',
                textAlignment: 'center',
                carouselImages: [
                    { id: '1', url: '/images/templates/business/hotel-room.png', title: '디럭스 룸' },
                    { id: '2', url: '/images/templates/business/hotel-suite.png', title: '스위트 룸' },
                    { id: '3', url: '/images/templates/business/hotel-pool.png', title: '인피니티 풀' }
                ]
            }
        ]
    },
    {
        id: 'hospital',
        name: '병원/클리닉',
        description: '병원 진료 안내 및 의료진 소개',
        category: 'business',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '여러분의 건강 지킴이',
                description: '정직하고 바른 진료를 약속합니다',
                mediaType: 'image',
                mediaUrl: '/images/templates/business/hospital-hero.png',
                textColor: '#ffffff',
                backgroundColor: '#059669',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.SPLIT_LEFT,
                title: '진료 과목',
                description: '내과 / 소아과 / 이비인후과\n건강검진 센터 운영\n\n평일 야간 진료 시행',
                mediaType: 'image',
                mediaUrl: '/images/templates/business/hospital-doctor.png',
                textColor: '#ffffff',
                backgroundColor: '#047857',
                textAlignment: 'left'
            },
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '진료 시간',
                description: '평일: 09:00 - 20:00\n토요일: 09:00 - 14:00\n점심시간: 13:00 - 14:00',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#ffffff',
                backgroundColor: '#059669',
                textAlignment: 'center'
            }
        ]
    },
    {
        id: 'gym',
        name: '헬스장/피트니스',
        description: '운동 시설 및 트레이너 소개',
        category: 'business',
        sections: [
            {
                layout: LayoutType.VIDEO_HERO,
                title: 'BE STRONG',
                description: '최고의 시설에서 시작하는 변화',
                mediaType: 'image',
                mediaUrl: '/images/templates/business/gym-hero.png',
                textColor: '#ffffff',
                backgroundColor: '#171717',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.STATS,
                title: '왜 우리인가',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#ffffff',
                backgroundColor: '#262626',
                textAlignment: 'center',
                stats: [
                    { id: '1', value: '500평', label: '규모' },
                    { id: '2', value: '50+', label: '머신' },
                    { id: '3', value: '24h', label: '운영' }
                ]
            }
        ]
    },
    {
        id: 'academy',
        name: '학원/교육기관',
        description: '커리큘럼 및 학원 소개',
        category: 'business',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '꿈을 향한 도전',
                description: '체계적인 커리큘럼으로 합격까지',
                mediaType: 'image',
                mediaUrl: '/images/templates/business/academy-classroom.png',
                textColor: '#000000',
                backgroundColor: '#fbbf24',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.CARDS,
                title: '수업 과정',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#000000',
                backgroundColor: '#f59e0b',
                textAlignment: 'center',
                cards: [
                    { id: '1', title: '입문반', description: '기초부터 탄탄하게', imageUrl: '/images/templates/business/academy-book.png' },
                    { id: '2', title: '심화반', description: '실전 문제 풀이', imageUrl: 'https://loremflickr.com/400/300/study?lock=44' },
                    { id: '3', title: '특강', description: '방학 집중 과정', imageUrl: 'https://loremflickr.com/400/300/lecture?lock=45' }
                ]
            }
        ]
    },
    {
        id: 'law-firm',
        name: '법률사무소',
        description: '변호사 소개 및 법률 서비스 안내',
        category: 'business',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '든든한 법률 파트너',
                description: '당신의 권리를 지켜드립니다',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/law?lock=46',
                textColor: '#ffffff',
                backgroundColor: '#1e3a8a',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '전문 분야',
                description: '민사 / 형사 / 가사 / 기업법무\n\n무료 법률 상담 진행 중',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#ffffff',
                backgroundColor: '#1e40af',
                textAlignment: 'center'
            }
        ]
    },
    {
        id: 'beauty-salon',
        name: '뷰티/살롱',
        description: '헤어, 네일, 뷰티 서비스 소개',
        category: 'business',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '당신만의 스타일',
                description: '프리미엄 뷰티 살롱',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/salon?lock=47',
                textColor: '#000000',
                backgroundColor: '#fce7f3',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.GALLERY,
                title: '스타일북',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#000000',
                backgroundColor: '#fbcfe8',
                textAlignment: 'center',
                galleryImages: [
                    { id: '1', url: 'https://loremflickr.com/600/800/hair?lock=48', caption: '펌' },
                    { id: '2', url: 'https://loremflickr.com/600/800/hairstyle?lock=49', caption: '염색' },
                    { id: '3', url: 'https://loremflickr.com/600/800/haircut?lock=50', caption: '커트' }
                ]
            }
        ]
    },
    {
        id: 'real-estate-sale',
        name: '부동산 분양',
        description: '아파트, 오피스텔 분양 광고',
        category: 'business',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '그랜드 오픈',
                description: '강남의 마지막 기회, 선착순 분양',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/building?lock=51',
                textColor: '#ffffff',
                backgroundColor: '#7f1d1d',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.SPLIT_LEFT,
                title: '입지 조건',
                description: '트리플 역세권\n명문 학군 인접\n프리미엄 생활 인프라',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/800/600/citymap?lock=52',
                textColor: '#ffffff',
                backgroundColor: '#991b1b',
                textAlignment: 'left'
            }
        ]
    },
    {
        id: 'recruitment',
        name: '채용 공고',
        description: '인재 영입 및 회사 복지 소개',
        category: 'business',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '인재를 모집합니다',
                description: '세상을 바꿀 동료를 찾습니다',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/team?lock=53',
                textColor: '#ffffff',
                backgroundColor: '#2563eb',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.CARDS,
                title: '모집 분야',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#ffffff',
                backgroundColor: '#3b82f6',
                textAlignment: 'center',
                cards: [
                    { id: '1', title: '프론트엔드', description: 'React, TS', imageUrl: 'https://loremflickr.com/400/300/code?lock=54' },
                    { id: '2', title: '백엔드', description: 'Node.js, AWS', imageUrl: 'https://loremflickr.com/400/300/server?lock=55' },
                    { id: '3', title: '디자인', description: '제품 디자인', imageUrl: 'https://loremflickr.com/400/300/design?lock=56' }
                ]
            }
        ]
    },
    {
        id: 'newsletter',
        name: '뉴스레터 랜딩',
        description: '뉴스레터 구독 유도 페이지',
        category: 'business',
        sections: [
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '매주 월요일 아침',
                description: '가장 핫한 트렌드를 메일함으로 보내드립니다.',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/mail?lock=57',
                textColor: '#000000',
                backgroundColor: '#e5e7eb',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.SPLIT_LEFT,
                title: '지난 뉴스레터',
                description: '미리 확인해보세요.\n인사이트 넘치는 콘텐츠가 가득합니다.',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/800/600/newspaper?lock=58',
                textColor: '#000000',
                backgroundColor: '#f3f4f6',
                textAlignment: 'left'
            }
        ]
    },
    {
        id: 'freelancer',
        name: '프리랜서 서비스',
        description: '개인 전문가의 서비스 견적 제안',
        category: 'business',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '전문 번역 서비스',
                description: '빠르고 정확하게 번역해드립니다',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/typing?lock=59',
                textColor: '#333333',
                backgroundColor: '#f3f4f6',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.CARDS,
                title: '서비스 가격',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#333333',
                backgroundColor: '#ffffff',
                textAlignment: 'center',
                cards: [
                    { id: '1', title: '일반 번역', description: '장당 1만원' },
                    { id: '2', title: '전문 번역', description: '장당 3만원' },
                    { id: '3', title: '긴급 번역', description: '협의' }
                ]
            }
        ]
    },
    {
        id: 'consulting',
        name: '컨설팅',
        description: '비즈니스 컨설팅 전문가 소개',
        category: 'business',
        sections: [
            {
                layout: LayoutType.SPLIT_RIGHT,
                title: '성장을 위한 전략',
                description: '10년의 노하우로 비즈니스 문제를 해결합니다.',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/800/600/shakehand?lock=60',
                textColor: '#ffffff',
                backgroundColor: '#0f172a',
                textAlignment: 'left'
            },
            {
                layout: LayoutType.STATS,
                title: '성과',
                mediaType: 'none',
                mediaUrl: '',
                description: '',
                textColor: '#ffffff',
                backgroundColor: '#1e293b',
                textAlignment: 'center',
                stats: [
                    { id: '1', value: '200%', label: '매출 성장' },
                    { id: '2', value: '50+', label: '컨설팅 기업' }
                ]
            }
        ]
    },
    {
        id: 'crowdfunding',
        name: '크라우드펀딩',
        description: '텀블벅, 와디즈 스타일 상세페이지',
        category: 'business',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '세상에 없던 가방',
                description: '펀딩 오픈 10분만에 100% 달성!',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/backpack?lock=61',
                textColor: '#000000',
                backgroundColor: '#e2e8f0',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '프로젝트 스토리',
                description: '왜 이 제품을 만들게 되었을까요?\n우리의 고민과 해결 과정을 소개합니다.',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/600/400/sketch?lock=62',
                textColor: '#000000',
                backgroundColor: '#f1f5f9',
                textAlignment: 'left'
            }
        ]
    },
    {
        id: 'online-course',
        name: '온라인 코스',
        description: '강의 판매 및 커리큘럼 소개',
        category: 'business',
        sections: [
            {
                layout: LayoutType.VIDEO_HERO,
                title: '마스터클래스',
                description: '업계 최고에게 배우는 실전 노하우',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/tutor?lock=63',
                textColor: '#ffffff',
                backgroundColor: '#000000',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.TIMELINE,
                title: '커리큘럼',
                description: '총 10주 완성 과정',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#ffffff',
                backgroundColor: '#111111',
                textAlignment: 'left',
                timelineItems: [
                    { id: '1', date: '1-3주차', title: '기초 다지기', description: '' },
                    { id: '2', date: '4-7주차', title: '심화 응용', description: '' },
                    { id: '3', date: '8-10주차', title: '파이널 프로젝트', description: '' }
                ]
            }
        ]
    },
    {
        id: 'webinar',
        name: '웨비나',
        description: '온라인 세미나 등록 유도',
        category: 'business',
        sections: [
            {
                layout: LayoutType.HERO,
                title: 'LIVE WEBINAR',
                description: '디지털 마케팅 트렌드 2024\n2024.10.10 (목) 20:00',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/webinar?lock=64',
                textColor: '#ffffff',
                backgroundColor: '#4c1d95',
                textAlignment: 'center',
                ctaButton: { enabled: true, text: '무료 신청하기', link: '#', style: 'solid', color: '#ffffff', size: 'large' }
            }
        ]
    },
    {
        id: 'press-kit',
        name: '프레스킷',
        description: '언론 홍보용 자료 모음',
        category: 'business',
        sections: [
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '프레스 자료',
                description: 'StoryFlow의 브랜드 자산을 소개합니다.\n로고, 보도자료, 이미지를 다운로드하세요.',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#000000',
                backgroundColor: '#ffffff',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.GALLERY,
                title: '브랜드 자산',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#000000',
                backgroundColor: '#f9fafb',
                textAlignment: 'center',
                galleryImages: [
                    { id: '1', url: 'https://loremflickr.com/600/400/logo?lock=65', caption: '로고 라이트' },
                    { id: '2', url: 'https://loremflickr.com/600/400/symbol?lock=66', caption: '로고 다크' },
                    { id: '3', url: 'https://loremflickr.com/600/400/icon?lock=67', caption: '심볼' }
                ]
            }
        ]
    },
    {
        id: 'sponsorship',
        name: '이벤트 스폰서십',
        description: '행사 후원 및 협찬 제안서',
        category: 'business',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '함께 하세요',
                description: '국내 최대 개발자 컨퍼런스 후원 제안',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/audience?lock=68',
                textColor: '#ffffff',
                backgroundColor: '#1f2937',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.CARDS,
                title: '후원 혜택',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#ffffff',
                backgroundColor: '#374151',
                textAlignment: 'center',
                cards: [
                    { id: '1', title: '브랜드 노출', description: '현수막, 배너 광고' },
                    { id: '2', title: '부스 운영', description: '채용 및 홍보 부스' },
                    { id: '3', title: '네트워킹', description: 'VIP 디너 초대' }
                ]
            }
        ]
    },
    {
        id: 'notice',
        name: '공식 공지',
        description: '서비스 점검 또는 공지사항',
        category: 'business',
        sections: [
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '서비스 점검 안내',
                description: '서버 안정화를 위해 점검을 진행합니다.\n\n일시: 2024.11.01 02:00 ~ 06:00 (4시간)\n이용에 불편을 드려 죄송합니다.',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#000000',
                backgroundColor: '#f3f4f6',
                textAlignment: 'center'
            }
        ]
    }
];
