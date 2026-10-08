'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { useAppLoader } from '@/components/AppLoader';

const NAVIGATION_LABEL = 'Loading…';
const NAVIGATION_TIMEOUT_MS = 10_000;

function isModifiedClick(event: MouseEvent) {
  return (
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    event.button !== 0
  );
}

function isInternalNavigationAnchor(anchor: HTMLAnchorElement) {
  if (anchor.hasAttribute('download')) {
    return false;
  }

  const target = anchor.getAttribute('target');
  if (target && target !== '_self') {
    return false;
  }

  const hrefAttr = anchor.getAttribute('href');
  if (!hrefAttr || hrefAttr.startsWith('mailto:') || hrefAttr.startsWith('tel:')) {
    return false;
  }

  let url: URL;
  try {
    url = new URL(anchor.href, window.location.href);
  } catch {
    return false;
  }

  if (url.origin !== window.location.origin) {
    return false;
  }

  const current = new URL(window.location.href);
  const samePath =
    url.pathname === current.pathname && url.search === current.search;

  if (samePath) {
    return false;
  }

  return true;
}

export function NavigationLoader() {
  const pathname = usePathname();
  const { start, stop } = useAppLoader();
  const navigatingRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    function clearNavigationTimeout() {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }

    function endNavigation() {
      if (!navigatingRef.current) {
        return;
      }

      navigatingRef.current = false;
      clearNavigationTimeout();
      stop();
    }

    function beginNavigation() {
      if (navigatingRef.current) {
        return;
      }

      navigatingRef.current = true;
      start(NAVIGATION_LABEL);
      clearNavigationTimeout();
      timeoutRef.current = window.setTimeout(endNavigation, NAVIGATION_TIMEOUT_MS);
    }

    function onDocumentClick(event: MouseEvent) {
      if (event.defaultPrevented || isModifiedClick(event)) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest('a');
      if (!(anchor instanceof HTMLAnchorElement)) {
        return;
      }

      if (!isInternalNavigationAnchor(anchor)) {
        return;
      }

      beginNavigation();
    }

    function onPopState() {
      beginNavigation();
    }

    document.addEventListener('click', onDocumentClick, true);
    window.addEventListener('popstate', onPopState);

    return () => {
      document.removeEventListener('click', onDocumentClick, true);
      window.removeEventListener('popstate', onPopState);
      clearNavigationTimeout();
      if (navigatingRef.current) {
        navigatingRef.current = false;
        stop();
      }
    };
  }, [start, stop]);

  useEffect(() => {
    if (!navigatingRef.current) {
      return;
    }

    navigatingRef.current = false;
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    stop();
  }, [pathname, stop]);

  return null;
}
