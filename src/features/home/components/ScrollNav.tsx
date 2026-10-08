'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState, type MouseEvent } from 'react';

import type { NavLink } from '@/types/home/nav';

const SHOW_AFTER_SCROLL_PX = 96;

const SECTION_LINKS: NavLink[] = [
  {
    id: 'scroll-journey',
    label: 'Journey',
    href: '#professional-journey',
    sortOrder: 0,
  },
  { id: 'scroll-education', label: 'Education', href: '#education', sortOrder: 1 },
  {
    id: 'scroll-expertise',
    label: 'Expertise',
    href: '#technical-expertise',
    sortOrder: 2,
  },
  {
    id: 'scroll-tools',
    label: 'Tools',
    href: '#tools-and-technology',
    sortOrder: 3,
  },
];

function isHashLink(href: string) {
  return href.startsWith('#');
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="scroll-nav-arrow-icon"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10"
      />
    </svg>
  );
}

export function ScrollNav() {
  const reduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const [activeHref, setActiveHref] = useState(SECTION_LINKS[0]?.href ?? '');

  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY > SHOW_AFTER_SCROLL_PX);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sectionIds = SECTION_LINKS.map((link) => link.href.slice(1));

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const top = visible[0];
        if (top?.target.id) {
          setActiveHref(`#${top.target.id}`);
        }
      },
      { rootMargin: '-18% 0px -58% 0px', threshold: [0.1, 0.35, 0.6] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function scrollToHash(href: string) {
    const id = href.slice(1);
    const target = document.getElementById(id);

    if (!target) {
      return;
    }

    target.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });

    window.history.replaceState(null, '', href);
    setActiveHref(href);
  }

  function handleLinkClick(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (!isHashLink(href)) {
      return;
    }

    event.preventDefault();
    scrollToHash(href);
  }

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          key="scroll-nav"
          className="scroll-nav"
          initial={reduceMotion ? false : { opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <nav aria-label="Page sections" className="scroll-nav-pill">
            <ul className="scroll-nav-list">
              {SECTION_LINKS.map((link) => {
                const isActive = activeHref === link.href;

                return (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      aria-current={isActive ? 'page' : undefined}
                      className="scroll-nav-link"
                      data-active={isActive ? 'true' : 'false'}
                      onClick={(event) => handleLinkClick(event, link.href)}
                    >
                      <span>{link.label}</span>
                      <ArrowIcon />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
