'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { SectionHeading } from '@/features/home/components/SectionHeading';
import { prefersReducedMotion } from '@/features/home/lib/prefers-reduced-motion';
import type { EducationSectionProps } from '@/types/components/education-section';

gsap.registerPlugin(ScrollTrigger);

export function EducationSection({ section, items }: EducationSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section || items.length === 0 || prefersReducedMotion()) {
      return;
    }

    const context = gsap.context(() => {
      const entries = section.querySelectorAll('[data-education-item]');

      entries.forEach((entry) => {
        const dot = entry.querySelector('[data-education-dot]');
        const line = entry.querySelector('[data-education-line]');
        const body = entry.querySelector('[data-education-body]');

        const entryTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: entry,
            start: 'top 88%',
            toggleActions: 'play reverse play reverse',
          },
        });

        if (dot) {
          entryTimeline.from(
            dot,
            {
              scale: 0.6,
              duration: 0.35,
              ease: 'back.out(2.2)',
            },
            0
          );
        }

        if (line) {
          entryTimeline.from(
            line,
            {
              scaleY: 0,
              transformOrigin: 'top center',
              duration: 0.8,
              ease: 'power1.out',
            },
            0.05
          );
        }

        if (body) {
          entryTimeline.from(
            body,
            {
              y: 18,
              opacity: 0.35,
              duration: 0.55,
              ease: 'power2.out',
            },
            0.08
          );
        }
      });
    }, section);

    return () => {
      context.revert();
    };
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      id="education"
      aria-labelledby="education-heading"
      className="flex scroll-mt-28 flex-col gap-8 sm:gap-10"
    >
      <SectionHeading section={section} headingId="education-heading" />

      <ol className="professional-journey-list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li
              key={item.id}
              data-education-item
              className="professional-journey-item"
            >
              <div className="professional-journey-rail" aria-hidden="true">
                <span
                  data-education-dot
                  className="professional-journey-dot"
                />
                {!isLast ? (
                  <span
                    data-education-line
                    className="professional-journey-line"
                  />
                ) : null}
              </div>

              <div
                data-education-body
                className="flex min-w-0 flex-1 flex-col gap-2 pb-10 sm:pb-12"
              >
                <p className="text-sm font-medium text-home-accent">
                  {item.period}
                </p>
                <h3 className="font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  {item.degree}
                </h3>
                <p className="text-base text-home-muted">
                  <span className="text-white/90">{item.institution}</span>
                  {item.location ? (
                    <>
                      <span aria-hidden="true" className="mx-2 text-white/30">
                        ·
                      </span>
                      <span>{item.location}</span>
                    </>
                  ) : null}
                </p>
                {item.grade ? (
                  <p className="text-sm font-medium text-home-accent/90">
                    {item.grade}
                  </p>
                ) : null}
                <p className="mt-1 max-w-2xl text-base leading-7 text-home-muted">
                  {item.description}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
