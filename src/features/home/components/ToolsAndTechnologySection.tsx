'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { SectionHeading } from '@/features/home/components/SectionHeading';
import { prefersReducedMotion } from '@/features/home/lib/prefers-reduced-motion';
import type { ToolsAndTechnologySectionProps } from '@/types/components/tools-and-technology-section';

gsap.registerPlugin(ScrollTrigger);

export function ToolsAndTechnologySection({
  section,
  categories,
}: ToolsAndTechnologySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = sectionRef.current;

    if (!root || categories.length === 0 || prefersReducedMotion()) {
      return;
    }

    const context = gsap.context(() => {
      const headingParts = root.querySelectorAll('[data-tools-heading]');
      const rows = root.querySelectorAll('[data-tools-row]');

      gsap.from(headingParts, {
        yPercent: 110,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: root,
          start: 'top 75%',
          toggleActions: 'play reverse play reverse',
        },
      });

      rows.forEach((row) => {
        const rule = row.querySelector('[data-tools-rule]');
        const label = row.querySelector('[data-tools-label]');
        const chips = row.querySelectorAll('[data-tools-chip]');

        const rowTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: 'top 88%',
            toggleActions: 'play reverse play reverse',
          },
        });

        if (rule) {
          rowTimeline.from(
            rule,
            {
              scaleX: 0,
              transformOrigin: 'center',
              duration: 0.7,
              ease: 'power2.out',
            },
            0
          );
        }

        if (label) {
          rowTimeline.from(
            label,
            {
              x: -16,
              autoAlpha: 0,
              duration: 0.45,
              ease: 'power2.out',
            },
            0.08
          );
        }

        rowTimeline.from(
          chips,
          {
            y: 14,
            autoAlpha: 0,
            duration: 0.4,
            stagger: 0.045,
            ease: 'power2.out',
          },
          0.16
        );
      });
    }, root);

    return () => {
      context.revert();
    };
  }, [categories]);

  if (categories.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      id="tools-and-technology"
      aria-labelledby="tools-and-technology-heading"
      className="tools-section relative scroll-mt-28"
    >
      <div className="tools-backdrop" aria-hidden="true" />

      <div className="relative flex flex-col gap-10 sm:gap-12">
        <SectionHeading
          section={section}
          headingId="tools-and-technology-heading"
          headingClassName="font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl"
          titleMotionAttr="data-tools-heading"
          maskTitle
        />

        <ul className="tools-rack">
          {categories.map((category) => (
            <li key={category.category} data-tools-row className="tools-row">
              <span data-tools-rule className="tools-rule" aria-hidden="true" />
              <div className="tools-row-inner">
                <p
                  data-tools-label
                  className="tools-label font-display text-sm font-semibold tracking-[0.14em] text-home-accent uppercase sm:text-base"
                >
                  {category.category}
                </p>
                <ul className="tools-chip-list">
                  {category.items.map((item) => (
                    <li key={item.id}>
                      <span data-tools-chip className="tools-chip">
                        {item.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
