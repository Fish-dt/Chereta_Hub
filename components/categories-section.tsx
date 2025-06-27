import { Card, CardContent } from "@/components/ui/card"
import { Car, Palette, Gem, Home, Laptop, Camera } from "lucide-react"
import Link from "next/link"

export function CategoriesSection() {
  const categories = [
    { icon: Car, name: "Vehicles", count: 245, color: "bg-red-500" },
    { icon: Palette, name: "Art & Collectibles", count: 189, color: "bg-purple-500" },
    { icon: Gem, name: "Jewelry", count: 156, color: "bg-pink-500" },
    { icon: Home, name: "Home & Garden", count: 298, color: "bg-green-500" },
    { icon: Laptop, name: "Electronics", count: 334, color: "bg-blue-500" },
    { icon: Camera, name: "Photography", count: 127, color: "bg-orange-500" },
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse Categories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our diverse range of auction categories and find exactly what you're looking for
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <Link key={index} href={`/auctions?category=${category.name.toLowerCase()}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div
                    className={`${category.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <category.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.count} items</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
