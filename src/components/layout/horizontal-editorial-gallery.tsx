"use client";

import type {KeyboardEvent, ReactNode} from "react";
import {useCallback, useEffect, useRef, useState} from "react";
import {ArrowLeft, ArrowRight} from "lucide-react";
import {useTranslations} from "next-intl";

type HorizontalEditorialGalleryProps = {
  children: ReactNode;
  label: string;
  variant: "guide" | "house";
};

type HorizontalEditorialPanelProps = {
  children: ReactNode;
  className?: string;
  format?: "landscape" | "portrait" | "square";
};

type DirectionCue = {
  left: number;
  visible: boolean;
  previousLeft: number;
  previousVisible: boolean;
};

const peekPanelClassName = "horizontal-editorial-gallery__panel--peek";
const previousPeekPanelClassName =
  "horizontal-editorial-gallery__panel--previous-peek";
const peekWidthProperty = "--editorial-gallery-visible-peek";

function getPanels(gallery: HTMLDivElement) {
  return Array.from(
    gallery.querySelectorAll<HTMLElement>(
      ".horizontal-editorial-gallery__panel",
    ),
  );
}

function getClosestPanelIndex(
  gallery: HTMLDivElement,
  panels: HTMLElement[],
) {
  const galleryRect = gallery.getBoundingClientRect();
  const galleryCenter = galleryRect.left + galleryRect.width / 2;

  return panels.reduce((closestIndex, panel, index) => {
    const panelRect = panel.getBoundingClientRect();
    const panelCenter = panelRect.left + panelRect.width / 2;
    const closestPanel = panels[closestIndex];
    const closestRect = closestPanel.getBoundingClientRect();
    const closestCenter = closestRect.left + closestRect.width / 2;

    return Math.abs(panelCenter - galleryCenter) <
      Math.abs(closestCenter - galleryCenter)
      ? index
      : closestIndex;
  }, 0);
}

function updatePeekPanels(
  panels: HTMLElement[],
  previousPeek?: {panel: HTMLElement; visibleWidth: number},
  nextPeek?: {panel: HTMLElement; visibleWidth: number},
) {
  panels.forEach((panel) => {
    const isPreviousPeek =
      panel === previousPeek?.panel && previousPeek.visibleWidth > 1;
    const isNextPeek = panel === nextPeek?.panel && nextPeek.visibleWidth > 1;

    panel.classList.toggle(previousPeekPanelClassName, isPreviousPeek);
    panel.classList.toggle(peekPanelClassName, isNextPeek);

    if (isPreviousPeek) {
      panel.style.setProperty(
        peekWidthProperty,
        `${previousPeek.visibleWidth}px`,
      );
    } else if (isNextPeek) {
      panel.style.setProperty(peekWidthProperty, `${nextPeek.visibleWidth}px`);
    } else {
      panel.style.removeProperty(peekWidthProperty);
    }
  });
}

