import { useCallback, useEffect, useState } from 'react';

export const useWindowScroll = (elementId: string): number => {
  const [scrollTop, setScrollTop] = useState(0);
  const onScroll = useCallback(() => {
    const updatedScrollTop = document.getElementById(elementId)?.scrollTop;
    setScrollTop(updatedScrollTop || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    document
      .getElementById(elementId)
      ?.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      document
        .getElementById(elementId)
        ?.removeEventListener('scroll', onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return scrollTop;
};
