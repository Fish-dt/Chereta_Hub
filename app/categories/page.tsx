"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type Category = {
    _id: string
    name: string
    description: string
    slug: string
    icon: string
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("/api/categories")
            .then(res => res.json())
            .then(data => {
                console.log("Fetched categories:", data.categories)
                setCategories(data.categories || [])
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    if (loading) return <div className="p-8">Loading...</div>

    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Categories</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {categories.map((cat) => (
                    <Link
                        key={cat._id}
                        href={`/auctions?category=${encodeURIComponent(cat.name)}`}
                        className="flex flex-col items-center p-6 border rounded-lg shadow-md hover:shadow-lg transition"
                    >
                        <span className="text-4xl mb-2">
                            {cat.icon === "smartphone" && "📱"}
                            {cat.icon === "car" && "🚗"}
                            {cat.icon === "gem" && "💎"}
                            {cat.icon === "home" && "🏠"}
                            {cat.icon === "shirt" && "👕"}
                            {cat.icon === "gamepad-2" && "🎮"}
                            {cat.icon === "book" && "📚"}
                            {cat.icon === "palette" && "🎨"}
                            {cat.icon === "music" && "🎵"}
                            {cat.icon === "package" && "📦"}
                        </span>
                        <span className="text-lg font-medium">{cat.name}</span>
                        <span className="text-sm text-muted-foreground">
                            {cat.description}
                        </span>
                    </Link>
                ))}
            </div>
        </main>
    )
}