export function HorizontalEditorialGallery({
  children,
  label,
  variant,
}: HorizontalEditorialGalleryProps) {
  const tGallery = useTranslations("Common.Gallery");
  const galleryRef = useRef<HTMLDivElement>(null);
  const [directionCue, setDirectionCue] = useState<DirectionCue>({
    left: 0,
    visible: false,
    previousLeft: 0,
    previousVisible: false,
  });

  const updateNavigation = useCallback(() => {
    const gallery = galleryRef.current;

    if (!gallery) return;

    const panels = getPanels(gallery);

    if (panels.length === 0) return;

    const currentIndex = getClosestPanelIndex(gallery, panels);
    const currentPanel = panels[currentIndex];
    const previousPanel = panels[currentIndex - 1];
    const nextPanel = panels[currentIndex + 1];

    const galleryRect = gallery.getBoundingClientRect();
    const currentRect = currentPanel.getBoundingClientRect();
    const gap = Number.parseFloat(getComputedStyle(gallery).columnGap) || 0;
    const left = currentRect.right - galleryRect.left + gap / 2;
    const previousRect = previousPanel?.getBoundingClientRect();
    const nextRect = nextPanel?.getBoundingClientRect();
    const previousItemIsVisible = Boolean(
      previousRect && previousRect.right > galleryRect.left + 1,
    );
    const nextItemIsVisible = Boolean(
      nextRect && nextRect.left < galleryRect.right - 1,
    );
    const cueIsInsideGallery = left > 0 && left < gallery.clientWidth;
    const visiblePreviousPeekWidth =
      previousItemIsVisible && previousRect
        ? Math.max(
            0,
            Math.min(galleryRect.right, previousRect.right) -
              Math.max(galleryRect.left, previousRect.left),
          )
        : 0;
    const visibleNextPeekWidth = nextItemIsVisible && nextRect
      ? Math.max(
          0,
          Math.min(galleryRect.right, nextRect.right) -
            Math.max(galleryRect.left, nextRect.left),
        )
      : 0;
    const nextCue = {
      left,
      visible: Boolean(nextPanel && nextItemIsVisible && cueIsInsideGallery),
      // Mirror the next cue at the leading gap. Keep the hit area reachable
      // when a wide panel fills the viewport and its leading gap is clipped.
      previousLeft: Math.max(
        gap / 2,
        currentRect.left - galleryRect.left - gap / 2,
      ),
      previousVisible: currentIndex > 0,
    };

    updatePeekPanels(
      panels,
      previousPanel && visiblePreviousPeekWidth > 1
        ? {panel: previousPanel, visibleWidth: visiblePreviousPeekWidth}
        : undefined,
      nextPanel && nextCue.visible
        ? {panel: nextPanel, visibleWidth: visibleNextPeekWidth}
        : undefined,
    );

    setDirectionCue((current) =>
      current.left === nextCue.left && current.visible === nextCue.visible &&
      current.previousLeft === nextCue.previousLeft &&
      current.previousVisible === nextCue.previousVisible
        ? current
        : nextCue,
    );
  }, []);

  useEffect(() => {
    const gallery = galleryRef.current;

    if (!gallery) return;

    let frame = window.requestAnimationFrame(updateNavigation);
    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateNavigation);
    };
    const resizeObserver = new ResizeObserver(scheduleUpdate);

    gallery.addEventListener("scroll", scheduleUpdate, {passive: true});
    resizeObserver.observe(gallery);

    return () => {
      window.cancelAnimationFrame(frame);
      gallery.removeEventListener("scroll", scheduleUpdate);
      resizeObserver.disconnect();
      updatePeekPanels(getPanels(gallery));
    };
  }, [updateNavigation]);

  function scrollToAdjacent(direction: -1 | 1) {
    const gallery = galleryRef.current;

    if (!gallery) return;

    const panels = getPanels(gallery);

    if (panels.length === 0) return;

    const currentIndex = getClosestPanelIndex(gallery, panels);
    const nextIndex = Math.min(
      panels.length - 1,
      Math.max(0, currentIndex + direction),
    );

    if (nextIndex === currentIndex) return;

    const nextPanel = panels[nextIndex];
    const targetLeft =
      nextPanel.offsetLeft -
      gallery.offsetLeft -
      (gallery.clientWidth - nextPanel.offsetWidth) / 2;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    gallery.scrollTo({
      behavior: reduceMotion ? "auto" : "smooth",
      left: targetLeft,
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return;
    }

    const direction = event.key === "ArrowRight" ? 1 : -1;
    event.preventDefault();
    scrollToAdjacent(direction);
  }

  return (
    <div className="horizontal-editorial-gallery-shell w-full max-w-full">
      <div
        ref={galleryRef}
        aria-label={label}
        role="region"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className={`horizontal-editorial-gallery horizontal-editorial-gallery--${variant} flex h-full w-full max-w-full items-center overflow-x-auto overflow-y-hidden overscroll-x-contain focus-visible:outline-offset-[-2px]`}
      >
        {children}
      </div>
      {directionCue.previousVisible ? (
        <button
          type="button"
          aria-label={tGallery("previousItem")}
          onClick={() => scrollToAdjacent(-1)}
          className="horizontal-editorial-gallery__direction-cue horizontal-editorial-gallery__direction-cue--previous"
          style={{left: directionCue.previousLeft}}
        >
          <ArrowLeft
            aria-hidden="true"
            className="horizontal-editorial-gallery__direction-icon"
            size={24}
            strokeWidth={1.5}
          />
        </button>
      ) : null}
      {directionCue.visible ? (
        <button
          type="button"
          aria-label={tGallery("nextItem")}
          onClick={() => scrollToAdjacent(1)}
          className="horizontal-editorial-gallery__direction-cue"
          style={{left: directionCue.left}}
        >
          <ArrowRight
            aria-hidden="true"
            className="horizontal-editorial-gallery__direction-icon"
            size={24}
            strokeWidth={1.5}
          />
        </button>
      ) : null}
    </div>
  );
}

export function HorizontalEditorialPanel({
  children,
  className = "",
  format = "landscape",
}: HorizontalEditorialPanelProps) {
  return (
    <div
      className={`horizontal-editorial-gallery__panel horizontal-editorial-gallery__panel--${format} ${className}`}
    >
      {children}
    </div>
  );
}
