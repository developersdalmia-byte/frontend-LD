import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { Playfair_Display } from "next/font/google";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import dynamic from "next/dynamic";

const CartDrawer = dynamic(() => import("@/components/cart/CartDrawer"));
const WishlistDrawer = dynamic(() => import("@/components/layout/WishlistDrawer"));

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Lalit Dalima — Luxury Indian Fashion industry",
    template: "%s | Lalit Dalima",
  },
  description:
    "Lalit Dalima is a luxury Indian fashion label rooted in craft, heritage, and artisanal excellence.",
  icons: {
    icon: "https://api.lalitdalmia.com/uploads/websiteImages/Logo/Logo LD BLK.webp",
    apple: "https://api.lalitdalmia.com/uploads/websiteImages/Logo/Logo LD BLK.webp",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0e0d0c",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${playfair.className} bg-white text-black`}>
        <WishlistProvider>
          <CartProvider>
            <AuthProvider>

              {/* Navbar */}
              <Navbar />

              {/* Drawers */}
              <CartDrawer />
              <WishlistDrawer />

              {/* Main Content (👇 pushed below navbar) */}
              <main>
                {children}
              </main>

              {/* Footer */}
              <Footer />

            </AuthProvider>
          </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}