"use client";

import { Playfair_Display } from "next/font/google";
import OptimizedImage from "@/components/shared/OptimizedImage";
import Link from "next/link";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const WEDDING_TYPES = [
  {
    title: "Bridal Couture",
    image: "https://api.lalitdalmia.com/uploads/websiteImages/images/womenswear/1LD 28.03.26_ 1603.webp",
    href: "/weddings/bridal",
  },
  {
    title: "Groom's Collection",
    image: "https://api.lalitdalmia.com/uploads/websiteImages/images/menswear/1_3 (1).webp",
    href: "/weddings/groom",
  },
  {
    title: "Bridesmaids",
    image: "https://api.lalitdalmia.com/uploads/websiteImages/images/womenswear/1LD 28.03.26_ 1961.webp",
    href: "/weddings/bridesmaids",
  },
  {
    title: "The Trousseau",
    image: "https://api.lalitdalmia.com/uploads/websiteImages/images/womenswear/1LD 28.03.26_ 617.webp",
    href: "/weddings/trousseau",
  },
];

export default function WeddingCategoriesGrid() {
  return (
    <section className="w-full bg-white py-20 px-5 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#9c9690] mb-4">
            The Wedding Journal
          </p>
          <h2 className={`${playfair.className} text-4xl md:text-5xl font-normal text-black`}>
            A Celebration of Love
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WEDDING_TYPES.map((type, index) => (
            <Link key={index} href={type.href} className="group block relative overflow-hidden aspect-[3/4]">
              <OptimizedImage
                src={type.image}
                alt={type.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                quality={75}
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                <h3 className={`${playfair.className} text-2xl md:text-3xl text-center mb-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500`}>
                  {type.title}
                </h3>
                <span className="text-[9px] tracking-[0.3em] uppercase border border-white px-4 py-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                  Explore
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
