import Link from "next/link";

export default function WeddingsSection() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      
      {/* 🎥 BACKGROUND VIDEO */}
      {/* 🖼️ BACKGROUND IMAGE (Replaced blocked video) */}
      {/* Desktop Video */}
      <video
        src="https://api.lalitdalmia.com/uploads/videos/Horizontal Day 1.webm"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover hidden md:block"
      />

      {/* Mobile Video */}
      <video
        src="https://api.lalitdalmia.com/uploads/videos/1 Reel.webm"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover md:hidden"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 md:pb-28 text-center text-white px-4 z-10">
        
        <p className="text-xs tracking-[0.3em] mb-3 uppercase">
          Wedding Collection
        </p>

        <h2 className="font-playfair text-2xl sm:text-3xl md:text-5xl mb-6 tracking-wide">
          WEDDINGS
        </h2>

        <Link
          href="/category/weddings"
          className="border border-white px-6 py-2 text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black transition duration-300"
        >
          Explore
        </Link>
      </div>
    </section>
  );
}