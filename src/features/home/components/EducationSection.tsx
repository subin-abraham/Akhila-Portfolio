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
    const root = sectionRef.current;

    if (!root || items.length === 0 || prefersReducedMotion()) {
      return;
    }

    const context = gsap.context(() => {
      const entries = root.querySelectorAll('[data-education-item]');

      gsap.from(entries, {
        y: 18,
        autoAlpha: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: root,
          start: 'top 80%',
          toggleActions: 'play reverse play reverse',
        },
      });
    }, root);

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
      className="home-bento-card scroll-mt-28"
    >
      <SectionHeading
        section={section}
        headingId="education-heading"
        variant="inCard"
        hideDescription
        headingClassName="bento-card-title"
      />

      <ol className="education-list">
        {items.map((item) => (
          <li key={item.id} data-education-item className="education-item">
            <p className="education-period">{item.period}</p>
            <h3 className="education-degree">{item.degree}</h3>
            <p className="education-meta">
              {item.institution}
              {item.location ? (
                <>
                  <span aria-hidden="true" className="mx-1.5 text-home-heading/25">
                    ·
                  </span>
                  <span>{item.location}</span>
                </>
              ) : null}
            </p>
            {item.grade ? <p className="education-grade">{item.grade}</p> : null}
            <p className="sr-only">{item.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
