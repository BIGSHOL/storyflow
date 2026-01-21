import { useState, useEffect } from 'react';

// 헤더 아이콘들이 붙기 전에 모바일 뷰로 전환
const MOBILE_BREAKPOINT = 1400;

export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < MOBILE_BREAKPOINT;
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // 초기 체크
    checkMobile();

    // resize 이벤트 리스너 (debounce 적용)
    let timeoutId: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 100);
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
