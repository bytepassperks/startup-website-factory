import { NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/mailgun";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { generationId } = body as { generationId?: string };

  const result = await sendContactEmail({
    name: "Test User",
    email: "test@example.com",
    message: "This is a test email from Startup Website Factory to verify Mailgun is configured correctly.",
    company: "Test Company",
    generationId,
  });

  return NextResponse.json(result);
}
