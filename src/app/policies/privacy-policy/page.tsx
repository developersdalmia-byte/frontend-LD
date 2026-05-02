import { Playfair_Display, Inter } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const inter = Inter({
  subsets: ["latin"],
});

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: "01 — COMMITMENT TO PRIVACY",
      content:
        "At LALIT DALMIA, we prioritize the protection of your personal data and maintain high standards of privacy, security, and transparency.",
    },
    {
      title: "02 — SCOPE OF POLICY",
      content:
        "This Policy applies only to our Platform and not to third-party websites. Users should review third-party policies independently.",
    },
    {
      title: "03 — CONSENT",
      content:
        "By using the Platform, you consent to data collection and usage. Consent may be withdrawn by contacting us.",
    },
    {
      title: "04 — INFORMATION WE COLLECT",
      content:
        "We may collect personal details, transaction data, behavioral data, and technical/device information. Some services may require registration.",
    },
    {
      title: "05 — USE OF INFORMATION",
      content:
        "Information is used to provide services, process orders, personalize experience, conduct analytics, and communicate updates.",
    },
    {
      title: "06 — COOKIES & TRACKING",
      content:
        "We use cookies to enhance experience and analyze usage. Disabling cookies may impact functionality.",
    },
    {
      title: "07 — USER COMMUNICATIONS",
      content:
        "Emails, feedback, and support queries may be stored for service improvement and record-keeping.",
    },
    {
      title: "08 — PUBLIC INTERACTIONS",
      content:
        "Information shared publicly (reviews/comments) may be visible to others. Users should exercise discretion.",
    },
    {
      title: "09 — INTERNAL SHARING",
      content:
        "Information may be shared with affiliated entities for operational and business purposes.",
    },
    {
      title: "10 — THIRD-PARTY PROVIDERS",
      content:
        "Trusted third parties may access data only for service delivery and are bound by confidentiality.",
    },
    {
      title: "11 — LEGAL COMPLIANCE",
      content:
        "We may disclose data if required by law or authorities.",
    },
    {
      title: "12 — DATA SECURITY",
      content:
        "We implement strong security measures, but absolute protection cannot be guaranteed.",
    },
    {
      title: "13 — USER RIGHTS",
      content:
        "You may access, update, opt-out, or withdraw consent. This may limit certain services.",
    },
    {
      title: "14 — POLICY UPDATES",
      content:
        "This Policy may be updated. Continued use implies acceptance.",
    },
    {
      title: "15 — GRIEVANCE REDRESSAL",
      content:
        "For concerns, contact: info@lalitdalima.com",
    },
    {
      title: "16 — ACKNOWLEDGEMENT",
      content:
        "By using the Platform, you acknowledge this Policy governs your data usage.",
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
            Privacy Policy
          </h1>
          <div className="w-12 h-[1px] bg-black/10 mx-auto" />
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="pb-32 px-6">
        <div className="max-w-2xl mx-auto space-y-24">
          
          <div className="text-center italic text-gray-500 leading-relaxed text-sm animate-in fade-in duration-1000 delay-300">
            "Your privacy is a cornerstone of our heritage. We are committed to safeguarding the personal information of our global clientele with the utmost discretion and security."
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