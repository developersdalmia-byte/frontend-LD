import OptimizedImage from "@/components/shared/OptimizedImage";
import Link from "next/link";

export default function IndoWesternSection() {
  return (
    <section className="relative w-full h-screen overflow-hidden">

      {/* 🔥 PREMIUM INDOWESTERN IMAGE */}
      <OptimizedImage
        src="https://api.lalitdalmia.com/uploads/websiteImages/images/indowestern-gowns -20260428T100434Z-3-001/indowestern-gowns/1_2.webp"
        alt="Indo Western Outfit"
        fill
        className="object-cover object-top"
        sizes="100vw"
        quality={80}
      />

      {/* 🔥 FUTURE LOCAL IMAGE */}
      {/*
      <OptimizedImage
        src="https://api.lalitdalmia.com/uploads/websiteImages/images/indowestern-banner.webp"
        alt="Indo Western Collection"
        fill
        className="object-cover"
      />
      */}

      {/* 🔥 FUTURE VIDEO SUPPORT */}
      {/*
      <video
        src="https://api.lalitdalmia.com/uploads/videos/Horizontal Day 1.webm"
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
          Contemporary Fusion
        </p>

        {/* Heading */}
        <h2 className="font-playfair text-2xl sm:text-3xl md:text-5xl mb-6 tracking-wide">
          INDOWESTERN
        </h2>

        {/* CTA */}
        <Link
          href="/category/indo-western"
          className="border border-white px-6 py-2 text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black transition duration-300"
        >
          Explore
        </Link>

        {/* 🔥 FUTURE SUBTEXT */}
        {/*
        <p className="mt-4 text-sm max-w-md">
          A modern blend of Indian heritage and global silhouettes.
        </p>
        */}
      </div>
    </section>
  );
}