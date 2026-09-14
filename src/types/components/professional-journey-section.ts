import type { HomepageSectionContent } from '@/types/home/homepage-section';
import type { ProfessionalJourneyItem } from '@/types/home/professional-journey';

export interface ProfessionalJourneySectionProps {
  section: HomepageSectionContent;
  items: ProfessionalJourneyItem[];
}
