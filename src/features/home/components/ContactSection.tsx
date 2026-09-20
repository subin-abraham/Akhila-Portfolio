'use client';

import { useActionState, useId, useState } from 'react';

import { SectionHeading } from '@/features/home/components/SectionHeading';
import { submitContactMessage } from '@/features/home/lib/contact-actions';
import type {
  ContactFormState,
  ContactFormValues,
  ContactSectionProps,
  MathChallengePublic,
} from '@/types/components/contact-section';

const INITIAL_STATE: ContactFormState = {
  error: null,
  success: null,
  challenge: null,
  values: null,
};

const EMPTY_VALUES: ContactFormValues = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

const MESSAGE_MAX_LENGTH = 3000;

interface ContactMessageFieldProps {
  defaultValue: string;
  hasError: boolean;
  describedBy?: string;
}

function ContactMessageField({
  defaultValue,
  hasError,
  describedBy,
}: ContactMessageFieldProps) {
  const [count, setCount] = useState(() =>
    Math.min(defaultValue.length, MESSAGE_MAX_LENGTH)
  );
  const counterId = useId();

  return (
    <div className="flex flex-col gap-2 sm:col-span-2">
      <label htmlFor="contact-message" className="text-sm font-medium text-white">
        Message
      </label>
      <textarea
        id="contact-message"
        name="message"
        required
        rows={6}
        maxLength={MESSAGE_MAX_LENGTH}
        defaultValue={defaultValue.slice(0, MESSAGE_MAX_LENGTH)}
        onChange={(event) => setCount(event.target.value.length)}
        aria-invalid={hasError}
        aria-describedby={[describedBy, counterId].filter(Boolean).join(' ') || undefined}
        className="resize-y rounded-lg border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-home-muted focus:border-home-accent/50"
        placeholder="Tell me a bit about the project or opportunity."
      />
      <p
        id={counterId}
        aria-live="polite"
        className={`text-right text-xs tabular-nums ${
          count >= MESSAGE_MAX_LENGTH ? 'text-home-accent' : 'text-home-muted'
        }`}
      >
        {count}/{MESSAGE_MAX_LENGTH}
      </p>
    </div>
  );
}

export function ContactSection({ section, challenge }: ContactSectionProps) {
  const statusId = useId();
  const [state, formAction, isPending] = useActionState(
    submitContactMessage,
    INITIAL_STATE
  );
  const activeChallenge: MathChallengePublic = state.challenge ?? challenge;
  const defaults: ContactFormValues = state.values ?? EMPTY_VALUES;
  const formKey = activeChallenge.token;
  const hasError = Boolean(state.error);
  const fieldDescribedBy = hasError ? statusId : undefined;
  const toastMessage = state.error ?? state.success;
  const isErrorToast = Boolean(state.error);
  const toastSurfaceClassName = isErrorToast
    ? 'border-red-400/70 bg-red-500 text-white shadow-[0_12px_40px_rgb(239_68_68/0.45)]'
    : 'border-home-accent bg-home-accent text-home-ink shadow-[0_12px_40px_rgb(182_243_75/0.45)]';

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="flex scroll-mt-28 flex-col gap-8 sm:gap-10"
    >
      {toastMessage ? (
        <div
          aria-live="polite"
          aria-relevant="additions text"
          className="pointer-events-none fixed inset-x-0 top-24 z-[90] flex justify-center px-4 sm:top-28"
        >
          <div
            key={`${isErrorToast ? 'error' : 'success'}-${formKey}-${toastMessage}`}
            role={isErrorToast ? 'alert' : 'status'}
            className={`contact-toast pointer-events-auto flex w-full max-w-lg items-center gap-3 rounded-2xl border-2 px-5 py-4 ${toastSurfaceClassName}`}
          >
            <span
              aria-hidden="true"
              className={`inline-flex size-9 shrink-0 items-center justify-center rounded-full text-lg font-bold ${
                isErrorToast ? 'bg-white/20 text-white' : 'bg-home-ink/15 text-home-ink'
              }`}
            >
              {isErrorToast ? '!' : '✓'}
            </span>
            <p
              className={`flex-1 text-sm font-semibold sm:text-base ${
                isErrorToast ? 'text-white' : 'text-home-ink'
              }`}
            >
              {toastMessage}
            </p>
          </div>
        </div>
      ) : null}

      <SectionHeading section={section} headingId="contact-heading" />

      <form
        key={formKey}
        action={formAction}
        className="relative grid gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-2 sm:gap-6 sm:p-8"
        noValidate
      >
        <div className="pointer-events-none absolute left-0 top-0 h-0 w-0 overflow-hidden opacity-0">
          <label htmlFor="contact-company">Company</label>
          <input
            id="contact-company"
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <input type="hidden" name="challengeToken" value={activeChallenge.token} />

        <div className="flex flex-col gap-2">
          <label htmlFor="contact-name" className="text-sm font-medium text-white">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            defaultValue={defaults.name}
            aria-invalid={hasError}
            aria-describedby={fieldDescribedBy}
            className="rounded-lg border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-home-muted focus:border-home-accent/50"
            placeholder="Your name"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="contact-email" className="text-sm font-medium text-white">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={defaults.email}
            aria-invalid={hasError}
            aria-describedby={fieldDescribedBy}
            className="rounded-lg border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-home-muted focus:border-home-accent/50"
            placeholder="you@example.com"
          />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <label
            htmlFor="contact-subject"
            className="text-sm font-medium text-white"
          >
            Subject
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            autoComplete="off"
            defaultValue={defaults.subject}
            aria-invalid={hasError}
            aria-describedby={fieldDescribedBy}
            className="rounded-lg border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-home-muted focus:border-home-accent/50"
            placeholder="What is this about?"
          />
        </div>

        <ContactMessageField
          key={formKey}
          defaultValue={defaults.message}
          hasError={hasError}
          describedBy={fieldDescribedBy}
        />

        <div className="flex flex-col gap-2 sm:col-span-2 sm:max-w-xs">
          <label
            htmlFor="contact-challenge-answer"
            className="text-sm font-medium text-white"
          >
            {activeChallenge.question}
          </label>
          <input
            id="contact-challenge-answer"
            name="challengeAnswer"
            type="text"
            inputMode="numeric"
            required
            autoComplete="off"
            defaultValue=""
            aria-invalid={hasError}
            aria-describedby={fieldDescribedBy}
            className="rounded-lg border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-home-muted focus:border-home-accent/50"
            placeholder="Your answer"
          />
        </div>

        <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-end">
          <p id={statusId} className="sr-only">
            {state.error ?? state.success ?? ''}
          </p>

          <button
            id="contact-submit"
            type="submit"
            title={isPending ? 'Sending message' : 'Send message'}
            aria-label={isPending ? 'Sending message' : 'Send message'}
            disabled={isPending}
            className="home-cta inline-flex cursor-pointer items-center justify-center rounded-lg bg-home-accent px-5 py-3 text-sm font-semibold text-home-ink transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? 'Sending…' : 'Send message'}
          </button>
        </div>
      </form>
    </section>
  );
}
