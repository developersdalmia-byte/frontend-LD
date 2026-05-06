"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { NavItem } from "@/types";

type Props = {
  label: string;       
  items: NavItem[];    
  onClose: () => void;
};

export default function MegaMenu({ label, items, onClose }: Props) {
  const router = useRouter();

  return (
    <div
      className="fixed left-0 right-0 z-[200] bg-[#fdfcfb] shadow-2xl border-t border-[#e8e4de]"
      style={{
        top: "130px",
        animation: "megaFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-12 py-16 max-h-[75vh] overflow-y-auto custom-scrollbar flex justify-center">
        {/* ── Text columns ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-16 gap-y-16 w-fit">
          {items.map((category) => (
            <div key={category.label} className="flex flex-col gap-6">
              <h3 className="text-[11px] tracking-[0.25em] uppercase font-semibold text-black mb-2">
                {category.label}
              </h3>
              
              {category.children && category.children.length > 0 && (
                <ul className="flex flex-col gap-3">
                  {category.children.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        onMouseEnter={() => router.prefetch(item.href)}
                        className="text-[13px] tracking-[0.05em] text-[#6b6560] hover:text-black transition-colors duration-200 block"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes megaFadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e8e4de;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #c9b99a;
        }
      `}</style>
    </div>
  );
}