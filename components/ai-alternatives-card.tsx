"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, ExternalLink, Heart, Leaf } from "lucide-react"

interface AIAlternativesCardProps {
  analysisResults?: any[]
  results?: any[]
  language?: string
}

export function AIAlternativesCard({ analysisResults, results, language }: AIAlternativesCardProps) {
  // pick whichever prop is defined (maintains backward-compatibility)
  const safeResults = (analysisResults ?? results ?? []) as any[]

  if (!safeResults.length) {
    return null
  }

  const harmfulIngredients = safeResults.filter((r) => r.isHarmful)

  if (harmfulIngredients.length === 0) {
    return (
      <Card className="border-green-200">
        <CardContent className="text-center py-8">
          <Heart className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-800 mb-2">Great Choice!</h3>
          <p className="text-green-600">No harmful ingredients detected. This product looks healthy!</p>
        </CardContent>
      </Card>
    )
  }

  // AI-generated alternatives (simulated)
  const generateAlternatives = (ingredient: any) => {
    const alternatives = {
      "high fructose corn syrup": [
        {
          name: "Organic Coconut Nectar Granola Bar",
          brand: "Nature's Path",
          score: 85,
          price: "$4.99",
          availability: "Available at Whole Foods",
        },
        {
          name: "Maple Syrup Sweetened Energy Bar",
          brand: "KIND",
          score: 78,
          price: "$5.49",
          availability: "Available online",
        },
      ],
      "red dye 40": [
        {
          name: "Natural Berry Fruit Snacks",
          brand: "Annie's",
          score: 82,
          price: "$3.99",
          availability: "Available at Target",
        },
        {
          name: "Organic Fruit Leather",
          brand: "Stretch Island",
          score: 88,
          price: "$4.29",
          availability: "Available at most stores",
        },
      ],
    }

    const key = Object.keys(alternatives).find((alt) => ingredient.ingredient.toLowerCase().includes(alt))
    return key ? alternatives[key as keyof typeof alternatives] : []
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
          AI-Powered Healthier Alternatives
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {safeResults.slice(0, 2).map((ingredient, index) => {
            const alternatives = generateAlternatives(ingredient)
            return (
              <div key={index} className="border-l-4 border-red-400 pl-4">
                <h4 className="font-semibold text-red-700 mb-3 capitalize">
                  Alternatives for: {ingredient.ingredient}
                </h4>
                {alternatives.length > 0 ? (
                  <div className="grid gap-4">
                    {alternatives.map((alt, altIndex) => (
                      <div key={altIndex} className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h5 className="font-medium text-green-800">{alt.name}</h5>
                            <p className="text-sm text-green-600">by {alt.brand}</p>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-green-100 text-green-800 mb-1">Score: {alt.score}/100</Badge>
                            <p className="text-sm font-medium text-green-700">{alt.price}</p>
                          </div>
                        </div>
                        <p className="text-xs text-green-600 mb-3">{alt.availability}</p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="text-green-700 border-green-300">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Find Stores
                          </Button>
                          <Button size="sm" variant="outline" className="text-green-700 border-green-300">
                            <Heart className="h-3 w-3 mr-1" />
                            Save
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">
                      <Leaf className="h-4 w-4 inline mr-1" />
                      General recommendations for avoiding {ingredient.category?.toLowerCase()}:
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Look for organic or natural alternatives</li>
                      <li>• Check ingredient lists for simpler formulations</li>
                      <li>• Consider making homemade versions</li>
                      <li>• Shop at health food stores for cleaner options</li>
                    </ul>
                  </div>
                )}
              </div>
            )
          })}

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-2">🤖 AI Shopping Assistant</h4>
            <p className="text-sm text-purple-700 mb-3">
              Our AI analyzed thousands of similar products to find the best alternatives based on your health
              preferences and local availability.
            </p>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
              <Sparkles className="h-3 w-3 mr-1" />
              Get More Recommendations
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
