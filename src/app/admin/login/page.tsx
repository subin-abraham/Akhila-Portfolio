import { LoginForm } from '@/features/admin/components/LoginForm';
import { redirectIfAuthenticated } from '@/features/admin/lib/require-user';

export default async function AdminLoginPage() {
  await redirectIfAuthenticated();

  return (
    <main className="relative flex min-h-full flex-1 flex-col items-center justify-center overflow-hidden px-6 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgb(182_243_75_/_0.12),transparent_55%)]"
      />
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center">
        <p className="text-sm font-medium tracking-wide text-home-accent uppercase">Admin</p>
        <h1 className="font-display mt-3 text-3xl font-semibold text-white">Sign in</h1>
        <p className="mt-3 mb-8 text-center text-sm text-home-muted">
          Use your Supabase account credentials to continue.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
