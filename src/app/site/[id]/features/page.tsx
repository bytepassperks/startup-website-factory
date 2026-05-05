import { getSiteData } from "@/lib/site-data";
import { getLayoutConfig } from "@/lib/layout-config";
import { getBasePath } from "@/lib/site-href";
import { notFound } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import ScrollAnimator from "@/components/ScrollAnimator";

export default async function FeaturesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const site = await getSiteData(id);
  if (!site) notFound();

  const { palette, featureList, selectedImages } = site;
  const lc = getLayoutConfig(site.layoutVariant);
  const basePath = await getBasePath(id);

  return (
    <div style={{ backgroundColor: palette.bg, color: palette.text }}>
      <SiteNav name={site.startupName} palette={palette} basePath={basePath} />

      <section className={lc.sectionSpacing}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className={`text-4xl font-bold mb-4 ${lc.animClass}`} style={{ color: palette.text }}>
              Features That Set Us Apart
            </h1>
            <p className={`text-lg text-gray-500 max-w-2xl mx-auto ${lc.animClass}`} style={{ transitionDelay: "100ms" }}>
              Everything you need to transform your {site.category.toLowerCase()} workflow. Built for {site.targetAudience}.
            </p>
          </div>

          {lc.featureStyle === "alternating" || lc.featureStyle === "list" ? (
            <div className="space-y-16">
              {featureList.map((feature, i) => (
                <div key={i} className={`flex flex-col md:flex-row gap-8 items-center ${i % 2 === 1 ? "md:flex-row-reverse" : ""} ${i % 2 === 0 ? "anim-fade-left" : "anim-fade-right"}`}
                  style={{ transitionDelay: `${i * 80}ms` }}>
                  <div className="flex-1">
                    <span className="text-sm font-bold uppercase tracking-wide mb-2 block" style={{ color: palette.primary }}>
                      Feature {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-2xl font-bold mb-3" style={{ color: palette.text }}>{feature.name}</h3>
                    <p className="text-gray-500 leading-relaxed">{feature.description}</p>
                  </div>
                  <div className="flex-1">
                    {selectedImages[i % selectedImages.length] ? (
                      <img src={selectedImages[i % selectedImages.length].url} alt={feature.name}
                        className={`${lc.borderRadius} shadow-md w-full h-64 object-cover`} />
                    ) : (
                      <div className={`${lc.borderRadius} w-full h-64 flex items-center justify-center`} style={{ backgroundColor: palette.primary + "10" }}>
                        <span className="text-5xl font-black" style={{ color: palette.primary + "30" }}>{String(i + 1).padStart(2, "0")}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : lc.featureStyle === "bento" ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {featureList.map((feature, i) => {
                const span = i === 0 ? "md:col-span-2 md:row-span-2" : i < 3 ? "md:col-span-2" : "";
                return (
                  <div key={i} className={`${span} p-6 ${lc.borderRadius} border border-gray-100 bg-white hover:shadow-lg transition-shadow anim-scale-in`}
                    style={{ transitionDelay: `${i * 80}ms` }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm mb-4" style={{ backgroundColor: palette.primary }}>
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <h3 className="font-semibold text-lg mb-2" style={{ color: palette.text }}>{feature.name}</h3>
                    <p className="text-sm text-gray-500">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          ) : lc.featureStyle === "cards-icon" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featureList.map((feature, i) => (
                <div key={i} className={`${lc.borderRadius} p-8 text-center hover:shadow-xl transition-shadow bg-white border border-gray-100 anim-blur-in`}
                  style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center text-2xl"
                    style={{ backgroundColor: palette.primary + "15", color: palette.primary }}>
                    {["⚡", "🎯", "🔒", "📊", "🚀", "💡", "🔗", "📈"][i % 8]}
                  </div>
                  <h3 className="font-bold mb-2 text-lg" style={{ color: palette.text }}>{feature.name}</h3>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          ) : lc.featureStyle === "grid-2" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {featureList.map((feature, i) => (
                <div key={i} className={`p-8 ${lc.borderRadius} border-l-4 bg-white shadow-sm anim-fade-up`}
                  style={{ borderLeftColor: palette.primary, transitionDelay: `${i * 100}ms` }}>
                  <h3 className="font-bold text-lg mb-2" style={{ color: palette.text }}>{feature.name}</h3>
                  <p className="text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featureList.map((feature, i) => (
                <div key={i} className={`p-6 ${lc.borderRadius} border border-gray-100 bg-white hover:shadow-lg transition-shadow ${lc.animClass}`}
                  style={{ transitionDelay: `${i * 80}ms` }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm mb-4" style={{ backgroundColor: palette.primary }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="font-semibold mb-2" style={{ color: palette.text }}>{feature.name}</h3>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <SiteFooter name={site.startupName} palette={palette} basePath={basePath} />
      <ScrollAnimator />
    </div>
  );
}
