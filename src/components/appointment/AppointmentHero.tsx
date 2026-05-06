"use client";

import Link from "next/link";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function AppointmentHero() {
  return (
    <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden group">

      {/* Background Image with subtle zoom effect on hover */}
      <div className="absolute inset-0 transition-transform duration-[3s] ease-out group-hover:scale-105">
        <img
          src="/book-an-appointment_result.avif"
          className="w-full h-full object-cover brightness-[0.85]"
          alt="Lalit Dalmia Boutique"
        />
      </div>

      {/* Sophisticated Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col items-center justify-center text-white text-center px-6">

        <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">

          {/* Accent Label */}
          <span className="inline-block text-[10px] tracking-[0.5em] uppercase text-white/70 mb-2">
            The Bespoke Experience
          </span>

          {/* Primary Heading */}
          <h2 className={`${playfair.className} text-4xl md:text-6xl font-normal tracking-[0.1em] leading-tight`}>
            Schedule an Appointment
          </h2>

          {/* Refined Subtext */}
          <p className="max-w-xl mx-auto text-sm md:text-base font-light tracking-wide text-white/80 leading-relaxed">
            Experience the artisanal world of Lalit Dalmia through a personalized session.
            Schedule your visit to our flagship stores or connect with our master couturiers virtually.
          </p>

          {/* Minimalist Premium Button */}
          <div className="pt-6">
            <Link
              href="/book-an-appointment"
              className="inline-block bg-white text-black px-10 py-4 text-[11px] tracking-[0.3em] uppercase font-medium hover:bg-black hover:text-white transition-all duration-500 border border-white"
            >
              Request an Appointment
            </Link>
          </div>

        </div>
      </div>

      {/* Decorative Border */}
      <div className="absolute inset-8 border border-white/10 pointer-events-none" />

    </section>
  );
}