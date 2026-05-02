import Link from "next/link";
import OptimizedImage from "@/components/shared/OptimizedImage";

export default function HandloomSarees() {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-neutral-900">
      
      <OptimizedImage
        src="https://api.lalitdalmia.com/uploads/websiteImages/images/handloom-sarees/1LD 28.03.26_ 1961.webp"
        alt="Handloom Sarees"
        fill
        className="object-cover object-top"
        sizes="100vw"
        quality={80}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/0 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 md:pb-28 text-center text-white px-4 z-10">
        
        <p className="text-xs tracking-[0.3em] mb-3 uppercase">
          {/* Artisanal Heritage */}
        </p>

        <h2 className="font-playfair text-2xl sm:text-3xl md:text-5xl mb-6 tracking-wide">
          HANDLOOM SAREES
        </h2>

        <Link
          href="/category/handloom"
          className="border border-white px-6 py-2 text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black transition duration-300"
        >
          Explore
        </Link>
      </div>
    </section>
  );
}
