"use client"

import { TrendingUp, Users, Gavel, Award } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function StatsSection() {
  const { t, language } = useLanguage()

  const stats = [
    { icon: Users, label: t("stats.users"), value: "50K+" },
    { icon: Gavel, label: t("stats.auctions"), value: "1.2K+" },
    { icon: TrendingUp, label: t("stats.sold"), value: "100K+" },
    { icon: Award, label: t("stats.success"), value: "98%" },
  ]

  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                <stat.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
              <div className={`text-muted-foreground ${language === "am" ? "font-amharic" : ""}`}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
