'use client';

import { useEffect, useId, useRef } from 'react';

import type { CaseStudyModalProps } from '@/types/components/case-study-modal';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function CaseStudyModal({ item, onClose }: CaseStudyModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();
  const descriptionId = useId();
  const paragraphs = item.description
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) {
        return;
      }

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((element) => !element.hasAttribute('disabled'));

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!first || !last) {
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
        return;
      }

      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocusedRef.current?.focus();
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center sm:p-6"
      role="presentation"
    >
      <button
        id={`case-study-modal-backdrop-${item.id}`}
        type="button"
        title="Close case study"
        aria-label="Close case study"
        className="absolute inset-0 cursor-pointer bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative z-[81] flex max-h-[min(88vh,44rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/12 bg-home-bg shadow-[0_24px_64px_rgb(0_0_0/0.65)]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-7 sm:py-5">
          <div className="min-w-0">
            <p className="text-sm font-medium text-home-accent">{item.period}</p>
            <h2
              id={titleId}
              className="mt-2 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl"
            >
              {item.title}
            </h2>
            {item.client ? (
              <p className="mt-2 text-sm text-home-muted">{item.client}</p>
            ) : null}
          </div>
          <button
            ref={closeButtonRef}
            id={`case-study-modal-close-${item.id}`}
            type="button"
            title="Close case study"
            aria-label="Close case study"
            onClick={onClose}
            className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white transition-colors hover:border-white/25 hover:bg-white/10"
          >
            <span aria-hidden="true" className="text-xl leading-none">
              ×
            </span>
          </button>
        </div>

        <div
          id={descriptionId}
          className="overflow-y-auto px-5 py-5 sm:px-7 sm:py-6"
        >
          <div className="flex flex-col gap-4">
            <p className="text-base leading-7 text-white/85 sm:text-lg sm:leading-8">
              {item.summary}
            </p>
            {paragraphs.map((paragraph, paragraphIndex) => (
              <p
                key={`${item.id}-paragraph-${paragraphIndex}`}
                className="text-base leading-7 text-home-muted sm:text-lg sm:leading-8"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
