import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

// 디바이스 타입 감지
export const useDeviceType = (): DeviceType => {
  const [deviceType, setDeviceType] = useState<DeviceType>(() => {
    if (typeof window === 'undefined') return 'desktop';

    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const width = window.innerWidth;

    // 모바일 디바이스 (폰) - User-Agent 우선
    const isMobileDevice = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());

    // 태블릿 디바이스 (iPad, Android tablet) - User-Agent 우선
    const isTabletDevice = /ipad|android(?!.*mobile)/i.test(userAgent.toLowerCase());

    // 모바일 (작은 화면 폰)
    if (isMobileDevice && width <= 768) {
      return 'mobile';
    }

    // 태블릿 (User-Agent로만 판단, 화면 크기는 참고만)
    if (isTabletDevice) {
      return 'tablet';
    }

    // 데스크탑 (기본값)
    return 'desktop';
  });

  useEffect(() => {
    const checkDeviceType = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const width = window.innerWidth;

      const isMobileDevice = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      const isTabletDevice = /ipad|android(?!.*mobile)/i.test(userAgent.toLowerCase());

      // 모바일 (작은 화면 폰)
      if (isMobileDevice && width <= 768) {
        setDeviceType('mobile');
      }
      // 태블릿 (User-Agent로만 판단)
      else if (isTabletDevice) {
        setDeviceType('tablet');
      }
      // 데스크탑 (기본값)
      else {
        setDeviceType('desktop');
      }
    };

    checkDeviceType();

    let timeoutId: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkDeviceType, 50);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return deviceType;
};

export default useDeviceType;
