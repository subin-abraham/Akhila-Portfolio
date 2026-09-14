'use client';

import { useEffect, useId, useState } from 'react';

import { SocialIcons } from '@/features/home/components/SocialIcons';
import type { SiteHeaderProps } from '@/types/components/site-header';

export function SiteHeader({ navLinks, socialLinks }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isMenuOpen]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');

    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsMenuOpen(false);
      }
    };

    mediaQuery.addEventListener('change', closeOnDesktop);
    return () => mediaQuery.removeEventListener('change', closeOnDesktop);
  }, []);

  const toggleLabel = isMenuOpen ? 'Close menu' : 'Open menu';

  return (
    <header className="sticky top-0 z-50 px-4 pt-3 sm:px-6 lg:px-10">
      <div className="site-header-shell mx-auto w-full max-w-6xl overflow-hidden rounded-b-2xl border border-white/12 bg-home-nav shadow-[0_12px_32px_rgb(0_0_0/0.55)] backdrop-blur-md">
        <nav
          aria-label="Primary"
          className="flex items-center justify-between gap-4 px-5 py-3.5 sm:px-7 lg:px-8"
        >
          <ul className="hidden items-center gap-x-7 md:flex">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  className="text-sm font-medium text-home-muted transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden md:block">
            <SocialIcons links={socialLinks} />
          </div>

          <div className="flex w-full items-center justify-between md:hidden">
            <SocialIcons links={socialLinks} />
            <button
              id="site-header-menu-toggle"
              type="button"
              title={toggleLabel}
              aria-label={toggleLabel}
              aria-expanded={isMenuOpen}
              aria-controls={menuId}
              onClick={() => setIsMenuOpen((open) => !open)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white transition-colors hover:border-white/25 hover:bg-white/10"
            >
              <span className="sr-only">{toggleLabel}</span>
              <span className="site-header-icon" data-open={isMenuOpen ? 'true' : 'false'}>
                <span className="site-header-icon-line site-header-icon-line-top" />
                <span className="site-header-icon-line site-header-icon-line-mid" />
                <span className="site-header-icon-line site-header-icon-line-bot" />
              </span>
            </button>
          </div>
        </nav>

        <div
          id={menuId}
          className="site-header-menu md:hidden"
          data-open={isMenuOpen ? 'true' : 'false'}
          aria-hidden={!isMenuOpen}
        >
          <div className="site-header-menu-inner">
            <ul className="flex flex-col gap-1 border-t border-white/10 px-5 py-3 sm:px-7">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    tabIndex={isMenuOpen ? undefined : -1}
                    onClick={() => setIsMenuOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-home-muted transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="site-header-accent" aria-hidden="true" />
      </div>
    </header>
  );
}
