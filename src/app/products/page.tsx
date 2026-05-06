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
  const categoryStr = typeof sParams.category === "string" ? sParams.category : "";
  const subcategoryStr = typeof sParams.subcategory === "string" ? sParams.subcategory : "";
  const occasionStr = typeof sParams.occasion === "string" ? sParams.occasion : "";
  const sortStr = typeof sParams.sort === "string" ? sParams.sort : "";
  const availabilityStr = typeof sParams.availability === "string" ? sParams.availability : "";

  // Map category back to our predefined headers for Hero
  // So if they visit /products?category=womenswear, we show the WOMEN banner
  let heroData;
  if (categoryStr === "womenswear") heroData = categories.women;
  else if (categoryStr === "menswear") heroData = categories.men;
  else if (categoryStr === "weddings") heroData = categories.weddings;

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
            category: categoryStr,
            subcategory: subcategoryStr,
            occasion: occasionStr,
            sort: sortStr,
            availability: availabilityStr,
          }}
        />
      </Suspense>
    </div>
  );
}
