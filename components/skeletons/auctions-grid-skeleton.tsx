import { AuctionCardSkeleton } from "./auction-card-skeleton"

interface AuctionsGridSkeletonProps {
  count?: number
}

export function AuctionsGridSkeleton({ count = 8 }: AuctionsGridSkeletonProps) {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <AuctionCardSkeleton key={index} />
      ))}
    </div>
  )
}
