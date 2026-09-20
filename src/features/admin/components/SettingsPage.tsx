'use client';

import { useActionState, useEffect, useRef } from 'react';

import { useAdminToast } from '@/features/admin/components/AdminToast';
import {
  registerUser,
  resetUserPassword,
} from '@/features/admin/lib/auth-actions';
import type {
  AdminActionState,
  AdminAuthFormProps,
  SettingsPageProps,
} from '@/types/components/admin-shell';

const INITIAL_STATE: AdminActionState = { error: null, success: null };

const FIELD_CLASS =
  'w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-home-muted focus:border-home-accent focus:ring-1 focus:ring-home-accent';

const READ_ONLY_FIELD_CLASS =
  'w-full cursor-not-allowed rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-home-muted outline-none';

function AdminAuthForm({
  formId,
  title,
  description,
  emailLabel,
  passwordLabel,
  confirmLabel,
  submitLabel,
  pendingLabel,
  emailValue,
  emailReadOnly = false,
  action,
}: AdminAuthFormProps) {
  const toast = useAdminToast();
  const [state, formAction, isPending] = useActionState(action, INITIAL_STATE);
  const lastToastKey = useRef<string | null>(null);
  const hasError = Boolean(state.error);
  const statusId = `${formId}-status`;

  useEffect(() => {
    if (isPending) {
      lastToastKey.current = null;
    }
  }, [isPending]);

  useEffect(() => {
    const message = state.error ?? state.success;
    if (!message) {
      return;
    }

    const toastKey = `${state.error ? 'error' : 'success'}:${message}`;
    if (lastToastKey.current === toastKey) {
      return;
    }

    lastToastKey.current = toastKey;

    if (state.error) {
      toast.error(state.error);
      return;
    }

    if (state.success) {
      toast.success(state.success);
    }
  }, [state.error, state.success, toast]);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <h2 className="font-display text-xl font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm text-home-muted">{description}</p>

      <form action={formAction} className="mt-6 space-y-4" noValidate>
        <div className="space-y-2">
          <label htmlFor={`${formId}-email`} className="block text-sm font-medium text-white">
            {emailLabel}
          </label>
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            autoComplete="off"
            required
            readOnly={emailReadOnly}
            defaultValue={emailValue}
            aria-invalid={hasError}
            aria-describedby={statusId}
            className={emailReadOnly ? READ_ONLY_FIELD_CLASS : FIELD_CLASS}
            placeholder="user@example.com"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor={`${formId}-password`} className="block text-sm font-medium text-white">
            {passwordLabel}
          </label>
          <input
            id={`${formId}-password`}
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            aria-invalid={hasError}
            aria-describedby={statusId}
            className={FIELD_CLASS}
            placeholder="At least 8 characters"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor={`${formId}-confirm-password`}
            className="block text-sm font-medium text-white"
          >
            {confirmLabel}
          </label>
          <input
            id={`${formId}-confirm-password`}
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            aria-invalid={hasError}
            aria-describedby={statusId}
            className={FIELD_CLASS}
            placeholder="Repeat password"
          />
        </div>

        <div id={statusId} className="sr-only">
          {state.error ?? state.success}
        </div>

        <button
          id={`${formId}-submit`}
          type="submit"
          title={submitLabel}
          aria-label={submitLabel}
          disabled={isPending}
          className="home-cta rounded-lg bg-home-accent px-5 py-3 text-sm font-semibold text-home-ink transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? pendingLabel : submitLabel}
        </button>
      </form>
    </section>
  );
}

export function SettingsPage({ currentUserEmail }: SettingsPageProps) {
  return (
    <main className="flex-1 px-6 py-8 sm:px-10">
      <header className="mb-8 w-full">
        <p className="text-sm font-medium tracking-wide text-home-accent uppercase">Settings</p>
        <h1 className="font-display mt-2 text-3xl font-semibold text-white">User management</h1>
        <p className="mt-3 text-sm text-home-muted">
          Register confirmed users and reset passwords for existing accounts.
        </p>
      </header>

      <div className="grid w-full gap-6 lg:grid-cols-2">
        <AdminAuthForm
          formId="admin-register"
          title="Register user"
          description="Creates a new account with email auto-confirmed."
          emailLabel="Email"
          passwordLabel="Password"
          confirmLabel="Confirm password"
          submitLabel="Register user"
          pendingLabel="Registering…"
          action={registerUser}
        />
        <AdminAuthForm
          formId="admin-reset-password"
          title="Reset password"
          description="Set a new password for your signed-in account."
          emailLabel="User email"
          passwordLabel="New password"
          confirmLabel="Confirm new password"
          submitLabel="Reset password"
          pendingLabel="Updating…"
          emailValue={currentUserEmail}
          emailReadOnly
          action={resetUserPassword}
        />
      </div>
    </main>
  );
}
