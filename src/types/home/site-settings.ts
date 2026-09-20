export interface SiteSettings {
  id: string;
  blogEnabled: boolean;
  caseStudiesEnabled: boolean;
}

export interface SiteSettingsRow {
  id: string;
  blog_enabled: boolean;
  case_studies_enabled: boolean;
  updated_at: string;
}
