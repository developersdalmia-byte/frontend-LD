"use client";

import React from "react";

export default function ArtOfRetailPage() {
  return (
    <div className="min-h-screen bg-white font-playfair selection:bg-black selection:text-white">
      {/* ── 1. Hero Section ── */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img
          src="https://api.lalitdalmia.com/uploads/websiteImages/images/retail-hero-editorial.webp"
          alt="The Entrance to Heritage"
          className="absolute inset-0 w-full h-full object-cover brightness-75 scale-105 animate-slow-zoom"
        />
        <div className="relative z-20 text-center text-white px-6">
          <p className="text-[10px] md:text-xs tracking-[0.6em] uppercase mb-4 opacity-80">World of Lalit Dalmia</p>
          <h1 className="text-4xl md:text-7xl font-bold tracking-[0.15em] uppercase">
            Art of Retail
          </h1>
        </div>
      </section>

      {/* ── 2. The Journey Begins ── */}
      <section className="py-24 px-6 max-w-3xl mx-auto text-center">
        <div className="space-y-12">
          <p className="text-lg md:text-xl leading-[2] text-gray-700 font-light">
            For Lalit, retail began long before a store existed. It began in journeys—across towns, villages, and forgotten lanes—where he found himself drawn to the quiet beauty of handcrafted objects. He collected not as a curator, but as a listener. Each piece he brought back carried a story, a hand, a moment in time. Over the years, these journeys shaped not just a collection, but a way of seeing—where craft became memory, and memory became space.
          </p>
        </div>
      </section>

      {/* ── 3. Dual Vignettes (Para 2 & 3 Context) ── */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 grayscale brightness-90">
          <div className="aspect-[3/4] overflow-hidden">
            <img
              src="https://api.lalitdalmia.com/uploads/websiteImages/images/retail-tea-editorial.webp"
              alt="The Ritual of Tea"
              className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
            />
          </div>
          <div className="aspect-[3/4] overflow-hidden md:mt-24">
            <img
              src="https://api.lalitdalmia.com/uploads/websiteImages/images/retail-interior-vignette.webp"
              alt="Artifacts of Memory"
              className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* ── 4. The Atmosphere (Para 2 & 3) ── */}
      <section className="py-24 px-6 max-w-3xl mx-auto border-t border-gray-100">
        <div className="space-y-16 text-center">
          <div className="space-y-8">
            <p className="text-lg md:text-xl leading-[2] text-gray-700 font-light">
              “Welcome to Lalit Dalmia Couture Haveli.” The greeting is gentle, almost personal. Our hosts—men, women, and members of the third gender community—stand with quiet confidence. Dressed in black bandhgala jackets, they carry a sense of discipline softened by warmth. There is no performance here, only presence—an ease that makes you feel expected, not received.
            </p>
          </div>
          <div className="space-y-8">
            <p className="text-lg md:text-xl leading-[2] text-gray-700 font-light italic">
              The air moves softly with notes of <span className="not-italic font-normal">Floris White Rose, Mancera Oud</span>, and <span className="not-italic font-normal">sandalwood</span>. In the background, sitar and veena blend with old Bollywood classics. We serve the finest teas from Karnataka and Assam, poured with care, never rushed. Our hospitality is instinctive, rooted in a simple belief—<span className="not-italic font-normal">Atithi Devo Bhava</span>—where every guest is treated with quiet reverence.
            </p>
          </div>
        </div>
      </section>

      {/* ── 5. Full-Width Archive Visual (Para 4) ── */}
      <section className="relative h-[80vh] overflow-hidden">
        <img
          src="https://api.lalitdalmia.com/uploads/websiteImages/images/retail-archive-full.webp"
          alt="Living Archives"
          className="w-full h-full object-cover brightness-75"
        />
      </section>

      {/* ── 6. The Living Archives (Para 4 & 5) ── */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="space-y-16 text-center">
          <div className="space-y-8">
            <p className="text-lg md:text-xl leading-[2] text-gray-700 font-light">
              My stores are living archives of Indian craftsmanship. As I travelled across the country in search of art, I gathered pieces that spoke to me—objects shaped by time, patience, and devotion. What you see here is not display, but presence. Many of these works carry a rarity that belongs as much to memory as it does to museums.
            </p>
          </div>

          <div className="space-y-8">
            <p className="text-lg md:text-xl leading-[2] text-gray-700 font-light">
              Each store is a seamless blend of my design language and the stillness of a heritage space. You walk through not just a store, but a passage of Indian artistry—<span className="text-black font-normal">Kangra miniatures</span> from Himachal Pradesh, <span className="text-black font-normal">Tanjore</span> and <span className="text-black font-normal">Pichhwai</span> paintings, glimpses of <span className="text-black font-normal">Madhubani</span> from Bihar, and the intricate storytelling of <span className="text-black font-normal">Pattachitra</span> from Odisha.
            </p>
          </div>
        </div>
      </section>

      {/* ── 7. Automatic Scrolling Gallery (The Collection) ── */}
      <section className="pb-24 overflow-hidden">
        <div className="flex animate-marquee gap-4">
          {[
            "https://api.lalitdalmia.com/uploads/websiteImages/images/retail-detail-1.webp",
            "https://api.lalitdalmia.com/uploads/websiteImages/images/retail-detail-2.webp",
            "https://api.lalitdalmia.com/uploads/websiteImages/images/retail-detail-3.webp",
            "https://api.lalitdalmia.com/uploads/websiteImages/images/retail-detail-4.webp",
            "https://api.lalitdalmia.com/uploads/websiteImages/images/retail-detail-5.webp",
            "https://api.lalitdalmia.com/uploads/websiteImages/images/retail-detail-6.webp",
            "https://api.lalitdalmia.com/uploads/websiteImages/images/retail-detail-7.webp",
            "https://api.lalitdalmia.com/uploads/websiteImages/images/retail-detail-8.webp",
            // Repeat for seamless loop
            "https://api.lalitdalmia.com/uploads/websiteImages/images/retail-detail-1.webp",
            "https://api.lalitdalmia.com/uploads/websiteImages/images/retail-detail-2.webp",
            "https://api.lalitdalmia.com/uploads/websiteImages/images/retail-detail-3.webp",
            "https://api.lalitdalmia.com/uploads/websiteImages/images/retail-detail-4.webp",
          ].map((img, idx) => (
            <div key={idx} className="flex-none w-[250px] md:w-[350px] aspect-[2/3] overflow-hidden bg-neutral-100">
              <img
                src={img}
                className="w-full h-full object-cover grayscale transition-all duration-1000 hover:grayscale-0"
                alt={`Archive item ${idx}`}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── 8. Material Culture (Para 5 & 6) ── */}
      <section className="py-24 px-6 max-w-3xl mx-auto border-t border-gray-100">
        <div className="space-y-12 text-center">
          <p className="text-lg md:text-xl leading-[2] text-gray-700 font-light">
            Walnut wood furniture from Kashmir, chandeliers from Firozabad touched with gold, pure gold and silver zari brocades as wall panels, handwoven carpets from Jaipur and Agra, and large brass vases adorned with handmade Sawari art.
          </p>
          <p className="text-lg md:text-xl leading-[2] text-gray-700 font-light italic">
            Handcarved cabinets from Saharanpur hold smaller worlds within them—pottery from Jaipur, handcrafted plates, antique perfume bottles, and brass artifacts. Nothing feels placed for effect. Everything exists as it is—collected, remembered, and allowed to belong.
          </p>
        </div>
      </section>

      {/* ── 9. Final Immersive Interior ── */}
      <section className="relative h-[80vh] overflow-hidden">
        <img
          src="https://api.lalitdalmia.com/uploads/websiteImages/images/retail-final-editorial.webp"
          alt="The Couture Haveli Interior"
          className="w-full h-full object-cover brightness-90"
        />
      </section>

      {/* ── 10. The Ritual Finale (Para 7) ── */}
      <section className="py-32 px-6 bg-white text-center">
        <div className="max-w-3xl mx-auto space-y-12">
          <p className="text-2xl md:text-4xl italic font-light leading-[1.8] text-gray-800">
            “My love for the handmade does not end with craft or clothing. It extends into the smallest gestures of hospitality. We serve our own masala tea, prepared with a careful balance of elaichi, adrak, and laung—brewed slowly, just as it should be.”
          </p>

          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-[1px] bg-black/20" />
            <p className="text-[10px] tracking-[0.5em] uppercase font-bold text-black">A home that always has a place for you</p>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes slow-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 30s ease-out forwards;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
