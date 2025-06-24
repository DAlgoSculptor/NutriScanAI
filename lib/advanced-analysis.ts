export interface AdvancedAnalysisResult {
  ingredient: string
  isHarmful: boolean
  severity?: "low" | "medium" | "high"
  reason?: string
  category?: string
  healthImpact?: string
  alternatives?: string[]
  regulatoryStatus?: string
  studiesCount?: number
  nutritionImpact?: number
}

export const enhancedHarmfulIngredients = {
  "high fructose corn syrup": {
    severity: "high" as const,
    reason: "Linked to obesity, diabetes, and metabolic disorders. Processed differently than regular sugar.",
    category: "Sweetener",
    healthImpact: "Increases risk of obesity, type 2 diabetes, heart disease, and fatty liver disease",
    alternatives: ["Organic cane sugar", "Maple syrup", "Honey", "Stevia"],
    regulatoryStatus: "FDA approved but restricted in some countries",
    studiesCount: 150,
    nutritionImpact: -15,
  },
  "sodium benzoate": {
    severity: "medium" as const,
    reason: "May form benzene (a carcinogen) when combined with vitamin C. Can cause hyperactivity in children.",
    category: "Preservative",
    healthImpact: "Potential carcinogen formation, hyperactivity, allergic reactions",
    alternatives: ["Vitamin E (tocopherols)", "Rosemary extract", "Citric acid"],
    regulatoryStatus: "FDA approved with usage limits",
    studiesCount: 89,
    nutritionImpact: -8,
  },
  "red dye 40": {
    severity: "high" as const,
    reason: "Artificial food coloring linked to hyperactivity, allergic reactions, and potential carcinogenic effects.",
    category: "Food Coloring",
    healthImpact: "ADHD symptoms, allergic reactions, potential cancer risk",
    alternatives: ["Beet juice", "Paprika extract", "Annatto", "Turmeric"],
    regulatoryStatus: "Banned in Norway, Finland, France for children's products",
    studiesCount: 67,
    nutritionImpact: -12,
  },
  "yellow 5": {
    severity: "medium" as const,
    reason: "May cause allergic reactions, hyperactivity in children, and has been linked to behavioral issues.",
    category: "Food Coloring",
    healthImpact: "Hyperactivity, allergic reactions, behavioral changes",
    alternatives: ["Turmeric", "Saffron", "Beta-carotene", "Annatto"],
    regulatoryStatus: "Requires warning labels in EU",
    studiesCount: 45,
    nutritionImpact: -10,
  },
  bha: {
    severity: "high" as const,
    reason: "Butylated hydroxyanisole is classified as a possible human carcinogen and endocrine disruptor.",
    category: "Preservative",
    healthImpact: "Potential cancer risk, hormone disruption, liver damage",
    alternatives: ["Vitamin E", "Rosemary extract", "Green tea extract"],
    regulatoryStatus: "Banned in Japan and parts of EU",
    studiesCount: 112,
    nutritionImpact: -18,
  },
  bht: {
    severity: "high" as const,
    reason: "Butylated hydroxytoluene may cause liver damage, thyroid problems, and is a possible carcinogen.",
    category: "Preservative",
    healthImpact: "Liver toxicity, thyroid disruption, potential cancer risk",
    alternatives: ["Mixed tocopherols", "Ascorbic acid", "Citric acid"],
    regulatoryStatus: "Restricted in several countries",
    studiesCount: 98,
    nutritionImpact: -16,
  },
  aspartame: {
    severity: "medium" as const,
    reason:
      "Artificial sweetener that may cause headaches, dizziness, and has been linked to various neurological symptoms.",
    category: "Sweetener",
    healthImpact: "Headaches, dizziness, mood changes, potential neurological effects",
    alternatives: ["Stevia", "Monk fruit", "Erythritol", "Xylitol"],
    regulatoryStatus: "FDA approved but controversial",
    studiesCount: 200,
    nutritionImpact: -6,
  },
}

export const analyzeIngredientsAdvanced = (ingredientsText: string): AdvancedAnalysisResult[] => {
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
          nutritionImpact: data.nutritionImpact,
        }
      }
    }

    return {
      ingredient: ingredient,
      isHarmful: false,
      nutritionImpact: 2, // Neutral/positive impact for safe ingredients
    }
  })
}

export const generateNutritionScore = (results: AdvancedAnalysisResult[]) => {
  const totalIngredients = results.length
  const harmfulIngredients = results.filter((r) => r.isHarmful)

  // Base score calculation
  const baseScore = 100
  let totalImpact = 0

  results.forEach((result) => {
    totalImpact += result.nutritionImpact || 0
  })

  const finalScore = Math.max(0, Math.min(100, baseScore + totalImpact))

  // Category breakdown
  const categories = {
    preservatives: 0,
    sweeteners: 0,
    colorings: 0,
    additives: 0,
  }

  harmfulIngredients.forEach((ingredient) => {
    switch (ingredient.category?.toLowerCase()) {
      case "preservative":
        categories.preservatives += 20
        break
      case "sweetener":
        categories.sweeteners += 15
        break
      case "food coloring":
        categories.colorings += 25
        break
      default:
        categories.additives += 10
    }
  })

  // Normalize category scores
  Object.keys(categories).forEach((key) => {
    categories[key as keyof typeof categories] = Math.min(100, categories[key as keyof typeof categories])
  })

  const getDescription = (score: number) => {
    if (score >= 90) return "Excellent nutritional quality with minimal processing"
    if (score >= 80) return "Good choice with few concerning ingredients"
    if (score >= 70) return "Acceptable but could be improved"
    if (score >= 60) return "Moderate concerns with several harmful ingredients"
    if (score >= 50) return "Poor nutritional quality with many harmful additives"
    return "Avoid - contains numerous harmful ingredients"
  }

  const getRecommendations = (score: number, harmfulCount: number) => {
    const recs = []
    if (harmfulCount > 0) recs.push("Look for products with fewer artificial additives")
    if (score < 70) recs.push("Consider organic or natural alternatives")
    if (harmfulIngredients.some((i) => i.category === "Food Coloring")) recs.push("Avoid artificial food dyes")
    if (harmfulIngredients.some((i) => i.category === "Preservative"))
      recs.push("Choose products with natural preservatives")
    return recs
  }

  return {
    overall: Math.round(finalScore),
    positive: totalIngredients - harmfulIngredients.length,
    negative: harmfulIngredients.length,
    neutral: Math.max(0, totalIngredients - harmfulIngredients.length - 2),
    categories,
    description: getDescription(finalScore),
    recommendations: getRecommendations(finalScore, harmfulIngredients.length),
  }
}
