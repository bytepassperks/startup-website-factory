/**
 * Maps each layoutVariant string to visual decisions so sites look different.
 * Every variant defines: hero style, feature grid style, animation class,
 * section shapes, pricing style, etc.
 */

export interface LayoutConfig {
  heroStyle: "center" | "split" | "gradient" | "minimal" | "bold" | "glass" | "diagonal" | "dark";
  featureStyle: "grid-3" | "grid-2" | "alternating" | "bento" | "cards-icon" | "list";
  animClass: string;
  heroShape: "" | "hero-diagonal" | "hero-wave";
  pricingStyle: "cards" | "horizontal" | "highlighted";
  navStyle: "default" | "transparent" | "colored";
  borderRadius: string;
  sectionSpacing: string;
}

const CONFIGS: Record<string, LayoutConfig> = {
  "hero-left": {
    heroStyle: "split", featureStyle: "alternating", animClass: "anim-fade-left",
    heroShape: "", pricingStyle: "cards", navStyle: "default",
    borderRadius: "rounded-xl", sectionSpacing: "py-20",
  },
  "hero-center": {
    heroStyle: "center", featureStyle: "grid-3", animClass: "anim-fade-up",
    heroShape: "", pricingStyle: "highlighted", navStyle: "default",
    borderRadius: "rounded-2xl", sectionSpacing: "py-24",
  },
  "hero-split": {
    heroStyle: "split", featureStyle: "bento", animClass: "anim-scale-in",
    heroShape: "", pricingStyle: "cards", navStyle: "default",
    borderRadius: "rounded-xl", sectionSpacing: "py-20",
  },
  "hero-gradient": {
    heroStyle: "gradient", featureStyle: "cards-icon", animClass: "anim-blur-in",
    heroShape: "hero-wave", pricingStyle: "highlighted", navStyle: "transparent",
    borderRadius: "rounded-3xl", sectionSpacing: "py-28",
  },
  "hero-video-bg": {
    heroStyle: "dark", featureStyle: "grid-2", animClass: "anim-fade-up",
    heroShape: "", pricingStyle: "horizontal", navStyle: "transparent",
    borderRadius: "rounded-xl", sectionSpacing: "py-20",
  },
  "hero-minimal": {
    heroStyle: "minimal", featureStyle: "list", animClass: "anim-fade-up",
    heroShape: "", pricingStyle: "cards", navStyle: "default",
    borderRadius: "rounded-lg", sectionSpacing: "py-16",
  },
  "hero-bold": {
    heroStyle: "bold", featureStyle: "bento", animClass: "anim-scale-in",
    heroShape: "hero-diagonal", pricingStyle: "highlighted", navStyle: "colored",
    borderRadius: "rounded-2xl", sectionSpacing: "py-24",
  },
  "hero-card": {
    heroStyle: "center", featureStyle: "cards-icon", animClass: "anim-rotate-in",
    heroShape: "", pricingStyle: "cards", navStyle: "default",
    borderRadius: "rounded-3xl", sectionSpacing: "py-20",
  },
  "hero-diagonal": {
    heroStyle: "diagonal", featureStyle: "alternating", animClass: "anim-fade-right",
    heroShape: "hero-diagonal", pricingStyle: "horizontal", navStyle: "default",
    borderRadius: "rounded-xl", sectionSpacing: "py-20",
  },
  "hero-overlap": {
    heroStyle: "split", featureStyle: "grid-3", animClass: "anim-blur-in",
    heroShape: "", pricingStyle: "highlighted", navStyle: "default",
    borderRadius: "rounded-2xl", sectionSpacing: "py-24",
  },
  "hero-wave": {
    heroStyle: "gradient", featureStyle: "bento", animClass: "anim-fade-up",
    heroShape: "hero-wave", pricingStyle: "cards", navStyle: "transparent",
    borderRadius: "rounded-3xl", sectionSpacing: "py-28",
  },
  "hero-dark": {
    heroStyle: "dark", featureStyle: "grid-2", animClass: "anim-fade-left",
    heroShape: "", pricingStyle: "horizontal", navStyle: "transparent",
    borderRadius: "rounded-xl", sectionSpacing: "py-20",
  },
  "hero-glass": {
    heroStyle: "glass", featureStyle: "cards-icon", animClass: "anim-scale-in",
    heroShape: "hero-wave", pricingStyle: "highlighted", navStyle: "transparent",
    borderRadius: "rounded-3xl", sectionSpacing: "py-24",
  },
  "hero-grid": {
    heroStyle: "center", featureStyle: "grid-3", animClass: "anim-rotate-in",
    heroShape: "", pricingStyle: "cards", navStyle: "default",
    borderRadius: "rounded-xl", sectionSpacing: "py-20",
  },
  "hero-float": {
    heroStyle: "split", featureStyle: "alternating", animClass: "anim-blur-in",
    heroShape: "", pricingStyle: "highlighted", navStyle: "default",
    borderRadius: "rounded-2xl", sectionSpacing: "py-24",
  },
  "hero-stack": {
    heroStyle: "bold", featureStyle: "list", animClass: "anim-fade-up",
    heroShape: "hero-diagonal", pricingStyle: "horizontal", navStyle: "colored",
    borderRadius: "rounded-xl", sectionSpacing: "py-20",
  },
};

const DEFAULT_CONFIG: LayoutConfig = {
  heroStyle: "split", featureStyle: "grid-3", animClass: "anim-fade-up",
  heroShape: "", pricingStyle: "cards", navStyle: "default",
  borderRadius: "rounded-xl", sectionSpacing: "py-20",
};

export function getLayoutConfig(variant: string): LayoutConfig {
  return CONFIGS[variant] || DEFAULT_CONFIG;
}
