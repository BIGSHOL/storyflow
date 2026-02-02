import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>돌아가기</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-8">
          <FileText className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-bold">이용약관</h1>
        </div>

        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-gray-400 text-sm mb-8">
            최종 수정일: {new Date().toLocaleDateString('ko-KR')}
          </p>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-white">제1조 (목적)</h2>
            <p className="text-gray-300 leading-relaxed">
              이 약관은 StoryFlow Creator(이하 "서비스")가 제공하는 웹페이지 제작 서비스의
              이용조건 및 절차, 이용자와 서비스 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-white">제2조 (정의)</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li><strong>"서비스"</strong>란 StoryFlow Creator가 제공하는 노코드 웹페이지 제작 도구를 말합니다.</li>
              <li><strong>"이용자"</strong>란 서비스에 접속하여 이 약관에 따라 서비스를 이용하는 회원 및 비회원을 말합니다.</li>
              <li><strong>"회원"</strong>이란 서비스에 가입하여 아이디를 부여받은 자를 말합니다.</li>
              <li><strong>"콘텐츠"</strong>란 이용자가 서비스를 통해 제작한 웹페이지, 이미지, 텍스트 등을 말합니다.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-white">제3조 (약관의 효력 및 변경)</h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2">
              <li>이 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력을 발생합니다.</li>
              <li>서비스는 합리적인 사유가 발생할 경우 관련 법령에 위배되지 않는 범위 내에서 약관을 변경할 수 있습니다.</li>
              <li>변경된 약관은 공지 후 7일이 경과한 날부터 효력이 발생합니다.</li>
            </ol>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-white">제4조 (서비스의 제공)</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              서비스는 다음과 같은 기능을 제공합니다:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>드래그 앤 드롭 기반 웹페이지 제작 도구</li>
              <li>다양한 레이아웃 템플릿</li>
              <li>이미지 및 미디어 업로드</li>
              <li>실시간 프리뷰</li>
              <li>HTML 내보내기</li>
              <li>프로젝트 저장 및 관리</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-white">제5조 (서비스 이용료)</h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2">
              <li>서비스는 무료 플랜과 유료 플랜을 제공합니다.</li>
              <li>무료 플랜 이용자에게는 광고가 표시될 수 있습니다.</li>
              <li>유료 플랜 가입 시 광고가 제거되며, 추가 기능이 제공됩니다.</li>
              <li>유료 서비스의 이용료 및 결제 방법은 별도로 안내합니다.</li>
            </ol>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-white">제6조 (이용자의 의무)</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              이용자는 다음 행위를 하여서는 안 됩니다:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>타인의 개인정보를 도용하는 행위</li>
              <li>서비스의 운영을 방해하는 행위</li>
              <li>저작권 등 지적재산권을 침해하는 행위</li>
              <li>음란물, 불법 콘텐츠를 제작하거나 배포하는 행위</li>
              <li>서비스를 이용하여 법령에 위반되는 행위</li>
              <li>기타 공공질서 및 미풍양속에 반하는 행위</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-white">제7조 (콘텐츠의 권리)</h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2">
              <li>이용자가 제작한 콘텐츠의 저작권은 이용자에게 귀속됩니다.</li>
              <li>서비스가 제공하는 템플릿, UI 요소 등의 저작권은 서비스에 귀속됩니다.</li>
              <li>이용자는 제작한 콘텐츠를 자유롭게 사용, 배포할 수 있습니다.</li>
            </ol>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-white">제8조 (서비스의 중단)</h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2">
              <li>서비스는 시스템 점검, 장비 교체 등의 사유로 서비스 제공을 일시적으로 중단할 수 있습니다.</li>
              <li>천재지변 또는 불가항력적인 사유로 서비스가 중단될 수 있습니다.</li>
              <li>서비스 중단 시 사전에 공지하며, 부득이한 경우 사후에 공지할 수 있습니다.</li>
            </ol>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-white">제9조 (면책조항)</h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2">
              <li>서비스는 이용자가 제작한 콘텐츠에 대해 책임을 지지 않습니다.</li>
              <li>서비스는 이용자 간 또는 이용자와 제3자 간의 분쟁에 개입하지 않습니다.</li>
              <li>서비스는 무료로 제공되는 서비스에 대해서는 책임이 제한됩니다.</li>
            </ol>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-white">제10조 (계정 해지)</h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2">
              <li>이용자는 언제든지 서비스 내에서 회원 탈퇴를 요청할 수 있습니다.</li>
              <li>서비스는 이용자가 이 약관을 위반한 경우 서비스 이용을 제한하거나 계정을 해지할 수 있습니다.</li>
              <li>계정 해지 시 이용자의 콘텐츠는 삭제되며, 복구가 불가능합니다.</li>
            </ol>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-white">제11조 (광고)</h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2">
              <li>서비스는 무료 플랜 이용자에게 Google AdSense 등을 통한 광고를 표시할 수 있습니다.</li>
              <li>광고로 인해 발생하는 손해에 대해 서비스는 책임을 지지 않습니다.</li>
              <li>유료 플랜 가입 시 광고 없이 서비스를 이용할 수 있습니다.</li>
            </ol>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-white">제12조 (준거법 및 관할)</h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2">
              <li>이 약관의 해석 및 서비스 이용에 관한 분쟁은 대한민국 법률에 따릅니다.</li>
              <li>서비스 이용으로 발생한 분쟁에 대해 소송이 제기되는 경우 서비스의 본사 소재지를 관할하는 법원을 전속 관할 법원으로 합니다.</li>
            </ol>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-white">부칙</h2>
            <p className="text-gray-300 leading-relaxed">
              이 약관은 {new Date().toLocaleDateString('ko-KR')}부터 시행합니다.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} StoryFlow Creator. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                개인정보처리방침
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                이용약관
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TermsPage;
