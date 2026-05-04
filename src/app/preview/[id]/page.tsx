import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gen = await prisma.generation.findUnique({
    where: { id },
    include: { matches: true },
  });

  if (!gen) notFound();

  const palette = gen.palette as { primary: string; secondary: string; accent: string; bg: string; text: string; name: string };
  const features = gen.featureList as { name: string; description: string }[];
  const faqs = gen.faqItems as { q: string; a: string }[];
  const pricing = gen.pricingTiers as { name: string; price: number; features: string[] }[];
  const images = gen.selectedImages as { query: string; url: string; credit: string }[];
  const seo = gen.seoMeta as { title: string; description: string; keywords: string[] };
  const uniqueness = gen.uniquenessScores as { overallScore: number; isUnique: boolean; fieldScores?: Record<string, number> } | null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">&larr; Dashboard</Link>
            <h1 className="font-semibold text-gray-900">{gen.startupName} — Preview</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/edit/${gen.id}`} className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Edit</Link>
            <Link href={`/site/${gen.id}`} className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-500">View Full Site</Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Overview */}
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><span className="text-gray-500">Name:</span> <strong>{gen.startupName}</strong></div>
            <div><span className="text-gray-500">Category:</span> <strong>{gen.category}</strong></div>
            <div><span className="text-gray-500">Domain:</span> <strong>{gen.domainSuggestion}</strong></div>
            <div><span className="text-gray-500">Layout:</span> <strong>{gen.layoutVariant}</strong></div>
            <div><span className="text-gray-500">Founder:</span> <strong>{gen.founderName}</strong></div>
            <div><span className="text-gray-500">Role:</span> <strong>{gen.founderRole}</strong></div>
            <div><span className="text-gray-500">Audience:</span> <strong>{gen.targetAudience}</strong></div>
            <div><span className="text-gray-500">Status:</span> <strong>{gen.deploymentStatus}</strong></div>
          </div>
        </section>

        {/* Uniqueness */}
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Uniqueness Report</h2>
          {uniqueness ? (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-2xl font-bold ${uniqueness.overallScore < 0.3 ? "text-green-600" : uniqueness.overallScore < 0.5 ? "text-yellow-600" : "text-red-600"}`}>
                  {(uniqueness.overallScore * 100).toFixed(0)}%
                </span>
                <span className="text-sm text-gray-500">overall similarity to nearest match</span>
              </div>
              {uniqueness.fieldScores && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                  {Object.entries(uniqueness.fieldScores).map(([field, score]) => (
                    <div key={field} className="bg-gray-50 rounded p-2">
                      <div className="text-gray-500">{field}</div>
                      <div className={`font-semibold ${(score as number) < 0.3 ? "text-green-600" : (score as number) < 0.5 ? "text-yellow-600" : "text-red-600"}`}>
                        {((score as number) * 100).toFixed(0)}%
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">First generation — no comparisons available</p>
          )}
        </section>

        {/* Palette */}
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Color Palette: {palette.name}</h2>
          <div className="flex gap-2">
            {[palette.primary, palette.secondary, palette.accent, palette.bg, palette.text].map((c, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-16 h-16 rounded-lg border" style={{ backgroundColor: c }} />
                <span className="text-xs text-gray-500">{c}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Hero */}
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Hero Section</h2>
          <div className="p-8 rounded-lg" style={{ backgroundColor: palette.primary }}>
            <h3 className="text-2xl font-bold text-white mb-2">{gen.heroHeadline}</h3>
            <p className="text-white/80">{gen.heroSubheadline}</p>
            <p className="mt-4 text-sm text-white/60 italic">{gen.tagline}</p>
          </div>
        </section>

        {/* SEO */}
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">SEO Meta</h2>
          <div className="text-sm space-y-1">
            <p><span className="text-gray-500">Title:</span> {seo.title}</p>
            <p><span className="text-gray-500">Description:</span> {seo.description}</p>
            <p><span className="text-gray-500">Keywords:</span> {seo.keywords.join(", ")}</p>
          </div>
        </section>

        {/* Features */}
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Features ({features.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div key={i} className="border rounded-lg p-4">
                <h4 className="font-medium text-sm">{f.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Pricing Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pricing.map((t, i) => (
              <div key={i} className="border rounded-lg p-4 text-center">
                <h4 className="font-semibold">{t.name}</h4>
                <p className="text-2xl font-bold mt-2">${t.price}<span className="text-sm font-normal">/mo</span></p>
                <ul className="mt-3 text-xs text-gray-600 space-y-1">
                  {t.features.slice(0, 5).map((f, j) => (
                    <li key={j}>{f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">FAQ ({faqs.length} items)</h2>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="border-b pb-3">
                <p className="font-medium text-sm">{f.q}</p>
                <p className="text-xs text-gray-500 mt-1">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Images */}
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Images</h2>
          {images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((img, i) => (
                <div key={i} className="space-y-1">
                  <img src={img.url} alt={img.query} className="rounded-lg w-full h-32 object-cover" />
                  <p className="text-xs text-gray-500">{img.query}</p>
                  <p className="text-xs text-gray-400">{img.credit}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No images fetched yet (set UNSPLASH_ACCESS_KEY)</p>
          )}
        </section>

        {/* Section Order */}
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Section Order</h2>
          <div className="flex flex-wrap gap-2">
            {(gen.sectionOrder as string[]).map((s, i) => (
              <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">
                {i + 1}. {s}
              </span>
            ))}
          </div>
        </section>

        {/* Matches */}
        {gen.matches.length > 0 && (
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Similarity Matches</h2>
            <div className="space-y-2 text-sm">
              {gen.matches.map((m) => (
                <div key={m.id} className="flex items-center gap-3 text-gray-600">
                  <span className="font-medium">{m.field}:</span>
                  <span>{m.explanation}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
