import { getSiteData } from "@/lib/site-data";
import { getLayoutConfig } from "@/lib/layout-config";
import { getBasePath } from "@/lib/site-href";
import { notFound } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import ScrollAnimator from "@/components/ScrollAnimator";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

export default async function AboutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const site = await getSiteData(id);
  if (!site) notFound();

  const { palette, selectedImages } = site;
  const lc = getLayoutConfig(site.layoutVariant);
  const basePath = await getBasePath(id);
  const founderImg = selectedImages[1]?.url;
  const isCard = lc.heroStyle === "center" || lc.heroStyle === "glass";

  return (
    <div style={{ backgroundColor: palette.bg, color: palette.text }}>
      <SiteNav name={site.startupName} palette={palette} basePath={basePath} />

      {/* About Hero */}
      <section className="relative overflow-hidden" style={{ backgroundColor: palette.primary }}>
        <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ${lc.heroStyle === "bold" ? "py-28" : "py-20"} text-center`}>
          <h1 className={`text-4xl md:text-5xl font-extrabold text-white mb-4 ${lc.animClass}`}>
            About {site.startupName}
          </h1>
          <p className={`text-lg text-white/80 max-w-2xl mx-auto ${lc.animClass}`} style={{ transitionDelay: "100ms" }}>
            {site.aboutCopy}
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className={lc.sectionSpacing}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid md:grid-cols-2 gap-12 items-center ${isCard ? "md:grid-cols-1 text-center" : ""}`}>
            <div className={isCard ? "" : "anim-fade-left"}>
              <h2 className="text-3xl font-bold mb-4" style={{ color: palette.text }}>Our Mission</h2>
              <p className="text-gray-500 leading-relaxed mb-4">{site.problem}</p>
              <p className="text-gray-500 leading-relaxed">{site.solution}</p>
            </div>
            {!isCard && founderImg && (
              <div className="anim-fade-right">
                <img src={founderImg} alt={`${site.startupName} team`}
                  className={`${lc.borderRadius} shadow-xl w-full h-72 object-cover`} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className={lc.sectionSpacing} style={{ backgroundColor: palette.primary + "08" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`${lc.borderRadius} bg-white p-8 shadow-sm ${lc.animClass}`}>
            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-2xl font-bold text-white mb-4"
              style={{ backgroundColor: palette.primary }}>
              {site.founderName.split(" ").map(n => n[0]).join("")}
            </div>
            <h3 className="text-xl font-bold">{site.founderName}</h3>
            <p className="text-sm mb-3" style={{ color: palette.primary }}>{site.founderRole}</p>
            <p className="text-gray-500">{site.founderBio}</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={lc.sectionSpacing}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-bold text-center mb-12 ${lc.animClass}`}>Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Innovation", desc: `We push boundaries in ${site.category.toLowerCase()} to deliver solutions that matter.` },
              { title: "Transparency", desc: "We believe in honest communication and open collaboration with our users." },
              { title: "Excellence", desc: `Every feature we build is crafted with care for ${site.targetAudience}.` },
            ].map((val, i) => (
              <div key={i} className={`${lc.borderRadius} p-6 border border-gray-100 bg-white ${lc.animClass}`}
                style={{ transitionDelay: `${i * 100}ms` }}>
                <h3 className="font-semibold text-lg mb-2" style={{ color: palette.primary }}>{val.title}</h3>
                <p className="text-sm text-gray-500">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter name={site.startupName} palette={palette} basePath={basePath} />
      <ScrollAnimator />
    </div>
  );
}
