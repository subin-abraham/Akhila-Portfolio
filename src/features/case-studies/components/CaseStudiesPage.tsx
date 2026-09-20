'use client';

import { useState } from 'react';

import { EmptyState } from '@/components/EmptyState';
import { CaseStudyModal } from '@/features/case-studies/components/CaseStudyModal';
import { SectionHeading } from '@/features/home/components/SectionHeading';
import { SiteFooter } from '@/features/home/components/SiteFooter';
import { SiteHeader } from '@/features/home/components/SiteHeader';
import type { CaseStudiesPageProps } from '@/types/components/case-studies-page';
import type { CaseStudy } from '@/types/home/case-study';

export function CaseStudiesPage({ data }: CaseStudiesPageProps) {
  const [activeItem, setActiveItem] = useState<CaseStudy | null>(null);
  const hasItems = data.items.length > 0;

  return (
    <div className="flex min-h-full flex-1 flex-col bg-home-bg text-white">
      <SiteHeader navLinks={data.navLinks} socialLinks={data.socialLinks} />
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 pb-8 pt-8 sm:px-8 sm:pb-10 sm:pt-10 lg:px-10 lg:pt-12">
        <main className="flex flex-col gap-8 sm:gap-10">
          <SectionHeading
            section={data.section}
            headingId="case-studies-heading"
          />

          {hasItems ? (
            <ul className="grid gap-4 sm:grid-cols-2 sm:gap-5">
              {data.items.map((item) => (
                <li key={item.id}>
                  <button
                    id={`case-study-${item.id}`}
                    type="button"
                    title={`View ${item.title}`}
                    aria-label={`View ${item.title}`}
                    onClick={() => setActiveItem(item)}
                    className="group flex h-full w-full cursor-pointer flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition hover:border-home-accent/40 hover:bg-white/[0.05] sm:p-6"
                  >
                    <p className="text-sm font-medium text-home-accent">
                      {item.period}
                    </p>
                    <h3 className="font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">
                      {item.title}
                    </h3>
                    {item.client ? (
                      <p className="text-sm text-home-muted">{item.client}</p>
                    ) : null}
                    <p className="flex-1 text-base leading-7 text-home-muted">
                      {item.summary}
                    </p>
                    <span className="mt-1 text-sm font-medium text-home-accent transition group-hover:translate-x-0.5">
                      View details
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="No case studies yet"
              description="Project deep-dives will appear here once they are published."
            />
          )}
        </main>
      </div>
      <SiteFooter footer={data.footer} socialLinks={data.socialLinks} />

      {activeItem ? (
        <CaseStudyModal
          item={activeItem}
          onClose={() => setActiveItem(null)}
        />
      ) : null}
    </div>
  );
}
