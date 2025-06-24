export const supportedLanguages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
]

export const translateText = async (text: string, fromLang: string, toLang: string): Promise<string> => {
  // Simulate translation API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Mock translation - in real app, use Google Translate API or similar
  const translations: { [key: string]: { [key: string]: string } } = {
    "Water, High Fructose Corn Syrup": {
      es: "Agua, Jarabe de Maíz Alto en Fructosa",
      fr: "Eau, Sirop de Maïs à Haute Teneur en Fructose",
      de: "Wasser, Maissirup mit hohem Fruktosegehalt",
    },
  }

  return translations[text]?.[toLang] || text
}
