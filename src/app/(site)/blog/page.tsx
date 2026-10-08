import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { BlogPage } from '@/features/blog/components/BlogPage';
import { getBlogPageData } from '@/features/blog/lib/get-blog-page-data';
import { getSiteSettings } from '@/features/home/lib/site-settings';

export const metadata: Metadata = {
  title: 'Blog | Akhila Anns Jacob',
  description:
    'Notes on hardware design, firmware, and the craft of building reliable electronics.',
};

export default async function BlogRoutePage() {
  const settings = await getSiteSettings();

  if (!settings.blogEnabled) {
    notFound();
  }

  const data = await getBlogPageData();
  return <BlogPage data={data} />;
}
