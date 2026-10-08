export type SiteThemeMode = 'light' | 'dark' | 'system';

export interface SiteSettings {
  id: string;
  blogEnabled: boolean;
  caseStudiesEnabled: boolean;
  themeToggleEnabled: boolean;
  defaultTheme: SiteThemeMode;
}

export interface SiteSettingsRow {
  id: string;
  blog_enabled: boolean;
  case_studies_enabled: boolean;
  theme_toggle_enabled?: boolean | null;
  default_theme?: string | null;
  updated_at: string;
}
