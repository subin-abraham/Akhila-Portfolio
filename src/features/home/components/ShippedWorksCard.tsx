import Link from 'next/link';

import { resolveSiteHref } from '@/features/home/lib/resolve-site-href';
import type { ShippedWorksCardProps } from '@/types/components/shipped-works-card';

const DEFAULT_HREF = '/shipped';

export function ShippedWorksCard({
  href = DEFAULT_HREF,
  variant = 'default',
}: ShippedWorksCardProps) {
  const resolvedHref = resolveSiteHref(href);
  const isInset = variant === 'inset';

  return (
    <Link
      id="shipped-works-card"
      href={resolvedHref}
      title="Explore recent work"
      aria-label="A few things I've shipped — explore recent work"
      className={
        isInset
          ? 'shipped-works-card shipped-works-card-inset'
          : 'shipped-works-card home-bento-card'
      }
    >
      <div className="shipped-works-card-copy">
        <h3 className="bento-card-title shipped-works-card-title">
          A few things I&apos;ve shipped
        </h3>
        <p className="shipped-works-card-hint">Explore recent work</p>
      </div>
      <span className="shipped-works-card-arrow" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <path
            d="M7 17L17 7M17 7H9M17 7V15"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </Link>
  );
}
