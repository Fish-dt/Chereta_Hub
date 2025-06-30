"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Upload, X } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"

const auctionSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Please select a category"),
  condition: z.string().min(1, "Please select a condition"),
  startingBid: z.string().min(1, "Starting bid is required"),
  buyNowPrice: z.string().optional(),
  duration: z.string().min(1, "Please select auction duration"),
})

type AuctionFormData = z.infer<typeof auctionSchema>

const categories = [
  "Art & Collectibles",
  "Vehicles",
  "Jewelry & Watches",
  "Electronics",
  "Home & Garden",
  "Fashion",
  "Sports & Recreation",
  "Books & Media",
]

const conditions = ["New", "Like New", "Excellent", "Good", "Fair", "For Parts"]

const durations = [
  { value: "24", label: "1 Day" },
  { value: "72", label: "3 Days" },
  { value: "168", label: "7 Days" },
  { value: "240", label: "10 Days" },
]

export default function SellPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { t, language } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [images, setImages] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AuctionFormData>({
    resolver: zodResolver(auctionSchema),
  })

  const watchedCategory = watch("category")
  const watchedCondition = watch("condition")
  const watchedDuration = watch("duration")

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Sign In Required</h2>
            <p className="text-muted-foreground mb-4">You need to sign in to create an auction.</p>
            <Button asChild>
              <a href="/auth/login">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const onSubmit = async (data: AuctionFormData) => {
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auctions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          images,
          specifications: {},
          shippingInfo: {},
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess("Auction created successfully! Redirecting...")
        setTimeout(() => {
          router.push(`/auction/${result.auctionId}`)
        }, 2000)
      } else {
        setError(result.error || "Failed to create auction")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      // In a real app, you'd upload to a cloud service
      // For now, we'll use placeholder URLs
      const newImages = Array.from(files).map(
        (file, index) => `/placeholder.svg?height=300&width=400&text=${file.name}`,
      )
      setImages([...images, ...newImages].slice(0, 5)) // Max 5 images
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold text-foreground ${language === "am" ? "font-amharic" : ""}`}>
            Create New Auction
          </h1>
          <p className={`text-muted-foreground mt-2 ${language === "am" ? "font-amharic" : ""}`}>
            List your item and start receiving bids from buyers worldwide
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Auction Details</CardTitle>
            <CardDescription>Provide detailed information about your item</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="Enter a descriptive title for your item"
                  className="mt-1"
                />
                {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Provide detailed information about your item, including condition, history, and any defects"
                  className="mt-1 min-h-[120px]"
                />
                {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
              </div>

              {/* Category and Condition */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Category *</Label>
                  <Select onValueChange={(value) => setValue("category", value)} value={watchedCategory}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-sm text-destructive mt-1">{errors.category.message}</p>}
                </div>

                <div>
                  <Label>Condition *</Label>
                  <Select onValueChange={(value) => setValue("condition", value)} value={watchedCondition}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((condition) => (
                        <SelectItem key={condition} value={condition}>
                          {condition}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.condition && <p className="text-sm text-destructive mt-1">{errors.condition.message}</p>}
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startingBid">Starting Bid ($) *</Label>
                  <Input
                    id="startingBid"
                    type="number"
                    step="0.01"
                    min="1"
                    {...register("startingBid")}
                    placeholder="0.00"
                    className="mt-1"
                  />
                  {errors.startingBid && <p className="text-sm text-destructive mt-1">{errors.startingBid.message}</p>}
                </div>

                <div>
                  <Label htmlFor="buyNowPrice">Buy It Now Price ($)</Label>
                  <Input
                    id="buyNowPrice"
                    type="number"
                    step="0.01"
                    min="1"
                    {...register("buyNowPrice")}
                    placeholder="Optional"
                    className="mt-1"
                  />
                  {errors.buyNowPrice && <p className="text-sm text-destructive mt-1">{errors.buyNowPrice.message}</p>}
                </div>
              </div>

              {/* Duration */}
              <div>
                <Label>Auction Duration *</Label>
                <Select onValueChange={(value) => setValue("duration", value)} value={watchedDuration}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((duration) => (
                      <SelectItem key={duration.value} value={duration.value}>
                        {duration.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.duration && <p className="text-sm text-destructive mt-1">{errors.duration.message}</p>}
              </div>

              {/* Images */}
              <div>
                <Label>Images</Label>
                <div className="mt-2">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <div className="mt-4">
                      <Label htmlFor="images" className="cursor-pointer">
                        <span className="text-primary hover:text-primary/80">Upload images</span>
                        <Input
                          id="images"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">PNG, JPG, GIF up to 10MB each (max 5 images)</p>
                    </div>
                  </div>

                  {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-24 object-cover rounded border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Auction"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
