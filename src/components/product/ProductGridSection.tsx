"use client";

// src/components/home/ProductGridSection.tsx
// Shows product cards → click → LV-style product detail page with Add to Cart

import { useEffect, useState } from "react";
import { Playfair_Display } from "next/font/google";
import ProductCard from "@/components/shared/ProductCard";
import { getProducts } from "@/services/product.service";
import type { Product } from "@/types";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export default function ProductGridSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        // Fetching 4 products as requested for a single row
        const { products: fetchedProducts } = await getProducts({ limit: 4 });
        setProducts(fetchedProducts);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Unable to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="w-full bg-[#faf8f5] py-20 px-5 md:px-12">
        <div className="max-w-[1400px] mx-auto text-center">
          <p className={`${playfair.className} text-lg animate-pulse`}>Loading The Edit...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full bg-[#faf8f5] py-20 px-5 md:px-12">
        <div className="max-w-[1400px] mx-auto text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  // Ensure we only show up to 4 products even if API returns more
  const displayProducts = products.slice(0, 4);

  return (
    <section className="w-full bg-[#faf8f5] py-20 px-5 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase text-[#9c9690] mb-3">
              New Arrivals
            </p>
            <h2 className={`${playfair.className} text-3xl md:text-4xl font-normal text-black leading-tight`}>
              The Edit
            </h2>
          </div>
          <link href="/collections" className={`${playfair.className} text-[11px] tracking-[0.3em] uppercase text-black border-b border-black pb-0.5 hover:text-[#6b6560] hover:border-[#6b6560] transition-colors duration-200 self-start md:self-auto`}>
            View all
          </link>
        </div>

        {/* Strictly 4 columns on large screens for a single row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16">
          {displayProducts.map((product) => (
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

        {displayProducts.length > 0 && (
          <div className="flex justify-center mt-20">
            <link href="/collections" className={`${playfair.className} inline-flex items-center gap-4 text-[11px] tracking-[0.35em] uppercase border border-black text-black px-12 py-4 hover:bg-black hover:text-white transition-all duration-300`}>
              Discover the Collection
            </link>
          </div>
        )}
      </div>
    </section>
  );
}

