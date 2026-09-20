import { SocialIcons } from '@/features/home/components/SocialIcons';
import { resolveSiteHref } from '@/features/home/lib/resolve-site-href';
import type { SiteFooterProps } from '@/types/components/site-footer';

function FooterMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="site-footer-mark-icon"
    >
      <path
        fill="currentColor"
        d="M12 2.5 13.2 9.2 19.5 7.5 14.8 12l4.7 4.5-6.3-1.7L12 21.5l-1.2-6.7-6.3 1.7L9.2 12 4.5 7.5l6.3 1.7L12 2.5Z"
      />
    </svg>
  );
}

function FooterTerrain() {
  return (
    <svg
      className="site-footer-terrain-svg"
      viewBox="0 0 1440 220"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="footer-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(11 11 11)" stopOpacity="0" />
          <stop offset="35%" stopColor="rgb(18 22 12)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="rgb(22 28 14)" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="footer-hill-a" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(72 98 28)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="rgb(28 36 16)" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="footer-hill-b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(102 140 36)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="rgb(24 30 14)" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="footer-trace" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgb(182 243 75)" stopOpacity="0" />
          <stop offset="18%" stopColor="rgb(182 243 75)" stopOpacity="0.35" />
          <stop offset="50%" stopColor="rgb(182 243 75)" stopOpacity="0.7" />
          <stop offset="82%" stopColor="rgb(182 243 75)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="rgb(182 243 75)" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="1440" height="220" fill="url(#footer-sky)" />

      <path
        d="M0 148 C120 132 210 118 320 128 C450 142 520 168 660 158 C820 146 910 112 1040 122 C1160 132 1280 154 1440 142 L1440 220 L0 220 Z"
        fill="url(#footer-hill-a)"
      />
      <path
        d="M0 176 C160 162 280 148 420 158 C560 170 640 188 780 178 C940 166 1060 148 1200 158 C1320 166 1380 178 1440 172 L1440 220 L0 220 Z"
        fill="url(#footer-hill-b)"
      />

      <g
        fill="none"
        stroke="url(#footer-trace)"
        strokeWidth="1.25"
        strokeLinecap="round"
      >
        <path d="M40 168 H220 L260 148 H380 L420 168 H560" />
        <path d="M520 182 H690 L730 162 H860 L900 182 H1080" />
        <path d="M980 156 H1140 L1180 136 H1300 L1340 156 H1420" />
        <path d="M180 188 V160 H250 V140" />
        <path d="M760 198 V170 H840 V150" />
        <path d="M1220 190 V162 H1290 V142" />
      </g>

      <g fill="rgb(182 243 75)">
        <circle cx="260" cy="148" r="3.5" opacity="0.85" />
        <circle cx="420" cy="168" r="2.5" opacity="0.55" />
        <circle cx="730" cy="162" r="3.5" opacity="0.8" />
        <circle cx="900" cy="182" r="2.5" opacity="0.5" />
        <circle cx="1180" cy="136" r="3.5" opacity="0.85" />
        <circle cx="1340" cy="156" r="2.5" opacity="0.55" />
      </g>

      <g
        fill="rgb(182 243 75 / 0.18)"
        stroke="rgb(182 243 75 / 0.45)"
        strokeWidth="1"
      >
        <rect x="300" y="118" width="54" height="28" rx="3" />
        <rect x="790" y="128" width="46" height="24" rx="3" />
        <rect x="1120" y="108" width="58" height="30" rx="3" />
      </g>

      <g fill="rgb(182 243 75 / 0.55)">
        <rect x="308" y="124" width="8" height="4" rx="1" />
        <rect x="322" y="124" width="8" height="4" rx="1" />
        <rect x="336" y="124" width="8" height="4" rx="1" />
        <rect x="798" y="134" width="7" height="3.5" rx="1" />
        <rect x="811" y="134" width="7" height="3.5" rx="1" />
        <rect x="824" y="134" width="7" height="3.5" rx="1" />
        <rect x="1128" y="114" width="8" height="4" rx="1" />
        <rect x="1142" y="114" width="8" height="4" rx="1" />
        <rect x="1156" y="114" width="8" height="4" rx="1" />
      </g>
    </svg>
  );
}

export function SiteFooter({ footer, socialLinks }: SiteFooterProps) {
  const year = new Date().getFullYear();
  const { content, columns } = footer;

  return (
    <footer className="site-footer mt-auto">
      <div className="site-footer-inner">
        <div className="site-footer-grid">
          <div className="site-footer-brand">
            <p className="site-footer-mark">
              <FooterMark />
              <span className="font-display text-lg font-semibold tracking-tight text-white">
                {content.brandName}
              </span>
            </p>
            <p className="mt-4 max-w-sm text-sm leading-6 text-home-muted">
              {content.tagline}
            </p>
            <div className="mt-5">
              <SocialIcons links={socialLinks} />
            </div>
          </div>

          <div className="site-footer-columns">
            {columns.map((column) => (
              <nav
                key={column.columnKey}
                aria-label={column.title}
                className="site-footer-column"
              >
                <p className="site-footer-column-title">{column.title}</p>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {column.links.map((link) => {
                    const href = resolveSiteHref(link.href);
                    const isExternal = href.startsWith('http');

                    return (
                      <li key={link.id}>
                        <a
                          href={href}
                          {...(isExternal
                            ? {
                                target: '_blank',
                                rel: 'noopener noreferrer',
                              }
                            : undefined)}
                          className="text-sm text-white/75 transition-colors hover:text-home-accent"
                        >
                          {link.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="site-footer-bottom">
          <p className="text-sm text-home-muted">
            © {year} {content.copyrightName}.
          </p>
          <a
            id="footer-cta"
            href={resolveSiteHref(content.ctaHref)}
            title={content.ctaLabel}
            aria-label={content.ctaLabel}
            className="inline-flex items-center gap-2 text-sm font-medium text-home-accent transition-colors hover:text-white"
          >
            <span>{content.ctaLabel}</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      <div className="site-footer-terrain" aria-hidden="true">
        <FooterTerrain />
      </div>
    </footer>
  );
}
