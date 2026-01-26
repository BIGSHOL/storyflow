import { LayoutType, Template } from '../../types';

export const personalTemplates: Template[] = [
    // ==================== Existing Templates ====================
    {
        id: 'story',
        name: '스토리텔링',
        description: '이야기를 담은 몰입감 있는 페이지',
        category: 'personal',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '여행의 시작',
                description: '모든 위대한 이야기는 첫 걸음에서 시작됩니다',
                mediaType: 'image',
                mediaUrl: '/images/templates/personal/story-road.webp',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#2d3436',
                overlayOpacity: 0.4,
            },
            {
                layout: LayoutType.FULL_IMAGE_TEXT_OVERLAY,
                title: '첫 번째 장',
                description: '이야기의 배경을 설명해주세요. 독자들이 몰입할 수 있도록 분위기를 만들어보세요.',
                mediaType: 'image',
                mediaUrl: '/images/templates/personal/story-forest.webp',
                textAlignment: 'left',
                textColor: '#ffffff',
                backgroundColor: '#000000',
                overlayOpacity: 0.5,
            },
            {
                layout: LayoutType.SPLIT_RIGHT,
                title: '전환점',
                description: '이야기의 중요한 순간을 담아보세요. 감동적인 장면이나 인상깊은 경험을 공유해주세요.',
                mediaType: 'image',
                mediaUrl: '/images/templates/personal/story-mountain.webp',
                textAlignment: 'left',
                splitRatio: 50,
                textColor: '#ffffff',
                backgroundColor: '#1e272e',
            },
            {
                layout: LayoutType.FULL_IMAGE_TEXT_OVERLAY,
                title: '결말',
                description: '이야기가 남긴 의미와 교훈을 정리해보세요. 독자들에게 전하고 싶은 메시지는 무엇인가요?',
                mediaType: 'image',
                mediaUrl: '/images/templates/personal/story-sunset.webp',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#000000',
                overlayOpacity: 0.6,
            },
        ],
    },
    {
        id: 'travel-diary',
        name: '여행 일기',
        description: '여행의 추억을 기록하는 페이지',
        category: 'personal',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '파리에서의 일주일',
                description: '2024년 봄, 꿈꾸던 도시로',
                mediaType: 'image',
                mediaUrl: '/images/templates/personal/travel-paris.webp',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#1e40af',
                overlayOpacity: 0.4,
            },
            {
                layout: LayoutType.TIMELINE,
                title: '여행 일정',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'left',
                textColor: '#ffffff',
                backgroundColor: '#1e3a8a',
                timelineItems: [
                    { id: '1', date: '1일차', title: '에펠탑', description: '파리의 상징, 첫 만남' },
                    { id: '2', date: '2일차', title: '루브르 박물관', description: '모나리자를 만나다' },
                    { id: '3', date: '3일차', title: '몽마르뜨', description: '예술가들의 언덕' },
                ],
                timelineAlignment: 'alternate',
            },
            {
                layout: LayoutType.GALLERY,
                title: '사진 모음',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#1e40af',
                galleryImages: [
                    { id: '1', url: '/images/templates/personal/travel-eiffel.webp', caption: '에펠탑' },
                    { id: '2', url: '/images/templates/personal/travel-river.webp', caption: '세느강' },
                    { id: '3', url: '/images/templates/personal/travel-cathedral.webp', caption: '노트르담' },
                    { id: '4', url: '/images/templates/personal/travel-street.webp', caption: '샹젤리제' },
                    { id: '5', url: '/images/templates/personal/travel-arch.webp', caption: '개선문' },
                    { id: '6', url: '/images/templates/personal/travel-cafe.webp', caption: '카페' },
                ],
                gallerySettings: { columns: 3, gap: 12, showCaptions: true },
            },
            {
                layout: LayoutType.QUOTE,
                title: '',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#1e3a8a',
                quoteText: '여행은 겸손을 가르쳐준다. 세상에서 내가 차지하는 위치가 얼마나 작은지를.',
                quoteAuthor: '귀스타브 플로베르',
            },
        ],
    },
    {
        id: 'about-me',
        name: '자기소개',
        description: '나를 소개하는 개인 페이지',
        category: 'personal',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '안녕하세요, 홍길동입니다',
                description: '개발자 / 디자이너 / 몽상가',
                mediaType: 'image',
                mediaUrl: '/images/templates/personal/aboutme-desk.webp',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#374151',
                overlayOpacity: 0.5,
            },
            {
                layout: LayoutType.SPLIT_LEFT,
                title: '저는 이런 사람이에요',
                description: '새로운 기술을 배우는 것을 좋아하고,\n문제를 해결하는 것에서 기쁨을 느낍니다.\n\n커피와 음악을 사랑합니다 ☕🎵',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/800/600/coffee?lock=312',
                textAlignment: 'left',
                splitRatio: 45,
                textColor: '#ffffff',
                backgroundColor: '#4b5563',
            },
            {
                layout: LayoutType.CARDS,
                title: '관심사',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#374151',
                cards: [
                    { id: '1', title: '개발', description: 'React, TypeScript', imageUrl: 'https://loremflickr.com/400/300/coding?lock=313' },
                    { id: '2', title: '디자인', description: 'UI/UX, 브랜딩', imageUrl: 'https://loremflickr.com/400/300/design?lock=314' },
                    { id: '3', title: '취미', description: '사진, 여행, 독서', imageUrl: 'https://loremflickr.com/400/300/hobby?lock=315' },
                ],
            },
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '연락처',
                description: 'Email: hello@example.com\nGitHub: @username\nLinkedIn: /in/username',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#4b5563',
            },
        ],
    },
    {
        id: 'resume',
        name: '이력서',
        description: '경력과 이력을 보여주는 페이지',
        category: 'personal',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '홍길동',
                description: '프론트엔드 개발자',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#111827',
                overlayOpacity: 0.3,
            },
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '소개',
                description: '5년차 프론트엔드 개발자입니다.\n사용자 경험을 최우선으로 생각하며,\n클린 코드와 지속 가능한 설계를 추구합니다.',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#1f2937',
            },
            {
                layout: LayoutType.TIMELINE,
                title: '경력',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'left',
                textColor: '#ffffff',
                backgroundColor: '#111827',
                timelineItems: [
                    { id: '1', date: '2022 - 현재', title: 'ABC 기업', description: 'Senior Frontend Developer' },
                    { id: '2', date: '2020 - 2022', title: 'XYZ 스타트업', description: 'Frontend Developer' },
                    { id: '3', date: '2019 - 2020', title: 'DEF 에이전시', description: 'Junior Developer' },
                ],
                timelineAlignment: 'left',
            },
            {
                layout: LayoutType.CARDS,
                title: '기술 스택',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#1f2937',
                cards: [
                    { id: '1', title: 'Frontend', description: 'React, Vue, TypeScript' },
                    { id: '2', title: 'Styling', description: 'CSS, Tailwind, Styled' },
                    { id: '3', title: 'Tools', description: 'Git, Figma, Jira' },
                ],
            },
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '연락처',
                description: 'resume@example.com\n+82-10-1234-5678',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#111827',
            },
        ],
    },
    {
        id: 'hobby-club',
        name: '취미/동호회',
        description: '취미 활동이나 동호회를 소개하는 페이지',
        category: 'personal',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '등산 동호회',
                description: '함께 오르는 즐거움',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/mountain,hiking?lock=316',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#14532d',
                overlayOpacity: 0.4,
            },
            {
                layout: LayoutType.SPLIT_LEFT,
                title: '우리는 이런 모임이에요',
                description: '매주 토요일 아침 6시, 서울 근교 산을 오릅니다.\n\n초보자부터 전문가까지 모두 환영합니다!\n건강한 취미와 좋은 사람들을 만나보세요.',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/800/600/forest?lock=317',
                textAlignment: 'left',
                splitRatio: 45,
                textColor: '#ffffff',
                backgroundColor: '#166534',
            },
            {
                layout: LayoutType.TIMELINE,
                title: '최근 활동',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'left',
                textColor: '#ffffff',
                backgroundColor: '#14532d',
                timelineItems: [
                    { id: '1', date: '2024.01.06', title: '북한산 백운대', description: '신년 첫 산행' },
                    { id: '2', date: '2023.12.23', title: '도봉산', description: '연말 송년 산행' },
                    { id: '3', date: '2023.12.09', title: '관악산', description: '단풍 감상' },
                ],
                timelineAlignment: 'left',
            },
            {
                layout: LayoutType.GALLERY,
                title: '추억 사진',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#166534',
                galleryImages: [
                    { id: '1', url: 'https://loremflickr.com/600/400/peak?lock=318', caption: '백운대 정상' },
                    { id: '2', url: 'https://loremflickr.com/600/400/group?lock=319', caption: '단체 사진' },
                    { id: '3', url: 'https://loremflickr.com/600/400/sunrise?lock=320', caption: '일출 감상' },
                    { id: '4', url: 'https://loremflickr.com/600/400/lunch?lock=321', caption: '점심 식사' },
                ],
                gallerySettings: { columns: 2, gap: 16, showCaptions: true },
            },
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '가입하기',
                description: '매주 토요일 오전 6시 출발\n초보자도 환영합니다!\n\n문의: hiking@example.com\n카카오톡 오픈채팅: 서울등산동호회',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#14532d',
            },
        ],
    },
    {
        id: 'blog',
        name: '블로그',
        description: '개인 블로그 스타일 페이지',
        category: 'personal',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '생각의 조각들',
                description: '일상과 배움을 기록합니다',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/writing?lock=322',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#78350f',
                overlayOpacity: 0.4,
            },
            {
                layout: LayoutType.CARDS,
                title: '최근 글',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#92400e',
                cards: [
                    { id: '1', title: '개발자로 성장하기', description: '5년간의 여정을 돌아보며' },
                    { id: '2', title: '좋은 코드란 무엇인가', description: '클린 코드에 대한 고찰' },
                    { id: '3', title: '사이드 프로젝트 이야기', description: '아이디어에서 출시까지' },
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
                backgroundColor: '#78350f',
                quoteText: '글쓰기는 생각하기의 연장이다.',
                quoteAuthor: '홍길동',
            },
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '구독하기',
                description: '새 글이 올라오면 알려드려요\n\nnewsletter@example.com',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#92400e',
            },
        ],
    },

    // ==================== New Templates ====================
    {
        id: 'love-diary',
        name: '연애 일기',
        description: '커플 기념일 및 추억 기록',
        category: 'personal',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '사랑하는 우리',
                description: '함께한 지 +365일',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/couple,love?lock=323',
                textColor: '#000000',
                backgroundColor: '#ffe4e6',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.GALLERY,
                title: '우리의 추억',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#000000',
                backgroundColor: '#fff1f2',
                textAlignment: 'center',
                galleryImages: [
                    { id: '1', url: 'https://loremflickr.com/600/600/couple,date?lock=324', caption: '첫 데이트' },
                    { id: '2', url: 'https://loremflickr.com/600/600/couple,vacation?lock=325', caption: '여름 휴가' },
                    { id: '3', url: 'https://loremflickr.com/600/600/couple,christmas?lock=326', caption: '크리스마스' }
                ]
            }
        ]
    },
    {
        id: 'parenting-diary',
        name: '육아 일기',
        description: '아이의 성장 과정 기록',
        category: 'personal',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '지안이의 하루',
                description: '너와 함께하는 모든 순간이 기적이야',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/baby,cute?lock=327',
                textColor: '#000000',
                backgroundColor: '#fef3c7',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.TIMELINE,
                title: '성장 기록',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#000000',
                backgroundColor: '#fffbeb',
                textAlignment: 'left',
                timelineItems: [
                    { id: '1', date: '2024.01', title: '탄생', description: '3.2kg 건강한 아기' },
                    { id: '2', date: '2024.04', title: '뒤집기 성공', description: '처음 뒤집은 날' },
                    { id: '3', date: '2024.08', title: '배밀이 시작', description: '열심히 기어가요' }
                ]
            }
        ]
    },
    {
        id: 'pet-intro',
        name: '반려동물',
        description: '반려동물 소개 페이지',
        category: 'personal',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '멍멍이 "두부"',
                description: '말티즈 / 3살 / 남',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/dog,puppy?lock=328',
                textColor: '#000000',
                backgroundColor: '#f3f4f6',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.SPLIT_LEFT,
                title: '두부를 소개합니다',
                description: '성격: 활발하고 사람을 좋아해요\n취미: 공놀이, 산책\n특기: 손, 앉아',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/800/600/dog,play?lock=329',
                textColor: '#000000',
                backgroundColor: '#e5e7eb',
                textAlignment: 'left'
            }
        ]
    },
    {
        id: 'recipe',
        name: '요리 레시피',
        description: '나만의 레시피 공유',
        category: 'personal',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '감바스 알 아히요',
                description: '집에서 즐기는 스페인 요리',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/gambas?lock=330',
                textColor: '#ffffff',
                backgroundColor: '#b91c1c',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '재료',
                description: '새우, 마늘, 페페론치노, 올리브오일, 바게트\n소금, 후추',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#ffffff',
                backgroundColor: '#991b1b',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.TIMELINE,
                title: '만드는 법',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#ffffff',
                backgroundColor: '#b91c1c',
                textAlignment: 'left',
                timelineItems: [
                    { id: '1', date: 'Step 1', title: '재료 손질', description: '새우는 씻어서 물기를 제거하고 마늘은 편 썬다.' },
                    { id: '2', date: 'Step 2', title: '오일 끓이기', description: '팬에 오일을 넉넉히 붓고 마늘을 튀기듯 볶는다.' },
                    { id: '3', date: 'Step 3', title: '완성', description: '새우와 페페론치노를 넣고 익힌다.' }
                ]
            }
        ]
    },
    {
        id: 'book-review',
        name: '독서 기록',
        description: '읽은 책 감상문',
        category: 'personal',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '책장을 넘기며',
                description: '2024년 독서 목록',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/bookshelf?lock=331',
                textColor: '#000000',
                backgroundColor: '#fef3c7',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.SPLIT_RIGHT,
                title: '이달의 책',
                description: '《물고기는 존재하지 않는다》\n\n과학적 열정과 인간적 상실에 대한 놀라운 이야기.\n마지막 페이지를 덮을 때 전해지는 전율.',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/800/600/openbook?lock=332',
                textColor: '#000000',
                backgroundColor: '#fffbeb',
                textAlignment: 'left'
            }
        ]
    },
    {
        id: 'workout-log',
        name: '운동 기록',
        description: '운동 루틴 및 변화 기록',
        category: 'personal',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '오늘의 오운완',
                description: '건강한 몸에 건강한 정신이 깃든다',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/fitness?lock=333',
                textColor: '#ffffff',
                backgroundColor: '#15803d',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.STATS,
                title: '오늘의 기록',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#ffffff',
                backgroundColor: '#166534',
                textAlignment: 'center',
                stats: [
                    { id: '1', value: '5km', label: '러닝' },
                    { id: '2', value: '30분', label: '시간' },
                    { id: '3', value: '300kcal', label: '소모' }
                ]
            }
        ]
    },
    {
        id: 'study-portfolio',
        name: '학습 포트폴리오',
        description: '공부 내용 및 과제 정리',
        category: 'personal',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '학습 일지',
                description: '꾸준함이 답이다',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#ffffff',
                backgroundColor: '#1d4ed8',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.CARDS,
                title: '프로젝트',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#ffffff',
                backgroundColor: '#2563eb',
                textAlignment: 'center',
                cards: [
                    { id: '1', title: 'To-do App', description: 'React로 만든 할 일 관리 앱', imageUrl: 'https://loremflickr.com/400/300/app?lock=334' },
                    { id: '2', title: 'Weather App', description: '날씨 API 연동', imageUrl: 'https://loremflickr.com/400/300/weather?lock=335' },
                    { id: '3', title: 'Clone Coding', description: '유튜브 메인 화면 클론', imageUrl: 'https://loremflickr.com/400/300/youtube?lock=336' }
                ]
            }
        ]
    },
    {
        id: 'volunteer-log',
        name: '봉사 활동',
        description: '봉사 활동 기록 및 나눔',
        category: 'personal',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '나눔의 기쁨',
                description: '함께 살아가는 세상',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/volunteer?lock=337',
                textColor: '#ffffff',
                backgroundColor: '#ca8a04',
                textAlignment: 'center'
            }
        ]
    },
    {
        id: 'annual-review',
        name: '연간 회고',
        description: '한 해를 돌아보며',
        category: 'personal',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '안녕 2024',
                description: '다사다난했던 한 해를 보내며',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#ffffff',
                backgroundColor: '#000000',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.TIMELINE,
                title: '하이라이트',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#ffffff',
                backgroundColor: '#111',
                textAlignment: 'left',
                timelineItems: [
                    { id: '1', date: '1월', title: '새해 목표 수립', description: '' },
                    { id: '2', date: '7월', title: '이직 성공', description: '' },
                    { id: '3', date: '12월', title: '해외 여행', description: '' }
                ]
            }
        ]
    },
    {
        id: 'bucket-list',
        name: '버킷리스트',
        description: '죽기 전에 하고 싶은 일들',
        category: 'personal',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '나의 버킷리스트',
                description: '꿈을 향한 여정',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/skydiving?lock=338',
                textColor: '#ffffff',
                backgroundColor: '#0ef',
                textAlignment: 'center',
                overlayOpacity: 0.5,
                imageFilter: 'brightness'
            },
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '목록',
                description: '1. 오로라 보기\n2. 스카이다이빙 하기\n3. 책 출판하기\n4. 부모님과 유럽여행\n5. 마라톤 완주',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#000000',
                backgroundColor: '#fff',
                textAlignment: 'left'
            }
        ]
    },
    {
        id: 'gratitude-journal',
        name: '감사 일기',
        description: '매일 감사한 일 3가지',
        category: 'personal',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '오늘의 감사',
                description: '소소한 행복 찾기',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/sunlight?lock=339',
                textColor: '#000000',
                backgroundColor: '#ecfccb',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.QUOTE,
                title: '',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#000000',
                backgroundColor: '#d9f99d',
                quoteText: '범사에 감사하라',
                quoteAuthor: '성경'
            }
        ]
    },
    {
        id: 'house-warming',
        name: '집들이',
        description: '온라인 집들이',
        category: 'personal',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '우리 집에 오신 것을 환영합니다',
                description: '취향이 담긴 공간',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/interior?lock=340',
                textColor: '#000000',
                backgroundColor: '#f5f5f4',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.GALLERY,
                title: '룸 투어',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#000000',
                backgroundColor: '#e7e5e4',
                textAlignment: 'center',
                galleryImages: [
                    { id: '1', url: 'https://loremflickr.com/600/600/livingroom?lock=341', caption: '거실' },
                    { id: '2', url: 'https://loremflickr.com/600/600/kitchen?lock=342', caption: '주방' },
                    { id: '3', url: 'https://loremflickr.com/600/600/bedroom?lock=343', caption: '침실' },
                    { id: '4', url: 'https://loremflickr.com/600/600/desk?lock=344', caption: '작업공간' }
                ]
            }
        ]
    },
    {
        id: 'diy-project',
        name: 'DIY 프로젝트',
        description: '만들기 과정 기록',
        category: 'personal',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '책상 만들기',
                description: '셀프 인테리어 도전',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/woodworking?lock=345',
                textColor: '#ffffff',
                backgroundColor: '#78350f',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.TIMELINE,
                title: '제작 과정',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#ffffff',
                backgroundColor: '#92400e',
                textAlignment: 'left',
                timelineItems: [
                    { id: '1', date: '1일차', title: '설계 및 목재 주문', description: '' },
                    { id: '2', date: '3일차', title: '샌딩 및 스테인 칠하기', description: '' },
                    { id: '3', date: '5일차', title: '조립 및 완성', description: '' }
                ]
            }
        ]
    },
    {
        id: 'language-study',
        name: '언어 학습',
        description: '외국어 공부 기록',
        category: 'personal',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '영어 공부',
                description: '매일 30분 영어 습관',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/dictionary?lock=346',
                textColor: '#ffffff',
                backgroundColor: '#2563eb',
                textAlignment: 'center'
            }
        ]
    },
    {
        id: 'music-playlist',
        name: '음악 플레이리스트',
        description: '좋아하는 음악 추천',
        category: 'personal',
        sections: [
            {
                layout: LayoutType.VIDEO_HERO,
                title: '비 오는 날 듣기 좋은 노래',
                description: '비 오는 날 플레이리스트',
                mediaType: 'video',
                mediaUrl: 'https://loremflickr.com/1280/720/rainywindow?lock=347',
                videoUrl: '/videos/templates/personal/music-playlist-hero.webm',
                textColor: '#ffffff',
                backgroundColor: '#1e3a8a',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.AUDIO,
                title: '트랙리스트',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#ffffff',
                backgroundColor: '#1e40af',
                textAlignment: 'left',
                audioTracks: [
                    { id: '1', title: 'Rain', url: '', duration: '3:20' },
                    { id: '2', title: 'Umbrella', url: '', duration: '4:10' }
                ]
            }
        ]
    },
    {
        id: 'movie-review',
        name: '영화/드라마 리뷰',
        description: '감상평 기록',
        category: 'personal',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '인셉션',
                description: '꿈 속의 꿈, 그 끝없는 미로',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/movie?lock=348',
                textColor: '#ffffff',
                backgroundColor: '#000000',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.QUOTE,
                title: '',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#111',
                quoteText: '가장 끈질긴 기생충은 생각이다.',
                quoteAuthor: '코브'
            }
        ]
    },
    {
        id: 'restaurant-review',
        name: '맛집 리뷰',
        description: '나만의 맛집 리스트',
        category: 'personal',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '성수동 맛집 탐방',
                description: '웨이팅 필수 핫플레이스',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/restaurant?lock=349',
                textColor: '#ffffff',
                backgroundColor: '#be123c',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.GALLERY,
                title: '메뉴',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#ffffff',
                backgroundColor: '#e11d48',
                textAlignment: 'center',
                galleryImages: [
                    { id: '1', url: 'https://loremflickr.com/600/600/pasta?lock=350', caption: '파스타' },
                    { id: '2', url: 'https://loremflickr.com/600/600/steak?lock=351', caption: '스테이크' }
                ]
            }
        ]
    },
    {
        id: 'quote-collection',
        name: '명언 모음',
        description: '힘이 되는 글귀들',
        category: 'personal',
        sections: [
            {
                layout: LayoutType.CAROUSEL,
                title: '지혜',
                description: '매일 꺼내보는 지혜',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#000000',
                backgroundColor: '#f3f4f6',
                textAlignment: 'center',
                carouselImages: [
                    { id: '1', url: 'https://loremflickr.com/1000/600/nature?lock=352', title: '현재를 즐겨라', description: 'Carpe Diem' },
                    { id: '2', url: 'https://loremflickr.com/1000/600/sky?lock=353', title: '이 또한 지나가리라', description: 'This too shall pass' }
                ]
            }
        ]
    },
    {
        id: 'family-intro',
        name: '가족 소개',
        description: '우리 가족 소개 페이지',
        category: 'personal',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '행복한 우리집',
                description: '사랑이 넘치는 패밀리',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/family?lock=354',
                textColor: '#000000',
                backgroundColor: '#fae8ff',
                textAlignment: 'center'
            }
        ]
    },
    {
        id: 'memorial',
        name: '추모/기념',
        description: '소중한 사람을 기억하며',
        category: 'personal',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '추모',
                description: '당신을 영원히 기억합니다',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/candle?lock=355',
                textColor: '#ffffff',
                backgroundColor: '#000000',
                textAlignment: 'center',
                imageFilter: 'grayscale'
            }
        ]
    }
];
