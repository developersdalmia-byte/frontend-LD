"use client";

import { Playfair_Display, Inter } from "next/font/google";
import OptimizedImage from "@/components/shared/OptimizedImage";
import Link from "next/link";
import { useState } from "react";
import ProductCard from "@/components/shared/ProductCard";
import { ProductCardSkeleton, ProductGridError } from "@/components/shared/Skeleton";
import { useProducts } from "@/hooks/useProducts";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

// ---------- Shared Minimal Divider ----------
function MinimalDivider({ light = false }: { light?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-4 my-10">
      <div className={`w-[1px] h-12 ${light ? "bg-white/20" : "bg-black/10"}`} />
    </div>
  );
}

// ---------- Full-screen Collection Banner ----------
function CollectionBanner({
  src,
  label,
  title,
  href,
  align = "center",
  isVideo = false,
  isFirstBanner = false,
}: {
  src: string;
  label: string;
  title: string;
  href: string;
  align?: "center" | "left" | "right";
  isVideo?: boolean;
  isFirstBanner?: boolean;
}) {
  return (
    <section className="relative w-full h-[90vh] min-h-[600px] overflow-hidden group">
      {isVideo ? (
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[4000ms] group-hover:scale(1.05)"
        />
      ) : (
        <OptimizedImage
          src={src}
          alt={title}
          fill
          priority={isFirstBanner}
          className="object-cover transition-transform duration-[4000ms] group-hover:scale(1.05)"
          sizes="100vw"
          quality={80}
        />
      )}

      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />

      <div className={`absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6 z-10`}>
        <p className={`${inter.className} text-[10px] tracking-[0.5em] uppercase text-white/80 mb-6`}>
          {label}
        </p>
        <h2 className={`${playfair.className} text-4xl md:text-7xl font-normal tracking-tight mb-8`}>
          {title}
        </h2>
        <Link
          href={href}
          className={`${playfair.className} italic text-lg text-white border-b border-white/20 hover:border-white transition-all pb-1`}
        >
          Explore the Collection
        </Link>
      </div>
    </section>
  );
}

// ---------- Product Grid with Label ----------
function CollectionProductGrid({
  label,
  heading,
  category,
  viewAllHref,
  bg = "white",
}: {
  label?: string;
  heading?: string;
  category: string;
  viewAllHref: string;
  bg?: "white" | "cream";
}) {
  const { products, loading, error, refresh } = useProducts({ limit: 4, category });
  const bg_class = bg === "cream" ? "bg-[#fdfcfb]" : "bg-white";

  return (
    <section className={`w-full ${bg_class} py-24 md:py-32 px-6`}>
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            {label && (
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-px bg-black/20" />
                <p className={`${inter.className} text-[10px] tracking-[0.4em] uppercase text-gray-400`}>
                  {label}
                </p>
              </div>
            )}
            {heading && (
              <h3 className={`${playfair.className} text-3xl md:text-5xl font-normal text-black leading-tight italic`}>
                {heading}
              </h3>
            )}
          </div>
          <Link
            href={viewAllHref}
            className={`${inter.className} text-[10px] tracking-[0.3em] uppercase text-gray-400 hover:text-black border-b border-gray-100 hover:border-black pb-1 transition-all`}
          >
            Discover All
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : error
            ? <ProductGridError message={error} onRetry={refresh} />
            : products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  image={product.images[0]}
                  hoverImage={product.images[1]}
                  name={product.name}
                  price={`₹${product.price.toLocaleString("en-IN")}`}
                  category={product.category}
                  href={`/product/${product.id}`}
                />
              ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Editorial Quote Strip ----------
function QuoteStrip({ text }: { text: string }) {
  return (
    <section className="w-full bg-[#fcfbf9] py-24 px-6 text-center">
      <div className="max-w-3xl mx-auto">
        <div className="w-px h-16 bg-black/10 mx-auto mb-10" />
        <p className={`${playfair.className} italic text-black text-2xl md:text-4xl leading-relaxed`}>
          &ldquo;{text}&rdquo;
        </p>
        <div className="w-px h-16 bg-black/10 mx-auto mt-10" />
      </div>
    </section>
  );
}

// ---------- Main Export ----------
export default function WomenswearSection() {
  return (
    <div className="bg-white">
      {/* 1. Sarees — full-screen video/image banner */}
      <CollectionBanner
        src="https://api.lalitdalmia.com/uploads/videos/Sarees-Vid.webm"
        isVideo
        isFirstBanner
        label="Artisanal Heritage"
        title="The Saree Atelier"
        href="/category/sarees"
      />

      <CollectionProductGrid
        label="Curated Silks"
        heading="Bespoke Sarees"
        category="womenswear"
        viewAllHref="/category/sarees"
      />

      <QuoteStrip text="Every weave is a heartbeat, every thread a story of ancient grace." />

      <CollectionBanner
        src="/womens_western_luxury.webp"
        label="Bridal Couture"
        title="The Wedding Edit"
        href="/category/weddings"
      />

      <CollectionProductGrid
        label="Handcrafted Lehengas"
        heading="Modern Royalty"
        category="womenswear"
        viewAllHref="/category/lehengas"
        bg="cream"
      />

      <CollectionBanner
        src="/womens_western_luxury.webp"
        label="Contemporary Silhouette"
        title="Indo-Western Fusion"
        href="/category/indo-western"
      />

      <CollectionProductGrid
        label="Global Appeal"
        heading="Gowns & Fusions"
        category="indowestern"
        viewAllHref="/category/indo-western"
      />
    </div>
  );
}