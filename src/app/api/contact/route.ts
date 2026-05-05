import { NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/mailgun";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await sendContactEmail(body);

    if (result.success) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: result.error }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
