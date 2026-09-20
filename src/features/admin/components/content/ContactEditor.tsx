'use client';

import { AdminDataTable } from '@/features/admin/components/AdminDataTable';
import {
  AdminFormCard,
  AdminPageHeader,
} from '@/features/admin/components/AdminFormPrimitives';
import {
  deleteContactRateLimitEvent,
  deleteContactSubmission,
} from '@/features/admin/lib/content-actions';
import type {
  AdminContactEmailStatus,
  AdminContactRateLimitEventItem,
  AdminContactSubmissionItem,
  ContactEditorProps,
} from '@/types/components/admin-content';
import type { AdminTableColumn } from '@/types/components/admin-table';

function formatDateTime(value: string | null) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
}

function formatDuration(ms: number) {
  const totalMinutes = Math.max(1, Math.round(ms / 60000));
  if (totalMinutes < 60) {
    return `${totalMinutes} minute${totalMinutes === 1 ? '' : 's'}`;
  }

  const hours = Math.round(totalMinutes / 60);
  return `${hours} hour${hours === 1 ? '' : 's'}`;
}

function emailStatusLabel(status: AdminContactEmailStatus) {
  switch (status) {
    case 'sent':
      return 'Sent';
    case 'failed':
      return 'Failed';
    case 'skipped':
      return 'Skipped';
    default:
      return 'Pending';
  }
}

function emailStatusClass(status: AdminContactEmailStatus) {
  switch (status) {
    case 'sent':
      return 'bg-emerald-500/15 text-emerald-300';
    case 'failed':
      return 'bg-red-500/15 text-red-300';
    case 'skipped':
      return 'bg-amber-500/15 text-amber-200';
    default:
      return 'bg-white/10 text-home-muted';
  }
}

function ConfigStatus({ ok, label }: { ok: boolean; label: string }) {
  return (
    <p
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
        ok ? 'bg-emerald-500/15 text-emerald-300' : 'bg-red-500/15 text-red-300'
      }`}
    >
      {label}
    </p>
  );
}

function DetailRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4">
      <dt className="text-xs font-medium tracking-wide text-home-muted uppercase">{label}</dt>
      <dd className="wrap-break-word text-sm text-white">{value?.trim() ? value : '—'}</dd>
    </div>
  );
}

const SUBMISSION_COLUMNS: AdminTableColumn<AdminContactSubmissionItem>[] = [
  {
    id: 'createdAt',
    header: 'Received',
    cell: (row) => formatDateTime(row.createdAt),
  },
  {
    id: 'name',
    header: 'Name',
    cell: (row) => row.name,
  },
  {
    id: 'email',
    header: 'Email',
    cell: (row) => row.email,
    hideBelow: 'sm',
  },
  {
    id: 'status',
    header: 'Status',
    cell: (row) => (
      <span
        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${emailStatusClass(
          row.emailStatus,
        )}`}
      >
        {emailStatusLabel(row.emailStatus)}
      </span>
    ),
    hideBelow: 'md',
  },
];

const RATE_LIMIT_COLUMNS: AdminTableColumn<AdminContactRateLimitEventItem>[] = [
  {
    id: 'createdAt',
    header: 'When',
    cell: (row) => formatDateTime(row.createdAt),
  },
  {
    id: 'ip',
    header: 'IP',
    cell: (row) => row.ipAddress ?? row.clientKey,
  },
  {
    id: 'attempts',
    header: 'Attempts',
    cell: (row) => `${row.attemptCount} / ${row.maxRequests}`,
    hideBelow: 'sm',
  },
  {
    id: 'window',
    header: 'Window',
    cell: (row) => formatDuration(row.windowMs),
    hideBelow: 'md',
  },
];

