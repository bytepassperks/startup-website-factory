import { stringSimilarity } from "string-similarity-js";

interface ComparisonTarget {
  id: string;
  startupName: string;
  founderName: string;
  domainSuggestion: string;
  tagline: string;
  heroHeadline: string;
  featureList: { name: string }[];
  faqItems: { q: string }[];
  layoutVariant: string;
  sectionOrder: string[];
  imageQueries: string[];
}

interface SimilarityResult {
  field: string;
  score: number;
  matchedWithId: string;
  explanation: string;
}

interface UniquenessReport {
  isUnique: boolean;
  overallScore: number;
  results: SimilarityResult[];
  nearestMatch: { id: string; score: number } | null;
}

const NAME_THRESHOLD = parseFloat(process.env.UNIQUENESS_NAME_THRESHOLD || "0.7");
const COPY_THRESHOLD = parseFloat(process.env.UNIQUENESS_COPY_THRESHOLD || "0.6");

function tokenOverlap(a: string[], b: string[]): number {
  const setA = new Set(a.map((s) => s.toLowerCase()));
  const setB = new Set(b.map((s) => s.toLowerCase()));
  const intersection = [...setA].filter((x) => setB.has(x));
  const union = new Set([...setA, ...setB]);
  return union.size === 0 ? 0 : intersection.length / union.size;
}

function arrayOverlap(a: string[], b: string[]): number {
  return tokenOverlap(a, b);
}

export function checkUniqueness(
  newGen: ComparisonTarget,
  existing: ComparisonTarget[]
): UniquenessReport {
  if (existing.length === 0) {
    return { isUnique: true, overallScore: 0, results: [], nearestMatch: null };
  }

  const allResults: SimilarityResult[] = [];
  let worstOverall = 0;
  let nearestMatch: { id: string; score: number } | null = null;

  for (const prev of existing) {
    const results: SimilarityResult[] = [];

    const nameSim = stringSimilarity(newGen.startupName, prev.startupName);
    results.push({
      field: "startupName",
      score: nameSim,
      matchedWithId: prev.id,
      explanation: `startup name similarity = ${nameSim.toFixed(2)}`,
    });

    const founderSim = stringSimilarity(newGen.founderName, prev.founderName);
    results.push({
      field: "founderName",
      score: founderSim,
      matchedWithId: prev.id,
      explanation: `founder name similarity = ${founderSim.toFixed(2)}`,
    });

    const domainSim = stringSimilarity(newGen.domainSuggestion, prev.domainSuggestion);
    results.push({
      field: "domainSuggestion",
      score: domainSim,
      matchedWithId: prev.id,
      explanation: `domain similarity = ${domainSim.toFixed(2)}`,
    });

    const taglineSim = stringSimilarity(newGen.tagline, prev.tagline);
    results.push({
      field: "tagline",
      score: taglineSim,
      matchedWithId: prev.id,
      explanation: `tagline similarity = ${taglineSim.toFixed(2)}`,
    });

    const heroSim = stringSimilarity(newGen.heroHeadline, prev.heroHeadline);
    results.push({
      field: "heroHeadline",
      score: heroSim,
      matchedWithId: prev.id,
      explanation: `hero headline similarity = ${heroSim.toFixed(2)}`,
    });

    const featureOverlap = tokenOverlap(
      newGen.featureList.map((f) => f.name),
      prev.featureList.map((f) => f.name)
    );
    results.push({
      field: "featureList",
      score: featureOverlap,
      matchedWithId: prev.id,
      explanation: `feature overlap = ${featureOverlap.toFixed(2)}`,
    });

    const faqOverlap = tokenOverlap(
      newGen.faqItems.map((f) => f.q),
      prev.faqItems.map((f) => f.q)
    );
    results.push({
      field: "faqItems",
      score: faqOverlap,
      matchedWithId: prev.id,
      explanation: `FAQ overlap = ${faqOverlap.toFixed(2)}`,
    });

    const layoutSim = newGen.layoutVariant === prev.layoutVariant ? 1 : 0;
    results.push({
      field: "layoutVariant",
      score: layoutSim,
      matchedWithId: prev.id,
      explanation: layoutSim === 1 ? "layout variant reused" : "different layout variant",
    });

    const sectionSim = arrayOverlap(newGen.sectionOrder, prev.sectionOrder);
    results.push({
      field: "sectionOrder",
      score: sectionSim,
      matchedWithId: prev.id,
      explanation: `section order overlap = ${sectionSim.toFixed(2)}`,
    });

    const imgQueryOverlap = tokenOverlap(newGen.imageQueries, prev.imageQueries);
    results.push({
      field: "imageQueries",
      score: imgQueryOverlap,
      matchedWithId: prev.id,
      explanation: `image query overlap = ${imgQueryOverlap.toFixed(2)}`,
    });

    const avgScore = results.reduce((s, r) => s + r.score, 0) / results.length;
    if (avgScore > worstOverall) {
      worstOverall = avgScore;
      nearestMatch = { id: prev.id, score: avgScore };
    }

    allResults.push(...results);
  }

  const failingFields = allResults.filter((r) => {
    if (r.field === "startupName" || r.field === "founderName" || r.field === "domainSuggestion") {
      return r.score >= NAME_THRESHOLD;
    }
    return r.score >= COPY_THRESHOLD;
  });

  return {
    isUnique: failingFields.length === 0,
    overallScore: worstOverall,
    results: allResults,
    nearestMatch,
  };
}
