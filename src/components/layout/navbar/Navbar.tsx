"use client";

import { useState } from "react";
import { Menu, ShoppingBag, Search } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useNavbarScroll } from "./useNavbarScroll";
import NavbarDesktop from "./NavbarDesktop";
import dynamic from "next/dynamic";
import Link from "next/link";

const NavbarMobile = dynamic(() => import("./NavbarMobile"));
const LoginModal = dynamic(() => import("./LoginModal"));
const SearchOverlay = dynamic(() => import("./SearchOverlay"));
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { showNav, hasScrolled: scrollState } = useNavbarScroll();
  const pathname = usePathname();

  const isTransparentPage = pathname === "/" || pathname.startsWith("/category/");
  const hasScrolled = scrollState || !isTransparentPage;

  const { openCart, totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      {/* ── Login Modal ── */}
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />

      {/* ── Search Overlay ── */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <header
        className={`
          group
          fixed top-0 left-0 right-0 z-50
          transition-all duration-300 ease-in-out
          ${showNav ? "translate-y-0" : "-translate-y-full"}
          ${hasScrolled
            ? "bg-white shadow-sm"
            : "bg-transparent md:hover:bg-white md:hover:shadow-sm"
          }
        `}
      >
        {/* Dark gradient scrim — only at top when NOT scrolled and NOT hovered */}
        {!hasScrolled && (
          <div
            className="absolute inset-0 pointer-events-none group-hover:opacity-0 transition-opacity duration-300"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 100%)",
            }}
            aria-hidden
          />
        )}

        {/* ── Desktop navbar ── */}
        <div className="hidden md:block relative py-4">
          <NavbarDesktop
            hasScrolled={hasScrolled}
            onLoginOpen={() => setLoginOpen(true)}
            onSearchOpen={() => setSearchOpen(true)}
          />
        </div>

        {/* ── Mobile top bar ── */}
        <div className="flex md:hidden items-center justify-between px-6 h-[70px] relative">
          {/* Left: Menu + WhatsApp */}
          <div className="w-1/3 flex items-center justify-start gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className={`transition-colors duration-300 ${hasScrolled ? "text-black" : "text-white group-hover:text-black"}`}
            >
              <Menu size={24} strokeWidth={1.5} />
            </button>

            {/* WhatsApp */}
            <a
              href="https://wa.me/919810446103"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="transition-transform active:scale-90"
            >
              <div className="bg-[#25D366] p-1.5 rounded-full flex items-center justify-center shadow-sm">
                <FaWhatsapp className="text-white" size={15} />
              </div>
            </a>
          </div>

          {/* Center: Logo — both variants rendered, toggled via opacity */}
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 mt-2 flex items-center justify-center">
            <Link href="/" className="relative block w-[150px] h-[155px]">
              <Image
                src="/Logo/Logo LD BLK.webp"
                alt="Lalit Dalmia"
                fill
                sizes="150px"
                priority
                className={`object-contain transition-opacity duration-300 ${hasScrolled ? "opacity-100" : "opacity-0"
                  }`}
              />
              <Image
                src="https://api.lalitdalmia.com/uploads/websiteImages//Logo/Logo%20LD%20WHT.webp"
                alt="Lalit Dalmia"
                fill
                sizes="150px"
                priority
                className={`object-contain transition-opacity duration-300 ${hasScrolled ? "opacity-0" : "opacity-100"
                  }`}
              />
            </Link>
          </div>

          {/* Right: Search + Cart */}
          <div className="w-1/3 flex items-center justify-end gap-5">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className={`transition-colors duration-300 ${hasScrolled ? "text-black" : "text-white group-hover:text-black"}`}
            >
              <Search size={22} strokeWidth={1.5} />
            </button>

            <button onClick={openCart} aria-label="Cart" className="relative">
              <ShoppingBag
                size={22}
                strokeWidth={1.5}
                className={`transition-colors duration-300 ${hasScrolled ? "text-black" : "text-white group-hover:text-black"}`}
              />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-black text-white text-[8px] flex items-center justify-center leading-none font-bold">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile full-screen drawer ── */}
      <NavbarMobile
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onLoginOpen={() => {
          setMobileOpen(false);
          setLoginOpen(true);
        }}
        onSearchOpen={() => {
          setMobileOpen(false);
          setSearchOpen(true);
        }}
      />
    </>
  );
}