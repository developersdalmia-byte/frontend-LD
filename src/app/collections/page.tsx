import { Suspense } from "react";
import CategoryHero from "@/components/category/CategoryHero";
import FilteredProductGrid from "@/components/category/FilteredProductGrid";
import { categories } from "@/data/categories";

export default function CollectionsPage() {
  // Use a fallback or add 'collections' to categories data
  const categoryData = (categories as any).collections || {
    title: "Our Collections",
    banner: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000",
    subtitle: "Timeless Couture",
    quote: "Discover the complete world of Lalit Dalmia, where every piece is a masterpiece of artisanal heritage.",
  };

  return (
    <main className="pt-[100px]">
      <CategoryHero 
        title={categoryData.title}
        banner={categoryData.banner}
        subtitle={categoryData.subtitle}
        quote={categoryData.quote}
      />
      
      {/* Passing empty string to fetch all products */}
      <Suspense fallback={<div className="min-h-screen bg-[#fcfbf9]" />}>
        <FilteredProductGrid mainCategorySlug="" />
      </Suspense>
    </main>
  );
}
