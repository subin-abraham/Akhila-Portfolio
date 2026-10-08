'use client';

import { useActionState, useId, useState } from 'react';

import { useTrackPending } from '@/components/AppLoader';
import { MathChallengeField } from '@/components/MathChallengeField';
import { ToastBanner } from '@/components/AppToast';
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
      <label htmlFor="contact-message" className="text-sm font-medium text-home-heading">
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
        className="resize-y rounded-lg border border-home-input-border bg-home-input px-4 py-3 text-sm text-home-heading outline-none transition placeholder:text-home-muted focus:border-home-accent/50"
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
  useTrackPending(isPending, 'Sending message…');
  const activeChallenge: MathChallengePublic = state.challenge ?? challenge;
  const defaults: ContactFormValues = state.values ?? EMPTY_VALUES;
  const formKey = activeChallenge.token;
  const hasError = Boolean(state.error);
  const fieldDescribedBy = hasError ? statusId : undefined;
  const toastMessage = state.error ?? state.success;
  const isErrorToast = Boolean(state.error);

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
          <ToastBanner
            key={`${isErrorToast ? 'error' : 'success'}-${formKey}-${toastMessage}`}
            message={toastMessage}
            variant={isErrorToast ? 'error' : 'success'}
          />
        </div>
      ) : null}

      <SectionHeading
        section={section}
        headingId="contact-heading"
        headingClassName="font-display text-3xl font-normal tracking-tight sm:text-4xl lg:text-[2.75rem]"
      />

      <form
        key={formKey}
        action={formAction}
        className="contact-bento"
        noValidate
        aria-busy={isPending}
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

        <div className="flex flex-col gap-2">
          <label htmlFor="contact-name" className="text-sm font-medium text-home-heading">
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
            className="rounded-lg border border-home-input-border bg-home-input px-4 py-3 text-sm text-home-heading outline-none transition placeholder:text-home-muted focus:border-home-accent/50"
            placeholder="Your name"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="contact-email" className="text-sm font-medium text-home-heading">
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
            className="rounded-lg border border-home-input-border bg-home-input px-4 py-3 text-sm text-home-heading outline-none transition placeholder:text-home-muted focus:border-home-accent/50"
            placeholder="you@example.com"
          />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <label
            htmlFor="contact-subject"
            className="text-sm font-medium text-home-heading"
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
            className="rounded-lg border border-home-input-border bg-home-input px-4 py-3 text-sm text-home-heading outline-none transition placeholder:text-home-muted focus:border-home-accent/50"
            placeholder="What is this about?"
          />
        </div>

        <ContactMessageField
          defaultValue={defaults.message}
          hasError={hasError}
          describedBy={fieldDescribedBy}
        />

        <MathChallengeField
          idPrefix="contact"
          challenge={activeChallenge}
          hasError={hasError}
          describedBy={fieldDescribedBy}
          className="-mt-2 flex flex-col gap-1.5 sm:col-span-2 sm:max-w-xs"
        />

        <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-end">
          <p id={statusId} className="sr-only">
            {state.error ?? state.success ?? ''}
          </p>

          <button
            id="contact-submit"
            type="submit"
            title={isPending ? 'Sending message' : 'Send message'}
            aria-label={isPending ? 'Sending message' : 'Send message'}
            aria-busy={isPending}
            disabled={isPending}
            className="home-cta cursor-pointer rounded-full bg-home-accent px-6 py-3 text-sm font-semibold text-home-ink transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? 'Sending…' : 'Send message'}
          </button>
        </div>
      </form>
    </section>
  );
}
