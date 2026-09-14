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

      panels.forEach((panel, panelIndex) => {
        const fromX = panelIndex % 2 === 0 ? -48 : 48;
        const skills = panel.querySelectorAll('[data-expertise-skill]');
        const fills = panel.querySelectorAll<HTMLElement>('[data-expertise-fill]');
        const values = panel.querySelectorAll<HTMLElement>('[data-expertise-value]');

        gsap.from(panel, {
          x: fromX,
          autoAlpha: 0,
          rotateZ: panelIndex % 2 === 0 ? -1.5 : 1.5,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: panel,
            start: 'top 85%',
            toggleActions: 'play reverse play reverse',
          },
        });

        gsap.from(skills, {
          y: 22,
          autoAlpha: 0,
          duration: 0.45,
          stagger: 0.07,
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
      <div className="expertise-backdrop" aria-hidden="true" />

      <div className="relative flex flex-col gap-10 sm:gap-12">
        <SectionHeading
          section={section}
          headingId="technical-expertise-heading"
          headingClassName="font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl"
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
                <span className="expertise-index" aria-hidden="true">
                  {formatIndex(categoryIndex)}
                </span>
                <h3 className="font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  {category.category}
                </h3>
              </div>

              <ul className="mt-8 flex flex-col gap-5">
                {category.skills.map((skill) => (
                  <li key={skill.id} data-expertise-skill className="min-w-0">
                    <div className="mb-2 flex items-baseline justify-between gap-4">
                      <span className="text-sm text-white/90 sm:text-base">
                        {skill.name}
                      </span>
                      <span
                        data-expertise-value
                        className="font-display text-sm font-semibold tabular-nums text-home-accent"
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
