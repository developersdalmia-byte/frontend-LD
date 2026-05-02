import OptimizedImage from "@/components/shared/OptimizedImage";
import Link from "next/link";

export default function RoyalwomenswearSection() {
  return (
    <section className="relative w-full h-[100vh] md:h-[100vh] overflow-hidden">

      {/* Background Image */}
      <OptimizedImage
        src="https://api.lalitdalmia.com/uploads/websiteImages/images/Main-image.webp"
        alt="Royal Womenswear"
        fill
        className="object-cover object-[center_20%] md:object-[center_20%]"
        sizes="100vw"
        quality={80}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 md:pb-24 text-center text-white px-4 z-10">

        <h2 className="font-playfair text-2xl sm:text-3xl md:text-5xl mb-6 tracking-wide">
          Royal Womens wear
        </h2>

        <Link
          href="/category/women"
          className="relative overflow-hidden border border-white px-8 py-3 text-xs tracking-[0.3em] uppercase group"
        >
          <span className="relative z-10 group-hover:text-black transition">
            Explore Now
          </span>

          <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition duration-300"></span>
        </Link>

      </div>
    </section>
  );
}