import { getSiteData } from "@/lib/site-data";
import { notFound } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export default async function PrivacyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const site = await getSiteData(id);
  if (!site) notFound();

  const { palette } = site;
  const privacy = (site.fullGeneratedCopy.privacyPolicy as string) || "";

  return (
    <div style={{ backgroundColor: palette.bg, color: palette.text }}>
      <SiteNav id={id} name={site.startupName} palette={palette} />

      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose max-w-none">
            {privacy.split("\n\n").map((para, i) => {
              if (i === 0) return <h1 key={i} className="text-3xl font-bold mb-8">{para}</h1>;
              if (para.startsWith("- ")) {
                return (
                  <ul key={i} className="list-disc pl-6 mb-4 text-gray-600">
                    {para.split("\n").map((item, j) => (
                      <li key={j} className="mb-1">{item.replace("- ", "")}</li>
                    ))}
                  </ul>
                );
              }
              const isHeading = para.length < 60 && !para.includes(".");
              if (isHeading) return <h2 key={i} className="text-xl font-semibold mt-8 mb-3" style={{ color: palette.text }}>{para}</h2>;
              return <p key={i} className="text-gray-600 leading-relaxed mb-4">{para}</p>;
            })}
          </div>
        </div>
      </section>

      <SiteFooter id={id} name={site.startupName} palette={palette} />
    </div>
  );
}
