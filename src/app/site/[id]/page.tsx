import { getSiteData } from "@/lib/site-data";
import { notFound } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";

export default async function SiteHomePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const site = await getSiteData(id);
  if (!site) notFound();

  const { palette, selectedImages, featureList, pricingTiers } = site;
  const heroImg = selectedImages[0]?.url;
  const howItWorks = (site.fullGeneratedCopy.howItWorks || []) as { title: string; desc: string }[];

  return (
    <div style={{ backgroundColor: palette.bg, color: palette.text }}>
      <SiteNav id={id} name={site.startupName} palette={palette} />

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ backgroundColor: palette.primary }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className={`grid md:grid-cols-2 gap-12 items-center ${site.layoutVariant.includes("center") ? "md:grid-cols-1 text-center" : ""}`}>
            <div>
              <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4" style={{ backgroundColor: palette.accent, color: palette.text }}>
                {site.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {site.heroHeadline}
              </h1>
              <p className="text-lg text-white/80 mb-8 max-w-xl">
                {site.heroSubheadline}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/site/${id}/pricing`}
                  className="px-6 py-3 rounded-lg font-semibold text-sm transition-transform hover:scale-105"
                  style={{ backgroundColor: palette.accent, color: palette.text }}
                >
                  Get Started Free
                </Link>
                <Link
                  href={`/site/${id}/how-it-works`}
                  className="px-6 py-3 rounded-lg font-semibold text-sm border-2 border-white/30 text-white hover:bg-white/10"
                >
                  See How It Works
                </Link>
              </div>
            </div>
            {heroImg && !site.layoutVariant.includes("center") && (
              <div className="hidden md:block">
                <img src={heroImg} alt={site.startupName} className="rounded-xl shadow-2xl" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-20" style={{ backgroundColor: palette.bg }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: palette.text }}>Why Choose {site.startupName}?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">{site.tagline}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureList.slice(0, 6).map((f, i) => (
              <div key={i} className="p-6 rounded-xl border border-gray-100 bg-white hover:shadow-lg transition-shadow">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm mb-4" style={{ backgroundColor: palette.secondary }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-semibold mb-2" style={{ color: palette.text }}>{f.name}</h3>
                <p className="text-sm text-gray-500">{f.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href={`/site/${id}/features`} className="text-sm font-medium hover:underline" style={{ color: palette.primary }}>
              View All Features &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Preview */}
      {howItWorks.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12" style={{ color: palette.text }}>How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {howItWorks.slice(0, 4).map((step, i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold" style={{ backgroundColor: palette.primary }}>
                    {i + 1}
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing Preview */}
      <section className="py-20" style={{ backgroundColor: palette.bg }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: palette.text }}>Simple, Transparent Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {pricingTiers.map((tier, i) => (
              <div key={i} className={`rounded-xl p-6 border ${i === 1 ? "border-2 shadow-lg scale-105" : "border-gray-200"}`} style={i === 1 ? { borderColor: palette.primary } : {}}>
                <h3 className="font-semibold text-lg mb-1">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-bold">${tier.price}</span>
                  <span className="text-gray-500 text-sm">/month</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {tier.features.slice(0, 5).map((f, j) => (
                    <li key={j} className="text-sm text-gray-600 flex items-center gap-2">
                      <span style={{ color: palette.primary }}>&#10003;</span> {f}
                    </li>
                  ))}
                </ul>
                <button
                  className="w-full py-2 rounded-lg text-sm font-semibold transition-colors"
                  style={i === 1
                    ? { backgroundColor: palette.primary, color: "#fff" }
                    : { backgroundColor: "transparent", border: `1px solid ${palette.primary}`, color: palette.primary }
                  }
                >
                  {tier.price === 0 ? "Start Free" : "Get Started"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ backgroundColor: palette.primary }}>
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to {site.solution.split(" ").slice(0, 4).join(" ")}?</h2>
          <p className="text-white/80 mb-8">Join thousands of {site.targetAudience} already using {site.startupName}.</p>
          <Link
            href={`/site/${id}/contact`}
            className="inline-block px-8 py-3 rounded-lg font-semibold text-sm transition-transform hover:scale-105"
            style={{ backgroundColor: palette.accent, color: palette.text }}
          >
            Get Started Today
          </Link>
        </div>
      </section>

      <SiteFooter id={id} name={site.startupName} palette={palette} />
    </div>
  );
}