export function ContactEditor({
  settings,
  submissions,
  rateLimitEvents,
}: ContactEditorProps) {
  const deliveryReady = settings.resendConfigured && Boolean(settings.toEmail);

  return (
    <main className="px-6 py-8 sm:px-10">
      <AdminPageHeader
        eyebrow="Inbox"
        title="Contact"
        description="Review contact form submissions, delivery details, and rate-limit events."
      />

      <div className="grid w-full gap-8">
        <AdminFormCard
          title="Delivery & rate limits"
          description="Email addresses come from environment variables. API keys stay secret and are only shown as configured or missing."
        >
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <ConfigStatus
                ok={deliveryReady}
                label={deliveryReady ? 'Email delivery ready' : 'Email delivery incomplete'}
              />
              <ConfigStatus
                ok={settings.resendConfigured}
                label={
                  settings.resendConfigured ? 'Resend API key set' : 'Resend API key missing'
                }
              />
              <ConfigStatus
                ok={settings.challengeSecretConfigured}
                label={
                  settings.challengeSecretConfigured
                    ? 'Challenge secret set'
                    : 'Challenge secret missing'
                }
              />
            </div>

            <dl className="space-y-3">
              <DetailRow label="To email" value={settings.toEmail} />
              <DetailRow label="From email" value={settings.fromEmail} />
              <DetailRow
                label="Rate limit"
                value={`${settings.rateLimitMaxRequests} messages / ${formatDuration(
                  settings.rateLimitWindowMs,
                )}`}
              />
            </dl>
          </div>
        </AdminFormCard>

        <section aria-labelledby="admin-contact-submissions-heading" className="space-y-4">
          <div>
            <h2
              id="admin-contact-submissions-heading"
              className="font-display text-xl font-semibold text-white"
            >
              Submissions
            </h2>
            <p className="mt-1 text-sm text-home-muted">
              Latest {submissions.length} saved contact form messages, including email delivery
              metadata.
            </p>
          </div>

          <AdminDataTable
            caption="Contact form submissions"
            rows={submissions}
            columns={SUBMISSION_COLUMNS}
            getRowLabel={(row) => row.subject?.trim() || `Message from ${row.name}`}
            getDetailFields={(row) => [
              { label: 'Name', value: row.name },
              { label: 'Email', value: row.email },
              { label: 'Subject', value: row.subject },
              { label: 'Message', value: row.message },
              { label: 'Email status', value: emailStatusLabel(row.emailStatus) },
              {
                label: 'Honeypot',
                value: row.honeypotTriggered ? 'Triggered' : 'Not triggered',
              },
              { label: 'To', value: row.emailTo },
              { label: 'From', value: row.emailFrom },
              { label: 'Mail subject', value: row.emailSubject },
              { label: 'Provider id', value: row.emailProviderId },
              { label: 'Email error', value: row.emailError },
              { label: 'Email sent at', value: formatDateTime(row.emailSentAt) },
              { label: 'Received', value: formatDateTime(row.createdAt) },
              { label: 'IP', value: row.ipAddress },
              { label: 'Forwarded for', value: row.forwardedFor },
              { label: 'User agent', value: row.userAgent },
              { label: 'Referer', value: row.referer },
              { label: 'Origin', value: row.origin },
              { label: 'Host', value: row.host },
              { label: 'Accept language', value: row.acceptLanguage },
              { label: 'Request path', value: row.requestPath },
            ]}
            deleteAction={deleteContactSubmission}
            getDeleteConfirmMessage={() => 'Delete this contact submission?'}
            emptyTitle="No submissions yet"
            emptyDescription="Messages from the public contact form will appear here."
          />
        </section>

        <section aria-labelledby="admin-contact-rate-limit-heading" className="space-y-4">
          <div>
            <h2
              id="admin-contact-rate-limit-heading"
              className="font-display text-xl font-semibold text-white"
            >
              Rate limit events
            </h2>
            <p className="mt-1 text-sm text-home-muted">
              Logged when a visitor exceeds the contact form rate limit.
            </p>
          </div>

          <AdminDataTable
            caption="Contact form rate limit events"
            rows={rateLimitEvents}
            columns={RATE_LIMIT_COLUMNS}
            getRowLabel={(row) => row.email?.trim() || row.ipAddress || row.clientKey}
            getDetailFields={(row) => [
              { label: 'Client key', value: row.clientKey },
              {
                label: 'Attempts',
                value: `${row.attemptCount} / ${row.maxRequests}`,
              },
              { label: 'Window', value: formatDuration(row.windowMs) },
              { label: 'Reset at', value: formatDateTime(row.resetAt) },
              {
                label: 'Remaining',
                value:
                  row.remainingMs === null || row.remainingMs === undefined
                    ? null
                    : formatDuration(row.remainingMs),
              },
              { label: 'When', value: formatDateTime(row.createdAt) },
              { label: 'Name', value: row.name },
              { label: 'Email', value: row.email },
              { label: 'Subject', value: row.subject },
              { label: 'Message preview', value: row.messagePreview },
              {
                label: 'Message length',
                value:
                  row.messageLength === null || row.messageLength === undefined
                    ? null
                    : String(row.messageLength),
              },
              { label: 'IP', value: row.ipAddress },
              { label: 'Forwarded for', value: row.forwardedFor },
              { label: 'User agent', value: row.userAgent },
              { label: 'Referer', value: row.referer },
              { label: 'Origin', value: row.origin },
              { label: 'Host', value: row.host },
              { label: 'Accept language', value: row.acceptLanguage },
              { label: 'Request path', value: row.requestPath },
            ]}
            deleteAction={deleteContactRateLimitEvent}
            getDeleteConfirmMessage={() => 'Delete this rate limit event?'}
            emptyTitle="No rate limit events"
            emptyDescription="Blocked attempts will appear here when someone sends too many messages."
          />
        </section>
      </div>
    </main>
  );
}
