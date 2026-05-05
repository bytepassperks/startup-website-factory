import { getSiteData } from "@/lib/site-data";
import { getLayoutConfig } from "@/lib/layout-config";
import { getBasePath } from "@/lib/site-href";
import { notFound } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import ScrollAnimator from "@/components/ScrollAnimator";
import Link from "next/link";

export default async function SiteHomePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const site = await getSiteData(id);
  if (!site) notFound();

  const { palette, selectedImages, featureList, pricingTiers, sectionOrder,
    startupName, category, heroHeadline, heroSubheadline, tagline, solution,
    targetAudience, faqItems, layoutVariant,
    fullGeneratedCopy } = site;
  const heroImg = selectedImages[0]?.url;
  const howItWorks = (fullGeneratedCopy.howItWorks || []) as { title: string; desc: string }[];
  const lc = getLayoutConfig(layoutVariant);
  const anim = lc.animClass;
  const basePath = await getBasePath(id);
  const b = basePath;

  // Build ordered sections from sectionOrder
  const sectionMap: Record<string, () => React.ReactNode> = {
    hero: () => renderHero(),
    features: () => renderFeatures(),
    "how-it-works": () => renderHowItWorks(),
    pricing: () => renderPricing(),
    cta: () => renderCTA(),
    stats: () => renderStats(),
    faq: () => renderFaqPreview(),
    testimonials: () => renderTestimonials(),
  };

  function renderHero() {
    if (lc.heroStyle === "center") {
      return (
        <section key="hero" className={`relative overflow-hidden ${lc.heroShape}`} style={{ backgroundColor: palette.primary }}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 rounded-full animate-pulse-slow" style={{ backgroundColor: palette.accent }} />
            <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full animate-pulse-slow" style={{ backgroundColor: palette.secondary, animationDelay: "1.5s" }} />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-36 text-center">
            <span className="inline-block px-4 py-1.5 text-xs font-semibold rounded-full mb-6 anim-fade-up" style={{ backgroundColor: palette.accent, color: palette.text }}>
              {category}
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight anim-fade-up" style={{ transitionDelay: "100ms" }}>
              {heroHeadline}
            </h1>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto anim-fade-up" style={{ transitionDelay: "200ms" }}>
              {heroSubheadline}
            </p>
            <div className="flex flex-wrap gap-4 justify-center anim-fade-up" style={{ transitionDelay: "300ms" }}>
              <Link href={`${b}/pricing`} className={`px-8 py-3.5 ${lc.borderRadius} font-semibold text-sm transition-transform hover:scale-105`} style={{ backgroundColor: palette.accent, color: palette.text }}>
                Get Started Free
              </Link>
              <Link href={`${b}/how-it-works`} className={`px-8 py-3.5 ${lc.borderRadius} font-semibold text-sm border-2 border-white/30 text-white hover:bg-white/10`}>
                See How It Works →
              </Link>
            </div>
          </div>
        </section>
      );
    }

    if (lc.heroStyle === "gradient") {
      return (
        <section key="hero" className={`relative overflow-hidden ${lc.heroShape}`}
          style={{ background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})` }}>
          <div className="absolute inset-0 animate-shimmer" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4 glass-card text-white anim-fade-left">
                  {category}
                </span>
                <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 anim-fade-left" style={{ transitionDelay: "100ms" }}>
                  {heroHeadline}
                </h1>
                <p className="text-lg text-white/80 mb-8 anim-fade-left" style={{ transitionDelay: "200ms" }}>
                  {heroSubheadline}
                </p>
                <div className="flex flex-wrap gap-4 anim-fade-left" style={{ transitionDelay: "300ms" }}>
                  <Link href={`${b}/pricing`} className="px-8 py-3.5 rounded-full font-semibold text-sm transition-transform hover:scale-105 bg-white" style={{ color: palette.primary }}>
                    Start Free Trial
                  </Link>
                </div>
              </div>
              {heroImg && (
                <div className="hidden md:block anim-scale-in">
                  <img src={heroImg} alt={startupName} className="rounded-3xl shadow-2xl rotate-2 hover:rotate-0 transition-transform" />
                </div>
              )}
            </div>
          </div>
        </section>
      );
    }

    if (lc.heroStyle === "minimal") {
      return (
        <section key="hero" className="relative" style={{ backgroundColor: palette.bg }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <span className="text-sm font-medium uppercase tracking-widest mb-6 block anim-fade-up" style={{ color: palette.primary }}>
              {category}
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-none anim-fade-up" style={{ color: palette.text, transitionDelay: "100ms" }}>
              {heroHeadline}
            </h1>
            <p className="text-xl mb-10 anim-fade-up" style={{ color: palette.text + "99", transitionDelay: "200ms" }}>
              {heroSubheadline}
            </p>
            <div className="flex gap-4 anim-fade-up" style={{ transitionDelay: "300ms" }}>
              <Link href={`${b}/pricing`} className="px-6 py-3 rounded-lg font-semibold text-sm text-white" style={{ backgroundColor: palette.primary }}>
                Get Started →
              </Link>
            </div>
            <div className="mt-12 h-px w-full" style={{ backgroundColor: palette.primary + "20" }} />
          </div>
        </section>
      );
    }

    if (lc.heroStyle === "bold") {
      return (
        <section key="hero" className={`relative overflow-hidden ${lc.heroShape}`} style={{ backgroundColor: palette.primary }}>
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 25% 25%, ${palette.accent} 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="max-w-3xl">
              <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-none anim-fade-up">
                {heroHeadline}
              </h1>
              <p className="text-xl text-white/70 mb-8 max-w-xl anim-fade-up" style={{ transitionDelay: "150ms" }}>
                {heroSubheadline}
              </p>
              <div className="anim-fade-up" style={{ transitionDelay: "300ms" }}>
                <Link href={`${b}/pricing`} className="inline-block px-10 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105" style={{ backgroundColor: palette.accent, color: palette.text }}>
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </section>
      );
    }

    if (lc.heroStyle === "dark") {
      return (
        <section key="hero" className="relative overflow-hidden" style={{ backgroundColor: "#0f0f0f" }}>
          <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(ellipse at 50% 50%, ${palette.primary}, transparent 70%)` }} />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <span className="inline-block px-3 py-1 text-xs font-medium rounded-full mb-6 border border-white/20 text-white/70 anim-fade-left">
                  {category}
                </span>
                <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 anim-fade-left" style={{ transitionDelay: "100ms" }}>
                  {heroHeadline}
                </h1>
                <p className="text-lg text-gray-400 mb-8 anim-fade-left" style={{ transitionDelay: "200ms" }}>
                  {heroSubheadline}
                </p>
                <div className="flex gap-4 anim-fade-left" style={{ transitionDelay: "300ms" }}>
                  <Link href={`${b}/pricing`} className="px-8 py-3.5 rounded-lg font-semibold text-sm text-white transition-all hover:brightness-110" style={{ backgroundColor: palette.primary }}>
                    Start Free
                  </Link>
                  <Link href={`${b}/features`} className="px-8 py-3.5 rounded-lg font-semibold text-sm text-white border border-white/20 hover:border-white/40">
                    Learn More
                  </Link>
                </div>
              </div>
              {heroImg && (
                <div className="hidden md:block anim-fade-right">
                  <img src={heroImg} alt={startupName} className="rounded-2xl shadow-2xl border border-white/10" />
                </div>
              )}
            </div>
          </div>
        </section>
      );
    }

    if (lc.heroStyle === "glass") {
      return (
        <section key="hero" className={`relative overflow-hidden ${lc.heroShape}`}
          style={{ background: `linear-gradient(160deg, ${palette.primary}, ${palette.secondary}, ${palette.primary})` }}>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <div className="glass-card rounded-3xl p-10 md:p-14 max-w-3xl mx-auto text-center anim-scale-in">
              <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4 bg-white/20 text-white">
                {category}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">{heroHeadline}</h1>
              <p className="text-lg text-white/80 mb-8">{heroSubheadline}</p>
              <Link href={`${b}/pricing`} className="inline-block px-8 py-3.5 rounded-full font-semibold text-sm bg-white transition-transform hover:scale-105" style={{ color: palette.primary }}>
                Start Free Trial →
              </Link>
            </div>
          </div>
        </section>
      );
    }

    if (lc.heroStyle === "diagonal") {
      return (
        <section key="hero" className="relative overflow-hidden hero-diagonal" style={{ backgroundColor: palette.primary, paddingBottom: "80px" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="grid md:grid-cols-5 gap-8 items-center">
              <div className="md:col-span-3 anim-fade-left">
                <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">{heroHeadline}</h1>
                <p className="text-lg text-white/80 mb-8">{heroSubheadline}</p>
                <Link href={`${b}/pricing`} className="inline-block px-8 py-3.5 rounded-xl font-semibold text-sm transition-transform hover:scale-105" style={{ backgroundColor: palette.accent, color: palette.text }}>
                  Get Started Free
                </Link>
              </div>
              {heroImg && (
                <div className="md:col-span-2 hidden md:block anim-fade-right">
                  <img src={heroImg} alt={startupName} className="rounded-2xl shadow-2xl -rotate-3 hover:rotate-0 transition-transform" />
                </div>
              )}
            </div>
          </div>
        </section>
      );
    }

    // Default: split
    return (
      <section key="hero" className={`relative overflow-hidden ${lc.heroShape}`} style={{ backgroundColor: palette.primary }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4 anim-fade-left" style={{ backgroundColor: palette.accent, color: palette.text }}>
                {category}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight anim-fade-left" style={{ transitionDelay: "100ms" }}>
                {heroHeadline}
              </h1>
              <p className="text-lg text-white/80 mb-8 max-w-xl anim-fade-left" style={{ transitionDelay: "200ms" }}>
                {heroSubheadline}
              </p>
              <div className="flex flex-wrap gap-3 anim-fade-left" style={{ transitionDelay: "300ms" }}>
                <Link href={`${b}/pricing`} className={`px-6 py-3 ${lc.borderRadius} font-semibold text-sm transition-transform hover:scale-105`} style={{ backgroundColor: palette.accent, color: palette.text }}>
                  Get Started Free
                </Link>
                <Link href={`${b}/how-it-works`} className={`px-6 py-3 ${lc.borderRadius} font-semibold text-sm border-2 border-white/30 text-white hover:bg-white/10`}>
                  See How It Works
                </Link>
              </div>
            </div>
            {heroImg && (
              <div className="hidden md:block anim-fade-right">
                <img src={heroImg} alt={startupName} className={`${lc.borderRadius} shadow-2xl animate-float`} />
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  function renderFeatures() {
    if (lc.featureStyle === "alternating") {
      return (
        <section key="features" className={lc.sectionSpacing} style={{ backgroundColor: palette.bg }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className={`text-3xl font-bold text-center mb-16 ${anim}`} style={{ color: palette.text }}>Why Choose {startupName}?</h2>
            <div className="space-y-20">
              {featureList.slice(0, 4).map((f, i) => (
                <div key={i} className={`flex flex-col md:flex-row gap-10 items-center ${i % 2 === 1 ? "md:flex-row-reverse" : ""} ${i % 2 === 0 ? "anim-fade-left" : "anim-fade-right"}`}
                  style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="flex-1">
                    <span className="text-sm font-bold uppercase tracking-wide mb-2 block" style={{ color: palette.primary }}>Feature {String(i + 1).padStart(2, "0")}</span>
                    <h3 className="text-2xl font-bold mb-3" style={{ color: palette.text }}>{f.name}</h3>
                    <p className="text-gray-500 leading-relaxed">{f.description}</p>
                  </div>
                  <div className="flex-1">
                    <div className={`w-full h-48 ${lc.borderRadius} flex items-center justify-center`} style={{ backgroundColor: palette.primary + "10" }}>
                      <span className="text-5xl font-black" style={{ color: palette.primary + "30" }}>{String(i + 1).padStart(2, "0")}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    if (lc.featureStyle === "bento") {
      return (
        <section key="features" className={lc.sectionSpacing} style={{ backgroundColor: palette.bg }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className={`text-3xl font-bold text-center mb-16 ${anim}`} style={{ color: palette.text }}>Why Choose {startupName}?</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {featureList.slice(0, 6).map((f, i) => {
                const span = i === 0 ? "md:col-span-2 md:row-span-2" : i < 3 ? "md:col-span-2" : "";
                return (
                  <div key={i} className={`${span} p-6 ${lc.borderRadius} border border-gray-100 anim-scale-in`}
                    style={{ backgroundColor: "#fff", transitionDelay: `${i * 80}ms` }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm mb-4" style={{ backgroundColor: palette.primary }}>
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <h3 className="font-semibold mb-2" style={{ color: palette.text }}>{f.name}</h3>
                    <p className="text-sm text-gray-500">{f.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );
    }

    if (lc.featureStyle === "cards-icon") {
      return (
        <section key="features" className={lc.sectionSpacing} style={{ backgroundColor: palette.bg }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className={`text-3xl font-bold text-center mb-4 ${anim}`} style={{ color: palette.text }}>Powerful Features</h2>
            <p className={`text-center text-gray-500 mb-16 max-w-2xl mx-auto ${anim}`}>{tagline}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featureList.slice(0, 6).map((f, i) => (
                <div key={i} className={`${lc.borderRadius} p-8 text-center hover:shadow-xl transition-shadow bg-white border border-gray-100 anim-blur-in`}
                  style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center text-2xl" style={{ backgroundColor: palette.primary + "15", color: palette.primary }}>
                    {["⚡", "🎯", "🔒", "📊", "🚀", "💡"][i % 6]}
                  </div>
                  <h3 className="font-bold mb-2 text-lg" style={{ color: palette.text }}>{f.name}</h3>
                  <p className="text-sm text-gray-500">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    if (lc.featureStyle === "grid-2") {
      return (
        <section key="features" className={lc.sectionSpacing} style={{ backgroundColor: palette.bg }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className={`text-3xl font-bold text-center mb-16 ${anim}`} style={{ color: palette.text }}>Why Choose {startupName}?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featureList.slice(0, 4).map((f, i) => (
                <div key={i} className={`p-8 ${lc.borderRadius} border-l-4 bg-white shadow-sm anim-fade-up`}
                  style={{ borderLeftColor: palette.primary, transitionDelay: `${i * 120}ms` }}>
                  <h3 className="font-bold text-lg mb-2" style={{ color: palette.text }}>{f.name}</h3>
                  <p className="text-gray-500">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    if (lc.featureStyle === "list") {
      return (
        <section key="features" className={lc.sectionSpacing} style={{ backgroundColor: palette.bg }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className={`text-3xl font-bold mb-12 ${anim}`} style={{ color: palette.text }}>What makes {startupName} different</h2>
            <div className="space-y-8">
              {featureList.slice(0, 5).map((f, i) => (
                <div key={i} className={`flex gap-4 items-start anim-fade-up`} style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="flex-shrink-0 w-1 h-full min-h-[60px] rounded-full" style={{ backgroundColor: palette.primary }} />
                  <div>
                    <h3 className="font-bold text-lg mb-1" style={{ color: palette.text }}>{f.name}</h3>
                    <p className="text-gray-500">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    // Default: grid-3
    return (
      <section key="features" className={lc.sectionSpacing} style={{ backgroundColor: palette.bg }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold mb-3 ${anim}`} style={{ color: palette.text }}>Why Choose {startupName}?</h2>
            <p className={`text-gray-500 max-w-2xl mx-auto ${anim}`}>{tagline}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureList.slice(0, 6).map((f, i) => (
              <div key={i} className={`p-6 ${lc.borderRadius} border border-gray-100 bg-white hover:shadow-lg transition-shadow ${anim}`}
                style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm mb-4" style={{ backgroundColor: palette.secondary }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-semibold mb-2" style={{ color: palette.text }}>{f.name}</h3>
                <p className="text-sm text-gray-500">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  function renderHowItWorks() {
    if (howItWorks.length === 0) return null;
    const steps = howItWorks.slice(0, 4);
    const gridCols = steps.length <= 3 ? "md:grid-cols-3" : "md:grid-cols-4";
    return (
      <section key="how-it-works" className={lc.sectionSpacing} style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-bold text-center mb-12 ${anim}`} style={{ color: palette.text }}>How It Works</h2>
          <div className={`grid grid-cols-1 ${gridCols} gap-8`}>
            {steps.map((step, i) => (
              <div key={i} className={`text-center ${anim}`} style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold" style={{ backgroundColor: palette.primary }}>
                  {i + 1}
                </div>
                <h3 className="font-semibold mb-2" style={{ color: palette.text }}>{step.title}</h3>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  function renderPricing() {
    return (
      <section key="pricing" className={lc.sectionSpacing} style={{ backgroundColor: palette.bg }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-bold text-center mb-12 ${anim}`} style={{ color: palette.text }}>Simple, Transparent Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {pricingTiers.map((tier, i) => (
              <div key={i} className={`${lc.borderRadius} p-6 border ${i === 1 ? "border-2 shadow-lg scale-105" : "border-gray-200"} bg-white ${anim}`}
                style={{ borderColor: i === 1 ? palette.primary : undefined, transitionDelay: `${i * 100}ms` }}>
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
                <button className={`w-full py-2 ${lc.borderRadius} text-sm font-semibold transition-colors`}
                  style={i === 1 ? { backgroundColor: palette.primary, color: "#fff" } : { border: `1px solid ${palette.primary}`, color: palette.primary }}>
                  {tier.price === 0 ? "Start Free" : "Get Started"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  function renderCTA() {
    return (
      <section key="cta" className="py-16" style={{ backgroundColor: palette.primary }}>
        <div className={`max-w-3xl mx-auto text-center px-4 ${anim}`}>
          <h2 className="text-3xl font-bold text-white mb-4">Ready to {solution.split(" ").slice(0, 4).join(" ")}?</h2>
          <p className="text-white/80 mb-8">Join thousands of {targetAudience} already using {startupName}.</p>
          <Link href={`${b}/contact`} className={`inline-block px-8 py-3 ${lc.borderRadius} font-semibold text-sm transition-transform hover:scale-105`}
            style={{ backgroundColor: palette.accent, color: palette.text }}>
            Get Started Today
          </Link>
        </div>
      </section>
    );
  }

  function renderStats() {
    const stats = [
      { val: "10K+", label: "Active Users" },
      { val: "99.9%", label: "Uptime" },
      { val: "50+", label: "Countries" },
      { val: "4.9★", label: "Rating" },
    ];
    return (
      <section key="stats" className="py-16" style={{ backgroundColor: palette.primary + "08" }}>
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <div key={i} className={anim} style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="text-3xl font-extrabold" style={{ color: palette.primary }}>{s.val}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  function renderFaqPreview() {
    return (
      <section key="faq" className={lc.sectionSpacing} style={{ backgroundColor: palette.bg }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-bold text-center mb-12 ${anim}`} style={{ color: palette.text }}>FAQ</h2>
          <div className="space-y-4">
            {faqItems.slice(0, 3).map((faq, i) => (
              <div key={i} className={`bg-white ${lc.borderRadius} p-5 border border-gray-100 ${anim}`} style={{ transitionDelay: `${i * 80}ms` }}>
                <h3 className="font-semibold mb-1" style={{ color: palette.text }}>{faq.q}</h3>
                <p className="text-sm text-gray-500">{faq.a}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href={`${b}/faq`} className="text-sm font-medium hover:underline" style={{ color: palette.primary }}>View all FAQs →</Link>
          </div>
        </div>
      </section>
    );
  }

  function renderTestimonials() {
    const testimonials = [
      { name: "Alex K.", role: `${targetAudience}`, quote: `${startupName} transformed how we work. The platform is incredibly intuitive.` },
      { name: "Sam R.", role: `${category} Lead`, quote: `We saw a 40% improvement in productivity within the first month.` },
      { name: "Jordan M.", role: "Operations Director", quote: `Best investment we've made this year. The team loves it.` },
    ];
    return (
      <section key="testimonials" className={lc.sectionSpacing} style={{ backgroundColor: "#f9fafb" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-bold text-center mb-12 ${anim}`} style={{ color: palette.text }}>What People Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className={`${lc.borderRadius} p-6 bg-white shadow-md ${anim}`} style={{ transitionDelay: `${i * 100}ms` }}>
                <p className="text-gray-600 italic mb-4">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: palette.primary }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: palette.text }}>{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Render sections in sectionOrder from DB
  const orderedSections: React.ReactNode[] = [];
  const rendered = new Set<string>();

  // Always start with hero
  orderedSections.push(renderHero());
  rendered.add("hero");

  // Follow sectionOrder for the rest
  for (const section of sectionOrder as string[]) {
    if (rendered.has(section)) continue;
    const renderer = sectionMap[section];
    if (renderer) {
      orderedSections.push(renderer());
      rendered.add(section);
    }
  }

  // Ensure essential sections are included
  for (const essential of ["features", "cta"]) {
    if (!rendered.has(essential)) {
      const renderer = sectionMap[essential];
      if (renderer) orderedSections.push(renderer());
    }
  }

  return (
    <div style={{ backgroundColor: palette.bg, color: palette.text }}>
      <SiteNav name={startupName} palette={palette} basePath={basePath} />
      {orderedSections}
      <SiteFooter name={startupName} palette={palette} basePath={basePath} />
      <ScrollAnimator />
    </div>
  );
}
