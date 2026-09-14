import type { EducationItem } from '@/types/home/education';
import type { FooterData } from '@/types/home/footer';
import type { HomepageSectionContent } from '@/types/home/homepage-section';
import type { NavLink } from '@/types/home/nav';
import type { ProfessionalJourneyItem } from '@/types/home/professional-journey';
import type { SocialLink } from '@/types/home/social';
import type { TechnicalExpertiseCategory } from '@/types/home/technical-expertise';
import type { ToolsAndTechnologyCategory } from '@/types/home/tools-and-technology';
import type { WorkedWithItem } from '@/types/home/worked-with';

export interface HomepageContent {
  id: string;
  fullName: string;
  intro: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface HomepageData {
  homepage: HomepageContent;
  navLinks: NavLink[];
  socialLinks: SocialLink[];
  workedWith: WorkedWithItem[];
  professionalJourney: ProfessionalJourneyItem[];
  professionalJourneySection: HomepageSectionContent;
  education: EducationItem[];
  educationSection: HomepageSectionContent;
  technicalExpertise: TechnicalExpertiseCategory[];
  technicalExpertiseSection: HomepageSectionContent;
  toolsAndTechnology: ToolsAndTechnologyCategory[];
  toolsAndTechnologySection: HomepageSectionContent;
  footer: FooterData;
}
