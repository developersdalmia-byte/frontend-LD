"use client";

import Link from "next/link";

export default function AppointmentHero() {
  return (
    <div className="relative w-full h-[80vh]">
      
      {/* Background Image */}
      <img
        src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&q=80&w=2000" // Luxury Store Placeholder
        className="w-full h-full object-cover"
        alt="Store"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/10 flex flex-col items-center justify-end pb-24 text-white text-center px-4">
        
        {/* Heading */}
        <h1 className="text-xl md:text-3xl tracking-[0.3em] uppercase mb-3">
          Schedule an Appointment
        </h1>

        {/* Subtext */}
        <p className="max-w-md text-xs md:text-sm mb-5 text-gray-200">
          Click below to schedule a virtual or an in-store appointment at one of our flagship stores.
        </p>

        {/* Button */}
        <Link
          href="/book-an-appointment"
          className="bg-white text-black px-5 py-2 text-xs tracking-[0.25em] uppercase hover:opacity-80 transition"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}