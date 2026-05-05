import { getSiteData } from "@/lib/site-data";
import { notFound } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export default async function FeaturesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const site = await getSiteData(id);
  if (!site) notFound();

  const { palette, featureList, selectedImages } = site;

  return (
    <div style={{ backgroundColor: palette.bg, color: palette.text }}>
      <SiteNav id={id} name={site.startupName} palette={palette} />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4" style={{ color: palette.text }}>
              Features That Set Us Apart
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Everything you need to transform your {site.category.toLowerCase()} workflow. Built for {site.targetAudience}.
            </p>
          </div>

          <div className="space-y-16">
            {featureList.map((feature, i) => (
              <div key={i} className={`flex flex-col md:flex-row gap-8 items-center ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: palette.primary }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3" style={{ color: palette.text }}>{feature.name}</h3>
                  <p className="text-gray-500 leading-relaxed">{feature.description}</p>
                </div>
                <div className="flex-1">
                  {selectedImages[i % selectedImages.length] ? (
                    <img
                      src={selectedImages[i % selectedImages.length].url}
                      alt={feature.name}
                      className="rounded-xl shadow-md w-full h-64 object-cover"
                    />
                  ) : (
                    <div className="rounded-xl w-full h-64 flex items-center justify-center" style={{ backgroundColor: palette.accent + "40" }}>
                      <span className="text-4xl font-bold" style={{ color: palette.primary }}>{String(i + 1).padStart(2, "0")}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter id={id} name={site.startupName} palette={palette} />
    </div>
  );
}
