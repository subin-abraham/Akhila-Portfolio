import type { SocialPlatform } from '@/types/home/social';

export interface HomepageRow {
  id: string;
  full_name: string;
  intro: string;
  cta_label: string;
  cta_href: string;
}

export interface NavLinkRow {
  id: string;
  label: string;
  href: string;
  sort_order: number;
}

export interface SocialLinkRow {
  id: string;
  platform: SocialPlatform;
  href: string;
  sort_order: number;
}

export interface WorkedWithRow {
  id: string;
  name: string;
  logo_url: string;
  sort_order: number;
}

export interface ProfessionalJourneyRow {
  id: string;
  role: string;
  organization: string;
  location: string | null;
  period: string;
  description: string;
  sort_order: number;
}

export interface EducationRow {
  id: string;
  degree: string;
  institution: string;
  location: string | null;
  period: string;
  grade: string | null;
  description: string;
  sort_order: number;
}

export interface TechnicalExpertiseRow {
  id: string;
  category: string;
  skill: string;
  proficiency: number;
  sort_order: number;
}

export interface ToolsAndTechnologyRow {
  id: string;
  category: string;
  name: string;
  sort_order: number;
}

export interface HomepageSectionRow {
  id: string;
  section_key: string;
  eyebrow: string;
  title: string;
  accent_title: string | null;
  description: string;
  highlight_target: 'title' | 'accent';
}

export interface FooterRow {
  id: string;
  brand_name: string;
  tagline: string;
  status_label: string;
  cta_label: string;
  cta_href: string;
  copyright_name: string;
}

export interface FooterLinkRow {
  id: string;
  column_key: string;
  column_title: string;
  label: string;
  href: string;
  sort_order: number;
  column_sort_order: number;
}
