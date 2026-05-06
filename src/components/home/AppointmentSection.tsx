"use client";

import { Playfair_Display } from "next/font/google";
import OptimizedImage from "@/components/shared/OptimizedImage";
import Link from "next/link";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export default function AppointmentSection() {
  return (
    <section className="w-full py-24 bg-[#f8f5f2] px-6 md:px-12 border-t border-[#e5e0d8]">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          {/* Image Side */}
          <div className="relative aspect-[4/5] overflow-hidden shadow-2xl">
            <OptimizedImage
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1600&auto=format&fit=crop"
              alt="Luxury Consultation"
              fill
              className="object-cover transition-transform duration-1000 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={75}
            />
          </div>

          {/* Text Side */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-8">
            <div className="space-y-4">
              <p className="text-[10px] tracking-[0.4em] uppercase text-[#9c9690]">
                Private Consultation
              </p>
              <h2 className={`${playfair.className} text-4xl md:text-6xl font-normal text-black leading-tight`}>
                Schedule your <br />
                <span className="italic">Lalit Dalmia</span> Experience
              </h2>
            </div>

            <p className="text-[#6b6560] text-sm md:text-base leading-relaxed max-w-md">
              Whether you are looking for bridal couture, a bespoke sherwani, or an exclusive personal styling session, our master designers are here to guide you through a journey of artisanal excellence.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto pt-4">
              <Link
                href="/book-an-appointment"
                className="bg-black text-white px-10 py-4 text-[11px] tracking-[0.3em] uppercase hover:bg-[#333] transition-colors duration-300 text-center"
              >
                Book An Appointment
              </Link>
              <Link
                href="/store-locator"
                className="border border-black text-black px-10 py-4 text-[11px] tracking-[0.3em] uppercase hover:bg-black hover:text-white transition-colors duration-300 text-center"
              >
                Visit Our Stores
              </Link>
            </div>

            <div className="pt-8 border-t border-[#e5e0d8] w-full">
              <div className="flex flex-col sm:flex-row justify-between gap-6">
                <div>
                  <h4 className="text-[10px] tracking-[0.2em] uppercase text-[#9c9690] mb-2">Call Us</h4>
                  <p className={`${playfair.className} text-lg text-black`}>+91 99999 00000</p>
                </div>
                <div>
                  <h4 className="text-[10px] tracking-[0.2em] uppercase text-[#9c9690] mb-2">Email</h4>
                  <p className={`${playfair.className} text-lg text-black`}>concierge@lalitdalmia.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
