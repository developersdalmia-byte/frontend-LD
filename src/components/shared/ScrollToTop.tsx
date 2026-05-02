"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the top cordinate to 0
  // make scrolling smooth
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div className="fixed bottom-10 right-6 z-[90] md:right-10">
      {isVisible && (
        <button
          type="button"
          onClick={scrollToTop}
          className="group relative flex h-11 w-11 items-center justify-center rounded-full bg-black text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-[#1a1a1a] active:scale-95"
          aria-label="Scroll to top"
        >
          <ChevronUp
            size={20}
            className="transition-transform duration-300 group-hover:-translate-y-1"
          />
          
          {/* Subtle pulse effect on hover */}
          <span className="absolute inset-0 rounded-full border border-black/20 group-hover:animate-ping" />
        </button>
      )}
    </div>
  );
}
