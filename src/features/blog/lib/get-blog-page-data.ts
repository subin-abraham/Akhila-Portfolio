import { createClient } from '@/lib/supabase/server';
import type { BlogPageData } from '@/types/components/blog-page';
import type {
  BlogPost,
  BlogPostRow,
  HomepageSectionContent,
  HomepageSectionRow,
} from '@/types/home';
import type { SectionHighlightTarget } from '@/types/home/homepage-section';

const BLOG_SECTION_KEY = 'blog';

function mapHomepageSection(row: HomepageSectionRow): HomepageSectionContent {
  const highlightTarget: SectionHighlightTarget =
    row.highlight_target === 'title' ? 'title' : 'accent';

  return {
    id: row.id,
    sectionKey: row.section_key,
    eyebrow: row.eyebrow,
    title: row.title,
    accentTitle: row.accent_title,
    description: row.description,
    highlightTarget,
  };
}

function mapBlogPost(row: BlogPostRow): BlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    body: row.body,
    publishedOn: row.published_on.slice(0, 10),
    sortOrder: row.sort_order,
  };
}

export async function getBlogPageData(): Promise<BlogPageData> {
  const supabase = await createClient();

  const [postsResult, sectionsResult] = await Promise.all([
    supabase
      .from('blog_posts')
      .select('*')
      .order('sort_order', { ascending: true }),
    supabase
      .from('homepage_sections')
      .select('*')
      .eq('section_key', BLOG_SECTION_KEY),
  ]);

  if (postsResult.error) {
    throw new Error(`Failed to load blog posts: ${postsResult.error.message}`);
  }

  if (sectionsResult.error) {
    throw new Error(
      `Failed to load blog section: ${sectionsResult.error.message}`
    );
  }

  const sectionRow = (sectionsResult.data as HomepageSectionRow[])[0];

  if (!sectionRow) {
    throw new Error(`Missing homepage section copy for "${BLOG_SECTION_KEY}"`);
  }

  return {
    section: mapHomepageSection(sectionRow),
    posts: (postsResult.data as BlogPostRow[]).map(mapBlogPost),
  };
}
