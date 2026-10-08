'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { resolveSiteHref } from '@/features/home/lib/resolve-site-href';
import type { HeroSectionProps } from '@/types/components/hero-section';

function shortDescriptionFromIntro(intro: string) {
  const trimmed = intro.trim();
  const firstSentence = trimmed.split(/(?<=[.!?])\s+/)[0]?.trim();

  if (firstSentence) {
    return firstSentence;
  }

  if (trimmed.length <= 180) {
    return trimmed;
  }

  return `${trimmed.slice(0, 177).trimEnd()}…`;
}

export function HeroSection({ homepage }: HeroSectionProps) {
  const reduceMotion = useReducedMotion();
  const shortDescription = shortDescriptionFromIntro(homepage.intro);

  return (
    <section id="home" className="hero-stage">
      <div className="hero-atmosphere" aria-hidden="true">
        <motion.div
          className="hero-glow"
          animate={
            reduceMotion
              ? { opacity: 0.7 }
              : { opacity: [0.55, 0.85, 0.65, 0.8] }
          }
          transition={
            reduceMotion
              ? { duration: 0.01 }
              : { duration: 14, repeat: Infinity, ease: 'easeInOut' }
          }
        />
        <div className="hero-scanlines" />
        <div className="hero-grain" />
        <div className="hero-vignette" />
      </div>

      <div className="hero-content">
        <motion.h1
          className="hero-title"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="hero-title-line">Hi there,</span>
          <span className="hero-title-line">I am {homepage.fullName}</span>
        </motion.h1>

        <motion.p
          className="hero-intro"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
        >
          {shortDescription}
        </motion.p>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <a
            id="hero-cta"
            href={resolveSiteHref(homepage.ctaHref)}
            title={homepage.ctaLabel}
            aria-label={homepage.ctaLabel}
            className="hero-cta"
          >
            {homepage.ctaLabel}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
