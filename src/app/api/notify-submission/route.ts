import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { title, artistName, genre } = await request.json();
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.log("Resend API key not configured, skipping email notification");
      return NextResponse.json({ success: false, message: "Not configured" });
    }

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
              <p style="margin:4px 0 0;font-size:11px;font-weight:600;letter-spacing:4px;color:#6b7280;text-transform:uppercase;">Artist Submission</p>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding:0 32px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:1px;background:linear-gradient(90deg,transparent,#2a2a2a,transparent);"></td></tr></table></td></tr>

        <tr><td style="padding:24px 32px;">
          <p style="margin:0 0 20px;font-size:14px;color:#9ca3af;">A new track has been submitted for review on the platform.</p>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#141414;border:1px solid #1f1f1f;border-radius:12px;overflow:hidden;">
            <tr><td style="padding:16px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding:6px 0;"><span style="font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Track Title</span></td></tr>
                <tr><td style="padding:0 0 12px;"><span style="font-size:16px;font-weight:700;color:#ffffff;">${title}</span></td></tr>
                <tr><td style="padding:6px 0;border-top:1px solid #1f1f1f;"><span style="font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Artist</span></td></tr>
                <tr><td style="padding:0 0 12px;"><span style="font-size:15px;color:#e5e7eb;">${artistName}</span></td></tr>
                <tr><td style="padding:6px 0;border-top:1px solid #1f1f1f;"><span style="font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Genre</span></td></tr>
                <tr><td style="padding:0;"><span style="font-size:15px;color:#e5e7eb;">${genre}</span></td></tr>
              </table>
            </td></tr>
          </table>

          <div style="margin-top:20px;padding:12px 16px;background:#B91C1C/10;border:1px solid #B91C1C/30;border-radius:8px;">
            <p style="margin:0;font-size:13px;color:#ef4444;font-weight:600;">Action Required</p>
            <p style="margin:4px 0 0;font-size:13px;color:#9ca3af;">Review this submission in the <a href="https://esskaytonality.com/admin/dashboard/reviews" style="color:#B91C1C;text-decoration:underline;">Admin Dashboard</a>.</p>
          </div>
        </td></tr>

        <tr><td style="padding:0 32px 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="height:1px;background:linear-gradient(90deg,transparent,#2a2a2a,transparent);"></td></tr>
          </table>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding-top:16px;">
            <tr><td align="center" style="font-size:11px;color:#525252;line-height:1.6;">
              <p style="margin:0;">Rotterdam, Netherlands</p>
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
        from: "ESSKAYTONALITY Submissions <contact@esskaytonality.com>",
        to: "contact@esskaytonality.com",
        subject: `New Track Submission: ${title}`,
        html,
      }),
    });

    if (!res.ok) {
      console.error("Failed to send email via Resend:", await res.text());
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error sending submission notification:", err);
    return NextResponse.json({ success: false, error: String(err) });
  }
}
