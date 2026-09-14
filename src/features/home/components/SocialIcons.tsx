import type { SocialIconProps, SocialIconsProps } from '@/types/components/social-icons';
import type { SocialPlatform } from '@/types/home/social';

function SocialIcon({ platform }: SocialIconProps) {
  if (platform === 'linkedin') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4V8.5zM8.5 8.5h3.8v2h.1c.5-1 1.8-2.1 3.8-2.1 4 0 4.8 2.7 4.8 6.1V23h-4v-6.6c0-1.6 0-3.6-2.2-3.6s-2.5 1.7-2.5 3.5V23h-4V8.5z" />
      </svg>
    );
  }

  if (platform === 'behance') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M22 7h-7V5h7v2zm-9.4 5.5c0-2.4-1.5-4-4-4H2v9.9h6.7c2.4 0 4.2-1.4 4.2-3.9 0-1.6-.8-2.8-2.1-3.3 1.1-.5 1.8-1.5 1.8-2.7zM5.2 10.3h2.3c1.1 0 1.7.5 1.7 1.4s-.6 1.4-1.7 1.4H5.2v-2.8zm2.6 6.4H5.2v-3h2.6c1.3 0 2 .6 2 1.5s-.7 1.5-2 1.5zM16.8 9.4c-3 0-5 2.1-5 5.1 0 3.1 2 5.2 5.1 5.2 2.2 0 3.7-.9 4.5-2.5l-2.1-1c-.4.9-1.3 1.4-2.4 1.4-1.5 0-2.5-1-2.7-2.6h7.5c.1-.4.1-.7.1-1.1 0-3-1.9-5.5-4.9-5.5zm-2.5 4.1c.3-1.4 1.2-2.3 2.5-2.3 1.4 0 2.2.9 2.4 2.3h-4.9z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M18.2 2H21l-6.6 7.5L22.5 22h-6.3l-4.4-6.5L6.2 22H3.4l7-8L1.5 2h6.5l4 6L18.2 2zm-1.1 18h1.7L7 3.9H5.2L17.1 20z" />
    </svg>
  );
}

const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  linkedin: 'LinkedIn',
  behance: 'Behance',
  twitter: 'Twitter',
};

export function SocialIcons({ links }: SocialIconsProps) {
  return (
    <ul className="flex items-center gap-4">
      {links.map((link) => {
        const label = PLATFORM_LABELS[link.platform];

        return (
          <li key={link.id}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className="inline-flex h-8 w-8 items-center justify-center text-home-muted transition-colors hover:text-white"
            >
              <SocialIcon platform={link.platform} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
