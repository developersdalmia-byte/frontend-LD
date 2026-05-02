"use client";

import Link from "next/link";
import {
  FaInstagram,
  FaFacebookF,
  FaPinterestP,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MapPin, Mail, Phone, Headset } from "lucide-react";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const FOOTER_LINKS = {
  Collections: [
    { label: "Womenswear", href: "/category/women" },
    { label: "Menswear", href: "/category/men" },
    { label: "Weddings", href: "/category/weddings" },
  ],
  "Lalit Dalmia": [
    { label: "History", href: "#" },
    { label: "Social Initiative", href: "#" },
    { label: "Craft Preservation", href: "#" },
    { label: "Art of Retail", href: "#" },
  ],
  "Client Services": [
    { label: "Privacy Policy", href: "/policies/privacy-policy" },
    { label: "Terms & Conditions", href: "/policies/terms-and-conditions" },
    { label: "Refund and Exchange Policy", href: "/policies/refund-policy" },
    { label: "Shipping Policy", href: "/policies/shipping-policy" },
  ],
};

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/lalitdalmiaofficial/", icon: FaInstagram },
  { label: "Facebook", href: "https://www.facebook.com/LalitDalmiaOfficial/", icon: FaFacebookF },
  { label: "Twitter", href: "https://x.com/lalit_dalmia", icon: FaXTwitter },
  { label: "Pinterest", href: "https://in.pinterest.com/lalitdalmiaofficial/", icon: FaPinterestP },
  { label: "YouTube", href: "https://www.youtube.com/c/LalitDalmiaOfficial", icon: FaYoutube },
];

export default function Footer() {
  return (
    <footer className={`relative text-gray-700 ${playfair.className}`}>
      <div className="border-t border-gray-300" />
      <div className="absolute inset-0 -z-10 bg-[#ffff]" />
      <div
        className="absolute inset-0 -z-10 opacity-[0.25] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://www.transparenttextures.com/patterns/paper-fibers.png')",
        }}
      />
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
        {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
          <div key={heading}>
            <h4 className="text-sm text-gray-900 mb-6 uppercase font-medium">
              {heading}
            </h4>
            <ul className="space-y-3 text-[15px] leading-[2]">
              {links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="hover:text-black transition duration-300"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* NEED HELP? */}
        <div>
          <h4 className="text-sm text-gray-900 mb-8 uppercase font-medium tracking-[0.1em]">
            Need Help?
          </h4>

          <div className="space-y-6">
             <Link 
               href="/contact-us" 
               className="flex items-center gap-4 group text-gray-600 hover:text-black transition"
             >
               <div className="w-10 h-10 border border-gray-100 flex items-center justify-center rounded-sm bg-[#faf9f7] group-hover:bg-white group-hover:border-black transition-all">
                  <Headset size={18} strokeWidth={1.5} />
               </div>
               <span className="text-[15px]">Contact Us</span>
             </Link>

             <Link 
               href="/store-locator" 
               className="flex items-center gap-4 group text-gray-600 hover:text-black transition"
             >
               <div className="w-10 h-10 border border-gray-100 flex items-center justify-center rounded-sm bg-[#faf9f7] group-hover:bg-white group-hover:border-black transition-all">
                  <MapPin size={18} strokeWidth={1.5} />
               </div>
               <span className="text-[15px]">Store Locator</span>
             </Link>

             <a 
               href="mailto:info@lalitdalima.com" 
               className="flex items-center gap-4 group text-gray-600 hover:text-black transition"
             >
               <div className="w-10 h-10 border border-gray-100 flex items-center justify-center rounded-sm bg-[#faf9f7] group-hover:bg-white group-hover:border-black transition-all">
                  <Mail size={18} strokeWidth={1.5} />
               </div>
               <span className="text-[15px]">Email Us</span>
             </a>

             <a 
               href="tel:+919810446103" 
               className="flex items-center gap-4 group text-gray-600 hover:text-black transition"
             >
               <div className="w-10 h-10 border border-gray-100 flex items-center justify-center rounded-sm bg-[#faf9f7] group-hover:bg-white group-hover:border-black transition-all">
                  <Phone size={18} strokeWidth={1.5} />
               </div>
               <span className="text-[15px] leading-tight">
                  WhatsApp / Call Us:<br/>
                  <span className="font-semibold text-black">+91 9810446103</span>
               </span>
             </a>
          </div>
        </div>

      </div>
      <div className="bg-white py-10 flex flex-col items-center gap-6">
        <div className="flex gap-4">
          {SOCIALS.map((s) => {
            const Icon = s.icon;
            return (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                className="w-10 h-10 border border-white/20 flex items-center justify-center text-white hover:border-white transition duration-300"
              >
                <Icon size={16} />
              </a>
            );
          })}
        </div>

        {/* COPYRIGHT & CREDITS */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-[12px] tracking-[0.2em] uppercase text-black text-center">
            © {new Date().getFullYear()} Lalit Dalmia. All rights reserved.
          </p>
          <p className="text-[10px] tracking-[0.2em] uppercase text-white font-medium text-center">
            created by Ankit Singh & Lokender Chauhan
          </p>
        </div>
      </div>

    </footer>
  );
}