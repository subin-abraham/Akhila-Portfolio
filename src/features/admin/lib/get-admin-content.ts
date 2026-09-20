import { createClient } from '@/lib/supabase/server';
import type {
  BlogPostRow,
  CaseStudyRow,
  EducationRow,
  FooterLinkRow,
  FooterRow,
  HomepageRow,
  HomepageSectionRow,
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
  AdminEducationItem,
  AdminFooterContent,
  AdminFooterLinkItem,
  AdminHomepageContent,
  AdminHomepageSection,
  AdminNavLinkItem,
  AdminProfessionalJourneyItem,
  AdminSocialLinkItem,
  AdminTechnicalExpertiseItem,
  AdminToolsItem,
  AdminWorkedWithItem,
} from '@/types/components/admin-content';

function mapHomepage(row: HomepageRow): AdminHomepageContent {
  return {
    id: row.id,
    fullName: row.full_name,
    intro: row.intro,
    ctaLabel: row.cta_label,
    ctaHref: row.cta_href,
  };
}

function mapSection(row: HomepageSectionRow): AdminHomepageSection {
  return {
    id: row.id,
    sectionKey: row.section_key,
    eyebrow: row.eyebrow,
    title: row.title,
    accentTitle: row.accent_title,
    description: row.description,
    highlightTarget: row.highlight_target,
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
    logoUrl: row.logo_url,
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

function mapFooterLink(row: FooterLinkRow): AdminFooterLinkItem {
  return {
    id: row.id,
    columnKey: row.column_key,
    columnTitle: row.column_title,
    label: row.label,
    href: row.href,
    sortOrder: row.sort_order,
    columnSortOrder: row.column_sort_order,
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

export async function getAdminSections(): Promise<AdminHomepageSection[]> {
  const supabase = await createClient();
  const result = await supabase
    .from('homepage_sections')
    .select('*')
    .order('section_key', { ascending: true });
  const rows = await requireData('homepage sections', result);
  return (rows as HomepageSectionRow[]).map(mapSection);
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

export async function getAdminFooter(): Promise<{
  content: AdminFooterContent;
  links: AdminFooterLinkItem[];
}> {
  const supabase = await createClient();
  const [footerResult, linksResult] = await Promise.all([
    supabase.from('footer').select('*').limit(1).single(),
    supabase
      .from('footer_links')
      .select('*')
      .order('column_sort_order', { ascending: true })
      .order('sort_order', { ascending: true }),
  ]);

  const footerRow = await requireData('footer', footerResult);
  const linkRows = await requireData('footer links', linksResult);

  return {
    content: mapFooter(footerRow as FooterRow),
    links: (linkRows as FooterLinkRow[]).map(mapFooterLink),
  };
}
