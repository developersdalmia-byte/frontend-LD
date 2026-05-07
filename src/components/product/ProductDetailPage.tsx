"use client";

import { useState, useEffect, useRef } from "react";
import OptimizedImage from "@/components/shared/OptimizedImage";
import { Heart, ArrowLeft, ZoomIn, X, Minus, Plus } from "lucide-react";
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

// WhatsApp SVG Icon
function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ── Thumbnail Column: 100vh sticky, fade masks top/bottom, auto-scroll active ──
function ThumbnailColumn({
  images,
  activeImageIdx,
  onSelect,
}: {
  images: string[];
  activeImageIdx: number;
  onSelect: (idx: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Auto-scroll active thumbnail into centre of the column
  useEffect(() => {
    const container = containerRef.current;
    const activeBtn = btnRefs.current[activeImageIdx];
    if (!container || !activeBtn) return;
    const containerRect = container.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    const offset =
      btnRect.top - containerRect.top - containerRect.height / 2 + btnRect.height / 2;
    container.scrollBy({ top: offset, behavior: "smooth" });
  }, [activeImageIdx]);

  return (
    <div className="hidden lg:block sticky top-0 h-screen">
      {/* Fade mask top */}
      <div className="absolute top-0 left-0 right-0 h-20 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, white 30%, transparent 100%)" }}
      />
      {/* Fade mask bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-20 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to top, white 30%, transparent 100%)" }}
      />

      {/* Scrollable list */}
      <div
        ref={containerRef}
        className="h-full overflow-y-auto flex flex-col gap-2.5 py-20 pr-2
          [&::-webkit-scrollbar]:w-[3px]
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-[#d0ccc6]
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb:hover]:bg-[#9c9690]"
      >
        {images.map((img, idx) => (
          <button
            key={idx}
            ref={(el) => { btnRefs.current[idx] = el; }}
            onClick={() => onSelect(idx)}
            className={`relative aspect-[3/4] w-full overflow-hidden shrink-0 transition-all duration-300 group
              ${activeImageIdx === idx
                ? "opacity-100 outline outline-[1.5px] outline-offset-[2px] outline-black"
                : "opacity-40 hover:opacity-80 hover:outline hover:outline-[1px] hover:outline-offset-[2px] hover:outline-[#ccc]"
              }`}
          >
            <OptimizedImage
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Magnified Image: High-end zoom-on-hover effect ──
function MagnifiedImage({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden cursor-zoom-in"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative w-full h-full transition-transform duration-500 ease-out"
        style={{
          transform: isHovered ? "scale(1.8)" : "scale(1)",
          transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
        }}
      >
        <OptimizedImage
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-contain"
        />
      </div>
    </div>
  );
}

const WHATSAPP_NUMBER = "919999999999"; // Replace with actual number

export default function ProductDetailPage({ product, onBack }: ProductDetailPageProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [addedAnim, setAddedAnim] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>("product-details");
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxScale, setLightboxScale] = useState(1);
  const [lightboxPan, setLightboxPan] = useState({ x: 50, y: 50 });

  const handleLightboxMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (lightboxScale === 1) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setLightboxPan({ x, y });
  };

  const images = product.images.length > 0
    ? product.images
    : ["https://api.lalitdalmia.com/uploads/websiteImages/images/1.webp"];

  const priceNum =
    typeof product.price === "number"
      ? product.price
      : parseInt(String(product.price).replace(/[^\d]/g, ""), 10);

  // Format: INR. 5,09,900
  const formattedPrice = `INR. ${priceNum.toLocaleString("en-IN")}`;

  const sizesToRender = product.sizes && product.sizes.length > 0 ? product.sizes : ["S", "M", "L"];

  const isMadeToOrder = product.availability === "made-to-order";
  const isSoldOut = product.availability === "sold-out";

  // Product detail bullet points
  const productDetailBullets: string[] = [
    "Product Color May Slightly Vary Due To Photographic Lighting Sources Or Your Monitor Setting.",
    product.tags?.includes("set") ? "MRP Inclusive Of : " + product.tags.join(" | ") : "",
    product.fabric ? `Materials : ${product.fabric}` : "",
    product.attributes?.style ? `Color : ${product.attributes.style}` : "",
    product.care ? `Care Guide : ${product.care}` : "",
    isMadeToOrder ? "Made to Order : 10 Weeks" : "",
    "Model Wearing Size Small, Model Height 5'9\"",
  ].filter(Boolean);

  const accordions = [
    {
      id: "product-details",
      label: "PRODUCT DETAILS",
      content: (
        <div className="text-[12px] leading-relaxed text-[#3d3a36]">
          <ul className="space-y-1.5 mb-4">
            {productDetailBullets.map((b, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-1 shrink-0">·</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <p className="text-[10px] tracking-[0.1em] text-[#9c9690] uppercase mt-4 pt-4 border-t border-[#f0ede8]">
            SKU. {product.id.toUpperCase()}
          </p>
        </div>
      ),
    },
    {
      id: "shipping",
      label: "SHIPPING & DELIVERY",
      content: (
        <p className="text-[12px] leading-relaxed text-[#3d3a36]">
          Complimentary delivery on all orders above ₹50,000. Standard delivery within 5–7 business days.
          Made-to-order pieces require 8–10 weeks. Returns accepted within 14 days in original condition with tags attached.
        </p>
      ),
    },
    {
      id: "care",
      label: "CARE & GUIDE",
      content: (
        <p className="text-[12px] leading-relaxed text-[#3d3a36]">
          {product.care || "Dry Clean Only. Store in provided garment bag away from direct sunlight and moisture."}
        </p>
      ),
    },
    {
      id: "manufacturer",
      label: "MANUFACTURER'S DETAILS",
      content: (
        <p className="text-[12px] leading-relaxed text-[#3d3a36]">
          Lalit Dalmia — Crafted in India. All garments are ethically handcrafted by our master artisans.
        </p>
      ),
    },
    {
      id: "disclaimer",
      label: "DISCLAIMER",
      content: (
        <p className="text-[12px] leading-relaxed text-[#3d3a36]">
          Product colours may vary slightly due to photographic lighting and monitor settings. All measurements are approximate.
        </p>
      ),
    },
  ];

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

  function handleBuyNow() {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    handleAddToCart();
    window.location.href = "/checkout";
  }

  function handleWhatsApp() {
    const msg = encodeURIComponent(
      `Hi, I'm interested in: ${product.name} (${formattedPrice})${selectedSize ? ` - Size: ${selectedSize}` : ""}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
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
      {/* ── Lightbox ── */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[1000] bg-white flex flex-col items-center justify-center overflow-hidden"
          onClick={() => { setIsLightboxOpen(false); setLightboxScale(1); }}
        >
          <div className="absolute top-0 left-0 right-0 h-20 px-8 flex items-center justify-between z-[1010]">
            <span className={`${playfair.className} text-xs tracking-[0.3em] uppercase`}>{product.name}</span>
            <div className="flex items-center gap-6">
              <button onClick={(e) => { e.stopPropagation(); setLightboxScale(p => p === 1 ? 2 : 1); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                {lightboxScale === 1 ? <ZoomIn size={22} strokeWidth={1} /> : <X size={22} strokeWidth={1} />}
              </button>
              <button onClick={() => { setIsLightboxOpen(false); setLightboxScale(1); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={22} strokeWidth={1} />
              </button>
            </div>
          </div>
          <div
            className="relative w-full h-full flex items-center justify-center transition-all duration-500 ease-out overflow-hidden"
            style={{
              cursor: lightboxScale > 1 ? "zoom-out" : "zoom-in"
            }}
            onClick={(e) => { e.stopPropagation(); setLightboxScale(p => p === 1 ? 2.5 : 1); }}
            onMouseMove={handleLightboxMouseMove}
          >
            <div
              className="relative w-full h-[90vh] max-w-[1200px] transition-transform duration-300 ease-out"
              style={{
                transform: `scale(${lightboxScale})`,
                transformOrigin: `${lightboxPan.x}% ${lightboxPan.y}%`,
              }}
            >
              <OptimizedImage src={images[activeImageIdx]} alt={product.name} fill className="object-contain" priority />
            </div>
          </div>
          <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-8 transition-opacity duration-300 ${lightboxScale > 1 ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
            <button onClick={(e) => { e.stopPropagation(); setActiveImageIdx(p => p > 0 ? p - 1 : images.length - 1); }} className="group flex items-center gap-3 text-[10px] tracking-[0.4em] uppercase">
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" /> Prev
            </button>
            <span className="text-[10px] tracking-[0.4em] uppercase">{activeImageIdx + 1} / {images.length}</span>
            <button onClick={(e) => { e.stopPropagation(); setActiveImageIdx(p => p < images.length - 1 ? p + 1 : 0); }} className="group flex items-center gap-3 text-[10px] tracking-[0.4em] uppercase">
              Next <ArrowLeft size={14} className="rotate-180 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      )}

      {/* Back button */}
      {onBack && (
        <div className="px-4 md:px-14 pt-6">
          <button onClick={onBack} className={`${playfair.className} flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-[#9c9690] hover:text-black transition-colors`}>
            <ArrowLeft size={14} /> Back
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div className="max-w-[2000px] mx-auto px-4 md:px-10 py-12 lg:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-[120px_1fr_680px] gap-8 lg:gap-14 items-start">

          {/* ── Column 1: Thumbnails (100vh, top/bottom blur fade, auto-scroll) ── */}
          <ThumbnailColumn
            images={images}
            activeImageIdx={activeImageIdx}
            onSelect={(idx) => {
              setActiveImageIdx(idx);
              document.getElementById(`product-image-${idx}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          />

          {/* ── Column 2: Image Gallery ── */}
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory lg:snap-none scrollbar-hide gap-6 -mx-4 px-4 lg:mx-0 lg:px-0">
            {images.map((img, idx) => (
              <div
                key={idx}
                id={`product-image-${idx}`}
                className="relative h-[70vh] lg:h-[100vh] w-[85vw] lg:w-full shrink-0 snap-center bg-[#fdfcfb] overflow-hidden group cursor-zoom-in"
                onClick={() => { setActiveImageIdx(idx); setIsLightboxOpen(true); }}
                onMouseEnter={() => setActiveImageIdx(idx)}
              >
                <MagnifiedImage
                  src={img}
                  alt={`${product.name} - View ${idx + 1}`}
                  priority={idx === 0}
                />
                {idx === 0 && (
                  <div className="absolute top-5 left-5 flex flex-col gap-2 z-10 pointer-events-none">
                    {product.new && <span className="bg-black text-white text-[9px] tracking-[0.3em] uppercase px-3 py-1.5">New</span>}
                    {isMadeToOrder && <span className="bg-white/90 border border-black/10 text-black text-[9px] tracking-[0.25em] uppercase px-3 py-1.5">Made to Order</span>}
                    {isSoldOut && <span className="bg-[#e5e0d8] text-[#6b6560] text-[9px] tracking-[0.2em] uppercase px-3 py-1.5">Sold Out</span>}
                  </div>
                )}
                <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                    <ZoomIn size={16} strokeWidth={1.5} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Column 3: Product Info (Right Panel — matches screenshot) ── */}
          <div className="flex flex-col sticky top-[130px]">

            {/* Category */}
            <p className="text-[9px] tracking-[0.45em] uppercase text-[#9c9690] mb-3">
              {product.category}
            </p>

            {/* Name + Wishlist */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className={`${playfair.className} text-xl lg:text-2xl font-normal text-black leading-[1.25] tracking-wide uppercase`}>
                {product.name}
              </h1>
              <button
                onClick={handleWishlist}
                className="shrink-0 mt-0.5"
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart
                  size={20}
                  strokeWidth={1.5}
                  className={`transition-all duration-200 ${wishlisted ? "fill-black stroke-black" : "stroke-black fill-none"}`}
                />
              </button>
            </div>

            {/* Price */}
            <p className={`${playfair.className} text-base font-medium text-black mb-1`}>
              {formattedPrice}
            </p>
            <p className="text-[10px] text-[#6b6560] mb-6 leading-relaxed">
              All Taxes are included in MRP, Shipping and Duties calculated at checkout
            </p>

            {/* ── Size Selector ── */}
            {!isSoldOut && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-black font-medium">SIZE:</p>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="flex items-center gap-1.5 text-[10px] tracking-[0.1em] text-[#3d3a36] hover:text-black transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 3H4a1 1 0 00-1 1v16a1 1 0 001 1h16a1 1 0 001-1v-5M9 3l6 6M9 3v6h6" /></svg>
                    Size Chart
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizesToRender.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setSelectedSize(s); setSizeError(false); }}
                      className={`min-w-[44px] h-[44px] px-3 text-[11px] tracking-widest border transition-all duration-200 ${selectedSize === s
                          ? "border-black bg-black text-white"
                          : "border-[#d0ccc6] text-black hover:border-black"
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {sizeError && (
                  <p className="text-[10px] text-red-600 tracking-wide mt-2 animate-pulse">Please select a size to continue</p>
                )}
              </div>
            )}

            {/* Shipping + Fitting info */}
            <div className="mb-5 space-y-1.5">
              <p className="text-[11px] text-[#3d3a36]">
                <span className="font-medium">Shipping:</span> {product.shippingTime || (isMadeToOrder ? "Made to order : 10 weeks" : "Ready to ship")}
              </p>
              {product.fitting && (
                <p className="text-[11px] text-[#3d3a36]">
                  <span className="font-medium">Fitting ({selectedSize || sizesToRender[0]}):</span>{" "}
                  {(() => {
                    const currentSize = selectedSize || sizesToRender[0];
                    const f = product.fitting[currentSize];
                    if (!f) return "Standard fit";
                    const parts = [];
                    if (f.bust) parts.push(`Bust · ${f.bust}`);
                    if (f.waist) parts.push(`Waist · ${f.waist}`);
                    if (f.hip) parts.push(`Hip · ${f.hip}`);
                    if (f.shoulder) parts.push(`Shoulder · ${f.shoulder}`);
                    return parts.length > 0 ? parts.join(" | ") : "Standard fit";
                  })()}
                </p>
              )}
            </div>

            {/* ── CTA Buttons ── */}
            <div className="flex flex-col gap-2.5 mb-8">
              {isSoldOut ? (
                <button className={`${playfair.className} w-full border border-black text-black text-[10px] tracking-[0.35em] uppercase py-3.5 hover:bg-black hover:text-white transition-all duration-300`}>
                  NOTIFY ME
                </button>
              ) : (
                <>
                  {/* Add to Cart */}
                  <button
                    onClick={handleAddToCart}
                    className={`${playfair.className} w-full border text-[10px] tracking-[0.35em] uppercase py-3.5 transition-all duration-300 ${addedAnim
                        ? "border-[#2a5c2a] bg-[#2a5c2a] text-white"
                        : "border-black text-black hover:bg-black hover:text-white"
                      }`}
                  >
                    {addedAnim ? "ADDED TO CART ✓" : "ADD TO CART"}
                  </button>

                  {/* Buy It Now */}
                  <button
                    onClick={handleBuyNow}
                    className={`${playfair.className} w-full bg-black text-white text-[10px] tracking-[0.35em] uppercase py-3.5 hover:bg-[#1a1a1a] transition-all duration-300`}
                  >
                    BUY IT NOW
                  </button>

                  {/* WhatsApp */}
                  <button
                    onClick={handleWhatsApp}
                    className="w-full bg-[#1a1a1a] text-white text-[10px] tracking-[0.35em] uppercase py-3.5 hover:bg-black transition-all duration-300 flex items-center justify-center gap-2.5"
                  >
                    <WhatsAppIcon size={16} />
                    ORDER VIA WHATSAPP
                  </button>
                </>
              )}
            </div>

            {/* ── Accordions ── */}
            <div className="border-t border-[#e8e4de]">
              {accordions.map((acc) => (
                <div key={acc.id} className="border-b border-[#e8e4de]">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === acc.id ? null : acc.id)}
                    className="w-full flex items-center justify-between py-3.5 text-left"
                  >
                    <span className="text-[9px] tracking-[0.35em] uppercase text-black font-medium">
                      {acc.label}
                    </span>
                    {openAccordion === acc.id
                      ? <Minus size={12} className="text-black shrink-0" />
                      : <Plus size={12} className="text-black shrink-0" />
                    }
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openAccordion === acc.id ? "max-h-[600px] opacity-100 pb-5" : "max-h-0 opacity-0"}`}>
                    {acc.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        category={product.category}
        subcategory={product.subcategory}
        fitting={product.fitting}
      />
    </div>
  );
}