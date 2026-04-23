import { db } from "@/lib/db";
import { categories, products, type Category, type Product } from "@/lib/db/schema";
import {
  buildShopHref,
  getProductBadges,
  getProductSpotlights,
  matchesProductQuery,
  type ProductSpotlightKey,
} from "@/lib/shop-utils";
import ProductCard from "@/components/shop/ProductCard";
import ShopSearchForm from "@/components/shop/ShopSearchForm";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Authentic skincare from the US, GB, KR, and JP. Serums, toners, moisturisers and more.",
};

const placeholderProducts: Product[] = [
  {
    id: "p1",
    slug: "seoul-1988-serum",
    name: "Seoul 1988 Serum",
    description: "Retinal Liposome 2% + Black Ginseng",
    price: null,
    images: ["/brand/IMG_1549.JPG.jpeg"],
    origin: "KR",
    category: "Serum",
    inStock: true,
    featured: true,
    createdAt: new Date("2026-04-10"),
    updatedAt: new Date("2026-04-10"),
  },
  {
    id: "p2",
    slug: "centella-toning-set",
    name: "Centella Toning Set",
    description: "Madagascar Centella Toner + Ampoule · SKIN1004",
    price: null,
    images: ["/brand/IMG_4709.JPG.jpeg"],
    origin: "KR",
    category: "Toner",
    inStock: true,
    featured: true,
    createdAt: new Date("2026-03-28"),
    updatedAt: new Date("2026-04-18"),
  },
  {
    id: "p3",
    slug: "dr-althea-relief-cream",
    name: "Dr. Althea Relief Cream",
    description: "345 Relief Cream · Pro Lab · All Skin Types",
    price: null,
    images: ["/brand/IMG_9850.JPG.jpeg"],
    origin: "KR",
    category: "Moisturiser",
    inStock: true,
    featured: true,
    createdAt: new Date("2026-04-14"),
    updatedAt: new Date("2026-04-14"),
  },
  {
    id: "p4",
    slug: "eos-body-lotion-set",
    name: "EOS Shea Better Body Lotion",
    description: "24H Moisture · 7 Nourishing Oils + Butters",
    price: null,
    images: ["/brand/IMG_3841.JPG.jpeg"],
    origin: "US",
    category: "Body",
    inStock: true,
    featured: false,
    createdAt: new Date("2026-03-22"),
    updatedAt: new Date("2026-04-17"),
  },
  {
    id: "p5",
    slug: "numbuzin-glow-set",
    name: "Numbuzin 9+ Glow Set",
    description: "High-PDRN Glow Toning Toner + Essence",
    price: null,
    images: ["/brand/IMG_6389.JPG.jpeg"],
    origin: "KR",
    category: "Toner",
    inStock: true,
    featured: false,
    createdAt: new Date("2026-04-16"),
    updatedAt: new Date("2026-04-16"),
  },
];

const spotlightOptions: Array<{
  key: ProductSpotlightKey;
  label: string;
}> = [
  { key: "new-arrivals", label: "New Arrivals" },
  { key: "back-in-stock", label: "Back in Stock" },
];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    q?: string;
    spotlight?: ProductSpotlightKey;
  }>;
}) {
  const { category, q = "", spotlight } = await searchParams;
  let dbProducts: Product[] = [];
  let dbCategories: Category[] = [];

  try {
    dbProducts = await db.select().from(products);
    dbCategories = await db.select().from(categories);
  } catch {
    // DB not yet configured
  }

  const displayProducts = dbProducts.length > 0 ? dbProducts : placeholderProducts;
  const spotlightMap = getProductSpotlights(displayProducts);

  const filteredProducts = displayProducts.filter((product) => {
    const matchesCategory = category
      ? product.category?.toLowerCase() === category.toLowerCase()
      : true;
    const matchesSpotlight = spotlight
      ? spotlightMap[spotlight].some((item) => item.slug === product.slug)
      : true;

    return matchesCategory && matchesSpotlight && matchesProductQuery(product, q);
  });

  const allCategories =
    dbCategories.length > 0
      ? dbCategories.map((item) => item.name)
      : [
          ...new Set(
            placeholderProducts
              .map((product) => product.category)
              .filter((item): item is string => Boolean(item))
          ),
        ];

  const activeFilterCount = [category, spotlight, q.trim()].filter(Boolean).length;

  return (
    <>
      <div className="relative overflow-hidden bg-[#3D2E24] px-6 pb-16 pt-36">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/brand/IMG_3841.JPG.jpeg"
            alt=""
            fill
            className="object-cover"
          />
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
            Browse by category, spotlight what just landed, and search straight to
            what your skin needs.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <ShopSearchForm
            initialQuery={q}
            className="w-full"
            placeholder="Search by product name, category or origin"
          />

          <div className="border border-[#E0D8CE] bg-white px-5 py-4">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#8A7D72]">
              Filter Summary
            </p>
            <div className="mt-2 flex items-end justify-between gap-4">
              <div>
                <p
                  className="text-3xl text-[#3D2E24]"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                >
                  {filteredProducts.length}
                </p>
                <p className="text-sm text-[#8A7D72]">
                  product{filteredProducts.length === 1 ? "" : "s"} showing
                </p>
              </div>
              <p className="text-right text-xs text-[#8A7D72]">
                {activeFilterCount > 0
                  ? `${activeFilterCount} active filter${activeFilterCount === 1 ? "" : "s"}`
                  : "No filters applied"}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <Link
            href={buildShopHref({ query: q || undefined })}
            className={`border px-5 py-2 text-sm transition-colors ${
              !spotlight
                ? "border-[#3D2E24] bg-[#3D2E24] text-[#F8F4EE]"
                : "border-[#8A7D72] text-[#8A7D72] hover:border-[#3D2E24] hover:text-[#3D2E24]"
            }`}
          >
            All Product Stories
          </Link>
          {spotlightOptions.map((option) => (
            <Link
              key={option.key}
              href={buildShopHref({
                query: q || undefined,
                category,
                spotlight: option.key,
              })}
              className={`border px-5 py-2 text-sm transition-colors ${
                spotlight === option.key
                  ? "border-[#E8A020] bg-[#E8A020] text-[#3D2E24]"
                  : "border-[#E8A020]/40 text-[#3D2E24] hover:border-[#E8A020] hover:bg-[#E8A020]/10"
              }`}
            >
              {option.label}
            </Link>
          ))}
        </div>

        <div className="mb-10 flex flex-wrap gap-2">
          <Link
            href={buildShopHref({ query: q || undefined, spotlight })}
            className={`border px-5 py-2 text-sm transition-colors ${
              !category
                ? "border-[#3D2E24] bg-[#3D2E24] text-[#F8F4EE]"
                : "border-[#8A7D72] text-[#8A7D72] hover:border-[#3D2E24] hover:text-[#3D2E24]"
            }`}
          >
            All Categories
          </Link>
          {allCategories.map((item) => (
            <Link
              key={item}
              href={buildShopHref({
                category: item,
                query: q || undefined,
                spotlight,
              })}
              className={`border px-5 py-2 text-sm transition-colors ${
                category === item
                  ? "border-[#3D2E24] bg-[#3D2E24] text-[#F8F4EE]"
                  : "border-[#8A7D72] text-[#8A7D72] hover:border-[#3D2E24] hover:text-[#3D2E24]"
              }`}
            >
              {item}
            </Link>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-[#8A7D72]">
              No products matched this search yet. Try another category or keyword.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 md:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                badges={getProductBadges(product, spotlightMap)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
