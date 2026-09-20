import {
  CONTACT_RATE_LIMIT_MAX_REQUESTS,
  CONTACT_RATE_LIMIT_WINDOW_MS,
} from '@/features/home/lib/contact-rate-limit';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import type {
  BlogPostRow,
  CaseStudyRow,
  ContactRateLimitEventRow,
  ContactSubmissionRow,
  EducationRow,
  FooterRow,
  HomepageRow,
  NavLinkRow,
  ProfessionalJourneyRow,
  SocialLinkRow,
  TechnicalExpertiseRow,
  ToolsAndTechnologyRow,
  WorkedWithRow,
} from '@/types/home/database';
import type {
  AdminBlogPostItem,
  AdminCaseStudyItem,
  AdminContactDeliverySettings,
  AdminContactRateLimitEventItem,
  AdminContactSubmissionItem,
  AdminEducationItem,
  AdminFooterContent,
  AdminHomepageContent,
  AdminNavLinkItem,
  AdminProfessionalJourneyItem,
  AdminSocialLinkItem,
  AdminTechnicalExpertiseItem,
  AdminToolsItem,
  AdminWorkedWithItem,
} from '@/types/components/admin-content';

const DEFAULT_FROM_EMAIL = 'onboarding@resend.dev';
const CONTACT_ADMIN_LIST_LIMIT = 200;

function mapHomepage(row: HomepageRow): AdminHomepageContent {
  return {
    id: row.id,
    fullName: row.full_name,
    intro: row.intro,
    ctaLabel: row.cta_label,
    ctaHref: row.cta_href,
  };
}

function mapNav(row: NavLinkRow): AdminNavLinkItem {
  return {
    id: row.id,
    label: row.label,
    href: row.href,
    sortOrder: row.sort_order,
  };
}

function mapSocial(row: SocialLinkRow): AdminSocialLinkItem {
  return {
    id: row.id,
    platform: row.platform,
    href: row.href,
    sortOrder: row.sort_order,
  };
}

function mapWorkedWith(row: WorkedWithRow): AdminWorkedWithItem {
  return {
    id: row.id,
    name: row.name,
    sortOrder: row.sort_order,
  };
}

function mapJourney(row: ProfessionalJourneyRow): AdminProfessionalJourneyItem {
  return {
    id: row.id,
    role: row.role,
    organization: row.organization,
    location: row.location,
    period: row.period,
    description: row.description,
    sortOrder: row.sort_order,
  };
}

function mapEducation(row: EducationRow): AdminEducationItem {
  return {
    id: row.id,
    degree: row.degree,
    institution: row.institution,
    location: row.location,
    period: row.period,
    grade: row.grade,
    description: row.description,
    sortOrder: row.sort_order,
  };
}

