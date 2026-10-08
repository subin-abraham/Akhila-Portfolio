import Image from 'next/image';

import {
  PROFILE_IMAGE_ALT,
  PROFILE_IMAGE_SRC,
} from '@/features/home/lib/profile-image';
import type { AboutSectionProps } from '@/types/components/about-section';

function splitIntroParagraphs(intro: string) {
  const sentences = intro
    .trim()
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  if (sentences.length <= 2) {
    return [intro.trim()];
  }

  const midpoint = Math.ceil(sentences.length / 2);
  return [
    sentences.slice(0, midpoint).join(' '),
    sentences.slice(midpoint).join(' '),
  ];
}

export function AboutSection({ intro }: AboutSectionProps) {
  if (!intro.trim()) {
    return null;
  }

  const paragraphs = splitIntroParagraphs(intro);

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="about-bento scroll-mt-28"
    >
      <h2 id="about-heading" className="bento-section-title">
        A bit about me
      </h2>

      <div className="about-bento-row">
        <div className="home-bento-card about-context-card">
          <div className="about-intro-stack">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="about-intro">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="about-portrait-card">
          <Image
            src={PROFILE_IMAGE_SRC}
            alt={PROFILE_IMAGE_ALT}
            fill
            sizes="(min-width: 900px) 28vw, 90vw"
            className="about-portrait-image"
          />
        </div>
      </div>
    </section>
  );
}
