"use client";

import { useState, useEffect, useRef } from "react";
import { X, Search } from "lucide-react";
import { Playfair_Display } from "next/font/google";
import Link from "next/link";
import OptimizedImage from "@/components/shared/OptimizedImage";
import { useProducts } from "@/hooks/useProducts";
import { ProductCardSkeleton } from "@/components/shared/Skeleton";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const POPULAR_SEARCHES = ["Bridal Lehenga", "Sherwani", "Sarees", "Anarkalis", "Gowns", "Indo Western"];

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SearchOverlay({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Use products hook for search results
  const { products: searchResults, loading: searchLoading } = useProducts({
    search: query.length >= 2 ? query : undefined,
    limit: 6
  });

  // Use products hook for "New Arrivals" (Initial view)
  const { products: newArrivals, loading: newArrivalsLoading } = useProducts({
    limit: 6,
    // category: "new-arrivals" // Adjust if you have a specific category
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 300);
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[2000] bg-[#fcf9f2] overflow-y-auto ${playfair.className} animate-in fade-in duration-500 px-4 md:px-20 py-6 md:py-10`}>
      <div className="max-w-[1400px] mx-auto">

        {/* TOP BAR: Search Input & Close */}
        <div className="flex items-center justify-between gap-4 md:gap-10 mb-8 md:mb-12">
          <div className="flex-1 bg-white flex items-center px-4 md:px-6 py-3 md:py-4 shadow-sm border border-gray-100">
            <Search className="text-gray-400 mr-3 md:mr-4 flex-shrink-0" size={18} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-sm md:text-base text-gray-700 placeholder:text-gray-300"
            />
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-white md:bg-transparent shadow-sm md:shadow-none border border-gray-100 md:border-none hover:bg-gray-100/50 rounded-full transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X size={24} strokeWidth={1} className="text-gray-500" />
          </button>
        </div>

        {/* CONTENT */}
        {query.length < 2 ? (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* POPULAR SEARCHES */}
            <div>
              <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#9c9690] mb-6 border-b border-gray-100 pb-3 w-full">
                POPULAR SEARCHES
              </h3>
              <div className="flex flex-wrap gap-x-10 gap-y-5">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="flex items-center gap-3 text-[11px] tracking-wide text-gray-500 hover:text-black transition-all hover:translate-x-1 duration-300 group"
                  >
                    <Search size={14} className="text-gray-300 group-hover:text-[#c9b99a] transition-colors" />
                    <span className="border-b border-transparent group-hover:border-black transition-all">{term}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* NEW ARRIVALS */}
            <div>
              <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#9c9690] mb-10">
                NEW ARRIVALS
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-10">
                {newArrivalsLoading ? (
                  Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
                ) : (
                  newArrivals.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      onClick={onClose}
                      className="group block"
                    >
                      <div className="relative aspect-[3/4.5] overflow-hidden mb-4 bg-[#f8f8f8]">
                        <OptimizedImage
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-1000 group-hover:scale-110"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                        />
                      </div>
                      <h4 className="text-[10px] tracking-tight text-gray-900 line-clamp-2 leading-relaxed">
                        {product.name}
                      </h4>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          /* SEARCH RESULTS */
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#9c9690] mb-10 border-b border-gray-100 pb-3 w-full">
              RESULTS FOR "{query.toUpperCase()}"
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-10">
              {searchLoading ? (
                Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)
              ) : searchResults.length > 0 ? (
                searchResults.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    onClick={onClose}
                    className="group block"
                  >
                    <div className="relative aspect-[3/4.5] overflow-hidden mb-4 bg-[#f8f8f8]">
                      <OptimizedImage
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                      />
                    </div>
                    <h4 className="text-[10px] tracking-tight text-gray-900 line-clamp-2 leading-relaxed mb-1">
                      {product.name}
                    </h4>
                    <p className="text-[11px] font-medium text-gray-500 italic">
                      ₹{product.price.toLocaleString("en-IN")}
                    </p>
                  </Link>
                ))
              ) : (
                <div className="col-span-full py-32 text-center">
                  <div className="w-16 h-16 bg-[#f8f8f8] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search size={24} className="text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-400 italic">
                    We couldn't find any masterpieces matching your inquiry.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
