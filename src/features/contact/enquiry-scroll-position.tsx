'use client';

import { useEffect } from 'react';

const ENQUIRY_HASH = '#enquiry';
const SCROLL_SETTLE_DELAY = 500;
const TALL_CONTENT_GAP = 16;

export function EnquiryScrollPosition() {
  useEffect(() => {
    let frameId: number | null = null;
    let settleTimerId: number | null = null;

    const scrollToEnquiry = () => {
      if (window.location.hash !== ENQUIRY_HASH) return;

      const section = document.getElementById('enquiry');
      const content = section?.querySelector<HTMLElement>(
        '[data-enquiry-content]',
      );
      const header = document.querySelector<HTMLElement>('header');

      if (!section || !content) return;

      const headerHeight = header?.getBoundingClientRect().height ?? 0;
      const contentRect = content.getBoundingClientRect();
      const availableHeight = window.innerHeight - headerHeight;
      const contentFits = contentRect.height <= availableHeight;
      const verticalGap = contentFits
        ? (availableHeight - contentRect.height) / 2
        : TALL_CONTENT_GAP;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const contentTop = contentRect.top + window.scrollY;
      const contentTarget = contentTop - headerHeight - verticalGap;

      window.scrollTo({
        behavior: 'auto',
        top: Math.ceil(Math.max(0, sectionTop, contentTarget)),
      });
    };

    const scheduleFrame = () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        frameId = requestAnimationFrame(scrollToEnquiry);
      });
    };

    const scheduleScroll = () => {
      scheduleFrame();
      if (settleTimerId !== null) window.clearTimeout(settleTimerId);
      settleTimerId = window.setTimeout(scheduleFrame, SCROLL_SETTLE_DELAY);
    };

    const handleSamePageLink = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest<HTMLAnchorElement>('a[href]');
      if (!link) return;

      const destination = new URL(link.href, window.location.href);
      if (
        destination.pathname === window.location.pathname &&
        destination.hash === ENQUIRY_HASH
      ) {
        event.preventDefault();
        if (window.location.href !== destination.href) {
          window.history.pushState(null, '', destination);
        }
        scheduleScroll();
      }
    };

    scheduleScroll();
    void document.fonts.ready.then(scheduleScroll);

    window.addEventListener('hashchange', scheduleScroll);
    window.addEventListener('popstate', scheduleScroll);
    document.addEventListener('click', handleSamePageLink, true);

    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      if (settleTimerId !== null) window.clearTimeout(settleTimerId);
      window.removeEventListener('hashchange', scheduleScroll);
      window.removeEventListener('popstate', scheduleScroll);
      document.removeEventListener('click', handleSamePageLink, true);
    };
  }, []);

  return null;
}
