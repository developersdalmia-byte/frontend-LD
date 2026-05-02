"use client";

import OptimizedImage from "@/components/shared/OptimizedImage";
import Link from "next/link";
import { Playfair_Display, Inter } from "next/font/google";
import { useState } from "react";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

type Item = {
  name: string;
  image: string;
  href?: string;
  subtitle?: string;
};

type Props = {
  items: Item[];
  heading?: string;
  subheading?: string;
};

export default function CategoryGrid({ items, heading, subheading }: Props) {
  return (
    <section className="w-full bg-[#fcfbf9] py-24 md:py-32 px-6">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Section Header: Minimal & Editorial */}
        {(heading || subheading) && (
          <div className="mb-24 md:mb-32 max-w-4xl">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-px bg-black" />
                <p className={`${inter.className} text-[10px] tracking-[0.4em] uppercase text-gray-500`}>
                   Explore Collections
                </p>
             </div>
             <h2 className={`${playfair.className} text-4xl md:text-6xl text-black font-normal leading-tight mb-8`}>
                Curating the Finest <br/> 
                <span className="italic italic-font-fix">of {heading}</span>
             </h2>
             {subheading && (
               <p className="text-gray-500 max-w-md leading-relaxed text-[15px] font-light">
                 {subheading}. Each piece is a testament to our commitment to preservation and contemporary evolution.
               </p>
             )}
          </div>
        )}

        {/* Grid: 2-column staggered for premium feel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24 md:gap-y-32">
          {items.map((item, idx) => (
            <div 
              key={item.name} 
              className={`flex flex-col ${idx % 2 !== 0 ? "md:mt-32" : ""}`}
            >
              <CategoryCard item={item} index={idx} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ item, index }: { item: Item; index: number }) {
  const [hovered, setHovered] = useState(false);
  const href = item.href ?? "#";

  return (
    <Link
      href={href}
      className="group block relative cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image Container with Custom Ratio */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-neutral-50 rounded-sm">
        <OptimizedImage
          src={item.image}
          alt={item.name}
          fill
          className="object-cover grayscale-[20%] transition-all duration-[1.5s] ease-in-out"
          style={{ 
            transform: hovered ? "scale(1.05)" : "scale(1)",
            filter: hovered ? "grayscale(0%)" : "grayscale(20%)"
          }}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 bg-black/5 mix-blend-overlay pointer-events-none" />
        
        {/* Hover Info Overlay (Desktop only) */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center">
            <div className="w-16 h-16 border border-white/40 rounded-full flex items-center justify-center backdrop-blur-sm scale-90 group-hover:scale-100 transition-transform duration-700">
               <span className="text-[10px] text-white uppercase tracking-[0.2em] font-medium">View</span>
            </div>
        </div>
      </div>

      {/* Details: Shifted & Elegant */}
      <div className="mt-8 px-2 space-y-3">
        {item.subtitle && (
          <p className={`${inter.className} text-[9px] tracking-[0.5em] uppercase text-gray-400 font-medium`}>
            {item.subtitle}
          </p>
        )}
        <div className="flex justify-between items-end">
          <h3 className={`${playfair.className} text-2xl md:text-3xl font-normal text-black tracking-tight group-hover:italic transition-all duration-500`}>
            {item.name}
          </h3>
          <div className="w-12 h-px bg-black/10 group-hover:w-20 transition-all duration-500" />
        </div>
      </div>
    </Link>
  );
}