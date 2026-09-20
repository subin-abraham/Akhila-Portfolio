import { createClient } from '@/lib/supabase/server';
import type { BlogPageData } from '@/types/components/blog-page';
import type {
  BlogPost,
  BlogPostRow,
  FooterContent,
  FooterData,
  FooterLinkColumn,
  FooterLinkRow,
  FooterRow,
  HomepageSectionContent,
  HomepageSectionRow,
  NavLink,
  NavLinkRow,
  SocialLink,
  SocialLinkRow,
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

function mapNavLink(row: NavLinkRow): NavLink {
  return {
    id: row.id,
    label: row.label,
    href: row.href,
    sortOrder: row.sort_order,
  };
}

function mapSocialLink(row: SocialLinkRow): SocialLink {
  return {
    id: row.id,
    platform: row.platform,
    href: row.href,
    sortOrder: row.sort_order,
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

function mapFooter(row: FooterRow): FooterContent {
  return {
    id: row.id,
    brandName: row.brand_name,
    tagline: row.tagline,
    statusLabel: row.status_label,
    ctaLabel: row.cta_label,
    ctaHref: row.cta_href,
    copyrightName: row.copyright_name,
  };
}

function groupFooterLinks(rows: FooterLinkRow[]): FooterLinkColumn[] {
  const columns: FooterLinkColumn[] = [];
  const columnIndex = new Map<string, number>();

  const sortedRows = [...rows].sort((left, right) => {
    if (left.column_sort_order !== right.column_sort_order) {
      return left.column_sort_order - right.column_sort_order;
    }

    return left.sort_order - right.sort_order;
  });

  for (const row of sortedRows) {
    let index = columnIndex.get(row.column_key);

    if (index === undefined) {
      index = columns.length;
      columnIndex.set(row.column_key, index);
      columns.push({
        columnKey: row.column_key,
        title: row.column_title,
        links: [],
      });
    }

    columns[index]?.links.push({
      id: row.id,
      label: row.label,
      href: row.href,
      sortOrder: row.sort_order,
    });
  }

  return columns;
}

function mapFooterData(
  contentRow: FooterRow,
  linkRows: FooterLinkRow[]
): FooterData {
  return {
    content: mapFooter(contentRow),
    columns: groupFooterLinks(linkRows),
  };
}

export async function getBlogPageData(): Promise<BlogPageData> {
  const supabase = await createClient();

  const [postsResult, sectionsResult, navResult, socialResult, footerResult, footerLinksResult] =
    await Promise.all([
      supabase
        .from('blog_posts')
        .select('*')
        .order('sort_order', { ascending: true }),
      supabase.from('homepage_sections').select('*').eq('section_key', BLOG_SECTION_KEY),
      supabase.from('nav_links').select('*').order('sort_order', { ascending: true }),
      supabase
        .from('social_links')
        .select('*')
        .order('sort_order', { ascending: true }),
      supabase.from('footer').select('*').limit(1).single(),
      supabase
        .from('footer_links')
        .select('*')
        .order('column_sort_order', { ascending: true })
        .order('sort_order', { ascending: true }),
    ]);

  if (postsResult.error) {
    throw new Error(`Failed to load blog posts: ${postsResult.error.message}`);
  }

  if (sectionsResult.error) {
    throw new Error(
      `Failed to load blog section: ${sectionsResult.error.message}`
    );
  }

  if (navResult.error) {
    throw new Error(`Failed to load nav links: ${navResult.error.message}`);
  }

  if (socialResult.error) {
    throw new Error(`Failed to load social links: ${socialResult.error.message}`);
  }

  if (footerResult.error) {
    throw new Error(`Failed to load footer: ${footerResult.error.message}`);
  }

  if (footerLinksResult.error) {
    throw new Error(
      `Failed to load footer links: ${footerLinksResult.error.message}`
    );
  }

  const sectionRow = (sectionsResult.data as HomepageSectionRow[])[0];

  if (!sectionRow) {
    throw new Error(`Missing homepage section copy for "${BLOG_SECTION_KEY}"`);
  }

  return {
    section: mapHomepageSection(sectionRow),
    posts: (postsResult.data as BlogPostRow[]).map(mapBlogPost),
    navLinks: (navResult.data as NavLinkRow[]).map(mapNavLink),
    socialLinks: (socialResult.data as SocialLinkRow[]).map(mapSocialLink),
    footer: mapFooterData(
      footerResult.data as FooterRow,
      footerLinksResult.data as FooterLinkRow[]
    ),
  };
}
