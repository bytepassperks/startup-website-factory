import { getSiteData, getDomainConfig } from "@/lib/site-data";
import { getBasePath } from "@/lib/site-href";
import { notFound } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import ContactForm from "@/components/ContactForm";

export default async function ContactPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [site, domainConfig] = await Promise.all([getSiteData(id), getDomainConfig(id)]);
  if (!site) notFound();

  const { palette } = site;

  const basePath = await getBasePath(id);
  const displayDomain = domainConfig.purchasedDomain || site.domainSuggestion;
  const displayEmail = domainConfig.contactFormEmail || site.founderEmailPattern;

  return (
    <div style={{ backgroundColor: palette.bg, color: palette.text }}>
      <SiteNav name={site.startupName} palette={palette} basePath={basePath} />

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h1 className="text-4xl font-bold mb-6">Get In Touch</h1>
              <div className="prose max-w-none mb-8">
                {site.contactCopy.split("\n\n").map((para, i) => (
                  <p key={i} className="text-gray-600 leading-relaxed mb-3">{para}</p>
                ))}
              </div>

              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: palette.primary }}>@</span>
                  <span>{displayEmail}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: palette.primary }}>&#x1F310;</span>
                  <span>{displayDomain}</span>
                </div>
              </div>
            </div>

            <div>
              <ContactForm palette={palette} generationId={id} />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter name={site.startupName} palette={palette} basePath={basePath} />
    </div>
  );
}
