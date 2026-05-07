"use client";

import { useState } from "react";
import { Playfair_Display, Inter } from "next/font/google";
import { ChevronDown, ChevronUp, Mail, Phone, MapPin } from "lucide-react";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const inter = Inter({
  subsets: ["latin"],
});

export default function ContactPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const enquiries = [
    {
      title: "Customer Enquiries",
      content: "For all customer related queries regarding orders, sizing, or styling advice, please contact our dedicated concierge team.",
      email: "support@lalitdalmia.com",
    },
    {
      title: "Press & Media",
      content: "For press related enquiries, collection lookbooks, or media collaborations, please contact our PR department.",
      email: "press@lalitdalmia.com",
    },
    {
      title: "Career Enquiries",
      content: "Join the house of excellence. For all career related enquiries or to submit your portfolio, please reach out to our HR team.",
      email: "careers@lalitdalmia.com",
    }
  ];

  return (
    <div className={`bg-white min-h-screen ${inter.className}`}>
      {/* HEADER SECTION */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] tracking-[0.5em] uppercase text-gray-400 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
            Digital Concierge
          </p>
          <h1 className={`${playfair.className} text-4xl md:text-6xl tracking-tight text-black font-normal mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000`}>
            Contact Us
          </h1>
          <div className="w-12 h-[1px] bg-black/10 mx-auto" />
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="pb-32 px-6">
        <div className="max-w-2xl mx-auto space-y-24">
          
          <div className="text-center italic text-gray-500 leading-relaxed text-sm animate-in fade-in duration-1000 delay-300">
            At Lalit Dalmia, every interaction is a reflection of our dedication to craftsmanship. Our concierge team is here to assist you with a personalized experience that transcends the digital space.
          </div>

          <div className="space-y-4">
            {enquiries.map((item, idx) => (
              <div 
                key={idx} 
                className="border-b border-gray-50 group animate-in fade-in slide-in-from-bottom-4 duration-700"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full py-8 flex justify-between items-center text-left"
                >
                  <span className={`${playfair.className} text-xl md:text-2xl text-black font-normal group-hover:italic transition-all duration-500`}>
                    {item.title}
                  </span>
                  {openIndex === idx ? (
                    <ChevronUp size={20} strokeWidth={1} className="text-black" />
                  ) : (
                    <ChevronDown size={20} strokeWidth={1} className="text-gray-300 group-hover:text-black transition-colors" />
                  )}
                </button>

                <div className={`overflow-hidden transition-all duration-700 ease-in-out ${openIndex === idx ? 'max-h-64 opacity-100 mb-8' : 'max-h-0 opacity-0'}`}>
                  <p className="text-sm text-gray-700 leading-relaxed mb-6 font-light">
                    {item.content}
                  </p>
                  <a 
                    href={`mailto:${item.email}`}
                    className="inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase font-bold text-black border-b border-black pb-1 hover:text-gray-400 hover:border-gray-200 transition-all"
                  >
                    <Mail size={12} />
                    {item.email}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* QUICK LINKS SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-20">
             <div className="space-y-6 text-center md:text-left">
                <h4 className={`${playfair.className} text-xs tracking-[0.3em] font-bold text-black uppercase`}>Direct Assistance</h4>
                <div className="space-y-4">
                   <p className="flex items-center justify-center md:justify-start gap-4 text-sm text-gray-600">
                     <Phone size={14} className="text-gray-300" />
                     +91 98104 46103
                   </p>
                   <p className="flex items-center justify-center md:justify-start gap-4 text-sm text-gray-600">
                     <MapPin size={14} className="text-gray-300" />
                     Lado Sarai Flagship, New Delhi
                   </p>
                </div>
             </div>
             <div className="space-y-6 text-center md:text-right">
                <h4 className={`${playfair.className} text-xs tracking-[0.3em] font-bold text-black uppercase`}>Bespoke Hours</h4>
                <div className="space-y-4">
                   <p className="text-sm text-gray-600 font-light">Monday — Sunday</p>
                   <p className="text-sm text-gray-600 font-light">11:00 AM — 08:00 PM IST</p>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}