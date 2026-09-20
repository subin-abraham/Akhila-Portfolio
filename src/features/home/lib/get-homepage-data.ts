import { createClient } from '@/lib/supabase/server';
import type {
  EducationItem,
  EducationRow,
  FooterContent,
  FooterData,
  FooterLinkColumn,
  FooterLinkRow,
  FooterRow,
  HomepageContent,
  HomepageData,
  HomepageRow,
  HomepageSectionContent,
  HomepageSectionRow,
  NavLink,
  NavLinkRow,
  ProfessionalJourneyItem,
  ProfessionalJourneyRow,
  SocialLink,
  SocialLinkRow,
  TechnicalExpertiseCategory,
  TechnicalExpertiseRow,
  ToolsAndTechnologyCategory,
  ToolsAndTechnologyRow,
  WorkedWithItem,
  WorkedWithRow,
} from '@/types/home';
import type { SectionHighlightTarget } from '@/types/home/homepage-section';

const PROFESSIONAL_JOURNEY_SECTION_KEY = 'professional_journey';
const EDUCATION_SECTION_KEY = 'education';
const TECHNICAL_EXPERTISE_SECTION_KEY = 'technical_expertise';
const TOOLS_AND_TECHNOLOGY_SECTION_KEY = 'tools_and_technology';
const CONTACT_SECTION_KEY = 'contact';

function mapHomepage(row: HomepageRow): HomepageContent {
  return {
    id: row.id,
    fullName: row.full_name,
    intro: row.intro,
    ctaLabel: row.cta_label,
    ctaHref: row.cta_href,
  };
}

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

function requireSection(
  sections: HomepageSectionContent[],
  sectionKey: string
): HomepageSectionContent {
  const section = sections.find((item) => item.sectionKey === sectionKey);

  if (!section) {
    throw new Error(`Missing homepage section copy for "${sectionKey}"`);
  }

  return section;
}

const DEFAULT_CONTACT_SECTION: HomepageSectionContent = {
  id: 'contact-fallback',
  sectionKey: 'contact',
  eyebrow: 'Contact',
  title: 'Get in',
  accentTitle: 'Touch',
  description:
    'Have a project, collaboration, or role in mind? Send a note — I usually reply within a few days.',
  highlightTarget: 'accent',
};

