import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
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

/** Get a best-effort client IP for rate limiting (e.g. from Vercel/Proxies). */
function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

/** Contact form: 5 submissions per 15 minutes per IP. */
const CONTACT_RATE_LIMIT = 5;
const CONTACT_WINDOW_MS = 15 * 60 * 1000;

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rlKey = `contact:${ip}`;
  const { success } = rateLimit(rlKey, CONTACT_RATE_LIMIT, CONTACT_WINDOW_MS);
  if (!success) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again in a few minutes." },
      { status: 429 }
    );
  }

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
