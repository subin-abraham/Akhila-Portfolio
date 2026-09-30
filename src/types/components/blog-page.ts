import type { BlogPost } from '@/types/home/blog';
import type { FooterData } from '@/types/home/footer';
import type { HomepageSectionContent } from '@/types/home/homepage-section';
import type { NavLink } from '@/types/home/nav';
import type { SocialLink } from '@/types/home/social';

export interface BlogPageData {
  section: HomepageSectionContent;
  posts: BlogPost[];
  navLinks: NavLink[];
  socialLinks: SocialLink[];
  footer: FooterData;
}

export interface BlogPageProps {
  data: BlogPageData;
}
