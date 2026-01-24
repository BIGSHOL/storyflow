import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

interface AdBannerProps {
  show: boolean;
  onUpgrade?: () => void;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

const AdBanner: React.FC<AdBannerProps> = ({ show, onUpgrade }) => {
  const adRef = useRef<HTMLDivElement>(null);
  const adInitialized = useRef(false);

  useEffect(() => {
    // AdSense 스크립트가 로드되어 있고, 광고가 표시되어야 하며, 아직 초기화되지 않은 경우에만 실행
    if (show && !adInitialized.current && typeof window !== 'undefined') {
      try {
        // AdSense 광고 초기화
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        adInitialized.current = true;
      } catch (err) {
        console.error('AdSense 초기화 오류:', err);
      }
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="bg-gray-900 border-t border-gray-800">
      {/* 광고 영역 */}
      <div className="max-w-[728px] mx-auto py-2 px-4">
        <div
          ref={adRef}
          className="bg-gray-800 rounded-lg min-h-[90px] flex items-center justify-center relative"
        >
          {/* AdSense 광고 슬롯 - 실제 AdSense 코드로 교체 필요 */}
          {/*
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
            data-ad-slot="XXXXXXXXXX"
            data-ad-format="horizontal"
            data-full-width-responsive="true"
          />
          */}

          {/* 개발 환경용 플레이스홀더 */}
          <div className="text-center">
            <p className="text-gray-500 text-sm">광고 영역</p>
            <p className="text-gray-600 text-xs mt-1">AdSense 승인 후 실제 광고가 표시됩니다</p>
            {onUpgrade && (
              <button
                onClick={onUpgrade}
                className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 underline"
              >
                Pro로 업그레이드하여 광고 제거
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer 링크 */}
      <div className="border-t border-gray-800 py-3 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} StoryFlow Creator
          </p>
          <div className="flex gap-4">
            <Link
              to="/privacy"
              className="text-gray-500 hover:text-gray-300 text-xs transition-colors"
            >
              개인정보처리방침
            </Link>
            <Link
              to="/terms"
              className="text-gray-500 hover:text-gray-300 text-xs transition-colors"
            >
              이용약관
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdBanner;
