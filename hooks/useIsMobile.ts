import { useState, useEffect } from 'react';

// 실제 모바일 디바이스에서만 모바일 뷰 사용
// User-Agent 기반 + 터치스크린 + 작은 화면
export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;

    // User-Agent로 모바일 디바이스 감지
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());

    // 터치 디바이스 + 작은 화면 (768px 이하)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;

    return isMobileDevice || (isTouchDevice && isSmallScreen);
  });

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;

      setIsMobile(isMobileDevice || (isTouchDevice && isSmallScreen));
    };

    // 초기 체크
    checkMobile();

    // resize 이벤트 리스너 (터치 디바이스에서 화면 회전 대응)
    let timeoutId: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      checkMobile();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 50);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return isMobile;
};

export default useIsMobile;
