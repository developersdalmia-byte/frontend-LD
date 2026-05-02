"use client";

import OptimizedImage from "@/components/shared/OptimizedImage";
import { useEffect, useState } from "react";
import { Playfair_Display, Inter } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

type Props = {
  title: string;
  banner: string;
  subtitle?: string;
  quote?: string;
};

export default function CategoryHero({ title, banner, subtitle, quote }: Props) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-[85vh] min-h-[600px] overflow-hidden bg-neutral-100">
      {/* Background Image with slower, smoother zoom */}
      <div className="absolute inset-0 overflow-hidden">
        <OptimizedImage
          src={banner}
          alt={title}
          fill
          priority
          className="object-cover object-center transition-transform duration-[4000ms] ease-out"
          style={{ transform: loaded ? "scale(1.02)" : "scale(1.15)" }}
          sizes="100vw"
          quality={80}
        />
      </div>

      {/* Sophisticated minimal overlay */}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />

      {/* Content: Centered & Minimal */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6 z-10">
        
        {subtitle && (
          <div className="overflow-hidden mb-6">
            <p
              className={`${inter.className} text-[10px] md:text-xs tracking-[0.6em] uppercase text-white/90 transition-all duration-1000 ease-out`}
              style={{
                transform: loaded ? "translateY(0)" : "translateY(100%)",
                opacity: loaded ? 1 : 0,
              }}
            >
              {subtitle}
            </p>
          </div>
        )}

        <div className="overflow-hidden mb-8">
          <h1
            className={`${playfair.className} text-5xl sm:text-7xl md:text-8xl font-normal tracking-tight transition-all duration-1000 ease-out delay-300`}
            style={{
              transform: loaded ? "translateY(0)" : "translateY(100%)",
              opacity: loaded ? 1 : 0,
            }}
          >
            {title}
          </h1>
        </div>

        {quote && (
          <div className="max-w-xl overflow-hidden">
            <p
              className={`${playfair.className} italic text-lg md:text-2xl text-white/80 leading-relaxed transition-all duration-1000 ease-out delay-600`}
              style={{
                transform: loaded ? "translateY(0)" : "translateY(100%)",
                opacity: loaded ? 1 : 0,
              }}
            >
              "{quote}"
            </p>
          </div>
        )}

        {/* Decorative Divider */}
        <div 
          className="mt-12 w-px h-24 bg-white/30 transition-all duration-1000 delay-1000"
          style={{ height: loaded ? "96px" : "0px", opacity: loaded ? 1 : 0 }}
        />
      </div>

      {/* Corner Accents */}
      <div className="absolute top-10 left-10 w-8 h-px bg-white/20 hidden md:block" />
      <div className="absolute top-10 left-10 h-8 w-px bg-white/20 hidden md:block" />
      <div className="absolute bottom-10 right-10 w-8 h-px bg-white/20 hidden md:block" />
      <div className="absolute bottom-10 right-10 h-8 w-px bg-white/20 hidden md:block" />
    </div>
  );
}