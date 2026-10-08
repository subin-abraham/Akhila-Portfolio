'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useState } from 'react';

import { useTheme } from '@/components/ThemeProvider';
import {
  PROFILE_IMAGE_ALT,
  PROFILE_IMAGE_SRC,
} from '@/features/home/lib/profile-image';
import {
  isExternalSiteHref,
  resolveSiteHref,
} from '@/features/home/lib/resolve-site-href';
import type { SidePanelProps } from '@/types/components/side-panel';
import type { NavLink } from '@/types/home/nav';

function findPathActiveHref(navLinks: NavLink[], pathname: string) {
  return navLinks.find((link) => {
    if (!link.href.startsWith('/') || link.href.startsWith('/#')) {
      return false;
    }

    return pathname === link.href || pathname.startsWith(`${link.href}/`);
  })?.href;
}

function getHashSectionId(href: string) {
  if (href.startsWith('/#')) {
    return href.slice(2);
  }

  if (href.startsWith('#') && href.length > 1) {
    return href.slice(1);
  }

  return null;
}

function findHashActiveHref(navLinks: NavLink[], hash: string) {
  if (!hash || hash === '#') {
    return null;
  }

  const sectionId = hash.startsWith('#') ? hash.slice(1) : hash;

  return (
    navLinks.find((link) => getHashSectionId(link.href) === sectionId)?.href ??
    null
  );
}

function findHomeFallbackHref(navLinks: NavLink[]) {
  return (
    navLinks.find((link) => getHashSectionId(link.href) === 'home')?.href ??
    navLinks.find((link) => Boolean(getHashSectionId(link.href)))?.href ??
    navLinks[0]?.href ??
    '/#home'
  );
}

function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="side-panel-nav-icon">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.2 0-7 2.1-7 4.5V20h14v-1.5C19 16.1 16.2 14 12 14Z"
      />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="side-panel-nav-icon">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7m-9 0h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Zm5 4v3"
      />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="side-panel-nav-icon">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v15.5A2.5 2.5 0 0 0 16.5 16H7.5A2.5 2.5 0 0 0 5 18.5V5.5Z"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M5 18.5A2.5 2.5 0 0 1 7.5 16H19"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5v-9Z"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m5 8 7 5 7-5"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z"
      />
      <circle cx="12" cy="11" r="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function LinkedInMiniIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4V8.5zM8.5 8.5h3.8v2h.1c.5-1 1.8-2.1 3.8-2.1 4 0 4.8 2.7 4.8 6.1V23h-4v-6.6c0-1.6 0-3.6-2.2-3.6s-2.5 1.7-2.5 3.5V23h-4V8.5z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4v2m0 12v2m8-8h-2M6 12H4m12.95-4.95-1.4 1.4M8.45 15.55l-1.4 1.4m0-9.9 1.4 1.4m9.9 9.9-1.4-1.4M12 8.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 13.5A6.5 6.5 0 0 1 10 5.2 6.6 6.6 0 1 0 16.5 13.5Z"
      />
    </svg>
  );
}

interface ThemeToggleButtonProps {
  id: string;
}

