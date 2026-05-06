"use client";

import React from "react";

export default function CraftPreservationPage() {
  return (
    <div className="min-h-screen bg-white font-playfair selection:bg-black selection:text-white">
      {/* ── 1. Hero Section ── */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src="https://api.lalitdalmia.com/uploads/websiteImages/images/craft-hero-editorial.webp" 
          alt="Hands of an Artisan"
          className="absolute inset-0 w-full h-full object-cover grayscale brightness-75 scale-105 animate-slow-zoom"
        />
        <div className="relative z-20 text-center text-white px-6">
          <p className="text-[10px] md:text-xs tracking-[0.6em] uppercase mb-4 opacity-80">World of Lalit Dalmia</p>
          <h1 className="text-4xl md:text-7xl font-bold tracking-[0.1em] uppercase">
            Craft Preservation
          </h1>
        </div>
      </section>

      {/* ── 2. Brand Identity ── */}
      {/* <div className="py-12 border-b border-gray-100 text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-[0.3em] uppercase mb-4">LALIT DALMIA</h2>
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-[10px] tracking-[0.2em] uppercase text-gray-500">
           <span>Womenswear</span>
           <span>Menswear</span>
           <span>Weddings</span>
           <span>World of Lalit Dalmia</span>
        </div>
      </div> */}

      {/* ── 3. Main Content Section ── */}
      <section className="py-24 px-6 max-w-3xl mx-auto">
        <div className="space-y-16 text-center">
           {/* Paragraph 1 */}
           <div className="space-y-8">
             <p className="text-lg md:text-xl leading-[2] text-gray-700 font-light">
               For Lalit, craft is not a resource—it is a relationship. Across India, he works closely with communities of weavers, embroiderers, dyers, craftsmen, and furniture artisans, whose skills shape both clothing and interiors. Each collaboration is built on continuity, respect, and the belief that tradition must be lived, not just preserved.
             </p>
           </div>

           {/* Paragraph 2 - Region Focus */}
           <div className="space-y-8">
             <p className="text-lg md:text-xl leading-[2] text-gray-700 font-light">
               His work draws from India’s rich textile heritage—handwoven <span className="text-black font-normal">raw silk</span> and <span className="text-black font-normal">matka silk</span>, the timeless <span className="text-black font-normal">Banarasi</span> and <span className="text-black font-normal">tissue</span> from Varanasi, Uttar Pradesh, the precision of <span className="text-black font-normal">Patan patola</span> from Rajkot, Gujarat, and the vibrant <span className="text-black font-normal">bandhej</span> and <span className="text-black font-normal">gharchola</span> of Kutch, Gujarat. From the depth of <span className="text-black font-normal">Kanjivaram</span> in Kanchipuram, Tamil Nadu, to the intricate <span className="text-black font-normal">zardozi</span> of Farrukhabad, Rampur, and Bareilly, Uttar Pradesh—his most cherished hand embroidery—every craft carries its own language.
             </p>
           </div>
        </div>
      </section>

      {/* ── 4. Intermediate Artistic Image ── */}
      <section className="relative h-[80vh] overflow-hidden grayscale">
         <img 
           src="https://api.lalitdalmia.com/uploads/websiteImages/images/craft-workshop-editorial.webp" 
           alt="The Workshop"
           className="w-full h-full object-cover brightness-90"
         />
      </section>

      {/* ── 5. Secondary Content Section ── */}
      <section className="py-24 px-6 max-w-3xl mx-auto">
        <div className="space-y-16 text-center">
           {/* Paragraph 3 - Materials */}
           <div className="space-y-8">
             <p className="text-lg md:text-xl leading-[2] text-gray-700 font-light">
               Beyond textiles, Lalit’s vision extends into material culture—metal artistry from <span className="text-black font-normal">Moradabad</span>, Uttar Pradesh, delicate glasswork from <span className="text-black font-normal">Firozabad</span>, Uttar Pradesh, walnut wood carvings from <span className="text-black font-normal">Srinagar</span>, Kashmir, and handwoven carpets from <span className="text-black font-normal">Jaipur</span>, Rajasthan. These are not just elements of design, but living traditions that find new meaning when placed in contemporary contexts.
             </p>
           </div>

           {/* Paragraph 4 - The Reach */}
           <div className="space-y-8">
             <p className="text-lg md:text-xl leading-[2] text-gray-700 font-light">
               Today, Lalit works with over <span className="text-black font-bold">900 craftspeople</span> across his workshops and has collaborated with more than <span className="text-black font-bold">3,500 artisans</span> across India. His approach is not driven by scale, but by sincerity—creating spaces where craftsmanship is valued, sustained, and allowed to evolve, ensuring that these legacies continue to find relevance in a changing world.
             </p>
           </div>
        </div>
      </section>

      {/* ── 5.5 Final Visual Section ── */}
      <section className="relative h-[80vh] overflow-hidden grayscale">
         <img 
           src="https://api.lalitdalmia.com/uploads/websiteImages/images/craft-final-editorial.webp" 
           alt="The Legacy"
           className="w-full h-full object-cover brightness-90"
         />
      </section>

      {/* ── 6. Final Quote Section ── */}
      <section className="py-32 px-6 bg-white text-center border-t border-gray-100">
        <div className="max-w-3xl mx-auto space-y-12">
          <p className="text-2xl md:text-4xl italic font-light leading-[1.8] text-gray-800">
            “If there is magic left in this world, it lives only in the hands of our artisans—their patience, their skill, their silence. I believe in that magic, and I am here to bring it forward, to let the world witness what has always been ours.”
          </p>
          
          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-[1px] bg-black/20" />
            {/* Replace with actual brand icon if available */}
            {/* <img 
              src="https://api.lalitdalmia.com/uploads/websiteImages/Logo/logo.png" 
              alt="Brand Icon"
              className="h-12 w-auto opacity-80"
            /> */}
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
      `}</style>
    </div>
  );
}
