import { createClient } from '@/lib/supabase/server';
import type {
  SiteSettings,
  SiteSettingsRow,
  SiteThemeMode,
} from '@/types/home/site-settings';

const DEFAULT_SETTINGS: SiteSettings = {
  id: '',
  blogEnabled: true,
  caseStudiesEnabled: true,
  themeToggleEnabled: true,
  defaultTheme: 'dark',
};

const THEME_MODES: SiteThemeMode[] = ['light', 'dark', 'system'];

export function isSiteThemeMode(value: string): value is SiteThemeMode {
  return THEME_MODES.includes(value as SiteThemeMode);
}

export function mapSiteSettings(row: SiteSettingsRow): SiteSettings {
  const defaultTheme =
    typeof row.default_theme === 'string' && isSiteThemeMode(row.default_theme)
      ? row.default_theme
      : DEFAULT_SETTINGS.defaultTheme;

  return {
    id: row.id,
    blogEnabled: row.blog_enabled,
    caseStudiesEnabled: row.case_studies_enabled,
    themeToggleEnabled: row.theme_toggle_enabled ?? DEFAULT_SETTINGS.themeToggleEnabled,
    defaultTheme,
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('site_settings').select('*').limit(1).single();

  if (error || !data) {
    return DEFAULT_SETTINGS;
  }

  return mapSiteSettings(data as SiteSettingsRow);
}

export function isBlogHref(href: string) {
  return href === '/blog' || href.startsWith('/blog/') || href.startsWith('/blog#');
}

export function isCaseStudiesHref(href: string) {
  return (
    href === '/case-studies' ||
    href.startsWith('/case-studies/') ||
    href.startsWith('/case-studies#')
  );
}

export function isHrefEnabledForSettings(href: string, settings: SiteSettings) {
  if (isBlogHref(href)) {
    return settings.blogEnabled;
  }

  if (isCaseStudiesHref(href)) {
    return settings.caseStudiesEnabled;
  }

  return true;
}

export function filterLinksBySiteSettings<T extends { href: string }>(
  links: T[],
  settings: SiteSettings,
): T[] {
  return links.filter((link) => isHrefEnabledForSettings(link.href, settings));
}
