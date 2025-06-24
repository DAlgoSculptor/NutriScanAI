"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Minus, Sparkles } from "lucide-react"

interface NutritionScoreCardProps {
  score: any
  language: string
}

export function NutritionScoreCard({ score, language }: NutritionScoreCardProps) {
  if (!score) return null

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    if (score >= 40) return "text-orange-600"
    return "text-red-600"
  }

  const getScoreGrade = (score: number) => {
    if (score >= 90) return { grade: "A+", color: "bg-green-500" }
    if (score >= 80) return { grade: "A", color: "bg-green-400" }
    if (score >= 70) return { grade: "B", color: "bg-yellow-400" }
    if (score >= 60) return { grade: "C", color: "bg-orange-400" }
    if (score >= 50) return { grade: "D", color: "bg-red-400" }
    return { grade: "F", color: "bg-red-600" }
  }

  const gradeInfo = getScoreGrade(score.overall)

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
            AI Nutrition Score
          </span>
          <div className="flex items-center gap-2">
            <div
              className={`w-12 h-12 rounded-full ${gradeInfo.color} flex items-center justify-center text-white font-bold text-lg`}
            >
              {gradeInfo.grade}
            </div>
            <span className={`text-2xl font-bold ${getScoreColor(score.overall)}`}>{score.overall}/100</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall Progress */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Overall Nutrition Quality</span>
              <span className="text-sm">{score.overall}%</span>
            </div>
            <Progress value={score.overall} className="h-3" />
            <p className="text-sm text-gray-600 mt-2">{score.description}</p>
          </div>

          {/* Detailed Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{score.positive}</div>
              <div className="text-sm text-green-700">Positive Factors</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <TrendingDown className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">{score.negative}</div>
              <div className="text-sm text-red-700">Negative Factors</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Minus className="h-8 w-8 text-gray-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-600">{score.neutral}</div>
              <div className="text-sm text-gray-700">Neutral Factors</div>
            </div>
          </div>

          {/* Category Scores */}
          <div className="space-y-3">
            <h4 className="font-semibold">Category Breakdown</h4>
            {Object.entries(score.categories).map(([category, categoryScore]: [string, any]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm capitalize">{category.replace("_", " ")}</span>
                <div className="flex items-center gap-2">
                  <Progress value={categoryScore} className="w-24 h-2" />
                  <span className="text-sm font-medium w-12">{categoryScore}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Recommendations */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">AI Recommendations</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              {score.recommendations.map((rec: string, index: number) => (
                <li key={index}>• {rec}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
