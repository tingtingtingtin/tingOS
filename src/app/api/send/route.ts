import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { category, message, contact } = await req.json();

    const { data, error } = await resend.emails.send({
      from: "tingOS Bot <onboarding@resend.dev>",
      to: "twu062604@gmail.com",
      subject: `Inquiry from tingOS: ${category}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2563eb;">New Message from tingOS</h2>
          <p><strong>Category:</strong> ${category}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #2563eb;">
            ${message}
          </div>
          <p><strong>Sender Info:</strong> ${contact}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">Sent via tingOS</p>
        </div>
      `,
    });

    if (error) return NextResponse.json({ error }, { status: 400 });
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error: " + err },
      { status: 500 },
    );
  }
}
