import { Playfair_Display, Inter } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const inter = Inter({
  subsets: ["latin"],
});

export default function TermsPage() {
  const sections = [
    {
      title: "01 — LEGAL FRAMEWORK",
      content:
        "This document is an electronic record under the Information Technology Act, 2000 and applicable rules. It does not require physical or digital signatures.",
    },
    {
      title: "02 — ELIGIBILITY",
      content:
        "You must be at least 18 years old and legally capable of entering into a binding contract.",
    },
    {
      title: "03 — USER ACCOUNT & RESPONSIBILITIES",
      content:
        "You are responsible for maintaining account confidentiality, all activities under your account, and providing accurate information. Accounts may be suspended for false data.",
    },
    {
      title: "04 — PRODUCTS & SERVICES",
      content:
        "We offer luxury couture products. All items are made-to-order and may have minor variations. Availability may change without notice.",
    },
    {
      title: "05 — PRICING & PAYMENTS",
      content:
        "Prices include applicable Indian taxes. International orders may incur duties. Payments are processed via third-party gateways and we are not liable for failures.",
    },
    {
      title: "06 — ORDER POLICY",
      content:
        "Orders cannot be cancelled, modified, or refunded. Measurements must be submitted within 6 months or orders will be cancelled without refund.",
    },
    {
      title: "07 — SHIPPING & DELIVERY",
      content:
        "Delivery timeline is 8–10 weeks. Timelines are indicative. Free shipping within India; international charges apply.",
    },
    {
      title: "08 — RETURNS & REFUNDS",
      content:
        "Due to the bespoke nature, no returns or refunds are allowed except for manufacturing defects or incorrect delivery reported within 48 hours.",
    },
    {
      title: "09 — INTELLECTUAL PROPERTY",
      content:
        "All designs, images, logos, and text are exclusive property of LALIT DALMIA and protected by law.",
    },
    {
      title: "10 — USER CONDUCT",
      content:
        "You must not violate laws, upload harmful content, infringe rights, or disrupt the platform. Violations may result in termination.",
    },
    {
      title: "11 — PRIVACY",
      content:
        "Your use of the Platform is governed by our Privacy Policy.",
    },
    {
      title: "12 — ELECTRONIC COMMUNICATION",
      content:
        "You consent to receive communications via email, SMS, or platform notifications.",
    },
    {
      title: "13 — LIMITATION OF LIABILITY",
      content:
        "Services are provided 'as-is'. We are not liable for indirect damages, loss of data, delays, or technical failures.",
    },
    {
      title: "14 — INDEMNITY",
      content:
        "You agree to indemnify LALIT DALMIA against claims arising from breach of Terms or law violations.",
    },
    {
      title: "15 — FORCE MAJEURE",
      content:
        "We are not liable for delays caused by events beyond control such as disasters, strikes, or system failures.",
    },
    {
      title: "16 — TERMINATION",
      content:
        "We may suspend or terminate access without notice for violations.",
    },
    {
      title: "17 — GOVERNING LAW & JURISDICTION",
      content:
        "These Terms are governed by Indian law. Disputes fall under New Delhi jurisdiction.",
    },
    {
      title: "18 — GRIEVANCE REDRESSAL",
      content:
        "For concerns, contact: info@lalitdalima.com. We aim to respond within 30 days.",
    },
    {
      title: "19 — POLICY UPDATES",
      content:
        "We may modify these Terms anytime. Continued use means acceptance.",
    },
  ];

  return (
    <div className={`bg-white min-h-screen ${inter.className}`}>
      {/* HEADER SECTION */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] tracking-[0.5em] uppercase text-gray-400 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
            Legal Framework
          </p>
          <h1 className={`${playfair.className} text-4xl md:text-6xl tracking-tight text-black font-normal mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000`}>
            Terms & Conditions
          </h1>
          <div className="w-12 h-[1px] bg-black/10 mx-auto" />
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="pb-32 px-6">
        <div className="max-w-2xl mx-auto space-y-24">
          
          <div className="text-center italic text-gray-500 leading-relaxed text-sm animate-in fade-in duration-1000 delay-300">
            "By engaging with the House of Lalit Dalmia, you enter into a covenant of mutual respect and legal clarity. These terms define our commitment to excellence and your responsibilities as a valued client."
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