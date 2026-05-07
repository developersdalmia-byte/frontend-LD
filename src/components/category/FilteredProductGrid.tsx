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
  initialFilters?: {
    mainCategory?: string;
    category?: string;
    occasion?: string;
    subCategory?: string;
    sort?: "price" | "-price" | "newest";
    readyToShip?: boolean;
    availability?: string;
    minPrice?: number;
    maxPrice?: number;
  };
}

function FilteredProductGridContent({ initialFilters }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [activeFilters, setActiveFilters] = useState<any>({
    ...initialFilters,
  });
  const [gridLayout, setGridLayout] = useState<2 | 4>(4);

  useEffect(() => {
    setActiveFilters({
      ...initialFilters,
    });
  }, [
    initialFilters?.mainCategory,
    initialFilters?.category,
    initialFilters?.subCategory,
    initialFilters?.occasion,
    initialFilters?.sort,
    initialFilters?.availability,
    initialFilters?.minPrice,
    initialFilters?.maxPrice,
  ]);

  // Senior Fix: Sync internal filter changes back to the URL strictly
  const handleFilterChange = (newFilters: any) => {
    setActiveFilters(newFilters);
    
    const params = new URLSearchParams();
    if (newFilters.mainCategory) params.set("mainCategory", newFilters.mainCategory);
    if (newFilters.category) params.set("category", newFilters.category);
    if (newFilters.subCategory) params.set("subCategory", newFilters.subCategory);
    if (newFilters.occasion) params.set("occasion", newFilters.occasion);
    if (newFilters.sort) params.set("sort", newFilters.sort);
    if (newFilters.readyToShip) params.set("availability", "available");
    else if (newFilters.availability) params.set("availability", newFilters.availability);
    if (newFilters.minPrice !== undefined) params.set("minPrice", newFilters.minPrice.toString());
    if (newFilters.maxPrice !== undefined) params.set("maxPrice", newFilters.maxPrice.toString());

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Senior Fix: Pass all filters EXACTLY to the API hook
  const { products, loading, loadingMore, error, hasMore, loadMore, refresh, total } = useProducts({
    limit: 24,
    mainCategory: activeFilters.mainCategory || undefined,
    category: activeFilters.category || undefined,
    subCategory: activeFilters.subCategory || undefined,
    occasion: activeFilters.occasion || undefined,
    sort: activeFilters.sort || undefined,
    availability: activeFilters.readyToShip ? "available" : (activeFilters.availability || undefined),
    minPrice: activeFilters.minPrice !== undefined ? Number(activeFilters.minPrice) : undefined,
    maxPrice: activeFilters.maxPrice !== undefined ? Number(activeFilters.maxPrice) : undefined,
  });

  return (
    <div className="w-full bg-[#fcfbf9] min-h-screen">
      <ProductFilterBar
        totalProducts={total}
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
            {products.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <h3 className={`${playfair.className} text-3xl text-black mb-4`}>No Products Found</h3>
                <p className="text-sm text-[#9c9690] max-w-md italic">
                  We couldn&apos;t find any pieces matching your current selection.
                  Try adjusting your filters or explore our other couture collections.
                </p>
                <button
                  onClick={() => handleFilterChange({ category: activeFilters.category })}
                  className="mt-8 border-b border-black text-[10px] tracking-widest uppercase pb-1"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-x-2 gap-y-10 md:gap-x-4 md:gap-y-14 ${
                gridLayout === 2
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              }`}>
                {products.map((product) => (
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