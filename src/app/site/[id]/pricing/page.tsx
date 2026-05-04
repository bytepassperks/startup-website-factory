import { getSiteData } from "@/lib/site-data";
import { notFound } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";

export default async function PricingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const site = await getSiteData(id);
  if (!site) notFound();

  const { palette, pricingTiers } = site;

  return (
    <div style={{ backgroundColor: palette.bg, color: palette.text }}>
      <SiteNav id={id} name={site.startupName} palette={palette} />

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Start free and scale as you grow. No hidden fees, no surprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, i) => (
              <div
                key={i}
                className={`rounded-2xl p-8 ${i === 1 ? "border-2 shadow-xl scale-105 relative" : "border border-gray-200"}`}
                style={i === 1 ? { borderColor: palette.primary, backgroundColor: "#fff" } : { backgroundColor: "#fff" }}
              >
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
                <Link
                  href={`/site/${id}/contact`}
                  className="block w-full text-center py-3 rounded-lg font-semibold text-sm transition-colors"
                  style={i === 1
                    ? { backgroundColor: palette.primary, color: "#fff" }
                    : { border: `2px solid ${palette.primary}`, color: palette.primary }
                  }
                >
                  {tier.price === 0 ? "Get Started Free" : "Start Free Trial"}
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-sm text-gray-500">All plans include a 14-day free trial. No credit card required.</p>
          </div>
        </div>
      </section>

      <SiteFooter id={id} name={site.startupName} palette={palette} />
    </div>
  );
}
