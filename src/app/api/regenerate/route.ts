import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateSite } from "@/lib/generator";
import { generateSiteWithAI } from "@/lib/ai-generator";
import { searchUnsplash } from "@/lib/unsplash";

async function getFreshSite() {
  if (process.env.PAGEGRID_API_KEY) {
    try {
      const allGens = await prisma.generation.findMany({
        where: { archived: false },
        select: { startupName: true },
        take: 50,
      });
      return await generateSiteWithAI(undefined, allGens);
    } catch {
      return generateSite();
    }
  }
  return generateSite();
}

export async function POST(request: Request) {
  try {
    const { generationId, module } = await request.json();

    if (!generationId) {
      return NextResponse.json({ error: "generationId required" }, { status: 400 });
    }

    const existing = await prisma.generation.findUnique({ where: { id: generationId } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const freshSite = await getFreshSite();

    type UpdateData = Record<string, unknown>;
    const updates: UpdateData = {};

    switch (module) {
      case "name":
        updates.startupName = freshSite.startupName;
        updates.domainSuggestion = freshSite.domainSuggestion;
        break;
      case "founder":
        updates.founderName = freshSite.founderName;
        updates.founderRole = freshSite.founderRole;
        updates.founderBio = freshSite.founderBio;
        updates.founderEmailPattern = freshSite.founderEmailPattern;
        break;
      case "copy":
        updates.tagline = freshSite.tagline;
        updates.heroHeadline = freshSite.heroHeadline;
        updates.heroSubheadline = freshSite.heroSubheadline;
        updates.aboutCopy = freshSite.aboutCopy;
        updates.contactCopy = freshSite.contactCopy;
        updates.fullGeneratedCopy = {
          ...freshSite.fullGeneratedCopy,
          howItWorks: freshSite.howItWorks,
          privacyPolicy: freshSite.privacyPolicy,
          termsOfService: freshSite.termsOfService,
        };
        break;
      case "layout":
        updates.layoutVariant = freshSite.layoutVariant;
        updates.sectionOrder = freshSite.sectionOrder;
        updates.palette = freshSite.palette;
        break;
      case "images": {
        const imgs = await searchUnsplash(freshSite.imageQueries);
        updates.imageQueries = freshSite.imageQueries;
        updates.selectedImages = imgs;
        break;
      }
      default: {
        const imgs = await searchUnsplash(freshSite.imageQueries);
        Object.assign(updates, {
          seed: freshSite.seed,
          startupName: freshSite.startupName,
          domainSuggestion: freshSite.domainSuggestion,
          founderName: freshSite.founderName,
          founderRole: freshSite.founderRole,
          founderBio: freshSite.founderBio,
          founderEmailPattern: freshSite.founderEmailPattern,
          category: freshSite.category,
          targetAudience: freshSite.targetAudience,
          problem: freshSite.problem,
          solution: freshSite.solution,
          tagline: freshSite.tagline,
          heroHeadline: freshSite.heroHeadline,
          heroSubheadline: freshSite.heroSubheadline,
          featureList: freshSite.featureList,
          faqItems: freshSite.faqItems,
          pricingTiers: freshSite.pricingTiers,
          aboutCopy: freshSite.aboutCopy,
          contactCopy: freshSite.contactCopy,
          seoMeta: freshSite.seoMeta,
          imageQueries: freshSite.imageQueries,
          selectedImages: imgs,
          palette: freshSite.palette,
          layoutVariant: freshSite.layoutVariant,
          sectionOrder: freshSite.sectionOrder,
          fullGeneratedCopy: {
            ...freshSite.fullGeneratedCopy,
            howItWorks: freshSite.howItWorks,
            privacyPolicy: freshSite.privacyPolicy,
            termsOfService: freshSite.termsOfService,
          },
        });
        break;
      }
    }

    const updated = await prisma.generation.update({
      where: { id: generationId },
      data: updates,
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Regeneration failed", details: String(error) },
      { status: 500 }
    );
  }
}
