'use client';

import { startTransition, useActionState, useEffect, useRef, useState } from 'react';

import { useAppToast } from '@/components/AppToast';
import { useTrackPending } from '@/components/AppLoader';
import {
  registerUser,
  resetUserPassword,
} from '@/features/admin/lib/auth-actions';
import { useAdminAction } from '@/features/admin/lib/use-admin-action';
import { updateSitePageFlags } from '@/features/admin/lib/settings-actions';
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
  const toast = useAppToast();
  const [state, formAction, isPending] = useActionState(action, INITIAL_STATE);
  useTrackPending(isPending, pendingLabel);
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
            autoComplete="email"
            defaultValue={emailValue ?? ''}
            readOnly={emailReadOnly}
            required={!emailReadOnly}
            aria-invalid={hasError}
            aria-describedby={statusId}
            className={emailReadOnly ? READ_ONLY_FIELD_CLASS : FIELD_CLASS}
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
            aria-invalid={hasError}
            aria-describedby={statusId}
            className={FIELD_CLASS}
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
            aria-invalid={hasError}
            aria-describedby={statusId}
            className={FIELD_CLASS}
          />
        </div>

        <div id={statusId} className="sr-only" aria-live="polite">
          {state.error ?? state.success ?? ''}
        </div>

        <button
          id={`${formId}-submit`}
          type="submit"
          title={isPending ? pendingLabel : submitLabel}
          aria-label={isPending ? pendingLabel : submitLabel}
          aria-busy={isPending}
          disabled={isPending}
          className="home-cta cursor-pointer rounded-lg bg-home-accent px-5 py-2.5 text-sm font-semibold text-home-ink transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? pendingLabel : submitLabel}
        </button>
      </form>
    </section>
  );
}

function SitePagesFlagsForm({
  siteSettings,
}: {
  siteSettings: SettingsPageProps['siteSettings'];
}) {
  const { formAction, isPending, state } = useAdminAction({
    action: updateSitePageFlags,
    successFallbackMessage: 'Page visibility updated.',
    pendingLabel: 'Saving page visibility…',
  });
  const [blogEnabled, setBlogEnabled] = useState(siteSettings.blogEnabled);
  const [caseStudiesEnabled, setCaseStudiesEnabled] = useState(
    siteSettings.caseStudiesEnabled,
  );
  const revertRef = useRef<{
    blogEnabled: boolean;
    caseStudiesEnabled: boolean;
  } | null>(null);
  const statusId = 'admin-site-pages-status';
  const canToggle = Boolean(siteSettings.id) && !isPending;

  useEffect(() => {
    setBlogEnabled(siteSettings.blogEnabled);
    setCaseStudiesEnabled(siteSettings.caseStudiesEnabled);
  }, [siteSettings.blogEnabled, siteSettings.caseStudiesEnabled]);

  useEffect(() => {
    if (!state.error || !revertRef.current) {
      return;
    }

    setBlogEnabled(revertRef.current.blogEnabled);
    setCaseStudiesEnabled(revertRef.current.caseStudiesEnabled);
    revertRef.current = null;
  }, [state.error]);

  useEffect(() => {
    if (state.success) {
      revertRef.current = null;
    }
  }, [state.success]);

  const saveFlags = (nextBlogEnabled: boolean, nextCaseStudiesEnabled: boolean) => {
    if (!siteSettings.id || isPending) {
      return;
    }

    revertRef.current = {
      blogEnabled,
      caseStudiesEnabled,
    };
    setBlogEnabled(nextBlogEnabled);
    setCaseStudiesEnabled(nextCaseStudiesEnabled);

    const formData = new FormData();
    formData.set('id', siteSettings.id);
    formData.set('blogEnabled', String(nextBlogEnabled));
    formData.set('caseStudiesEnabled', String(nextCaseStudiesEnabled));

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <h2 className="font-display text-xl font-semibold text-white">Public pages</h2>
      <p className="mt-2 text-sm text-home-muted">
        Enable or disable the Case studies and Blog pages on the public site. Disabled pages are
        hidden from navigation and return 404.
      </p>

      {!siteSettings.id ? (
        <p className="mt-6 rounded-lg border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
          Site settings are not available yet. Apply the latest Supabase migration, then refresh
          this page.
        </p>
      ) : null}

      <div className="mt-6 space-y-3" aria-describedby={statusId}>
        <SitePageToggle
          id="admin-site-case-studies-enabled"
          label="Case studies"
          description="Show /case-studies in the header and footer when enabled."
          checked={caseStudiesEnabled}
          disabled={!canToggle}
          onChange={(next) => saveFlags(blogEnabled, next)}
        />
        <SitePageToggle
          id="admin-site-blog-enabled"
          label="Blog"
          description="Show /blog in the header and footer when enabled."
          checked={blogEnabled}
          disabled={!canToggle}
          onChange={(next) => saveFlags(next, caseStudiesEnabled)}
        />
      </div>

      <div id={statusId} className="sr-only" aria-live="polite">
        {isPending ? 'Saving page visibility…' : ''}
      </div>
    </section>
  );
}

interface SitePageToggleProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (next: boolean) => void;
}

function SitePageToggle({
  id,
  label,
  description,
  checked,
  disabled = false,
  onChange,
}: SitePageToggleProps) {
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;
  const actionLabel = checked ? `Disable ${label}` : `Enable ${label}`;

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
      <div className="min-w-0">
        <p id={labelId} className="text-sm font-medium text-white">
          {label}
        </p>
        <p id={descriptionId} className="mt-1 text-sm text-home-muted">
          {description}
        </p>
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        title={actionLabel}
        aria-label={actionLabel}
        aria-checked={checked}
        aria-labelledby={labelId}
        aria-describedby={descriptionId}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-home-accent focus-visible:ring-offset-2 focus-visible:ring-offset-home-bg disabled:cursor-not-allowed disabled:opacity-50 ${
          checked
            ? 'border-home-accent/40 bg-home-accent'
            : 'border-white/20 bg-white/10'
        }`}
      >
        <span
          aria-hidden="true"
          className={`inline-block size-5 rounded-full shadow transition ${
            checked ? 'translate-x-5 bg-home-ink' : 'translate-x-1 bg-white'
          }`}
        />
      </button>
    </div>
  );
}

export function SettingsPage({ currentUserEmail, siteSettings }: SettingsPageProps) {
  return (
    <main className="px-6 py-8 sm:px-10">
      <header className="mb-8 w-full">
        <p className="text-sm font-medium tracking-wide text-home-accent uppercase">Settings</p>
        <h1 className="font-display mt-2 text-3xl font-semibold text-white">Site &amp; account</h1>
        <p className="mt-3 text-sm text-home-muted">
          Control public page visibility, register users, and reset passwords.
        </p>
      </header>

      <div className="flex w-full flex-col gap-6">
        <SitePagesFlagsForm siteSettings={siteSettings} />

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
      </div>
    </main>
  );
}
