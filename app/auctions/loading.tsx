import { AuctionsGridSkeleton } from "@/components/skeletons/auctions-grid-skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <AuctionsGridSkeleton count={12} />
    </div>
  )
}
