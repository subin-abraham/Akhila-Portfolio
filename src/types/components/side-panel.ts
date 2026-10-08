import type { HomepageContent } from '@/types/home/homepage';
import type { NavLink } from '@/types/home/nav';
import type { SocialLink } from '@/types/home/social';

export interface SidePanelProps {
  homepage: HomepageContent;
  navLinks: NavLink[];
  socialLinks: SocialLink[];
  locationLabel?: string;
  roleLabel: string;
  themeToggleEnabled?: boolean;
}
