"use client";

import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export default function CalcuttaLegacySection() {
  return (
    <section className="bg-white py-24 md:py-32 px-6 overflow-hidden relative">
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        
        {/* Ornamental Detail */}
        <div className="mb-12 flex justify-center items-center gap-4">
          <div className="w-8 h-[1px] bg-[#c5a059]/30" />
          <span className="text-[10px] tracking-[0.5em] uppercase text-[#c5a059] font-medium">Urban Poetry</span>
          <div className="w-8 h-[1px] bg-[#c5a059]/30" />
        </div>

        {/* The Poetic Content */}
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <p className={`${playfair.className} text-xl md:text-3xl lg:text-4xl text-black leading-[1.6] md:leading-[1.7] tracking-wide`}>
            "The allure of narrow lanes and jutting balconies, where storied mansions whisper tales of North Calcutta. 
            A city so rich in its nonchalance, suspended between the clamour of grandeur and the grace of decay. 
            There is something spiritual in this neglect of luxury , a casual existence of glamour that makes Calcutta truly unforgettable."
          </p>
          
          <div className="pt-8">
            <p className="text-[10px] tracking-[0.4em] uppercase text-gray-400 font-light">
              Reflections from the House of Lalit Dalmia
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
