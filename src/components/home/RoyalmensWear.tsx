import Link from "next/link";
import OptimizedImage from "@/components/shared/OptimizedImage";

export default function RoyalMenswearSection() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      
      {/* Background Image */}
      <div className="absolute inset-0">
        <OptimizedImage
          src="https://api.lalitdalmia.com/uploads/websiteImages/images/Menswear-20260428T100437Z-3-001/Menswear/mens1.webp"
          alt="Royal Menswear"
          fill
          priority
          className="object-cover object-top"
          sizes="100vw"
          quality={80}
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-[1]" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 md:pb-28 text-center text-white px-4 z-[2]">

        <p className="text-xs tracking-[0.3em] mb-3 uppercase">
          Wedding Collection
        </p>

        <h2 className="font-playfair text-2xl sm:text-3xl md:text-5xl mb-6 tracking-wide">
          Royal Menswear
        </h2>

        <Link
          href="/category/men"
          className="border border-white px-6 py-2 text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black transition duration-300"
        >
          Explore
        </Link>
      </div>
    </section>
  );
}