'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { SectionHeading } from '@/features/home/components/SectionHeading';
import { prefersReducedMotion } from '@/features/home/lib/prefers-reduced-motion';
import type { TechnicalExpertiseSectionProps } from '@/types/components/technical-expertise-section';

gsap.registerPlugin(ScrollTrigger);

function formatIndex(index: number): string {
  return String(index + 1).padStart(2, '0');
}

export function TechnicalExpertiseSection({
  section,
  categories,
}: TechnicalExpertiseSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = sectionRef.current;

    if (!root || categories.length === 0 || prefersReducedMotion()) {
      return;
    }

    const context = gsap.context(() => {
      const headingParts = root.querySelectorAll('[data-expertise-heading]');
      const panels = root.querySelectorAll('[data-expertise-panel]');

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

      panels.forEach((panel) => {
        const skills = panel.querySelectorAll('[data-expertise-skill]');
        const fills = panel.querySelectorAll<HTMLElement>('[data-expertise-fill]');
        const values = panel.querySelectorAll<HTMLElement>('[data-expertise-value]');

        gsap.from(panel, {
          y: 28,
          autoAlpha: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: panel,
            start: 'top 85%',
            toggleActions: 'play reverse play reverse',
          },
        });

        gsap.from(skills, {
          y: 14,
          autoAlpha: 0,
          duration: 0.4,
          stagger: 0.06,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: panel,
            start: 'top 82%',
            toggleActions: 'play reverse play reverse',
          },
        });

        fills.forEach((fill, skillIndex) => {
          const target = Number(fill.dataset.proficiency ?? '0');
          const valueEl = values[skillIndex];
          const counter = { value: 0 };

          gsap.fromTo(
            fill,
            { scaleX: 0 },
            {
              scaleX: target / 100,
              duration: 1.1,
              ease: 'power2.out',
              transformOrigin: 'left center',
              scrollTrigger: {
                trigger: fill,
                start: 'top 90%',
                toggleActions: 'play reverse play reverse',
              },
            }
          );

          if (valueEl) {
            gsap.to(counter, {
              value: target,
              duration: 1.1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: fill,
                start: 'top 90%',
                toggleActions: 'play reverse play reverse',
              },
              onUpdate: () => {
                valueEl.textContent = `${Math.round(counter.value)}%`;
              },
              onReverseComplete: () => {
                valueEl.textContent = '0%';
              },
            });
          }
        });
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
      id="technical-expertise"
      aria-labelledby="technical-expertise-heading"
      className="expertise-section relative scroll-mt-28"
    >
      <div className="relative flex flex-col gap-8 sm:gap-10">
        <SectionHeading
          section={section}
          headingId="technical-expertise-heading"
          headingClassName="font-display text-3xl font-normal tracking-tight sm:text-4xl lg:text-[2.75rem]"
          titleMotionAttr="data-expertise-heading"
          maskTitle
        />

        <div className="expertise-grid">
          {categories.map((category, categoryIndex) => (
            <article
              key={category.category}
              data-expertise-panel
              className="expertise-panel"
            >
              <div className="expertise-panel-top">
                <p className="expertise-label">{formatIndex(categoryIndex)}</p>
                <h3 className="font-display text-xl font-normal tracking-tight text-home-heading sm:text-2xl">
                  {category.category}
                </h3>
              </div>

              <ul className="flex flex-col gap-5">
                {category.skills.map((skill) => (
                  <li key={skill.id} data-expertise-skill className="min-w-0">
                    <div className="mb-2 flex items-baseline justify-between gap-4">
                      <span className="text-sm text-home-heading/85 sm:text-[0.9375rem]">
                        {skill.name}
                      </span>
                      <span
                        data-expertise-value
                        className="text-xs font-medium tabular-nums text-home-muted"
                      >
                        0%
                      </span>
                    </div>
                    <div className="expertise-track" aria-hidden="true">
                      <span
                        data-expertise-fill
                        data-proficiency={skill.proficiency}
                        className="expertise-fill"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
