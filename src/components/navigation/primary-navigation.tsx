'use client';

import { ChevronDown } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { Link, usePathname } from '@/i18n/navigation';

type MenuId = 'apartments' | 'discover';

type PrimaryNavigationProps = {
  labels: {
    apartments: string;
    availability: string;
    comingSoon: string;
    contact: string;
    discover: string;
    groundFloor: string;
    guide: string;
    primary: string;
    property: string;
    upperFloor: string;
  };
};

const CLOSE_DELAY_MS = 150;
const HOVER_OPEN_DELAY_MS = 40;
const triggerClass =
  'group flex min-h-11 w-full cursor-pointer items-center justify-center text-center transition-colors hover:text-page-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-page-focus';
const submenuLinkClass =
  'group flex min-h-11 items-center justify-center px-3 py-2 text-center leading-snug transition-colors hover:text-page-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-page-focus';
const topLevelItemClass =
  'w-full lg:w-auto lg:[&>div]:w-36 xl:[&>div]:w-40';
const underlineBaseClass =
  "relative inline-flex items-center gap-1 pb-1 after:absolute after:-bottom-px after:h-[2px] after:bg-[var(--trb-lagoon)] after:content-[''] after:transition-[left,right] after:duration-[220ms] after:ease-in-out group-hover:after:left-0 group-hover:after:right-0 group-focus-visible:after:left-0 group-focus-visible:after:right-0 motion-reduce:after:transition-none";

function underlineClass(isActive: boolean) {
  return `${underlineBaseClass} ${
    isActive ? 'after:left-0 after:right-0' : 'after:left-1/2 after:right-1/2'
  }`;
}

