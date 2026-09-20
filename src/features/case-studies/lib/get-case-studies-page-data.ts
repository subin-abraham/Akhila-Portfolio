import { createClient } from '@/lib/supabase/server';
import type { CaseStudiesPageData } from '@/types/components/case-studies-page';
import type {
  CaseStudy,
  CaseStudyRow,
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

const CASE_STUDIES_SECTION_KEY = 'case_studies';

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

function mapCaseStudy(row: CaseStudyRow): CaseStudy {
  return {
    id: row.id,
    title: row.title,
    client: row.client,
    period: row.period,
    summary: row.summary,
    description: row.description,
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

export async function getCaseStudiesPageData(): Promise<CaseStudiesPageData> {
  const supabase = await createClient();

  const [
    itemsResult,
    sectionsResult,
    navResult,
    socialResult,
    footerResult,
    footerLinksResult,
  ] = await Promise.all([
    supabase
      .from('case_studies')
      .select('*')
      .order('sort_order', { ascending: true }),
    supabase
      .from('homepage_sections')
      .select('*')
      .eq('section_key', CASE_STUDIES_SECTION_KEY),
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

  if (itemsResult.error) {
    throw new Error(
      `Failed to load case studies: ${itemsResult.error.message}`
    );
  }

  if (sectionsResult.error) {
    throw new Error(
      `Failed to load case studies section: ${sectionsResult.error.message}`
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
    throw new Error(
      `Missing homepage section copy for "${CASE_STUDIES_SECTION_KEY}"`
    );
  }

  return {
    section: mapHomepageSection(sectionRow),
    items: (itemsResult.data as CaseStudyRow[]).map(mapCaseStudy),
    navLinks: (navResult.data as NavLinkRow[]).map(mapNavLink),
    socialLinks: (socialResult.data as SocialLinkRow[]).map(mapSocialLink),
    footer: mapFooterData(
      footerResult.data as FooterRow,
      footerLinksResult.data as FooterLinkRow[]
    ),
  };
}
