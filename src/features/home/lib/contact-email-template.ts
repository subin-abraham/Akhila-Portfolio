import type { ContactFormValues } from '@/types/components/contact-section';

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatMessageHtml(message: string) {
  return escapeHtml(message).replaceAll('\n', '<br />');
}

export function buildContactEmailContent(values: ContactFormValues) {
  const name = escapeHtml(values.name);
  const email = escapeHtml(values.email);
  const subject = values.subject.trim()
    ? escapeHtml(values.subject.trim())
    : 'No subject';
  const messageHtml = formatMessageHtml(values.message);
  const mailto = `mailto:${encodeURIComponent(values.email)}`;

  const text = [
    'New portfolio contact message',
    '',
    `Name: ${values.name}`,
    `Email: ${values.email}`,
    `Subject: ${values.subject.trim() || '(none)'}`,
    '',
    values.message,
  ].join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>New portfolio contact</title>
  </head>
  <body style="margin:0;padding:0;background-color:#0b0b0b;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#0b0b0b;margin:0;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;background-color:#121212;border:1px solid rgba(255,255,255,0.12);border-radius:20px;overflow:hidden;">
            <tr>
              <td style="padding:28px 28px 20px 28px;border-bottom:1px solid rgba(255,255,255,0.08);">
                <p style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#a3a3a3;">
                  Portfolio contact
                </p>
                <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.2;font-weight:700;color:#ffffff;">
                  Get in <span style="color:#b6f34b;">Touch</span>
                </h1>
                <p style="margin:12px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#a3a3a3;">
                  A new message arrived from your website contact form.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 28px 0 28px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:16px;background-color:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:16px;">
                  <tr>
                    <td style="padding:18px 20px;border-bottom:1px solid rgba(255,255,255,0.08);">
                      <p style="margin:0 0 6px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#b6f34b;">
                        Name
                      </p>
                      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.5;color:#ffffff;">
                        ${name}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:18px 20px;border-bottom:1px solid rgba(255,255,255,0.08);">
                      <p style="margin:0 0 6px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#b6f34b;">
                        Email
                      </p>
                      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.5;">
                        <a href="${mailto}" style="color:#ffffff;text-decoration:underline;">${email}</a>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:18px 20px;">
                      <p style="margin:0 0 6px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#b6f34b;">
                        Subject
                      </p>
                      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.5;color:#ffffff;">
                        ${subject}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 28px 28px 28px;">
                <p style="margin:0 0 10px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:#b6f34b;">
                  Message
                </p>
                <div style="padding:18px 20px;background-color:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:16px;">
                  <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:#d4d4d4;">
                    ${messageHtml}
                  </p>
                </div>
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-top:24px;">
                  <tr>
                    <td style="border-radius:10px;background-color:#b6f34b;">
                      <a href="${mailto}" style="display:inline-block;padding:12px 18px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;color:#111111;text-decoration:none;">
                        Reply to ${name}
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 24px 28px;">
                <div style="height:2px;border-radius:999px;background:linear-gradient(90deg,transparent,#b6f34b,transparent);"></div>
                <p style="margin:14px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:#737373;">
                  Sent from the Akhila Anns Jacob portfolio contact form.
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
