import { Playfair_Display, Inter } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const inter = Inter({
  subsets: ["latin"],
});

export default function RefundPolicyPage() {
  return (
    <div className={`bg-white min-h-screen ${inter.className}`}>
      {/* HEADER SECTION */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] tracking-[0.5em] uppercase text-gray-400 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
            Client Services
          </p>
          <h1 className={`${playfair.className} text-4xl md:text-6xl tracking-tight text-black font-normal mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000`}>
            Refund & Exchange Policy
          </h1>
          <div className="w-12 h-[1px] bg-black/10 mx-auto" />
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="pb-32 px-6">
        <div className="max-w-2xl mx-auto space-y-24">
          
          <div className="text-center italic text-gray-500 leading-relaxed text-sm animate-in fade-in duration-1000 delay-300">
            "Every Lalit Dalmia creation is a unique masterpiece, meticulously handcrafted for the individual. Our policies reflect the bespoke nature of these rare works of art."
          </div>

          <div className="space-y-12 text-[15px] leading-[1.8] text-gray-600 font-light animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
            <p>
              Each creation at <span className="font-semibold tracking-wide text-black">LALIT DALMIA</span> is individually crafted to order, tailored to the client’s specific preferences, measurements, and selected design details. These are bespoke, high-value garments that reflect precision craftsmanship and cannot be resold or repurposed.
            </p>

            <p>
              Accordingly, all purchases are governed by a strict <span className="font-semibold text-black italic">No Refund, No Exchange</span> policy. This policy applies across all categories, including bespoke, customized, and discounted items.
            </p>

            <div className="py-10 border-y border-gray-50 my-10 flex flex-col items-center gap-6">
               <div className="w-1 h-1 rounded-full bg-black/20" />
               <p className="text-center italic text-black/40 text-sm">
                 Please review all measurements and specifications carefully prior to confirmation.
               </p>
               <div className="w-1 h-1 rounded-full bg-black/20" />
            </div>

            <p>
              All required measurements and order-related inputs must be provided within six (6) months from the date of order confirmation. Failure to do so will result in automatic order cancellation without eligibility for refund.
            </p>

            <p>
              Each product undergoes detailed quality checks prior to dispatch. In the rare instance of a verified manufacturing defect or incorrect product delivery, <span className="font-semibold tracking-wide text-black">LALIT DALMIA</span> reserves the sole right to assess the issue and determine an appropriate resolution.
            </p>

            <div className="bg-[#faf9f7] p-12 text-center rounded-sm">
              <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 mb-4">Grievance Support</p>
              <p className="text-sm italic text-gray-600 mb-6">
                Any concerns must be reported within 48 hours of delivery.
              </p>
              <a 
                href="mailto:info@lalitdalima.com" 
                className={`${playfair.className} text-lg text-black border-b border-black/10 hover:border-black transition-all`}
              >
                info@lalitdalima.com
              </a>
            </div>

            <p className="text-center text-xs text-gray-400 mt-10 italic">
              Requests received beyond the 48-hour window may not be eligible for review.
            </p>
          </div>

          {/* FINAL NOTE */}
          <div className="pt-20 border-t border-gray-50 text-center">
             <p className="text-[10px] tracking-[0.4em] uppercase text-gray-300 mb-8">
               © LALIT DALMIA. All rights reserved.
             </p>
             <div className="flex justify-center gap-8">
               <div className="w-1.5 h-1.5 rounded-full bg-gray-100" />
               <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
               <div className="w-1.5 h-1.5 rounded-full bg-gray-100" />
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}