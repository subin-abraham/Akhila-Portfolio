import type { EducationItem } from '@/types/home/education';
import type { HomepageSectionContent } from '@/types/home/homepage-section';

export interface EducationSectionProps {
  section: HomepageSectionContent;
  items: EducationItem[];
}
