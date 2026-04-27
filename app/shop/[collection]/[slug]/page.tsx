import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  categories,
  products,
  reviews,
  type Category,
  type Product,
  type Review,
} from "@/lib/db/schema";
import { placeholderCollections, placeholderProducts } from "@/lib/storefront-data";
import {
  formatNaira,
  getProductImageUrls,
  isAllProductsCollection,
  isStorefrontReadyProduct,
  matchesCollection,
} from "@/lib/shop-utils";
import ReviewForm from "@/components/shop/ReviewForm";
import AddToCartButton from "@/components/shop/AddToCartButton";
import {
  isVideoPreviewEnabled,
  videoPreviewCollections,
  videoPreviewProducts,
  videoPreviewReviews,
} from "@/lib/video-preview-data";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return { title: slug.replace(/-/g, " ") };
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 text-[#E8A020]">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={16}
          fill={index < rating ? "currentColor" : "none"}
          className={index < rating ? "text-[#E8A020]" : "text-[#D4C5B7]"}
        />
      ))}
    </div>
  );
}

export default async function ProductDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ collection: string; slug: string }>;
  searchParams?: Promise<{ preview?: string }>;
}) {
  const { collection, slug } = await params;
  const preview = searchParams ? (await searchParams).preview : undefined;
  const useVideoPreview = isVideoPreviewEnabled(preview);

  let allProducts: Product[] = [];
  let allCollections: Category[] = [];
  let productReviews: Review[] = [];

  if (useVideoPreview) {
    allProducts = videoPreviewProducts;
    allCollections = videoPreviewCollections;
  } else {
    try {
      allProducts = (await db.select().from(products)).filter(
        isStorefrontReadyProduct
      );
      allCollections = await db
        .select()
        .from(categories)
        .orderBy(asc(categories.sortOrder), asc(categories.name));
    } catch {
      allProducts = placeholderProducts;
      allCollections = placeholderCollections;
    }
  }

  const product = allProducts.find((item) => item.slug === slug);
  if (!product) notFound();

  const collectionItem = isAllProductsCollection(collection)
    ? null
    : allCollections.find((item) => item.slug === collection);

  if (!isAllProductsCollection(collection)) {
    if (
      !collectionItem ||
      !matchesCollection(
        product.collectionSlug ?? null,
        product.category ?? null,
        collectionItem
      )
    ) {
      notFound();
    }
  }

  if (useVideoPreview) {
    productReviews = videoPreviewReviews.filter(
      (review) => review.productId === product.id
    );
  } else {
    try {
      productReviews = await db
        .select()
        .from(reviews)
        .where(eq(reviews.productId, product.id))
        .orderBy(desc(reviews.createdAt));
    } catch {
      productReviews = [];
    }
  }

  const image = getProductImageUrls(product)[0] || null;
  const averageRating =
    productReviews.length > 0
      ? productReviews.reduce((sum, review) => sum + review.rating, 0) /
        productReviews.length
      : 0;
  const backHref = `/shop/${collection}${useVideoPreview ? "?preview=video" : ""}`;

  return (
    <div className="mx-auto max-w-7xl px-6 py-36">
      <div className="mb-8">
        <Link href={backHref} className="text-sm text-[#A14D2A] transition-colors hover:text-[#3D2E24]">
          {"<- Back to "}
          {collectionItem?.name ?? "All Products"}
        </Link>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative min-h-[420px] overflow-hidden border border-[#E0D8CE] bg-[#F0EAE0] shadow-sm lg:min-h-[620px]">
          {image ? (
            <>
              <Image
                src={image}
                alt={product.name}
                fill
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="object-cover object-center"
                priority
              />
              {!product.inStock && (
                <div className="absolute inset-0 bg-[#1A1410]/10" />
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-[#8A7D72]">
              No image available
            </div>
          )}
          {!product.inStock && (
            <div className="absolute left-5 top-5 z-10 border border-[#F8F4EE]/80 bg-[#3D2E24]/85 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[#F8F4EE] backdrop-blur-sm">
              Out of Stock
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {product.origin && (
              <span className="bg-[#E8A020] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[#3D2E24]">
                {product.origin}
              </span>
            )}
            {product.category && (
              <span className="border border-[#C9B8A8] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[#8A7D72]">
                {product.category}
              </span>
            )}
          </div>

          <div>
            <h1
              className="text-5xl text-[#3D2E24] md:text-6xl"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              {product.name}
            </h1>
            <div className="mt-4 flex items-center gap-3">
              <p className="text-lg text-[#E8A020]">
                {product.price
                  ? formatNaira(parseFloat(String(product.price)))
                  : "DM for price"}
              </p>
              {productReviews.length > 0 && (
                <div className="flex items-center gap-2">
                  <RatingStars rating={Math.round(averageRating)} />
                  <span className="text-sm text-[#8A7D72]">
                    {averageRating.toFixed(1)} ({productReviews.length} review
                    {productReviews.length === 1 ? "" : "s"})
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="border border-[#E0D8CE] bg-white px-5 py-5 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#8A7D72]">
              Description
            </p>
            <p className="mt-3 text-base leading-8 text-[#6D6055] whitespace-pre-line break-words text-pretty">
              {product.description || "Product details will be added soon."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price ? String(product.price) : null,
                image,
                inStock: product.inStock ?? true,
              }}
            />
            {!product.inStock && (
              <span className="text-sm uppercase tracking-[0.2em] text-[#A14D2A]">
                Currently out of stock
              </span>
            )}
          </div>

          <div className="border-t border-[#E0D8CE] pt-6">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#8A7D72]">
              Collection
            </p>
            <Link
              href={backHref}
              className="mt-2 inline-block text-xl text-[#3D2E24] transition-colors hover:text-[#A14D2A]"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              {collectionItem?.name ?? "All Products"}
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-16 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-[#E0D8CE] pb-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#A14D2A]">
                Ratings & Reviews
              </p>
              <h2
                className="mt-2 text-4xl text-[#3D2E24]"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                What customers are saying
              </h2>
            </div>
          </div>

          {productReviews.length === 0 ? (
            <div className="border border-dashed border-[#E0D8CE] bg-white px-5 py-8 text-sm text-[#8A7D72]">
              No reviews yet. Be the first to leave one.
            </div>
          ) : (
            <div className="space-y-4">
              {productReviews.map((review) => (
                <div
                  key={review.id}
                  className="border border-[#E0D8CE] bg-white p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-[#3D2E24]">
                        {review.customerName}
                      </p>
                      <p className="text-xs text-[#8A7D72]">
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleDateString()
                          : ""}
                      </p>
                    </div>
                    <RatingStars rating={review.rating} />
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-[#6D6055]">
                    {review.review}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <ReviewForm productId={product.id} />
      </div>
    </div>
  );
}
