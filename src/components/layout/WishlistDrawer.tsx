"use client";

import { useWishlist } from "@/context/WishlistContext";
import OptimizedImage from "@/components/shared/OptimizedImage";
import { X, Heart, ShoppingBag } from "lucide-react";
import { Playfair_Display } from "next/font/google";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export default function WishlistDrawer() {
  const { items, isOpen, closeWishlist, removeFromWishlist, count } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: typeof item.price === "number" ? item.price : parseInt(item.price.replace(/[^\d]/g, ""), 10),
      image: item.image,
      category: item.category,
    });
    removeFromWishlist(item.id);
    closeWishlist();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeWishlist}
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[#faf8f5] z-50 flex flex-col transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-8 py-6 border-b border-[#e8e4de]">
          <div className="flex items-center gap-3">
            <Heart size={16} className="text-black" />
            <span className={`${playfair.className} text-[11px] tracking-[0.4em] uppercase text-black`}>
              Your Wishlist
            </span>
            {count > 0 && (
              <span className="w-5 h-5 rounded-full bg-black text-white text-[10px] flex items-center justify-center">
                {count}
              </span>
            )}
          </div>
          <button
            onClick={closeWishlist}
            className="w-9 h-9 flex items-center justify-center hover:bg-[#f0ede8] rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-5 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-5 pt-24">
              <Heart size={36} className="text-[#c8c2b8]" strokeWidth={1} />
              <div>
                <p className={`${playfair.className} text-lg italic text-[#9c9690]`}>
                  Your wishlist is empty
                </p>
                <p className="text-[11px] tracking-[0.2em] uppercase text-[#b8b0a6] mt-2">
                  Save your favorite pieces
                </p>
              </div>
              <button
                onClick={closeWishlist}
                className={`${playfair.className} mt-4 text-[10px] tracking-[0.35em] uppercase border border-black px-8 py-3 hover:bg-black hover:text-white transition-all duration-300`}
              >
                Discover the collection
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-5 border-b border-[#ede9e2] pb-8"
              >
                {/* Image */}
                <div className="relative w-20 h-28 sm:w-24 sm:h-32 flex-shrink-0 bg-[#f0ede8] overflow-hidden">
                  <OptimizedImage
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    {item.category && (
                      <p className="text-[9px] tracking-[0.3em] uppercase text-[#9c9690] mb-1">
                        {item.category}
                      </p>
                    )}
                    <Link
                      href={`/product/${item.id}`}
                      onClick={closeWishlist}
                    >
                       <h4 className={`${playfair.className} text-[14px] font-normal text-black leading-snug truncate hover:underline`}>
                         {item.name}
                       </h4>
                    </Link>
                    <p className={`${playfair.className} text-[15px] text-black mt-2 font-medium`}>
                      {item.price}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-4">
                     <button
                        onClick={() => handleAddToCart(item)}
                        className="text-[9px] tracking-[0.25em] uppercase text-black flex items-center gap-2 hover:opacity-70 transition-opacity"
                     >
                        <ShoppingBag size={12} />
                        Add to Cart
                     </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="text-[9px] tracking-[0.25em] uppercase text-[#9c9690] hover:text-black transition-colors underline underline-offset-2 py-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
}
