import { LayoutType, Template } from '../../types';

export const creativeTemplates: Template[] = [
    // ==================== Existing Templates ====================
    {
        id: 'portfolio',
        name: '포트폴리오',
        description: '작품을 소개하는 심플한 포트폴리오',
        category: 'creative',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '안녕하세요',
                description: '저는 디자이너 홍길동입니다',
                mediaType: 'image',
                mediaUrl: '/images/templates/creative/portfolio-art.png',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#1a1a2e',
                overlayOpacity: 0.3,
            },
            {
                layout: LayoutType.SPLIT_LEFT,
                title: '첫 번째 작품',
                description: '이 작품에 대한 설명을 작성하세요. 어떤 도구를 사용했는지, 어떤 의도로 만들었는지 설명해보세요.',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/800/600/design?lock=101',
                textAlignment: 'left',
                splitRatio: 50,
                textColor: '#ffffff',
                backgroundColor: '#16213e',
            },
            {
                layout: LayoutType.SPLIT_RIGHT,
                title: '두 번째 작품',
                description: '또 다른 작품에 대한 설명입니다. 작업 과정이나 결과물의 특징을 공유해보세요.',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/800/600/creative?lock=102',
                textAlignment: 'left',
                splitRatio: 50,
                textColor: '#ffffff',
                backgroundColor: '#0f3460',
            },
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '연락하기',
                description: 'email@example.com\n\n함께 일해보고 싶으시다면 편하게 연락주세요.',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#1a1a2e',
            },
        ],
    },
    {
        id: 'photo-gallery',
        name: '사진 갤러리',
        description: '사진 작품을 아름답게 전시하는 갤러리',
        category: 'creative',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '순간을 담다',
                description: '사진 by 홍길동',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/camera?lock=103',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#18181b',
                overlayOpacity: 0.4,
            },
            {
                layout: LayoutType.GALLERY,
                title: '최근 작품',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#27272a',
                galleryImages: [
                    { id: '1', url: 'https://loremflickr.com/800/600/nature?lock=104', caption: '작품 1' },
                    { id: '2', url: 'https://loremflickr.com/800/600/city?lock=105', caption: '작품 2' },
                    { id: '3', url: 'https://loremflickr.com/800/600/people?lock=106', caption: '작품 3' },
                    { id: '4', url: 'https://loremflickr.com/800/600/animal?lock=107', caption: '작품 4' },
                    { id: '5', url: 'https://loremflickr.com/800/600/flower?lock=108', caption: '작품 5' },
                    { id: '6', url: 'https://loremflickr.com/800/600/sea?lock=109', caption: '작품 6' },
                ],
                gallerySettings: { columns: 3, gap: 16, showCaptions: true },
            },
            {
                layout: LayoutType.QUOTE,
                title: '',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#18181b',
                quoteText: '사진은 보는 것이 아니라 느끼는 것이다.',
                quoteAuthor: '홍길동',
            },
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '작업 의뢰',
                description: 'photo@example.com\nInstagram: @photographer',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#27272a',
            },
        ],
    },
    {
        id: 'artwork',
        name: '아트워크 전시',
        description: '그림과 일러스트 작품 전시',
        category: 'creative',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '상상을 현실로',
                description: '디지털 아트 전시',
                mediaType: 'image',
                mediaUrl: '/images/templates/creative/artwork-abstract.png',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#312e81',
                overlayOpacity: 0.5,
            },
            {
                layout: LayoutType.FULL_IMAGE_TEXT_OVERLAY,
                title: '시리즈 A',
                description: '도시의 밤을 주제로 한 연작',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/neon?lock=111',
                textAlignment: 'left',
                textColor: '#ffffff',
                backgroundColor: '#1e1b4b',
                overlayOpacity: 0.5,
            },
            {
                layout: LayoutType.GALLERY,
                title: '작품 모음',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#312e81',
                galleryImages: [
                    { id: '1', url: 'https://loremflickr.com/800/800/abstract?lock=112', caption: '작품 1' },
                    { id: '2', url: 'https://loremflickr.com/800/800/watercolor?lock=113', caption: '작품 2' },
                    { id: '3', url: 'https://loremflickr.com/800/800/oilpainting?lock=114', caption: '작품 3' },
                    { id: '4', url: 'https://loremflickr.com/800/800/sketch?lock=115', caption: '작품 4' },
                ],
                gallerySettings: { columns: 2, gap: 24, showCaptions: true },
            },
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '전시 문의',
                description: 'art@example.com',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#1e1b4b',
            },
        ],
    },
    {
        id: 'design-showcase',
        name: '디자인 쇼케이스',
        description: 'UI/UX 디자인 프로젝트 전시',
        category: 'creative',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '디자인으로 문제를 해결합니다',
                description: 'UI/UX 디자이너 포트폴리오',
                mediaType: 'image',
                mediaUrl: '/images/templates/creative/design-workspace.png',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#0c4a6e',
                overlayOpacity: 0.3,
            },
            {
                layout: LayoutType.SPLIT_LEFT,
                title: '프로젝트 A',
                description: '핀테크 앱 리디자인\n사용자 만족도 40% 향상',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/800/600/mobileapp?lock=117',
                textAlignment: 'left',
                splitRatio: 55,
                textColor: '#ffffff',
                backgroundColor: '#075985',
            },
            {
                layout: LayoutType.SPLIT_RIGHT,
                title: '프로젝트 B',
                description: '이커머스 웹사이트\n전환율 25% 개선',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/800/600/website?lock=118',
                textAlignment: 'left',
                splitRatio: 55,
                textColor: '#ffffff',
                backgroundColor: '#0c4a6e',
            },
            {
                layout: LayoutType.CARDS,
                title: '스킬셋',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#075985',
                cards: [
                    { id: '1', title: 'Figma', description: 'UI 디자인' },
                    { id: '2', title: 'Framer', description: '프로토타이핑' },
                    { id: '3', title: 'Webflow', description: '노코드 개발' },
                ],
            },
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '함께 프로젝트를 진행해요',
                description: 'design@example.com',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#0c4a6e',
            },
        ],
    },
    {
        id: 'music-band',
        name: '음악/밴드',
        description: '뮤지션이나 밴드를 소개하는 페이지',
        category: 'creative',
        sections: [
            {
                layout: LayoutType.VIDEO_HERO,
                title: 'The Rockers',
                description: '우리는 음악을 들어보세요',
                mediaType: 'image', // fallback
                mediaUrl: 'https://loremflickr.com/1280/720/concert?lock=119',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#991b1b',
                overlayOpacity: 0.5,
                videoHeroSettings: { autoPlay: true, muted: true, loop: true },
            },
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '소개',
                description: '2020년 결성된 4인조 록 밴드\n감성적인 멜로디와 강렬한 사운드',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#7f1d1d',
            },
            {
                layout: LayoutType.TIMELINE,
                title: '음반 & 공연',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'left',
                textColor: '#ffffff',
                backgroundColor: '#991b1b',
                timelineItems: [
                    { id: '1', date: '2024.06', title: '3집 발매', description: '"Echoes of Tomorrow"' },
                    { id: '2', date: '2023.12', title: '단독 콘서트', description: '올림픽공원 체조경기장' },
                    { id: '3', date: '2022.03', title: '2집 발매', description: '"Midnight Dreams"' },
                ],
                timelineAlignment: 'alternate',
            },
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '공연 문의',
                description: 'Spotify, Apple Music, YouTube에서 들으실 수 있어요\n\n공연 및 협업 문의: music@example.com',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#7f1d1d',
            },
        ],
    },
    {
        id: 'video-portfolio',
        name: '영상 포트폴리오',
        description: '영상 작업물을 보여주는 포트폴리오',
        category: 'creative',
        sections: [
            {
                layout: LayoutType.VIDEO_HERO,
                title: '스토리를 영상으로',
                description: '영상 제작',
                mediaType: 'image', // fallback
                mediaUrl: 'https://loremflickr.com/1280/720/film?lock=120',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#171717',
                overlayOpacity: 0.4,
                videoHeroSettings: { autoPlay: true, muted: true, loop: true },
            },
            {
                layout: LayoutType.SPLIT_LEFT,
                title: '브랜드 영상',
                description: '기업의 가치를 영상으로 전달합니다.',
                mediaType: 'image', // video placeholder
                mediaUrl: 'https://loremflickr.com/800/600/filming?lock=121',
                textAlignment: 'left',
                splitRatio: 50,
                textColor: '#ffffff',
                backgroundColor: '#262626',
            },
            {
                layout: LayoutType.SPLIT_RIGHT,
                title: '뮤직비디오',
                description: '음악과 영상의 조화',
                mediaType: 'image', // video placeholder
                mediaUrl: 'https://loremflickr.com/800/600/camera?lock=122',
                textAlignment: 'left',
                splitRatio: 50,
                textColor: '#ffffff',
                backgroundColor: '#171717',
            },
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '프로젝트 문의',
                description: 'video@example.com\nYouTube: @videocreator',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#262626',
            },
        ],
    },

    // ==================== New Templates ====================
    {
        id: 'webtoon',
        name: '웹툰/만화',
        description: '웹툰 작가 포트폴리오 및 에피소드',
        category: 'creative',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '웹툰 작가 김펜선',
                description: '일상을 유쾌하게, 상상을 현실로',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/comic?lock=123',
                textColor: '#000000',
                backgroundColor: '#ffffff',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.CAROUSEL,
                title: '대표 작품',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#000000',
                backgroundColor: '#f3f4f6',
                textAlignment: 'center',
                carouselImages: [
                    { id: '1', url: 'https://loremflickr.com/600/400/cartoon?lock=124', title: '우리집 고양이' },
                    { id: '2', url: 'https://loremflickr.com/600/400/drawing?lock=125', title: '출근길 용사님' },
                    { id: '3', url: 'https://loremflickr.com/600/400/sketch?lock=126', title: '단편선' }
                ]
            }
        ]
    },
    {
        id: 'illustrator',
        name: '일러스트레이터',
        description: '디지털 일러스트 및 캐릭터 디자인',
        category: 'creative',
        sections: [
            {
                layout: LayoutType.MASONRY,
                title: '작품들',
                description: '따뜻한 감성을 그립니다',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#000000',
                backgroundColor: '#fff7ed',
                textAlignment: 'center',
                masonryImages: [
                    { id: '1', url: 'https://loremflickr.com/600/800/illustration?lock=127' },
                    { id: '2', url: 'https://loremflickr.com/600/600/drawing?lock=128' },
                    { id: '3', url: 'https://loremflickr.com/600/900/art?lock=129' },
                    { id: '4', url: 'https://loremflickr.com/600/700/painting?lock=130' },
                    { id: '5', url: 'https://loremflickr.com/600/600/sketch?lock=131' }
                ],
                masonrySettings: { columns: 3, gap: 12, showCaptions: false, rounded: true, hoverEffect: true }
            }
        ]
    },
    {
        id: '3d-artist',
        name: '3D 아티스트',
        description: '3D 모델링 및 렌더링 포트폴리오',
        category: 'creative',
        sections: [
            {
                layout: LayoutType.VIDEO_HERO,
                title: '현실을 넘어서',
                description: '3D 캐릭터 & 환경 아티스트',
                mediaType: 'image', // fallback
                mediaUrl: 'https://loremflickr.com/1280/720/3d?lock=132',
                textColor: '#ffffff',
                backgroundColor: '#000000',
                textAlignment: 'center',
                videoHeroSettings: { autoPlay: true, muted: true, loop: true }
            },
            {
                layout: LayoutType.GALLERY,
                title: '렌더링 작품',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#ffffff',
                backgroundColor: '#111111',
                textAlignment: 'center',
                galleryImages: [
                    { id: '1', url: 'https://loremflickr.com/800/600/scifi?lock=133', caption: 'SF 도시' },
                    { id: '2', url: 'https://loremflickr.com/800/600/character?lock=134', caption: '판타지 캐릭터' },
                    { id: '3', url: 'https://loremflickr.com/800/600/product?lock=135', caption: '제품 비주얼' }
                ]
            }
        ]
    },
    {
        id: 'motion-graphic',
        name: '모션 그래픽',
        description: '모션 디자인 및 애니메이션 쇼릴',
        category: 'creative',
        sections: [
            {
                layout: LayoutType.VIDEO_HERO,
                title: '모션 쇼릴 2024',
                description: '',
                mediaType: 'image', // fallback
                mediaUrl: 'https://loremflickr.com/1280/720/motiongraphics?lock=136',
                textColor: '#ffffff',
                backgroundColor: '#000000',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.SPLIT_LEFT,
                title: '프로젝트 A',
                description: '타이틀 시퀀스 디자인',
                mediaType: 'image', // video
                mediaUrl: 'https://loremflickr.com/800/600/typography?lock=137',
                textColor: '#ffffff',
                backgroundColor: '#171717',
                textAlignment: 'left'
            }
        ]
    },
    {
        id: 'tattoo-artist',
        name: '타투 아티스트',
        description: '타투 도안 및 시술 사진',
        category: 'creative',
        sections: [
            {
                layout: LayoutType.GALLERY,
                title: 'Ink & Soul',
                description: 'Blackwork / Lineart',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#ffffff',
                backgroundColor: '#000000',
                textAlignment: 'center',
                galleryImages: [
                    { id: '1', url: 'https://loremflickr.com/600/600/tattoo?lock=138' },
                    { id: '2', url: 'https://loremflickr.com/600/600/ink?lock=139' },
                    { id: '3', url: 'https://loremflickr.com/600/600/drawing?lock=140' },
                    { id: '4', url: 'https://loremflickr.com/600/600/art?lock=141' }
                ],
                gallerySettings: { columns: 2, gap: 4, showCaptions: false }
            },
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '예약',
                description: '예약 문의는 오픈카톡으로 부탁드립니다.\n(미성년자 작업 불가)',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#ffffff',
                backgroundColor: '#000000',
                textAlignment: 'center'
            }
        ]
    },
    {
        id: 'interior-designer',
        name: '인테리어 디자이너',
        description: '공간 디자인 및 리모델링 프로젝트',
        category: 'creative',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '공간에 숨을 불어넣다',
                description: '주거 & 상업 인테리어',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/interior?lock=142',
                textColor: '#000000',
                backgroundColor: '#e5e5e5',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.SPLIT_RIGHT,
                title: '모던 하우스',
                description: '40평대 아파트 리모델링\n미니멀리즘을 기반으로 한 따뜻한 공간 연출',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/800/600/livingroom?lock=143',
                textColor: '#000000',
                backgroundColor: '#f5f5f5',
                textAlignment: 'left'
            }
        ]
    },
    {
        id: 'fashion-designer',
        name: '패션 디자이너',
        description: '패션 컬렉션 및 룩북',
        category: 'creative',
        sections: [
            {
                layout: LayoutType.VIDEO_HERO,
                title: 'SS 2025 Collection',
                description: '"Bloom"',
                mediaType: 'image', // fallback
                mediaUrl: 'https://loremflickr.com/1280/720/runway?lock=144',
                textColor: '#ffffff',
                backgroundColor: '#000000',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.MASONRY,
                title: '룩북',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#000000',
                backgroundColor: '#ffffff',
                textAlignment: 'center',
                masonryImages: [
                    { id: '1', url: 'https://loremflickr.com/600/900/fashion?lock=145', caption: '룩 1' },
                    { id: '2', url: 'https://loremflickr.com/600/900/model?lock=146', caption: '룩 2' },
                    { id: '3', url: 'https://loremflickr.com/600/900/dress?lock=147', caption: '룩 3' },
                    { id: '4', url: 'https://loremflickr.com/600/600/clothing?lock=148', caption: '디테일' }
                ],
                masonrySettings: { columns: 2, gap: 8, showCaptions: true, rounded: false, hoverEffect: false }
            }
        ]
    },
    {
        id: 'baking-cake',
        name: '케이크/베이킹',
        description: '커스텀 케이크 및 디저트 포트폴리오',
        category: 'creative',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '달콤한 순간',
                description: '특별한 날을 더욱 빛나게',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/cake?lock=149',
                textColor: '#000000',
                backgroundColor: '#fff1f2',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.GALLERY,
                title: '맞춤 케이크',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#000000',
                backgroundColor: '#ffffff',
                textAlignment: 'center',
                galleryImages: [
                    { id: '1', url: 'https://loremflickr.com/600/600/birthdaycake?lock=150', caption: '생일' },
                    { id: '2', url: 'https://loremflickr.com/600/600/weddingcake?lock=151', caption: '웨딩' },
                    { id: '3', url: 'https://loremflickr.com/600/600/cupcake?lock=152', caption: '도시락' }
                ]
            }
        ]
    },
    {
        id: 'youtuber',
        name: '유튜버/크리에이터',
        description: '채널 소개 및 콘텐츠 하이라이트',
        category: 'creative',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '채널명',
                description: '매주 금요일 업로드! 구독과 좋아요',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/youtube?lock=153',
                textColor: '#ffffff',
                backgroundColor: '#b91c1c',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.CARDS,
                title: '인기 영상',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#ffffff',
                backgroundColor: '#991b1b',
                textAlignment: 'center',
                cards: [
                    { id: '1', title: '여행 브이로그', description: '조회수 100만회', imageUrl: 'https://loremflickr.com/400/300/travel?lock=154' },
                    { id: '2', title: '질문과 답변', description: '50문 50답', imageUrl: 'https://loremflickr.com/400/300/talking?lock=155' },
                    { id: '3', title: '룸 투어', description: '랜선 집들이', imageUrl: 'https://loremflickr.com/400/300/room?lock=156' }
                ]
            }
        ]
    },
    {
        id: 'podcaster',
        name: '팟캐스터',
        description: '오디오 콘텐츠 및 에피소드 소개',
        category: 'creative',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '밤에 듣는 라디오',
                description: '당신의 새벽을 채워드립니다',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/studio,mic?lock=157',
                textColor: '#ffffff',
                backgroundColor: '#1e1b4b',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.AUDIO,
                title: '최신 에피소드',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#ffffff',
                backgroundColor: '#312e81',
                textAlignment: 'left',
                audioTracks: [
                    { id: '1', title: 'Ep.10 가을밤의 산책', url: '', duration: '45:00', coverImage: 'https://loremflickr.com/150/150/night?lock=158' },
                    { id: '2', title: 'Ep.09 좋아하는 음악', url: '', duration: '38:00', coverImage: 'https://loremflickr.com/150/150/music?lock=159' }
                ]
            }
        ]
    },
    {
        id: 'writer',
        name: '작가/소설',
        description: '책 소개 및 작가 프로필',
        category: 'creative',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '소설가 김문학',
                description: '활자로 짓는 세계',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/library?lock=160',
                textColor: '#000000',
                backgroundColor: '#f5f5f4',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.SPLIT_LEFT,
                title: '신간 소개',
                description: '《계절의 온도》\n우리가 사랑했던 그 계절, 그 온도에 대하여.',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/800/600/book?lock=161',
                textColor: '#000000',
                backgroundColor: '#e7e5e4',
                textAlignment: 'left'
            }
        ]
    },
    {
        id: 'poet',
        name: '시인',
        description: '시집 소개 및 자작시 전시',
        category: 'creative',
        sections: [
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '꽃 한 송이',
                description: '흔들리지 않고 피는 꽃이 어디 있으랴\n이 세상 그 어떤 아름다운 꽃들도\n다 흔들리면서 피었나니\n\n- 도종환, 흔들리며 피는 꽃',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/flower?lock=162',
                textColor: '#000000',
                backgroundColor: '#fff',
                textAlignment: 'center',
                fontFamily: 'serif'
            }
        ]
    },
    {
        id: 'photographer-wedding',
        name: '사진작가 (결혼식)',
        description: '웨딩 스냅 포트폴리오',
        category: 'creative',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '웨딩 모먼트',
                description: '가장 아름다운 순간을 영원히',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/wedding?lock=163',
                textColor: '#000000',
                backgroundColor: '#fff',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.MASONRY,
                title: '갤러리',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#000000',
                backgroundColor: '#fff',
                textAlignment: 'center',
                masonryImages: [
                    { id: '1', url: 'https://loremflickr.com/600/800/bride?lock=164' },
                    { id: '2', url: 'https://loremflickr.com/600/600/groom?lock=165' },
                    { id: '3', url: 'https://loremflickr.com/600/600/ring?lock=166' },
                    { id: '4', url: 'https://loremflickr.com/600/800/bouquet?lock=167' }
                ]
            }
        ]
    },
    {
        id: 'photographer-product',
        name: '사진작가 (제품)',
        description: '제품 촬영 포트폴리오',
        category: 'creative',
        sections: [
            {
                layout: LayoutType.GALLERY,
                title: '상업 사진',
                description: '제품의 디테일을 살리는 조명과 연출',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#ffffff',
                backgroundColor: '#1c1917',
                textAlignment: 'center',
                galleryImages: [
                    { id: '1', url: 'https://loremflickr.com/800/600/cosmetics?lock=168', caption: '화장품' },
                    { id: '2', url: 'https://loremflickr.com/800/600/food?lock=169', caption: '음식' },
                    { id: '3', url: 'https://loremflickr.com/800/600/watch?lock=170', caption: '테크' }
                ]
            }
        ]
    },
    {
        id: 'photographer-portrait',
        name: '사진작가 (인물)',
        description: '프로필, 화보 촬영',
        category: 'creative',
        sections: [
            {
                layout: LayoutType.SPLIT_RIGHT,
                title: '인물 사진',
                description: '당신의 진짜 모습을 담습니다.\n배우 프로필 / 개인 화보 / 사원증',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/800/1000/portrait?lock=171',
                textColor: '#000000',
                backgroundColor: '#f5f5f5',
                textAlignment: 'left'
            }
        ]
    },
    {
        id: 'chef',
        name: '요리사/셰프',
        description: '요리 포트폴리오 및 레시피',
        category: 'creative',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '셰프 테이블',
                description: '재료 본연의 맛을 살린 다이닝',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/chef,cooking?lock=172',
                textColor: '#ffffff',
                backgroundColor: '#000000',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.GALLERY,
                title: '시그니처 요리',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#ffffff',
                backgroundColor: '#1c1917',
                textAlignment: 'center',
                galleryImages: [
                    { id: '1', url: 'https://loremflickr.com/600/600/appetizer?lock=173', caption: '애피타이저' },
                    { id: '2', url: 'https://loremflickr.com/600/600/steak?lock=174', caption: '메인' },
                    { id: '3', url: 'https://loremflickr.com/600/600/dessert?lock=175', caption: '디저트' }
                ]
            }
        ]
    },
    {
        id: 'florist',
        name: '플로리스트',
        description: '꽃꽂이 및 식물 연출',
        category: 'creative',
        sections: [
            {
                layout: LayoutType.HERO,
                title: 'Blooming',
                description: '꽃으로 전하는 마음',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/flower,garden?lock=176',
                textColor: '#000000',
                backgroundColor: '#fdf2f8',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.GALLERY,
                title: '작품',
                description: '웨딩 부케 / 센터피스 / 꽃다발',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#000000',
                backgroundColor: '#fff',
                textAlignment: 'center',
                galleryImages: [
                    { id: '1', url: 'https://loremflickr.com/600/600/bouquet?lock=177' },
                    { id: '2', url: 'https://loremflickr.com/600/600/centerpiece?lock=178' },
                    { id: '3', url: 'https://loremflickr.com/600/600/rose?lock=179' }
                ]
            }
        ]
    },
    {
        id: 'crafter',
        name: '공예가',
        description: '도자기, 가죽 등 수공예 작품',
        category: 'creative',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '수제 도자기',
                description: '흙의 온도, 손의 정성',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/pottery?lock=180',
                textColor: '#000000',
                backgroundColor: '#d6d3d1',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.GALLERY,
                title: '컨렉션',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#000000',
                backgroundColor: '#e7e5e4',
                textAlignment: 'center',
                galleryImages: [
                    { id: '1', url: 'https://loremflickr.com/600/600/ceramic?lock=181', caption: '달항아리' },
                    { id: '2', url: 'https://loremflickr.com/600/600/cup?lock=182', caption: '찻잔' }
                ]
            }
        ]
    },
    {
        id: 'dj',
        name: 'DJ/프로듀서',
        description: '믹스셋 및 트랙 홍보',
        category: 'creative',
        sections: [
            {
                layout: LayoutType.VIDEO_HERO,
                title: 'DJ MAX',
                description: 'House / Techno / EDM',
                mediaType: 'image', // fallback
                mediaUrl: 'https://loremflickr.com/1280/720/club,dj?lock=183',
                textColor: '#ffffff',
                backgroundColor: '#000000',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.AUDIO,
                title: '최신 믹스',
                description: 'Summer Vibes 2024',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#ffffff',
                backgroundColor: '#111',
                textAlignment: 'left',
                audioTracks: [
                    { id: '1', title: 'Summer Mix Vol.1', url: '', duration: '60:00', coverImage: 'https://loremflickr.com/150/150/party?lock=184' }
                ]
            }
        ]
    },
    {
        id: 'dancer',
        name: '댄서/안무가',
        description: '댄스 영상 및 안무 포트폴리오',
        category: 'creative',
        sections: [
            {
                layout: LayoutType.VIDEO_HERO,
                title: '몸을 움직여',
                description: '안무 by 사라',
                mediaType: 'image', // fallback
                mediaUrl: 'https://loremflickr.com/1280/720/dance?lock=185',
                textColor: '#ffffff',
                backgroundColor: '#000000',
                textAlignment: 'center',
                videoHeroSettings: { autoPlay: true, muted: true, loop: true }
            },
            {
                layout: LayoutType.GALLERY,
                title: '클래스',
                description: '화/목 19:00 K-POP Class',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#ffffff',
                backgroundColor: '#18181b',
                textAlignment: 'center',
                galleryImages: [
                    { id: '1', url: 'https://loremflickr.com/600/400/danceclass?lock=186', caption: '스튜디오 A' },
                    { id: '2', url: 'https://loremflickr.com/600/400/dancer?lock=187', caption: '단체 사진' }
                ]
            }
        ]
    }
];
