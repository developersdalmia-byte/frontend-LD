"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Search, Heart, ShoppingBag, User, ChevronDown } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { NAV_ITEMS } from "@/data";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Playfair_Display } from "next/font/google";
import type { NavItem } from "@/types";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onLoginOpen: () => void;
  onSearchOpen: () => void;
};

export default function NavbarMobile({
  isOpen,
  onClose,
  onLoginOpen,
  onSearchOpen,
}: Props) {
  const { openCart, totalItems } = useCart();
  const { count: wishlistCount, openWishlist } = useWishlist();
  
  // Track expanded state for any item by its label
  const [expandedStates, setExpandedStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setExpandedStates({});
    onClose();
  }, [onClose]);

  const handleLoginClick = () => {
    handleClose();
    onLoginOpen();
  };

  const toggleExpand = (label: string) => {
    setExpandedStates((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  // Helper to render a navigation item and its potential children recursively
  const renderNavItem = (item: NavItem, depth = 0) => {
    const isExpanded = !!expandedStates[item.label];
    const hasChildren = item.children && item.children.length > 0;
    const delay = 0; // Animation delay could be added here if needed

    return (
      <div key={item.label} className={`${depth === 0 ? "border-b border-gray-100" : ""}`}>
        <div className="flex items-center justify-between">
          <Link
            href={item.href}
            onClick={handleClose}
            className={`
              ${playfair.className} flex-1 py-4 uppercase tracking-[0.15em] transition-colors duration-200
              ${depth === 0 ? "px-6 text-[13px] text-black" : "px-10 text-[12px] text-[#6b6560] italic"}
              hover:text-black
            `}
          >
            {item.label}
          </Link>

          {hasChildren && (
            <button
              onClick={() => toggleExpand(item.label)}
              className="px-6 py-4"
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              <ChevronDown
                size={depth === 0 ? 14 : 12}
                className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
              />
            </button>
          )}
        </div>

        {hasChildren && (
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className={`${depth === 0 ? "bg-gray-50/50" : ""}`}>
              {item.children?.map((child) => (
                <div key={child.label}>
                  {child.children && child.children.length > 0 ? (
                    // If the child has its own children, render it with expansion support
                    <div className="pl-4">
                      <div className="flex items-center justify-between">
                        <Link
                          href={child.href}
                          onClick={handleClose}
                          className={`${playfair.className} flex-1 py-3 px-6 text-[12px] italic text-[#6b6560] hover:text-black`}
                        >
                          {child.label}
                        </Link>
                        <button
                          onClick={() => toggleExpand(child.label)}
                          className="px-6 py-3"
                        >
                          <ChevronDown
                            size={12}
                            className={`transition-transform duration-300 ${
                              expandedStates[child.label] ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>
                      
                      {expandedStates[child.label] && (
                        <div className="pl-6 pb-2">
                          {child.children.map((subChild) => (
                            <Link
                              key={subChild.label}
                              href={subChild.href}
                              onClick={handleClose}
                              className="block py-2.5 px-6 text-[11px] tracking-[0.1em] text-[#8c8680] hover:text-black uppercase"
                            >
                              {subChild.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    // Simple link for children without sub-items
                    <Link
                      href={child.href}
                      onClick={handleClose}
                      className={`${playfair.className} block py-3.5 px-10 text-[14px] italic text-[#6b6560] hover:text-black`}
                    >
                      {child.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[998] bg-black/40 backdrop-blur-sm transition-opacity duration-400
        ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={handleClose}
      />

      <div
        className={`fixed top-0 right-0 h-full w-[85vw] max-w-[360px] z-[999] bg-white
        flex flex-col shadow-2xl transition-transform duration-500 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-[#e8e4de]">
          <span className={`${playfair.className} text-[11px] tracking-[0.3em] uppercase text-[#9c9690]`}>
            Navigation
          </span>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* NAV ITEMS */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <nav className="flex flex-col">
            {NAV_ITEMS.map((item) => renderNavItem(item))}
          </nav>
        </div>

        {/* BOTTOM ICONS */}
        <div className="border-t px-6 py-5 flex justify-around items-center bg-white">
          <button onClick={onSearchOpen} aria-label="Search" className="p-2">
            <Search size={20} />
          </button>

          <button 
            aria-label="Wishlist" 
            className="relative p-2"
            onClick={() => { handleClose(); openWishlist(); }}
          >
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-black text-white text-[9px] flex items-center justify-center leading-none">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            aria-label="Open cart"
            className="relative p-2"
            onClick={() => { handleClose(); openCart(); }}
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-black text-white text-[9px] flex items-center justify-center leading-none">
                {totalItems}
              </span>
            )}
          </button>

          {/* WhatsApp */}
          <a
            href="https://wa.me/919810446103"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="p-2"
          >
            <div className="bg-[#25D366] p-1.5 rounded-full flex items-center justify-center">
              <FaWhatsapp className="text-white" size={16} />
            </div>
          </a>

          {/* Login */}
          <button aria-label="Sign in" className="p-2" onClick={handleLoginClick}>
            <User size={20} />
          </button>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e8e4de;
          border-radius: 10px;
        }
      `}</style>
    </>
  );
}