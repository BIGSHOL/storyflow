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

    // resize 이벤트 리스너 (즉시 반응 + debounce 최적화)
    let timeoutId: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      // 즉시 체크하여 반응성 개선
      checkMobile();
      // debounce로 추가 체크 (성능 최적화)
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
