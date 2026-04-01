import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    const { email, name, event, date, time, location, price } = await req.json();

    const bookingRef = "RES-" + Math.random().toString(36).substring(2, 8).toUpperCase();

    try {
        const data = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: `Booking Confirmed – ${event} 🎟️`,
            html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0f172a;font-family:Arial,sans-serif;color:#f1f5f9;">
  <div style="max-width:560px;margin:40px auto;background:#1e293b;border-radius:16px;overflow:hidden;">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1d4ed8,#6366f1);padding:32px;text-align:center;">
      <h1 style="margin:0;font-size:28px;letter-spacing:2px;color:#fff;">🎟️ RESERVA</h1>
      <p style="margin:8px 0 0;color:#bfdbfe;font-size:14px;">Your booking is confirmed</p>
    </div>

    <!-- Body -->
    <div style="padding:32px;">
      <p style="font-size:16px;margin:0 0 24px;">Hi <strong>${name}</strong>,</p>
      <p style="font-size:15px;color:#94a3b8;margin:0 0 28px;">
        Your booking for <strong style="color:#f1f5f9;">${event}</strong> has been successfully confirmed. See you there!
      </p>

      <!-- Event Details Box -->
      <div style="background:#0f172a;border-radius:12px;padding:24px;margin-bottom:28px;">
        <h3 style="margin:0 0 16px;font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#64748b;">Event Details</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;color:#64748b;font-size:14px;">📅 Date</td>
            <td style="padding:8px 0;font-size:14px;text-align:right;">${date}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b;font-size:14px;">🕐 Time</td>
            <td style="padding:8px 0;font-size:14px;text-align:right;">${time}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b;font-size:14px;">📍 Location</td>
            <td style="padding:8px 0;font-size:14px;text-align:right;">${location}</td>
          </tr>
        </table>
      </div>

      <!-- Receipt Box -->
      <div style="background:#0f172a;border-radius:12px;padding:24px;margin-bottom:28px;">
        <h3 style="margin:0 0 16px;font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#64748b;">Receipt</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;color:#64748b;font-size:14px;">Booking Ref</td>
            <td style="padding:8px 0;font-size:14px;text-align:right;font-family:monospace;color:#6366f1;">${bookingRef}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b;font-size:14px;">Event</td>
            <td style="padding:8px 0;font-size:14px;text-align:right;">${event}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b;font-size:14px;">Attendee</td>
            <td style="padding:8px 0;font-size:14px;text-align:right;">${name}</td>
          </tr>
          <tr style="border-top:1px solid #1e293b;">
            <td style="padding:12px 0 4px;font-size:15px;font-weight:bold;">Total Paid</td>
            <td style="padding:12px 0 4px;font-size:15px;font-weight:bold;text-align:right;color:#22c55e;">${price}</td>
          </tr>
        </table>
      </div>

      <p style="font-size:13px;color:#475569;text-align:center;margin:0;">
        Questions? Reply to this email and we'll help you out.
      </p>
    </div>

    <!-- Footer -->
    <div style="padding:20px;text-align:center;border-top:1px solid #334155;">
      <p style="margin:0;font-size:12px;color:#475569;">© 2026 RESERVA · All rights reserved</p>
    </div>

  </div>
</body>
</html>`,
        });

        return Response.json(data);
    } catch (error) {
        return Response.json({ error });
    }
}
