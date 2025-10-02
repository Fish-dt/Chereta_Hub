import { Skeleton } from "@/components/ui/skeleton"
import { AuctionsGridSkeleton } from "./auctions-grid-skeleton"

export function AuctionsPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar Skeleton */}
        <div className="lg:w-64">
          <div className="space-y-6">
            {/* Filter title */}
            <Skeleton className="h-6 w-20" />
            
            {/* Price range */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            {/* Category filter */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-20" />
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            </div>

            {/* Condition filter */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-20" />
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-10 w-24" />
          </div>

          {/* Search and Sort Skeleton */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-full sm:w-48" />
          </div>

          {/* Auctions Grid Skeleton */}
          <AuctionsGridSkeleton count={8} />

          {/* Load More Skeleton */}
          <div className="text-center mt-12">
            <Skeleton className="h-12 w-48 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  )
}
