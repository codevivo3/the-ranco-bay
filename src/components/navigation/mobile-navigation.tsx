'use client';

import { ChevronDown, ChevronUp, Menu, X } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import { Link, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

type MobileNavigationProps = {
  labels: {
    apartments: string;
    availability: string;
    closeMenu: string;
    comingSoon: string;
    contact: string;
    discover: string;
    groundFloor: string;
    guide: string;
    language: string;
    locales: Record<(typeof routing.locales)[number], string>;
    openMenu: string;
    primary: string;
    property: string;
    upperFloor: string;
  };
};

type SubmenuId = 'apartments' | 'discover';

const topLevelClass =
  'flex min-h-12 w-full items-center justify-between py-2 text-left text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-page-focus';
const submenuLinkClass =
  'flex min-h-11 items-center py-2 pl-5 pr-2 text-[0.9375rem] text-page-muted transition-colors hover:text-page-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-page-focus';

function pathMatches(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileNavigation({ labels }: MobileNavigationProps) {
  const activeLocale = useLocale();
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSubmenus, setExpandedSubmenus] = useState<
    Record<SubmenuId, boolean>
  >({
    apartments: false,
    discover: false,
  });

  const closeMenu = (restoreFocus = false) => {
    setIsOpen(false);
    setExpandedSubmenus({ apartments: false, discover: false });
    if (restoreFocus) menuButtonRef.current?.focus();
  };

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 64rem)');
    const handleDesktopChange = (event: MediaQueryListEvent) => {
      if (event.matches) closeMenu();
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) closeMenu(true);
    };

    desktopQuery.addEventListener('change', handleDesktopChange);
    document.addEventListener('keydown', handleEscape);

    return () => {
      desktopQuery.removeEventListener('change', handleDesktopChange);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const toggleSubmenu = (submenu: SubmenuId) => {
    setExpandedSubmenus((current) => ({
      ...current,
      [submenu]: !current[submenu],
    }));
  };

  const groundFloorActive = pathMatches(pathname, '/house');
  const upperFloorActive = pathMatches(pathname, '/apartments/upper-floor');
  const propertyActive = pathMatches(pathname, '/property');
  const guideActive = pathMatches(pathname, '/guide');
  const contactActive = pathMatches(pathname, '/contact');

  return (
    <div className='flex items-center lg:hidden'>
      <button
        ref={menuButtonRef}
        type='button'
        aria-controls='mobile-primary-navigation'
        aria-expanded={isOpen}
        aria-label={isOpen ? labels.closeMenu : labels.openMenu}
        className='flex size-11 items-center justify-center text-page-text transition-colors hover:text-page-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-page-focus'
        onClick={() => {
          if (isOpen) {
            closeMenu();
          } else {
            setIsOpen(true);
          }
        }}
      >
        {isOpen ? (
          <X aria-hidden='true' size={26} strokeWidth={2.5} />
        ) : (
          <Menu aria-hidden='true' size={26} strokeWidth={2.5} />
        )}
      </button>

      <div
        id='mobile-primary-navigation'
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`absolute inset-x-0 top-full grid overflow-hidden border-t border-[var(--trb-navbar-glass-border)] bg-[var(--trb-navbar-glass-background)] shadow-[var(--trb-navbar-glass-shadow)] backdrop-blur-[14px] backdrop-saturate-[1.15] transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none lg:hidden ${
          isOpen
            ? 'pointer-events-auto grid-rows-[1fr]'
            : 'pointer-events-none grid-rows-[0fr]'
        }`}
      >
        <div className='min-h-0 overflow-hidden'>
          <nav
            aria-label={labels.primary}
            className='max-h-[calc(100svh-4.5rem)] overflow-y-auto px-[var(--space-gutter)] py-3'
          >
            <ul className='divide-y divide-page-border'>
              <li>
                <button
                  type='button'
                  aria-controls='mobile-apartments-submenu'
                  aria-expanded={expandedSubmenus.apartments}
                  className={topLevelClass}
                  onClick={() => toggleSubmenu('apartments')}
                >
                  <span>{labels.apartments}</span>
                  {expandedSubmenus.apartments ? (
                    <ChevronUp aria-hidden='true' size={19} strokeWidth={1.5} />
                  ) : (
                    <ChevronDown
                      aria-hidden='true'
                      size={19}
                      strokeWidth={1.5}
                    />
                  )}
                </button>
                <div
                  id='mobile-apartments-submenu'
                  aria-hidden={!expandedSubmenus.apartments}
                  inert={!expandedSubmenus.apartments}
                  className={`grid overflow-hidden transition-[grid-template-rows] duration-200 ease-in-out motion-reduce:transition-none ${
                    expandedSubmenus.apartments
                      ? 'grid-rows-[1fr]'
                      : 'grid-rows-[0fr]'
                  }`}
                >
                  <ul className='min-h-0 overflow-hidden pb-2'>
                    <li>
                      <Link
                        href='/house'
                        aria-current={groundFloorActive ? 'page' : undefined}
                        className={`${submenuLinkClass} ${
                          groundFloorActive
                            ? 'font-semibold text-page-accent'
                            : ''
                        }`}
                        onClick={() => closeMenu()}
                      >
                        {labels.groundFloor}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='/apartments/upper-floor'
                        aria-current={upperFloorActive ? 'page' : undefined}
                        className={`${submenuLinkClass} ${
                          upperFloorActive
                            ? 'font-semibold text-page-accent'
                            : ''
                        }`}
                        onClick={() => closeMenu()}
                      >
                        <span className='flex items-baseline gap-2'>
                          <span>{labels.upperFloor}</span>
                          <span className='text-[0.625rem] uppercase tracking-[0.12em] text-page-muted'>
                            {labels.comingSoon}
                          </span>
                        </span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>

              <li>
                <button
                  type='button'
                  aria-controls='mobile-discover-submenu'
                  aria-expanded={expandedSubmenus.discover}
                  className={topLevelClass}
                  onClick={() => toggleSubmenu('discover')}
                >
                  <span>{labels.discover}</span>
                  {expandedSubmenus.discover ? (
                    <ChevronUp aria-hidden='true' size={19} strokeWidth={1.5} />
                  ) : (
                    <ChevronDown
                      aria-hidden='true'
                      size={19}
                      strokeWidth={1.5}
                    />
                  )}
                </button>
                <div
                  id='mobile-discover-submenu'
                  aria-hidden={!expandedSubmenus.discover}
                  inert={!expandedSubmenus.discover}
                  className={`grid overflow-hidden transition-[grid-template-rows] duration-200 ease-in-out motion-reduce:transition-none ${
                    expandedSubmenus.discover
                      ? 'grid-rows-[1fr]'
                      : 'grid-rows-[0fr]'
                  }`}
                >
                  <ul className='min-h-0 overflow-hidden pb-2'>
                    <li>
                      <Link
                        href='/property'
                        aria-current={propertyActive ? 'page' : undefined}
                        className={`${submenuLinkClass} ${
                          propertyActive
                            ? 'font-semibold text-page-accent'
                            : ''
                        }`}
                        onClick={() => closeMenu()}
                      >
                        {labels.property}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='/guide'
                        aria-current={guideActive ? 'page' : undefined}
                        className={`${submenuLinkClass} ${
                          guideActive ? 'font-semibold text-page-accent' : ''
                        }`}
                        onClick={() => closeMenu()}
                      >
                        {labels.guide}
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>

              <li>
                <Link
                  href='/contact#enquiry'
                  className={topLevelClass}
                  onClick={() => closeMenu()}
                >
                  {labels.availability}
                </Link>
              </li>
              <li>
                <Link
                  href='/contact'
                  aria-current={contactActive ? 'page' : undefined}
                  className={`${topLevelClass} ${
                    contactActive ? 'font-semibold text-page-accent' : ''
                  }`}
                  onClick={() => closeMenu()}
                >
                  {labels.contact}
                </Link>
              </li>
            </ul>

            <nav
              aria-label={labels.language}
              className='mt-3 border-t border-page-border pt-4'
            >
              <ul className='flex min-h-11 items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.12em]'>
                {routing.locales.map((locale, index) => (
                  <li key={locale} className='flex items-center gap-3'>
                    {index > 0 ? (
                      <span aria-hidden='true' className='opacity-35'>
                        ·
                      </span>
                    ) : null}
                    <Link
                      href={pathname}
                      locale={locale}
                      hrefLang={locale}
                      aria-current={
                        locale === activeLocale ? 'page' : undefined
                      }
                      className={`relative py-2 transition-opacity duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-page-focus motion-reduce:transition-none ${
                        locale === activeLocale
                          ? 'opacity-100 after:absolute after:inset-x-0 after:bottom-1 after:h-[2px] after:bg-[var(--trb-lagoon)]'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                      onClick={() => closeMenu()}
                    >
                      {labels.locales[locale]}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </nav>
        </div>
      </div>
    </div>
  );
}
