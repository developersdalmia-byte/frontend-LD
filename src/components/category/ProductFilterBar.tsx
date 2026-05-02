"use client";

import { useState, useEffect } from "react";
import { ChevronDown, SlidersHorizontal, X, Grid2X2, LayoutGrid } from "lucide-react";
import { getOccasions, Occasion } from "@/services/master-data.service";
import { getCategories, Category } from "@/services/category.service";
import { Playfair_Display } from "next/font/google";
import Link from "next/link";
import { useNavbarScroll } from "../layout/navbar/useNavbarScroll";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

interface FilterState {
  occasion?: string;
  subcategory?: string;
  sort?: "price_asc" | "price_desc" | "newest";
  color?: string;
  size?: string;
  readyToShip?: boolean;
}

interface Props {
  currentMainCategory?: string; // e.g. 'mens-wear'
  onFilterChange: (filters: FilterState) => void;
  totalProducts: number;
  initialFilters?: FilterState;
  currentGridLayout?: 2 | 4;
  onGridLayoutChange?: (layout: 2 | 4) => void;
}

export default function ProductFilterBar({ 
  currentMainCategory, 
  onFilterChange, 
  totalProducts,
  initialFilters,
  currentGridLayout = 4,
  onGridLayoutChange
}: Props) {
  const { showNav } = useNavbarScroll();
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<FilterState>(initialFilters || {});
  
  // Sync state with URL changes (for Mega Menu navigation)
  useEffect(() => {
    setFilters(initialFilters || {});
  }, [initialFilters]);

  // Mobile filter drawer state
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    async function loadFilterData() {
      try {
        const [occData, catData] = await Promise.all([
          getOccasions(),
          getCategories()
        ]);
        setOccasions(occData.filter(o => o.isActive));
        setCategories(catData);
      } catch (err) {
        console.error("Failed to load filter data", err);
      }
    }
    loadFilterData();
  }, []);

  const handleFilterSelect = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters };
    if (newFilters[key] === value) {
      delete newFilters[key]; // Toggle off
    } else {
      newFilters[key] = value;
    }
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
    setMobileFiltersOpen(false);
  };

  // Find subcategories for the current main category
  const currentCategoryData = categories.find(c => c.slug === currentMainCategory);
  const subcategories = currentCategoryData?.subcategories || [];

  // Breadcrumbs logic
  const mainCategoryLabel = currentMainCategory?.split("-").join(" ").toUpperCase() || "COLLECTIONS";
  const subCategoryLabel = subcategories.find(s => s.slug === filters.subcategory)?.name || "";

  return (
    <div 
      className={`w-full bg-white z-40 transition-all duration-500 ease-in-out border-b border-[#f0ede8] ${
        showNav ? "sticky top-[110px] md:top-[140px]" : "sticky top-0"
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-4 md:px-10">
        
        {/* TOP ROW: BREADCRUMBS & READY TO SHIP */}
        <div className="flex items-center justify-between py-3 border-b border-[#f0ede8]">
          <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-[#9c9690]">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <span>|</span>
            <span className={!subCategoryLabel ? "text-black font-medium" : ""}>
              {mainCategoryLabel}
            </span>
            {subCategoryLabel && (
              <>
                <span>|</span>
                <span className="text-black font-medium">{subCategoryLabel}</span>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#6b6560]">Ready To Ship</span>
            <button 
              onClick={() => handleFilterSelect("readyToShip", !filters.readyToShip)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                filters.readyToShip ? "bg-black" : "bg-[#e8e4de]"
              }`}
            >
              <span
                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300 ${
                  filters.readyToShip ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* BOTTOM ROW: FILTERS, GRID TOGGLE, COUNT, SORT */}
        <div className="flex items-center justify-between h-14 md:h-16">
          
          {/* LEFT: DROP DOWN FILTERS */}
          <div className="hidden md:flex items-center gap-10">
            {/* Category Dropdown */}
            <div className="group relative">
              <button className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-black hover:text-[#6b6560] transition-colors font-medium">
                Category <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
              </button>
              <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="bg-white border border-[#e8e4de] p-6 flex flex-col gap-4 shadow-2xl min-w-[220px]">
                  {subcategories.map((sub) => (
                    <button 
                      key={sub._id}
                      onClick={() => handleFilterSelect("subcategory", sub.slug)}
                      className={`text-left text-[11px] tracking-widest uppercase transition-colors ${
                        filters.subcategory === sub.slug ? "text-black font-bold" : "text-[#9c9690] hover:text-black"
                      }`}
                    >
                      {sub.name}
                    </button>
                  ))}
                  {subcategories.length === 0 && <span className="text-[10px] text-[#9c9690] italic">No subcategories</span>}
                </div>
              </div>
            </div>

            {/* Price Dropdown */}
            <div className="group relative">
              <button className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-black hover:text-[#6b6560] transition-colors font-medium">
                Price <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
              </button>
              <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="bg-white border border-[#e8e4de] p-6 flex flex-col gap-4 shadow-2xl min-w-[220px]">
                  {["Under ₹50,000", "₹50,000 - ₹1,00,000", "₹1,00,000 - ₹2,00,000", "Above ₹2,00,000"].map((range) => (
                    <button key={range} className="text-left text-[11px] tracking-widest uppercase text-[#9c9690] hover:text-black transition-colors">
                      {range}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Occasion Dropdown */}
            <div className="group relative">
              <button className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-black hover:text-[#6b6560] transition-colors font-medium">
                Occasion <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
              </button>
              <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="bg-white border border-[#e8e4de] p-6 flex flex-col gap-4 shadow-2xl min-w-[220px]">
                  {occasions.map((occ) => (
                    <button 
                      key={occ._id}
                      onClick={() => handleFilterSelect("occasion", occ.slug)}
                      className={`text-left text-[11px] tracking-widest uppercase transition-colors ${
                        filters.occasion === occ.slug ? "text-black font-bold" : "text-[#9c9690] hover:text-black"
                      }`}
                    >
                      {occ.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Size Dropdown */}
            <div className="group relative">
              <button className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-black hover:text-[#6b6560] transition-colors font-medium">
                Size <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
              </button>
              <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="bg-white border border-[#e8e4de] p-6 grid grid-cols-3 gap-2 shadow-2xl min-w-[180px]">
                  {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                    <button 
                      key={size}
                      onClick={() => handleFilterSelect("size", size)}
                      className={`h-10 border flex items-center justify-center text-[10px] tracking-widest transition-all ${
                        filters.size === size ? "bg-black text-white border-black" : "bg-white text-black border-[#e8e4de] hover:border-black"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* MOBILE TOGGLE */}
          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-black border border-black px-4 py-2"
            >
              <SlidersHorizontal size={12} />
              Refine
            </button>
          </div>

          {/* RIGHT: LAYOUT, COUNT, SORT */}
          <div className="flex items-center gap-8">
            {/* Grid Layout Toggles */}
            <div className="hidden lg:flex items-center gap-4 border-r border-[#f0ede8] pr-8">
              <button 
                onClick={() => onGridLayoutChange?.(2)}
                className={`transition-colors ${currentGridLayout === 2 ? "text-black" : "text-[#9c9690] hover:text-black"}`}
              >
                <Grid2X2 size={20} strokeWidth={1.5} />
              </button>
              <button 
                onClick={() => onGridLayoutChange?.(4)}
                className={`transition-colors ${currentGridLayout === 4 ? "text-black" : "text-[#9c9690] hover:text-black"}`}
              >
                <LayoutGrid size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Result Count */}
            <span className={`${playfair.className} text-[13px] md:text-sm text-[#6b6560] italic hidden md:block`}>
              {totalProducts} Results
            </span>

            {/* Sort Dropdown */}
            <div className="group relative">
              <button className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-black hover:text-[#6b6560] transition-colors font-medium">
                Sort <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
              </button>
              <div className="absolute top-full right-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="bg-white border border-[#e8e4de] p-6 flex flex-col gap-4 shadow-2xl min-w-[200px]">
                  {[
                    { label: "Newest", value: "newest" },
                    { label: "Price: Low to High", value: "price_asc" },
                    { label: "Price: High to Low", value: "price_desc" }
                  ].map((opt) => (
                    <button 
                      key={opt.value}
                      onClick={() => handleFilterSelect("sort", opt.value)}
                      className={`text-left text-[11px] tracking-widest uppercase transition-colors ${
                        filters.sort === opt.value ? "text-black font-bold" : "text-[#9c9690] hover:text-black"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}
      <div 
        className={`fixed inset-0 bg-black/60 z-[100] transition-opacity duration-500 md:hidden ${
          mobileFiltersOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileFiltersOpen(false)}
      >
        <div 
          className={`absolute right-0 top-0 bottom-0 w-[85vw] max-w-[400px] bg-white transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${
            mobileFiltersOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-[#f0ede8]">
            <h2 className="text-xs tracking-[0.3em] uppercase font-semibold">Refine Selection</h2>
            <button onClick={() => setMobileFiltersOpen(false)}>
              <X size={20} className="text-[#9c9690]" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-12">
             {/* Mobile Sort */}
             <div>
               <h3 className="text-[10px] tracking-[0.3em] uppercase text-[#9c9690] mb-6 border-b border-[#f0ede8] pb-3">Sort By</h3>
               <div className="flex flex-col gap-5">
                 {["newest", "price_asc", "price_desc"].map((sortOption) => (
                    <button 
                      key={sortOption}
                      onClick={() => handleFilterSelect("sort", sortOption)}
                      className={`text-left text-[11px] tracking-widest uppercase transition-colors ${
                        filters.sort === sortOption ? "text-black font-bold" : "text-[#6b6560]"
                      }`}
                    >
                      {sortOption === "price_asc" ? "Price: Low to High" : sortOption === "price_desc" ? "Price: High to Low" : "New Arrivals"}
                    </button>
                  ))}
               </div>
             </div>

             {/* Mobile Categories */}
             {subcategories.length > 0 && (
               <div>
                 <h3 className="text-[10px] tracking-[0.3em] uppercase text-[#9c9690] mb-6 border-b border-[#f0ede8] pb-3">Category</h3>
                 <div className="flex flex-col gap-5">
                   {subcategories.map((sub) => (
                      <button 
                        key={sub._id}
                        onClick={() => handleFilterSelect("subcategory", sub.slug)}
                        className={`text-left text-[11px] tracking-widest uppercase transition-colors ${
                          filters.subcategory === sub.slug ? "text-black font-bold" : "text-[#6b6560]"
                        }`}
                      >
                        {sub.name}
                      </button>
                    ))}
                 </div>
               </div>
             )}

             {/* Mobile Occasions */}
             {occasions.length > 0 && (
               <div>
                 <h3 className="text-[10px] tracking-[0.3em] uppercase text-[#9c9690] mb-6 border-b border-[#f0ede8] pb-3">Occasion</h3>
                 <div className="flex flex-col gap-5">
                   {occasions.map((occ) => (
                      <button 
                        key={occ._id}
                        onClick={() => handleFilterSelect("occasion", occ.slug)}
                        className={`text-left text-[11px] tracking-widest uppercase transition-colors ${
                          filters.occasion === occ.slug ? "text-black font-bold" : "text-[#6b6560]"
                        }`}
                      >
                        {occ.name}
                      </button>
                    ))}
                 </div>
               </div>
             )}
          </div>

          <div className="p-8 border-t border-[#f0ede8] bg-[#fdfcfb] flex gap-4">
             <button 
               onClick={clearFilters}
               className="flex-1 py-5 border border-black text-[10px] tracking-[0.3em] uppercase text-black font-medium"
             >
               Clear All
             </button>
             <button 
               onClick={() => setMobileFiltersOpen(false)}
               className="flex-1 py-5 bg-black text-[10px] tracking-[0.3em] uppercase text-white font-medium"
             >
               View Results
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
