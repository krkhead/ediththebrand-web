import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { categories, products, type Category, type Product } from "@/lib/db/schema";
import ProductCard from "@/components/shop/ProductCard";
import CollectionControls from "@/components/shop/CollectionControls";
import {
  buildCollectionHref,
  getAllCategoriesForFilter,
  isAllProductsCollection,
  isStorefrontReadyProduct,
  matchesProductQuery,
  matchesCollection,
  paginateItems,
  sortProducts,
  type ProductSort,
} from "@/lib/shop-utils";
import {
  ALL_PRODUCTS_COLLECTION_SLUG,
  placeholderCollections,
  placeholderProducts,
  PRODUCTS_PER_PAGE,
} from "@/lib/storefront-data";
import {
  isVideoPreviewEnabled,
  videoPreviewCollections,
  videoPreviewProducts,
} from "@/lib/video-preview-data";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const { collection } = await params;
  return {
    title:
      collection === ALL_PRODUCTS_COLLECTION_SLUG
        ? "All Products"
        : collection.replace(/-/g, " "),
  };
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ collection: string }>;
  searchParams: Promise<{
    q?: string;
    sort?: ProductSort;
    page?: string;
    category?: string;
    preview?: string;
  }>;
}) {
  const { collection } = await params;
  const { q = "", sort = "newest", page = "1", category, preview } =
    await searchParams;
  const useVideoPreview = isVideoPreviewEnabled(preview);

  let collections: Category[] = [];
  let allProducts: Product[] = [];

  if (useVideoPreview) {
    collections = videoPreviewCollections;
    allProducts = videoPreviewProducts;
  } else {
    try {
      collections = await db
        .select()
        .from(categories)
        .orderBy(asc(categories.sortOrder), asc(categories.name));
      allProducts = (await db.select().from(products)).filter(
        isStorefrontReadyProduct
      );
    } catch {
      collections = placeholderCollections;
      allProducts = placeholderProducts;
    }
  }

  const collectionItem = isAllProductsCollection(collection)
    ? null
    : collections.find((item) => item.slug === collection);

  if (!isAllProductsCollection(collection) && !collectionItem) {
    notFound();
  }

  const collectionProducts = isAllProductsCollection(collection)
    ? allProducts
    : allProducts.filter((product) =>
        collectionItem
          ? matchesCollection(product.collectionSlug ?? null, product.category ?? null, collectionItem)
          : false
      );

  const filteredProducts = collectionProducts.filter((product) => {
    const matchesCategory = isAllProductsCollection(collection)
      ? !category || product.category === category
      : true;

    return matchesCategory && matchesProductQuery(product, q);
  });

  const sortedProducts = sortProducts(filteredProducts, sort);
  const { currentPage, totalPages, items } = paginateItems(
    sortedProducts,
    Number(page) || 1,
    PRODUCTS_PER_PAGE
  );
  const availableCategories = isAllProductsCollection(collection)
    ? getAllCategoriesForFilter(allProducts)
    : [];

  const title = collectionItem?.name ?? "All Products";
  const description =
    collectionItem?.description ??
    "Browse the complete Ediththebrand store with filters, sorting and search.";
  const firstProductImage = (() => {
    const images = collectionProducts[0]?.images as string[] | undefined;
    return images?.[0] ?? null;
  })();
  const heroImage =
    collectionItem?.image ?? firstProductImage ?? "/brand/IMG_3841.JPG.jpeg";

  const basePath = `/shop/${collection}`;

  return (
    <>
      <div className="relative overflow-hidden bg-[#3D2E24] px-6 pb-14 pt-36">
        <div className="absolute inset-0 opacity-15">
          <Image src={heroImage} alt="" fill className="object-cover" />
        </div>
        <div className="relative mx-auto max-w-7xl">
          <Link href="/shop" className="text-sm text-[#E8A020] transition-colors hover:text-[#F8F4EE]">
            {"<- Back to collections"}
          </Link>
          <p className="mt-6 text-sm uppercase tracking-[0.3em] text-[#E8A020]">
            {isAllProductsCollection(collection) ? "Storefront" : "Collection"}
          </p>
          <h1
            className="mt-3 text-6xl leading-none text-[#F8F4EE] md:text-8xl"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-[#8A7D72]">{description}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-8 px-6 py-12">
        <CollectionControls
          basePath={basePath}
          initialQuery={q}
          initialSort={sort}
          initialCategory={category}
          categories={availableCategories}
        />

        {isAllProductsCollection(collection) && availableCategories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Link
              href={buildCollectionHref(collection, {
                q: q || undefined,
                sort: sort !== "newest" ? sort : undefined,
              })}
              className={`border px-4 py-2 text-sm transition-colors ${
                !category
                  ? "border-[#3D2E24] bg-[#3D2E24] text-[#F8F4EE]"
                  : "border-[#8A7D72] text-[#8A7D72] hover:border-[#3D2E24] hover:text-[#3D2E24]"
              }`}
            >
              All categories
            </Link>
            {availableCategories.map((item) => (
              <Link
                key={item}
                href={buildCollectionHref(collection, {
                  q: q || undefined,
                  sort: sort !== "newest" ? sort : undefined,
                  category: item,
                })}
                className={`border px-4 py-2 text-sm transition-colors ${
                  category === item
                    ? "border-[#3D2E24] bg-[#3D2E24] text-[#F8F4EE]"
                    : "border-[#8A7D72] text-[#8A7D72] hover:border-[#3D2E24] hover:text-[#3D2E24]"
                }`}
              >
                {item}
              </Link>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between gap-4 border-b border-[#E0D8CE] pb-4 text-sm text-[#8A7D72]">
          <p>
            Showing {items.length} of {filteredProducts.length} products
          </p>
          <p>
            Page {currentPage} of {totalPages}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="py-24 text-center text-[#8A7D72]">
            No products matched this search yet. Try a different keyword or reset your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 md:grid-cols-3">
            {items.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                href={`/shop/${collection}/${product.slug}${useVideoPreview ? "?preview=video" : ""}`}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            {currentPage > 1 && (
              <Link
                href={buildCollectionHref(collection, {
                  q: q || undefined,
                  sort: sort !== "newest" ? sort : undefined,
                  category,
                  page: String(currentPage - 1),
                })}
                className="border border-[#3D2E24] px-4 py-2 text-sm text-[#3D2E24] transition-colors hover:bg-[#3D2E24] hover:text-white"
              >
                Previous
              </Link>
            )}
            {currentPage < totalPages && (
              <Link
                href={buildCollectionHref(collection, {
                  q: q || undefined,
                  sort: sort !== "newest" ? sort : undefined,
                  category,
                  page: String(currentPage + 1),
                })}
                className="border border-[#3D2E24] px-4 py-2 text-sm text-[#3D2E24] transition-colors hover:bg-[#3D2E24] hover:text-white"
              >
                Next
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  );
}
