import type { GeneratedSite } from "./generator";
import { generateSite as deterministicGenerate } from "./generator";
import * as P from "./data-pools";
import { seededRandom, pick } from "./seed-random";
import { v4 as uuidv4 } from "uuid";

const PAGEGRID_API_URL = "https://api.pagegrid.in/v1/messages";

interface PageGridMessage {
  role: "user" | "assistant";
  content: string;
}

const MAX_RETRIES = 3;
const TIMEOUT_MS = 45000;

async function callPageGrid(messages: PageGridMessage[], maxTokens = 4096): Promise<string | null> {
  const apiKey = process.env.PAGEGRID_API_KEY;
  if (!apiKey) {
    console.warn("PAGEGRID_API_KEY not set, skipping AI generation");
    return null;
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

      const res = await fetch(PAGEGRID_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify({
          model: "claude-opus-4-6",
          max_tokens: maxTokens,
          messages,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const errBody = await res.text().catch(() => "");
        console.error(`PageGrid API error (attempt ${attempt}/${MAX_RETRIES}):`, res.status, errBody);
        if (attempt < MAX_RETRIES) {
          const delay = Math.pow(2, attempt) * 500;
          await new Promise(r => setTimeout(r, delay));
          continue;
        }
        return null;
      }

      const data = await res.json();
      const content = data?.content;
      if (Array.isArray(content) && content.length > 0 && content[0].text) {
        return content[0].text;
      }
      console.error(`PageGrid returned unexpected response shape (attempt ${attempt})`);
      return null;
    } catch (err) {
      const isTimeout = err instanceof DOMException && err.name === "AbortError";
      console.error(`PageGrid call failed (attempt ${attempt}/${MAX_RETRIES}):`, isTimeout ? "Request timed out" : err);
      if (attempt < MAX_RETRIES) {
        const delay = Math.pow(2, attempt) * 500;
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      return null;
    }
  }
  return null;
}

function buildExistingContext(existingNames: string[]): string {
  if (existingNames.length === 0) return "";
  return `\n\nPREVIOUSLY GENERATED STARTUP NAMES (must NOT reuse or be similar to any of these):\n${existingNames.map(n => `- ${n}`).join("\n")}`;
}

export async function generateSiteWithAI(
  existingSeed?: string,
  existingGenerations?: { startupName: string }[]
): Promise<GeneratedSite> {
  const seed = existingSeed || uuidv4();
  const rng = seededRandom(seed);

  const palette = pick(P.PALETTES, rng);
  const layoutVariant = pick(P.LAYOUT_VARIANTS, rng);

  const existingNames = (existingGenerations || []).map(g => g.startupName);
  const existingContext = buildExistingContext(existingNames);

  const prompt = `You are a startup website content generator. Generate a COMPLETE and UNIQUE startup website concept. Return ONLY valid JSON with no markdown formatting, no code blocks, no explanation.${existingContext}

Return this exact JSON structure:
{
  "startupName": "A unique, memorable 1-2 word brand name (not generic, not similar to existing ones)",
  "domainSuggestion": "startupname.com or similar",
  "founderName": "Realistic full name",
  "founderRole": "CEO & Founder or similar title",
  "founderBio": "2-3 sentence professional bio",
  "founderEmailPattern": "first.last@domain.com",
  "category": "Industry category (e.g. FinTech, HealthTech, EdTech, etc.)",
  "targetAudience": "Specific target audience description",
  "problem": "The problem this startup solves (1 sentence)",
  "solution": "How it solves the problem (1-2 sentences)",
  "tagline": "Catchy tagline (max 8 words)",
  "heroHeadline": "Compelling headline for the homepage hero (max 10 words)",
  "heroSubheadline": "Detailed subheadline (1-2 sentences explaining value proposition)",
  "featureList": [
    {"name": "Feature Name", "description": "Brief description of the feature"},
    ... (5-6 features)
  ],
  "faqItems": [
    {"q": "Question?", "a": "Answer"},
    ... (5-7 FAQ items)
  ],
  "pricingTiers": [
    {"name": "Starter", "price": 0, "features": ["feature1", "feature2", "feature3"]},
    {"name": "Pro", "price": 29, "features": ["feature1", "feature2", "feature3", "feature4", "feature5"]},
    {"name": "Enterprise", "price": 99, "features": ["feature1", "feature2", "feature3", "feature4", "feature5", "feature6", "feature7"]}
  ],
  "aboutCopy": "2-3 paragraphs about the company (separated by newlines)",
  "contactCopy": "1-2 paragraphs for the contact page",
  "seoMeta": {"title": "PageTitle — Tagline", "description": "Meta description", "keywords": ["keyword1", "keyword2", "keyword3"]},
  "imageQueries": ["search query 1", "search query 2", "search query 3", "search query 4", "search query 5", "search query 6"],
  "howItWorks": [
    {"title": "Step Title", "desc": "Step description"},
    ... (3-4 steps)
  ]
}

Requirements:
- The startup must be COMPLETELY UNIQUE — different industry, name, and angle from previous generations
- All copy must be professional, specific, and premium-sounding
- No generic "all-in-one solution" language
- Names should be creative and brandable (think: Stripe, Notion, Figma, Linear style)
- Features should be specific and varied, not generic
- Pricing should be realistic for the industry
- Image queries should be specific and relevant to the content`;

  const aiResult = await callPageGrid([{ role: "user", content: prompt }]);

  if (aiResult) {
    try {
      const cleaned = aiResult
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      const parsed = JSON.parse(cleaned);

      const baseSections = ["hero", "features", "how-it-works", "testimonials", "pricing", "faq", "cta"];
      const extraPool = ["stats", "team", "integrations"];
      const extraCount = Math.floor(rng() * 2) + 1;
      const extras: string[] = [];
      for (let i = 0; i < extraCount && i < extraPool.length; i++) {
        extras.push(extraPool[Math.floor(rng() * extraPool.length)]);
      }
      const allSections = [...baseSections, ...new Set(extras)];
      const sectionOrder: string[] = [];
      const remaining = [...allSections];
      while (remaining.length > 0) {
        const idx = Math.floor(rng() * remaining.length);
        sectionOrder.push(remaining.splice(idx, 1)[0]);
      }

      const startupName = parsed.startupName || "AI Startup";
      const domainSuggestion = parsed.domainSuggestion || `${startupName.toLowerCase().replace(/\s+/g, "")}.com`;

      const site: GeneratedSite = {
        seed,
        startupName,
        domainSuggestion,
        founderName: parsed.founderName || "Alex Rivera",
        founderRole: parsed.founderRole || "CEO & Founder",
        founderBio: parsed.founderBio || "",
        founderEmailPattern: parsed.founderEmailPattern || `hello@${domainSuggestion}`,
        category: parsed.category || "Technology",
        targetAudience: parsed.targetAudience || "businesses",
        problem: parsed.problem || "",
        solution: parsed.solution || "",
        tagline: parsed.tagline || "",
        heroHeadline: parsed.heroHeadline || "",
        heroSubheadline: parsed.heroSubheadline || "",
        featureList: Array.isArray(parsed.featureList) ? parsed.featureList : [],
        faqItems: Array.isArray(parsed.faqItems) ? parsed.faqItems : [],
        pricingTiers: Array.isArray(parsed.pricingTiers) ? parsed.pricingTiers : [],
        aboutCopy: parsed.aboutCopy || "",
        contactCopy: parsed.contactCopy || "",
        seoMeta: parsed.seoMeta || { title: startupName, description: "", keywords: [] },
        imageQueries: Array.isArray(parsed.imageQueries) ? parsed.imageQueries : [],
        selectedImages: [],
        palette,
        layoutVariant,
        sectionOrder,
        fullGeneratedCopy: {
          hero: `${parsed.heroHeadline || ""}\n${parsed.heroSubheadline || ""}`,
          features: (parsed.featureList || []).map((f: { name: string; description: string }) => `${f.name}: ${f.description}`).join("\n"),
          about: parsed.aboutCopy || "",
          contact: parsed.contactCopy || "",
          faq: (parsed.faqItems || []).map((f: { q: string; a: string }) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n"),
          pricing: (parsed.pricingTiers || []).map((t: { name: string; price: number }) => `${t.name}: $${t.price}/mo`).join("\n"),
        },
        howItWorks: Array.isArray(parsed.howItWorks) ? parsed.howItWorks : [],
        privacyPolicy: generatePrivacyPolicy(startupName, domainSuggestion),
        termsOfService: generateTermsOfService(startupName, domainSuggestion),
      };

      return site;
    } catch (parseErr) {
      console.error("Failed to parse AI response, falling back to deterministic:", parseErr);
    }
  }

  console.log("PageGrid unavailable or failed, using deterministic fallback");
  return deterministicGenerate(seed);
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
