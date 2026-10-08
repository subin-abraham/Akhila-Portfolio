import type { CaseStudy } from '@/types/home/case-study';
import type { HomepageSectionContent } from '@/types/home/homepage-section';

export interface CaseStudiesPageData {
  section: HomepageSectionContent;
  items: CaseStudy[];
}

export interface CaseStudiesPageProps {
  data: CaseStudiesPageData;
}
