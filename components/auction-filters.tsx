"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/contexts/language-context"

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

export function AuctionFilters() {
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  const { t, language } = useLanguage()

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category])
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    }
  }

  const handleConditionChange = (condition: string, checked: boolean) => {
    if (checked) {
      setSelectedConditions([...selectedConditions, condition])
    } else {
      setSelectedConditions(selectedConditions.filter((c) => c !== condition))
    }
  }

  const clearFilters = () => {
    setPriceRange([0, 10000])
    setSelectedCategories([])
    setSelectedConditions([])
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
          <div className="mt-2">
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={10000}
              min={0}
              step={100}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-1">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
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
                  checked={selectedCategories.includes(category)}
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
              <Checkbox id="active" defaultChecked />
              <Label htmlFor="active" className="text-sm cursor-pointer">
                Active
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="ending-soon" />
              <Label htmlFor="ending-soon" className="text-sm cursor-pointer">
                Ending Soon (24h)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="buy-now" />
              <Label htmlFor="buy-now" className="text-sm cursor-pointer">
                Buy It Now Available
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
