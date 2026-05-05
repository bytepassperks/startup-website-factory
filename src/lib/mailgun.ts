import { getDomainConfig } from "@/lib/site-data";
import { decrypt } from "@/lib/crypto";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
  honeypot?: string;
  company?: string;
  generationId?: string;
}

interface MailResult {
  success: boolean;
  error?: string;
}

async function getMailConfig(generationId?: string) {
  const config = await getDomainConfig(generationId);

  let apiKey: string | undefined;
  if (config.mailgunApiKey) {
    try {
      apiKey = decrypt(config.mailgunApiKey);
    } catch {
      apiKey = undefined;
    }
  }
  if (!apiKey) {
    apiKey = process.env.MAILGUN_API_KEY;
  }

  const domain = config.mailgunDomain || process.env.MAILGUN_DOMAIN;
  const fromEmail = config.mailgunFromEmail || process.env.MAILGUN_FROM_EMAIL;
  const toEmail = config.mailgunToEmail || process.env.MAILGUN_TO_EMAIL;
  const replyTo = config.gmailReplyTo;

  return { apiKey, domain, fromEmail, toEmail, replyTo };
}

export async function sendContactEmail(data: ContactFormData): Promise<MailResult> {
  if (data.honeypot) {
    return { success: true };
  }

  if (!data.name || !data.email || !data.message) {
    return { success: false, error: "All fields are required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { success: false, error: "Invalid email address" };
  }

  const { apiKey, domain, fromEmail, toEmail, replyTo } = await getMailConfig(data.generationId);

  if (!apiKey || !domain || !fromEmail || !toEmail) {
    return { success: false, error: "Mail service not configured" };
  }

  try {
    const formData = new URLSearchParams();
    formData.append("from", `${data.name} <${fromEmail}>`);
    formData.append("to", toEmail);
    formData.append("subject", `Contact Form: ${data.name} (${data.company || "N/A"})`);
    formData.append(
      "text",
      `Name: ${data.name}\nEmail: ${data.email}\nCompany: ${data.company || "N/A"}\n\nMessage:\n${data.message}`
    );
    formData.append("h:Reply-To", replyTo || data.email);

    const res = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!res.ok) {
      const errText = await res.text();
      return { success: false, error: `Mail send failed: ${errText}` };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: `Mail send error: ${err instanceof Error ? err.message : "Unknown"}` };
  }
}
