"use client";

// src/components/shared/ProductCard.tsx

import { useState } from "react";
import OptimizedImage from "@/components/shared/OptimizedImage";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Playfair_Display } from "next/font/google";
import { useWishlist } from "@/context/WishlistContext";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export interface ProductCardProps {
  id?: string;           // needed for wishlist
  image: string;
  hoverImage?: string;
  name: string;
  price: string;
  category?: string;
  isNew?: boolean;
  isSoldOut?: boolean;
  isMadeToOrder?: boolean;
  href?: string;
  onClick?: () => void;
}

export default function ProductCard({
  id,
  image,
  hoverImage,
  name,
  price,
  category,
  isNew = false,
  isSoldOut = false,
  isMadeToOrder = false,
  href = "#",
  onClick,
}: ProductCardProps) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = id ? isWishlisted(id) : false;
  const [hovered, setHovered] = useState(false);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!id) return;
    toggleWishlist({ id, name, price, image, category });
  };

  const CardInner = (
    <>
      {/* ── Image container ── */}
      <div className="relative overflow-hidden bg-[#f7f5f2]">
        <div className="aspect-[3/4] relative">

          {/* Primary image */}
          <OptimizedImage
            src={image}
            alt={name}
            fill
            className={`
              object-cover transition-all duration-1000 ease-in-out
              ${hoverImage
                ? hovered ? "opacity-0 scale-105" : "opacity-100 scale-100"
                : "group-hover:scale-105"
              }
            `}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Hover image */}
          {hoverImage && (
            <OptimizedImage
              src={hoverImage}
              alt={`${name} — alternate view`}
              fill
              className={`
                object-cover absolute inset-0 transition-all duration-1000 ease-in-out
                ${hovered ? "opacity-100 scale-105" : "opacity-0 scale-100"}
              `}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}

          {/* ── Badges ── */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {isNew && (
              <span className="bg-black text-white text-[7px] tracking-[0.3em] uppercase px-2 py-1">
                New
              </span>
            )}
            {isSoldOut && (
              <span className="bg-[#e5e0d8] text-[#6b6560] text-[7px] tracking-[0.3em] uppercase px-2 py-1">
                Sold Out
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Text block ── */}
      <div className="mt-4 px-0.5 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            {category && (
              <p className="text-[9px] tracking-[0.25em] uppercase text-[#c5a059] font-semibold mb-1">
                {category}
              </p>
            )}

            <h3 className={`${playfair.className} text-[11px] sm:text-[13px] tracking-[0.1em] text-black uppercase font-medium leading-relaxed`}>
              {name}
            </h3>
          </div>

          {/* Wishlist button */}
          {id && (
            <button
              onClick={handleWishlist}
              className="mt-0.5 transition-transform hover:scale-110 active:scale-95"
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                size={16}
                strokeWidth={1.2}
                className={`transition-colors duration-300 ${
                  wishlisted ? "fill-black stroke-black" : "stroke-black fill-none"
                }`}
              />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 pt-0.5">
          <span className={`${playfair.className} text-[15px] text-black font-medium`}>
            {price}
          </span>
          {isMadeToOrder && (
            <span className="text-[8px] tracking-widest text-[#9c9690] uppercase">
              · Made to Order
            </span>
          )}
        </div>
      </div>
    </>
  );

  if (onClick) {
    return (
      <div
        className="group block cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onClick}
      >
        {CardInner}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="group block cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {CardInner}
    </Link>
  );
}