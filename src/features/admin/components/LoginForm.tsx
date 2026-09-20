'use client';

import { useActionState } from 'react';

import { signInWithPassword } from '@/features/admin/lib/auth-actions';
import type { SignInState } from '@/types/components/login-form';

const INITIAL_STATE: SignInState = { error: null };

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(signInWithPassword, INITIAL_STATE);
  const hasError = Boolean(state.error);

  return (
    <form action={formAction} className="w-full max-w-sm space-y-5" noValidate>
      <div className="space-y-2">
        <label htmlFor="admin-login-email" className="block text-sm font-medium text-white">
          Email
        </label>
        <input
          id="admin-login-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={hasError}
          aria-describedby={hasError ? 'admin-login-error' : undefined}
          className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-home-muted focus:border-home-accent focus:ring-1 focus:ring-home-accent"
          placeholder="you@example.com"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="admin-login-password" className="block text-sm font-medium text-white">
          Password
        </label>
        <input
          id="admin-login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={hasError}
          aria-describedby={hasError ? 'admin-login-error' : undefined}
          className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-home-muted focus:border-home-accent focus:ring-1 focus:ring-home-accent"
          placeholder="Enter your password"
        />
      </div>

      <div id="admin-login-error" role="status" aria-live="polite" className="min-h-5 text-sm text-red-400">
        {state.error}
      </div>

      <button
        id="admin-login-submit"
        type="submit"
        title="Sign in"
        aria-label="Sign in"
        disabled={isPending}
        className="home-cta w-full rounded-lg bg-home-accent px-5 py-3 text-sm font-semibold text-home-ink transition disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
