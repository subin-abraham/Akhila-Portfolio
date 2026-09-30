import { createAdminClient } from '@/lib/supabase/admin';
import type { ContactFormValues } from '@/types/components/contact-section';
import type { ContactRateLimitResult } from '@/features/home/lib/contact-rate-limit';

const MESSAGE_PREVIEW_LENGTH = 240;

export interface ContactRequestMeta {
  ipAddress: string;
  forwardedFor: string | null;
  userAgent: string | null;
  referer: string | null;
  origin: string | null;
  host: string | null;
  acceptLanguage: string | null;
  requestPath: string | null;
}

export function collectContactRequestMeta(
  headersList: Headers,
  ipAddress: string
): ContactRequestMeta {
  return {
    ipAddress,
    forwardedFor: headersList.get('x-forwarded-for'),
    userAgent: headersList.get('user-agent'),
    referer: headersList.get('referer'),
    origin: headersList.get('origin'),
    host: headersList.get('host'),
    acceptLanguage: headersList.get('accept-language'),
    requestPath: headersList.get('x-invoke-path') ?? headersList.get('next-url'),
  };
}

export async function logContactRateLimitEvent(input: {
  clientKey: string;
  meta: ContactRequestMeta;
  rateLimit: ContactRateLimitResult;
  values: ContactFormValues;
}) {
  const admin = createAdminClient();
  const { error } = await admin.from('contact_rate_limit_events').insert({
    client_key: input.clientKey,
    ip_address: input.meta.ipAddress,
    forwarded_for: input.meta.forwardedFor,
    user_agent: input.meta.userAgent,
    referer: input.meta.referer,
    origin: input.meta.origin,
    host: input.meta.host,
    accept_language: input.meta.acceptLanguage,
    request_path: input.meta.requestPath,
    attempt_count: input.rateLimit.attemptCount,
    max_requests: input.rateLimit.maxRequests,
    window_ms: input.rateLimit.windowMs,
    reset_at: input.rateLimit.resetAt
      ? new Date(input.rateLimit.resetAt).toISOString()
      : null,
    remaining_ms: input.rateLimit.remainingMs,
    name: input.values.name || null,
    email: input.values.email || null,
    subject: input.values.subject || null,
    message_preview: input.values.message
      ? input.values.message.slice(0, MESSAGE_PREVIEW_LENGTH)
      : null,
    message_length: input.values.message.length,
  });

  return error?.message ?? null;
}

export async function createContactSubmission(input: {
  values: ContactFormValues;
  meta: ContactRequestMeta;
  honeypotTriggered?: boolean;
  emailStatus?: 'pending' | 'sent' | 'failed' | 'skipped';
  emailTo?: string | null;
  emailFrom?: string | null;
  emailSubject?: string | null;
}) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('contact_submissions')
    .insert({
      name: input.values.name,
      email: input.values.email,
      subject: input.values.subject || null,
      message: input.values.message,
      ip_address: input.meta.ipAddress,
      forwarded_for: input.meta.forwardedFor,
      user_agent: input.meta.userAgent,
      referer: input.meta.referer,
      origin: input.meta.origin,
      host: input.meta.host,
      accept_language: input.meta.acceptLanguage,
      request_path: input.meta.requestPath,
      honeypot_triggered: input.honeypotTriggered ?? false,
      email_status: input.emailStatus ?? 'pending',
      email_to: input.emailTo ?? null,
      email_from: input.emailFrom ?? null,
      email_subject: input.emailSubject ?? null,
    })
    .select('id')
    .single();

  if (error || !data) {
    return { id: null as string | null, error: error?.message ?? 'Insert failed.' };
  }

  return { id: data.id as string, error: null as string | null };
}

export async function updateContactSubmissionEmailStatus(input: {
  id: string;
  emailStatus: 'sent' | 'failed' | 'skipped';
  emailError?: string | null;
  emailProviderId?: string | null;
  emailTo?: string | null;
  emailFrom?: string | null;
  emailSubject?: string | null;
}) {
  const admin = createAdminClient();
  const { error } = await admin
    .from('contact_submissions')
    .update({
      email_status: input.emailStatus,
      email_error: input.emailError ?? null,
      email_provider_id: input.emailProviderId ?? null,
      email_to: input.emailTo ?? null,
      email_from: input.emailFrom ?? null,
      email_subject: input.emailSubject ?? null,
      email_sent_at:
        input.emailStatus === 'sent' ? new Date().toISOString() : null,
    })
    .eq('id', input.id);

  return error?.message ?? null;
}
