"use client";

import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-[#f0ede8] relative overflow-hidden",
        "after:absolute after:inset-0 after:-translate-x-full after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent after:animate-shimmer",
        className
      )}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col w-full space-y-3">
      <Skeleton className="aspect-[3/4] w-full" />
      <Skeleton className="h-2 w-20" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

interface ProductGridErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function ProductGridError({ message, onRetry }: ProductGridErrorProps) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4 text-center">
      <p className="text-[13px] text-[#9c9690] leading-relaxed max-w-xs">
        {message || "We couldn't load the products right now. Please try again."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-black border border-black px-6 py-3 hover:bg-black hover:text-white transition-all duration-300"
        >
          <RefreshCw size={12} />
          Retry
        </button>
      )}
    </div>
  );
}
