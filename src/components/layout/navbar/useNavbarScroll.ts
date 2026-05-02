import { useState, useEffect, useRef } from "react";

export function useNavbarScroll() {
  const [showNav, setShowNav]         = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
  const lastScrollY                   = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;

      // Keep white bg until user is fully back at top
      setHasScrolled(current > 10);

      // Direction detection
      if (current > lastScrollY.current && current > 60) {
        setShowNav(false); 
      } else {
        setShowNav(true);  
      }

      lastScrollY.current = current;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // 

  return { showNav, hasScrolled };
}