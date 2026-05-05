import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { encrypt, maskApiKey } from "@/lib/crypto";

const DOMAIN_FIELDS = [
  "purchasedDomain",
  "mailgunDomain",
  "mailgunFromEmail",
  "mailgunToEmail",
  "gmailReplyTo",
  "contactFormEmail",
  "mailgunSetup",
] as const;

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gen = await prisma.generation.findUnique({ where: { id } });
  if (!gen) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const config: Record<string, unknown> = {};
  for (const field of DOMAIN_FIELDS) {
    config[field] = gen[field];
  }
  config.startupName = gen.startupName;
  config.domainSuggestion = gen.domainSuggestion;
  config.hasMailgunApiKey = !!gen.mailgunApiKey;
  config.mailgunApiKeyMasked = gen.mailgunApiKey ? maskApiKey("stored-key") : null;

  return NextResponse.json(config);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const updateData: Record<string, unknown> = {};
  for (const field of DOMAIN_FIELDS) {
    if (field in body) {
      updateData[field] = body[field];
    }
  }

  if ("mailgunApiKey" in body) {
    const rawKey = body.mailgunApiKey as string | null;
    if (rawKey && rawKey.trim()) {
      updateData.mailgunApiKey = encrypt(rawKey.trim());
    } else {
      updateData.mailgunApiKey = null;
    }
  }

  const gen = await prisma.generation.update({
    where: { id },
    data: updateData,
  });

  const config: Record<string, unknown> = {};
  for (const field of DOMAIN_FIELDS) {
    config[field] = gen[field];
  }
  config.startupName = gen.startupName;
  config.domainSuggestion = gen.domainSuggestion;
  config.hasMailgunApiKey = !!gen.mailgunApiKey;
  config.mailgunApiKeyMasked = gen.mailgunApiKey ? maskApiKey("stored-key") : null;

  return NextResponse.json(config);
}
