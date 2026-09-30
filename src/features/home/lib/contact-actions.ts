'use server';

import { headers } from 'next/headers';
import { Resend } from 'resend';

import {
  readOptionalString,
  readString,
  requireNonEmpty,
} from '@/features/admin/lib/form-helpers';
import {
  createMathChallenge,
  verifyMathChallenge,
} from '@/features/home/lib/contact-math-challenge';
import { buildContactEmailContent } from '@/features/home/lib/contact-email-template';
import {
  collectContactRequestMeta,
  createContactSubmission,
  logContactRateLimitEvent,
  updateContactSubmissionEmailStatus,
} from '@/features/home/lib/contact-persistence';
import {
  consumeContactRateLimit,
  getClientIp,
} from '@/features/home/lib/contact-rate-limit';
import type {
  ContactFormState,
  ContactFormValues,
} from '@/types/components/contact-section';

const EMPTY_VALUES: ContactFormValues = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

const EMPTY: ContactFormState = {
  error: null,
  success: null,
  challenge: null,
  values: null,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE_LENGTH = 3000;
const MAX_NAME_LENGTH = 120;
const MAX_SUBJECT_LENGTH = 200;
const DEFAULT_FROM_EMAIL = 'onboarding@resend.dev';

function readValues(formData: FormData): ContactFormValues {
  return {
    name: readString(formData, 'name'),
    email: readString(formData, 'email'),
    subject: readString(formData, 'subject'),
    message: readString(formData, 'message'),
  };
}

function nextState(
  partial: Partial<Pick<ContactFormState, 'error' | 'success' | 'values'>>
): ContactFormState {
  return {
    ...EMPTY,
    ...partial,
    challenge: createMathChallenge(),
    values: partial.values ?? null,
  };
}

export async function submitContactMessage(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const values = readValues(formData);
  const challengeToken = readString(formData, 'challengeToken');
  const challengeAnswer = readString(formData, 'challengeAnswer');
  const honeypot = readString(formData, 'company');
  const requestHeaders = await headers();
  const ipAddress = getClientIp(requestHeaders);
  const clientKey = `contact:${ipAddress}`;
  const meta = collectContactRequestMeta(requestHeaders, ipAddress);

  if (honeypot) {
    await createContactSubmission({
      values,
      meta,
      honeypotTriggered: true,
      emailStatus: 'skipped',
    });

    return nextState({
      success: 'Message sent. Thanks for reaching out.',
      values: EMPTY_VALUES,
    });
  }

  const rateLimit = consumeContactRateLimit(clientKey);

  if (rateLimit.limited) {
    await logContactRateLimitEvent({
      clientKey,
      meta,
      rateLimit,
      values,
    });

    return nextState({
      error: rateLimit.message ?? 'Too many messages. Please try again later.',
      values,
    });
  }

  const challengeError = verifyMathChallenge(challengeToken, challengeAnswer);

  if (challengeError) {
    return nextState({ error: challengeError, values });
  }

  const missing = requireNonEmpty({
    Name: values.name,
    Email: values.email,
    Message: values.message,
  });

  if (missing) {
    return nextState({ error: missing, values });
  }

  if (!EMAIL_PATTERN.test(values.email)) {
    return nextState({ error: 'Enter a valid email address.', values });
  }

  if (values.name.length > MAX_NAME_LENGTH) {
    return nextState({ error: 'Name is too long.', values });
  }

  if (values.subject.length > MAX_SUBJECT_LENGTH) {
    return nextState({ error: 'Subject is too long.', values });
  }

  if (values.message.length > MAX_MESSAGE_LENGTH) {
    return nextState({ error: 'Message is too long.', values });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL ?? DEFAULT_FROM_EMAIL;
  const subject = readOptionalString(formData, 'subject');
  const mailSubject = subject
    ? `Portfolio contact: ${subject}`
    : `Portfolio contact from ${values.name}`;

  const submission = await createContactSubmission({
    values,
    meta,
    emailStatus: 'pending',
    emailTo: toEmail ?? null,
    emailFrom: fromEmail,
    emailSubject: mailSubject,
  });

  if (submission.error || !submission.id) {
    return nextState({
      error: 'Could not save your message. Please try again.',
      values,
    });
  }

  if (!apiKey || !toEmail) {
    await updateContactSubmissionEmailStatus({
      id: submission.id,
      emailStatus: 'failed',
      emailError: 'Contact email is not configured.',
      emailTo: toEmail ?? null,
      emailFrom: fromEmail,
      emailSubject: mailSubject,
    });

    return nextState({
      success: 'Message received. We will follow up soon.',
      values: EMPTY_VALUES,
    });
  }

  const resend = new Resend(apiKey);
  const emailContent = buildContactEmailContent(values);
  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: [toEmail],
    replyTo: values.email,
    subject: mailSubject,
    html: emailContent.html,
    text: emailContent.text,
  });

  if (error) {
    await updateContactSubmissionEmailStatus({
      id: submission.id,
      emailStatus: 'failed',
      emailError: error.message,
      emailTo: toEmail,
      emailFrom: fromEmail,
      emailSubject: mailSubject,
    });

    return nextState({
      success: 'Message received. We will follow up soon.',
      values: EMPTY_VALUES,
    });
  }

  await updateContactSubmissionEmailStatus({
    id: submission.id,
    emailStatus: 'sent',
    emailProviderId: data?.id ?? null,
    emailTo: toEmail,
    emailFrom: fromEmail,
    emailSubject: mailSubject,
  });

  return nextState({
    success: 'Message sent. Thanks for reaching out.',
    values: EMPTY_VALUES,
  });
}
