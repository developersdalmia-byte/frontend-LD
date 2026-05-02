"use client";

import Link from "next/link";


export default function HeroVideo() {
  return (
    <section className="relative w-full h-[100vh] overflow-hidden">

      {/* VIDEO */}
      {/* Desktop Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        crossOrigin="anonymous"
        className="absolute inset-0 w-full h-full object-cover hidden md:block"
      >
        <source src="https://api.lalitdalmia.com/uploads/videos/Homepage-Main.webm" type="video/webm" />
      </video>

      {/* Mobile Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        crossOrigin="anonymous"
        className="absolute inset-0 w-full h-full object-cover md:hidden"
      >
        <source src="https://api.lalitdalmia.com/uploads/videos/3 (1).webm" type="video/webm" />
      </video>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/0" />

      {/* CONTENT */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-24 text-white text-center px-4">

        {/* 👇 Only content shifted, NOT section */}
        <div className="mt-[116px] md:mt-[120px] flex flex-col items-center">

          <h1 className="font-playfair text-3xl md:text-5xl mb-6">
            Crafting Timeless Wedding Stories
          </h1>

          <Link
            href="/collections"
            className="relative overflow-hidden border border-white px-8 py-3 text-xs tracking-[0.3em] uppercase group"
          >
            <span className="relative z-10 group-hover:text-black transition">
              Explore Now
            </span>

            <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition duration-300"></span>
          </Link>

        </div>

      </div>
    </section>
  );
}