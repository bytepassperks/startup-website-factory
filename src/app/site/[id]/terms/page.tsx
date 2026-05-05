import { getSiteData } from "@/lib/site-data";
import { getBasePath } from "@/lib/site-href";
import { notFound } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default async function TermsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const site = await getSiteData(id);
  if (!site) notFound();

  const { palette } = site;
  const basePath = await getBasePath(id);
  const terms = (site.fullGeneratedCopy.termsOfService as string) || "";

  return (
    <div style={{ backgroundColor: palette.bg, color: palette.text }}>
      <SiteNav name={site.startupName} palette={palette} basePath={basePath} />

      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose max-w-none">
            {terms.split("\n\n").map((para, i) => {
              if (i === 0) return <h1 key={i} className="text-3xl font-bold mb-8">{para}</h1>;
              const isHeading = para.length < 60 && !para.includes(".");
              if (isHeading) return <h2 key={i} className="text-xl font-semibold mt-8 mb-3" style={{ color: palette.text }}>{para}</h2>;
              return <p key={i} className="text-gray-600 leading-relaxed mb-4">{para}</p>;
            })}
          </div>
        </div>
      </section>

      <SiteFooter name={site.startupName} palette={palette} basePath={basePath} />
    </div>
  );
}
