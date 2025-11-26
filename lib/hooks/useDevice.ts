import { useState, useEffect } from 'react';

type DeviceType = 'mobile' | 'tablet' | 'desktop';

export function useDevice() {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType('mobile');
        setIsMobileOrTablet(true);
      } else if (width < 1024) {
        setDeviceType('tablet');
        setIsMobileOrTablet(true);
      } else {
        setDeviceType('desktop');
        setIsMobileOrTablet(false);
      }
    };

    // 初期実行
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { deviceType, isMobileOrTablet };
}
