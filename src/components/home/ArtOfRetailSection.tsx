import OptimizedImage from "@/components/shared/OptimizedImage";
import Link from "next/link";

export default function ArtOfRetailSection() {
  return (
    <section className="relative w-full h-screen overflow-hidden">

      {/* 🔥 PREMIUM RETAIL IMAGE */}
      <OptimizedImage
        src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1600&auto=format&fit=crop"
        alt="Luxury Retail Store"
        fill
        className="object-cover"
        sizes="100vw"
        quality={75}
      />

      {/* 🔥 FUTURE LOCAL IMAGE (replace anytime) */}
      {/*
      <OptimizedImage
        src="https://api.lalitdalmia.com/uploads/websiteImages/images/retail-banner.webp"
        alt="Retail Experience"
        fill
        className="object-cover"
      />
      */}

      {/* 🔥 FUTURE VIDEO SUPPORT */}
      {/*
      <video
        src="https://api.lalitdalmia.com/uploads/videos/Homepage-Main.webm"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      */}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 md:pb-28 text-center text-white px-4 z-10">
        
        {/* Tagline */}
        <p className="text-xs tracking-[0.3em] mb-3 uppercase">
          Experience
        </p>

        {/* Heading */}
        <h2 className="font-playfair text-2xl sm:text-3xl md:text-5xl mb-6 tracking-wide">
          ART OF RETAIL
        </h2>

        {/* CTA */}
        <Link
          href="/store-locator"
          className="border border-white px-6 py-2 text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black transition duration-300"
        >
          Explore
        </Link>

        {/* 🔥 FUTURE TEXT */}
        {/*
        <p className="mt-4 text-sm max-w-md">
          Step into immersive retail spaces designed with elegance and heritage.
        </p>
        */}
      </div>
    </section>
  );
}