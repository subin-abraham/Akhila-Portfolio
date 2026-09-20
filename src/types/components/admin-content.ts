import type { SocialPlatform } from '@/types/home/social';

export interface AdminHomepageContent {
  id: string;
  fullName: string;
  intro: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface AdminNavLinkItem {
  id: string;
  label: string;
  href: string;
  sortOrder: number;
}

export interface AdminSocialLinkItem {
  id: string;
  platform: SocialPlatform;
  href: string;
  sortOrder: number;
}

export interface AdminWorkedWithItem {
  id: string;
  name: string;
  sortOrder: number;
}

export interface AdminProfessionalJourneyItem {
  id: string;
  role: string;
  organization: string;
  location: string | null;
  period: string;
  description: string;
  sortOrder: number;
}

export interface AdminEducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string | null;
  period: string;
  grade: string | null;
  description: string;
  sortOrder: number;
}

export interface AdminBlogPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  publishedOn: string;
  sortOrder: number;
}

export interface AdminCaseStudyItem {
  id: string;
  title: string;
  client: string | null;
  period: string;
  summary: string;
  description: string;
  sortOrder: number;
}

export interface AdminTechnicalExpertiseItem {
  id: string;
  category: string;
  skill: string;
  proficiency: number;
  sortOrder: number;
}

export interface AdminToolsItem {
  id: string;
  category: string;
  name: string;
  sortOrder: number;
}

export interface AdminFooterContent {
  id: string;
  brandName: string;
  tagline: string;
  statusLabel: string;
  ctaLabel: string;
  ctaHref: string;
  copyrightName: string;
}

export interface AdminFooterLinkItem {
  id: string;
  columnKey: string;
  columnTitle: string;
  label: string;
  href: string;
  sortOrder: number;
  columnSortOrder: number;
}

export interface HeroEditorProps {
  homepage: AdminHomepageContent;
}

export interface NavLinksEditorProps {
  items: AdminNavLinkItem[];
}

export interface SocialLinksEditorProps {
  items: AdminSocialLinkItem[];
}

export interface WorkedWithEditorProps {
  items: AdminWorkedWithItem[];
}

export interface ProfessionalJourneyEditorProps {
  items: AdminProfessionalJourneyItem[];
}

export interface EducationEditorProps {
  items: AdminEducationItem[];
}

export interface BlogEditorProps {
  items: AdminBlogPostItem[];
}

export interface CaseStudiesEditorProps {
  items: AdminCaseStudyItem[];
}

export interface TechnicalExpertiseEditorProps {
  items: AdminTechnicalExpertiseItem[];
}

export interface ToolsEditorProps {
  items: AdminToolsItem[];
}

export interface FooterEditorProps {
  content: AdminFooterContent;
  socialLinks: AdminSocialLinkItem[];
}

export type AdminContactEmailStatus = 'pending' | 'sent' | 'failed' | 'skipped';

export interface AdminContactSubmissionItem {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  ipAddress: string | null;
  forwardedFor: string | null;
  userAgent: string | null;
  referer: string | null;
  origin: string | null;
  host: string | null;
  acceptLanguage: string | null;
  requestPath: string | null;
  honeypotTriggered: boolean;
  emailStatus: AdminContactEmailStatus;
  emailError: string | null;
  emailProviderId: string | null;
  emailTo: string | null;
  emailFrom: string | null;
  emailSubject: string | null;
  createdAt: string;
  emailSentAt: string | null;
}

export interface AdminContactRateLimitEventItem {
  id: string;
  clientKey: string;
  ipAddress: string | null;
  forwardedFor: string | null;
  userAgent: string | null;
  referer: string | null;
  origin: string | null;
  host: string | null;
  acceptLanguage: string | null;
  requestPath: string | null;
  attemptCount: number;
  maxRequests: number;
  windowMs: number;
  resetAt: string | null;
  remainingMs: number | null;
  name: string | null;
  email: string | null;
  subject: string | null;
  messagePreview: string | null;
  messageLength: number | null;
  createdAt: string;
}

export interface AdminContactDeliverySettings {
  toEmail: string | null;
  fromEmail: string | null;
  resendConfigured: boolean;
  challengeSecretConfigured: boolean;
  rateLimitMaxRequests: number;
  rateLimitWindowMs: number;
}

export interface ContactEditorProps {
  settings: AdminContactDeliverySettings;
  submissions: AdminContactSubmissionItem[];
  rateLimitEvents: AdminContactRateLimitEventItem[];
}

export interface ContentDashboardCard {
  href: string;
  title: string;
  description: string;
}
