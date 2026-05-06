"use client";

import React from "react";

export default function SocialInitiativePage() {
  return (
    <div className="min-h-screen bg-white font-playfair selection:bg-black selection:text-white">
      {/* ── 1. Hero Section ── */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src="https://api.lalitdalmia.com/uploads/websiteImages/images/social-hero-editorial.webp" 
          alt="Peace and Devotion"
          className="absolute inset-0 w-full h-full object-cover grayscale brightness-75 scale-105 animate-slow-zoom"
        />
        <div className="relative z-20 text-center text-white px-6">
          <p className="text-[10px] md:text-xs tracking-[0.6em] uppercase mb-4 opacity-80">World of Lalit Dalmia</p>
          <h1 className="text-4xl md:text-7xl font-bold tracking-[0.1em] uppercase">
            Social Initiative
          </h1>
        </div>
      </section>

      {/* ── 2. The Spiritual Anchor ── */}
      <section className="py-24 px-6 max-w-3xl mx-auto">
        <div className="space-y-16 text-center">
           <div className="space-y-10">
             <p className="text-lg md:text-xl leading-[2] text-gray-700 font-light">
               Lalit’s journey into purpose found a quiet anchor in his spiritual bond with his father. In Vrindavan, this shared path of reflection and devotion took form as <span className="text-black font-normal">ISCOW</span>—a space shaped not by ambition, but by a deeper calling to serve, nurture, and protect life with humility.
             </p>
           </div>
        </div>
      </section>

      {/* ── 3. The Dual Portraits ── */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 grayscale brightness-95">
           <div className="aspect-[3/4] overflow-hidden">
             <img 
               src="https://api.lalitdalmia.com/uploads/websiteImages/images/social-vignette-1.webp" 
               alt="Vrindavan Seva" 
               className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
             />
           </div>
           <div className="aspect-[3/4] overflow-hidden md:mt-24">
             <img 
               src="https://api.lalitdalmia.com/uploads/websiteImages/images/social-vignette-2.webp" 
               alt="Devotion and Care" 
               className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
             />
           </div>
        </div>
      </section>

      {/* ── 4. The Seva Philosophy ── */}
      <section className="py-24 px-6 max-w-3xl mx-auto border-t border-gray-100">
        <div className="space-y-12 text-center">
           <p className="text-lg md:text-xl leading-[2] text-gray-700 font-light italic">
              Rooted in <span className="text-black font-normal not-italic">seva</span> and <span className="text-black font-normal not-italic">sadbhavna</span>, ISCOW serves as both sanctuary and hospital—rescuing abandoned, injured, and starving cows, often left unseen. Here, they are treated, nourished, and held with care. 
           </p>
           <p className="text-lg md:text-xl leading-[2] text-gray-700 font-light">
              Not a single rupee of profit, nor a drop of milk, is ever taken. And when a life fades, it is met with dignity, through ritualistic last rites and quiet compassion.
           </p>
        </div>
      </section>

      {/* ── 5. Artistic Transition ── */}
      <section className="relative h-[80vh] overflow-hidden grayscale">
         <img 
           src="https://api.lalitdalmia.com/uploads/websiteImages/images/social-mid-visual.webp" 
           alt="Legacy of Compassion"
           className="w-full h-full object-cover brightness-90"
         />
      </section>

      {/* ── 6. The Preservation of Legacy ── */}
      <section className="py-24 px-6 max-w-3xl mx-auto">
        <div className="space-y-12 text-center">
           <span className="text-[10px] tracking-[0.4em] uppercase text-gray-400">Cultural Stewardship</span>
           <p className="text-lg md:text-xl leading-[2] text-gray-700 font-light">
              Beyond this, Lalit has dedicated his life to the preservation of Indian art and craft, working closely with artisans across the country. From <span className="text-black font-normal">zardozi, Banarasi, Patola</span>, and <span className="text-black font-normal">Kanjivaram</span> to pottery, walnut wood furniture, glasswork, and handwoven carpets, his vision extends beyond textiles into the wider realm of interior arts.
           </p>
           <p className="text-lg md:text-xl leading-[2] text-gray-700 font-light">
              By nurturing enduring relationships, creating opportunities, and honouring traditional techniques, he seeks to sustain these cultural legacies—ensuring that the spirit, skill, and stories of Indian craftsmanship continue to live, evolve, and inspire generations to come.
           </p>
        </div>
      </section>

      {/* ── 7. Final Iconic Visual ── */}
      <section className="relative h-[70vh] overflow-hidden grayscale brightness-75">
         <img 
           src="https://api.lalitdalmia.com/uploads/websiteImages/images/social-final-visual.webp" 
           alt="The Endless Story"
           className="w-full h-full object-cover"
         />
      </section>

      {/* ── 8. Conclusion ── */}
      <section className="py-32 px-6 bg-white text-center">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-10">
          <div className="w-12 h-[1px] bg-black/20" />
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slow-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 30s ease-out forwards;
        }
      ` }} />
    </div>
  );
}
