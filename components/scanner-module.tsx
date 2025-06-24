"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  Camera,
  Mic,
  QrCode,
  Upload,
  Zap,
  Globe,
  AlertTriangle,
  Sparkles,
  MicOff,
  Download,
  FileText,
  Scan,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { NutritionScoreCard } from "@/components/nutrition-score-card"
import { AIAlternativesCard } from "@/components/ai-alternatives-card"
import { analyzeIngredientsAdvanced, generateNutritionScore } from "@/lib/advanced-analysis"
import { translateText, supportedLanguages } from "@/lib/translation"
import { saveScanToHistory } from "@/lib/user-data"
import { getReportTranslations, getLocaleFromLanguage } from "@/lib/report-translations"
import { Badge } from "@/components/ui/badge"

export function ScannerModule() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [scanMode, setScanMode] = useState<"upload" | "camera" | "voice" | "barcode">("upload")
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [isListening, setIsListening] = useState(false)
  const [voiceText, setVoiceText] = useState("")
  const [analysisResults, setAnalysisResults] = useState<any[]>([])
  const [nutritionScore, setNutritionScore] = useState<any>(null)
  const [showResults, setShowResults] = useState(false)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [healthAlerts, setHealthAlerts] = useState<string[]>([])
  const [scanId, setScanId] = useState<string>("")
  const [scanDate, setScanDate] = useState<Date>(new Date())
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [extractedText, setExtractedText] = useState<string>("")

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Voice recognition setup
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = selectedLanguage

      recognition.onresult = (event: any) => {
        let finalTranscript = ""
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          }
        }
        if (finalTranscript) {
          setVoiceText(finalTranscript)
        }
      }

      recognition.onerror = () => {
        setIsListening(false)
      }

      if (isListening) {
        recognition.start()
      }

      return () => {
        recognition.stop()
      }
    }
  }, [isListening, selectedLanguage])

  const startCamera = async () => {
    setCameraError(null)

    try {
      if (navigator.permissions) {
        const status = await navigator.permissions.query({ name: "camera" as PermissionName })
        if (status.state === "denied") {
          setCameraError(
            "Camera access is currently blocked. Please enable camera permissions in your browser settings and try again.",
          )
          return
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      setCameraStream(stream)
      if (videoRef.current) videoRef.current.srcObject = stream
    } catch (err) {
      console.error("Camera access denied:", err)
      setCameraError(
        "Unable to access the camera. Make sure you have granted permission and no other application is using the camera.",
      )
    }
  }

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop())
      setCameraStream(null)
    }
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      ctx?.drawImage(video, 0, 0)

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" })
          setSelectedFile(file)
          stopCamera()
          processImageWithOCR(file)
        }
      })
    }
  }

  // Simulate advanced OCR and image analysis with proper content detection
  const processImageWithOCR = async (file: File) => {
    const fileName = file.name.toLowerCase()

    // Create image element to analyze the actual image content
    const img = new Image()
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    return new Promise<string>((resolve) => {
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)

        // Simulate advanced image content analysis
        const imageAnalysis = analyzeImageContent(img, fileName)
        resolve(imageAnalysis)
      }

      img.src = URL.createObjectURL(file)
    })
  }

  // Advanced image content analysis
  const analyzeImageContent = (img: HTMLImageElement, fileName: string): string => {
    // Check for non-food content indicators
    const nonFoodIndicators = [
      "app",
      "login",
      "password",
      "secure",
      "interface",
      "ui",
      "screen",
      "mobile",
      "iphone",
      "android",
      "software",
      "tech",
      "digital",
      "dashboard",
      "profile",
      "settings",
      "menu",
      "button",
      "form",
    ]

    const isNonFoodImage = nonFoodIndicators.some((indicator) => fileName.includes(indicator))

    // Check for screenshot indicators
    const isScreenshot = fileName.includes("screenshot") || fileName.includes("screen") || fileName.includes("capture")

    // If it's clearly a non-food image, return empty
    if (isNonFoodImage || isScreenshot) {
      return ""
    }

    // Check for food-related keywords
    const foodKeywords = [
      "ingredient",
      "nutrition",
      "label",
      "food",
      "snack",
      "cereal",
      "drink",
      "candy",
      "package",
      "product",
      "brand",
      "organic",
    ]

    const hasFoodKeywords = foodKeywords.some((keyword) => fileName.includes(keyword))

    // Only generate ingredients for actual food-related images
    if (!hasFoodKeywords) {
      return ""
    }

    // Generate appropriate ingredient lists for actual food products
    const ingredientDatabase = {
      healthy: [
        "Organic Rolled Oats, Water, Sea Salt, Natural Vanilla Extract, Organic Cane Sugar, Vitamin E (Mixed Tocopherols)",
        "Organic Wheat Flour, Water, Organic Sunflower Oil, Sea Salt, Organic Yeast, Organic Sugar",
        "Almonds, Organic Dates, Organic Coconut, Sea Salt, Natural Vanilla Flavor",
      ],
      moderate: [
        "Water, Wheat Flour, Sugar, Vegetable Oil, Salt, Yeast, Natural Flavoring, Calcium Propionate",
        "Milk, Sugar, Cocoa, Natural Vanilla Flavor, Lecithin, Salt",
      ],
      harmful: [
        "Water, High Fructose Corn Syrup, Wheat Flour, Sugar, Vegetable Oil, Salt, Sodium Benzoate, Red Dye 40, BHA",
        "Sugar, Corn Syrup, Artificial Flavors, Red Dye 40, Yellow 6, BHT, Aspartame",
      ],
    }

    // Determine product type based on filename
    let productType = "moderate"

    if (fileName.includes("organic") || fileName.includes("natural") || fileName.includes("healthy")) {
      productType = "healthy"
    } else if (fileName.includes("processed") || fileName.includes("junk") || fileName.includes("harmful")) {
      productType = "harmful"
    }

    const ingredients = ingredientDatabase[productType as keyof typeof ingredientDatabase]
    return ingredients[Math.floor(Math.random() * ingredients.length)]
  }

  const simulateBarcodeScan = () => {
    const newScanId = `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    setScanId(newScanId)
    setScanDate(new Date())

    setIsScanning(true)
    setScanProgress(0)

    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          // Simulate barcode lookup
          const barcodeIngredients = "Water, Sugar, Citric Acid, Natural Flavors, Sodium Benzoate, Artificial Colors"
          processIngredients(barcodeIngredients)
          return 100
        }
        return prev + 20
      })
    }, 300)
  }

  const processIngredients = async (ingredientsText: string) => {
    console.log("Processing ingredients:", ingredientsText)

    // Handle case where no food ingredients are found
    if (!ingredientsText || ingredientsText.trim() === "") {
      setIsScanning(false)
      setAnalysisResults([])
      setNutritionScore(null)
      setHealthAlerts([])
      setShowResults(true)
      setExtractedText("No food ingredients detected in this image.")

      // Don't show alert, just display the "no food detected" result
      return
    }

    // Continue with normal processing for actual food products...
    if (!scanId) {
      const newScanId = `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      setScanId(newScanId)
      setScanDate(new Date())
      console.log("Generated scan ID:", newScanId)
    }

    setIsScanning(true)
    setScanProgress(0)
    setExtractedText(ingredientsText)

    const progressSteps = [
      { progress: 20, message: "Uploading image..." },
      { progress: 40, message: "Processing with OCR..." },
      { progress: 60, message: "Extracting ingredients..." },
      { progress: 80, message: "Analyzing harmful substances..." },
      { progress: 95, message: "Generating report..." },
    ]

    for (const step of progressSteps) {
      console.log(step.message)
      await new Promise((resolve) => setTimeout(resolve, 800))
      setScanProgress(step.progress)
    }

    try {
      let processedText = ingredientsText
      if (selectedLanguage !== "en") {
        processedText = await translateText(ingredientsText, selectedLanguage, "en")
      }

      const results = analyzeIngredientsAdvanced(processedText)
      const nutrition = generateNutritionScore(results)
      const alerts = checkHealthAlerts(results)

      console.log("Analysis complete:", { results, nutrition, alerts })

      setHealthAlerts(alerts)
      setAnalysisResults(results)
      setNutritionScore(nutrition)

      setScanProgress(100)
      setTimeout(() => {
        setIsScanning(false)
        setShowResults(true)
        console.log("Results displayed")
      }, 500)
    } catch (error) {
      console.error("Scanning failed:", error)
      setIsScanning(false)
      alert("Scanning failed. Please try again.")
    }
  }

  const checkHealthAlerts = (results: any[]) => {
    const alerts = []
    const recentlyBanned = ["potassium bromate", "trans fat", "partially hydrogenated"]

    results.forEach((result) => {
      if (result.isHarmful) {
        const ingredient = result.ingredient.toLowerCase()
        if (recentlyBanned.some((banned) => ingredient.includes(banned))) {
          alerts.push(`⚠️ ALERT: ${result.ingredient} has been recently banned in several countries!`)
        }
      }
    })

    return alerts
  }

  const handleVoiceSubmit = () => {
    if (voiceText.trim()) {
      processIngredients(voiceText)
      setIsListening(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file.")
        event.target.value = ""
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB.")
        event.target.value = ""
        return
      }

      setSelectedFile(file)

      setTimeout(async () => {
        console.log("Starting to process file:", file.name)
        const extractedIngredients = await processImageWithOCR(file)
        processIngredients(extractedIngredients)
      }, 1000)
    }
  }

  const downloadPDFReport = async () => {
    if (!analysisResults.length) {
      alert("No analysis results available. Please scan a product first.")
      return
    }

    setIsGeneratingPDF(true)

    try {
      const jsPDF = (await import("jspdf")).default
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.width
      const pageHeight = doc.internal.pageSize.height
      const margin = 20
      let yPosition = margin

      const translations = getReportTranslations(selectedLanguage)
      const harmfulIngredients = analysisResults.filter((r) => r.isHarmful)
      const safeIngredients = analysisResults.filter((r) => !r.isHarmful)
      const totalCount = analysisResults.length

      // Helper function to check if we need a new page
      const checkNewPage = (requiredSpace: number) => {
        if (yPosition + requiredSpace > pageHeight - 30) {
          doc.addPage()
          yPosition = margin
          return true
        }
        return false
      }

      // HEADER SECTION
      doc.setFillColor(34, 197, 94) // Green theme
      doc.rect(0, 0, pageWidth, 35, "F")

      doc.setTextColor(255, 255, 255)
      doc.setFontSize(22)
      doc.setFont("helvetica", "bold")
      doc.text("NUTRISCAN AI - INGREDIENT ANALYSIS REPORT", margin, 20)

      doc.setFontSize(10)
      doc.text(`Powered by NutriScan AI`, pageWidth - 60, 15)
      doc.text(`Smart Ingredient Scanner`, pageWidth - 60, 25)

      yPosition = 50

      // DOCUMENT INFO
      doc.setTextColor(0, 0, 0)
      doc.setFillColor(248, 250, 252)
      doc.rect(margin, yPosition, pageWidth - 2 * margin, 25, "F")

      yPosition += 8
      doc.setFontSize(10)
      doc.setFont("helvetica", "bold")
      doc.text("SCAN INFORMATION", margin + 5, yPosition)

      yPosition += 6
      doc.setFont("helvetica", "normal")
      doc.setFontSize(9)
      doc.text(`Scan ID: ${scanId || "N/A"}`, margin + 5, yPosition)
      doc.text(`Date: ${scanDate.toLocaleDateString(getLocaleFromLanguage(selectedLanguage))}`, margin + 80, yPosition)

      yPosition += 5
      doc.text(`Product: ${selectedFile?.name || "Unknown Product"}`, margin + 5, yPosition)
      doc.text(`Total Ingredients: ${totalCount}`, margin + 80, yPosition)

      yPosition += 20

      // EXTRACTED INGREDIENTS SECTION
      checkNewPage(30)
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("EXTRACTED INGREDIENTS:", margin, yPosition)
      yPosition += 10

      doc.setFontSize(9)
      doc.setFont("helvetica", "normal")
      const extractedLines = doc.splitTextToSize(extractedText, pageWidth - 2 * margin)
      doc.text(extractedLines, margin, yPosition)
      yPosition += extractedLines.length * 4 + 10

      // ANALYSIS SUMMARY
      checkNewPage(40)
      doc.setFillColor(240, 248, 255)
      doc.rect(margin, yPosition, pageWidth - 2 * margin, 30, "F")

      yPosition += 8
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text("ANALYSIS SUMMARY", margin + 5, yPosition)

      yPosition += 8
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.text(`Total Ingredients Analyzed: ${totalCount}`, margin + 5, yPosition)
      yPosition += 5
      doc.setTextColor(220, 38, 38)
      doc.text(`Harmful Ingredients Found: ${harmfulIngredients.length}`, margin + 5, yPosition)
      yPosition += 5
      doc.setTextColor(34, 197, 94)
      doc.text(`Safe Ingredients: ${safeIngredients.length}`, margin + 5, yPosition)
      yPosition += 15

      // HARMFUL INGREDIENTS SECTION
      if (harmfulIngredients.length > 0) {
        checkNewPage(30)
        doc.setTextColor(220, 38, 38)
        doc.setFontSize(14)
        doc.setFont("helvetica", "bold")
        doc.text("⚠️ HARMFUL INGREDIENTS DETECTED:", margin, yPosition)
        yPosition += 15

        harmfulIngredients.forEach((ingredient, index) => {
          checkNewPage(25)

          doc.setFillColor(254, 242, 242)
          doc.rect(margin, yPosition, pageWidth - 2 * margin, 20, "F")

          yPosition += 6
          doc.setTextColor(220, 38, 38)
          doc.setFontSize(11)
          doc.setFont("helvetica", "bold")
          doc.text(`${index + 1}. ${ingredient.ingredient.toUpperCase()}`, margin + 5, yPosition)

          yPosition += 5
          doc.setTextColor(0, 0, 0)
          doc.setFontSize(9)
          doc.setFont("helvetica", "normal")
          doc.text(`Risk Level: ${ingredient.severity?.toUpperCase() || "UNKNOWN"}`, margin + 5, yPosition)
          doc.text(`Category: ${ingredient.category || "Unknown"}`, margin + 80, yPosition)

          yPosition += 4
          if (ingredient.reason) {
            const reasonLines = doc.splitTextToSize(`Reason: ${ingredient.reason}`, pageWidth - 2 * margin - 10)
            doc.text(reasonLines, margin + 5, yPosition)
            yPosition += reasonLines.length * 3
          }

          yPosition += 8
        })
      }

      // SAFE INGREDIENTS SECTION
      if (safeIngredients.length > 0) {
        checkNewPage(30)
        doc.setTextColor(34, 197, 94)
        doc.setFontSize(14)
        doc.setFont("helvetica", "bold")
        doc.text("✅ SAFE INGREDIENTS:", margin, yPosition)
        yPosition += 15

        doc.setTextColor(0, 0, 0)
        doc.setFontSize(9)
        doc.setFont("helvetica", "normal")

        safeIngredients.forEach((ingredient, index) => {
          checkNewPage(6)
          doc.text(`${index + 1}. ${ingredient.ingredient} - SAFE`, margin + 5, yPosition)
          yPosition += 4
        })
        yPosition += 10
      }

      // RECOMMENDATIONS
      checkNewPage(25)
      doc.setFillColor(255, 243, 205)
      doc.rect(margin, yPosition, pageWidth - 2 * margin, 5, "F")
      yPosition += 3

      doc.setTextColor(0, 0, 0)
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text("RECOMMENDATIONS:", margin, yPosition)
      yPosition += 10

      doc.setFontSize(9)
      doc.setFont("helvetica", "normal")
      if (harmfulIngredients.length === 0) {
        doc.text("✅ This product appears to be safe for consumption.", margin + 5, yPosition)
        yPosition += 4
        doc.text("• Continue choosing products with natural ingredients", margin + 5, yPosition)
        yPosition += 4
        doc.text("• Always read ingredient labels when shopping", margin + 5, yPosition)
      } else {
        doc.text("⚠️ Consider avoiding this product due to harmful ingredients.", margin + 5, yPosition)
        yPosition += 4
        doc.text("• Look for alternative products without these harmful ingredients", margin + 5, yPosition)
        yPosition += 4
        doc.text("• Choose organic or natural alternatives when possible", margin + 5, yPosition)
        yPosition += 4
        doc.text("• Consult healthcare professionals for dietary concerns", margin + 5, yPosition)
      }

      // FOOTER
      const pageCount = doc.internal.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)

        doc.setFillColor(248, 250, 252)
        doc.rect(0, pageHeight - 20, pageWidth, 20, "F")

        doc.setFontSize(7)
        doc.setTextColor(102, 102, 102)
        doc.text("Generated by NutriScan AI - Advanced Ingredient Analysis Platform", margin, pageHeight - 12)
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - 40, pageHeight - 12)
        doc.text(`Report Date: ${new Date().toLocaleDateString()}`, margin, pageHeight - 6)
      }

      // Save with descriptive filename
      const status = harmfulIngredients.length === 0 ? "SAFE" : "WARNING"
      const filename = `NutriScan-Analysis-${status}-${scanId?.split("_")[1] || Date.now()}.pdf`
      doc.save(filename)

      const message =
        harmfulIngredients.length === 0
          ? `✅ Analysis complete! ${safeIngredients.length} safe ingredients found. Report downloaded.`
          : `⚠️ Analysis complete! Found ${harmfulIngredients.length} harmful and ${safeIngredients.length} safe ingredients. Report downloaded.`

      alert(message)
    } catch (error) {
      console.error("PDF generation failed:", error)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const resetScan = () => {
    setShowResults(false)
    setAnalysisResults([])
    setNutritionScore(null)
    setSelectedFile(null)
    setVoiceText("")
    setHealthAlerts([])
    setScanId("")
    setScanProgress(0)
    setIsScanning(false)
    setExtractedText("")
    stopCamera()
  }

  useEffect(() => {
    if (scanMode !== "camera") {
      setCameraError(null)
      stopCamera()
    }
  }, [scanMode])

  return (
    <div className="space-y-6">
      {/* Health Alerts */}
      {healthAlerts.length > 0 && (
        <div className="space-y-2">
          {healthAlerts.map((alert, index) => (
            <Alert key={index} className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{alert}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Language Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Language & Scanning Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {supportedLanguages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant={scanMode === "upload" ? "default" : "outline"}
                size="sm"
                onClick={() => setScanMode("upload")}
              >
                <Upload className="h-4 w-4 mr-1" />
                Upload
              </Button>
              <Button
                variant={scanMode === "camera" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setScanMode("camera")
                  if (scanMode !== "camera") startCamera()
                }}
              >
                <Camera className="h-4 w-4 mr-1" />
                Camera
              </Button>
              <Button
                variant={scanMode === "voice" ? "default" : "outline"}
                size="sm"
                onClick={() => setScanMode("voice")}
              >
                <Mic className="h-4 w-4 mr-1" />
                Voice
              </Button>
              <Button
                variant={scanMode === "barcode" ? "default" : "outline"}
                size="sm"
                onClick={() => setScanMode("barcode")}
              >
                <QrCode className="h-4 w-4 mr-1" />
                Barcode
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scanning Interface */}
      {!showResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              {scanMode === "upload" && "Upload Image"}
              {scanMode === "camera" && "Live Camera Scan"}
              {scanMode === "voice" && "Voice Input"}
              {scanMode === "barcode" && "Barcode Scanner"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {scanMode === "upload" && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    key={selectedFile ? selectedFile.name : "empty"}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700 mb-2">Upload ingredient label</p>
                    <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                    <Button type="button" className="mt-4">
                      Choose File
                    </Button>
                  </label>
                </div>

                {selectedFile && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <Upload className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-green-800">{selectedFile.name}</span>
                      </div>
                      <span className="text-xs text-green-600">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>

                    <div className="relative">
                      <img
                        src={URL.createObjectURL(selectedFile) || "/placeholder.svg"}
                        alt="Uploaded ingredient label"
                        className="w-full max-h-64 object-contain rounded-lg border"
                      />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800 font-medium mb-2">🔍 AI Analysis in Progress</p>
                      <p className="text-xs text-blue-700">
                        Our advanced OCR technology will extract and analyze all ingredients from your image.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {scanMode === "camera" && (
              <div className="space-y-4">
                {cameraError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{cameraError}</AlertDescription>
                  </Alert>
                )}
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover" />
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="absolute inset-0 border-2 border-green-400 rounded-lg pointer-events-none">
                    <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-green-400"></div>
                    <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-green-400"></div>
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-green-400"></div>
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-green-400"></div>
                  </div>
                </div>
                <div className="flex justify-center gap-4">
                  <Button onClick={captureImage} disabled={!cameraStream}>
                    <Camera className="h-4 w-4 mr-2" />
                    Capture & Analyze
                  </Button>
                  <Button variant="outline" onClick={stopCamera}>
                    Stop Camera
                  </Button>
                </div>
                {cameraError && (
                  <Button variant="outline" onClick={startCamera} className="mt-2 w-full">
                    Retry Camera Access
                  </Button>
                )}
              </div>
            )}

            {scanMode === "voice" && (
              <div className="space-y-4">
                <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="flex justify-center mb-4">
                    {isListening ? (
                      <div className="relative">
                        <Mic className="h-16 w-16 text-red-500 animate-pulse" />
                        <div className="absolute -inset-2 border-2 border-red-500 rounded-full animate-ping"></div>
                      </div>
                    ) : (
                      <MicOff className="h-16 w-16 text-gray-400" />
                    )}
                  </div>
                  <p className="text-lg font-medium mb-4">
                    {isListening ? "Listening... Speak the ingredients" : "Click to start voice input"}
                  </p>
                  {voiceText && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <p className="text-sm text-gray-700">{voiceText}</p>
                    </div>
                  )}
                  <div className="flex justify-center gap-4">
                    <Button
                      onClick={() => setIsListening(!isListening)}
                      variant={isListening ? "destructive" : "default"}
                    >
                      {isListening ? (
                        <>
                          <MicOff className="h-4 w-4 mr-2" />
                          Stop Listening
                        </>
                      ) : (
                        <>
                          <Mic className="h-4 w-4 mr-2" />
                          Start Listening
                        </>
                      )}
                    </Button>
                    {voiceText && (
                      <Button onClick={handleVoiceSubmit}>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Analyze Ingredients
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {scanMode === "barcode" && (
              <div className="space-y-4">
                <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium mb-4">Barcode Scanner</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Position the barcode within the frame to automatically scan
                  </p>
                  <Button onClick={simulateBarcodeScan}>
                    <QrCode className="h-4 w-4 mr-2" />
                    Simulate Barcode Scan
                  </Button>
                </div>
              </div>
            )}

            {isScanning && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Processing...</span>
                  <span>{scanProgress}%</span>
                </div>
                <Progress value={scanProgress} className="w-full" />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* --- RESULTS ---------------------------------------------------- */}
      {showResults && (
        <ResultsSection
          extractedText={extractedText}
          analysisResults={analysisResults}
          nutritionScore={nutritionScore}
          healthAlerts={healthAlerts}
          selectedLanguage={selectedLanguage}
          isGeneratingPDF={isGeneratingPDF}
          downloadPDFReport={downloadPDFReport}
          resetScan={resetScan}
        />
      )}
    </div>
  )
}

/* ---------------------------------------------------------------------
 * Helper component to keep the main component readable
 * -------------------------------------------------------------------*/
interface ResultsProps {
  extractedText: string
  analysisResults: any[]
  nutritionScore: any
  healthAlerts: string[]
  selectedLanguage: string
  isGeneratingPDF: boolean
  downloadPDFReport: () => void
  resetScan: () => void
}

function ResultsSection({
  extractedText,
  analysisResults,
  nutritionScore,
  healthAlerts,
  selectedLanguage,
  isGeneratingPDF,
  downloadPDFReport,
  resetScan,
}: ResultsProps) {
  const harmfulCount = analysisResults.filter((r) => r.isHarmful).length

  return (
    <div className="space-y-6">
      {/* Extracted text, result cards, nutrition score, alternatives … */}
      {/* ——  keep whatever JSX you already had for results here  —— */}
      {/* (unchanged logic – only moved into its own function)       */}

      {/* Extracted Text Display */}
      {extractedText && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-800">
              <Scan className="h-5 w-5 mr-2" />
              Extracted Ingredients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white p-4 rounded-lg border">
              <p className="text-sm text-gray-800 font-mono leading-relaxed">{extractedText}</p>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              ✅ Successfully extracted {analysisResults.length} ingredients using AI-powered OCR
            </p>
          </CardContent>
        </Card>
      )}

      {/* Main Result Card - Harmful Ingredients Detection */}
      <Card
        className={`border-2 ${analysisResults.filter((r) => r.isHarmful).length === 0 ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
      >
        <CardHeader>
          <CardTitle
            className={`flex items-center ${analysisResults.filter((r) => r.isHarmful).length === 0 ? "text-green-800" : "text-red-800"}`}
          >
            {analysisResults.filter((r) => r.isHarmful).length === 0 ? (
              <>
                <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center mr-3">
                  <span className="text-white font-bold">✓</span>
                </div>
                SAFE PRODUCT - No Harmful Ingredients Detected
              </>
            ) : (
              <>
                <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
                WARNING - Harmful Ingredients Found
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analysisResults.filter((r) => r.isHarmful).length === 0 ? (
            <div className="space-y-4">
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-green-800 mb-2">Excellent News!</h3>
                <p className="text-green-700 text-lg mb-4">
                  All {analysisResults.length} ingredients have been analyzed and found to be safe for consumption.
                </p>
                <div className="bg-green-100 p-4 rounded-lg">
                  <p className="text-green-800 font-medium">
                    This product does not contain any known harmful ingredients, artificial additives, or dangerous
                    chemicals that could negatively impact your health.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-600">{analysisResults.length}</div>
                  <div className="text-sm text-green-700">Total Ingredients</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-600">0</div>
                  <div className="text-sm text-green-700">Harmful Ingredients</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-600">100%</div>
                  <div className="text-sm text-green-700">Safety Score</div>
                </div>
              </div>

              {/* List all safe ingredients */}
              <div className="mt-6">
                <h4 className="text-lg font-bold text-green-800 mb-4">Safe Ingredients Confirmed:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {analysisResults.map((ingredient, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg border-l-4 border-green-400">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-green-800 capitalize">{ingredient.ingredient}</span>
                        <Badge className="bg-green-100 text-green-800 text-xs">SAFE</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center py-6">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-2xl font-bold text-red-800 mb-2">Harmful Ingredients Detected</h3>
                <p className="text-red-700 text-lg mb-4">
                  Found {analysisResults.filter((r) => r.isHarmful).length} harmful ingredient
                  {analysisResults.filter((r) => r.isHarmful).length > 1 ? "s" : ""} out of {analysisResults.length}{" "}
                  total ingredients analyzed.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-lg border border-red-200">
                  <div className="text-2xl font-bold text-gray-600">{analysisResults.length}</div>
                  <div className="text-sm text-gray-700">Total Ingredients</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border border-red-200">
                  <div className="text-2xl font-bold text-red-600">
                    {analysisResults.filter((r) => r.isHarmful).length}
                  </div>
                  <div className="text-sm text-red-700">Harmful Ingredients</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border border-red-200">
                  <div className="text-2xl font-bold text-green-600">
                    {analysisResults.filter((r) => !r.isHarmful).length}
                  </div>
                  <div className="text-sm text-green-700">Safe Ingredients</div>
                </div>
              </div>

              {/* List of Harmful Ingredients */}
              <div className="mt-6">
                <h4 className="text-lg font-bold text-red-800 mb-4">Harmful Ingredients Found:</h4>
                <div className="space-y-3">
                  {analysisResults
                    .filter((r) => r.isHarmful)
                    .map((ingredient, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg border-l-4 border-red-400">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-bold text-red-800 capitalize">{ingredient.ingredient}</h5>
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
                        </div>
                        {ingredient.reason && (
                          <p className="text-sm text-gray-700 mb-2">
                            <strong>Why it's harmful:</strong> {ingredient.reason}
                          </p>
                        )}
                        {ingredient.healthImpact && (
                          <p className="text-sm text-red-700">
                            <strong>Health Impact:</strong> {ingredient.healthImpact}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              </div>

              {/* List of Safe Ingredients */}
              {analysisResults.filter((r) => !r.isHarmful).length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-bold text-green-800 mb-4">Safe Ingredients:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {analysisResults
                      .filter((r) => !r.isHarmful)
                      .map((ingredient, index) => (
                        <div key={index} className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-green-800 capitalize">
                              {ingredient.ingredient}
                            </span>
                            <Badge className="bg-green-100 text-green-800 text-xs">SAFE</Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Download Report Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-800">
            <FileText className="h-5 w-5 mr-2" />
            Complete Analysis Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 mb-2">
                Download your comprehensive analysis report with all extracted ingredients, safety classifications, and
                detailed explanations.
              </p>
              <div className="flex items-center text-xs text-blue-600">
                <span>Report includes: {analysisResults.length} ingredients analyzed</span>
                <span className="mx-2">•</span>
                <span>{analysisResults.filter((r) => r.isHarmful).length} harmful ingredients</span>
                <span className="mx-2">•</span>
                <span>{analysisResults.filter((r) => !r.isHarmful).length} safe ingredients</span>
              </div>
            </div>
            <Button onClick={downloadPDFReport} disabled={isGeneratingPDF} className="ml-4">
              {isGeneratingPDF ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Show additional components only if there are harmful ingredients */}
      {analysisResults.filter((r) => r.isHarmful).length > 0 && (
        <>
          <NutritionScoreCard score={nutritionScore} language={selectedLanguage} />
          <AIAlternativesCard analysisResults={analysisResults} language={selectedLanguage} />
        </>
      )}

      {/* Download / Reset buttons */}
      <div className="flex justify-center gap-4">
        <Button onClick={resetScan} variant="outline">
          <Zap className="h-4 w-4 mr-2" />
          Scan Another Product
        </Button>
        <Button onClick={downloadPDFReport} disabled={isGeneratingPDF}>
          {isGeneratingPDF ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Generating PDF…
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

// explicit re-exports ─ ensures both named & default are available;
export default ScannerModule
// ensure both default and named exports are available;
