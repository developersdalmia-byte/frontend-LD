import { Skeleton } from "@/components/shared/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white pt-[90px]">
      <div className="max-w-[1500px] mx-auto px-4 md:px-10 lg:px-14 py-6 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left: Images Skeleton */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <Skeleton className="aspect-[3/4] w-full" />
            <Skeleton className="aspect-[3/4] w-full" />
          </div>

          {/* Right: Info Skeleton */}
          <div className="lg:col-span-5 flex flex-col space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-6 w-1/2" />
            </div>
            
            <div className="h-px bg-[#e8e4de]" />
            
            <div className="space-y-3">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>

            <div className="space-y-4">
              <Skeleton className="h-4 w-24" />
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="w-14 h-14" />
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Skeleton className="h-14 flex-1" />
              <Skeleton className="h-14 w-[52px]" />
            </div>

            <div className="space-y-4 pt-8">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
