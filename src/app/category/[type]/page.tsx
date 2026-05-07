import { Suspense } from "react";
import FilteredProductGrid from "@/components/category/FilteredProductGrid";

type Props = {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CategoryPage({ params, searchParams }: Props) {
  const { type } = await params;
  const sParams = await searchParams;

  // Extract filters safely
  const occasionStr = typeof sParams.occasion === "string" ? sParams.occasion : "";
  
  // Robust check for subcategory (handling both camelCase and lowercase from URL)
  const subCategoryStr = typeof sParams.subCategory === "string" 
    ? sParams.subCategory 
    : (typeof sParams.subcategory === "string" ? sParams.subcategory : "");

  // Use the [type] from URL (e.g., /category/womens-wear) as the main category filter
  const mainCategorySlug = type; 

  return (
    <div className="pt-[110px] md:pt-[130px]">
      <Suspense fallback={<div className="min-h-screen bg-[#fcfbf9]" />}>
        <FilteredProductGrid
          initialFilters={{
            mainCategory: mainCategorySlug,
            subCategory: subCategoryStr,
            occasion: occasionStr,
          }}
        />
      </Suspense>
    </div>
  );
}
