import { createClient } from '@/lib/supabase/server';
import type { CaseStudiesPageData } from '@/types/components/case-studies-page';
import type {
  CaseStudy,
  CaseStudyRow,
  HomepageSectionContent,
  HomepageSectionRow,
} from '@/types/home';
import type { SectionHighlightTarget } from '@/types/home/homepage-section';

const CASE_STUDIES_SECTION_KEY = 'case_studies';

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

function mapCaseStudy(row: CaseStudyRow): CaseStudy {
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

export async function getCaseStudiesPageData(): Promise<CaseStudiesPageData> {
  const supabase = await createClient();

  const [itemsResult, sectionsResult] = await Promise.all([
    supabase
      .from('case_studies')
      .select('*')
      .order('sort_order', { ascending: true }),
    supabase
      .from('homepage_sections')
      .select('*')
      .eq('section_key', CASE_STUDIES_SECTION_KEY),
  ]);

  if (itemsResult.error) {
    throw new Error(
      `Failed to load case studies: ${itemsResult.error.message}`
    );
  }

  if (sectionsResult.error) {
    throw new Error(
      `Failed to load case studies section: ${sectionsResult.error.message}`
    );
  }

  const sectionRow = (sectionsResult.data as HomepageSectionRow[])[0];

  if (!sectionRow) {
    throw new Error(
      `Missing homepage section copy for "${CASE_STUDIES_SECTION_KEY}"`
    );
  }

  return {
    section: mapHomepageSection(sectionRow),
    items: (itemsResult.data as CaseStudyRow[]).map(mapCaseStudy),
  };
}
