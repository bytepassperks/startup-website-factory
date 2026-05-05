import { getSiteData } from "@/lib/site-data";
import { getLayoutConfig } from "@/lib/layout-config";
import { notFound } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import ScrollAnimator from "@/components/ScrollAnimator";

export default async function FAQPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const site = await getSiteData(id);
  if (!site) notFound();

  const { palette, faqItems } = site;
  const lc = getLayoutConfig(site.layoutVariant);
  const isAlt = lc.featureStyle === "alternating" || lc.featureStyle === "list";

  return (
    <div style={{ backgroundColor: palette.bg, color: palette.text }}>
      <SiteNav id={id} name={site.startupName} palette={palette} />

      <section className={lc.sectionSpacing}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className={`text-4xl font-bold mb-4 text-center ${lc.animClass}`}>Frequently Asked Questions</h1>
          <p className={`text-center text-gray-500 mb-12 ${lc.animClass}`} style={{ transitionDelay: "100ms" }}>
            Everything you need to know about {site.startupName}. Can&apos;t find the answer you&apos;re looking for? Reach out to our support team.
          </p>

          {isAlt ? (
            <div className="space-y-4">
              {faqItems.map((faq, i) => (
                <div key={i} className={`border-b border-gray-100 pb-4 anim-fade-up`} style={{ transitionDelay: `${i * 60}ms` }}>
                  <h3 className="font-semibold text-lg mb-2" style={{ color: palette.text }}>{faq.q}</h3>
                  <p className="text-gray-500 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {faqItems.map((faq, i) => (
                <div key={i} className={`bg-white ${lc.borderRadius} p-6 border border-gray-100 shadow-sm ${lc.animClass}`}
                  style={{ transitionDelay: `${i * 80}ms` }}>
                  <h3 className="font-semibold mb-2" style={{ color: palette.text }}>{faq.q}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <SiteFooter id={id} name={site.startupName} palette={palette} />
      <ScrollAnimator />
    </div>
  );
}
