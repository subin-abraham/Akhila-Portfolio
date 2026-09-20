'use client';

import type { FormEvent, ReactNode } from 'react';

import { useAdminAction } from '@/features/admin/lib/use-admin-action';
import type {
  AdminActionState,
  AdminFieldProps,
  AdminFormCardProps,
  AdminPageHeaderProps,
  AdminSelectFieldProps,
  AdminStatusProps,
  AdminSubmitButtonProps,
  AdminTextareaFieldProps,
} from '@/types/components/admin-shell';

export const ADMIN_FIELD_CLASS =
  'w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-home-muted focus:border-home-accent focus:ring-1 focus:ring-home-accent';

export function AdminPageHeader({ eyebrow, title, description, action }: AdminPageHeaderProps) {
  return (
    <header className="mb-8 w-full">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium tracking-wide text-home-accent uppercase">{eyebrow}</p>
          <h1 className="font-display mt-2 text-3xl font-semibold text-white">{title}</h1>
        </div>
        {action ? <div className="shrink-0 pt-1 sm:pt-7">{action}</div> : null}
      </div>
      {description ? <p className="mt-3 text-sm text-home-muted">{description}</p> : null}
    </header>
  );
}

export function AdminHeaderAddButton({
  id,
  label,
  onClick,
}: {
  id: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      id={id}
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="home-cta cursor-pointer rounded-lg bg-home-accent px-5 py-2.5 text-sm font-semibold text-home-ink transition"
    >
      {label}
    </button>
  );
}

export function AdminFormCard({ title, description, children }: AdminFormCardProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <h2 className="font-display text-lg font-semibold text-white">{title}</h2>
      {description ? <p className="mt-2 text-sm text-home-muted">{description}</p> : null}
      <div className={description || title ? 'mt-6' : undefined}>{children}</div>
    </section>
  );
}

export function AdminField({
  id,
  name,
  label,
  type = 'text',
  defaultValue,
  required = false,
  min,
  max,
  placeholder,
  describedBy,
  invalid = false,
}: AdminFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-white">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        defaultValue={defaultValue ?? ''}
        required={required}
        min={min}
        max={max}
        placeholder={placeholder}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        className={ADMIN_FIELD_CLASS}
      />
    </div>
  );
}

export function AdminTextareaField({
  id,
  name,
  label,
  defaultValue,
  required = false,
  rows = 4,
  placeholder,
  describedBy,
  invalid = false,
}: AdminTextareaFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-white">
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        defaultValue={defaultValue ?? ''}
        required={required}
        rows={rows}
        placeholder={placeholder}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        className={`${ADMIN_FIELD_CLASS} resize-y`}
      />
    </div>
  );
}

export function AdminSelectField({
  id,
  name,
  label,
  defaultValue,
  options,
  required = false,
  describedBy,
  invalid = false,
}: AdminSelectFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-white">
        {label}
      </label>
      <select
        id={id}
        name={name}
        defaultValue={defaultValue}
        required={required}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        className={ADMIN_FIELD_CLASS}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-[#121212] text-white">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function AdminStatus({ id, state }: AdminStatusProps) {
  return (
    <div id={id} className="sr-only">
      {state.error ?? state.success}
    </div>
  );
}

export function AdminSubmitButton({
  id,
  label,
  pendingLabel,
  isPending,
  variant = 'primary',
}: AdminSubmitButtonProps) {
  const className =
    variant === 'danger'
      ? 'inline-flex cursor-pointer items-center justify-center rounded-lg border border-red-400/40 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-60'
      : 'home-cta inline-flex cursor-pointer items-center justify-center rounded-lg bg-home-accent px-5 py-3 text-sm font-semibold text-home-ink transition disabled:cursor-not-allowed disabled:opacity-60';
  const activeLabel = isPending ? pendingLabel : label;

  return (
    <button
      id={id}
      type="submit"
      title={activeLabel}
      aria-label={activeLabel}
      aria-busy={isPending}
      disabled={isPending}
      className={className}
    >
      {activeLabel}
    </button>
  );
}

interface AdminActionFormProps {
  formId: string;
  action: (prevState: AdminActionState, formData: FormData) => Promise<AdminActionState>;
  children: (args: {
    state: AdminActionState;
    isPending: boolean;
    statusId: string;
    hasError: boolean;
  }) => ReactNode;
  className?: string;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  onSuccess?: () => void;
}

export function AdminActionForm({
  formId,
  action,
  children,
  className,
  onSubmit,
  onSuccess,
}: AdminActionFormProps) {
  const { state, formAction, isPending } = useAdminAction({
    action,
    onSuccess,
    successFallbackMessage: 'Saved.',
  });
  const statusId = `${formId}-status`;
  const hasError = Boolean(state.error);

  return (
    <form
      action={formAction}
      className={className}
      noValidate
      onSubmit={onSubmit}
      aria-busy={isPending}
    >
      {children({ state, isPending, statusId, hasError })}
    </form>
  );
}
