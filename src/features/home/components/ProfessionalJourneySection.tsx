'use client';

import { useLayoutEffect, useRef, type CSSProperties } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { SectionHeading } from '@/features/home/components/SectionHeading';
import { ShippedWorksCard } from '@/features/home/components/ShippedWorksCard';
import { prefersReducedMotion } from '@/features/home/lib/prefers-reduced-motion';
import type { ProfessionalJourneySectionProps } from '@/types/components/professional-journey-section';

gsap.registerPlugin(ScrollTrigger);

export function ProfessionalJourneySection({
  section,
  items,
}: ProfessionalJourneySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = sectionRef.current;

    if (!root || items.length === 0 || prefersReducedMotion()) {
      return;
    }

    const context = gsap.context(() => {
      const line = root.querySelector('[data-bento-timeline-line]');
      const milestones = root.querySelectorAll('[data-journey-item]');

      if (line) {
        gsap.from(line, {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 0.85,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: root,
            start: 'top 80%',
            toggleActions: 'play reverse play reverse',
          },
        });
      }

      milestones.forEach((entry, index) => {
        gsap.from(entry, {
          y: 16,
          autoAlpha: 0,
          duration: 0.45,
          delay: index * 0.07,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: root,
            start: 'top 80%',
            toggleActions: 'play reverse play reverse',
          },
        });
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
      id="professional-journey"
      aria-labelledby="professional-journey-heading"
      className="home-bento-card journey-bento-card scroll-mt-28"
      style={{ '--bento-timeline-count': String(items.length) } as CSSProperties}
    >
      <SectionHeading
        section={section}
        headingId="professional-journey-heading"
        variant="inCard"
        hideDescription
        headingClassName="bento-card-title"
      />

      <div className="journey-bento-body">
        <div className="bento-timeline-wrap journey-timeline-wrap">
          <span
            data-bento-timeline-line
            className="bento-timeline-line"
            aria-hidden="true"
          />
          <ol className="bento-timeline">
            {items.map((item) => (
              <li key={item.id} data-journey-item className="bento-timeline-item">
                <span className="bento-timeline-dot-mobile" aria-hidden="true" />
                <div className="bento-timeline-content">
                  <p className="bento-timeline-period">{item.period}</p>
                  <div className="bento-timeline-rail" aria-hidden="true">
                    <span className="bento-timeline-dot" />
                  </div>
                  <div className="bento-timeline-body">
                    <h3 className="bento-timeline-title">{item.role}</h3>
                    <p className="bento-timeline-meta">
                      {item.organization}
                      {item.location ? (
                        <>
                          <span
                            aria-hidden="true"
                            className="mx-1.5 text-home-heading/25"
                          >
                            ·
                          </span>
                          <span>{item.location}</span>
                        </>
                      ) : null}
                    </p>
                    <p className="sr-only">{item.description}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <ShippedWorksCard href="/shipped" variant="inset" />
      </div>
    </section>
  );
}
