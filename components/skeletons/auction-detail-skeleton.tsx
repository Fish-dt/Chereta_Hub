import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AuctionDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-8 mb-8 min-h-[420px]">
        {/* Image Gallery Skeleton */}
        <div className="space-y-4 flex flex-col items-center h-full justify-between">
          {/* Main Image Skeleton */}
          <div className="relative overflow-hidden rounded-lg bg-gray-100 w-full max-w-md aspect-[4/3] mx-auto h-full flex items-center justify-center">
            <Skeleton className="h-full w-full" />
          </div>
          
          {/* Thumbnail Images Skeleton */}
          <div className="flex justify-center gap-2 mt-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="w-16 h-16 rounded border-2" />
            ))}
          </div>
        </div>

        {/* Auction Info Skeleton */}
        <div className="space-y-6 h-full flex flex-col justify-between">
          <div className="space-y-4">
            {/* Category Badge */}
            <Skeleton className="h-6 w-20" />
            
            {/* Title */}
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-6 w-3/4" />
            
            {/* Description */}
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Current Bid Card Skeleton */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-32" />
                </div>
              </div>

              {/* Stats Skeleton */}
              <div className="flex items-center gap-4 text-sm mb-4">
                <div className="flex items-center gap-1">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <div className="flex items-center gap-1">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex items-center gap-1">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>

              {/* Bidding Section Skeleton */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>

              {/* Action Buttons Skeleton */}
              <div className="flex gap-2 mt-4">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-16" />
                <Skeleton className="h-9 w-18" />
              </div>
            </CardContent>
          </Card>

          {/* Seller Info Card Skeleton */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-3" />
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-2" />
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-2" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="bidding">Bid History</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                
                {/* Specifications Skeleton */}
                <div className="mt-6 space-y-3">
                  <Skeleton className="h-5 w-28" />
                  <div className="grid md:grid-cols-2 gap-4">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className="flex justify-between py-2 border-b">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Tabs>
    </div>
  )
}
