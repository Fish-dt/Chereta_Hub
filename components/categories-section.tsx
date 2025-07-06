"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Smartphone, Car, Gem, Home, Shirt, Gamepad2, Book, Music } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

const categories = [
  { name: "Electronics", icon: Smartphone, color: "bg-blue-100 text-blue-600" },
  { name: "Vehicles", icon: Car, color: "bg-red-100 text-red-600" },
  { name: "Jewelry", icon: Gem, color: "bg-purple-100 text-purple-600" },
  { name: "Home & Garden", icon: Home, color: "bg-green-100 text-green-600" },
  { name: "Fashion", icon: Shirt, color: "bg-pink-100 text-pink-600" },
  { name: "Sports", icon: Gamepad2, color: "bg-orange-100 text-orange-600" },
  { name: "Books", icon: Book, color: "bg-yellow-100 text-yellow-600" },
  { name: "Music", icon: Music, color: "bg-indigo-100 text-indigo-600" },
]

export function CategoriesSection() {
  const { t, language } = useLanguage()

  return (
    <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${language === "am" ? "font-amharic" : ""}`}>
            Browse by Category
          </h2>
          <p className={`text-xl text-muted-foreground max-w-2xl mx-auto ${language === "am" ? "font-amharic" : ""}`}>
            Find exactly what you're looking for in our diverse categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          {categories.map((category) => (
            <Link key={category.name} href={`/auctions?category=${category.name.toLowerCase()}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
                  >
                    <category.icon className="h-6 w-6" />
                  </div>
                  <h3 className={`font-medium text-sm ${language === "am" ? "font-amharic" : ""}`}>{category.name}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Button asChild variant="outline" size="lg" className={language === "am" ? "font-amharic" : ""}>
            <Link href="/categories">View All Categories</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
