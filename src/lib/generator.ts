import { v4 as uuidv4 } from "uuid";
import { seededRandom, pick, pickN, shuffle } from "./seed-random";
import * as P from "./data-pools";

export interface GeneratedSite {
  seed: string;
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
  imageQueries: string[];
  selectedImages: { query: string; url: string; credit: string }[];
  palette: typeof P.PALETTES[0];
  layoutVariant: string;
  sectionOrder: string[];
  fullGeneratedCopy: Record<string, string>;
  howItWorks: { title: string; desc: string }[];
  privacyPolicy: string;
  termsOfService: string;
}

export function generateSite(existingSeed?: string): GeneratedSite {
  const seed = existingSeed || uuidv4();
  const rng = seededRandom(seed);

  const prefix = pick(P.NAME_PREFIXES, rng);
  const suffix = pick(P.NAME_SUFFIXES, rng);
  const startupName = prefix + suffix;
  const domainSuggestion = startupName.toLowerCase() + ".com";

  const firstName = pick(P.FIRST_NAMES, rng);
  const lastName = pick(P.LAST_NAMES, rng);
  const founderName = `${firstName} ${lastName}`;
  const founderRole = pick(P.FOUNDER_ROLES, rng);
  const founderEmailPattern = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domainSuggestion}`;

  const category = pick(P.CATEGORIES, rng);
  const targetAudience = pick(P.AUDIENCES, rng);
  const problem = pick(P.PROBLEMS, rng);

  const solutionTemplate = pick(P.SOLUTION_TEMPLATES, rng);
  const solution = solutionTemplate
    .replace("{task}", pick(P.NOUNS, rng))
    .replace("{domain}", category.toLowerCase())
    .replace("{metric}", pick(P.NOUNS, rng))
    .replace("{process}", pick(P.NOUNS, rng))
    .replace("{audience}", targetAudience)
    .replace("{count}", String(Math.floor(rng() * 8) + 3));

  const verb = pick(P.VERBS, rng);
  const noun = pick(P.NOUNS, rng);
  const noun2 = pick(P.NOUNS, rng);
  const outcome = pick(P.OUTCOMES, rng);
  const pain = pick(P.PAINS, rng);

  const taglinePattern = pick(P.TAGLINE_PATTERNS, rng);
  const tagline = taglinePattern
    .replace("{verb}", verb)
    .replace("{noun}", noun)
    .replace("{noun2}", noun2)
    .replace("{domain}", category)
    .replace("{outcome}", outcome)
    .replace("{pain}", pain)
    .replace("{audience}", targetAudience);

  const heroTemplate = pick(P.HERO_TEMPLATES, rng);
  const adj = pick(P.ADJECTIVES, rng);
  const adv = pick(P.ADVERBS, rng);
  const adv2 = pick(P.ADVERBS, rng);
  const heroHeadline = heroTemplate
    .replace("{verb}", verb)
    .replace("{domain}", category)
    .replace("{adjective}", adj)
    .replace("{noun}", noun)
    .replace("{adverb}", adv)
    .replace("{adverb2}", adv2)
    .replace("{audience}", targetAudience)
    .replace("{pain}", pain)
    .replace("{desire}", pick(P.DESIRES, rng));

  const heroSubheadline = `${startupName} helps ${targetAudience} ${solution.charAt(0).toLowerCase() + solution.slice(1)}. Join thousands who've already made the switch.`;

  const featureCount = Math.floor(rng() * 3) + 4;
  const featureIndices = pickN(
    P.FEATURE_NAMES.map((_, i) => i),
    featureCount,
    rng
  );
  const featureList = featureIndices.map((i) => ({
    name: P.FEATURE_NAMES[i],
    description: P.FEATURE_DESCRIPTIONS[i],
  }));

  const faqItems = pickN(P.FAQ_POOL, Math.floor(rng() * 3) + 5, rng);

  const planSet = pick(P.PRICING_PLAN_NAMES, rng);
  const priceSet = pick(P.PRICING_AMOUNTS, rng);
  const pricingTiers = planSet.map((name, i) => ({
    name,
    price: priceSet[i],
    features: pickN(P.FEATURE_NAMES, Math.floor(rng() * 3) + 3 + i * 2, rng),
  }));

  const year = pick(P.YEARS, rng);
  const teamSize = pick(P.TEAM_SIZES, rng);
  const countryCount = pick(P.COUNTRY_COUNTS, rng);
  const cityCount = pick(P.CITY_COUNTS, rng);
  const belief = pick(P.BELIEFS, rng);
  const mission = pick(P.MISSIONS, rng)
    .replace("{domain}", category.toLowerCase())
    .replace("{audience}", targetAudience);
  const tech1 = pick(P.TECHS, rng);
  const tech2 = pick(P.TECHS, rng);

  const aboutTemplate = pick(P.ABOUT_TEMPLATES, rng);
  const yearsExp = String(Math.floor(rng() * 12) + 5);
  const aboutCopy = aboutTemplate
    .replace(/{name}/g, startupName)
    .replace("{year}", year)
    .replace("{years}", yearsExp)
    .replace("{problem}", problem)
    .replace("{founder}", founderName)
    .replace(/{industry}/g, category)
    .replace(/{audience}/g, targetAudience)
    .replace("{tech1}", tech1)
    .replace("{tech2}", tech2)
    .replace("{count}", countryCount)
    .replace("{teamSize}", teamSize)
    .replace("{cities}", cityCount)
    .replace("{belief}", belief)
    .replace("{mission}", mission)
    .replace("{outcome}", outcome.toLowerCase())
    .replace("{pain}", pain)
    .replace("{domain}", category.toLowerCase());

  const contactTemplate = pick(P.CONTACT_TEMPLATES, rng);
  const contactCopy = contactTemplate
    .replace(/{name}/g, startupName)
    .replace(/{domain}/g, category.toLowerCase())
    .replace("{tagline}", tagline)
    .replace("{audience}", targetAudience);

  const seoMeta = {
    title: `${startupName} — ${tagline}`,
    description: `${startupName} is ${solution}. Built for ${targetAudience}.`,
    keywords: [category.toLowerCase(), noun, noun2, verb.toLowerCase(), targetAudience],
  };

  const imageQueries = [
    `${category} technology modern`,
    `${targetAudience} working professional`,
    `${noun} digital abstract`,
    `team collaboration office`,
    `dashboard analytics screen`,
    `${category} innovation startup`,
  ];

  const selectedImages: { query: string; url: string; credit: string }[] = [];

  const palette = pick(P.PALETTES, rng);
  const layoutVariant = pick(P.LAYOUT_VARIANTS, rng);

  const baseSections = ["hero", "features", "how-it-works", "testimonials", "pricing", "faq", "cta"];
  const extraSections = pickN(["stats", "team", "integrations"], Math.floor(rng() * 2) + 1, rng);
  const sectionOrder = shuffle([...baseSections, ...extraSections], rng);

  const howItWorks = pickN(P.HOW_IT_WORKS_STEPS, Math.floor(rng() * 2) + 3, rng);

  const founderBio = `${founderName} is the ${founderRole} of ${startupName}. With over ${Math.floor(rng() * 12) + 5} years of experience in the ${category} industry, ${firstName} founded ${startupName} after witnessing ${targetAudience} ${problem}. ${firstName} is passionate about ${belief} and is on a mission to ${mission}.`;

  const privacyPolicy = generatePrivacyPolicy(startupName, domainSuggestion);
  const termsOfService = generateTermsOfService(startupName, domainSuggestion);

  const fullGeneratedCopy: Record<string, string> = {
    hero: `${heroHeadline}\n${heroSubheadline}`,
    features: featureList.map((f) => `${f.name}: ${f.description}`).join("\n"),
    about: aboutCopy,
    contact: contactCopy,
    faq: faqItems.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n"),
    pricing: pricingTiers.map((t) => `${t.name}: $${t.price}/mo`).join("\n"),
  };

  return {
    seed, startupName, domainSuggestion, founderName, founderRole,
    founderBio, founderEmailPattern, category, targetAudience, problem,
    solution, tagline, heroHeadline, heroSubheadline, featureList,
    faqItems, pricingTiers, aboutCopy, contactCopy, seoMeta,
    imageQueries, selectedImages, palette, layoutVariant, sectionOrder,
    fullGeneratedCopy, howItWorks, privacyPolicy, termsOfService,
  };
}

