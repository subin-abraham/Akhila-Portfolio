import type { HomepageSectionContent } from '@/types/home/homepage-section';
import type { TechnicalExpertiseCategory } from '@/types/home/technical-expertise';

export interface TechnicalExpertiseSectionProps {
  section: HomepageSectionContent;
  categories: TechnicalExpertiseCategory[];
}
