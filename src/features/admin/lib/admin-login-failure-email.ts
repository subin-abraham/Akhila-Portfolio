export interface AdminLoginFailureNotifyInput {
  email: string;
  ipAddress: string;
  userAgent: string | null;
  failureCount: number;
  locked: boolean;
  lockoutMinutes: number | null;
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function buildAdminLoginFailureEmailContent(
  input: AdminLoginFailureNotifyInput
) {
  const attemptedEmail = input.email.trim() || '(empty)';
  const email = escapeHtml(attemptedEmail);
  const ipAddress = escapeHtml(input.ipAddress || 'unknown');
  const userAgent = escapeHtml(input.userAgent?.trim() || 'unknown');
  const occurredAt = new Date().toISOString();
  const statusLabel = input.locked
    ? `Locked for ${input.lockoutMinutes ?? 10} minutes`
    : 'Failed attempt';
  const statusHtml = escapeHtml(statusLabel);

  const text = [
    'Failed admin login attempt',
    '',
    `Status: ${statusLabel}`,
    `Attempted email: ${attemptedEmail}`,
    `IP address: ${input.ipAddress || 'unknown'}`,
    `User agent: ${input.userAgent?.trim() || 'unknown'}`,
    `Failure count: ${input.failureCount}`,
    `Time (UTC): ${occurredAt}`,
    '',
    'This alert was sent by the portfolio admin login monitor.',
  ].join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Failed admin login</title>
  </head>
  <body style="margin:0;padding:0;background-color:#0b0b0b;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#0b0b0b;margin:0;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;background-color:#121212;border:1px solid rgba(255,255,255,0.12);border-radius:20px;overflow:hidden;">
            <tr>
              <td style="padding:28px 28px 20px 28px;border-bottom:1px solid rgba(255,255,255,0.08);">
                <p style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#a3a3a3;">
                  Admin security
                </p>
                <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.2;font-weight:700;color:#ffffff;">
                  Failed <span style="color:#b6f34b;">login</span>
                </h1>
                <p style="margin:12px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#a3a3a3;">
                  Someone tried to sign in to the admin area with invalid credentials.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 28px 28px 28px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:16px;background-color:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:16px;">
                  <tr>
                    <td style="padding:18px 20px;border-bottom:1px solid rgba(255,255,255,0.08);">
                      <p style="margin:0 0 6px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#b6f34b;">
                        Status
                      </p>
                      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.5;color:#ffffff;">
                        ${statusHtml}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:18px 20px;border-bottom:1px solid rgba(255,255,255,0.08);">
                      <p style="margin:0 0 6px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#b6f34b;">
                        Attempted email
                      </p>
                      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.5;color:#ffffff;">
                        ${email}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:18px 20px;border-bottom:1px solid rgba(255,255,255,0.08);">
                      <p style="margin:0 0 6px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#b6f34b;">
                        IP address
                      </p>
                      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.5;color:#ffffff;">
                        ${ipAddress}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:18px 20px;border-bottom:1px solid rgba(255,255,255,0.08);">
                      <p style="margin:0 0 6px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#b6f34b;">
                        Failure count
                      </p>
                      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.5;color:#ffffff;">
                        ${input.failureCount}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:18px 20px;border-bottom:1px solid rgba(255,255,255,0.08);">
                      <p style="margin:0 0 6px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#b6f34b;">
                        Time (UTC)
                      </p>
                      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.5;color:#ffffff;">
                        ${escapeHtml(occurredAt)}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:18px 20px;">
                      <p style="margin:0 0 6px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#b6f34b;">
                        User agent
                      </p>
                      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#d4d4d4;word-break:break-word;">
                        ${userAgent}
                      </p>
                    </td>
                  </tr>
                </table>
                <p style="margin:18px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:#737373;">
                  Sent from the portfolio admin login monitor. No password was included.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { html, text };
}
