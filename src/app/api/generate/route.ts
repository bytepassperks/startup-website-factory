import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateSite } from "@/lib/generator";
import { checkUniqueness } from "@/lib/uniqueness";
import { searchUnsplash } from "@/lib/unsplash";
import type { Prisma } from "@/generated/prisma/client";

function toJson<T>(val: T): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(val)) as Prisma.InputJsonValue;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { seed, module } = body as { seed?: string; module?: string };

    const existing = await prisma.generation.findMany({
      where: { archived: false },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    let site = generateSite(seed);
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      const report = checkUniqueness(
        {
          id: "new",
          startupName: site.startupName,
          founderName: site.founderName,
          domainSuggestion: site.domainSuggestion,
          tagline: site.tagline,
          heroHeadline: site.heroHeadline,
          featureList: site.featureList,
          faqItems: site.faqItems,
          layoutVariant: site.layoutVariant,
          sectionOrder: site.sectionOrder,
          imageQueries: site.imageQueries,
        },
        existing.map((e) => ({
          id: e.id,
          startupName: e.startupName,
          founderName: e.founderName,
          domainSuggestion: e.domainSuggestion,
          tagline: e.tagline,
          heroHeadline: e.heroHeadline,
          featureList: e.featureList as { name: string }[],
          faqItems: e.faqItems as { q: string }[],
          layoutVariant: e.layoutVariant,
          sectionOrder: e.sectionOrder as string[],
          imageQueries: e.imageQueries as string[],
        }))
      );

      if (report.isUnique) {
        site = {
          ...site,
        };
        break;
      }

      if (module) {
        site = generateSite();
        break;
      }

      site = generateSite();
      attempts++;
    }

    const existingImageQueries = existing.map(
      (e) => e.imageQueries as string[]
    );
    const images = await searchUnsplash(site.imageQueries, existingImageQueries);

    const uniquenessReport = checkUniqueness(
      {
        id: "new",
        startupName: site.startupName,
        founderName: site.founderName,
        domainSuggestion: site.domainSuggestion,
        tagline: site.tagline,
        heroHeadline: site.heroHeadline,
        featureList: site.featureList,
        faqItems: site.faqItems,
        layoutVariant: site.layoutVariant,
        sectionOrder: site.sectionOrder,
        imageQueries: site.imageQueries,
      },
      existing.map((e) => ({
        id: e.id,
        startupName: e.startupName,
        founderName: e.founderName,
        domainSuggestion: e.domainSuggestion,
        tagline: e.tagline,
        heroHeadline: e.heroHeadline,
        featureList: e.featureList as { name: string }[],
        faqItems: e.faqItems as { q: string }[],
        layoutVariant: e.layoutVariant,
        sectionOrder: e.sectionOrder as string[],
        imageQueries: e.imageQueries as string[],
      }))
    );

    const generation = await prisma.generation.create({
      data: {
        seed: site.seed,
        startupName: site.startupName,
        domainSuggestion: site.domainSuggestion,
        founderName: site.founderName,
        founderRole: site.founderRole,
        founderBio: site.founderBio,
        founderEmailPattern: site.founderEmailPattern,
        category: site.category,
        targetAudience: site.targetAudience,
        problem: site.problem,
        solution: site.solution,
        tagline: site.tagline,
        heroHeadline: site.heroHeadline,
        heroSubheadline: site.heroSubheadline,
        featureList: toJson(site.featureList),
        faqItems: toJson(site.faqItems),
        pricingTiers: toJson(site.pricingTiers),
        aboutCopy: site.aboutCopy,
        contactCopy: site.contactCopy,
        seoMeta: toJson(site.seoMeta),
        imageQueries: toJson(site.imageQueries),
        selectedImages: toJson(images),
        palette: toJson(site.palette),
        layoutVariant: site.layoutVariant,
        sectionOrder: toJson(site.sectionOrder),
        fullGeneratedCopy: toJson({
          ...site.fullGeneratedCopy,
          howItWorks: site.howItWorks,
          privacyPolicy: site.privacyPolicy,
          termsOfService: site.termsOfService,
        }),
        uniquenessScores: toJson({
          overallScore: uniquenessReport.overallScore,
          isUnique: uniquenessReport.isUnique,
          fieldScores: uniquenessReport.results.reduce(
            (acc, r) => {
              if (!acc[r.field] || r.score > acc[r.field]) acc[r.field] = r.score;
              return acc;
            },
            {} as Record<string, number>
          ),
        }),
        nearestMatches: toJson(uniquenessReport.nearestMatch
          ? [uniquenessReport.nearestMatch]
          : []),
      },
    });

    if (uniquenessReport.nearestMatch) {
      const topResults = uniquenessReport.results
        .filter((r) => r.matchedWithId === uniquenessReport.nearestMatch!.id)
        .slice(0, 5);

      for (const r of topResults) {
        await prisma.generationMatch.create({
          data: {
            generationId: generation.id,
            matchedWithId: r.matchedWithId,
            field: r.field,
            score: r.score,
            explanation: r.explanation,
          },
        });
      }
    }

    return NextResponse.json(generation);
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Generation failed", details: String(error) },
      { status: 500 }
    );
  }
}
