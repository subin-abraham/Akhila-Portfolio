import Link from 'next/link';

import { AdminPageHeader } from '@/features/admin/components/AdminFormPrimitives';
import type { ContentDashboardCard } from '@/types/components/admin-content';

interface DashboardSection {
  id: string;
  title: string;
  description: string;
  cards: ContentDashboardCard[];
}

const DASHBOARD_SECTIONS: DashboardSection[] = [
  {
    id: 'layout',
    title: 'Layout',
    description: 'Hero, social links, and footer chrome.',
    cards: [
      {
        href: '/admin/hero',
        title: 'Hero',
        description: 'Name, intro, and primary button',
      },
      {
        href: '/admin/social-links',
        title: 'Social links',
        description: 'LinkedIn, email, and other profile links',
      },
      {
        href: '/admin/footer',
        title: 'Footer',
        description: 'Brand copy, CTA, and social icons',
      },
    ],
  },
  {
    id: 'content',
    title: 'Content',
    description: 'Homepage body sections.',
    cards: [
      {
        href: '/admin/worked-with',
        title: 'Worked with',
        description: 'Logo row companies',
      },
      {
        href: '/admin/professional-journey',
        title: 'Professional journey',
        description: 'Roles and experience entries',
      },
      {
        href: '/admin/education',
        title: 'Education',
        description: 'Degrees and academic entries',
      },
      {
        href: '/admin/technical-expertise',
        title: 'Technical expertise',
        description: 'Skills and proficiency',
      },
      {
        href: '/admin/tools-and-technology',
        title: 'Tools & technology',
        description: 'Toolkit inventory',
      },
    ],
  },
  {
    id: 'pages',
    title: 'Pages',
    description: 'Standalone public pages for case studies and blog.',
    cards: [
      {
        href: '/admin/case-studies',
        title: 'Case studies',
        description: 'Project deep-dives on /case-studies',
      },
      {
        href: '/admin/blog',
        title: 'Blog',
        description: 'Posts for the /blog page',
      },
    ],
  },
  {
    id: 'inbox',
    title: 'Inbox',
    description: 'Contact form submissions, delivery status, and rate-limit logs.',
    cards: [
      {
        href: '/admin/contact',
        title: 'Contact',
        description: 'Submissions, email delivery details, and rate limits',
      },
    ],
  },
];

export function ContentDashboard() {
  return (
    <main className="px-6 py-8 sm:px-10">
      <AdminPageHeader
        eyebrow="Admin"
        title="Homepage content"
        description="Edit every field that powers the public homepage. Changes go live after you save."
      />

      <div className="flex w-full flex-col gap-10">
        {DASHBOARD_SECTIONS.map((section) => (
          <section key={section.id} aria-labelledby={`dashboard-section-${section.id}`}>
            <div className="mb-4">
              <h2
                id={`dashboard-section-${section.id}`}
                className="font-display text-xl font-semibold text-white"
              >
                {section.title}
              </h2>
              <p className="mt-1 text-sm text-home-muted">{section.description}</p>
            </div>
            <ul className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {section.cards.map((card) => (
                <li key={card.href}>
                  <Link
                    id={`admin-dashboard-${card.href.replace('/admin/', '')}`}
                    href={card.href}
                    title={card.title}
                    aria-label={`Edit ${card.title}`}
                    className="block rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-home-accent/40 hover:bg-white/[0.05]"
                  >
                    <h3 className="font-display text-lg font-semibold text-white">{card.title}</h3>
                    <p className="mt-2 text-sm text-home-muted">{card.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
