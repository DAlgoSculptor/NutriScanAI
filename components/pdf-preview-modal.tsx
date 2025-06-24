"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Download, Globe } from "lucide-react"
import { getReportTranslations, getLanguageName } from "@/lib/report-translations"

interface PDFPreviewModalProps {
  analysisResults: any[]
  nutritionScore: any
  selectedLanguage: string
  scanId: string
  scanDate: Date
  selectedFile: File | null
  healthAlerts: string[]
  onGeneratePDF: () => void
}

export function PDFPreviewModal({
  analysisResults,
  nutritionScore,
  selectedLanguage,
  scanId,
  scanDate,
  selectedFile,
  healthAlerts,
  onGeneratePDF,
}: PDFPreviewModalProps) {
  const translations = getReportTranslations(selectedLanguage)
  const harmfulCount = analysisResults.filter((r) => r.isHarmful).length
  const totalCount = analysisResults.length

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center">
          <Eye className="h-4 w-4 mr-2" />
          Preview PDF
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            PDF Report Preview - {getLanguageName(selectedLanguage)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-4 bg-white">
          {/* Header */}
          <div className="text-center border-b pb-4">
            <h1 className="text-2xl font-bold text-green-600 mb-2">{translations.title}</h1>
            <div className="flex justify-between text-sm text-gray-600">
              <span>
                {translations.scanId}: {scanId || "N/A"}
              </span>
              <span>
                {translations.date}: {scanDate.toLocaleDateString()}
              </span>
            </div>
            <div className="mt-2 text-sm">
              <span>
                {translations.product}: {selectedFile?.name || translations.unknown}
              </span>
              <Badge className="ml-2">
                {translations.language}: {getLanguageName(selectedLanguage)}
              </Badge>
            </div>
          </div>

          {/* Summary */}
          <div>
            <h2 className="text-lg font-semibold mb-3">{translations.summary}</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-xl font-bold">{totalCount}</div>
                <div className="text-sm text-gray-600">{translations.totalIngredients}</div>
              </div>
              <div className="bg-red-50 p-3 rounded">
                <div className="text-xl font-bold text-red-600">{harmfulCount}</div>
                <div className="text-sm text-red-600">{translations.harmfulIngredients}</div>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <div className="text-xl font-bold text-green-600">{totalCount - harmfulCount}</div>
                <div className="text-sm text-green-600">{translations.safeIngredients}</div>
              </div>
            </div>
          </div>

          {/* Nutrition Score */}
          {nutritionScore && (
            <div>
              <h2 className="text-lg font-semibold mb-3">{translations.nutritionScore}</h2>
              <div className="bg-blue-50 p-4 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{translations.overallScore}</span>
                  <span className="text-2xl font-bold text-blue-600">{nutritionScore.overall}/100</span>
                </div>
                <p className="text-sm text-gray-600">{nutritionScore.description}</p>
              </div>
            </div>
          )}

          {/* Health Alerts */}
          {healthAlerts.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3 text-red-600">{translations.healthAlerts}</h2>
              <div className="space-y-2">
                {healthAlerts.map((alert, index) => (
                  <div key={index} className="bg-red-50 p-3 rounded border-l-4 border-red-400">
                    <p className="text-sm text-red-800">{alert}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sample Ingredients */}
          <div>
            <h2 className="text-lg font-semibold mb-3">{translations.detailedAnalysis}</h2>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {analysisResults.slice(0, 5).map((result, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-2 rounded ${
                    result.isHarmful ? "bg-red-50" : "bg-green-50"
                  }`}
                >
                  <span className="text-sm">{result.ingredient}</span>
                  <Badge variant={result.isHarmful ? "destructive" : "default"}>
                    {result.isHarmful ? translations.harmful : translations.safe}
                  </Badge>
                </div>
              ))}
              {analysisResults.length > 5 && (
                <p className="text-sm text-gray-500 text-center">
                  ...and {analysisResults.length - 5} more ingredients
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 border-t pt-4">
            <p>{translations.footer}</p>
            <p>
              {translations.generatedOn}: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Action Button */}
          <div className="flex justify-center pt-4">
            <Button onClick={onGeneratePDF} className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Download PDF Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
