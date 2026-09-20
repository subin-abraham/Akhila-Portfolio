import { Resend } from 'resend';

import {
  buildAdminLoginFailureEmailContent,
  type AdminLoginFailureNotifyInput,
} from '@/features/admin/lib/admin-login-failure-email';

const DEFAULT_FROM_EMAIL = 'onboarding@resend.dev';

export type { AdminLoginFailureNotifyInput };

export async function notifyAdminLoginFailure(
  input: AdminLoginFailureNotifyInput
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const toEmail = process.env.CONTACT_TO_EMAIL?.trim();
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL?.trim() || DEFAULT_FROM_EMAIL;

  if (!apiKey || !toEmail) {
    return;
  }

  try {
    const resend = new Resend(apiKey);
    const content = buildAdminLoginFailureEmailContent(input);

    await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject: input.locked
        ? 'Admin login locked after failed attempts'
        : 'Failed admin login attempt',
      html: content.html,
      text: content.text,
    });
  } catch {
    return;
  }
}
