import { LayoutType, Template } from '../../types';

export const eventTemplates: Template[] = [
    // ==================== Existing Templates ====================
    {
        id: 'event',
        name: '이벤트 초대',
        description: '행사나 모임을 위한 초대장',
        category: 'event',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '특별한 날에 초대합니다',
                description: '2024년 12월 25일 저녁 7시',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/party?lock=200',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#2c3e50',
                overlayOpacity: 0.4,
            },
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '행사 소개',
                description: '이 특별한 자리에 여러분을 초대합니다.\n\n함께해주시면 감사하겠습니다.',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#34495e',
            },
            {
                layout: LayoutType.SPLIT_LEFT,
                title: '장소 안내',
                description: '서울특별시 강남구 테헤란로 123\n\n지하철 2호선 강남역 1번 출구에서 도보 5분',
                mediaType: 'image',
                mediaUrl: '/images/templates/event/party-map.webp',
                textAlignment: 'left',
                splitRatio: 50,
                textColor: '#ffffff',
                backgroundColor: '#2c3e50',
            },
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '참석 여부를 알려주세요',
                description: 'RSVP: event@example.com\n\n참석하시는 분은 12월 20일까지 연락 부탁드립니다.',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#1a252f',
            },
        ],
    },
    {
        id: 'wedding',
        name: '웨딩 초대',
        description: '결혼식 청첩장',
        category: 'event',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '우리 결혼합니다',
                description: '2024년 5월 25일 토요일 오후 2시',
                mediaType: 'image',
                mediaUrl: '/images/templates/event/wedding-hero.webp',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#be185d',
                overlayOpacity: 0.4,
            },
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '신랑 홍길동 · 신부 김영희',
                description: '서로를 향한 마음을 모아\n평생을 함께하고자 합니다.\n\n귀한 걸음 하시어 축복해 주시면\n더없는 기쁨이겠습니다.',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#831843',
            },
            {
                layout: LayoutType.GALLERY,
                title: '우리의 이야기',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#be185d',
                galleryImages: [
                    { id: '1', url: '/images/templates/event/wedding-couple.webp', caption: '' },
                    { id: '2', url: '/images/templates/event/wedding-hands.webp', caption: '' },
                    { id: '3', url: '/images/templates/event/wedding-love.webp', caption: '' },
                    { id: '4', url: '/images/templates/event/wedding-flowers.webp', caption: '' },
                ],
                gallerySettings: { columns: 2, gap: 16, showCaptions: false },
            },
            {
                layout: LayoutType.SPLIT_LEFT,
                title: '오시는 길',
                description: '서울 웨딩홀\n서울시 강남구 삼성동 123-45\n\n주차 가능 (2시간 무료)',
                mediaType: 'image',
                mediaUrl: '/images/templates/event/wedding-hall.webp',
                textAlignment: 'left',
                splitRatio: 50,
                textColor: '#ffffff',
                backgroundColor: '#831843',
            },
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '마음 전하실 곳',
                description: '신랑측: 카카오뱅크 1234-5678-9012\n신부측: 국민은행 012-3456-7890',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#be185d',
            },
        ],
    },
    {
        id: 'conference',
        name: '컨퍼런스',
        description: '컨퍼런스 및 세미나 홍보 페이지',
        category: 'event',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '테크 서밋 2024',
                description: '기술의 미래를 함께 그립니다\n2024.09.15 - 09.16',
                mediaType: 'image',
                mediaUrl: '/images/templates/event/conference-tech.webp',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#1e3a5f',
                overlayOpacity: 0.5,
            },
            {
                layout: LayoutType.TIMELINE,
                title: '프로그램',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'left',
                textColor: '#ffffff',
                backgroundColor: '#0f2942',
                timelineItems: [
                    { id: '1', date: '09:00', title: '등록 및 네트워킹', description: '' },
                    { id: '2', date: '10:00', title: '키노트: AI의 미래', description: '홍길동 CEO' },
                    { id: '3', date: '14:00', title: '트랙 세션', description: '4개 트랙 동시 진행' },
                    { id: '4', date: '18:00', title: '네트워킹 디너', description: '' },
                ],
                timelineAlignment: 'left',
            },
            {
                layout: LayoutType.CARDS,
                title: '연사',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#1e3a5f',
                cards: [
                    { id: '1', title: '홍길동', description: 'ABC 기업 CEO', imageUrl: '/images/templates/event/conference-speaker1.webp' },
                    { id: '2', title: '김영희', description: 'XYZ 연구소장', imageUrl: '/images/templates/event/conference-speaker2.webp' },
                    { id: '3', title: '이철수', description: '스타트업 창업자', imageUrl: '/images/templates/event/conference-speaker3.webp' },
                ],
            },
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '참가 신청',
                description: '얼리버드 할인 진행 중!\nregister@techsummit.com',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#0f2942',
            },
        ],
    },
    {
        id: 'meetup',
        name: '밋업 초대',
        description: '소규모 모임 및 밋업 초대장',
        category: 'event',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '개발자 밋업',
                description: '함께 배우고 성장해요\n매월 둘째 주 토요일',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/developer,meetup?lock=212',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#065f46',
                overlayOpacity: 0.3,
            },
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '이번 달 주제',
                description: 'React 19의 새로운 기능들\n\n발표자: 홍길동',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#047857',
            },
            {
                layout: LayoutType.TIMELINE,
                title: '일정',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'left',
                textColor: '#ffffff',
                backgroundColor: '#065f46',
                timelineItems: [
                    { id: '1', date: '14:00', title: '체크인 & 네트워킹', description: '' },
                    { id: '2', date: '14:30', title: '발표 세션', description: '' },
                    { id: '3', date: '16:00', title: '자유 토론', description: '' },
                    { id: '4', date: '17:00', title: '마무리', description: '' },
                ],
                timelineAlignment: 'left',
            },
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '참여하기',
                description: '장소: 강남 코워킹스페이스\n참가비: 무료\n\nmeetup@example.com',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#047857',
            },
        ],
    },
    {
        id: 'party',
        name: '파티 초대',
        description: '생일, 축하 파티 초대장',
        category: 'event',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '🎉 파티에 초대합니다!',
                description: '2024년 8월 15일 저녁 7시',
                mediaType: 'image',
                mediaUrl: '/images/templates/event/party-hero.webp',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#7c3aed',
                overlayOpacity: 0.4,
            },
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '함께 즐겨요',
                description: '맛있는 음식과 음악,\n그리고 즐거운 시간이 기다리고 있어요!\n\n드레스코드: 스마트 캐주얼',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#5b21b6',
            },
            {
                layout: LayoutType.SPLIT_LEFT,
                title: '장소',
                description: '루프탑 라운지\n서울시 마포구 홍대입구역 근처\n\n발렛 주차 가능',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/800/600/rooftop?lock=214',
                textAlignment: 'left',
                splitRatio: 50,
                textColor: '#ffffff',
                backgroundColor: '#7c3aed',
            },
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: 'RSVP',
                description: '참석 여부를 알려주세요!\n8월 10일까지\n\nparty@example.com',
                mediaType: 'none',
                mediaUrl: '',
                textAlignment: 'center',
                textColor: '#ffffff',
                backgroundColor: '#5b21b6',
            },
        ],
    },

    // ==================== New Templates ====================
    {
        id: '100-day',
        name: '백일잔치',
        description: '아기 백일 기념 초대장',
        category: 'event',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '지안이의 백일',
                description: '건강하게 자라준 지안이를 축하해주세요',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/baby?lock=215',
                textColor: '#000000',
                backgroundColor: '#fff7ed',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '초대합니다',
                description: '일시: 2024년 11월 20일 12시\n장소: 우리집',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#000000',
                backgroundColor: '#ffedd5',
                textAlignment: 'center'
            }
        ]
    },
    {
        id: 'first-birthday',
        name: '돌잔치',
        description: '첫돌 기념 초대장',
        category: 'event',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '첫 번째 생일',
                description: '아가의 첫돌을 함께해주세요',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/firstbirthday?lock=216',
                textColor: '#ffffff',
                backgroundColor: '#f43f5e',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.GALLERY,
                title: '성장 앨범',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#ffffff',
                backgroundColor: '#fb7185',
                textAlignment: 'center',
                galleryImages: [
                    { id: '1', url: 'https://loremflickr.com/600/600/baby,50?lock=217', caption: '50일' },
                    { id: '2', url: 'https://loremflickr.com/600/600/baby,100?lock=218', caption: '100일' },
                    { id: '3', url: 'https://loremflickr.com/600/600/baby,smile?lock=219', caption: '300일' }
                ]
            }
        ]
    },
    {
        id: '60th-birthday',
        name: '환갑/칠순',
        description: '부모님 생신 잔치 초대장',
        category: 'event',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '인생은 지금부터',
                description: '아버지의 환갑을 축하드립니다',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/celebration?lock=220',
                textColor: '#000000',
                backgroundColor: '#fcd34d',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '감사합니다',
                description: '한결같은 사랑으로 키워주신 은혜,\n맛있는 식사 대접하고 싶습니다.',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#000000',
                backgroundColor: '#fffbeb',
                textAlignment: 'center'
            }
        ]
    },
    {
        id: 'graduation',
        name: '졸업식',
        description: '졸업 기념 및 축하 페이지',
        category: 'event',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '졸업을 축하해',
                description: '새로운 시작을 응원해!',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/graduation?lock=221',
                textColor: '#ffffff',
                backgroundColor: '#2563eb',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.GALLERY,
                title: '추억들',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#ffffff',
                backgroundColor: '#3b82f6',
                textAlignment: 'center',
                galleryImages: [
                    { id: '1', url: 'https://loremflickr.com/600/600/school?lock=222', caption: '입학식' },
                    { id: '2', url: 'https://loremflickr.com/600/600/festival?lock=223', caption: '축제' },
                    { id: '3', url: 'https://loremflickr.com/600/600/friends?lock=224', caption: '졸업사진' }
                ]
            }
        ]
    },
    {
        id: 'alumni',
        name: '동창회',
        description: '동문 모임 안내',
        category: 'event',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '2024 동창회',
                description: '응답하라 2004! 20년 만의 만남',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/reunion?lock=225',
                textColor: '#ffffff',
                backgroundColor: '#1e3a8a',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '안내',
                description: '일시: 12월 28일 18:00\n장소: 모교 체육관',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#ffffff',
                backgroundColor: '#1e40af',
                textAlignment: 'center'
            }
        ]
    },
    {
        id: 'workshop',
        name: '워크샵',
        description: '사내 워크샵 및 MT 안내',
        category: 'event',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '2024 Design Team Workshop',
                description: '재충전 & 재연결',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/teamwork?lock=226',
                textColor: '#ffffff',
                backgroundColor: '#059669',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.TIMELINE,
                title: '일정',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#ffffff',
                backgroundColor: '#047857',
                textAlignment: 'left',
                timelineItems: [
                    { id: '1', date: '13:00', title: '출발', description: '' },
                    { id: '2', date: '15:00', title: '숙소 도착', description: '' },
                    { id: '3', date: '18:00', title: '바베큐 파티', description: '' }
                ]
            }
        ]
    },
    {
        id: 'exhibition-opening',
        name: '전시회 오프닝',
        description: '전시회 초대 및 관람 안내',
        category: 'event',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '개인전',
                description: '오프닝 리셉션에 초대합니다',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/artgallery?lock=227',
                textColor: '#000000',
                backgroundColor: '#f3f4f6',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '전시 정보',
                description: '2024.10.01 - 10.15\n갤러리 A\n오프닝: 10.01 17:00 (와인 및 다과 제공)',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#000000',
                backgroundColor: '#ffffff',
                textAlignment: 'center'
            }
        ]
    },
    {
        id: 'open-house',
        name: '오픈하우스',
        description: '매장 또는 시설 오픈 기념 행사',
        category: 'event',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '그랜드 오픈',
                description: '새로운 공간을 소개합니다',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/shop?lock=228',
                textColor: '#ffffff',
                backgroundColor: '#ea580c',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.CARDS,
                title: '오픈 이벤트',
                description: '방문 고객 선착순 증정',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#ffffff',
                backgroundColor: '#c2410c',
                textAlignment: 'center',
                cards: [
                    { id: '1', title: '무료 음료', description: '모든 방문객' },
                    { id: '2', title: '기념품', description: '선착순 100명' },
                    { id: '3', title: '할인 쿠폰', description: '30% 할인' }
                ]
            }
        ]
    },
    {
        id: 'club-party',
        name: '클럽/파티 이벤트',
        description: 'DJ 파티 및 클럽 행사 홍보',
        category: 'event',
        sections: [
            {
                layout: LayoutType.VIDEO_HERO,
                title: '토요일 밤의 열기',
                description: '스페셜 게스트 DJ',
                mediaType: 'video',
                mediaUrl: 'https://loremflickr.com/1280/720/nightclub?lock=229',
                videoUrl: '/videos/templates/event/club-party-hero.webm',
                textColor: '#ffffff',
                backgroundColor: '#000000',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.SPLIT_RIGHT,
                title: '라인업',
                description: '22:00 DJ A\n24:00 DJ B (Headliner)\n02:00 DJ C',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/800/600/dj?lock=230',
                textColor: '#ffffff',
                backgroundColor: '#111',
                textAlignment: 'left'
            }
        ]
    },
    {
        id: 'sports-match',
        name: '스포츠 대회',
        description: '경기, 대회, 체육대회 안내',
        category: 'event',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '사내 체육대회',
                description: '화합과 열정의 한마당',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/sports?lock=231',
                textColor: '#ffffff',
                backgroundColor: '#15803d',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.TIMELINE,
                title: '경기 일정',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#ffffff',
                backgroundColor: '#166534',
                textAlignment: 'left',
                timelineItems: [
                    { id: '1', date: '09:00', title: '개회식', description: '' },
                    { id: '2', date: '10:00', title: '축구 예선', description: '' },
                    { id: '3', date: '14:00', title: '줄다리기', description: '' }
                ]
            }
        ]
    },
    {
        id: 'marathon',
        name: '마라톤/러닝',
        description: '러닝 크루 또는 마라톤 대회 홍보',
        category: 'event',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '2024 시티런',
                description: '도심을 달리는 짜릿함, 10K 코스',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/running?lock=232',
                textColor: '#ffffff',
                backgroundColor: '#0284c7',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.STATS,
                title: '대회 정보',
                description: '',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#ffffff',
                backgroundColor: '#0369a1',
                textAlignment: 'center',
                stats: [
                    { id: '1', value: '10km', label: '코스' },
                    { id: '2', value: '3만원', label: '참가비' },
                    { id: '3', value: '1000명', label: '모집인원' }
                ]
            }
        ]
    },
    {
        id: 'camping',
        name: '캠핑/야외행사',
        description: '캠핑 모임 및 아웃도어 행사',
        category: 'event',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '가을 캠핑',
                description: '별이 쏟아지는 밤, 모닥불 토크',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/camping,tent?lock=233',
                textColor: '#ffffff',
                backgroundColor: '#3f6212',
                textAlignment: 'center',
                overlayOpacity: 0.4
            },
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '준비물',
                description: '텐트, 침낭, 개인 식기, 따뜻한 옷\n회비: 없음 (각자 준비)',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#ffffff',
                backgroundColor: '#365314',
                textAlignment: 'center'
            }
        ]
    },
    {
        id: 'charity',
        name: '자선 행사',
        description: '기부 바자회 또는 봉사활동 모집',
        category: 'event',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '나눔 바자회',
                description: '작은 나눔이 모여 큰 기적을 만듭니다',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/volunteer?lock=234',
                textColor: '#ffffff',
                backgroundColor: '#be185d',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '수익금 사용처',
                description: '판매 수익금 전액은 지역 아동센터에 기부됩니다.',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#ffffff',
                backgroundColor: '#9d174d',
                textAlignment: 'center'
            }
        ]
    },
    {
        id: 'fan-meeting',
        name: '팬미팅',
        description: '연예인 팬미팅 또는 생일 카페',
        category: 'event',
        sections: [
            {
                layout: LayoutType.HERO,
                title: 'Happy Birthday',
                description: '우리의 영원한 별, 생일 축하해',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/kpop?lock=235',
                textColor: '#ffffff',
                backgroundColor: '#8b5cf6',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.SPLIT_LEFT,
                title: '생일 카페',
                description: '기간: 10.13 - 10.15\n장소: 카페 스토리\n특전: 컵홀더, 포토카드 증정',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/800/600/cafe?lock=236',
                textColor: '#ffffff',
                backgroundColor: '#7c3aed',
                textAlignment: 'left'
            }
        ]
    },
    {
        id: 'book-club',
        name: '북클럽',
        description: '독서 모임 정기 모임 초대',
        category: 'event',
        sections: [
            {
                layout: LayoutType.HERO,
                title: '11월 독서모임',
                description: '함께 읽고, 나누는 기쁨',
                mediaType: 'image',
                mediaUrl: 'https://loremflickr.com/1280/720/reading?lock=237',
                textColor: '#ffffff',
                backgroundColor: '#a16207',
                textAlignment: 'center'
            },
            {
                layout: LayoutType.SIMPLE_TEXT,
                title: '선정 도서',
                description: '《이기적 유전자》 리처드 도킨스\n\n발제자: 김철수\n준비물: 책과 열린 마음',
                mediaType: 'none',
                mediaUrl: '',
                textColor: '#ffffff',
                backgroundColor: '#854d0e',
                textAlignment: 'center'
            }
        ]
    }
];
