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
  category?: string;
  subCategory?: string;
  sort?: "price" | "-price" | "newest";
  color?: string;
  size?: string;
  readyToShip?: boolean;
  minPrice?: number;
  maxPrice?: number;
  mainCategory?: string;
  availability?: string;
}

interface Props {
  onFilterChange: (filters: FilterState) => void;
  totalProducts: number;
  initialFilters?: FilterState;
  currentGridLayout?: 2 | 4;
  onGridLayoutChange?: (layout: 2 | 4) => void;
}

const PRICE_RANGES = [
  { label: "Under ₹50,000", min: 0, max: 50000 },
  { label: "₹50,000 - ₹1,00,000", min: 50000, max: 100000 },
  { label: "₹1,00,000 - ₹2,00,000", min: 100000, max: 200000 },
  { label: "Above ₹2,00,000", min: 200000, max: undefined },
];

export default function ProductFilterBar({ 
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
  
  // Mobile filter drawer state
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const baseFilters = initialFilters || {};
    // Map URL availability param to local readyToShip state
    if (baseFilters.availability === "available") {
      baseFilters.readyToShip = true;
    }
    setFilters(baseFilters);
  }, [initialFilters]);

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
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    setFilters(newFilters);
    onFilterChange(newFilters);
    setActiveDropdown(null);
  };

  const handlePriceSelect = (min?: number, max?: number) => {
    const newFilters = { ...filters };
    if (newFilters.minPrice === min && newFilters.maxPrice === max) {
      delete newFilters.minPrice;
      delete newFilters.maxPrice;
    } else {
      newFilters.minPrice = min;
      newFilters.maxPrice = max;
    }
    setFilters(newFilters);
    onFilterChange(newFilters);
    setActiveDropdown(null);
  };

  const removeFilter = (key: keyof FilterState) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    if (key === "minPrice") delete newFilters.maxPrice;
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({ mainCategory: filters.mainCategory }); // Keep main category
    onFilterChange({ mainCategory: filters.mainCategory });
    setMobileFiltersOpen(false);
  };

  const currentCategoryData = categories.find(c => c.slug === filters.mainCategory);
  const subcategories = currentCategoryData?.subcategories || [];

  const mainCategoryLabel = filters.mainCategory?.split("-").join(" ").toUpperCase() || "COLLECTIONS";
  
  // Active Filter Logic
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.subCategory) count++;
    if (filters.occasion) count++;
    if (filters.size) count++;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) count++;
    if (filters.readyToShip) count++;
    return count;
  };

  const activeCount = getActiveFilterCount();

  return (
    <div 
      className={`w-full bg-white z-40 transition-all duration-500 ease-in-out border-b border-[#f0ede8] ${
        showNav ? "sticky top-[110px] md:top-[130px]" : "sticky top-0"
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-4 md:px-10">
        
        {/* TOP ROW: BREADCRUMBS & READY TO SHIP */}
        <div className="flex items-center justify-between py-3 border-b border-[#f5f2ee]">
          <div className="flex items-center gap-3 text-[9px] tracking-[0.3em] uppercase text-[#9c9690]">
            <Link href="/" className="hover:text-black transition-colors duration-300">Home</Link>
            <span className="opacity-40">/</span>
            <span className="text-black font-semibold">{mainCategoryLabel}</span>
          </div>

          <div className="hidden md:flex items-center gap-4 group cursor-pointer" onClick={() => handleFilterSelect("readyToShip", !filters.readyToShip)}>
            <span className="text-[9px] tracking-[0.3em] uppercase text-[#6b6560] group-hover:text-black transition-colors duration-300">Ready To Ship</span>
            <div 
              className={`relative inline-flex h-4 w-9 items-center rounded-full transition-all duration-500 ${
                filters.readyToShip ? "bg-[#c5a059]" : "bg-[#e8e4de]"
              }`}
            >
              <span
                className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white shadow-md transition-transform duration-500 ${
                  filters.readyToShip ? "translate-x-5.5" : "translate-x-1"
                }`}
              />
            </div>
          </div>
        </div>

        {/* MIDDLE ROW: FILTERS, GRID TOGGLE, COUNT, SORT */}
        <div className="flex items-center justify-between h-14 md:h-16">
          
          {/* LEFT: DROP DOWN FILTERS */}
          <div className="hidden md:flex items-center gap-10">
            {/* Category Dropdown */}
            <div className="relative" onMouseEnter={() => setActiveDropdown("category")} onMouseLeave={() => setActiveDropdown(null)}>
              <button className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-black hover:text-[#c5a059] transition-all duration-300 font-semibold">
                Category <ChevronDown size={12} className={`transition-transform duration-500 opacity-60 ${activeDropdown === "category" ? "rotate-180" : ""}`} />
              </button>
              <div className={`absolute top-full left-0 pt-4 transition-all duration-300 z-50 ${activeDropdown === "category" ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                <div className="bg-white border border-[#e8e4de] p-6 flex flex-col gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.1)] min-w-[240px]">
                  {subcategories.map((sub) => (
                    <button 
                      key={sub._id}
                      onClick={() => handleFilterSelect("category", sub.slug)}
                      className={`text-left text-[11px] tracking-widest uppercase transition-colors py-1 border-b border-transparent hover:border-black/10 ${
                        filters.category === sub.slug ? "text-[#c5a059] font-bold" : "text-[#9c9690] hover:text-black"
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
            <div className="relative" onMouseEnter={() => setActiveDropdown("price")} onMouseLeave={() => setActiveDropdown(null)}>
              <button className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-black hover:text-[#c5a059] transition-all duration-300 font-semibold">
                Price <ChevronDown size={12} className={`transition-transform duration-500 opacity-60 ${activeDropdown === "price" ? "rotate-180" : ""}`} />
              </button>
              <div className={`absolute top-full left-0 pt-4 transition-all duration-300 z-50 ${activeDropdown === "price" ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                <div className="bg-white border border-[#e8e4de] p-6 flex flex-col gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.1)] min-w-[240px]">
                  {PRICE_RANGES.map((range) => (
                    <button 
                      key={range.label}
                      onClick={() => handlePriceSelect(range.min, range.max)}
                      className={`text-left text-[11px] tracking-widest uppercase transition-colors py-1 border-b border-transparent hover:border-black/10 ${
                        filters.minPrice === range.min && filters.maxPrice === range.max ? "text-[#c5a059] font-bold" : "text-[#9c9690] hover:text-black"
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Occasion Dropdown */}
            <div className="relative" onMouseEnter={() => setActiveDropdown("occasion")} onMouseLeave={() => setActiveDropdown(null)}>
              <button className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-black hover:text-[#c5a059] transition-all duration-300 font-semibold">
                Occasion <ChevronDown size={12} className={`transition-transform duration-500 opacity-60 ${activeDropdown === "occasion" ? "rotate-180" : ""}`} />
              </button>
              <div className={`absolute top-full left-0 pt-4 transition-all duration-300 z-50 ${activeDropdown === "occasion" ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                <div className="bg-white border border-[#e8e4de] p-6 flex flex-col gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.1)] min-w-[240px]">
                  {occasions.map((occ) => (
                    <button 
                      key={occ._id}
                      onClick={() => handleFilterSelect("occasion", occ.slug)}
                      className={`text-left text-[11px] tracking-widest uppercase transition-colors py-1 border-b border-transparent hover:border-black/10 ${
                        filters.occasion === occ.slug ? "text-[#c5a059] font-bold" : "text-[#9c9690] hover:text-black"
                      }`}
                    >
                      {occ.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Size Dropdown */}
            <div className="relative" onMouseEnter={() => setActiveDropdown("size")} onMouseLeave={() => setActiveDropdown(null)}>
              <button className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-black hover:text-[#c5a059] transition-all duration-300 font-semibold">
                Size <ChevronDown size={12} className={`transition-transform duration-500 opacity-60 ${activeDropdown === "size" ? "rotate-180" : ""}`} />
              </button>
              <div className={`absolute top-full left-0 pt-4 transition-all duration-300 z-50 ${activeDropdown === "size" ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                <div className="bg-white border border-[#e8e4de] p-6 grid grid-cols-3 gap-2 shadow-[0_20px_50px_rgba(0,0,0,0.1)] min-w-[200px]">
                  {["XS", "S", "M", "L", "XL", "XXL", "3XL"].map((size) => (
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
              className="flex items-center gap-2 text-[9px] tracking-[0.2em] uppercase text-black border border-black/10 bg-black/5 px-5 py-2.5 rounded-full"
            >
              <SlidersHorizontal size={12} />
              Refine {activeCount > 0 && `(${activeCount})`}
            </button>
          </div>

          {/* RIGHT: LAYOUT, COUNT, SORT */}
          <div className="flex items-center gap-6 md:gap-8">
            {/* Grid Layout Toggles */}
            <div className="hidden lg:flex items-center gap-4 border-r border-[#f5f2ee] pr-8">
              <button 
                onClick={() => onGridLayoutChange?.(2)}
                className={`transition-colors ${currentGridLayout === 2 ? "text-black" : "text-[#9c9690] hover:text-black"}`}
              >
                <Grid2X2 size={18} strokeWidth={1.5} />
              </button>
              <button 
                onClick={() => onGridLayoutChange?.(4)}
                className={`transition-colors ${currentGridLayout === 4 ? "text-black" : "text-[#9c9690] hover:text-black"}`}
              >
                <LayoutGrid size={18} strokeWidth={1.5} />
              </button>
            </div>

            {/* Result Count */}
            <span className={`${playfair.className} text-[13px] md:text-sm text-[#9c9690] italic hidden md:block whitespace-nowrap`}>
              {totalProducts} Results
            </span>

            {/* Sort Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-black hover:text-[#c5a059] transition-colors font-semibold">
                Sort <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
              </button>
              <div className="absolute top-full right-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="bg-white border border-[#e8e4de] p-5 flex flex-col gap-3 shadow-[0_20px_50px_rgba(0,0,0,0.1)] min-w-[200px]">
                  {[
                    { label: "Newest", value: "newest" },
                    { label: "Price: Low to High", value: "price" },
                    { label: "Price: High to Low", value: "-price" }
                  ].map((opt) => (
                    <button 
                      key={opt.value}
                      onClick={() => handleFilterSelect("sort", opt.value)}
                      className={`text-left text-[11px] tracking-widest uppercase transition-colors py-1 ${
                        filters.sort === opt.value ? "text-[#c5a059] font-bold" : "text-[#9c9690] hover:text-black"
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

        {/* BOTTOM ROW: ACTIVE FILTERS */}
        {activeCount > 0 && (
          <div className="flex flex-wrap items-center gap-3 pb-4 animate-in fade-in slide-in-from-top-2 duration-500">
            <span className="text-[9px] tracking-[0.2em] uppercase text-[#9c9690] font-medium mr-2">Filtering by:</span>
            
            {filters.category && (
              <button 
                onClick={() => removeFilter("category")}
                className="group flex items-center gap-2 bg-[#f9f8f6] border border-[#f0ede8] px-3 py-1.5 rounded-sm hover:border-black transition-all"
              >
                <span className="text-[9px] tracking-widest uppercase text-black font-semibold">{filters.category.replace(/-/g, " ")}</span>
                <X size={10} className="text-[#9c9690] group-hover:text-black" />
              </button>
            )}

            {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
              <button 
                onClick={() => removeFilter("minPrice")}
                className="group flex items-center gap-2 bg-[#f9f8f6] border border-[#f0ede8] px-3 py-1.5 rounded-sm hover:border-black transition-all"
              >
                <span className="text-[9px] tracking-widest uppercase text-black font-semibold">
                  {PRICE_RANGES.find(r => r.min === filters.minPrice && r.max === filters.maxPrice)?.label || "Price Range"}
                </span>
                <X size={10} className="text-[#9c9690] group-hover:text-black" />
              </button>
            )}

            {filters.occasion && (
              <button 
                onClick={() => removeFilter("occasion")}
                className="group flex items-center gap-2 bg-[#f9f8f6] border border-[#f0ede8] px-3 py-1.5 rounded-sm hover:border-black transition-all"
              >
                <span className="text-[9px] tracking-widest uppercase text-black font-semibold">{filters.occasion.replace(/-/g, " ")}</span>
                <X size={10} className="text-[#9c9690] group-hover:text-black" />
              </button>
            )}

            {filters.size && (
              <button 
                onClick={() => removeFilter("size")}
                className="group flex items-center gap-2 bg-[#f9f8f6] border border-[#f0ede8] px-3 py-1.5 rounded-sm hover:border-black transition-all"
              >
                <span className="text-[9px] tracking-widest uppercase text-black font-semibold">Size: {filters.size}</span>
                <X size={10} className="text-[#9c9690] group-hover:text-black" />
              </button>
            )}

            {filters.readyToShip && (
              <button 
                onClick={() => removeFilter("readyToShip")}
                className="group flex items-center gap-2 bg-[#f9f8f6] border border-[#f0ede8] px-3 py-1.5 rounded-sm hover:border-black transition-all"
              >
                <span className="text-[9px] tracking-widest uppercase text-black font-semibold">Ready to Ship</span>
                <X size={10} className="text-[#9c9690] group-hover:text-black" />
              </button>
            )}

            <button 
              onClick={clearFilters}
              className="text-[9px] tracking-[0.2em] uppercase text-[#c5a059] hover:text-black font-bold ml-2 underline underline-offset-4 decoration-1"
            >
              Clear All
            </button>
          </div>
        )}
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
          <div className="flex items-center justify-between px-6 py-8 border-b border-[#f5f2ee]">
            <div>
              <h2 className={`${playfair.className} text-2xl text-black font-normal`}>Refine</h2>
              <p className="text-[9px] tracking-[0.3em] uppercase text-[#9c9690] mt-1">Select Filters</p>
            </div>
            <button onClick={() => setMobileFiltersOpen(false)} className="p-2 -mr-2">
              <X size={24} strokeWidth={1} className="text-black" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10">
             {/* Mobile Categories */}
             {subcategories.length > 0 && (
               <section>
                 <h3 className="text-[10px] tracking-[0.3em] uppercase text-black font-bold mb-6 flex items-center gap-4">
                   Category <div className="h-[1px] flex-1 bg-[#f5f2ee]" />
                 </h3>
                 <div className="flex flex-wrap gap-3">
                   {subcategories.map((sub) => (
                      <button 
                        key={sub._id}
                        onClick={() => handleFilterSelect("category", sub.slug)}
                        className={`px-4 py-2 text-[10px] tracking-widest uppercase transition-all rounded-sm border ${
                          filters.category === sub.slug ? "bg-black text-white border-black" : "bg-white text-[#6b6560] border-[#f0ede8]"
                        }`}
                      >
                        {sub.name}
                      </button>
                    ))}
                 </div>
               </section>
             )}

             {/* Mobile Price */}
             <section>
               <h3 className="text-[10px] tracking-[0.3em] uppercase text-black font-bold mb-6 flex items-center gap-4">
                 Price <div className="h-[1px] flex-1 bg-[#f5f2ee]" />
               </h3>
               <div className="grid grid-cols-1 gap-3">
                 {PRICE_RANGES.map((range) => (
                    <button 
                      key={range.label}
                      onClick={() => handlePriceSelect(range.min, range.max)}
                      className={`px-4 py-3 text-left text-[10px] tracking-widest uppercase transition-all rounded-sm border ${
                        filters.minPrice === range.min && filters.maxPrice === range.max ? "bg-black text-white border-black" : "bg-white text-[#6b6560] border-[#f0ede8]"
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
               </div>
             </section>

             {/* Mobile Occasion */}
             {occasions.length > 0 && (
               <section>
                 <h3 className="text-[10px] tracking-[0.3em] uppercase text-black font-bold mb-6 flex items-center gap-4">
                   Occasion <div className="h-[1px] flex-1 bg-[#f5f2ee]" />
                 </h3>
                 <div className="flex flex-wrap gap-3">
                   {occasions.map((occ) => (
                      <button 
                        key={occ._id}
                        onClick={() => handleFilterSelect("occasion", occ.slug)}
                        className={`px-4 py-2 text-[10px] tracking-widest uppercase transition-all rounded-sm border ${
                          filters.occasion === occ.slug ? "bg-black text-white border-black" : "bg-white text-[#6b6560] border-[#f0ede8]"
                        }`}
                      >
                        {occ.name}
                      </button>
                    ))}
                 </div>
               </section>
             )}

             {/* Mobile Size */}
             <section>
               <h3 className="text-[10px] tracking-[0.3em] uppercase text-black font-bold mb-6 flex items-center gap-4">
                 Size <div className="h-[1px] flex-1 bg-[#f5f2ee]" />
               </h3>
               <div className="grid grid-cols-4 gap-2">
                 {["XS", "S", "M", "L", "XL", "XXL", "3XL"].map((size) => (
                    <button 
                      key={size}
                      onClick={() => handleFilterSelect("size", size)}
                      className={`h-12 flex items-center justify-center text-[11px] tracking-widest transition-all border ${
                        filters.size === size ? "bg-black text-white border-black" : "bg-white text-[#6b6560] border-[#f0ede8]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
               </div>
             </section>
          </div>

          <div className="px-6 py-8 border-t border-[#f5f2ee] bg-[#fdfcfb] flex gap-4">
             <button 
               onClick={clearFilters}
               className="flex-1 py-4 border border-black text-[10px] tracking-[0.3em] uppercase text-black font-bold"
             >
               Reset
             </button>
             <button 
               onClick={() => setMobileFiltersOpen(false)}
               className="flex-1 py-4 bg-black text-[10px] tracking-[0.3em] uppercase text-white font-bold"
             >
               Apply
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

