"use client";

import Link from "next/link";
import OptimizedImage from "@/components/shared/OptimizedImage";

type Props = {
  title: string;
  image: string;
  link: string;
};

export default function CategoryCard({ title, image, link }: Props) {
  return (
    <Link href={link} className="block group">
      <div className="relative overflow-hidden rounded-2xl">
        
        {/* Image */}
        <div className="relative w-full h-[400px]">
          <OptimizedImage
            src={image}
            alt={title}
            fill
            className="object-cover transition duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={75}
          />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />

        {/* Content */}
        <div className="absolute bottom-6 left-6 right-6">
          <h2 className="text-white text-2xl md:text-3xl font-serif tracking-wide mb-3">
            {title}
          </h2>

          <span className="inline-block bg-white text-black px-5 py-2 text-sm font-medium transition group-hover:bg-black group-hover:text-white">
            Explore Now
          </span>
        </div>

      </div>
    </Link>
  );
}