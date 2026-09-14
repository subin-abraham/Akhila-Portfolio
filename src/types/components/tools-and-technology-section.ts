import type { HomepageSectionContent } from '@/types/home/homepage-section';
import type { ToolsAndTechnologyCategory } from '@/types/home/tools-and-technology';

export interface ToolsAndTechnologySectionProps {
  section: HomepageSectionContent;
  categories: ToolsAndTechnologyCategory[];
}