function pathMatches(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function PrimaryNavigation({ labels }: PrimaryNavigationProps) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<MenuId | null>(null);
  const navigationRef = useRef<HTMLElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRefs = useRef<Record<MenuId, HTMLButtonElement | null>>({
    apartments: null,
    discover: null,
  });
  const panelRefs = useRef<Record<MenuId, HTMLDivElement | null>>({
    apartments: null,
    discover: null,
  });
  const activeRoute = pathMatches(pathname, '/apartments/upper-floor')
    ? 'upperFloor'
    : pathMatches(pathname, '/house')
      ? 'groundFloor'
      : pathMatches(pathname, '/property')
        ? 'property'
        : pathMatches(pathname, '/guide')
          ? 'guide'
          : pathMatches(pathname, '/contact')
            ? 'contact'
            : null;

  const cancelScheduledClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const cancelScheduledOpen = () => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
  };

  const scheduleClose = () => {
    cancelScheduledClose();
    closeTimerRef.current = setTimeout(() => setOpenMenu(null), CLOSE_DELAY_MS);
  };

  const supportsHover = () =>
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const syncDesktopGlassSurface = useCallback(() => {
    const navigation = navigationRef.current;
    const header = navigation?.closest<HTMLElement>('header');

    if (!header) return;

    if (!window.matchMedia('(min-width: 64rem)').matches) {
      header.removeAttribute('data-dropdown-open');
      header.style.removeProperty('--trb-navbar-glass-navbar-height');
      header.style.removeProperty('--trb-navbar-glass-apartments-left');
      header.style.removeProperty('--trb-navbar-glass-apartments-right');
      header.style.removeProperty('--trb-navbar-glass-apartments-bottom');
      header.style.removeProperty('--trb-navbar-glass-discover-left');
      header.style.removeProperty('--trb-navbar-glass-discover-right');
      header.style.removeProperty('--trb-navbar-glass-discover-bottom');
      header.style.removeProperty('--trb-navbar-glass-surface-height');
      return;
    }

    const headerRect = header.getBoundingClientRect();
    const navbarHeight = headerRect.height;
    const bounds = (['apartments', 'discover'] as const).map((menu) => {
      const panel = panelRefs.current[menu];
      const panelSurface = panel?.querySelector<HTMLElement>(
        '.trb-navbar-glass-panel',
      );

      if (!panel || !panelSurface) return null;

      const panelRect = panel.getBoundingClientRect();
      return {
        menu,
        bounds: {
          bottom:
            panelRect.top - headerRect.top + panelSurface.getBoundingClientRect().height,
          left: panelRect.left - headerRect.left,
          right: panelRect.right - headerRect.left,
        },
      };
    });
    const surfaceHeight = Math.max(
      navbarHeight,
      ...bounds.map((entry) => entry?.bounds.bottom ?? navbarHeight),
    );

    header.style.setProperty(
      '--trb-navbar-glass-navbar-height',
      `${navbarHeight}px`,
    );
    bounds.forEach((entry) => {
      if (!entry) return;

      const bottom = openMenu === entry.menu ? entry.bounds.bottom : navbarHeight;
      header.style.setProperty(
        `--trb-navbar-glass-${entry.menu}-left`,
        `${entry.bounds.left}px`,
      );
      header.style.setProperty(
        `--trb-navbar-glass-${entry.menu}-right`,
        `${entry.bounds.right}px`,
      );
      header.style.setProperty(
        `--trb-navbar-glass-${entry.menu}-bottom`,
        `${bottom}px`,
      );
    });
    header.style.setProperty(
      '--trb-navbar-glass-surface-height',
      `${surfaceHeight}px`,
    );
    header.dataset.dropdownOpen = openMenu ?? 'false';
  }, [openMenu]);

  useLayoutEffect(() => {
    syncDesktopGlassSurface();
  }, [syncDesktopGlassSurface]);

  useEffect(() => {
    window.addEventListener('resize', syncDesktopGlassSurface);
    return () => window.removeEventListener('resize', syncDesktopGlassSurface);
  }, [syncDesktopGlassSurface]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!navigationRef.current?.contains(event.target as Node)) {
        cancelScheduledOpen();
        cancelScheduledClose();
        setOpenMenu(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !openMenu) return;
      cancelScheduledOpen();
      cancelScheduledClose();
      setOpenMenu(null);
      triggerRefs.current[openMenu]?.focus();
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      cancelScheduledOpen();
      cancelScheduledClose();
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [openMenu]);

  const openFromKeyboard = (menu: MenuId) => {
    cancelScheduledOpen();
    cancelScheduledClose();
    setOpenMenu(menu);
    requestAnimationFrame(() => {
      panelRefs.current[menu]?.querySelector<HTMLAnchorElement>('a')?.focus();
    });
  };

  const renderDropdown = (
    menu: MenuId,
    label: string,
    links: React.ReactNode,
  ) => {
    const isOpen = openMenu === menu;
    const isActive =
      menu === 'apartments'
        ? activeRoute === 'groundFloor' || activeRoute === 'upperFloor'
        : activeRoute === 'property' || activeRoute === 'guide';
    const triggerId = `primary-navigation-${menu}-trigger`;
    const panelId = `primary-navigation-${menu}-panel`;

    return (
      <li
        className={`relative ${topLevelItemClass}`}
        onPointerEnter={() => {
          if (!supportsHover()) return;
          cancelScheduledClose();
          cancelScheduledOpen();
          openTimerRef.current = setTimeout(
            () => setOpenMenu(menu),
            HOVER_OPEN_DELAY_MS,
          );
        }}
        onPointerLeave={() => {
          if (!supportsHover()) return;
          cancelScheduledOpen();
          scheduleClose();
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) scheduleClose();
        }}
      >
        <button
          ref={(node) => {
            triggerRefs.current[menu] = node;
          }}
          id={triggerId}
          type='button'
          aria-controls={panelId}
          aria-expanded={isOpen}
          aria-haspopup='menu'
          className={triggerClass}
          onClick={() => {
            cancelScheduledOpen();
            cancelScheduledClose();
            setOpenMenu((current) => (current === menu ? null : menu));
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              openFromKeyboard(menu);
            }
          }}
        >
          <span className={underlineClass(isActive)}>
            {label}
            <ChevronDown
              aria-hidden='true'
              size={15}
              strokeWidth={1.5}
              className={`transition-transform duration-300 ease-in-out motion-reduce:transition-none ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </span>
        </button>

        <div
          ref={(node) => {
            panelRefs.current[menu] = node;
          }}
          id={panelId}
          role='group'
          aria-labelledby={triggerId}
          aria-hidden={!isOpen}
          inert={!isOpen}
          onClick={() => {
            cancelScheduledOpen();
            cancelScheduledClose();
            setOpenMenu(null);
          }}
          className={`grid w-full overflow-hidden transition-[grid-template-rows] ease-in-out motion-reduce:transition-none lg:absolute lg:left-1/2 lg:top-full lg:z-20 lg:-translate-x-1/2 ${
            isOpen
              ? 'pointer-events-auto grid-rows-[1fr] duration-300'
              : 'pointer-events-none grid-rows-[0fr] duration-[220ms]'
          }`}
        >
          <div className='min-h-0 overflow-hidden'>
            <ul className='trb-navbar-glass-panel'>{links}</ul>
          </div>
        </div>
      </li>
    );
  };

  return (
    <nav
      ref={navigationRef}
      className='col-span-2 row-start-2 w-full min-w-0 sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:w-auto sm:justify-self-center'
      aria-label={labels.primary}
    >
      <ul className='grid grid-cols-2 items-start justify-center gap-x-4 gap-y-1 text-sm lg:flex lg:flex-wrap lg:items-center lg:gap-x-9 lg:text-[1.0625rem] xl:gap-x-10'>
        {renderDropdown(
          'apartments',
          labels.apartments,
          <>
            <li>
              <Link
                className={submenuLinkClass}
                href='/house'
                aria-current={
                  activeRoute === 'groundFloor' ? 'page' : undefined
                }
              >
                <span className={underlineClass(activeRoute === 'groundFloor')}>
                  {labels.groundFloor}
                </span>
              </Link>
            </li>
            <li>
              <Link
                className={submenuLinkClass}
                href='/apartments/upper-floor'
                aria-current={
                  activeRoute === 'upperFloor' ? 'page' : undefined
                }
              >
                <span className='inline-flex flex-col items-center'>
                  <span
                    className={underlineClass(activeRoute === 'upperFloor')}
                  >
                    {labels.upperFloor}
                  </span>
                  <span className='mt-1 block text-[0.625rem] uppercase tracking-[0.12em] text-page-muted'>
                    {labels.comingSoon}
                  </span>
                </span>
              </Link>
            </li>
          </>,
        )}

        {renderDropdown(
          'discover',
          labels.discover,
          <>
            <li>
              <Link
                className={submenuLinkClass}
                href='/property'
                aria-current={activeRoute === 'property' ? 'page' : undefined}
              >
                <span className={underlineClass(activeRoute === 'property')}>
                  {labels.property}
                </span>
              </Link>
            </li>
            <li>
              <Link
                className={submenuLinkClass}
                href='/guide'
                aria-current={activeRoute === 'guide' ? 'page' : undefined}
              >
                <span className={underlineClass(activeRoute === 'guide')}>
                  {labels.guide}
                </span>
              </Link>
            </li>
          </>,
        )}

        <li
          className={`flex min-h-11 items-center justify-center text-center ${topLevelItemClass}`}
        >
          <Link
            className='group inline-flex min-h-11 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-page-focus'
            href='/contact#enquiry'
          >
            <span className={underlineClass(false)}>{labels.availability}</span>
          </Link>
        </li>
        <li
          className={`flex min-h-11 items-center justify-center text-center ${topLevelItemClass}`}
        >
          <Link
            className='group inline-flex min-h-11 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-page-focus'
            href='/contact'
            aria-current={activeRoute === 'contact' ? 'page' : undefined}
          >
            <span className={underlineClass(activeRoute === 'contact')}>
              {labels.contact}
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
