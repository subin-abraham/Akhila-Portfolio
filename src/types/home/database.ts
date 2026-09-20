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

export interface BlogPostRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  published_on: string;
  sort_order: number;
}

export interface CaseStudyRow {
  id: string;
  title: string;
  client: string | null;
  period: string;
  summary: string;
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

export type ContactEmailStatus = 'pending' | 'sent' | 'failed' | 'skipped';

export interface ContactSubmissionRow {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  ip_address: string | null;
  forwarded_for: string | null;
  user_agent: string | null;
  referer: string | null;
  origin: string | null;
  host: string | null;
  accept_language: string | null;
  request_path: string | null;
  honeypot_triggered: boolean;
  email_status: ContactEmailStatus;
  email_error: string | null;
  email_provider_id: string | null;
  email_to: string | null;
  email_from: string | null;
  email_subject: string | null;
  created_at: string;
  email_sent_at: string | null;
}

export interface ContactRateLimitEventRow {
  id: string;
  client_key: string;
  ip_address: string | null;
  forwarded_for: string | null;
  user_agent: string | null;
  referer: string | null;
  origin: string | null;
  host: string | null;
  accept_language: string | null;
  request_path: string | null;
  attempt_count: number;
  max_requests: number;
  window_ms: number;
  reset_at: string | null;
  remaining_ms: number | null;
  name: string | null;
  email: string | null;
  subject: string | null;
  message_preview: string | null;
  message_length: number | null;
  created_at: string;
}

