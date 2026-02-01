import nodemailer from "nodemailer";

const transporter = (() => {
  const url = process.env.EMAIL_SERVER;
  if (!url) return null;
  try {
    return nodemailer.createTransport(url);
  } catch {
    return null;
  }
})();

/** Send a plain text email. Returns true if sent, false if EMAIL_SERVER not configured or send failed. */
export async function sendEmail(options: {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<boolean> {
  const from = process.env.EMAIL_FROM || process.env.CONTACT_EMAIL || "noreply@sitebotgpt.com";
  if (!transporter) return false;
  try {
    await transporter.sendMail({
      from,
      to: options.to,
      replyTo: options.replyTo,
      subject: options.subject,
      text: options.text,
    });
    return true;
  } catch (e) {
    console.error("sendEmail error:", e);
    return false;
  }
}
