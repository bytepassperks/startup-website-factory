import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const archived = searchParams.get("archived") === "true";
  const id = searchParams.get("id");

  if (id) {
    const generation = await prisma.generation.findUnique({
      where: { id },
      include: { matches: true },
    });
    if (!generation) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(generation);
  }

  const generations = await prisma.generation.findMany({
    where: { archived },
    orderBy: { createdAt: "desc" },
    include: { matches: true },
  });

  return NextResponse.json(generations);
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  const allowedFields = [
    "startupName", "tagline", "founderName", "founderBio",
    "domainSuggestion", "heroHeadline", "heroSubheadline",
    "founderEmailPattern", "archived", "deploymentStatus", "mailgunStatus",
  ];

  const filtered: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if (key in updates) {
      filtered[key] = updates[key];
    }
  }

  const generation = await prisma.generation.update({
    where: { id },
    data: filtered,
  });

  return NextResponse.json(generation);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  await prisma.generation.update({
    where: { id },
    data: { archived: true },
  });

  return NextResponse.json({ success: true });
}
