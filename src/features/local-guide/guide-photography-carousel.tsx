'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import type { KeyboardEvent, TouchEvent } from 'react';
import { useEffect, useRef, useState } from 'react';

import type { LocalGuidePhotograph } from './types';

export type GuideCarouselLabels = {
  image: string;
  next: string;
  previous: string;
};

type GuidePhotographyCarouselProps = {
  label: string;
  labels: GuideCarouselLabels;
  photographs: readonly LocalGuidePhotograph[];
};

const SWIPE_THRESHOLD = 48;

export function GuidePhotographyCarousel({
  label,
  labels,
  photographs,
}: GuidePhotographyCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const movingDotRef = useRef<HTMLSpanElement>(null);

  const previousIndexRef = useRef(activeIndex);

  useEffect(() => {
    const previousIndex = previousIndexRef.current;
    previousIndexRef.current = activeIndex;
    if (previousIndex === activeIndex) return;
    const dot = movingDotRef.current;
    if (!dot) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    dot.animate(
      [
        { opacity: 1, filter: 'blur(0px)', offset: 0 },
        { opacity: 0.25, filter: 'blur(1.5px)', offset: 0.5 },
        { opacity: 1, filter: 'blur(0px)', offset: 1 },
      ],
      {
        duration: 300,
        easing: 'ease-in-out',
      },
    );
  }, [activeIndex]);

  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const count = photographs.length;
  const photograph = photographs[activeIndex];
  const showNavigation = count > 1;

  if (!photograph) return null;

  function navigate(direction: -1 | 1) {
    setActiveIndex((current) => (current + direction + count) % count);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!showNavigation) return;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      navigate(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      navigate(1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setActiveIndex(count - 1);
    }
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    const touch = event.touches[0];
    touchStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const start = touchStart.current;
    const touch = event.changedTouches[0];
    touchStart.current = null;

    if (!showNavigation || !start || !touch) return;

    const horizontalDistance = touch.clientX - start.x;
    const verticalDistance = touch.clientY - start.y;

    if (
      Math.abs(horizontalDistance) < SWIPE_THRESHOLD ||
      Math.abs(horizontalDistance) <= Math.abs(verticalDistance)
    ) {
      return;
    }

    navigate(horizontalDistance < 0 ? 1 : -1);
  }

  return (
    <div
      data-guide-carousel
      role='region'
      aria-label={label}
      tabIndex={showNavigation ? 0 : undefined}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchCancel={() => {
        touchStart.current = null;
      }}
      onTouchEnd={handleTouchEnd}
      className='relative h-[52svh] min-h-72 touch-pan-y overflow-hidden focus-visible:outline-offset-[-2px] lg:h-[78svh] lg:max-h-[48rem]'
    >
      <Image
        key={photograph.id}
        src={photograph.src}
        alt={photograph.alt}
        fill
        sizes='(min-width: 1024px) 60vw, 92vw'
        className='object-contain'
        style={
          photograph.imagePosition
            ? { objectPosition: photograph.imagePosition }
            : undefined
        }
      />

      {showNavigation ? (
        <>
          <div className='absolute inset-x-3 top-1/2 z-10 flex -translate-y-1/2 justify-between'>
            <button
              type='button'
              aria-label={labels.previous}
              onClick={() => navigate(-1)}
              className='flex size-10 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--trb-lagoon)_35%,transparent)] text-[var(--trb-sand)] backdrop-blur-md transition-colors hover:bg-[color-mix(in_srgb,var(--trb-lagoon)_90%,transparent)] focus-visible:outline-offset-2 motion-reduce:transition-none'
            >
              <ChevronLeft aria-hidden='true' size={22} strokeWidth={1.5} />
            </button>

            <button
              type='button'
              aria-label={labels.next}
              onClick={() => navigate(1)}
              className='flex size-10 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--trb-lagoon)_35%,transparent)] text-[var(--trb-sand)] backdrop-blur-md transition-colors hover:bg-[color-mix(in_srgb,var(--trb-lagoon)_90%,transparent)] focus-visible:outline-offset-2 motion-reduce:transition-none'
            >
              <ChevronRight aria-hidden='true' size={22} strokeWidth={1.5} />
            </button>
          </div>

          <div
            aria-hidden='true'
            className='absolute inset-x-0 bottom-4 z-10 flex justify-center'
          >
            <div className='flex items-center justify-center gap-2.5 rounded-full bg-[color-mix(in_srgb,var(--trb-lagoon)_35%,transparent)] px-4 py-2.5 shadow-sm backdrop-blur-md'>
              <div className='relative flex items-center gap-2.5'>
                {photographs.map(({ id }) => (
                  <span
                    key={id}
                    className='block size-2 rounded-full border border-[color-mix(in_srgb,var(--trb-sand)_70%,transparent)] bg-[color-mix(in_srgb,var(--trb-lake)_65%,transparent)] shadow-[inset_0_1px_3px_rgba(0,0,0,0.55)]'
                  />
                ))}

                <span
                  ref={movingDotRef}
                  className='pointer-events-none absolute left-0 top-0 z-0 block size-2 rounded-full border border-[var(--trb-sand)] bg-[var(--trb-sand)] shadow-[0_0_6px_color-mix(in_srgb,var(--trb-sand)_45%,transparent)] transition-transform duration-300 ease-in-out motion-reduce:transition-none'
                  style={{
                    transform: `translateX(${activeIndex * 18}px)`,
                  }}
                />
              </div>
            </div>
          </div>

          <p className='sr-only' aria-atomic='true' aria-live='polite'>
            {labels.image} {activeIndex + 1} / {count}
          </p>
        </>
      ) : null}
    </div>
  );
}
