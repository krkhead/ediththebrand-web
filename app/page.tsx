import HeroSection from "@/components/home/HeroSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import BrandStatement from "@/components/home/BrandStatement";
import ConsultationCTA from "@/components/home/ConsultationCTA";
import PhotoStrip from "@/components/home/PhotoStrip";
import type { Product } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function Home() {
  let featuredProducts: Product[] = [];
  try {
    featuredProducts = await db
      .select()
      .from(products)
      .where(eq(products.featured, true))
      .limit(3);
  } catch {
    // DB not yet connected — use static showcase products
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
