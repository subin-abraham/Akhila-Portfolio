'use client';

import { useActionState, useId } from 'react';

import { useTrackPending } from '@/components/AppLoader';
import { MathChallengeField } from '@/components/MathChallengeField';
import { signInWithPassword } from '@/features/admin/lib/auth-actions';
import type { LoginFormProps, SignInState } from '@/types/components/login-form';
import type { MathChallengePublic } from '@/types/components/contact-section';

const INITIAL_STATE: SignInState = {
  error: null,
  email: null,
  challenge: null,
};

export function LoginForm({ challenge }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(signInWithPassword, INITIAL_STATE);
  useTrackPending(isPending, 'Signing in…');

  const activeChallenge: MathChallengePublic = state.challenge ?? challenge;
  const formKey = activeChallenge.token;
  const emailDefault = state.email ?? '';
  const hasError = Boolean(state.error);
  const errorId = useId();
  const submitLabel = isPending ? 'Signing in…' : 'Sign in';

  return (
    <form
      key={formKey}
      action={formAction}
      className="relative w-full max-w-sm space-y-5"
      noValidate
      aria-busy={isPending}
    >
      <div className="pointer-events-none absolute left-0 top-0 h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor="admin-login-company">Company</label>
        <input
          id="admin-login-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

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
          defaultValue={emailDefault}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
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
          aria-describedby={hasError ? errorId : undefined}
          className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-home-muted focus:border-home-accent focus:ring-1 focus:ring-home-accent"
          placeholder="Enter your password"
        />
      </div>

      <MathChallengeField
        key={activeChallenge.token}
        idPrefix="admin-login"
        challenge={activeChallenge}
        hasError={hasError}
        describedBy={hasError ? errorId : undefined}
      />

      <div
        id={errorId}
        role="status"
        aria-live="polite"
        className="min-h-5 text-sm text-red-400"
      >
        {state.error}
      </div>

      <button
        id="admin-login-submit"
        type="submit"
        title={submitLabel}
        aria-label={submitLabel}
        aria-busy={isPending}
        disabled={isPending}
        className="home-cta w-full cursor-pointer rounded-lg bg-home-accent px-5 py-3 text-sm font-semibold text-home-ink transition disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitLabel}
      </button>
    </form>
  );
}