function ThemeToggleButton({ id }: ThemeToggleButtonProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      id={id}
      type="button"
      title={label}
      aria-label={label}
      onClick={toggleTheme}
      className="side-panel-secondary"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function resolveNavIcon(label: string, href: string) {
  const key = `${label} ${href}`.toLowerCase();

  if (key.includes('home') || key.includes('profile') || key.includes('about')) {
    return <ProfileIcon />;
  }

  if (key.includes('journey') || key.includes('work') || key.includes('portfolio')) {
    return <BriefcaseIcon />;
  }

  return <BookIcon />;
}

export function SidePanel({
  homepage,
  navLinks,
  socialLinks,
  locationLabel,
  roleLabel,
  themeToggleEnabled = true,
}: SidePanelProps) {
  const pathname = usePathname();
  const pathActiveHref = findPathActiveHref(navLinks, pathname);
  const [isOpen, setIsOpen] = useState(false);
  const [activeHref, setActiveHref] = useState(
    () => pathActiveHref ?? findHomeFallbackHref(navLinks)
  );
  const menuId = useId();

  const linkedIn = socialLinks.find((link) => link.platform === 'linkedin');

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');

    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsOpen(false);
      }
    };

    mediaQuery.addEventListener('change', closeOnDesktop);
    return () => mediaQuery.removeEventListener('change', closeOnDesktop);
  }, []);

  useEffect(() => {
    if (pathActiveHref) {
      setActiveHref(pathActiveHref);
      return;
    }

    if (pathname !== '/') {
      return;
    }

    const syncFromHash = () => {
      const hashHref =
        findHashActiveHref(navLinks, window.location.hash) ??
        findHomeFallbackHref(navLinks);
      setActiveHref(hashHref);
    };

    syncFromHash();

    const sectionIds = navLinks
      .map((link) => getHashSectionId(link.href))
      .filter((id): id is string => Boolean(id));

    if (sectionIds.length === 0) {
      window.addEventListener('hashchange', syncFromHash);
      return () => window.removeEventListener('hashchange', syncFromHash);
    }

    let cancelled = false;
    let observer: IntersectionObserver | null = null;
    let rafId = 0;
    let attempts = 0;
    const maxAttempts = 120;

    const observerCallback: IntersectionObserverCallback = (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      const top = visible[0];
      if (!top?.target.id) {
        return;
      }

      const matchingHref = navLinks.find(
        (link) => getHashSectionId(link.href) === top.target.id
      )?.href;

      if (matchingHref) {
        setActiveHref(matchingHref);
      }
    };

    function setupObserver() {
      if (cancelled) {
        return;
      }

      const elements = sectionIds
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => Boolean(el));

      if (elements.length === 0) {
        attempts += 1;
        if (attempts < maxAttempts) {
          rafId = window.requestAnimationFrame(setupObserver);
        }
        return;
      }

      observer = new IntersectionObserver(observerCallback, {
        rootMargin: '-20% 0px -55% 0px',
        threshold: [0.1, 0.35, 0.6],
      });
      elements.forEach((el) => observer?.observe(el));
    }

    setupObserver();
    window.addEventListener('hashchange', syncFromHash);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(rafId);
      observer?.disconnect();
      window.removeEventListener('hashchange', syncFromHash);
    };
  }, [navLinks, pathname, pathActiveHref]);

  const toggleLabel = isOpen ? 'Close menu' : 'Open menu';

  function closeAndNavigate(nextHref?: string) {
    if (nextHref) {
      setActiveHref(nextHref);
    }
    setIsOpen(false);
  }

  return (
    <>
      <div className="side-panel-mobile-bar">
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 overflow-hidden rounded-full">
            <Image
              src={PROFILE_IMAGE_SRC}
              alt={PROFILE_IMAGE_ALT}
              fill
              sizes="36px"
              className="object-cover object-center"
            />
          </div>
          <p className="text-sm font-semibold text-sidebar-ink">{homepage.fullName}</p>
        </div>
        <div className="flex items-center gap-2">
          {themeToggleEnabled ? <ThemeToggleButton id="side-panel-theme-toggle-mobile" /> : null}
          <button
            id="side-panel-menu-toggle"
            type="button"
            title={toggleLabel}
            aria-label={toggleLabel}
            aria-expanded={isOpen}
            aria-controls={menuId}
            onClick={() => setIsOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-black/10 bg-white text-sidebar-ink"
          >
            <span className="sr-only">{toggleLabel}</span>
            <span className="site-header-icon" data-open={isOpen ? 'true' : 'false'}>
              <span className="site-header-icon-line site-header-icon-line-top" />
              <span className="site-header-icon-line site-header-icon-line-mid" />
              <span className="site-header-icon-line site-header-icon-line-bot" />
            </span>
          </button>
        </div>
      </div>

      {isOpen ? (
        <button
          id="side-panel-backdrop"
          type="button"
          title="Close menu"
          aria-label="Close menu"
          className="side-panel-backdrop lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      ) : null}

      <aside
        id={menuId}
        className="side-panel"
        data-open={isOpen ? 'true' : 'false'}
        aria-label="Profile and navigation"
      >
        <div className="side-panel-inner">
          <div className="side-panel-profile">
            <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full sm:h-32 sm:w-32">
              <Image
                src={PROFILE_IMAGE_SRC}
                alt={PROFILE_IMAGE_ALT}
                fill
                priority
                sizes="128px"
                className="object-cover object-center"
              />
            </div>
            <div className="mt-5 text-center">
              <h2 className="text-lg font-semibold tracking-tight text-sidebar-ink">
                {homepage.fullName}
              </h2>
              <p className="mt-1 text-sm text-sidebar-muted">{roleLabel}</p>
              {locationLabel ? (
                <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-sidebar-muted">
                  <PinIcon />
                  <span>{locationLabel}</span>
                </p>
              ) : null}
            </div>
          </div>

          <div className="side-panel-actions">
            <Link
              id="side-panel-message"
              href={resolveSiteHref(homepage.ctaHref)}
              title={homepage.ctaLabel}
              aria-label={homepage.ctaLabel}
              className="side-panel-message"
              onClick={() => closeAndNavigate()}
            >
              <MailIcon />
              <span>Message</span>
            </Link>
            {linkedIn ? (
              <a
                id="side-panel-linkedin"
                href={linkedIn.href}
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                aria-label="LinkedIn profile"
                className="side-panel-secondary"
              >
                <LinkedInMiniIcon />
              </a>
            ) : null}
            {themeToggleEnabled ? <ThemeToggleButton id="side-panel-theme-toggle" /> : null}
          </div>

          <nav aria-label="Primary" className="side-panel-nav">
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = activeHref === link.href;
                const href = resolveSiteHref(link.href);

                return (
                  <li key={link.id}>
                    {isExternalSiteHref(href) ? (
                      <a
                        href={href}
                        aria-current={isActive ? 'page' : undefined}
                        onClick={() => closeAndNavigate(link.href)}
                        className="side-panel-nav-link"
                        data-active={isActive ? 'true' : 'false'}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {resolveNavIcon(link.label, link.href)}
                        <span>{link.label}</span>
                      </a>
                    ) : (
                      <Link
                        href={href}
                        aria-current={isActive ? 'page' : undefined}
                        onClick={() => closeAndNavigate(link.href)}
                        className="side-panel-nav-link"
                        data-active={isActive ? 'true' : 'false'}
                      >
                        {resolveNavIcon(link.label, link.href)}
                        <span>{link.label}</span>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
