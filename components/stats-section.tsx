import { TrendingUp, Users, Gavel, Award } from "lucide-react"

export function StatsSection() {
  const stats = [
    { icon: Users, label: "Active Users", value: "50K+" },
    { icon: Gavel, label: "Live Auctions", value: "1.2K+" },
    { icon: TrendingUp, label: "Items Sold", value: "100K+" },
    { icon: Award, label: "Success Rate", value: "98%" },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                <stat.icon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
