import { Suspense } from "react";
import Link from "next/link";
import { categories } from "@/data/categories";
import CategoryHero from "@/components/category/CategoryHero";
import FilteredProductGrid from "@/components/category/FilteredProductGrid";

type CategoryType = keyof typeof categories;

type CategoryData = {
  title: string;
  banner: string;
  subtitle?: string;
  quote?: string;
};

type Props = {
  params: Promise<{
    type: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CategoryPage({ params, searchParams }: Props) {
  const { type } = await params;
  const sParams = await searchParams;

  const categoryType = type as CategoryType;
  const data = categories[categoryType] as CategoryData | undefined;

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-[#9c9690] mb-3">404</p>
          <h1 className="font-serif text-3xl text-black mb-4">Category Not Found</h1>
          <Link href="/" className="text-xs tracking-[0.3em] uppercase border-b border-black pb-0.5">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  // Map URL types to backend category slugs
  const slugMap: Record<string, string> = {
    "women": "womens-wear",
    "men": "mens-wear",
    "weddings": "weddings"
  };

  const mainCategorySlug = slugMap[type] || type;

  return (
    <div>
      {/* Premium Hero */}
      <CategoryHero
        title={data.title}
        banner={data.banner}
        subtitle={data.subtitle}
        quote={data.quote}
      />

      {/* Dynamic Product Grid with Top Filter Bar */}
      <Suspense fallback={<div className="min-h-screen bg-[#fcfbf9]" />}>
        <FilteredProductGrid 
          mainCategorySlug={mainCategorySlug} 
          initialFilters={{
            subcategory: sParams.subcategory as string,
            occasion: sParams.occasion as string,
          }}
        />
      </Suspense>
    </div>
  );
}