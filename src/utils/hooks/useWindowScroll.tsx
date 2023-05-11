import { useCallback, useEffect, useState } from 'react';

export const useWindowScroll = (elementId: string) => {
  const [scrollTop, setScrollTop] = useState(0);
  const onScroll = useCallback(() => {
    const scrollTop = document.getElementById(elementId)?.scrollTop;
    setScrollTop(scrollTop || 0);
  }, []);
  useEffect(() => {
    document
      .getElementById(elementId)
      ?.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      document
        .getElementById(elementId)
        ?.removeEventListener('scroll', onScroll, { passive: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return scrollTop;
};
