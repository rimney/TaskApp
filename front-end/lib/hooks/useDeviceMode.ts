import { useState, useEffect } from 'react';

export function useDeviceMode(breakpoint: number = 640): 'mobile' | 'desktop' {
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'desktop'>(
    typeof window !== 'undefined' && window.matchMedia(`(min-width: ${breakpoint}px)`).matches ? 'desktop' : 'mobile'
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${breakpoint}px)`);

    const handleChange = (e: MediaQueryListEvent) => {
      setDeviceMode(e.matches ? 'desktop' : 'mobile');
    };

    // Initial checka
    setDeviceMode(mediaQuery.matches ? 'desktop' : 'mobile');

    // Add listener
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [breakpoint]);

  return deviceMode;
}