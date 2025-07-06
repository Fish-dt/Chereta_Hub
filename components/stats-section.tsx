"use client"

import { useLanguage } from "@/contexts/language-context"

export function StatsSection() {
  const { language } = useLanguage()

  const stats = [
    { number: "50K+", label: "Active Users" },
    { number: "10K+", label: "Auctions Completed" },
    { number: "$2M+", label: "Total Sales" },
    { number: "99%", label: "Satisfaction Rate" },
  ]

  return (
    <section className="py-16 px-4 bg-primary text-primary-foreground">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${language === "am" ? "font-amharic" : ""}`}>
            Trusted by Thousands
          </h2>
          <p className={`text-xl opacity-90 max-w-2xl mx-auto ${language === "am" ? "font-amharic" : ""}`}>
            Join our growing community of buyers and sellers
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
              <div className={`text-lg opacity-90 ${language === "am" ? "font-amharic" : ""}`}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
