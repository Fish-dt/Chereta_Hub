import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function AuctionCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Image skeleton */}
      <div className="relative aspect-square">
        <Skeleton className="h-full w-full" />
        {/* Category badge skeleton */}
        <Skeleton className="absolute top-2 left-2 h-6 w-16 rounded-full" />
        {/* Heart button skeleton */}
        <Skeleton className="absolute top-2 right-2 h-8 w-8 rounded-full" />
      </div>

      <CardContent className="p-4">
        {/* Title skeleton */}
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-4" />

        <div className="space-y-2">
          {/* Current bid skeleton */}
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-24" />
          </div>

          {/* Bids and time skeleton */}
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  )
}
