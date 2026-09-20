-- Expand social_links platforms to major networks used by the admin lookup.

alter table public.social_links
  drop constraint if exists social_links_platform_check;

alter table public.social_links
  add constraint social_links_platform_check check (
    platform in (
      'linkedin',
      'instagram',
      'facebook',
      'youtube',
      'twitter',
      'tiktok',
      'github',
      'behance',
      'dribbble',
      'medium',
      'pinterest',
      'threads',
      'discord',
      'telegram',
      'whatsapp',
      'reddit'
    )
  );
