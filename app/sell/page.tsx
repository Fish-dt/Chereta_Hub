"use client"

import type React from "react"
import Link from "next/link"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Upload, X, Loader2, AlertCircle } from "lucide-react"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/hooks/useTranslation"

const categories = [
  "Electronics",
  "Fashion",
  "Home & Garden",
  "Sports & Outdoors",
  "Automotive",
  "Books & Media",
  "Art & Collectibles",
  "Jewelry & Watches",
  "Musical Instruments",
  "Other",
]

const conditions = ["New", "Like New", "Excellent", "Good", "Fair", "Poor"]

export default function SellPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { t, language } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [endDate, setEndDate] = useState<Date>()
  const [images, setImages] = useState<File[]>([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    startingBid: "",
    condition: "",
    location: "",
  })

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Sign In Required</h2>
            <p className="text-muted-foreground mb-4">You need to sign in to create an auction.</p>
            <Button asChild>
              <Link href="/auth/login?callbackUrl=/sell">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (images.length + files.length > 10) {
      setError("Maximum 10 images allowed")
      return
    }
    setImages([...images, ...files])
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    if (!endDate) {
      setError("Please select an end date")
      setIsLoading(false)
      return
    }

    if (images.length === 0) {
      setError("Please upload at least one image")
      setIsLoading(false)
      return
    }

    try {
      const formDataToSend = new FormData()

      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value)
      })

      formDataToSend.append("endTime", endDate.toISOString())

      // Add images
      images.forEach((image, index) => {
        formDataToSend.append(`image${index}`, image)
      })

      const response = await fetch("/api/auctions/create", {
        method: "POST",
        body: formDataToSend,
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Auction created successfully! It will be reviewed by our team before going live.")
        setTimeout(() => {
          console.log("Redirecting to dashboard after auction creation")
          router.push("/dashboard")
        }, 2000)
      } else {
        setError(data.error || "Failed to create auction")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold text-foreground ${language === "am" ? "font-amharic" : ""}`}>
            {t("sell.title")}
          </h1>
          <p className={`text-muted-foreground mt-2 ${language === "am" ? "font-amharic" : ""}`}>
            {t("sell.subtitle")}
          </p>
          <div className="flex items-center gap-2 mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <Badge className="h-5 w-5 text-blue-600">Info</Badge>
            <p className="text-sm text-blue-800 dark:text-blue-200">{t("sell.review.info")}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("sell.create.auction")}</CardTitle>
            <CardDescription>{t("sell.review.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">{t("sell.item.title")}</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder={t("sell.item.title.placeholder")}
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">{t("sell.description")}</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder={t("sell.description.placeholder")}
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Category and Condition */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("sell.category")}</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange("category", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("sell.select.category")} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t("sell.condition")}</Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) => handleSelectChange("condition", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("sell.select.condition")} />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((condition) => (
                        <SelectItem key={condition.toLowerCase()} value={condition.toLowerCase()}>
                          {condition}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startingBid">{t("sell.starting.bid")}</Label>
                  <Input
                    id="startingBid"
                    name="startingBid"
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.startingBid}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>


              </div>

              {/* Location and End Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">{t("sell.location")}</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder={t("sell.location.placeholder")}
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t("sell.end.date")}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground",
                        )}
                        disabled={isLoading}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : <span>{t("sell.pick.date")}</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Images */}
              <div className="space-y-2">
                <Label>{t("sell.images")} (Max 10)</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div className="mt-4">
                      <Label htmlFor="images" className="cursor-pointer">
                        <span className="text-primary hover:text-primary/80">{t("sell.upload.images")}</span>
                        <Input
                          id="images"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={isLoading}
                        />
                      </Label>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{t("sell.image.size")}</p>
                  </div>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image) || "/placeholder.svg"}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6"
                          onClick={() => removeImage(index)}
                          disabled={isLoading}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("sell.creating")}
                    </>
                  ) : (
                    t("sell.create.auction")
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
