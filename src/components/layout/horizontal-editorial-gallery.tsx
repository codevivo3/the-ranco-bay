"use client";

import type {KeyboardEvent, ReactNode} from "react";
import {useRef} from "react";

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

export function HorizontalEditorialGallery({
  children,
  label,
  variant,
}: HorizontalEditorialGalleryProps) {
  const galleryRef = useRef<HTMLDivElement>(null);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return;
    }

    const gallery = galleryRef.current;

    if (!gallery) {
      return;
    }

    const panels = Array.from(
      gallery.querySelectorAll<HTMLElement>(
        ".horizontal-editorial-gallery__panel",
      ),
    );

    if (panels.length === 0) {
      return;
    }

    const galleryCenter = gallery.scrollLeft + gallery.clientWidth / 2;
    const currentIndex = panels.reduce((closestIndex, panel, index) => {
      const panelCenter =
        panel.offsetLeft - gallery.offsetLeft + panel.offsetWidth / 2;
      const closestPanel = panels[closestIndex];
      const closestCenter =
        closestPanel.offsetLeft -
        gallery.offsetLeft +
        closestPanel.offsetWidth / 2;

      return Math.abs(panelCenter - galleryCenter) <
        Math.abs(closestCenter - galleryCenter)
        ? index
        : closestIndex;
    }, 0);
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = Math.min(
      panels.length - 1,
      Math.max(0, currentIndex + direction),
    );

    if (nextIndex === currentIndex) {
      return;
    }

    event.preventDefault();

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

  return (
    <div
      ref={galleryRef}
      aria-label={label}
      role="region"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`horizontal-editorial-gallery horizontal-editorial-gallery--${variant} flex w-full max-w-full items-center overflow-x-auto overflow-y-hidden overscroll-x-contain focus-visible:outline-offset-[-2px]`}
    >
      {children}
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
