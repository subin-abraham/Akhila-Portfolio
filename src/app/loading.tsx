export default function HomeLoading() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-home-bg">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-16 px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
        <div className="h-14 animate-pulse rounded-xl bg-white/5" />
        <div className="grid flex-1 items-center gap-12 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="h-14 max-w-md animate-pulse rounded-lg bg-white/5" />
            <div className="h-24 max-w-lg animate-pulse rounded-lg bg-white/5" />
            <div className="h-11 w-40 animate-pulse rounded-lg bg-white/5" />
          </div>
          <div className="mx-auto aspect-square w-full max-w-sm animate-pulse rounded-full bg-white/5" />
        </div>
        <div className="h-20 animate-pulse rounded-lg bg-white/5" />
      </div>
    </div>
  );
}
