import { Playfair_Display, Inter } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const inter = Inter({
  subsets: ["latin"],
});

export default function ShippingPolicyPage() {
  const sections = [
    {
      title: "01 — SHIPPING WITHIN INDIA",
      content:
        "All orders within India are shipped free of charge. The estimated delivery timeline is 8 to 10 weeks (56 to 70 working days). As all products are made-to-order, production timelines are included within the delivery period.",
    },
    {
      title: "02 — MADE-TO-ORDER TIMELINE",
      content:
        "Each product is crafted specifically upon order confirmation. The standard production timeline is up to 10 weeks. Delivery timelines are indicative and may vary depending on customization requirements.",
    },
    {
      title: "03 — INTERNATIONAL SHIPPING",
      content:
        "International shipping charges are calculated at checkout. Orders are shipped on a DDU (Delivery Duty Unpaid) basis. This means product prices do not include import duties or taxes, which are the responsibility of the recipient.",
    },
    {
      title: "04 — TAXES & PRICING",
      content:
        "All prices displayed for Indian customers are inclusive of applicable taxes (MRP). International orders may attract additional charges as per destination country regulations.",
    },
    {
      title: "05 — DELIVERY DISCLAIMER",
      content:
        "While we aim to adhere to committed timelines, delays may occur due to customization complexity, logistics constraints, or external factors beyond our control. LALIT DALMIA shall not be liable for delays caused by such circumstances.",
    },
  ];

  return (
    <div className={`bg-white min-h-screen ${inter.className}`}>
      {/* HEADER SECTION */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] tracking-[0.5em] uppercase text-gray-400 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
            Client Services
          </p>
          <h1 className={`${playfair.className} text-4xl md:text-6xl tracking-tight text-black font-normal mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000`}>
            Shipping & Delivery
          </h1>
          <div className="w-12 h-[1px] bg-black/10 mx-auto" />
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="pb-32 px-6">
        <div className="max-w-2xl mx-auto space-y-24">
          
          <div className="text-center italic text-gray-500 leading-relaxed text-sm animate-in fade-in duration-1000 delay-300">
            "We bridge the distance between our atelier and your doorstep with a commitment to excellence. Every shipment is handled with the precision and care befitting a Lalit Dalmia creation."
          </div>

          <div className="space-y-16">
            {sections.map((section, idx) => (
              <div 
                key={idx} 
                className="group animate-in fade-in slide-in-from-bottom-4 duration-700"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <h3 className={`${playfair.className} text-xs tracking-[0.3em] font-bold text-black mb-6 uppercase border-b border-gray-50 pb-4 inline-block w-full`}>
                  {section.title}
                </h3>
                <p className="text-[15px] leading-[1.8] text-gray-600 font-light">
                  {section.content}
                </p>
              </div>
            ))}
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