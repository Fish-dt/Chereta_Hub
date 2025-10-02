import { Skeleton } from "@/components/ui/skeleton"
import { AuctionCardSkeleton } from "./auction-card-skeleton"

export function HomePageSkeleton() {
  return (
    <div className="space-y-16">
      {/* Featured Auctions Section */}
      <section className="pt-4 pb-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>

          {/* Featured Auctions Carousel Skeleton */}
          <div className="relative">
            <div className="flex gap-6 overflow-hidden pl-2 pr-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="min-w-[260px] max-w-[260px]">
                  <AuctionCardSkeleton />
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-8">
            <Skeleton className="h-12 w-48 mx-auto" />
          </div>
        </div>
      </section>

      {/* Ending Soon Section */}
      <section className="pt-4 pb-16 px-4 bg-gradient-to-b from-background to-background/90">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-48 mx-auto mb-4" />
            <Skeleton className="h-6 w-80 mx-auto" />
          </div>

          {/* Ending Soon Carousel Skeleton */}
          <div className="relative">
            <div className="flex gap-6 overflow-hidden pl-2 pr-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="min-w-[260px] max-w-[260px]">
                  <AuctionCardSkeleton />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="pt-4 pb-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-56 mx-auto mb-4" />
            <Skeleton className="h-6 w-72 mx-auto" />
          </div>

          {/* Categories Grid Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="text-center space-y-3">
                <Skeleton className="h-20 w-20 mx-auto rounded-full" />
                <Skeleton className="h-4 w-16 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
