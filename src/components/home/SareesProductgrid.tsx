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

export default function SareesProductGrid() {
  const { products, loading, error, refresh } = useProducts({
    limit: 4,
    category: "saree",
    // If the backend supports subcategory filtering, add: subcategory: "sarees"
  });

  return (
    <section className="w-full bg-white py-10 px-5 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase text-[#9c9690] mb-3">
              {/* Elegant Drapes */}
            </p>
            <h2 className={`${playfair.className} text-3xl md:text-4xl font-normal text-black leading-tight`}>
              {/* The Saree Collection */}
            </h2>
          </div>
          <a
            href="/category/women?subcategory=saree"
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

        <div className="flex justify-center mt-20">
          <a
            href="/collections"
            className={`${playfair.className} inline-flex items-center gap-4 text-[11px] tracking-[0.35em] uppercase border border-black text-black px-12 py-4 hover:bg-black hover:text-white transition-all duration-300`}
          >
            Discover more
          </a>
        </div>
      </div>
    </section>
  );
}