function getSectionOrDefault(
  sections: HomepageSectionContent[],
  sectionKey: string,
  fallback: HomepageSectionContent
): HomepageSectionContent {
  return sections.find((item) => item.sectionKey === sectionKey) ?? fallback;
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

function mapWorkedWith(row: WorkedWithRow): WorkedWithItem {
  return {
    id: row.id,
    name: row.name,
    logoUrl: row.logo_url,
    sortOrder: row.sort_order,
  };
}

function mapProfessionalJourney(
  row: ProfessionalJourneyRow
): ProfessionalJourneyItem {
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

function mapEducation(row: EducationRow): EducationItem {
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

function groupTechnicalExpertise(
  rows: TechnicalExpertiseRow[]
): TechnicalExpertiseCategory[] {
  const categories: TechnicalExpertiseCategory[] = [];
  const categoryIndex = new Map<string, number>();

  for (const row of rows) {
    let index = categoryIndex.get(row.category);

    if (index === undefined) {
      index = categories.length;
      categoryIndex.set(row.category, index);
      categories.push({ category: row.category, skills: [] });
    }

    categories[index]?.skills.push({
      id: row.id,
      name: row.skill,
      proficiency: row.proficiency,
      sortOrder: row.sort_order,
    });
  }

  return categories;
}

function groupToolsAndTechnology(
  rows: ToolsAndTechnologyRow[]
): ToolsAndTechnologyCategory[] {
  const categories: ToolsAndTechnologyCategory[] = [];
  const categoryIndex = new Map<string, number>();

  for (const row of rows) {
    let index = categoryIndex.get(row.category);

    if (index === undefined) {
      index = categories.length;
      categoryIndex.set(row.category, index);
      categories.push({ category: row.category, items: [] });
    }

    categories[index]?.items.push({
      id: row.id,
      name: row.name,
      sortOrder: row.sort_order,
    });
  }

  return categories;
}

export async function getHomepageData(): Promise<HomepageData> {
  const supabase = await createClient();

  const [
    homepageResult,
    navResult,
    socialResult,
    workedWithResult,
    journeyResult,
    educationResult,
    expertiseResult,
    toolsResult,
    sectionsResult,
    footerResult,
    footerLinksResult,
  ] = await Promise.all([
    supabase.from('homepage').select('*').limit(1).single(),
    supabase.from('nav_links').select('*').order('sort_order', { ascending: true }),
    supabase
      .from('social_links')
      .select('*')
      .order('sort_order', { ascending: true }),
    supabase
      .from('worked_with')
      .select('*')
      .order('sort_order', { ascending: true }),
    supabase
      .from('professional_journey')
      .select('*')
      .order('sort_order', { ascending: true }),
    supabase
      .from('education')
      .select('*')
      .order('sort_order', { ascending: true }),
    supabase
      .from('technical_expertise')
      .select('*')
      .order('sort_order', { ascending: true }),
    supabase
      .from('tools_and_technology')
      .select('*')
      .order('sort_order', { ascending: true }),
    supabase.from('homepage_sections').select('*'),
    supabase.from('footer').select('*').limit(1).single(),
    supabase
      .from('footer_links')
      .select('*')
      .order('column_sort_order', { ascending: true })
      .order('sort_order', { ascending: true }),
  ]);

  if (homepageResult.error) {
    throw new Error(`Failed to load homepage: ${homepageResult.error.message}`);
  }

  if (navResult.error) {
    throw new Error(`Failed to load nav links: ${navResult.error.message}`);
  }

  if (socialResult.error) {
    throw new Error(`Failed to load social links: ${socialResult.error.message}`);
  }

  if (workedWithResult.error) {
    throw new Error(
      `Failed to load worked with: ${workedWithResult.error.message}`
    );
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

  if (expertiseResult.error) {
    throw new Error(
      `Failed to load technical expertise: ${expertiseResult.error.message}`
    );
  }

  if (toolsResult.error) {
    throw new Error(
      `Failed to load tools and technology: ${toolsResult.error.message}`
    );
  }

  if (sectionsResult.error) {
    throw new Error(
      `Failed to load homepage sections: ${sectionsResult.error.message}`
    );
  }

  if (footerResult.error) {
    throw new Error(`Failed to load footer: ${footerResult.error.message}`);
  }

  if (footerLinksResult.error) {
    throw new Error(
      `Failed to load footer links: ${footerLinksResult.error.message}`
    );
  }

  const sections = (sectionsResult.data as HomepageSectionRow[]).map(
    mapHomepageSection
  );

  return {
    homepage: mapHomepage(homepageResult.data as HomepageRow),
    navLinks: (navResult.data as NavLinkRow[]).map(mapNavLink),
    socialLinks: (socialResult.data as SocialLinkRow[]).map(mapSocialLink),
    workedWith: (workedWithResult.data as WorkedWithRow[]).map(mapWorkedWith),
    professionalJourney: (journeyResult.data as ProfessionalJourneyRow[]).map(
      mapProfessionalJourney
    ),
    professionalJourneySection: requireSection(
      sections,
      PROFESSIONAL_JOURNEY_SECTION_KEY
    ),
    education: (educationResult.data as EducationRow[]).map(mapEducation),
    educationSection: requireSection(sections, EDUCATION_SECTION_KEY),
    technicalExpertise: groupTechnicalExpertise(
      expertiseResult.data as TechnicalExpertiseRow[]
    ),
    technicalExpertiseSection: requireSection(
      sections,
      TECHNICAL_EXPERTISE_SECTION_KEY
    ),
    toolsAndTechnology: groupToolsAndTechnology(
      toolsResult.data as ToolsAndTechnologyRow[]
    ),
    toolsAndTechnologySection: requireSection(
      sections,
      TOOLS_AND_TECHNOLOGY_SECTION_KEY
    ),
    contactSection: getSectionOrDefault(
      sections,
      CONTACT_SECTION_KEY,
      DEFAULT_CONTACT_SECTION
    ),
    footer: mapFooterData(
      footerResult.data as FooterRow,
      footerLinksResult.data as FooterLinkRow[]
    ),
  };
}
