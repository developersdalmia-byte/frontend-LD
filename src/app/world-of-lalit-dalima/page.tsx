"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const SECTIONS = [
  {
    title: "Our Story",
    subtitle: "A Legacy in the Making",
    description: "Journey through the evolution of Lalit Dalmia, from the heart of Old Delhi to the global stage of luxury couture.",
    image: "https://api.lalitdalmia.com/uploads/websiteImages/images/history-banner.webp",
    href: "/world-of-lalit-dalima/history",
    label: "Explore Timeline"
  },
  {
    title: "Social Initiative",
    subtitle: "The ISCOW Foundation",
    description: "Dedicated to the welfare of cows in Vrindavan, reflecting our commitment to compassion and spiritual heritage.",
    image: "https://api.lalitdalmia.com/uploads/websiteImages/images/social-banner.webp",
    href: "/world-of-lalit-dalima/social-initiative",
    label: "Our Commitment"
  },
  {
    title: "Craft Preservation",
    subtitle: "The Art of Hand-Embroidery",
    description: "Preserving the rare techniques of Indian craftsmanship through our dedicated ateliers and master artisans.",
    image: "https://api.lalitdalmia.com/uploads/websiteImages/images/craft-banner.webp",
    href: "/world-of-lalit-dalima/craft-preservation",
    label: "Discover the Craft"
  },
  {
    title: "Art of Retail",
    subtitle: "Immersive Experiences",
    description: "Step into our Couture Haveli and fashion museums where heritage meets modern luxury in every detail.",
    image: "https://api.lalitdalmia.com/uploads/websiteImages/images/retail-banner.webp",
    href: "/world-of-lalit-dalima/art-of-retail",
    label: "Visit Our Spaces"
  }
];

export default function WorldOfLalitDalimaPage() {
  return (
    <div className="min-h-screen bg-white font-playfair">
      {/* ── Hero Section ── */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10" />
        <img 
          src="https://api.lalitdalmia.com/uploads/websiteImages/images/world-hero.webp" 
          alt="World of Lalit Dalmia"
          className="absolute inset-0 w-full h-full object-cover scale-105 animate-slow-zoom"
        />
        <div className="relative z-20 text-center text-white px-6">
          <p className="text-xs md:text-sm tracking-[0.5em] uppercase mb-6 opacity-80 animate-fade-in-up">The Universe of</p>
          <h1 className="text-5xl md:text-8xl font-bold tracking-[0.1em] uppercase mb-8 animate-fade-in-up delay-200">
            Lalit Dalmia
          </h1>
          <div className="w-24 h-[1px] bg-white/50 mx-auto animate-scale-x delay-400" />
        </div>
      </section>

      {/* ── Introduction ── */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-light mb-10 italic">
          "Fashion is not just what you wear; it is the legacy you leave behind."
        </h2>
        <p className="text-gray-600 leading-relaxed text-lg md:text-xl font-light">
          Beyond couture, the World of Lalit Dalmia is a commitment to heritage, a devotion to craftsmanship, 
          and a journey of spiritual compassion. Explore the four pillars that define our house.
        </p>
      </section>

      {/* ── Pillars Grid ── */}
      <section className="pb-32 px-4 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SECTIONS.map((section, idx) => (
            <Link 
              key={idx} 
              href={section.href}
              className="group relative h-[600px] overflow-hidden flex flex-col justify-end p-8 md:p-12"
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-700 z-10" />
              <img 
                src={section.image} 
                alt={section.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              
              <div className="relative z-20 text-white transform transition-transform duration-500 group-hover:-translate-y-4">
                <span className="text-[10px] tracking-[0.3em] uppercase opacity-70 block mb-2">
                  {section.subtitle}
                </span>
                <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-widest mb-4">
                  {section.title}
                </h3>
                <p className="text-sm md:text-base opacity-0 group-hover:opacity-100 transition-opacity duration-500 max-w-sm font-light leading-relaxed mb-8">
                  {section.description}
                </p>
                <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase border-b border-white/30 pb-2 w-fit">
                  {section.label}
                  <ChevronRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <style jsx global>{`
        @keyframes slow-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s ease-out forwards;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
        .delay-200 { animation-delay: 0.2s; }
        .delay-400 { animation-delay: 0.4s; }
        @keyframes scale-x {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        .animate-scale-x {
          animation: scale-x 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
