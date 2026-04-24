import HeroSection from "@/components/home/HeroSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import BrandStatement from "@/components/home/BrandStatement";
import ConsultationCTA from "@/components/home/ConsultationCTA";
import PhotoStrip from "@/components/home/PhotoStrip";
import type { Product } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { placeholderProducts } from "@/lib/storefront-data";
import { selectDailyFeaturedProducts } from "@/lib/shop-utils";

export default async function Home() {
  let featuredProducts: Product[] = placeholderProducts;
  try {
    const allProducts = await db.select().from(products);
    featuredProducts =
      allProducts.length > 0
        ? selectDailyFeaturedProducts(allProducts)
        : placeholderProducts;
  } catch {
    featuredProducts = selectDailyFeaturedProducts(placeholderProducts);
  }

  return (
    <>
      <HeroSection />
      <FeaturedProducts products={featuredProducts} />
      <BrandStatement />
      <ConsultationCTA />
      <PhotoStrip />
    </>
  );
}
