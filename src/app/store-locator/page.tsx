"use client";

import { Playfair_Display, Inter } from "next/font/google";
import { MapPin, Navigation, Clock } from "lucide-react";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const inter = Inter({
  subsets: ["latin"],
});

const STORES = [
  {
    name: "Lalit Dalmia Pitampura Fashion Museum",
    address: "Shop No-4, opposite Metro Pillar No-341, Kohat Enclave, Pitampura, Delhi, 110034",
    phone: "+91 98104 46103",
    hours: "11:00 AM — 08:30 PM",
  },
  {
    name: "Lalit Dalmia Couture Haveli | Adjacent to Qutub Minar",
    address: "F - 25/2, near Masjid, Seth Sarai, Lado Sarai, New Delhi, Delhi 110030",
    phone: "+91 98104 46103",
    hours: "11:00 AM — 08:00 PM",
  },
  {
    name: "Lalit Dalmia Chandni Chowk Sahi Kothi",
    address: "Lalit Dalmia Building, Chandni Chowk Rd, next to Haldiram, Chandni Chowk, Delhi, 110006",
    phone: "+91 98104 46103",
    hours: "11:00 AM — 08:30 PM",
  },
];

export default function StoreLocatorPage() {
  return (
    <div className={`bg-white min-h-screen ${inter.className}`}>
      {/* HEADER SECTION */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] tracking-[0.5em] uppercase text-gray-400 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
            Our Boutiques
          </p>
          <h1 className={`${playfair.className} text-4xl md:text-6xl tracking-tight text-black font-normal mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000`}>
            Store Locator
          </h1>
          <div className="w-12 h-[1px] bg-black/10 mx-auto" />
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="pb-32 px-6">
        <div className="max-w-6xl mx-auto">

          <div className="text-center italic text-gray-500 leading-relaxed text-sm mb-24 max-w-2xl mx-auto animate-in fade-in duration-1000 delay-300">
            "Experience the tactile luxury of our collections at our physical boutiques. Each space is designed to be an immersive journey into the world of Lalit Dalmia."
          </div>

          <div className="pt-4 animate-in fade-in  text-center inline-center  mb-5 slide-in-from-bottom-4 duration-1000 delay-500">
              <h2 className={`${playfair.className} text-3xl md:text-5xl text-black tracking-tight font-normal italic`}>
                Lalit Dalmia Fashion Museum
              </h2>
              <div className="w-24 h-[1px] mx-auto mt-6" />
            </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">

            {/* LEFT: STORE LISTING */}
            <div className="lg:col-span-5 space-y-12">
              {STORES.map((store, idx) => (
                <div
                  key={idx}
                  className="group animate-in fade-in slide-in-from-bottom-4 duration-700"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <h3 className={`${playfair.className} text-2xl text-black mb-4 group-hover:italic transition-all duration-500`}>
                    {store.name}
                  </h3>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500 flex items-start gap-4 leading-relaxed font-light">
                      <MapPin size={16} className="text-gray-300 mt-1 flex-shrink-0" />
                      {store.address}
                    </p>
                    <div className="flex flex-wrap gap-x-8 gap-y-4 pt-2">
                      <p className="text-xs text-gray-400 flex items-center gap-3">
                        <Clock size={14} className="text-gray-200" />
                        {store.hours}
                      </p>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] tracking-[0.2em] uppercase font-bold text-black border-b border-black pb-0.5 hover:text-gray-400 hover:border-gray-200 transition-all flex items-center gap-2"
                      >
                        <Navigation size={12} />
                        Directions
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT: MAP EMBED */}
            <div className="lg:col-span-7 h-[500px] lg:h-auto min-h-[450px] relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-500">
              <div className="absolute inset-0 bg-[#f8f8f8] animate-pulse -z-10" />
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d112076.90299927926!2d77.0875238312492!3d28.61767493070054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1slalit%20dalmia!5e0!3m2!1sen!2sin!4v1777465844590!5m2!1sen!2sin"
                className="w-full h-full border-0 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-1000"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              {/* Premium Frame Decor */}
              <div className="absolute top-0 right-0 w-24 h-24 border-t border-r border-gray-100 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-24 h-24 border-b border-l border-gray-100 pointer-events-none" />
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
