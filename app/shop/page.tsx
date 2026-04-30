import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Layers3 } from "lucide-react";
import ShopSearchForm from "@/components/shop/ShopSearchForm";
import { db } from "@/lib/db";
import { categories, type Category } from "@/lib/db/schema";
import {
  ALL_PRODUCTS_COLLECTION_SLUG,
  placeholderCollections,
  placeholderProducts,
} from "@/lib/storefront-data";
import { asc } from "drizzle-orm";
import { getProductImageUrls } from "@/lib/shop-utils";
import {
  isVideoPreviewEnabled,
  videoPreviewCollections,
  videoPreviewProducts,
} from "@/lib/video-preview-data";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Explore Ediththebrand collections and shop authentic skincare by collection.",
};

export const dynamic = "force-dynamic";

export default async function ShopLandingPage({
  searchParams,
}: {
  searchParams?: Promise<{ preview?: string }>;
}) {
  const preview = searchParams ? (await searchParams).preview : undefined;
  const useVideoPreview = isVideoPreviewEnabled(preview);

  if (useVideoPreview) {
    const heroImage =
      videoPreviewCollections.find((collection) => collection.image)?.image ??
      getProductImageUrls(videoPreviewProducts[0])[0] ??
      "/brand/IMG_3841.JPG.jpeg";

    return (
      <>
        <div className="relative overflow-hidden bg-[#3D2E24] px-6 pb-16 pt-36">
          <div className="absolute inset-0 opacity-10">
            <Image src={heroImage} alt="" fill className="object-cover" />
          </div>
          <div className="relative mx-auto max-w-7xl">
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#E8A020]">
              Ediththebrand
            </p>
            <h1
              className="text-7xl leading-none text-[#F8F4EE] md:text-9xl"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              Shop
            </h1>
            <p className="mt-4 max-w-2xl text-base text-[#8A7D72]">
              A curated skincare storefront built for discovery, confidence and
              ease.
            </p>
            <ShopSearchForm className="mt-8 max-w-xl" />
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#A14D2A]">
                Collections First
              </p>
              <h2
                className="mt-2 text-4xl text-[#3D2E24]"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                Browse the store by collection
              </h2>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <Link
              href={`/shop/${ALL_PRODUCTS_COLLECTION_SLUG}?preview=video`}
              className="group overflow-hidden border border-[#E0D8CE] bg-white shadow-sm transition-transform hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] bg-[#3D2E24]">
                <Image
                  src={heroImage}
                  alt="All Products"
                  fill
                  className="object-cover opacity-70 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3D2E24] via-[#3D2E24]/25 to-transparent" />
                <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-[#F8F4EE]/90 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[#3D2E24]">
                  <Layers3 size={14} />
                  All Products
                </div>
              </div>
              <div className="space-y-2 p-5">
                <h3
                  className="text-3xl text-[#3D2E24]"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                >
                  All Products
                </h3>
                <p className="text-sm text-[#8A7D72]">
                  The full collection of demo products with search, sorting and
                  category filtering.
                </p>
              </div>
            </Link>

            {videoPreviewCollections.map((collection) => (
              <Link
                key={collection.id}
                href={`/shop/${collection.slug}?preview=video`}
                className="group overflow-hidden border border-[#E0D8CE] bg-white shadow-sm transition-transform hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] bg-[#F0EAE0]">
                  {collection.image ? (
                    <Image
                      src={collection.image}
                      alt={collection.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-[#8A7D72]">
                      Add an image from admin
                    </div>
                  )}
                </div>
                <div className="space-y-2 p-5">
                  <h3
                    className="text-3xl text-[#3D2E24]"
                    style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                  >
                    {collection.name}
                  </h3>
                  <p className="min-h-[4.5rem] text-sm leading-relaxed text-[#8A7D72] whitespace-normal break-words text-pretty">
                    {collection.description || `Browse the ${collection.name} collection.`}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </>
    );
  }

  let collections: Category[] = [];

  try {
    collections = await db
      .select()
      .from(categories)
      .orderBy(asc(categories.sortOrder), asc(categories.name));
  } catch {
    collections = placeholderCollections;
  }

  const heroImage =
    collections.find((collection) => collection.image)?.image ??
    getProductImageUrls(placeholderProducts[0])[0] ??
    "/brand/IMG_3841.JPG.jpeg";

  return (
    <>
      <div className="relative overflow-hidden bg-[#3D2E24] px-6 pb-16 pt-36">
        <div className="absolute inset-0 opacity-10">
          <Image src={heroImage} alt="" fill className="object-cover" />
        </div>
        <div className="relative mx-auto max-w-7xl">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#E8A020]">
            Ediththebrand
          </p>
          <h1
            className="text-7xl leading-none text-[#F8F4EE] md:text-9xl"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Shop
          </h1>
          <p className="mt-4 max-w-2xl text-base text-[#8A7D72]">
            Start with a collection. Browse by routine need, then dive into the
            products inside each edit.
          </p>
          <ShopSearchForm className="mt-8 max-w-xl" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#A14D2A]">
              Collections First
            </p>
            <h2
              className="mt-2 text-4xl text-[#3D2E24]"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              Browse the store by collection
            </h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <Link
            href={`/shop/${ALL_PRODUCTS_COLLECTION_SLUG}`}
            className="group overflow-hidden border border-[#E0D8CE] bg-white shadow-sm transition-transform hover:-translate-y-1"
          >
            <div className="relative aspect-[4/3] bg-[#3D2E24]">
              <Image
                src={heroImage}
                alt="All Products"
                fill
                className="object-cover opacity-70 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3D2E24] via-[#3D2E24]/25 to-transparent" />
              <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-[#F8F4EE]/90 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[#3D2E24]">
                <Layers3 size={14} />
                All Products
              </div>
            </div>
            <div className="space-y-2 p-5">
              <h3
                className="text-3xl text-[#3D2E24]"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                All Products
              </h3>
              <p className="text-sm text-[#8A7D72]">
                The full store with search, sorting, category filters and pagination.
              </p>
            </div>
          </Link>

          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/shop/${collection.slug}`}
              className="group overflow-hidden border border-[#E0D8CE] bg-white shadow-sm transition-transform hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] bg-[#F0EAE0]">
                {collection.image ? (
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-[#8A7D72]">
                    Add an image from admin
                  </div>
                )}
              </div>
              <div className="space-y-2 p-5">
                <h3
                  className="text-3xl text-[#3D2E24]"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                >
                  {collection.name}
                </h3>
                <p className="min-h-[4.5rem] text-sm leading-relaxed text-[#8A7D72] whitespace-normal break-words text-pretty">
                  {collection.description || `Browse the ${collection.name} collection.`}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
