import { Suspense } from "react";
import FilteredProductGrid from "@/components/category/FilteredProductGrid";
import CategoryHero from "@/components/category/CategoryHero";
import { categories } from "@/data/categories";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const sParams = await searchParams;

  // Extract filters from URL query parameters
  const mainCategoryStr = typeof sParams.mainCategory === "string" ? sParams.mainCategory : "";
  const categoryStr = typeof sParams.category === "string" ? sParams.category : "";
  const occasionStr = typeof sParams.occasion === "string" ? sParams.occasion : "";
  const subCategoryStr = typeof sParams.subCategory === "string" ? sParams.subCategory : (typeof sParams.subcategory === "string" ? sParams.subcategory : "");
  const sortStr = typeof sParams.sort === "string" ? sParams.sort : "";
  const availabilityStr = typeof sParams.availability === "string" ? sParams.availability : "";

  // Map category back to our predefined headers for Hero
  let heroData;
  if (mainCategoryStr === "womens-wear") heroData = categories.women;
  else if (mainCategoryStr === "mens-wear") heroData = categories.men;
  else if (mainCategoryStr === "weddings") heroData = categories.weddings;

  return (
    <div className="pt-[110px] md:pt-[130px]">
      {/* If a recognized main category is selected, show its Hero Banner */}
      {/* {heroData && (
        <CategoryHero
          title={heroData.title}
          banner={heroData.banner}
          subtitle={heroData.subtitle}
          quote={heroData.quote}
        />
      )} */}

      {/* Dynamic Product Grid with strictly API-based filtering */}
      <Suspense fallback={<div className="min-h-screen bg-[#fcfbf9]" />}>
        <FilteredProductGrid
          initialFilters={{
            mainCategory: mainCategoryStr,
            category: categoryStr,
            subCategory: subCategoryStr,
            occasion: occasionStr,
            sort: sortStr as any,
            availability: availabilityStr,
          }}
        />
      </Suspense>
    </div>
  );
}
