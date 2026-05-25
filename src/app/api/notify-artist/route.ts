import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { to, artistName, title, status } = await request.json();
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ success: false, message: "Resend not configured" });
    }

    const isApproved = status === "approved";

    const subject = isApproved
      ? `Your track "${title}" has been approved!`
      : `Update on your submission "${title}"`;

    const heading = isApproved
      ? "Release Approved"
      : "Submission Update";

    const message = isApproved
      ? `Your track <strong>${title}</strong> has been reviewed and <strong style="color:#22c55e;">approved</strong> by the Esskaytonality team.`
      : `Your track <strong>${title}</strong> has been reviewed and was <strong style="color:#ef4444;">not approved</strong> at this time.`;

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#050505;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#050505;padding:24px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:560px;background:#0a0a0a;border-radius:16px;border:1px solid #1a1a1a;overflow:hidden;">

        <tr><td style="padding:32px 32px 20px;text-align:center;background:linear-gradient(180deg,#0a0a0a 0%,#141414 100%);">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center" style="padding-bottom:16px;">
              <img src="https://esskaytonality.com/logo-email.png" alt="ESSKAYTONALITY" width="48" height="48" style="border-radius:12px;display:block;" />
            </td></tr>
            <tr><td align="center">
              <h1 style="margin:0;font-size:22px;font-weight:800;letter-spacing:3px;color:#ffffff;text-transform:uppercase;">ESSKAYTONALITY</h1>
              <p style="margin:4px 0 0;font-size:11px;font-weight:600;letter-spacing:4px;color:#6b7280;text-transform:uppercase;">${heading}</p>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding:0 32px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:1px;background:linear-gradient(90deg,transparent,#2a2a2a,transparent);"></td></tr></table></td></tr>

        <tr><td style="padding:24px 32px;">
          <p style="margin:0 0 20px;font-size:14px;color:#9ca3af;">Dear <strong style="color:#ffffff;">${artistName}</strong>,</p>
          <div style="background:#141414;border:1px solid #1f1f1f;border-radius:12px;padding:20px;">
            <p style="margin:0;font-size:15px;line-height:1.7;color:#e5e7eb;">${message}</p>
          </div>

          ${isApproved ? `
          <div style="margin-top:20px;padding:16px;background:#22c55e/10;border:1px solid #22c55e/30;border-radius:8px;text-align:center;">
            <p style="margin:0 0 4px;font-size:15px;color:#22c55e;font-weight:700;">Ready to Publish</p>
            <p style="margin:0;font-size:13px;color:#9ca3af;">Your music will be published on our platforms.</p>
          </div>` : `
          <div style="margin-top:20px;padding:16px;background:#ef4444/10;border:1px solid #ef4444/30;border-radius:8px;">
            <p style="margin:0;font-size:13px;color:#ef4444;font-weight:600;">We encourage you to review and resubmit with improvements.</p>
          </div>`}
        </td></tr>

        <tr><td style="padding:0 32px 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="height:1px;background:linear-gradient(90deg,transparent,#2a2a2a,transparent);"></td></tr>
          </table>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding-top:16px;">
            <tr><td align="center" style="font-size:11px;color:#525252;line-height:1.6;">
              <p style="margin:0;">ESSKAYTONALITY</p>
              <p style="margin:4px 0 0;">&copy; ${new Date().getFullYear()} ESSKAYTONALITY</p>
            </td></tr>
          </table>
        </td></tr>

      </table>
    </td></tr>
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
        from: "ESSKAYTONALITY <contact@esskaytonality.com>",
        to: [to],
        subject,
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
    console.error("Notify artist error:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
