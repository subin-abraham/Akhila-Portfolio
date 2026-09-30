export const SOCIAL_PLATFORM_OPTIONS = [
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'twitter', label: 'X (Twitter)' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'github', label: 'GitHub' },
  { id: 'behance', label: 'Behance' },
  { id: 'dribbble', label: 'Dribbble' },
  { id: 'medium', label: 'Medium' },
  { id: 'pinterest', label: 'Pinterest' },
  { id: 'threads', label: 'Threads' },
  { id: 'discord', label: 'Discord' },
  { id: 'telegram', label: 'Telegram' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'reddit', label: 'Reddit' },
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORM_OPTIONS)[number]['id'];

export const SOCIAL_PLATFORM_IDS: SocialPlatform[] = SOCIAL_PLATFORM_OPTIONS.map(
  (option) => option.id,
);

export const SOCIAL_PLATFORM_LABELS: Record<SocialPlatform, string> =
  Object.fromEntries(
    SOCIAL_PLATFORM_OPTIONS.map((option) => [option.id, option.label]),
  ) as Record<SocialPlatform, string>;

export function isSocialPlatform(value: string): value is SocialPlatform {
  return SOCIAL_PLATFORM_IDS.includes(value as SocialPlatform);
}

export function getSocialPlatformLabel(platform: SocialPlatform): string {
  return SOCIAL_PLATFORM_LABELS[platform];
}
