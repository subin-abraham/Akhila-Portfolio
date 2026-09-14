import type { FooterData, FooterLinkColumn } from '@/types/home/footer';
import type { SocialLink } from '@/types/home/social';

export interface SiteFooterProps {
  footer: FooterData;
  socialLinks: SocialLink[];
}
