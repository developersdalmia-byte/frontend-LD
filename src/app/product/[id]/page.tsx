import { notFound } from "next/navigation";
import ProductDetailPage from "@/components/product/ProductDetailPage";
import { getProductById, getProducts } from "@/services/product.service";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;

  try {
    const product = await getProductById(id);
    return {
      title: `${product.name} | Lalit Dalmia`,
      description: product.description,
    };
  } catch {
    return { title: "Product Not Found | Lalit Dalmia" };
  }
}

export async function generateStaticParams() {
  try {
    const { products } = await getProducts({ page: 1, limit: 50 });
    return products.map((p) => ({ id: p.id }));
  } catch {
    return [];
  }
}

export default async function ProductRoutePage({ params }: PageProps) {
  const { id } = await params;

  let product;
  try {
    product = await getProductById(id);
  } catch {
    notFound();
  }

  return (
    <div className="pt-[140px] md:pt-[220px]">
      <ProductDetailPage product={product!} />
    </div>
  );
}