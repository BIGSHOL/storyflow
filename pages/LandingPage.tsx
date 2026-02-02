import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Layers,
  Image,
  Type,
  Download,
  Smartphone,
  Palette,
  MousePointerClick,
  Eye,
  Share2,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  Music,
  Video,
  BarChart3,
  Layout,
  Zap,
  Globe,
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  const features = [
    {
      icon: <MousePointerClick className="w-6 h-6" />,
      title: '드래그 앤 드롭',
      description: '이미지와 동영상을 드래그하여 놓기만 하면 됩니다. 코딩 지식이 전혀 필요 없어요.',
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: '20가지 이상의 레이아웃',
      description: '히어로, 분할, 갤러리, 카드, 캐러셀, 통계, 방명록 등 다양한 레이아웃 템플릿을 제공합니다.',
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: '실시간 프리뷰',
      description: '편집 내용이 즉시 오른쪽 프리뷰에 반영됩니다. 완성된 모습을 바로 확인하세요.',
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: '타이포그래피 커스터마이징',
      description: '50종 이상의 한글/영문 폰트, 크기, 색상, 그림자 효과까지 자유롭게 설정할 수 있어요.',
    },
    {
      icon: <Image className="w-6 h-6" />,
      title: '이미지 필터 & 효과',
      description: '흑백, 세피아, 블러 등 이미지 필터와 오버레이 효과로 분위기를 연출하세요.',
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: '동영상 히어로',
      description: '배경에 동영상을 넣어 역동적인 첫 화면을 만들 수 있습니다. YouTube URL도 지원해요.',
    },
    {
      icon: <Music className="w-6 h-6" />,
      title: '오디오 플레이어',
      description: '음악이나 팟캐스트를 삽입할 수 있어요. YouTube, SoundCloud URL을 바로 붙여넣기만 하면 됩니다.',
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: '통계 & 숫자 애니메이션',
      description: '숫자가 카운트업 되는 애니메이션 효과로 인상적인 통계 섹션을 만들어보세요.',
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: '반응형 디자인',
      description: '데스크탑, 태블릿, 모바일에서 모두 아름답게 보이는 반응형 페이지를 자동으로 생성합니다.',
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: 'HTML/PDF/이미지 내보내기',
      description: '완성된 페이지를 HTML 파일, PDF 문서, PNG 이미지 등 다양한 형식으로 내보낼 수 있어요.',
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: '링크 공유',
      description: '클릭 한 번으로 공유 링크를 생성하여 누구와든 웹페이지를 공유할 수 있습니다.',
    },
    {
      icon: <Layout className="w-6 h-6" />,
      title: '30가지 이상의 템플릿',
      description: '포트폴리오, 비즈니스, 이벤트, 크리에이티브 등 목적에 맞는 완성형 템플릿을 골라 시작하세요.',
    },
  ];

  const useCases = [
    {
      title: '포트폴리오',
      description: '사진작가, 디자이너, 일러스트레이터를 위한 작품 포트폴리오 페이지를 만들어보세요. 갤러리와 매이슨리 레이아웃으로 작품을 아름답게 전시할 수 있습니다.',
      target: '프리랜서, 크리에이터',
    },
    {
      title: '비즈니스 소개',
      description: '카페, 레스토랑, 헬스장, 미용실 등 소규모 비즈니스의 소개 페이지를 쉽게 만들 수 있어요. 메뉴판, 가격표, 위치 정보까지 한 페이지에 담아보세요.',
      target: '소상공인, 자영업자',
    },
    {
      title: '이벤트 초대장',
      description: '결혼식, 생일파티, 동창회, 전시회 등 특별한 이벤트의 디지털 초대장을 제작하세요. 방명록 기능으로 참석 의사를 받을 수도 있어요.',
      target: '개인, 기업',
    },
    {
      title: '학교 과제 & 발표',
      description: '보고서, 프레젠테이션, 프로젝트 결과물을 웹페이지로 만들어 제출하세요. PDF로 내보내기하면 문서로도 활용할 수 있습니다.',
      target: '학생, 교사',
    },
    {
      title: '뮤지션 & 아티스트',
      description: 'YouTube 음악을 임베드하고, 앨범 아트를 갤러리로 전시하고, 공연 일정을 소개하는 페이지를 만들어보세요.',
      target: '뮤지션, 밴드, DJ',
    },
    {
      title: '여행 & 추억 기록',
      description: '여행 사진과 글을 세로 스크롤로 이어붙여 멋진 여행기를 만들 수 있어요. 친구들에게 링크를 공유해보세요.',
      target: '여행자, 블로거',
    },
  ];

  const steps = [
    {
      step: '1',
      title: '템플릿 선택 또는 새로 시작',
      description: '30가지 이상의 전문가 수준 템플릿에서 골라 시작하거나, 빈 캔버스에서 자유롭게 시작할 수 있어요.',
    },
    {
      step: '2',
      title: '이미지와 텍스트 추가',
      description: '이미지를 드래그하여 놓고, 텍스트를 입력하세요. 레이아웃, 폰트, 색상을 자유롭게 변경할 수 있습니다.',
    },
    {
      step: '3',
      title: '실시간으로 확인',
      description: '오른쪽 프리뷰에서 완성된 모습을 바로 확인하세요. 데스크탑과 모바일 뷰를 전환하며 볼 수 있어요.',
    },
    {
      step: '4',
      title: '내보내기 또는 공유',
      description: 'HTML, PDF, 이미지로 내보내거나 공유 링크를 생성하여 누구에게나 보여줄 수 있습니다.',
    },
  ];

  const faqs = [
    {
      question: 'StoryFlow Creator는 무료인가요?',
      answer: '네, StoryFlow Creator는 기본적으로 무료로 사용할 수 있습니다. 무료 플랜에서는 프로젝트 3개, 미디어 저장 100MB, 일 10회 내보내기를 제공합니다. 더 많은 기능이 필요하시면 Pro 플랜을 이용해주세요.',
    },
    {
      question: '코딩을 전혀 몰라도 사용할 수 있나요?',
      answer: '물론이에요! StoryFlow Creator는 코딩 지식이 전혀 필요 없습니다. 마우스로 클릭하고 드래그하는 것만으로 멋진 웹페이지를 만들 수 있어요. 텍스트를 입력하고, 이미지를 끌어다 놓고, 레이아웃을 선택하기만 하면 됩니다.',
    },
    {
      question: '어떤 형식으로 내보내기할 수 있나요?',
      answer: 'HTML 파일, PDF 문서, PNG 이미지, 섹션별 개별 이미지, 썸네일(OG 이미지) 등 다양한 형식으로 내보내기가 가능합니다. HTML 파일은 외부 의존성 없이 독립적으로 작동하므로 어떤 웹 호스팅에서든 바로 사용할 수 있어요.',
    },
    {
      question: '만든 페이지를 다른 사람에게 보여줄 수 있나요?',
      answer: '네, 공유 기능을 사용하면 고유한 링크가 생성되어 누구에게나 보여줄 수 있습니다. 별도의 호스팅이나 도메인 없이도 바로 공유가 가능해요.',
    },
    {
      question: '이미지와 동영상은 어떤 형식을 지원하나요?',
      answer: 'PNG, JPG, GIF, WebP 이미지와 MP4, WebM 동영상을 지원합니다. 오디오 섹션에서는 MP3 파일뿐만 아니라 YouTube와 SoundCloud URL도 지원하여 쉽게 음악을 삽입할 수 있어요.',
    },
    {
      question: '모바일에서도 사용할 수 있나요?',
      answer: '네, StoryFlow Creator는 데스크탑, 태블릿, 모바일 환경을 모두 지원합니다. 어디서든 편집하고 프리뷰할 수 있어요. 만들어진 웹페이지도 모든 기기에서 자동으로 반응형으로 표시됩니다.',
    },
    {
      question: '작업물은 자동으로 저장되나요?',
      answer: '로그인한 상태에서는 클라우드에 자동 저장됩니다. 브라우저를 닫아도 안전하게 보관되어 있으며, 다른 기기에서도 이어서 작업할 수 있어요. Ctrl+Z/Y로 실행 취소/다시 실행도 가능합니다.',
    },
    {
      question: '세로 스크롤 스토리텔링이란 무엇인가요?',
      answer: '세로 스크롤 스토리텔링은 사용자가 페이지를 아래로 스크롤하면서 이야기가 전개되는 웹 디자인 방식입니다. 각 섹션이 전체 화면을 차지하며, 이미지와 텍스트가 조화롭게 배치되어 몰입감 있는 경험을 제공합니다. suzag.com과 같은 고급 웹사이트에서 흔히 사용되는 기법이에요.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white scroll-smooth">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="StoryFlow Creator" className="w-8 h-8 rounded-lg" />
            <span className="font-serif font-bold text-lg">StoryFlow Creator</span>
          </Link>
          <div className="flex items-center gap-4">
            <a
              href="#features"
              className="hidden sm:inline text-sm text-gray-400 hover:text-white transition-colors"
            >
              기능
            </a>
            <a
              href="#how-it-works"
              className="hidden sm:inline text-sm text-gray-400 hover:text-white transition-colors"
            >
              사용법
            </a>
            <a
              href="#faq"
              className="hidden sm:inline text-sm text-gray-400 hover:text-white transition-colors"
            >
              FAQ
            </a>
            <Link
              to="/"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              무료로 시작하기
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600/20 border border-indigo-500/30 rounded-full text-indigo-300 text-sm mb-8">
            <Zap className="w-4 h-4" />
            <span>코딩 없이 누구나 쉽게</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
            이미지로 만드는
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              아름다운 웹페이지
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            드래그 앤 드롭으로 이미지와 텍스트를 배치하고, 전문가 수준의 세로 스크롤
            스토리텔링 페이지를 몇 분 만에 완성하세요. 코딩 지식은 전혀 필요 없습니다.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
            >
              무료로 시작하기
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-xl transition-colors"
            >
              사용법 알아보기
            </a>
          </div>
          <p className="mt-6 text-sm text-gray-500">
            가입 없이도 바로 사용 가능 · 무료 플랜 영구 제공
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">강력하지만 쉬운 기능들</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              복잡한 코딩이나 디자인 도구 없이도 전문적인 웹페이지를 만들 수 있도록
              직관적인 기능들을 제공합니다.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600/50 transition-colors"
              >
                <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center text-indigo-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">4단계로 완성하세요</h2>
            <p className="text-gray-400 text-lg">
              복잡한 과정 없이 몇 번의 클릭만으로 웹페이지가 완성됩니다.
            </p>
          </div>
          <div className="space-y-8">
            {steps.map((item, index) => (
              <div key={index} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-xl font-bold">
                  {item.step}
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-6 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">이런 분들에게 딱이에요</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              StoryFlow Creator는 다양한 목적에 맞는 웹페이지를 누구나 쉽게 만들 수
              있도록 설계되었습니다.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold mb-2">{useCase.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-3">{useCase.description}</p>
                <span className="text-xs text-indigo-400 bg-indigo-600/10 px-3 py-1 rounded-full">
                  {useCase.target}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">자주 묻는 질문</h2>
            <p className="text-gray-400 text-lg">
              StoryFlow Creator에 대해 궁금한 점을 확인하세요.
            </p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-800/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                    <span className="font-medium">{faq.question}</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-5 pt-0">
                    <p className="text-gray-400 leading-relaxed pl-8">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-900/50 to-gray-950">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">지금 바로 시작하세요</h2>
          <p className="text-gray-400 text-lg mb-8">
            코딩 없이 아름다운 웹페이지를 만드는 가장 쉬운 방법입니다.
            <br />
            무료로 시작하고, 필요할 때 업그레이드하세요.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors"
          >
            무료로 시작하기
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>무료 플랜 영구 제공</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>가입 없이 체험 가능</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>설치 불필요</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo.png" alt="StoryFlow" className="w-7 h-7 rounded-lg" />
                <span className="font-serif font-bold">StoryFlow Creator</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                코딩 없이 누구나 쉽게 이미지로 웹페이지를 만들 수 있는 노코드 웹 빌더입니다.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-3 text-gray-300">제품</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="text-gray-500 hover:text-gray-300 transition-colors">
                    에디터
                  </Link>
                </li>
                <li>
                  <a href="#features" className="text-gray-500 hover:text-gray-300 transition-colors">
                    기능 소개
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-gray-500 hover:text-gray-300 transition-colors">
                    사용법
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-gray-500 hover:text-gray-300 transition-colors">
                    자주 묻는 질문
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3 text-gray-300">정책</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/privacy" className="text-gray-500 hover:text-gray-300 transition-colors">
                    개인정보처리방침
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-500 hover:text-gray-300 transition-colors">
                    이용약관
                  </Link>
                </li>
                <li>
                  <a
                    href="mailto:st2000423@gmail.com"
                    className="text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    문의하기
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800/50 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} StoryFlow Creator. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Globe className="w-4 h-4" />
              <span>한국어</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
