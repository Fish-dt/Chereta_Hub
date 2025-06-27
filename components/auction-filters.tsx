"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function AuctionFilters() {
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Range */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Price Range</Label>
          <Slider value={priceRange} onValueChange={setPriceRange} max={100000} step={1000} className="mb-3" />
          <div className="flex justify-between text-sm text-gray-600">
            <span>${priceRange[0].toLocaleString()}</span>
            <span>${priceRange[1].toLocaleString()}</span>
          </div>
        </div>

        <Separator />

        {/* Categories */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Categories</Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                />
                <Label htmlFor={category} className="text-sm">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Condition */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Condition</Label>
          <div className="space-y-2">
            {conditions.map((condition) => (
              <div key={condition} className="flex items-center space-x-2">
                <Checkbox
                  id={condition}
                  checked={selectedConditions.includes(condition)}
                  onCheckedChange={(checked) => handleConditionChange(condition, checked as boolean)}
                />
                <Label htmlFor={condition} className="text-sm">
                  {condition}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Auction Status */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Auction Status</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="active" />
              <Label htmlFor="active" className="text-sm">
                Active
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="ending-soon" />
              <Label htmlFor="ending-soon" className="text-sm">
                Ending Soon
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="buy-now" />
              <Label htmlFor="buy-now" className="text-sm">
                Buy It Now
              </Label>
            </div>
          </div>
        </div>

        <Button className="w-full bg-transparent" variant="outline">
          Clear All Filters
        </Button>
      </CardContent>
    </Card>
  )
}
