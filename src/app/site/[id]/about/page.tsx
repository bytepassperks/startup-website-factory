import { getSiteData } from "@/lib/site-data";
import { notFound } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export default async function AboutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const site = await getSiteData(id);
  if (!site) notFound();

  const { palette, selectedImages } = site;

  return (
    <div style={{ backgroundColor: palette.bg, color: palette.text }}>
      <SiteNav id={id} name={site.startupName} palette={palette} />

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8 text-center">About {site.startupName}</h1>

          {selectedImages[1] && (
            <img
              src={selectedImages[1].url}
              alt="About us"
              className="w-full h-64 object-cover rounded-xl mb-10"
            />
          )}

          <div className="prose max-w-none">
            {site.aboutCopy.split("\n\n").map((para, i) => (
              <p key={i} className="text-gray-600 leading-relaxed mb-4">{para}</p>
            ))}
          </div>

          <div className="mt-16 p-8 rounded-2xl" style={{ backgroundColor: palette.primary + "10" }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: palette.primary }}>Meet Our Founder</h2>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0" style={{ backgroundColor: palette.primary }}>
                {site.founderName.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{site.founderName}</h3>
                <p className="text-sm font-medium mb-3" style={{ color: palette.secondary }}>{site.founderRole}</p>
                <p className="text-gray-600 leading-relaxed">{site.founderBio}</p>
                <p className="text-sm text-gray-400 mt-2">{site.founderEmailPattern}</p>
              </div>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="text-3xl font-bold" style={{ color: palette.primary }}>10K+</div>
              <div className="text-sm text-gray-500 mt-1">Active Users</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold" style={{ color: palette.primary }}>50+</div>
              <div className="text-sm text-gray-500 mt-1">Countries</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold" style={{ color: palette.primary }}>99.9%</div>
              <div className="text-sm text-gray-500 mt-1">Uptime</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold" style={{ color: palette.primary }}>4.9</div>
              <div className="text-sm text-gray-500 mt-1">Star Rating</div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter id={id} name={site.startupName} palette={palette} />
    </div>
  );
}
