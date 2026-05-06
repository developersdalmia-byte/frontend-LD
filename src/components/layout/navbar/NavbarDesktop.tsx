"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Heart, ShoppingBag, User, LogOut } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { NAV_ITEMS } from "@/data";
import dynamic from "next/dynamic";

const MegaMenu = dynamic(() => import("./MegaMenu"));
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

type Props = {
  hasScrolled: boolean;
  onLoginOpen: () => void;
  onSearchOpen: () => void;
};

export default function NavbarDesktop({ hasScrolled, onLoginOpen, onSearchOpen }: Props) {
  const { isLoggedIn, user, logout } = useAuth();
  const { openCart, totalItems } = useCart();
  const { count: wishlistCount, openWishlist } = useWishlist();

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isWhite = hasScrolled || isHovered;

  const openMenu = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveMenu(label);
  };

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 180);
  };

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };




  const iconColor = isWhite ? "text-black" : "text-white";
  const navText = isWhite
    ? "text-gray-700 hover:text-black"
    : "text-white hover:text-gray-200";
  const borderColor = isWhite
    ? "border-gray-200"
    : "border-white/20";

  const activeItem = NAV_ITEMS.find(
    (item) => item.label === activeMenu
  );

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ================= TOP ROW ================= */}
      <div className="relative flex items-center justify-between px-8 h-[70px]">

        {/* LEFT SPACER (same width as right icons) */}
        <div className="w-[140px]" />

        {/* CENTER LOGO — both variants rendered, toggled via opacity to prevent blur */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
          <Link href="/" className="relative block h-[110px] w-[140px]">
            <Image
              src="https://api.lalitdalmia.com/uploads/websiteImages/Logo/LD-LOGO-BLK.webp"
              alt="Lalit Dalmia Logo"
              width={140}
              height={80}
              priority
              className={`absolute inset-0 h-[110px] w-auto object-contain transition-opacity duration-300 ${isWhite ? "opacity-100" : "opacity-0"
                }`}
            />
            <Image
              src="https://api.lalitdalmia.com/uploads/websiteImages/Logo/LD-LOGO-white.webp"
              alt="Lalit Dalmia Logo"
              width={140}
              height={80}
              priority
              className={`absolute inset-0 h-[110px] w-auto object-contain transition-opacity duration-300 ${isWhite ? "opacity-0" : "opacity-100"
                }`}
            />
          </Link>
        </div>

        {/* RIGHT ICONS */}
        <div className="flex items-center justify-end gap-6 w-fit min-w-[200px]">

          <Search
            onClick={onSearchOpen}
            className={`cursor-pointer transition-colors duration-300 ${iconColor}`}
            size={20}
          />

          {/* Divider */}
          <div className={`h-6 w-[1px] ${isWhite ? "bg-gray-300" : "bg-white/30"}`} />

          {/* Auth */}
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span
                className={`text-[10px] tracking-[0.2em] uppercase ${iconColor}`}
              >
                {user?.name?.split(" ")[0]}
              </span>
              <button
                onClick={logout}
                className={`${iconColor} hover:opacity-70`}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button onClick={onLoginOpen} aria-label="Login">
              <User
                className={`${iconColor} transition-colors duration-300`}
                size={20}
              />
            </button>
          )}

          {/* Wishlist */}
          <button
            onClick={openWishlist}
            className="relative"
            aria-label="Wishlist"
          >
            <Heart
              className={`transition-colors duration-300 ${iconColor}`}
              size={20}
            />
            {isMounted && wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-black text-white text-[9px] flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            onClick={openCart}
            className="relative"
            aria-label="Cart"
          >
            <ShoppingBag
              className={`transition-colors duration-300 ${iconColor}`}
              size={20}
            />
            {isMounted && totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-black text-white text-[9px] flex items-center justify-center">
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
            className="transition-transform hover:scale-110 duration-300"
          >
            <div className="bg-[#25D366] p-1.5 rounded-full flex items-center justify-center">
              <FaWhatsapp className="text-white" size={16} />
            </div>
          </a>
        </div>
      </div>

      {/* ================= NAVBAR ================= */}
      <nav
        className={`relative flex justify-center border-t ${borderColor} transition-colors duration-300`}
      >
        <ul className="flex gap-8 py-3 text-[10px] tracking-[0.2em] uppercase">
          {NAV_ITEMS.map((item) => {
            const isActive = activeMenu === item.label;
            const hasChildren =
              item.children && item.children.length > 0;

            return (
              <li
                key={item.label}
                onMouseEnter={() =>
                  hasChildren
                    ? openMenu(item.label)
                    : scheduleClose()
                }
                onMouseLeave={scheduleClose}
              >
                <Link
                  href={item.href}
                  className={`
                    relative pb-1 transition-colors duration-300
                    ${navText}
                    ${isActive
                      ? "after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-[#c9b99a]"
                      : ""
                    }
                  `}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mega Menu */}
        {activeMenu &&
          activeItem?.children &&
          activeItem.children.length > 0 && (
            <div
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
            >
              <MegaMenu
                label={activeMenu}
                items={activeItem.children}
                onClose={() => setActiveMenu(null)}
              />
            </div>
          )}
      </nav>
    </div>
  );
}