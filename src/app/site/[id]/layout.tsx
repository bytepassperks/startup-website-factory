import { getSiteData } from "@/lib/site-data";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const site = await getSiteData(id);
  if (!site) return {};

  const seo = site.seoMeta;

  return {
    title: {
      default: seo?.title || site.startupName,
      template: `%s | ${site.startupName}`,
    },
    description: seo?.description || site.tagline,
    keywords: seo?.keywords,
  };
}

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
