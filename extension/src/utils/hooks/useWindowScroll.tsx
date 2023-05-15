import { useCallback, useEffect, useState } from 'react';

export const useWindowScroll = (elementId: string): number => {
  const [scrollTop, setScrollTop] = useState(0);
  const [currentlyListenedToElementId, setCurrentlyListenedToElementId] =
    useState<string | null>(null);
  const onScroll = useCallback(() => {
    const updatedScrollTop = document.getElementById(elementId)?.scrollTop;
    setScrollTop(updatedScrollTop || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elementId]);
  useEffect(() => {
    if (currentlyListenedToElementId) {
      document
        .getElementById(currentlyListenedToElementId)
        ?.removeEventListener('scroll', onScroll);
    }
    document
      .getElementById(elementId)
      ?.addEventListener('scroll', onScroll, { passive: true });
    setCurrentlyListenedToElementId(elementId);
    return () => {
      document
        .getElementById(elementId)
        ?.removeEventListener('scroll', onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elementId]);

  return scrollTop;
};
