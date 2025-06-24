export interface DetailedAnalysisResult {
  ingredient: string
  isHarmful: boolean
  severity?: "low" | "medium" | "high"
  reason?: string
  category?: string
  healthImpact?: string
  alternatives?: string[]
  regulatoryStatus?: string
  studiesCount?: number
}

export const enhancedHarmfulIngredients = {
  "high fructose corn syrup": {
    severity: "high" as const,
    reason:
      "Linked to obesity, diabetes, and metabolic disorders. Processed differently than regular sugar, leading to increased fat storage.",
    category: "Sweetener",
    healthImpact: "Increases risk of obesity, type 2 diabetes, heart disease, and fatty liver disease",
    alternatives: ["Organic cane sugar", "Maple syrup", "Honey", "Stevia"],
    regulatoryStatus: "FDA approved but restricted in some countries",
    studiesCount: 150,
  },
  "sodium benzoate": {
    severity: "medium" as const,
    reason:
      "May form benzene (a carcinogen) when combined with vitamin C. Can cause hyperactivity in children and allergic reactions.",
    category: "Preservative",
    healthImpact: "Potential carcinogen formation, hyperactivity, allergic reactions",
    alternatives: ["Vitamin E (tocopherols)", "Rosemary extract", "Citric acid"],
    regulatoryStatus: "FDA approved with usage limits",
    studiesCount: 89,
  },
  "red dye 40": {
    severity: "high" as const,
    reason:
      "Artificial food coloring linked to hyperactivity, allergic reactions, and potential carcinogenic effects. Banned in several European countries.",
    category: "Food Coloring",
    healthImpact: "ADHD symptoms, allergic reactions, potential cancer risk",
    alternatives: ["Beet juice", "Paprika extract", "Annatto", "Turmeric"],
    regulatoryStatus: "Banned in Norway, Finland, France for children's products",
    studiesCount: 67,
  },
  "yellow 5": {
    severity: "medium" as const,
    reason:
      "May cause allergic reactions, hyperactivity in children, and has been linked to behavioral issues. Contains benzene compounds.",
    category: "Food Coloring",
    healthImpact: "Hyperactivity, allergic reactions, behavioral changes",
    alternatives: ["Turmeric", "Saffron", "Beta-carotene", "Annatto"],
    regulatoryStatus: "Requires warning labels in EU",
    studiesCount: 45,
  },
  bha: {
    severity: "high" as const,
    reason:
      "Butylated hydroxyanisole is classified as a possible human carcinogen and endocrine disruptor. Accumulates in body tissues.",
    category: "Preservative",
    healthImpact: "Potential cancer risk, hormone disruption, liver damage",
    alternatives: ["Vitamin E", "Rosemary extract", "Green tea extract"],
    regulatoryStatus: "Banned in Japan and parts of EU",
    studiesCount: 112,
  },
  bht: {
    severity: "high" as const,
    reason:
      "Butylated hydroxytoluene may cause liver damage, thyroid problems, and is a possible carcinogen. Bioaccumulates in fatty tissues.",
    category: "Preservative",
    healthImpact: "Liver toxicity, thyroid disruption, potential cancer risk",
    alternatives: ["Mixed tocopherols", "Ascorbic acid", "Citric acid"],
    regulatoryStatus: "Restricted in several countries",
    studiesCount: 98,
  },
  aspartame: {
    severity: "medium" as const,
    reason:
      "Artificial sweetener that may cause headaches, dizziness, and has been linked to various neurological symptoms in sensitive individuals.",
    category: "Sweetener",
    healthImpact: "Headaches, dizziness, mood changes, potential neurological effects",
    alternatives: ["Stevia", "Monk fruit", "Erythritol", "Xylitol"],
    regulatoryStatus: "FDA approved but controversial",
    studiesCount: 200,
  },
  "monosodium glutamate": {
    severity: "low" as const,
    reason:
      "May cause headaches, nausea, and other symptoms in sensitive individuals (MSG syndrome). Generally recognized as safe for most people.",
    category: "Flavor Enhancer",
    healthImpact: "MSG syndrome symptoms in sensitive individuals",
    alternatives: ["Yeast extract", "Mushroom powder", "Seaweed extract"],
    regulatoryStatus: "FDA approved, GRAS status",
    studiesCount: 156,
  },
  msg: {
    severity: "low" as const,
    reason:
      "May cause headaches, nausea, and other symptoms in sensitive individuals (MSG syndrome). Generally recognized as safe for most people.",
    category: "Flavor Enhancer",
    healthImpact: "MSG syndrome symptoms in sensitive individuals",
    alternatives: ["Yeast extract", "Mushroom powder", "Seaweed extract"],
    regulatoryStatus: "FDA approved, GRAS status",
    studiesCount: 156,
  },
  "sodium nitrite": {
    severity: "high" as const,
    reason:
      "Can form nitrosamines, which are carcinogenic compounds, especially when heated. Commonly found in processed meats.",
    category: "Preservative",
    healthImpact: "Cancer risk, particularly colorectal cancer",
    alternatives: ["Celery powder", "Sea salt", "Vitamin C + salt"],
    regulatoryStatus: "FDA approved with strict limits",
    studiesCount: 134,
  },
  "potassium bromate": {
    severity: "high" as const,
    reason:
      "Banned in many countries due to carcinogenic properties. Still used in some US baked goods as a flour treatment agent.",
    category: "Flour Treatment",
    healthImpact: "Strong carcinogen, kidney and nervous system damage",
    alternatives: ["Ascorbic acid", "Enzyme-based improvers", "Vital wheat gluten"],
    regulatoryStatus: "Banned in EU, Canada, Brazil, China",
    studiesCount: 78,
  },
  "trans fat": {
    severity: "high" as const,
    reason:
      "Increases bad cholesterol, decreases good cholesterol, and significantly raises risk of heart disease and stroke.",
    category: "Fat",
    healthImpact: "Heart disease, stroke, diabetes, inflammation",
    alternatives: ["Coconut oil", "Avocado oil", "Olive oil", "Grass-fed butter"],
    regulatoryStatus: "Banned in many countries, being phased out in US",
    studiesCount: 300,
  },
  "partially hydrogenated oil": {
    severity: "high" as const,
    reason:
      "Contains trans fats which are linked to heart disease, stroke, and diabetes. No safe level of consumption.",
    category: "Fat",
    healthImpact: "Cardiovascular disease, diabetes, inflammation",
    alternatives: ["Cold-pressed oils", "Coconut oil", "Palm oil", "Butter"],
    regulatoryStatus: "FDA banned in US as of 2021",
    studiesCount: 250,
  },
  "artificial vanilla": {
    severity: "low" as const,
    reason:
      "Vanillin derived from wood pulp or petroleum. While generally safe, may cause allergic reactions in sensitive individuals.",
    category: "Flavoring",
    healthImpact: "Rare allergic reactions, no major health concerns",
    alternatives: ["Pure vanilla extract", "Vanilla beans", "Natural vanilla flavoring"],
    regulatoryStatus: "FDA approved, GRAS status",
    studiesCount: 23,
  },
  carrageenan: {
    severity: "medium" as const,
    reason:
      "May cause digestive inflammation and has been linked to intestinal damage in animal studies. Controversial ingredient.",
    category: "Thickener",
    healthImpact: "Digestive inflammation, potential gut health issues",
    alternatives: ["Agar", "Guar gum", "Xanthan gum", "Arrowroot"],
    regulatoryStatus: "FDA approved but under review",
    studiesCount: 67,
  },
}

