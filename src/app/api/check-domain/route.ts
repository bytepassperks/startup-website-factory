import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get("domain");

  if (!domain) {
    return NextResponse.json({ error: "missing domain" }, { status: 400 });
  }

  const bare = domain.replace(/^www\./, "");

  const gen = await prisma.generation.findFirst({
    where: { purchasedDomain: bare, archived: false },
    select: { id: true },
  });

  if (!gen) {
    return NextResponse.json({ error: "unknown domain" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
