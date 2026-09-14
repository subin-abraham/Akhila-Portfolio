'use client';

import type { HomeErrorProps } from '@/types/components/home-error';

export default function HomeError({ error, reset }: HomeErrorProps) {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-home-bg px-6 text-center text-white">
      <h1 className="font-display text-2xl font-semibold">Unable to load portfolio</h1>
      <p className="mt-3 max-w-md text-sm text-home-muted">
        {error.message || 'Something went wrong while loading homepage content.'}
      </p>
      <button
        id="home-error-retry"
        type="button"
        title="Try again"
        aria-label="Try again"
        onClick={reset}
        className="home-cta mt-6 rounded-lg bg-home-accent px-5 py-3 text-sm font-semibold text-home-ink"
      >
        Try again
      </button>
    </div>
  );
}