function mapBlogPost(row: BlogPostRow): AdminBlogPostItem {
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

function mapCaseStudy(row: CaseStudyRow): AdminCaseStudyItem {
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

function mapExpertise(row: TechnicalExpertiseRow): AdminTechnicalExpertiseItem {
  return {
    id: row.id,
    category: row.category,
    skill: row.skill,
    proficiency: row.proficiency,
    sortOrder: row.sort_order,
  };
}

function mapTools(row: ToolsAndTechnologyRow): AdminToolsItem {
  return {
    id: row.id,
    category: row.category,
    name: row.name,
    sortOrder: row.sort_order,
  };
}

function mapFooter(row: FooterRow): AdminFooterContent {
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

function mapContactSubmission(row: ContactSubmissionRow): AdminContactSubmissionItem {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    subject: row.subject,
    message: row.message,
    ipAddress: row.ip_address,
    forwardedFor: row.forwarded_for,
    userAgent: row.user_agent,
    referer: row.referer,
    origin: row.origin,
    host: row.host,
    acceptLanguage: row.accept_language,
    requestPath: row.request_path,
    honeypotTriggered: row.honeypot_triggered,
    emailStatus: row.email_status,
    emailError: row.email_error,
    emailProviderId: row.email_provider_id,
    emailTo: row.email_to,
    emailFrom: row.email_from,
    emailSubject: row.email_subject,
    createdAt: row.created_at,
    emailSentAt: row.email_sent_at,
  };
}

function mapContactRateLimitEvent(
  row: ContactRateLimitEventRow,
): AdminContactRateLimitEventItem {
  return {
    id: row.id,
    clientKey: row.client_key,
    ipAddress: row.ip_address,
    forwardedFor: row.forwarded_for,
    userAgent: row.user_agent,
    referer: row.referer,
    origin: row.origin,
    host: row.host,
    acceptLanguage: row.accept_language,
    requestPath: row.request_path,
    attemptCount: row.attempt_count,
    maxRequests: row.max_requests,
    windowMs: row.window_ms,
    resetAt: row.reset_at,
    remainingMs: row.remaining_ms,
    name: row.name,
    email: row.email,
    subject: row.subject,
    messagePreview: row.message_preview,
    messageLength: row.message_length,
    createdAt: row.created_at,
  };
}

async function requireData<T>(
  label: string,
  result: { data: T | null; error: { message: string } | null },
): Promise<T> {
  if (result.error) {
    throw new Error(`Failed to load ${label}: ${result.error.message}`);
  }

  if (result.data === null) {
    throw new Error(`Failed to load ${label}: no data`);
  }

  return result.data;
}

export async function getAdminHomepage(): Promise<AdminHomepageContent> {
  const supabase = await createClient();
  const result = await supabase.from('homepage').select('*').limit(1).single();
  const row = await requireData('homepage', result);
  return mapHomepage(row as HomepageRow);
}

export async function getAdminNavLinks(): Promise<AdminNavLinkItem[]> {
  const supabase = await createClient();
  const result = await supabase
    .from('nav_links')
    .select('*')
    .order('sort_order', { ascending: true });
  const rows = await requireData('nav links', result);
  return (rows as NavLinkRow[]).map(mapNav);
}

export async function getAdminSocialLinks(): Promise<AdminSocialLinkItem[]> {
  const supabase = await createClient();
  const result = await supabase
    .from('social_links')
    .select('*')
    .order('sort_order', { ascending: true });
  const rows = await requireData('social links', result);
  return (rows as SocialLinkRow[]).map(mapSocial);
}

export async function getAdminWorkedWith(): Promise<AdminWorkedWithItem[]> {
  const supabase = await createClient();
  const result = await supabase
    .from('worked_with')
    .select('*')
    .order('sort_order', { ascending: true });
  const rows = await requireData('worked with', result);
  return (rows as WorkedWithRow[]).map(mapWorkedWith);
}

export async function getAdminProfessionalJourney(): Promise<AdminProfessionalJourneyItem[]> {
  const supabase = await createClient();
  const result = await supabase
    .from('professional_journey')
    .select('*')
    .order('sort_order', { ascending: true });
  const rows = await requireData('professional journey', result);
  return (rows as ProfessionalJourneyRow[]).map(mapJourney);
}

export async function getAdminEducation(): Promise<AdminEducationItem[]> {
  const supabase = await createClient();
  const result = await supabase
    .from('education')
    .select('*')
    .order('sort_order', { ascending: true });
  const rows = await requireData('education', result);
  return (rows as EducationRow[]).map(mapEducation);
}

export async function getAdminBlogPosts(): Promise<AdminBlogPostItem[]> {
  const supabase = await createClient();
  const result = await supabase
    .from('blog_posts')
    .select('*')
    .order('sort_order', { ascending: true });
  const rows = await requireData('blog posts', result);
  return (rows as BlogPostRow[]).map(mapBlogPost);
}

export async function getAdminCaseStudies(): Promise<AdminCaseStudyItem[]> {
  const supabase = await createClient();
  const result = await supabase
    .from('case_studies')
    .select('*')
    .order('sort_order', { ascending: true });
  const rows = await requireData('case studies', result);
  return (rows as CaseStudyRow[]).map(mapCaseStudy);
}

export async function getAdminTechnicalExpertise(): Promise<AdminTechnicalExpertiseItem[]> {
  const supabase = await createClient();
  const result = await supabase
    .from('technical_expertise')
    .select('*')
    .order('sort_order', { ascending: true });
  const rows = await requireData('technical expertise', result);
  return (rows as TechnicalExpertiseRow[]).map(mapExpertise);
}

export async function getAdminToolsAndTechnology(): Promise<AdminToolsItem[]> {
  const supabase = await createClient();
  const result = await supabase
    .from('tools_and_technology')
    .select('*')
    .order('sort_order', { ascending: true });
  const rows = await requireData('tools and technology', result);
  return (rows as ToolsAndTechnologyRow[]).map(mapTools);
}

export async function getAdminFooter(): Promise<AdminFooterContent> {
  const supabase = await createClient();
  const footerResult = await supabase.from('footer').select('*').limit(1).single();
  const footerRow = await requireData('footer', footerResult);
  return mapFooter(footerRow as FooterRow);
}

export function getAdminContactDeliverySettings(): AdminContactDeliverySettings {
  return {
    toEmail: process.env.CONTACT_TO_EMAIL?.trim() || null,
    fromEmail: process.env.CONTACT_FROM_EMAIL?.trim() || DEFAULT_FROM_EMAIL,
    resendConfigured: Boolean(process.env.RESEND_API_KEY?.trim()),
    challengeSecretConfigured: Boolean(process.env.CONTACT_CHALLENGE_SECRET?.trim()),
    rateLimitMaxRequests: CONTACT_RATE_LIMIT_MAX_REQUESTS,
    rateLimitWindowMs: CONTACT_RATE_LIMIT_WINDOW_MS,
  };
}

export async function getAdminContactSubmissions(): Promise<AdminContactSubmissionItem[]> {
  const admin = createAdminClient();
  const result = await admin
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(CONTACT_ADMIN_LIST_LIMIT);
  const rows = await requireData('contact submissions', result);
  return (rows as ContactSubmissionRow[]).map(mapContactSubmission);
}

export async function getAdminContactRateLimitEvents(): Promise<
  AdminContactRateLimitEventItem[]
> {
  const admin = createAdminClient();
  const result = await admin
    .from('contact_rate_limit_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(CONTACT_ADMIN_LIST_LIMIT);
  const rows = await requireData('contact rate limit events', result);
  return (rows as ContactRateLimitEventRow[]).map(mapContactRateLimitEvent);
}
