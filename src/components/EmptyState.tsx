import type { EmptyStateProps } from '@/types/components/empty-state';

export function EmptyState({
  title,
  description,
  className = '',
}: EmptyStateProps) {
  const rootClassName = [
    'flex flex-col items-center justify-center rounded-2xl border border-dashed border-home-input-border bg-home-surface px-6 py-12 text-center sm:px-10 sm:py-14',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div role="status" className={rootClassName}>
      <p className="font-display text-lg font-semibold tracking-tight text-home-heading sm:text-xl">
        {title}
      </p>
      {description ? (
        <p className="mt-2 max-w-md text-sm leading-6 text-home-muted sm:text-base sm:leading-7">
          {description}
        </p>
      ) : null}
    </div>
  );
}
