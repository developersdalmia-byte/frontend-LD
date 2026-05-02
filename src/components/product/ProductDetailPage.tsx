"use client";

import { useState } from "react";
import OptimizedImage from "@/components/shared/OptimizedImage";
import { Heart, ChevronDown, ChevronUp, ArrowLeft, ZoomIn, X } from "lucide-react";
import { Playfair_Display } from "next/font/google";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import type { Product } from "@/types";
import SizeGuideModal from "./SizeGuideModal";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

interface ProductDetailPageProps {
  product: Product;
  onBack?: () => void;
}

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export default function ProductDetailPage({ product, onBack }: ProductDetailPageProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [addedAnim, setAddedAnim] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>("description");
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxScale, setLightboxScale] = useState(1);

  const toggleLightboxZoom = () => {
    setLightboxScale(prev => (prev === 1 ? 2 : 1));
  };

  const images = product.images.length > 0 ? product.images : ["https://api.lalitdalmia.com/uploads/websiteImages/images/1.webp"];

  const priceNum =
    typeof product.price === "number"
      ? product.price
      : parseInt(String(product.price).replace(/[^\d]/g, ""), 10);

  const formattedPrice = `₹${priceNum.toLocaleString("en-IN")}.00`;

  const sizesToRender = product.sizes && product.sizes.length > 0 ? product.sizes : ["S", "M", "L"];

  const accordions = [
    {
      id: "description",
      label: "Description",
      content:
        product.description ||
        "A masterpiece of artisanal craftsmanship, this piece embodies the finest traditions of Indian couture.",
    },
    {
      id: "details",
      label: "Details & Styling",
      content: [
        product.attributes?.occasion ? `Occasion: ${product.attributes.occasion}` : "",
        product.attributes?.style ? `Style: ${product.attributes.style}` : "",
        product.attributes?.weddingType && product.attributes.weddingType.length > 0 ? `Wedding Types: ${product.attributes.weddingType.join(", ")}` : "",
        product.fabric ? `Fabric: ${product.fabric}` : "Fabric: Pure silk with hand-embroidered zardozi work.",
        product.care ? `Care: ${product.care}` : "Care: Dry clean only. Store in the provided garment bag away from direct sunlight.",
      ].filter(Boolean).join(" • ")
    },
    {
      id: "delivery",
      label: "Delivery & Returns",
      content:
        "Complimentary delivery on all orders above ₹50,000. Standard delivery within 5–7 business days. Made-to-order pieces require 4–6 weeks. Returns accepted within 14 days in original condition with tags attached.",
    },
    {
      id: "bespoke",
      label: "Bespoke Service",
      content:
        "This piece can be customised to your measurements. For bespoke consultations, visit our flagship store or contact our atelier team.",
    },
  ];

    // Handle zooming logic removed for vertical stack layout

  function handleAddToCart() {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: priceNum,
      image: images[0],
      category: product.category,
      size: selectedSize,
    });
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 2000);
  }

  const handleWishlist = () => {
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: formattedPrice,
      image: images[0],
      category: product.category,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-[1000] bg-white flex flex-col items-center justify-center animate-in fade-in duration-500 overflow-hidden"
          onClick={() => { setIsLightboxOpen(false); setLightboxScale(1); }}
        >
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 h-20 px-8 flex items-center justify-between z-[1010]">
             <span className={`${playfair.className} text-xs tracking-[0.3em] uppercase`}>{product.name}</span>
             <div className="flex items-center gap-8">
               <button 
                 onClick={(e) => { e.stopPropagation(); toggleLightboxZoom(); }}
                 className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                 title={lightboxScale === 1 ? "Zoom In" : "Zoom Out"}
               >
                 {lightboxScale === 1 ? <ZoomIn size={24} strokeWidth={1} /> : <X size={24} strokeWidth={1} />}
               </button>
               <button 
                 onClick={() => { setIsLightboxOpen(false); setLightboxScale(1); }}
                 className="p-2 hover:bg-gray-100 rounded-full transition-colors"
               >
                 <X size={24} strokeWidth={1} />
               </button>
             </div>
          </div>

          {/* Image Container */}
          <div 
            className={`relative w-full h-full flex items-center justify-center transition-all duration-500 ease-out cursor-zoom-in ${
              lightboxScale > 1 ? "cursor-zoom-out overflow-auto" : "cursor-zoom-in"
            }`}
            style={{ 
              transform: `scale(${lightboxScale})`,
              cursor: lightboxScale > 1 ? "grab" : "zoom-in"
            }}
            onClick={(e) => { e.stopPropagation(); toggleLightboxZoom(); }}
          >
            <div className="relative w-full h-[90vh] max-w-[1400px]">
              <OptimizedImage
                src={images[activeImageIdx]}
                alt={product.name}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Lightbox Controls (Only visible when NOT zoomed) */}
          <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-8 transition-opacity duration-300 ${lightboxScale > 1 ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
             <button 
               onClick={(e) => { e.stopPropagation(); setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1)); }}
               className="group flex items-center gap-4 text-[10px] tracking-[0.4em] uppercase"
             >
               <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-2" />
               Prev
             </button>
             <span className="text-[10px] tracking-[0.4em] uppercase font-medium">{activeImageIdx + 1} / {images.length}</span>
             <button 
               onClick={(e) => { e.stopPropagation(); setActiveImageIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0)); }}
               className="group flex items-center gap-4 text-[10px] tracking-[0.4em] uppercase"
             >
               Next
               <ArrowLeft size={16} className="rotate-180 transition-transform group-hover:translate-x-2" />
             </button>
          </div>
        </div>
      )}

      {/* Back button */}
      {onBack && (
        <div className="px-4 md:px-14 pt-6 md:pt-8">
          <button
            onClick={onBack}
            className={`${playfair.className} flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-[#9c9690] hover:text-black transition-colors duration-200`}
          >
            <ArrowLeft size={14} />
            Back
          </button>
        </div>
      )}
      {/* Main layout with Navbar padding */}
      <div className="max-w-[1900px] mx-auto px-4 md:px-8 py-12 lg:pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_450px] gap-8 lg:gap-14 items-start">

          {/* ─── COLUMN 1: Fixed Thumbnails (Left) ─── */}
          <div className="hidden lg:flex flex-col gap-3 sticky top-[140px] max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-hide">
            {images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => {
                  const element = document.getElementById(`product-image-${idx}`);
                  element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`relative aspect-[3/4] w-full border transition-all duration-300 ${
                  activeImageIdx === idx ? "border-black p-0.5" : "border-transparent opacity-50 hover:opacity-100"
                }`}
              >
                <OptimizedImage src={img} alt="Thumbnail" fill className="object-cover" />
              </button>
            ))}
          </div>

          {/* ─── COLUMN 2: Image Gallery (Mobile Slider / Desktop Stack) ─── */}
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory lg:snap-none scrollbar-hide gap-4 -mx-4 px-4 lg:mx-0 lg:px-0">
            {images.map((img, idx) => (
              <div 
                key={idx} 
                id={`product-image-${idx}`}
                className="relative h-[65vh] lg:h-[90vh] w-[85vw] lg:w-full shrink-0 snap-center bg-[#fdfcfb] overflow-hidden group cursor-zoom-in"
                onClick={() => { setActiveImageIdx(idx); setIsLightboxOpen(true); }}
              >
                <OptimizedImage
                  src={img}
                  alt={`${product.name} - View ${idx + 1}`}
                  fill
                  priority={idx === 0}
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-contain transition-transform duration-1000 group-hover:scale-[1.02]"
                />
                
                {/* Badges */}
                {idx === 0 && (
                  <div className="absolute top-6 left-6 lg:top-8 lg:left-8 flex flex-col gap-2 z-10 pointer-events-none">
                    {product.new && (
                      <span className="bg-black text-white text-[9px] tracking-[0.3em] uppercase px-4 py-2">
                        New
                      </span>
                    )}
                    {product.availability === "made-to-order" && (
                      <span className="bg-white/90 backdrop-blur-md border border-black/5 text-black text-[9px] tracking-[0.25em] uppercase px-4 py-2">
                        Bespoke
                      </span>
                    )}
                  </div>
                )}

                {/* Subtle Zoom Indicator */}
                <div className="absolute bottom-6 right-6 lg:bottom-8 lg:right-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border border-black/10 flex items-center justify-center bg-white/60 backdrop-blur-sm shadow-sm">
                    <ZoomIn size={16} className="lg:hidden" />
                    <ZoomIn size={18} className="hidden lg:block" strokeWidth={1} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ─── Mobile Slider Indicators ─── */}
          <div className="flex lg:hidden justify-center gap-2 mt-4">
             {images.map((_, idx) => (
               <div 
                 key={idx} 
                 className={`h-1.5 transition-all duration-300 rounded-full ${activeImageIdx === idx ? "w-6 bg-black" : "w-1.5 bg-[#e8e4de]"}`}
               />
             ))}
          </div>

          {/* ─── COLUMN 3: Sticky Product Info (Right) ─── */}
          <div className="flex flex-col sticky top-[140px]">
            {/* Category */}
            {product.category && (
              <p className="text-[9px] tracking-[0.4em] uppercase text-[#9c9690] mb-4">
                {product.category}
                {product.collection && ` — ${product.collection}`}
              </p>
            )}

            {/* Name */}
            <h1 className={`${playfair.className} text-2xl lg:text-3xl font-normal text-black leading-[1.2] mb-3 tracking-wide`}>
              {product.name}
            </h1>

            {/* Subcategory */}
            {product.subcategory && (
              <p className={`${playfair.className} text-sm italic text-[#9c9690] mb-4`}>
                {product.subcategory}
              </p>
            )}

            {/* Divider */}
            <div className="h-px bg-[#f0ede8] my-4" />

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span
                className={`${playfair.className} text-xl lg:text-2xl font-medium text-black ${
                  product.availability === "sold-out" ? "opacity-40 line-through" : ""
                }`}
              >
                {formattedPrice}
              </span>
              <span className="text-[10px] tracking-[0.15em] uppercase text-[#9c9690]">
                Incl. of all taxes
              </span>
            </div>

            {/* Size selector */}
            {product.availability !== "sold-out" && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] tracking-[0.25em] uppercase text-black font-medium">Select Size</p>
                  <button 
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-[10px] tracking-[0.1em] uppercase text-black underline underline-offset-8 hover:text-[#9c9690] transition-colors"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {sizesToRender.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setSelectedSize(s); setSizeError(false); }}
                      className={`w-12 h-12 text-[11px] tracking-widest border transition-all duration-300 ${
                        selectedSize === s
                          ? "border-black bg-black text-white"
                          : "border-[#f0ede8] text-black hover:border-black"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {sizeError && (
                  <p className="text-[10px] text-red-600 tracking-wide mt-3 animate-pulse">
                    Please select a size to continue
                  </p>
                )}
              </div>
            )}

            {/* Add to Cart + Wishlist */}
            <div className="flex gap-3 mb-10">
              {product.availability === "sold-out" ? (
                <button
                  className={`${playfair.className} flex-1 border border-black text-black text-[11px] tracking-[0.35em] uppercase py-3.5 hover:bg-black hover:text-white transition-all duration-300`}
                >
                  Notify Me
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className={`${playfair.className} flex-1 text-[11px] tracking-[0.3em] uppercase py-3.5 transition-all duration-500 relative overflow-hidden group ${
                    addedAnim
                      ? "bg-[#2a5c2a] text-white border border-[#2a5c2a]"
                      : "bg-black text-white border border-black hover:bg-white hover:text-black"
                  }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {addedAnim
                      ? "Added to Cart ✓"
                      : product.availability === "made-to-order"
                      ? "Request Made-to-Order"
                      : "Add to Cart"}
                  </span>
                </button>
              )}

              {/* ✅ Connected to global WishlistContext */}
              <button
                onClick={handleWishlist}
                className={`w-[52px] shrink-0 flex items-center justify-center border transition-all duration-300 ${
                  wishlisted ? "border-black bg-black" : "border-[#e8e4de] bg-white hover:border-black hover:bg-[#faf8f5]"
                }`}
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart
                  size={18}
                  className={`transition-all ${
                    wishlisted ? "fill-white stroke-white" : "stroke-black fill-none"
                  }`}
                />
              </button>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] tracking-[0.2em] uppercase border border-[#e8e4de] text-[#9c9690] px-3 py-1.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Divider */}
            <div className="h-px bg-[#e8e4de] mb-6" />

            {/* Accordions */}
            <div className="space-y-0">
              {accordions.map((acc) => (
                <div key={acc.id} className="border-b border-[#f0ede8]">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === acc.id ? null : acc.id)}
                    className="w-full flex items-center justify-between py-4 text-left group"
                  >
                    <span className="text-[10px] tracking-[0.25em] uppercase text-black font-medium group-hover:text-[#9c9690] transition-colors">
                      {acc.label}
                    </span>
                    {openAccordion === acc.id ? (
                      <ChevronUp size={12} className="text-[#9c9690]" />
                    ) : (
                      <ChevronDown size={12} className="text-[#9c9690]" />
                    )}
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openAccordion === acc.id ? "max-h-[500px] opacity-100 pb-6" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-[13px] leading-relaxed text-[#6b6560] font-light">{acc.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Product ID */}
            <p className="text-[9px] tracking-[0.15em] uppercase text-[#b8b0a6] mt-10">
              Reference: {product.id.toUpperCase()}
            </p>
          </div>
        </div>
      </div>

      <SizeGuideModal 
        isOpen={isSizeGuideOpen} 
        onClose={() => setIsSizeGuideOpen(false)} 
        category={product.category}
        subcategory={product.subcategory}
      />
    </div>
  );
}