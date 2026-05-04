import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { generationId } = await request.json();

    if (!generationId) {
      return NextResponse.json({ error: "generationId required" }, { status: 400 });
    }

    const generation = await prisma.generation.findUnique({
      where: { id: generationId },
    });

    if (!generation) {
      return NextResponse.json({ error: "Generation not found" }, { status: 404 });
    }

    await prisma.generation.update({
      where: { id: generationId },
      data: { deploymentStatus: "ready" },
    });

    const record = await prisma.deploymentRecord.create({
      data: {
        generationId,
        status: "ready",
        renderUrl: process.env.APP_URL || null,
        logs: "Marked as ready for Render deployment. Deploy the app to Render using render.yaml to make this site live.",
      },
    });

    return NextResponse.json({
      success: true,
      deployment: record,
      message: "Generation marked as ready. Deploy to Render using the render.yaml blueprint.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Deployment failed", details: String(error) },
      { status: 500 }
    );
  }
}
