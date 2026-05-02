"use client";

import { Playfair_Display, Inter } from "next/font/google";
import OptimizedImage from "@/components/shared/OptimizedImage";
import Link from "next/link";
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

// ---------- Full-Screen Banner ----------
function CollectionBanner({
  src,
  label,
  title,
  href,
  isVideo = false,
  isFirstBanner = false,
}: {
  src: string;
  label: string;
  title: string;
  href: string;
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

      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6 z-10">
        <p className={`${inter.className} text-[10px] tracking-[0.6em] uppercase text-white/90 mb-6`}>
          {label}
        </p>
        <h2 className={`${playfair.className} text-5xl md:text-8xl font-normal tracking-tight mb-8`}>
          {title}
        </h2>
        <Link
          href={href}
          className={`${playfair.className} italic text-xl text-white border-b border-white/20 hover:border-white transition-all pb-1`}
        >
          View Collection
        </Link>
      </div>
    </section>
  );
}

// ---------- Product Grid ----------
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
  const { products, loading, error, refresh } = useProducts({
    limit: 4,
    category,
  });

  const bgClass = bg === "cream" ? "bg-[#fdfcfb]" : "bg-white";

  return (
    <section className={`w-full ${bgClass} py-24 md:py-32 px-6`}>
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
              <h3 className={`${playfair.className} text-4xl md:text-6xl font-normal text-black leading-tight italic`}>
                {heading}
              </h3>
            )}
          </div>
          <Link 
             href={viewAllHref}
             className={`${inter.className} text-[10px] tracking-[0.3em] uppercase text-gray-400 hover:text-black border-b border-gray-100 hover:border-black pb-1 transition-all`}
          >
             Explore All
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : error
            ? <ProductGridError message={error} onRetry={refresh} />
            : products.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  image={p.images[0]}
                  hoverImage={p.images[1]}
                  name={p.name}
                  price={`₹${p.price.toLocaleString("en-IN")}`}
                  category={p.category}
                  href={`/product/${p.id}`}
                />
              ))}
        </div>
      </div>
    </section>
  );
}

// ---------- MAIN ----------
export default function MenswearSection() {
  return (
    <div className="bg-white">
      <CollectionBanner
        src="https://images.unsplash.com/photo-1594938298603-c8148c4b4adf?w=2000&q=80"
        label="The Groom's Heritage"
        title="Royal Sherwanis"
        href="/category/men"
        isFirstBanner
      />

      <CollectionProductGrid
        label="Traditional Masterpieces"
        heading="The Wedding Collection"
        category="menswear"
        viewAllHref="/category/men"
      />

      <section className="w-full bg-[#fcfbf9] py-24 px-6 text-center border-y border-neutral-50">
        <div className="max-w-3xl mx-auto">
          <div className="w-px h-16 bg-black/10 mx-auto mb-10" />
          <p className={`${playfair.className} italic text-black text-2xl md:text-4xl leading-relaxed`}>
            &ldquo;True refinement is not about being noticed, it is about being remembered.&rdquo;
          </p>
          <div className="w-px h-16 bg-black/10 mx-auto mt-10" />
        </div>
      </section>

      <CollectionBanner
        src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=2000&q=80"
        label="Modern Classics"
        title="The Kurta Edit"
        href="/category/men"
      />

      <CollectionProductGrid
        label="Day Wear Elegance"
        heading="Effortless Silhouettes"
        category="menswear"
        viewAllHref="/category/men"
        bg="cream"
      />
    </div>
  );
}