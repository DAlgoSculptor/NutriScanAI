"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, TrendingUp, Users, Globe } from "lucide-react"
import type { DetailedAnalysisResult } from "@/lib/enhanced-analysis"
import { getRiskLevel, generateRiskScore } from "@/lib/enhanced-analysis"

interface EnhancedResultsProps {
  results: DetailedAnalysisResult[]
  productName: string
  scanDate: Date
}

export function EnhancedResults({ results, productName, scanDate }: EnhancedResultsProps) {
  const riskScore = generateRiskScore(results)
  const riskInfo = getRiskLevel(riskScore)
  const harmfulIngredients = results.filter((r) => r.isHarmful)

  const severityCounts = {
    high: harmfulIngredients.filter((r) => r.severity === "high").length,
    medium: harmfulIngredients.filter((r) => r.severity === "medium").length,
    low: harmfulIngredients.filter((r) => r.severity === "low").length,
  }

  return (
    <div className="space-y-6">
      {/* Risk Score Card */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Overall Risk Assessment</span>
            <Badge className={`${riskInfo.color} bg-opacity-10 text-lg px-4 py-2`}>{riskInfo.level}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Risk Score</span>
                <span className="text-sm font-bold">{riskScore}/10</span>
              </div>
              <Progress value={riskScore * 10} className="h-3" />
            </div>
            <p className="text-sm text-gray-600">{riskInfo.description}</p>

            {/* Severity Breakdown */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{severityCounts.high}</div>
                <div className="text-xs text-red-600">High Risk</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{severityCounts.medium}</div>
                <div className="text-xs text-yellow-600">Medium Risk</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{severityCounts.low}</div>
                <div className="text-xs text-orange-600">Low Risk</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Harmful Ingredients */}
      {harmfulIngredients.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Harmful Ingredients Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {harmfulIngredients.map((ingredient, index) => (
                <div key={index} className="border-l-4 border-red-400 pl-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold capitalize text-lg">{ingredient.ingredient}</h4>
                    <div className="flex gap-2">
                      <Badge
                        className={`${
                          ingredient.severity === "high"
                            ? "bg-red-100 text-red-800"
                            : ingredient.severity === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {ingredient.severity?.toUpperCase()} RISK
                      </Badge>
                      <Badge variant="outline">{ingredient.category}</Badge>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium mb-1 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1 text-red-500" />
                        Health Impact
                      </h5>
                      <p className="text-gray-600">{ingredient.healthImpact}</p>
                    </div>

                    <div>
                      <h5 className="font-medium mb-1 flex items-center">
                        <Globe className="h-4 w-4 mr-1 text-blue-500" />
                        Regulatory Status
                      </h5>
                      <p className="text-gray-600">{ingredient.regulatoryStatus}</p>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium mb-1 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                      Healthier Alternatives
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {ingredient.alternatives?.map((alt, i) => (
                        <Badge key={i} variant="outline" className="text-green-700 border-green-300">
                          {alt}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {ingredient.studiesCount && (
                    <div className="flex items-center text-xs text-gray-500">
                      <Users className="h-3 w-3 mr-1" />
                      Based on {ingredient.studiesCount}+ scientific studies
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
