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
const ScrollToTop = dynamic(() => import("@/components/shared/ScrollToTop"));

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: {
    default: "Lalit Dalmia — Luxury Indian Fashion industry",
    template: "%s | Lalit Dalmia",
  },
  description:
    "Lalit Dalmia is a luxury Indian fashion label rooted in craft, heritage, and artisanal excellence.",
  icons: {
    icon: "https://api.lalitdalmia.com/uploads/websiteImages/Logo/LD-LOGO-BLK.webp",
    apple: "https://api.lalitdalmia.com/uploads/websiteImages/Logo/LD-LOGO-BLK.webp",
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
      <body className={`${playfair.variable} ${playfair.className} bg-white text-black`}>
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

              {/* Global Utilities */}
              <ScrollToTop />

              {/* Footer */}
              <Footer />
              
              <script
                src="https://checkout.razorpay.com/v1/checkout.js"
                async
              ></script>

            </AuthProvider>
          </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}