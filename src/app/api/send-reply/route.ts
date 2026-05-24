import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { to, name, subject, replyMessage, originalMessage } = await request.json();
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ success: false, error: "Resend not configured" }, { status: 500 });
    }

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#050505;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#050505;padding:24px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:560px;background:#0a0a0a;border-radius:16px;border:1px solid #1a1a1a;overflow:hidden;">
          
          <!-- Header with Logo -->
          <tr>
            <td style="padding:32px 32px 20px;text-align:center;background:linear-gradient(180deg,#0a0a0a 0%,#141414 100%);">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:16px;">
                    <img src="https://esskaytonality.com/logo-email.png" alt="ESSKAYTONALITY" width="48" height="48" style="border-radius:12px;display:block;" />
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <h1 style="margin:0;font-size:22px;font-weight:800;letter-spacing:3px;color:#ffffff;text-transform:uppercase;">ESSKAYTONALITY</h1>
                    <p style="margin:4px 0 0;font-size:11px;font-weight:600;letter-spacing:4px;color:#6b7280;text-transform:uppercase;">Global Music Entertainment</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="height:1px;background:linear-gradient(90deg,transparent,#2a2a2a,transparent);"></td></tr>
              </table>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:24px 32px 0;">
              <p style="margin:0 0 4px;font-size:14px;color:#9ca3af;">Dear <strong style="color:#ffffff;">${name}</strong>,</p>
            </td>
          </tr>

          <!-- Reply Message -->
          <tr>
            <td style="padding:16px 32px;">
              <div style="background:#141414;border:1px solid #1f1f1f;border-radius:12px;padding:20px;">
                <p style="margin:0;font-size:15px;line-height:1.7;color:#e5e7eb;white-space:pre-wrap;">${replyMessage}</p>
              </div>
            </td>
          </tr>

          <!-- Signature -->
          <tr>
            <td style="padding:0 32px 16px;">
              <p style="margin:0 0 4px;font-size:14px;color:#9ca3af;">Best regards,</p>
              <p style="margin:0;font-size:15px;font-weight:700;color:#ffffff;">Sahir Alam</p>
              <p style="margin:2px 0 0;font-size:12px;color:#6b7280;">Founder &amp; CEO, ESSKAYTONALITY</p>
            </td>
          </tr>

          <!-- Original Message Quote -->
          <tr>
            <td style="padding:0 32px 24px;">
              <details style="background:#141414;border:1px solid #1f1f1f;border-radius:12px;overflow:hidden;">
                <summary style="padding:12px 16px;cursor:pointer;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:1px;user-select:none;">
                  ─ Original Message ─
                </summary>
                <div style="padding:4px 16px 16px;border-top:1px solid #1f1f1f;">
                  <p style="margin:12px 0 0;font-size:13px;line-height:1.6;color:#9ca3af;white-space:pre-wrap;">${originalMessage}</p>
                </div>
              </details>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:0 32px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="height:1px;background:linear-gradient(90deg,transparent,#2a2a2a,transparent);"></td></tr>
              </table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding-top:16px;">
                <tr>
                  <td align="center" style="font-size:11px;color:#525252;line-height:1.6;">
                    <p style="margin:0;">Rotterdam, Netherlands</p>
                    <p style="margin:4px 0 0;">&copy; ${new Date().getFullYear()} ESSKAYTONALITY. All rights reserved.</p>
                    <p style="margin:4px 0 0;">
                      <a href="https://esskaytonality.com" style="color:#B91C1C;text-decoration:none;">esskaytonality.com</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "Sahir Alam — ESSKAYTONALITY <contact@esskaytonality.com>",
        to: [to],
        subject: `Re: ${subject}`,
        html,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Resend error:", text);
      return NextResponse.json({ success: false, error: text }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Send reply error:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
