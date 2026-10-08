import { EmptyState } from '@/components/EmptyState';

export function ShippedPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 pb-8 pt-8 sm:px-8 sm:pb-10 sm:pt-10 lg:px-10 lg:pt-12">
      <div className="flex flex-col gap-8 sm:gap-10">
        <header className="flex flex-col gap-3">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-home-accent">
            Recent work
          </p>
          <h1
            id="shipped-heading"
            className="font-display text-3xl font-semibold tracking-tight text-home-heading sm:text-4xl"
          >
            A few things I&apos;ve shipped
          </h1>
          <p className="max-w-2xl text-base leading-7 text-home-muted sm:text-lg sm:leading-8">
            Selected builds, boards, and products I&apos;ve taken from idea to
            something real.
          </p>
        </header>

        <EmptyState
          title="Coming soon"
          description="This collection is still being put together. Check back shortly for a closer look at recent work."
        />
      </div>
    </div>
  );
}
