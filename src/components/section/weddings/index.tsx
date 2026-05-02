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

      <div className="absolute inset-0 bg-black/25" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />

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
          Discover The Atelier
        </Link>
      </div>
    </section>
  );
}

// ---------- Wedding Categories 4-Grid ----------
const WEDDING_TYPES = [
  {
    title: "Bridal Couture",
    subtitle: "The Masterpiece Edit",
    image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1200&q=80",
    href: "/category/women",
  },
  {
    title: "The Groom's Room",
    subtitle: "Majestic Grandeur",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4adf?w=1200&q=80",
    href: "/category/men",
  },
  {
    title: "The Trousseau",
    subtitle: "Curated Heritage",
    image: "https://images.unsplash.com/photo-1599948058210-7a2ecbd3c910?w=1200&q=80",
    href: "/category/women",
  },
  {
    title: "Jewellery & Art",
    subtitle: "The Final Polish",
    image: "https://images.unsplash.com/photo-1512163143273-bde0e3cc7407?w=1200&q=80",
    href: "/category/women",
  },
];

function WeddingCategoryCard({ item }: { item: typeof WEDDING_TYPES[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={item.href}
      className="group relative block aspect-[3/4] overflow-hidden bg-neutral-100"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <OptimizedImage
        src={item.image}
        alt={item.title}
        fill
        className="object-cover transition-all duration-[1.5s] ease-in-out"
        style={{ 
          transform: hovered ? "scale(1.05)" : "scale(1)",
          filter: hovered ? "brightness(0.9)" : "brightness(0.8)" 
        }}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        quality={75}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
      
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 text-white text-center px-6">
        <p className={`${inter.className} text-[8px] tracking-[0.5em] uppercase text-white/70 mb-3`}>
          {item.subtitle}
        </p>
        <h3 className={`${playfair.className} text-xl md:text-2xl font-normal tracking-tight group-hover:italic transition-all duration-500`}>
          {item.title}
        </h3>
      </div>
    </Link>
  );
}

// ---------- Split Editorial Panel ----------
function EditorialSplit({
  src,
  tag,
  heading,
  body,
  href,
  reverse = false,
}: {
  src: string;
  tag: string;
  heading: string;
  body: string;
  href: string;
  reverse?: boolean;
}) {
  return (
    <section className={`w-full flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} min-h-[80vh] bg-white`}>
      <div className="relative w-full md:w-1/2 h-[60vh] md:h-auto overflow-hidden">
        <OptimizedImage
          src={src}
          alt={heading}
          fill
          className="object-cover transition-transform duration-[4000ms] hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
          quality={75}
        />
      </div>
      <div className="w-full md:w-1/2 bg-[#fcfbf9] flex flex-col items-center justify-center px-8 md:px-24 py-20 text-center">
        <p className={`${inter.className} text-[10px] tracking-[0.5em] uppercase text-gray-400 mb-8`}>
           {tag}
        </p>
        <h2 className={`${playfair.className} text-4xl md:text-6xl font-normal text-black leading-tight mb-10`}>
           {heading}
        </h2>
        <div className="w-px h-12 bg-black/10 mb-10" />
        <p className={`${playfair.className} text-xl text-gray-600 leading-relaxed italic mb-12 max-w-sm`}>
           &ldquo;{body}&rdquo;
        </p>
        <Link
          href={href}
          className={`${inter.className} text-[10px] tracking-[0.3em] uppercase text-black border border-black px-10 py-4 hover:bg-black hover:text-white transition-all duration-500`}
        >
          Explore Now
        </Link>
      </div>
    </section>
  );
}

// ---------- Main Export ----------
export default function WeddingsSection() {
  return (
    <div className="bg-white">
      <CollectionBanner
        src="https://api.lalitdalmia.com/uploads/videos/Horizontal Day 1.webm"
        isVideo
        isFirstBanner
        label="The Eternal Vow"
        title="Wedding Atelier"
        href="/category/weddings"
      />

      <section className="w-full bg-white py-24 md:py-32 px-6">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-24">
            <p className={`${inter.className} text-[10px] tracking-[0.5em] uppercase text-gray-400 mb-6`}>
              The Wedding Journal
            </p>
            <h2 className={`${playfair.className} text-4xl md:text-7xl font-normal text-black leading-tight`}>
              A Symphony of <br/> <span className="italic">Heritage & Love</span>
            </h2>
            <div className="w-px h-16 bg-black/10 mx-auto mt-12" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WEDDING_TYPES.map((item) => (
              <WeddingCategoryCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      <EditorialSplit
        src="https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1600&q=80"
        tag="For the Bride"
        heading="Bridal Couture"
        body="Each bridal creation is an intimate conversation between the bride and the weaver — a story told in gold zardozi and silk organza."
        href="/category/women"
        reverse={false}
      />

      <EditorialSplit
        src="https://images.unsplash.com/photo-1594938298603-c8148c4b4adf?w=1600&q=80"
        tag="For the Groom"
        heading="Majestic Groom"
        body="Refined sherwanis crafted for the man of distinction, blending ancient embroidery with modern tailoring."
        href="/category/men"
        reverse={true}
      />
    </div>
  );
}