"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, Calendar, AlertTriangle, Award } from "lucide-react"
import { getUserScanHistory } from "@/lib/user-data"

interface DashboardModuleProps {
  user: any
}

export function DashboardModule({ user }: DashboardModuleProps) {
  const [scanHistory, setScanHistory] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<any>(null)

  useEffect(() => {
    if (user) {
      const history = getUserScanHistory(user.id)
      setScanHistory(history)
      generateAnalytics(history)
    }
  }, [user])

  const generateAnalytics = (history: any[]) => {
    if (history.length === 0) return

    const totalScans = history.length
    const avgNutritionScore = history.reduce((sum, scan) => sum + (scan.nutritionScore?.overall || 0), 0) / totalScans
    const harmfulIngredientsCount = history.reduce(
      (sum, scan) => sum + scan.results.filter((r: any) => r.isHarmful).length,
      0,
    )

    const categoryFrequency: { [key: string]: number } = {}
    history.forEach((scan) => {
      scan.results.forEach((result: any) => {
        if (result.isHarmful && result.category) {
          categoryFrequency[result.category] = (categoryFrequency[result.category] || 0) + 1
        }
      })
    })

    const monthlyTrend = generateMonthlyTrend(history)

    setAnalytics({
      totalScans,
      avgNutritionScore: Math.round(avgNutritionScore),
      harmfulIngredientsCount,
      categoryFrequency,
      monthlyTrend,
      improvementTrend: calculateImprovementTrend(history),
    })
  }

  const generateMonthlyTrend = (history: any[]) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    return months.map((month, index) => ({
      month,
      scans: Math.floor(Math.random() * 10) + 1,
      avgScore: Math.floor(Math.random() * 40) + 60,
    }))
  }

  const calculateImprovementTrend = (history: any[]) => {
    if (history.length < 2) return 0
    const recent = history.slice(-5).reduce((sum, scan) => sum + (scan.nutritionScore?.overall || 0), 0) / 5
    const older = history.slice(0, 5).reduce((sum, scan) => sum + (scan.nutritionScore?.overall || 0), 0) / 5
    return Math.round(recent - older)
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Analytics Dashboard</h3>
          <p className="text-gray-500">Sign in to view your nutrition analytics and scan history</p>
        </CardContent>
      </Card>
    )
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Data Yet</h3>
          <p className="text-gray-500">Start scanning products to see your nutrition analytics</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Scans</p>
                <p className="text-2xl font-bold">{analytics.totalScans}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Nutrition Score</p>
                <p className="text-2xl font-bold text-green-600">{analytics.avgNutritionScore}/100</p>
              </div>
              <Award className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Harmful Ingredients</p>
                <p className="text-2xl font-bold text-red-600">{analytics.harmfulIngredientsCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Health Trend</p>
                <p
                  className={`text-2xl font-bold ${analytics.improvementTrend >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {analytics.improvementTrend >= 0 ? "+" : ""}
                  {analytics.improvementTrend}%
                </p>
              </div>
              <TrendingUp
                className={`h-8 w-8 ${analytics.improvementTrend >= 0 ? "text-green-600" : "text-red-600"}`}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Monthly Scanning Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.monthlyTrend.map((month: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium w-12">{month.month}</span>
                <div className="flex-1 mx-4">
                  <Progress value={(month.scans / 10) * 100} className="h-2" />
                </div>
                <span className="text-sm text-gray-600 w-16">{month.scans} scans</span>
                <Badge className="ml-2 bg-green-100 text-green-800">Avg: {month.avgScore}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Frequency */}
      <Card>
        <CardHeader>
          <CardTitle>Most Common Harmful Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(analytics.categoryFrequency)
              .sort(([, a], [, b]) => (b as number) - (a as number))
              .slice(0, 5)
              .map(([category, count], index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">{category}</span>
                  <div className="flex items-center gap-2">
                    <Progress value={(count as number) * 10} className="w-24 h-2" />
                    <span className="text-sm text-gray-600 w-8">{count as number}</span>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Scans */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Scan History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scanHistory.slice(0, 5).map((scan, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Scan #{scan.id.split("_")[1]}</p>
                  <p className="text-sm text-gray-600">{new Date(scan.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-green-100 text-green-800 mb-1">
                    Score: {scan.nutritionScore?.overall || 0}/100
                  </Badge>
                  <p className="text-sm text-gray-600">
                    {scan.results.filter((r: any) => r.isHarmful).length} harmful ingredients
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
