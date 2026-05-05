import { getSiteData } from "@/lib/site-data";
import { notFound } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";

export default async function HowItWorksPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const site = await getSiteData(id);
  if (!site) notFound();

  const { palette } = site;
  const steps = (site.fullGeneratedCopy.howItWorks || []) as { title: string; desc: string }[];

  return (
    <div style={{ backgroundColor: palette.bg, color: palette.text }}>
      <SiteNav id={id} name={site.startupName} palette={palette} />

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">How {site.startupName} Works</h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Getting started is simple. Follow these steps and you&apos;ll be up and running in no time.
            </p>
          </div>

          <div className="space-y-12">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: palette.primary }}>
                    {i + 1}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px h-12 mx-auto mt-2" style={{ backgroundColor: palette.primary + "30" }} />
                  )}
                </div>
                <div className="pt-2">
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link
              href={`/site/${id}/pricing`}
              className="inline-block px-8 py-3 rounded-lg font-semibold text-white transition-transform hover:scale-105"
              style={{ backgroundColor: palette.primary }}
            >
              Start Your Journey
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter id={id} name={site.startupName} palette={palette} />
    </div>
  );
}
