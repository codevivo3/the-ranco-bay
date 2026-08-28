"use client";

import Image from "next/image";
import type {MouseEvent} from "react";

import {Link, usePathname} from "@/i18n/navigation";

type HomeLogoLinkProps = {
  ariaLabel: string;
};

export function HomeLogoLink({ariaLabel}: HomeLogoLinkProps) {
  const pathname = usePathname();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const isModifiedClick =
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey;

    if (pathname !== "/" || isModifiedClick) {
      return;
    }

    event.preventDefault();

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <Link
      className="flex items-center gap-2"
      href="/"
      aria-label={ariaLabel}
      onClick={handleClick}
    >
      <Image
        src="/logo/trb-logo-image-plain.svg"
        alt=""
        width={40}
        height={40}
        priority
      />
      <Image
        src="/logo/trb-logo-typography-plain.svg"
        alt=""
        width={150}
        height={50}
        priority
      />
    </Link>
  );
}
