"use client";

import { X } from "lucide-react";
import { Playfair_Display } from "next/font/google";
import { useEffect } from "react";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
  subcategory?: string;
}

export default function SizeGuideModal({ isOpen, onClose, category, subcategory }: SizeGuideModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isMenswear = category?.toLowerCase() === "menswear";
  
  // Default Womenswear size guide
  const womensData = [
    { size: "XS", bust: "32", waist: "26", hip: "36" },
    { size: "S", bust: "34", waist: "28", hip: "38" },
    { size: "M", bust: "36", waist: "30", hip: "40" },
    { size: "L", bust: "38", waist: "32", hip: "42" },
    { size: "XL", bust: "40", waist: "34", hip: "44" },
    { size: "XXL", bust: "42", waist: "36", hip: "46" },
  ];

  // Menswear size guide
  const mensData = [
    { size: "XS", chest: "36", waist: "30", shoulder: "17" },
    { size: "S", chest: "38", waist: "32", shoulder: "17.5" },
    { size: "M", chest: "40", waist: "34", shoulder: "18" },
    { size: "L", chest: "42", waist: "36", shoulder: "18.5" },
    { size: "XL", chest: "44", waist: "38", shoulder: "19" },
    { size: "XXL", chest: "46", waist: "40", shoulder: "19.5" },
  ];

  const tableData = isMenswear ? mensData : womensData;
  const isLehenga = subcategory?.toLowerCase().includes("lehenga");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#e8e4de]">
          <div>
            <h2 className={`${playfair.className} text-xl md:text-2xl text-black`}>Size Guide</h2>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#9c9690] mt-1">
              {isMenswear ? "Menswear" : "Womenswear"} {subcategory ? `— ${subcategory}` : ""}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-[#f7f5f2] rounded-full transition-colors"
          >
            <X size={20} className="text-black" />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="p-6 overflow-y-auto">
          <p className="text-[13px] text-[#6b6560] leading-relaxed mb-6">
            All measurements are in inches. Please use this chart as a general guide. 
            {isLehenga && " For Lehengas, the waist measurement is taken at the narrowest part of the torso."}
            {!isMenswear && !isLehenga && " If you are between sizes, we recommend sizing up for a comfortable fit."}
            {isMenswear && " For Sherwanis and Kurta sets, ensure you check the shoulder measurement for a sharp, tailored fit."}
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f7f5f2]">
                  <th className="py-4 px-4 text-[10px] tracking-[0.2em] uppercase text-black font-medium border-b border-[#e8e4de]">Size</th>
                  {isMenswear ? (
                    <>
                      <th className="py-4 px-4 text-[10px] tracking-[0.2em] uppercase text-[#6b6560] font-normal border-b border-[#e8e4de]">Chest (in)</th>
                      <th className="py-4 px-4 text-[10px] tracking-[0.2em] uppercase text-[#6b6560] font-normal border-b border-[#e8e4de]">Waist (in)</th>
                      <th className="py-4 px-4 text-[10px] tracking-[0.2em] uppercase text-[#6b6560] font-normal border-b border-[#e8e4de]">Shoulder (in)</th>
                    </>
                  ) : (
                    <>
                      <th className="py-4 px-4 text-[10px] tracking-[0.2em] uppercase text-[#6b6560] font-normal border-b border-[#e8e4de]">Bust (in)</th>
                      <th className="py-4 px-4 text-[10px] tracking-[0.2em] uppercase text-[#6b6560] font-normal border-b border-[#e8e4de]">Waist (in)</th>
                      <th className="py-4 px-4 text-[10px] tracking-[0.2em] uppercase text-[#6b6560] font-normal border-b border-[#e8e4de]">Hip (in)</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row: any, idx) => (
                  <tr key={idx} className="hover:bg-[#faf8f5] transition-colors">
                    <td className="py-4 px-4 text-[12px] font-medium text-black border-b border-[#e8e4de]">{row.size}</td>
                    {isMenswear ? (
                      <>
                        <td className="py-4 px-4 text-[13px] text-[#6b6560] border-b border-[#e8e4de]">{row.chest}</td>
                        <td className="py-4 px-4 text-[13px] text-[#6b6560] border-b border-[#e8e4de]">{row.waist}</td>
                        <td className="py-4 px-4 text-[13px] text-[#6b6560] border-b border-[#e8e4de]">{row.shoulder}</td>
                      </>
                    ) : (
                      <>
                        <td className="py-4 px-4 text-[13px] text-[#6b6560] border-b border-[#e8e4de]">{row.bust}</td>
                        <td className="py-4 px-4 text-[13px] text-[#6b6560] border-b border-[#e8e4de]">{row.waist}</td>
                        <td className="py-4 px-4 text-[13px] text-[#6b6560] border-b border-[#e8e4de]">{row.hip}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 p-5 bg-[#faf8f5] border border-[#e8e4de] flex flex-col gap-2">
            <h4 className={`${playfair.className} text-[14px] text-black`}>Need Custom Measurements?</h4>
            <p className="text-[12px] text-[#6b6560]">
              We offer bespoke Made-to-Order services. Select &quot;Request Made-to-Order&quot; when adding to cart, or contact our Atelier team for a personalized fitting session.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
