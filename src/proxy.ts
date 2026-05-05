import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

const domainCache = new Map<string, { id: string | null; expires: number }>();
const CACHE_TTL = 60_000;

async function lookupDomain(domain: string): Promise<string | null> {
  const cached = domainCache.get(domain);
  if (cached && cached.expires > Date.now()) return cached.id;

  const gen = await prisma.generation.findFirst({
    where: { purchasedDomain: domain, archived: false },
    select: { id: true },
  });

  const id = gen?.id ?? null;
  domainCache.set(domain, { id, expires: Date.now() + CACHE_TTL });
  return id;
}

export async function proxy(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-host");
  const hostname = forwarded || request.headers.get("host") || "";
  const host = hostname.split(":")[0];

  if (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.endsWith(".onrender.com")
  ) {
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname;

  // Redirect /site/{id}/... to clean URL on custom domains
  const siteMatch = pathname.match(/^\/site\/[^/]+(\/.*)?$/);
  if (siteMatch) {
    const rest = siteMatch[1] || "/";
    return NextResponse.redirect(new URL(rest, request.url));
  }

  // Skip factory admin pages on custom domains
  if (
    pathname.startsWith("/configure") ||
    pathname.startsWith("/edit") ||
    pathname.startsWith("/preview") ||
    pathname.startsWith("/generate")
  ) {
    return NextResponse.next();
  }

  const bare = host.replace(/^www\./, "");
  const generationId = await lookupDomain(bare);
  if (!generationId) return NextResponse.next();

  const sitePath =
    pathname === "/" ? `/site/${generationId}` : `/site/${generationId}${pathname}`;
  const url = request.nextUrl.clone();
  url.pathname = sitePath;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-custom-domain", "1");

  return NextResponse.rewrite(url, {
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
