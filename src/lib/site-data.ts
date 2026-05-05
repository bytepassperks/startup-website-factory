import { prisma } from "./db";

export interface DomainConfig {
  purchasedDomain: string | null;
  contactFormEmail: string | null;
  gmailReplyTo: string | null;
  mailgunDomain: string | null;
  mailgunFromEmail: string | null;
  mailgunToEmail: string | null;
  mailgunApiKey: string | null;
  mailgunSetup: boolean;
}

export async function getDomainConfig(generationId?: string): Promise<DomainConfig> {
  const [gen, settings] = await Promise.all([
    generationId ? prisma.generation.findUnique({ where: { id: generationId } }) : null,
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
  ]);

  return {
    purchasedDomain: gen?.purchasedDomain || settings?.purchasedDomain || null,
    contactFormEmail: gen?.contactFormEmail || settings?.contactFormEmail || null,
    gmailReplyTo: gen?.gmailReplyTo || settings?.gmailReplyTo || null,
    mailgunDomain: gen?.mailgunDomain || settings?.mailgunDomain || null,
    mailgunFromEmail: gen?.mailgunFromEmail || settings?.mailgunFromEmail || null,
    mailgunToEmail: gen?.mailgunToEmail || settings?.mailgunToEmail || null,
    mailgunApiKey: gen?.mailgunApiKey || null,
    mailgunSetup: gen?.mailgunSetup || settings?.mailgunSetup || false,
  };
}

export interface SiteData {
  id: string;
  startupName: string;
  domainSuggestion: string;
  founderName: string;
  founderRole: string;
  founderBio: string;
  founderEmailPattern: string;
  category: string;
  targetAudience: string;
  problem: string;
  solution: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  featureList: { name: string; description: string }[];
  faqItems: { q: string; a: string }[];
  pricingTiers: { name: string; price: number; features: string[] }[];
  aboutCopy: string;
  contactCopy: string;
  seoMeta: { title: string; description: string; keywords: string[] };
  selectedImages: { query: string; url: string; credit: string; thumbUrl?: string }[];
  palette: { name: string; primary: string; secondary: string; accent: string; bg: string; text: string };
  layoutVariant: string;
  sectionOrder: string[];
  fullGeneratedCopy: Record<string, unknown>;
}

export async function getSiteData(id: string): Promise<SiteData | null> {
  const gen = await prisma.generation.findUnique({ where: { id } });
  if (!gen) return null;

  return {
    id: gen.id,
    startupName: gen.startupName,
    domainSuggestion: gen.domainSuggestion,
    founderName: gen.founderName,
    founderRole: gen.founderRole,
    founderBio: gen.founderBio,
    founderEmailPattern: gen.founderEmailPattern,
    category: gen.category,
    targetAudience: gen.targetAudience,
    problem: gen.problem,
    solution: gen.solution,
    tagline: gen.tagline,
    heroHeadline: gen.heroHeadline,
    heroSubheadline: gen.heroSubheadline,
    featureList: gen.featureList as SiteData["featureList"],
    faqItems: gen.faqItems as SiteData["faqItems"],
    pricingTiers: gen.pricingTiers as SiteData["pricingTiers"],
    aboutCopy: gen.aboutCopy,
    contactCopy: gen.contactCopy,
    seoMeta: gen.seoMeta as SiteData["seoMeta"],
    selectedImages: gen.selectedImages as SiteData["selectedImages"],
    palette: gen.palette as SiteData["palette"],
    layoutVariant: gen.layoutVariant,
    sectionOrder: gen.sectionOrder as string[],
    fullGeneratedCopy: gen.fullGeneratedCopy as Record<string, unknown>,
  };
}
