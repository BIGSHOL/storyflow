import React from 'react';
import { Link } from 'react-router-dom';

interface AdBannerProps {
  show: boolean;
  onUpgrade?: () => void;
}

// AdSense 승인 후 이 플래그를 true로 변경하고 슬롯 ID를 입력하세요
const ADSENSE_ENABLED = false;
const ADSENSE_CLIENT = 'ca-pub-2903606885354442';
const ADSENSE_SLOT = ''; // 승인 후 슬롯 ID 입력

const AdBanner: React.FC<AdBannerProps> = ({ show, onUpgrade }) => {
  if (!show) return null;

  return (
    <div className="bg-gray-900 border-t border-gray-800">
      {/* 광고 영역 */}
      <div className="max-w-[728px] mx-auto py-2 px-4">
        <div className="bg-gray-800 rounded-lg min-h-[90px] flex items-center justify-center relative">
          {ADSENSE_ENABLED && ADSENSE_SLOT ? (
            /* AdSense 승인 후 활성화 */
            <ins
              className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client={ADSENSE_CLIENT}
              data-ad-slot={ADSENSE_SLOT}
              data-ad-format="horizontal"
              data-full-width-responsive="true"
            />
          ) : (
            /* 승인 대기 중 플레이스홀더 */
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
          )}
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
