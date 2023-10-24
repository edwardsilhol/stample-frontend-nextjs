'use client';

import { useWindowScroll } from './useWindowScroll';
import requestTimeout, {
  clearRequestTimeout,
} from '@essentials/request-timeout';
import { useEffect, useRef, useState } from 'react';

export function useScroller(
  documentId: string,
  offset = 0,
  fps = 12,
): { scrollTop: number; isScrolling: boolean } {
  const scrollTop = useWindowScroll(documentId);
  const [isScrolling, setIsScrolling] = useState(false);
  const didMount = useRef(0);

  useEffect(() => {
    if (didMount.current === 1) setIsScrolling(true);
    let didUnsubscribe = false;
    const to = requestTimeout(
      () => {
        if (didUnsubscribe) return;
        // This is here to prevent premature bail outs while maintaining high resolution
        // unsets. Without it there will always bee a lot of unnecessary DOM writes to style.
        setIsScrolling(false);
      },
      40 + 1000 / fps,
    );
    didMount.current = 1;
    return () => {
      didUnsubscribe = true;
      clearRequestTimeout(to);
    };
  }, [fps, scrollTop]);

  return { scrollTop: Math.max(0, scrollTop - offset), isScrolling };
}
