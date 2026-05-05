import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const PROXY_IP = process.env.NEXT_PUBLIC_PROXY_IP || "168.144.89.128";

async function verifyDomainLive(domain: string): Promise<{ live: boolean; reason: string }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    const res = await fetch(`https://${domain}/`, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(timeout);

    if (res.ok || res.status === 308 || res.status === 307) {
      return { live: true, reason: `Domain responded with status ${res.status}` };
    }
    return { live: false, reason: `Domain responded with status ${res.status}` };
  } catch (err) {
    return { live: false, reason: `Domain not reachable: ${String(err)}` };
  }
}

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

    const domain = generation.purchasedDomain;

    if (!domain) {
      await prisma.generation.update({
        where: { id: generationId },
        data: { deploymentStatus: "ready" },
      });

      const record = await prisma.deploymentRecord.create({
        data: {
          generationId,
          status: "ready",
          renderUrl: process.env.APP_URL || null,
          logs: "No purchased domain configured. Set a domain in Configure to deploy.",
        },
      });

      return NextResponse.json({
        success: true,
        deployment: record,
        message: "No domain configured. Go to Configure and set a purchased domain first.",
      });
    }

    const check = await verifyDomainLive(domain);

    const newStatus = check.live ? "deployed" : "ready";

    await prisma.generation.update({
      where: { id: generationId },
      data: { deploymentStatus: newStatus },
    });

    const record = await prisma.deploymentRecord.create({
      data: {
        generationId,
        status: newStatus,
        renderUrl: `https://${domain}`,
        logs: check.live
          ? `Domain ${domain} is live and serving traffic through Caddy proxy (${PROXY_IP}). SSL certificate active.`
          : `Domain ${domain} is not yet reachable. ${check.reason}\n\nEnsure DNS A record for ${domain} points to ${PROXY_IP}. SSL will be auto-provisioned once DNS propagates.`,
      },
    });

    return NextResponse.json({
      success: true,
      deployment: record,
      live: check.live,
      domain,
      message: check.live
        ? `${domain} is deployed and live!`
        : `Domain not yet reachable. Point DNS A record to ${PROXY_IP} and retry.`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Deployment failed", details: String(error) },
      { status: 500 }
    );
  }
}
