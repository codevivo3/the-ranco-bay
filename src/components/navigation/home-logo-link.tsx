"use client";

import Image from "next/image";
import type {MouseEvent, ReactNode} from "react";

import {Link, usePathname} from "@/i18n/navigation";

type HomeLogoLinkProps = {
  ariaLabel: string;
};

type HomeLinkProps = HomeLogoLinkProps & {
  children: ReactNode;
  className: string;
};

function HomeLink({ariaLabel, children, className}: HomeLinkProps) {
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
      className={className}
      href="/"
      aria-label={ariaLabel}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}

export function HomeLogoLink({ariaLabel}: HomeLogoLinkProps) {
  return (
    <HomeLink ariaLabel={ariaLabel} className="flex items-center gap-2">
      <Image
        src="/logo/trb-logo-image-plain.svg"
        alt=""
        width={40}
        height={40}
        loading="eager"
        fetchPriority="low"
      />
      <Image
        src="/logo/trb-logo-typography-plain.svg"
        alt=""
        width={150}
        height={50}
        loading="eager"
        fetchPriority="low"
      />
    </HomeLink>
  );
}

export function HomeLogoSymbolLink({ariaLabel}: HomeLogoLinkProps) {
  return (
    <HomeLink
      ariaLabel={`${ariaLabel} home`}
      className="flex items-center justify-self-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-page-focus"
    >
      <Image
        src="/logo/trb-logo-image-plain.svg"
        alt=""
        width={35}
        height={35}
        loading="eager"
        fetchPriority="low"
      />
    </HomeLink>
  );
}

export function HomeLogoTypographyLink({ariaLabel}: HomeLogoLinkProps) {
  return (
    <HomeLink
      ariaLabel={`${ariaLabel} wordmark home`}
      className="flex items-center justify-self-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-page-focus"
    >
      <Image
        src="/logo/trb-logo-typography-plain.svg"
        alt=""
        width={150}
        height={50}
        loading="eager"
        fetchPriority="low"
        className="h-auto w-[min(8.5rem,calc(100vw-11rem))]"
      />
    </HomeLink>
  );
}
