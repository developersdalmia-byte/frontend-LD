"use client";

import { Playfair_Display } from "next/font/google";
import ProductCard from "@/components/shared/ProductCard";
import { ProductCardSkeleton, ProductGridError } from "@/components/shared/Skeleton";
import { useProducts } from "@/hooks/useProducts";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export default function IndoWesternProductGrid() {
  // Use the improved hook with specific category
  const { products, loading, error, refresh } = useProducts({ 
    limit: 4, 
    category: "indo-western" 
  });

  return (
    <section className="w-full bg-[#fdfcfb] py-10 px-5 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase text-[#9c9690] mb-3">
              {/* Modern Fusion */}
            </p>
            <h2 className={`${playfair.className} text-3xl md:text-4xl font-normal text-black leading-tight`}>
              {/* Indo-Western Styles */}
            </h2>
          </div>
          <a
            href="/category/women?subcategory=jacket"
            className={`${playfair.className} text-[11px] tracking-[0.3em] uppercase text-black border-b border-black pb-0.5 hover:text-[#6b6560] hover:border-[#6b6560] transition-colors duration-200 self-start md:self-auto`}
          >
            View all
          </a>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : error
            ? <ProductGridError message={error} onRetry={refresh} />
            : products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  image={product.images[0]}
                  hoverImage={product.images[1]}
                  name={product.name}
                  price={`₹${product.price.toLocaleString("en-IN")}.00`}
                  category={product.category}
                  isNew={product.new}
                  isSoldOut={product.availability === "sold-out"}
                  isMadeToOrder={product.availability === "made-to-order"}
                  href={`/product/${product.id}`}
                />
              ))}
        </div>
      </div>
    </section>
  );
}