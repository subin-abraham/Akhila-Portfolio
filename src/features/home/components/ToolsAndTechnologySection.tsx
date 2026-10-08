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
      const cards = root.querySelectorAll('[data-tools-row]');

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

      cards.forEach((card) => {
        const label = card.querySelector('[data-tools-label]');
        const chips = card.querySelectorAll('[data-tools-chip]');

        const cardTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            toggleActions: 'play reverse play reverse',
          },
        });

        cardTimeline.from(
          card,
          {
            y: 24,
            autoAlpha: 0,
            duration: 0.55,
            ease: 'power2.out',
          },
          0
        );

        if (label) {
          cardTimeline.from(
            label,
            {
              y: 10,
              autoAlpha: 0,
              duration: 0.4,
              ease: 'power2.out',
            },
            0.08
          );
        }

        cardTimeline.from(
          chips,
          {
            y: 10,
            autoAlpha: 0,
            duration: 0.35,
            stagger: 0.04,
            ease: 'power2.out',
          },
          0.14
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
      <div className="relative flex flex-col gap-8 sm:gap-10">
        <SectionHeading
          section={section}
          headingId="tools-and-technology-heading"
          headingClassName="font-display text-3xl font-normal tracking-tight sm:text-4xl lg:text-[2.75rem]"
          titleMotionAttr="data-tools-heading"
          maskTitle
        />

        <ul className="tools-grid">
          {categories.map((category) => (
            <li key={category.category} data-tools-row className="tools-card">
              <p data-tools-label className="tools-label">
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
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
