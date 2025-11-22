"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
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

export interface AuctionFiltersProps {
  minPrice: number
  maxPrice: number
  onMinPriceChange: (value: number) => void
  onMaxPriceChange: (value: number) => void
  selectedCategory: string | null
  onCategoryChange: (category: string | null) => void
  selectedConditions: string[]
  onConditionChange: (conditions: string[]) => void
  selectedStatus: string[]
  onStatusChange: (status: string[]) => void
}

export function AuctionFilters({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  selectedCategory,
  onCategoryChange,
  selectedConditions,
  onConditionChange,
  selectedStatus,
  onStatusChange,
}: AuctionFiltersProps) {
  const { t, language } = useTranslation()

  const handleCategoryChange = (category: string, checked: boolean) => {
    onCategoryChange(checked ? category : null)
  }

  const handleConditionChange = (condition: string, checked: boolean) => {
    if (checked) {
      onConditionChange([...selectedConditions, condition])
    } else {
      onConditionChange(selectedConditions.filter((c) => c !== condition))
    }
  }

  const handleStatusChange = (status: string, checked: boolean) => {
    if (checked) {
      onStatusChange([...selectedStatus, status])
    } else {
      onStatusChange(selectedStatus.filter((s) => s !== status))
    }
  }

  const clearFilters = () => {
    onMinPriceChange(0)
    onMaxPriceChange(10000)
    onCategoryChange(null)
    onConditionChange([])
    onStatusChange(["active"])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className={`flex justify-between items-center ${language === "am" ? "font-amharic" : ""}`}>
          <span>Filters</span>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Price Range */}
        <div>
          <Label className={`text-sm font-medium ${language === "am" ? "font-amharic" : ""}`}>Price Range</Label>
          <div className="mt-2 relative">
            <Slider
              value={[minPrice, maxPrice]}
              onValueCommit={(values) => {
                onMinPriceChange(values[0])
                onMaxPriceChange(values[1])
              }}
              max={10000}
              min={0}
              step={100}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-1">
              <span>${minPrice}</span>
              <span>${maxPrice}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Categories */}
        <div>
          <Label className={`text-sm font-medium ${language === "am" ? "font-amharic" : ""}`}>
            {t("sell.category")}
          </Label>
          <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={selectedCategory === category}
                  onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                />
                <Label htmlFor={category} className="text-sm cursor-pointer">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Condition */}
        <div>
          <Label className={`text-sm font-medium ${language === "am" ? "font-amharic" : ""}`}>
            {t("sell.condition")}
          </Label>
          <div className="mt-2 space-y-2">
            {conditions.map((condition) => (
              <div key={condition} className="flex items-center space-x-2">
                <Checkbox
                  id={condition}
                  checked={selectedConditions.includes(condition)}
                  onCheckedChange={(checked) => handleConditionChange(condition, checked as boolean)}
                />
                <Label htmlFor={condition} className="text-sm cursor-pointer">
                  {condition}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Auction Status */}
        <div>
          <Label className={`text-sm font-medium ${language === "am" ? "font-amharic" : ""}`}>Auction Status</Label>
          <div className="mt-2 space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="active"
                checked={selectedStatus.includes("active")}
                onCheckedChange={(checked) => handleStatusChange("active", checked as boolean)}
              />
              <Label htmlFor="active" className="text-sm cursor-pointer">
                Active
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ending-soon"
                checked={selectedStatus.includes("ending-soon")}
                onCheckedChange={(checked) => handleStatusChange("ending-soon", checked as boolean)}
              />
              <Label htmlFor="ending-soon" className="text-sm cursor-pointer">
                Ending Soon (24h)
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
