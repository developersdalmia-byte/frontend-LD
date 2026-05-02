import dynamic from "next/dynamic";
import HeroSlider from "@/components/home/HeroSlider";
import ProductGridSection from "@/components/home/ProductGridSection";
import { Skeleton } from "@/components/shared/Skeleton";
import CategoryCard from "@/components/home/CategoryCard";
import AppointmentHero from "@/components/appointment/AppointmentHero";


const RoyalMenswearSection = dynamic(() => import("@/components/home/RoyalmensWear"), {
  loading: () => <Skeleton className="h-[600px] w-full" />
});
const Menswearproduct = dynamic(() => import("@/components/home/Menswearproduct"), {
  loading: () => <Skeleton className="h-[400px] w-full" />
});

const Sarees = dynamic(() => import("@/components/home/Sarees"), {
  loading: () => <Skeleton className="h-[600px] w-full" />
});
const SareesProductGrid = dynamic(() => import("@/components/home/SareesProductgrid"), {
  loading: () => <Skeleton className="h-[400px] w-full" />
});
const HandloomSarees = dynamic(() => import("@/components/home/HandloomSarees"), {
  loading: () => <Skeleton className="h-[600px] w-full" />
});
const HandloomSareesProductGrid = dynamic(() => import("@/components/home/HandloomSareesProductGrid"), {
  loading: () => <Skeleton className="h-[400px] w-full" />
});
const IndoWesternSection = dynamic(() => import("@/components/home/IndoWesternSection"), {
  loading: () => <Skeleton className="h-[600px] w-full" />
});
const IndoWesternProductGrid = dynamic(() => import("@/components/home/IndoWesternProductGrid"), {
  loading: () => <Skeleton className="h-[400px] w-full" />
});
const WeddingsSection = dynamic(() => import("@/components/home/WeddingsSection"), {
  loading: () => <Skeleton className="h-[500px] w-full" />
});
const WeddingCategoriesGrid = dynamic(() => import("@/components/home/WeddingCategoriesGrid"), {
  loading: () => <Skeleton className="h-[400px] w-full" />
});
const WeddingProductGrid = dynamic(() => import("@/components/home/WeddingProductGrid"), {
  loading: () => <Skeleton className="h-[500px] w-full" />
});
const ArtOfRetailSection = dynamic(() => import("@/components/home/ArtOfRetailSection"), {
  loading: () => <Skeleton className="h-[500px] w-full" />
});

export default function HomePage() {
  return (
    <>
      {/* Hero slider - Immediate */}
      <HeroSlider />
      <ProductGridSection />
      <RoyalMenswearSection />
      <Menswearproduct />
      <Sarees/>
      <SareesProductGrid />
      <IndoWesternSection />
      <IndoWesternProductGrid />
      <HandloomSarees />
      <HandloomSareesProductGrid />
      <WeddingsSection />
      {/* <WeddingCategoriesGrid /> */}
      <WeddingProductGrid />
      <ArtOfRetailSection/>
      <AppointmentHero />
    </>
  );
}
