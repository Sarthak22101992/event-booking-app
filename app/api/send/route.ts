import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    const { email, name, event } = await req.json();

    try {
        const data = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Booking Confirmed 🎉",
            html: `<p>Hi ${name}, your booking for <b>${event}</b> is confirmed!</p>`,
        });

        return Response.json(data);
    } catch (error) {
        return Response.json({ error });
    }
}