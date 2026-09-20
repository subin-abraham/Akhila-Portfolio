'use client';

import Image from 'next/image';
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

import { prefersReducedMotion } from '@/features/home/lib/prefers-reduced-motion';
import { resolveSiteHref } from '@/features/home/lib/resolve-site-href';
import type { HeroSectionProps } from '@/types/components/hero-section';

const PROFILE_IMAGE_SRC = '/images/Profile_Photo.jpeg';
const PROFILE_IMAGE_ALT = 'Portrait of Akhila Anns Jacob';

export function HeroSection({ homepage }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section || prefersReducedMotion()) {
      return;
    }

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: 'power2.out' },
      });

      timeline
        .from('[data-hero-title]', {
          y: 36,
          autoAlpha: 0,
          duration: 0.85,
        })
        .from(
          '[data-hero-intro]',
          {
            y: 24,
            autoAlpha: 0,
            duration: 0.65,
          },
          '-=0.45'
        )
        .from(
          '[data-hero-cta]',
          {
            y: 18,
            autoAlpha: 0,
            duration: 0.55,
          },
          '-=0.35'
        )
        .from(
          '[data-hero-portrait]',
          {
            scale: 0.9,
            autoAlpha: 0,
            duration: 1,
            ease: 'power3.out',
          },
          0.12
        );
    }, section);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="grid scroll-mt-28 items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16"
    >
      <div className="flex max-w-xl flex-col items-start">
        <h1
          data-hero-title
          className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          {homepage.fullName}
        </h1>
        <p
          data-hero-intro
          className="mt-6 text-base leading-7 text-home-muted sm:text-lg sm:leading-8"
        >
          {homepage.intro}
        </p>
        <a
          data-hero-cta
          id="hero-cta"
          href={resolveSiteHref(homepage.ctaHref)}
          title={homepage.ctaLabel}
          aria-label={homepage.ctaLabel}
          className="home-cta mt-8 inline-flex items-center gap-2 rounded-lg bg-home-accent px-5 py-3 text-sm font-semibold text-home-ink transition-transform hover:scale-[1.02]"
        >
          <span>{homepage.ctaLabel}</span>
          <span aria-hidden="true">&gt;</span>
        </a>
      </div>

      <div className="flex justify-center lg:justify-end">
        <div
          data-hero-portrait
          className="relative aspect-square w-full max-w-[22rem] overflow-hidden rounded-full sm:max-w-[26rem]"
        >
          <Image
            src={PROFILE_IMAGE_SRC}
            alt={PROFILE_IMAGE_ALT}
            fill
            priority
            sizes="(max-width: 1024px) 80vw, 416px"
            className="object-cover object-[center_20%]"
          />
        </div>
      </div>
    </section>
  );
}
