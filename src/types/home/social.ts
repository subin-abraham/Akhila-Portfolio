export type SocialPlatform = 'linkedin' | 'behance' | 'twitter';

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  href: string;
  sortOrder: number;
}
