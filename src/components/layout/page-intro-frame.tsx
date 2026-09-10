"use client";

import type {ReactNode} from "react";
import {useLayoutEffect, useRef} from "react";

export function PageIntroFrame({children}: {children: ReactNode}) {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    // SiteHeader is the fixed, direct body child in the shared locale layout.
    const header = document.querySelector<HTMLElement>("body > header");
    const section = sectionRef.current;

    if (!header || !section) return;

    const measureHeader = () => {
      section.style.setProperty(
        "--page-intro-header-height",
        `${header.getBoundingClientRect().height}px`,
      );
    };

    measureHeader();
    const observer = new ResizeObserver(measureHeader);
    observer.observe(header, {box: "border-box"});

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="flex min-h-[100svh] items-center bg-page-background pt-[var(--page-intro-header-height,0px)]"
    >
      {children}
    </section>
  );
}
