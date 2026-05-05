import { getSiteData } from "@/lib/site-data";
import { getLayoutConfig } from "@/lib/layout-config";
import { getBasePath } from "@/lib/site-href";
import { notFound } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import ScrollAnimator from "@/components/ScrollAnimator";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "How It Works" };

export default async function HowItWorksPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const site = await getSiteData(id);
  if (!site) notFound();

  const { palette } = site;
  const steps = (site.fullGeneratedCopy.howItWorks || []) as { title: string; desc: string }[];
  const lc = getLayoutConfig(site.layoutVariant);
  const isAlt = lc.featureStyle === "alternating" || lc.featureStyle === "list";
  const basePath = await getBasePath(id);

  return (
    <div style={{ backgroundColor: palette.bg, color: palette.text }}>
      <SiteNav name={site.startupName} palette={palette} basePath={basePath} />

      <section className={lc.sectionSpacing}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className={`text-4xl font-bold mb-4 ${lc.animClass}`}>How {site.startupName} Works</h1>
            <p className={`text-lg text-gray-500 max-w-2xl mx-auto ${lc.animClass}`} style={{ transitionDelay: "100ms" }}>
              Getting started is simple. Follow these steps and you&apos;ll be up and running in no time.
            </p>
          </div>

          {isAlt ? (
            /* Timeline style */
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5" style={{ backgroundColor: palette.primary + "30" }} />
              <div className="space-y-12">
                {steps.map((step, i) => (
                  <div key={i} className={`flex gap-6 items-start anim-fade-left`} style={{ transitionDelay: `${i * 120}ms` }}>
                    <div className="flex-shrink-0 relative z-10">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: palette.primary }}>
                        {i + 1}
                      </div>
                    </div>
                    <div className={`pt-2 flex-1 p-5 ${lc.borderRadius} bg-white border border-gray-100`}>
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-gray-500">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Card grid style */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {steps.map((step, i) => (
                <div key={i} className={`${lc.borderRadius} p-6 bg-white border border-gray-100 hover:shadow-lg transition-shadow ${lc.animClass}`}
                  style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: palette.primary }}>
                      {i + 1}
                    </div>
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                  </div>
                  <p className="text-gray-500">{step.desc}</p>
                </div>
              ))}
            </div>
          )}

          <div className={`text-center mt-16 ${lc.animClass}`}>
            <Link href={`${basePath}/pricing`}
              className={`inline-block px-8 py-3 ${lc.borderRadius} font-semibold text-white transition-transform hover:scale-105`}
              style={{ backgroundColor: palette.primary }}>
              Start Your Journey
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter name={site.startupName} palette={palette} basePath={basePath} />
      <ScrollAnimator />
    </div>
  );
}
