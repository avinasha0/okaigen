import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required").max(500),
  message: z.string().min(10, "Message must be at least 10 characters").max(10000),
});

/** Where contact form submissions are emailed (CONTACT_EMAIL or EMAIL_FROM). */
function getContactToEmail(): string | null {
  return process.env.CONTACT_EMAIL || process.env.EMAIL_FROM || null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      const first = parsed.error.flatten().fieldErrors;
      const msg = Object.values(first)[0]?.[0] ?? "Invalid input";
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    const { name, email, subject, message } = parsed.data;
    await prisma.contactSubmission.create({
      data: { name, email, subject, message },
    });

    // Send notification email to site owner (if EMAIL_SERVER and CONTACT_EMAIL/EMAIL_FROM are set)
    const toEmail = getContactToEmail();
    if (toEmail && process.env.EMAIL_SERVER) {
      await sendEmail({
        to: toEmail,
        subject: `[Contact] ${subject}`,
        text: `New contact form submission\n\nFrom: ${name} <${email}>\nSubject: ${subject}\n\nMessage:\n${message}`,
        replyTo: email,
      });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Contact submission error:", e);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