function generatePrivacyPolicy(name: string, domain: string): string {
  return `Privacy Policy for ${name}

Last updated: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}

${name} ("us", "we", or "our") operates the ${domain} website. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service.

Information Collection and Use
We collect several types of information for various purposes to provide and improve our Service to you. Types of data collected include:
- Personal Data: name, email address, phone number
- Usage Data: pages visited, time spent, browser type, device information
- Cookies and Tracking: we use cookies and similar technologies to track activity

Use of Data
${name} uses the collected data for purposes including:
- To provide and maintain our Service
- To notify you about changes to our Service
- To provide customer support
- To gather analysis to improve our Service
- To monitor the usage of our Service
- To detect, prevent, and address technical issues

Data Security
The security of your data is important to us. We strive to use commercially acceptable means of protecting your Personal Data. However, no method of transmission over the Internet is 100% secure.

Contact Us
If you have any questions about this Privacy Policy, please contact us at privacy@${domain}.`;
}

function generateTermsOfService(name: string, domain: string): string {
  return `Terms of Service for ${name}

Last updated: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}

Please read these Terms of Service carefully before using the ${domain} website operated by ${name}.

Acceptance of Terms
By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.

Accounts
When you create an account with us, you must provide information that is accurate and complete. You are responsible for safeguarding the password and for all activities that occur under your account.

Intellectual Property
The Service and its original content, features, and functionality are owned by ${name} and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.

Termination
We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use the Service will cease immediately.

Limitation of Liability
In no event shall ${name}, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages.

Governing Law
These Terms shall be governed by the laws of the jurisdiction in which ${name} operates, without regard to its conflict of law provisions.

Contact Us
If you have any questions about these Terms, please contact us at legal@${domain}.`;
}
