import type { Metadata } from 'next';

import { CaseStudiesPage } from '@/features/case-studies/components/CaseStudiesPage';
import { getCaseStudiesPageData } from '@/features/case-studies/lib/get-case-studies-page-data';

export const metadata: Metadata = {
  title: 'Case Studies | Akhila Anns Jacob',
  description:
    'Project deep-dives — the problem, the approach, and what shipped on the board.',
};

export default async function CaseStudiesRoutePage() {
  const data = await getCaseStudiesPageData();
  return <CaseStudiesPage data={data} />;
}
