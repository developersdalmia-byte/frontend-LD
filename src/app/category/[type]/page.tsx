import { Suspense } from "react";
import FilteredProductGrid from "@/components/category/FilteredProductGrid";

type Props = {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

/**
 * CategoryPage - Senior implementation
 * Handles dynamic routing for /category/[type] and maps friendly URLs to API slugs.
 */
export default async function CategoryPage({ params, searchParams }: Props) {
  const { type } = await params;
  const sParams = await searchParams;

  // Senior Fix: Professional Slug Mapping
  // The API expects "womens-wear" but the URL is often just "women" or "lehengas"
  const slugMap: Record<string, { main?: string; cat?: string }> = {
    "women": { main: "womens-wear" },
    "womens-wear": { main: "womens-wear" },
    "men": { main: "mens-wear" },
    "mens-wear": { main: "mens-wear" },
    "weddings": { main: "weddings" },
    "lehengas": { main: "womens-wear", cat: "lehenga" },
    "sarees": { main: "womens-wear", cat: "saree" },
    "indo-western": { main: "womens-wear", cat: "gown" },
  };

  const mapping = slugMap[type.toLowerCase()] || { main: type };

  // Extract filters safely from searchParams
  const occasionStr = typeof sParams.occasion === "string" ? sParams.occasion : "";
  
  // Robust check for subcategory (handling both camelCase and lowercase from URL)
  const subCategoryStr = typeof sParams.subCategory === "string" 
    ? sParams.subCategory 
    : (typeof sParams.subcategory === "string" ? sParams.subcategory : "");

  return (
    <div className="pt-[110px] md:pt-[130px]">
      <Suspense fallback={<div className="min-h-screen bg-[#fcfbf9]" />}>
        <FilteredProductGrid
          initialFilters={{
            mainCategory: mapping.main,
            category: mapping.cat || (typeof sParams.category === "string" ? sParams.category : undefined),
            subCategory: subCategoryStr,
            occasion: occasionStr,
          }}
        />
      </Suspense>
    </div>
  );
}
