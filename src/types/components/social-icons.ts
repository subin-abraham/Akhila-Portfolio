import type { SocialLink, SocialPlatform } from '@/types/home/social';

export interface SocialIconsProps {
  links: SocialLink[];
}

export interface SocialIconProps {
  platform: SocialPlatform;
}
