import { getSiteData } from "@/lib/site-data";
import { getLayoutConfig } from "@/lib/layout-config";
import { getBasePath } from "@/lib/site-href";
import { notFound } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import ScrollAnimator from "@/components/ScrollAnimator";
import Link from "next/link";

export default async function PricingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const site = await getSiteData(id);
  if (!site) notFound();

  const { palette, pricingTiers } = site;
  const lc = getLayoutConfig(site.layoutVariant);
  const basePath = await getBasePath(id);

  return (
    <div style={{ backgroundColor: palette.bg, color: palette.text }}>
      <SiteNav name={site.startupName} palette={palette} basePath={basePath} />

      <section className={lc.sectionSpacing}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className={`text-4xl font-bold mb-4 ${lc.animClass}`}>Choose Your Plan</h1>
            <p className={`text-lg text-gray-500 max-w-2xl mx-auto ${lc.animClass}`} style={{ transitionDelay: "100ms" }}>
              Start free and scale as you grow. No hidden fees, no surprises.
            </p>
          </div>

          {lc.pricingStyle === "horizontal" ? (
            <div className="space-y-6 max-w-3xl mx-auto">
              {pricingTiers.map((tier, i) => (
                <div key={i} className={`${lc.borderRadius} p-6 bg-white border flex flex-col md:flex-row md:items-center gap-6 ${i === 1 ? "border-2 shadow-lg" : "border-gray-200"} ${lc.animClass}`}
                  style={{ borderColor: i === 1 ? palette.primary : undefined, transitionDelay: `${i * 120}ms` }}>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">${tier.price}</span>
                      <span className="text-gray-500 text-sm">/month</span>
                    </div>
                  </div>
                  <ul className="flex-1 space-y-1">
                    {tier.features.slice(0, 4).map((f, j) => (
                      <li key={j} className="text-sm text-gray-600 flex items-center gap-2">
                        <span style={{ color: palette.primary }}>&#10003;</span> {f}
                      </li>
                    ))}
                  </ul>
                  <Link href={`${basePath}/contact`}
                    className={`px-6 py-2.5 ${lc.borderRadius} font-semibold text-sm whitespace-nowrap`}
                    style={i === 1 ? { backgroundColor: palette.primary, color: "#fff" } : { border: `2px solid ${palette.primary}`, color: palette.primary }}>
                    {tier.price === 0 ? "Get Started Free" : "Start Free Trial"}
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingTiers.map((tier, i) => (
                <div key={i}
                  className={`${lc.borderRadius} p-8 ${i === 1 ? "border-2 shadow-xl scale-105 relative" : "border border-gray-200"} bg-white ${lc.animClass}`}
                  style={{ borderColor: i === 1 ? palette.primary : undefined, transitionDelay: `${i * 120}ms` }}>
                  {i === 1 && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: palette.primary }}>
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-bold">${tier.price}</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((f, j) => (
                      <li key={j} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="mt-0.5" style={{ color: palette.primary }}>&#10003;</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={`${basePath}/contact`}
                    className={`block w-full text-center py-3 ${lc.borderRadius} font-semibold text-sm transition-colors`}
                    style={i === 1 ? { backgroundColor: palette.primary, color: "#fff" } : { border: `2px solid ${palette.primary}`, color: palette.primary }}>
                    {tier.price === 0 ? "Get Started Free" : "Start Free Trial"}
                  </Link>
                </div>
              ))}
            </div>
          )}

          <div className={`text-center mt-12 ${lc.animClass}`}>
            <p className="text-sm text-gray-500">All plans include a 14-day free trial. No credit card required.</p>
          </div>
        </div>
      </section>

      <SiteFooter name={site.startupName} palette={palette} basePath={basePath} />
      <ScrollAnimator />
    </div>
  );
}
