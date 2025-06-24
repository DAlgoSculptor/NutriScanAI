"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Users, MessageSquare, ThumbsUp, Flag, Star, TrendingUp } from "lucide-react"

interface CommunityModuleProps {
  user: any
}

export function CommunityModule({ user }: CommunityModuleProps) {
  const [reviews, setReviews] = useState<any[]>([])
  const [newReview, setNewReview] = useState({ product: "", rating: 5, comment: "" })
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    // Load mock community data
    const mockReviews = [
      {
        id: 1,
        user: "HealthyEater123",
        product: "Organic Granola Bar",
        rating: 5,
        comment: "Great alternative! No harmful ingredients detected. My kids love it too.",
        date: "2024-01-15",
        helpful: 12,
        reported: false,
        verified: true,
      },
      {
        id: 2,
        user: "NutritionMom",
        product: "Popular Cereal Brand X",
        rating: 2,
        comment: "Found 3 harmful ingredients including Red Dye 40. Looking for alternatives.",
        date: "2024-01-14",
        helpful: 8,
        reported: false,
        verified: true,
      },
      {
        id: 3,
        user: "FitnessGuru",
        product: "Protein Bar Pro",
        rating: 4,
        comment: "Good nutrition score but contains artificial sweeteners. Still better than most.",
        date: "2024-01-13",
        helpful: 15,
        reported: false,
        verified: false,
      },
    ]
    setReviews(mockReviews)
  }, [])

  const handleSubmitReview = () => {
    if (!user) {
      alert("Please sign in to submit reviews")
      return
    }

    const review = {
      id: reviews.length + 1,
      user: user.name,
      product: newReview.product,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split("T")[0],
      helpful: 0,
      reported: false,
      verified: true,
    }

    setReviews([review, ...reviews])
    setNewReview({ product: "", rating: 5, comment: "" })
  }

  const handleHelpful = (reviewId: number) => {
    setReviews(reviews.map((review) => (review.id === reviewId ? { ...review, helpful: review.helpful + 1 } : review)))
  }

  const handleReport = (reviewId: number) => {
    setReviews(reviews.map((review) => (review.id === reviewId ? { ...review, reported: true } : review)))
  }

  const filteredReviews = reviews.filter((review) => {
    if (filter === "all") return true
    if (filter === "positive") return review.rating >= 4
    if (filter === "negative") return review.rating <= 2
    if (filter === "verified") return review.verified
    return true
  })

  return (
    <div className="space-y-6">
      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">12,847</div>
            <div className="text-sm text-gray-600">Active Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <MessageSquare className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">3,291</div>
            <div className="text-sm text-gray-600">Product Reviews</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">89%</div>
            <div className="text-sm text-gray-600">Accuracy Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Submit Review */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle>Share Your Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Product name"
                value={newReview.product}
                onChange={(e) => setNewReview({ ...newReview, product: e.target.value })}
              />
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 cursor-pointer ${
                      star <= newReview.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                  />
                ))}
              </div>
              <Textarea
                placeholder="Share your experience with this product..."
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              />
              <Button onClick={handleSubmitReview} disabled={!newReview.product || !newReview.comment}>
                Submit Review
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter Options */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2 flex-wrap">
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
              All Reviews
            </Button>
            <Button
              variant={filter === "positive" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("positive")}
            >
              Positive
            </Button>
            <Button
              variant={filter === "negative" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("negative")}
            >
              Negative
            </Button>
            <Button
              variant={filter === "verified" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("verified")}
            >
              Verified Only
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review.id} className={review.reported ? "opacity-50" : ""}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{review.user}</span>
                  {review.verified && <Badge className="bg-green-100 text-green-800 text-xs">Verified</Badge>}
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${star <= review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                    />
                  ))}
                </div>
              </div>

              <h4 className="font-semibold mb-2">{review.product}</h4>
              <p className="text-gray-700 mb-4">{review.comment}</p>

              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{review.date}</span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleHelpful(review.id)}
                    className="flex items-center gap-1 hover:text-green-600"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    Helpful ({review.helpful})
                  </button>
                  <button
                    onClick={() => handleReport(review.id)}
                    className="flex items-center gap-1 hover:text-red-600"
                    disabled={review.reported}
                  >
                    <Flag className="h-4 w-4" />
                    {review.reported ? "Reported" : "Report"}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Community Guidelines */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">Community Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Share honest experiences with products you've actually tried</li>
            <li>• Be respectful and constructive in your feedback</li>
            <li>• Report false or misleading information to help maintain accuracy</li>
            <li>• Focus on ingredient safety and nutritional value</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
