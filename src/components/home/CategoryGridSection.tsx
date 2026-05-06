"use client";

import { Playfair_Display } from "next/font/google";
import Link from "next/link";
import OptimizedImage from "@/components/shared/OptimizedImage";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const CATEGORIES = [
  // ROW 1: Womenswear
  {
    title: "Sarees",
    href: "/products?category=womenswear&subcategory=saree",
    image: "/saree_result.avif",
  },
  {
    title: "Gowns",
    href: "/products?category=womenswear&subcategory=gown",
    image: "/gowns_result.avif",
  },
  {
    title: "Lehenga Sets",
    href: "/products?category=womenswear&subcategory=lehenga",
    image: "/lehenga_result.avif",
  },
  {
    title: "Indowestern Jackets",
    href: "/products?category=womenswear&subcategory=jacket",
    image: "/indowestern-gown_result.avif",
  },

  // ROW 2: Menswear
  {
    title: "Bandhgala Sets",
    href: "/products?category=menswear&subcategory=bandgala",
    image: "/bandhgala shervani_result.avif",
  },
  {
    title: "Kurta Sets",
    href: "/products?category=menswear&subcategory=kurta",
    image: "/kurtas_result.avif",
  },
  {
    title: "Sherwani Sets",
    href: "/products?category=menswear&subcategory=sherwani",
    image: "/sherwanis_result.avif",
  },
  // {
  //   title: "Nehru Jackets",
  //   href: "/products?category=menswear&subcategory=nehru-jacket",
  //   image: "/bandhgala shervani_result.avif",
  // },
];

export default function CategoryGridSection() {
  return (
    <section className="w-full bg-[#faf8f5] py-20 px-5 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-center mb-14 gap-4 text-center">
          <div>
            <h2 className={`${playfair.className} text-3xl md:text-4xl font-normal text-black leading-tight tracking-wide`}>
              SHOP BY CATEGORY
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14">
          {CATEGORIES.map((category, i) => (
            <Link key={i} href={category.href} className="group block">
              <div className="w-full aspect-[3/4] relative overflow-hidden mb-5 bg-[#f7f5f2]">
                <OptimizedImage
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <div className="px-0.5">
                <p className="text-[9px] tracking-[0.3em] uppercase text-[#c5a059] font-semibold mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  Explore
                </p>
                <h3 className={`${playfair.className} text-[12px] md:text-[14px] tracking-[0.1em] uppercase font-medium text-black transition-colors duration-300`}>
                  {category.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
