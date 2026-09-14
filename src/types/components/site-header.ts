import type { NavLink } from '@/types/home/nav';
import type { SocialLink } from '@/types/home/social';

export interface SiteHeaderProps {
  navLinks: NavLink[];
  socialLinks: SocialLink[];
}
