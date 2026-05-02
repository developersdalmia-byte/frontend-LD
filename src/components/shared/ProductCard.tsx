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
              object-cover transition-all duration-700 ease-in-out
              ${hoverImage
                ? hovered ? "opacity-0 scale-[1.03]" : "opacity-100 scale-100"
                : "group-hover:scale-[1.04]"
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
                object-cover absolute inset-0 transition-all duration-700 ease-in-out
                ${hovered ? "opacity-100 scale-[1.03]" : "opacity-0 scale-100"}
              `}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}

          {/* ── Badges (top left) ── */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {isNew && (
              <span className="bg-black text-white text-[8px] tracking-[0.25em] uppercase px-2.5 py-1">
                New
              </span>
            )}
            {isMadeToOrder && (
              <span className="bg-white text-black text-[8px] tracking-[0.2em] uppercase px-2.5 py-1 border border-black/10">
                Made to Order
              </span>
            )}
            {isSoldOut && (
              <span className="bg-[#e5e0d8] text-[#6b6560] text-[8px] tracking-[0.2em] uppercase px-2.5 py-1">
                Sold Out
              </span>
            )}
          </div>

          {/* ── Wishlist button ──
               Always visible on mobile (opacity-100), hover-only on desktop */}
          {id && (
            <button
              onClick={handleWishlist}
              className={`
                absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center
                transition-opacity duration-300
                ${wishlisted
                  ? "opacity-100"
                  : "opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                }
              `}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                size={18}
                className={`transition-all duration-200 drop-shadow-sm ${
                  wishlisted
                    ? "fill-black stroke-black"
                    : "stroke-white fill-none [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.5))]"
                }`}
              />
            </button>
          )}

          {/* ── Bottom CTA strip — slides up on hover ── */}
          <div
            className={`
              absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm
              flex items-center justify-center py-3
              transition-transform duration-300 ease-in-out
              ${hovered ? "translate-y-0" : "translate-y-full"}
            `}
          >
            <span
              className={`${playfair.className} text-[11px] tracking-[0.3em] uppercase text-black font-medium`}
            >
              {isSoldOut ? "Notify Me" : "View Details"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Text block ── */}
      <div className="mt-3 px-0.5">
        {category && (
          <p className="text-[9px] tracking-[0.3em] uppercase text-[#9c9690] mb-1">
            {category}
          </p>
        )}

        <h3
          className={`
            ${playfair.className}
            text-[13px] sm:text-[15px] leading-snug text-black
            transition-all duration-300 font-normal
            ${hovered ? "italic" : "not-italic"}
          `}
        >
          {name}
        </h3>

        <div className="flex items-center gap-3 mt-1.5">
          <span
            className={`
              ${playfair.className}
              text-[12px] sm:text-[13px] text-[#3d3a36] font-medium
              ${isSoldOut ? "opacity-40 line-through" : ""}
            `}
          >
            {price}
          </span>
          <span
            className={`
              flex-1 h-px bg-[#e0dbd4] transition-all duration-500
              ${hovered ? "opacity-100" : "opacity-0"}
            `}
          />
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