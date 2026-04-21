import { db } from "@/lib/db";
import { products, categories, type Product, type Category } from "@/lib/db/schema";
import ProductCard from "@/components/shop/ProductCard";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Authentic skincare from the US, GB, KR, and JP. Serums, toners, moisturisers and more.",
};

// Static placeholder products shown until admin populates DB
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
    createdAt: new Date(),
    updatedAt: new Date(),
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
    createdAt: new Date(),
    updatedAt: new Date(),
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
    createdAt: new Date(),
    updatedAt: new Date(),
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
    createdAt: new Date(),
    updatedAt: new Date(),
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
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  let dbProducts: Product[] = [];
  let dbCategories: Category[] = [];

  try {
    dbProducts = await db.select().from(products);
    dbCategories = await db.select().from(categories);
  } catch {
    // DB not yet configured
  }

  const displayProducts =
    dbProducts.length > 0 ? dbProducts : placeholderProducts;
  const filtered = category
    ? displayProducts.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      )
    : displayProducts;

  const allCategories =
    dbCategories.length > 0
      ? dbCategories.map((c) => c.name)
      : [...new Set(placeholderProducts.map((p) => p.category))];

  return (
    <>
      {/* Hero */}
      <div className="relative bg-[#3D2E24] pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/brand/IMG_3841.JPG.jpeg"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <p className="text-[#E8A020] text-sm tracking-[0.3em] uppercase mb-3">
            Ediththebrand
          </p>
          <h1
            className="text-7xl md:text-9xl text-[#F8F4EE] leading-none"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Shop
          </h1>
          <p className="text-[#8A7D72] mt-4 text-base">
            Authentic skincare from the US, UK, Korea and Japan
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Category filters */}
        <div className="flex gap-2 flex-wrap mb-10">
          <a
            href="/shop"
            className={`text-sm px-5 py-2 border transition-colors ${
              !category
                ? "bg-[#3D2E24] text-[#F8F4EE] border-[#3D2E24]"
                : "border-[#8A7D72] text-[#8A7D72] hover:border-[#3D2E24] hover:text-[#3D2E24]"
            }`}
          >
            All
          </a>
          {allCategories.map((cat) => (
            <a
              key={cat}
              href={`/shop?category=${cat}`}
              className={`text-sm px-5 py-2 border transition-colors ${
                category === cat
                  ? "bg-[#3D2E24] text-[#F8F4EE] border-[#3D2E24]"
                  : "border-[#8A7D72] text-[#8A7D72] hover:border-[#3D2E24] hover:text-[#3D2E24]"
              }`}
            >
              {cat}
            </a>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-[#8A7D72]">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
