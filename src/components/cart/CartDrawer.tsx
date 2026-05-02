"use client";

import { useCart } from "@/context/CartContext";
import OptimizedImage from "@/components/shared/OptimizedImage";
import Link from "next/link";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart, updateQty, totalPrice, totalItems } =
    useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
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
            <ShoppingBag size={16} className="text-black" />
            <span className={`${playfair.className} text-[11px] tracking-[0.4em] uppercase text-black`}>
              Your Selection
            </span>
            {totalItems > 0 && (
              <span className="w-5 h-5 rounded-full bg-black text-white text-[10px] flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-9 h-9 flex items-center justify-center hover:bg-[#f0ede8] rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-5 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-5 pt-24">
              <ShoppingBag size={36} className="text-[#c8c2b8]" strokeWidth={1} />
              <div>
                <p className={`${playfair.className} text-lg italic text-[#9c9690]`}>
                  Your cart is empty
                </p>
                <p className="text-[11px] tracking-[0.2em] uppercase text-[#b8b0a6] mt-2">
                  Discover the collection
                </p>
              </div>
              <button
                onClick={closeCart}
                className={`${playfair.className} mt-4 text-[10px] tracking-[0.35em] uppercase border border-black px-8 py-3 hover:bg-black hover:text-white transition-all duration-300`}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
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
                <div className="flex-1 min-w-0">
                  {item.category && (
                    <p className="text-[9px] tracking-[0.3em] uppercase text-[#9c9690] mb-1">
                      {item.category}
                    </p>
                  )}
                  <h4 className={`${playfair.className} text-[14px] font-normal text-black leading-snug truncate`}>
                    {item.name}
                  </h4>
                  {item.size && (
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#9c9690] mt-1">
                      Size: {item.size}
                    </p>
                  )}
                  <p className={`${playfair.className} text-[15px] text-black mt-2 font-medium`}>
                    {item.price}
                  </p>

                  {/* Qty controls */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-0 border border-[#ddd9d3]">
                      <button
                        onClick={() => updateQty(item.id, item.size, -1)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-[#e8e4de] transition-colors active:bg-[#e8e4de]"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-[13px] font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, item.size, 1)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-[#e8e4de] transition-colors active:bg-[#e8e4de]"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id, item.size)}
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

        {/* Footer / Checkout */}
        {items.length > 0 && (
          <div className="px-5 sm:px-8 py-6 border-t border-[#e8e4de] bg-[#faf8f5]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#9c9690]">
                Subtotal
              </span>
              <span className={`${playfair.className} text-[17px] font-medium text-black`}>
                ₹{totalPrice.toLocaleString("en-IN")}.00
              </span>
            </div>
            <p className="text-[9px] text-[#9c9690] tracking-wide mb-6">
              Taxes & shipping calculated at checkout
            </p>

            <Link
              href="/checkout"
              onClick={closeCart}
              className={`${playfair.className} w-full bg-black text-white text-[11px] tracking-[0.35em] uppercase py-4 flex items-center justify-center gap-3 hover:bg-[#222] transition-colors duration-300`}
            >
              Proceed to Checkout
              <ArrowRight size={14} />
            </Link>

            <button
              onClick={closeCart}
              className={`${playfair.className} w-full mt-3 text-[10px] tracking-[0.3em] uppercase text-black py-3 border border-transparent hover:border-black transition-colors duration-300`}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}