export const analyzeIngredientsDetailed = (ingredientsText: string): DetailedAnalysisResult[] => {
  const ingredients = ingredientsText
    .toLowerCase()
    .split(/[,\n]/)
    .map((ing) => ing.trim())
    .filter((ing) => ing.length > 0)

  return ingredients.map((ingredient) => {
    const cleanIngredient = ingredient.replace(/$$[^)]*$$/g, "").trim()

    for (const [harmfulIng, data] of Object.entries(enhancedHarmfulIngredients)) {
      if (cleanIngredient.includes(harmfulIng)) {
        return {
          ingredient: ingredient,
          isHarmful: true,
          severity: data.severity,
          reason: data.reason,
          category: data.category,
          healthImpact: data.healthImpact,
          alternatives: data.alternatives,
          regulatoryStatus: data.regulatoryStatus,
          studiesCount: data.studiesCount,
        }
      }
    }

    return {
      ingredient: ingredient,
      isHarmful: false,
    }
  })
}

export const generateRiskScore = (results: DetailedAnalysisResult[]): number => {
  let score = 0
  results.forEach((result) => {
    if (result.isHarmful) {
      switch (result.severity) {
        case "high":
          score += 3
          break
        case "medium":
          score += 2
          break
        case "low":
          score += 1
          break
      }
    }
  })
  return Math.min(score, 10) // Cap at 10
}

export const getRiskLevel = (score: number): { level: string; color: string; description: string } => {
  if (score === 0)
    return {
      level: "EXCELLENT",
      color: "text-green-600",
      description: "No harmful ingredients detected",
    }
  if (score <= 2)
    return {
      level: "GOOD",
      color: "text-green-500",
      description: "Minimal harmful ingredients",
    }
  if (score <= 4)
    return {
      level: "MODERATE",
      color: "text-yellow-500",
      description: "Some concerning ingredients present",
    }
  if (score <= 7)
    return {
      level: "POOR",
      color: "text-orange-500",
      description: "Multiple harmful ingredients detected",
    }
  return {
    level: "DANGEROUS",
    color: "text-red-600",
    description: "High concentration of harmful ingredients",
  }
}
