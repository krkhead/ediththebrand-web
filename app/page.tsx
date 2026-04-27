import HeroSection from "@/components/home/HeroSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import BrandStatement from "@/components/home/BrandStatement";
import ConsultationCTA from "@/components/home/ConsultationCTA";
import PhotoStrip from "@/components/home/PhotoStrip";
import type { Product } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { placeholderProducts } from "@/lib/storefront-data";
import {
  isStorefrontReadyProduct,
  selectDailyFeaturedProducts,
} from "@/lib/shop-utils";
import {
  isVideoPreviewEnabled,
  videoPreviewProducts,
} from "@/lib/video-preview-data";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ preview?: string }>;
}) {
  const preview = searchParams ? (await searchParams).preview : undefined;
  const useVideoPreview = isVideoPreviewEnabled(preview);

  if (useVideoPreview) {
    return (
      <>
        <HeroSection />
        <FeaturedProducts products={selectDailyFeaturedProducts(videoPreviewProducts)} />
        <BrandStatement />
        <ConsultationCTA />
        <PhotoStrip />
      </>
    );
  }

  let featuredProducts: Product[] = placeholderProducts;
  try {
    const allProducts = await db.select().from(products);
    const storefrontProducts = allProducts.filter(isStorefrontReadyProduct);
    featuredProducts =
      storefrontProducts.length > 0
        ? selectDailyFeaturedProducts(storefrontProducts)
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
