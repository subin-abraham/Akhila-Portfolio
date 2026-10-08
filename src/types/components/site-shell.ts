import type { FooterData } from '@/types/home/footer';
import type { HomepageContent } from '@/types/home/homepage';
import type { NavLink } from '@/types/home/nav';
import type { SiteThemeMode } from '@/types/home/site-settings';
import type { SocialLink } from '@/types/home/social';
import type { ReactNode } from 'react';

export interface SiteShellData {
  homepage: HomepageContent;
  navLinks: NavLink[];
  socialLinks: SocialLink[];
  footer: FooterData;
  locationLabel?: string;
  roleLabel: string;
  themeToggleEnabled: boolean;
  defaultTheme: SiteThemeMode;
}

export interface SiteShellProps {
  data: SiteShellData;
  children: ReactNode;
}
