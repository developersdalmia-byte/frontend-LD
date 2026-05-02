"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import ProductFilterBar from "./ProductFilterBar";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/shared/ProductCard";
import { ProductCardSkeleton, ProductGridError } from "@/components/shared/Skeleton";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

interface Props {
  mainCategorySlug: string; // e.g. "mens-wear", "womens-wear", "weddings"
  initialFilters?: {
    occasion?: string;
    subcategory?: string;
    sort?: string;
  };
}

function FilteredProductGridContent({ mainCategorySlug, initialFilters }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [activeFilters, setActiveFilters] = useState<any>(initialFilters || {});
  const [gridLayout, setGridLayout] = useState<2 | 4>(4);

  // Sync state when URL/initialFilters change (Mega Menu navigation)
  useEffect(() => {
    setActiveFilters(initialFilters || {});
  }, [
    initialFilters?.subcategory,
    initialFilters?.occasion,
    initialFilters?.sort,
  ]);

  // Senior Fix: Sync internal filter changes back to the URL
  const handleFilterChange = (newFilters: any) => {
    setActiveFilters(newFilters);
    
    const params = new URLSearchParams(searchParams.toString());
    if (newFilters.subcategory) params.set("subcategory", newFilters.subcategory);
    else params.delete("subcategory");
    
    if (newFilters.occasion) params.set("occasion", newFilters.occasion);
    else params.delete("occasion");
    
    if (newFilters.sort) params.set("sort", newFilters.sort);
    else params.delete("sort");

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Pass slugs directly to the API — no ID resolution needed.
  // Backend accepts both category slug and subcategory slug as query params.
  const { products, loading, loadingMore, error, hasMore, loadMore, refresh, total } = useProducts({
    limit: 24,
    // Only send mainCategory when no subcategory filter is active,
    // because subcategory alone is enough to scope the results.
    category: activeFilters.subcategory ? undefined : mainCategorySlug,
    subcategory: activeFilters.subcategory || undefined,
    occasion: activeFilters.occasion || undefined,
  });

  // Client-side sorting
  let displayedProducts = [...products];

  if (activeFilters.readyToShip) {
    displayedProducts = displayedProducts.filter(p => p.availability === "available");
  }

  if (activeFilters.sort === "price_asc") {
    displayedProducts.sort((a, b) => a.price - b.price);
  } else if (activeFilters.sort === "price_desc") {
    displayedProducts.sort((a, b) => b.price - a.price);
  } else if (activeFilters.sort === "newest") {
    displayedProducts.sort((a, b) => (a.new ? -1 : 1));
  }

  return (
    <div className="w-full bg-[#fcfbf9] min-h-screen">
      <ProductFilterBar
        currentMainCategory={mainCategorySlug}
        totalProducts={displayedProducts.length > 0 ? displayedProducts.length : total}
        onFilterChange={handleFilterChange}
        initialFilters={activeFilters}
        currentGridLayout={gridLayout}
        onGridLayoutChange={setGridLayout}
      />

      <div className="max-w-[1600px] mx-auto px-4 md:px-10 py-10 md:py-16">
        {error ? (
          <ProductGridError message={error} onRetry={refresh} />
        ) : (
          <>
            {displayedProducts.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <h3 className={`${playfair.className} text-3xl text-black mb-4`}>No Products Found</h3>
                <p className="text-sm text-[#9c9690] max-w-md italic">
                  We couldn&apos;t find any pieces matching your current selection.
                  Try adjusting your filters or explore our other couture collections.
                </p>
                <button
                  onClick={() => setActiveFilters({})}
                  className="mt-8 border-b border-black text-[10px] tracking-widest uppercase pb-1"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16 ${
                gridLayout === 2
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              }`}>
                {displayedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    image={product.images?.[0] || "https://api.lalitdalmia.com/uploads/websiteImages/images/placeholder.webp"}
                    hoverImage={product.images?.[1]}
                    name={product.name}
                    price={`\u20b9${product.price.toLocaleString("en-IN")}.00`}
                    category={product.category}
                    isNew={product.new}
                    isSoldOut={product.availability === "sold-out"}
                    isMadeToOrder={product.availability === "made-to-order"}
                    href={`/product/${product.id}`}
                  />
                ))}

                {loading && (
                  <>
                    <ProductCardSkeleton />
                    <ProductCardSkeleton />
                    <ProductCardSkeleton />
                    <ProductCardSkeleton />
                  </>
                )}
              </div>
            )}

            {hasMore && !loading && (
              <div className="mt-20 text-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className={`${playfair.className} border border-black text-black px-12 py-4 text-[11px] tracking-[0.3em] uppercase hover:bg-black hover:text-white transition-all duration-500 disabled:opacity-50`}
                >
                  {loadingMore ? "Loading..." : "Discover More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function FilteredProductGrid(props: Props) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fcfbf9]" />}>
      <FilteredProductGridContent {...props} />
    </Suspense>
  );
}