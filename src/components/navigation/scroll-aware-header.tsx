'use client';

import type { ComponentPropsWithoutRef } from 'react';
import { useEffect, useRef, useState } from 'react';

const SCROLL_THRESHOLD = 10;
const TOP_REVEAL_OFFSET = 48;

type ScrollAwareHeaderProps = ComponentPropsWithoutRef<'header'>;

export function ScrollAwareHeader({
  className = '',
  ...props
}: ScrollAwareHeaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    function handleScroll() {
      const currentScrollY = Math.max(window.scrollY, 0);

      if (currentScrollY <= TOP_REVEAL_OFFSET) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      const scrollDelta = currentScrollY - lastScrollY.current;

      if (Math.abs(scrollDelta) < SCROLL_THRESHOLD) return;

      setIsVisible(scrollDelta < 0);
      lastScrollY.current = currentScrollY;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`${className} transform-gpu transition-transform duration-300 ease-out motion-reduce:transition-none ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
      onFocusCapture={() => setIsVisible(true)}
      {...props}
    />
  );
}
