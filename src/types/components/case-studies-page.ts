import type { CaseStudy } from '@/types/home/case-study';
import type { FooterData } from '@/types/home/footer';
import type { HomepageSectionContent } from '@/types/home/homepage-section';
import type { NavLink } from '@/types/home/nav';
import type { SocialLink } from '@/types/home/social';

export interface CaseStudiesPageData {
  section: HomepageSectionContent;
  items: CaseStudy[];
  navLinks: NavLink[];
  socialLinks: SocialLink[];
  footer: FooterData;
}

export interface CaseStudiesPageProps {
  data: CaseStudiesPageData;
}
