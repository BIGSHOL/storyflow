import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

const PrivacyPage: React.FC = () => {
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
          <Shield className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-bold">개인정보처리방침</h1>
        </div>

        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-gray-400 text-sm mb-8">
            최종 수정일: {new Date().toLocaleDateString('ko-KR')}
          </p>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-white">1. 개인정보의 수집 및 이용 목적</h2>
            <p className="text-gray-300 leading-relaxed">
              StoryFlow Creator(이하 "서비스")는 다음의 목적을 위하여 개인정보를 수집하고 이용합니다:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
              <li>회원 가입 및 서비스 제공</li>
              <li>서비스 이용에 따른 본인 확인</li>
              <li>서비스 개선 및 신규 서비스 개발</li>
              <li>고객 문의 및 불만 처리</li>
              <li>유료 서비스 결제 및 정산</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-white">2. 수집하는 개인정보 항목</h2>
            <p className="text-gray-300 leading-relaxed">
              서비스는 다음과 같은 개인정보를 수집합니다:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
              <li><strong>필수 항목:</strong> 이메일 주소, 비밀번호, 닉네임</li>
              <li><strong>선택 항목:</strong> 프로필 이미지, 연락처</li>
              <li><strong>자동 수집 항목:</strong> IP 주소, 쿠키, 서비스 이용 기록, 접속 로그</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-white">3. 개인정보의 보유 및 이용 기간</h2>
            <p className="text-gray-300 leading-relaxed">
              회원의 개인정보는 서비스 이용 기간 동안 보유하며, 회원 탈퇴 시 지체 없이 파기합니다.
              다만, 관계 법령에 따라 보존할 필요가 있는 경우 해당 기간 동안 보관합니다:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
              <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
              <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
              <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
              <li>웹사이트 방문 기록: 3개월</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-white">4. 개인정보의 제3자 제공</h2>
            <p className="text-gray-300 leading-relaxed">
              서비스는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.
              다만, 다음의 경우에는 예외로 합니다:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령의 규정에 의하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-white">5. 쿠키의 사용</h2>
            <p className="text-gray-300 leading-relaxed">
              서비스는 이용자에게 개별적인 맞춤 서비스를 제공하기 위해 쿠키(cookie)를 사용합니다.
              쿠키는 웹사이트를 운영하는 데 이용되는 서버가 이용자의 브라우저에게 보내는 소량의 정보이며,
              이용자의 컴퓨터 하드디스크에 저장됩니다.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              이용자는 쿠키 설치에 대한 선택권을 가지고 있으며, 웹 브라우저 설정을 통해
              쿠키를 허용하거나 거부할 수 있습니다.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-white">6. 광고</h2>
            <p className="text-gray-300 leading-relaxed">
              서비스는 무료 이용자에게 Google AdSense를 통한 광고를 제공할 수 있습니다.
              Google AdSense는 쿠키를 사용하여 이용자의 관심사에 기반한 광고를 표시합니다.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              이용자는 Google 광고 설정 페이지(https://adssettings.google.com)에서
              맞춤 광고를 비활성화할 수 있습니다.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-white">7. 이용자의 권리</h2>
            <p className="text-gray-300 leading-relaxed">
              이용자는 언제든지 자신의 개인정보에 대해 다음 권리를 행사할 수 있습니다:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
              <li>개인정보 열람 요구</li>
              <li>오류 등이 있을 경우 정정 요구</li>
              <li>삭제 요구</li>
              <li>처리 정지 요구</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-white">8. 개인정보 보호책임자</h2>
            <p className="text-gray-300 leading-relaxed">
              서비스는 개인정보 처리에 관한 업무를 총괄해서 책임지고,
              개인정보 처리와 관련한 이용자의 불만 처리 및 피해 구제를 위하여
              아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <div className="bg-gray-800 rounded-lg p-4 mt-4">
              <p className="text-gray-300">
                <strong>개인정보 보호책임자</strong><br />
                이메일: privacy@storyflow.com
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-white">9. 개인정보처리방침의 변경</h2>
            <p className="text-gray-300 leading-relaxed">
              이 개인정보처리방침은 법령, 정책 또는 보안 기술의 변경에 따라
              내용의 추가, 삭제 및 수정이 있을 수 있으며, 변경 시 최소 7일 전에
              서비스 내 공지사항을 통해 고지합니다.
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

export default PrivacyPage;
