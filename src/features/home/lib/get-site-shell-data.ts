import { cache } from 'react';

import {
  filterLinksBySiteSettings,
  getSiteSettings,
} from '@/features/home/lib/site-settings';
import { createClient } from '@/lib/supabase/server';
import type { SiteShellData } from '@/types/components/site-shell';
import type {
  EducationRow,
  FooterContent,
  FooterData,
  FooterLinkColumn,
  FooterLinkRow,
  FooterRow,
  HomepageContent,
  HomepageRow,
  NavLink,
  NavLinkRow,
  ProfessionalJourneyRow,
  SocialLink,
  SocialLinkRow,
} from '@/types/home';

const ROLE_LABEL = 'Electronics Engineer';

function mapHomepage(row: HomepageRow): HomepageContent {
  return {
    id: row.id,
    fullName: row.full_name,
    intro: row.intro,
    ctaLabel: row.cta_label,
    ctaHref: row.cta_href,
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

export const getSiteShellData = cache(async (): Promise<SiteShellData> => {
  const supabase = await createClient();

  const [
    homepageResult,
    journeyResult,
    educationResult,
    navResult,
    socialResult,
    footerResult,
    footerLinksResult,
    siteSettings,
  ] = await Promise.all([
    supabase.from('homepage').select('*').limit(1).single(),
    supabase
      .from('professional_journey')
      .select('location')
      .order('sort_order', { ascending: true })
      .limit(1),
    supabase
      .from('education')
      .select('location')
      .order('sort_order', { ascending: true })
      .limit(1),
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
    getSiteSettings(),
  ]);

  if (homepageResult.error) {
    throw new Error(`Failed to load homepage: ${homepageResult.error.message}`);
  }

  if (journeyResult.error) {
    throw new Error(
      `Failed to load professional journey: ${journeyResult.error.message}`
    );
  }

  if (educationResult.error) {
    throw new Error(
      `Failed to load education: ${educationResult.error.message}`
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

  const journeyLocation = (
    journeyResult.data as Pick<ProfessionalJourneyRow, 'location'>[]
  )[0]?.location;
  const educationLocation = (
    educationResult.data as Pick<EducationRow, 'location'>[]
  )[0]?.location;

  return {
    homepage: mapHomepage(homepageResult.data as HomepageRow),
    navLinks: filterLinksBySiteSettings(
      (navResult.data as NavLinkRow[]).map(mapNavLink),
      siteSettings
    ),
    socialLinks: (socialResult.data as SocialLinkRow[]).map(mapSocialLink),
    footer: mapFooterData(
      footerResult.data as FooterRow,
      filterLinksBySiteSettings(
        footerLinksResult.data as FooterLinkRow[],
        siteSettings
      )
    ),
    locationLabel: journeyLocation || educationLocation || undefined,
    roleLabel: ROLE_LABEL,
    themeToggleEnabled: siteSettings.themeToggleEnabled,
    defaultTheme: siteSettings.defaultTheme,
  };
});
