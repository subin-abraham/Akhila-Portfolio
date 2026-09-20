import type { SocialPlatform } from '@/features/home/lib/social-platforms';

export type { SocialPlatform };

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  href: string;
  sortOrder: number;
}
