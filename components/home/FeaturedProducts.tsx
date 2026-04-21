"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/lib/db/schema";

// Static showcase products for launch (before DB is populated)
const staticProducts = [
  {
    id: "p1",
    name: "Seoul 1988 Serum",
    slug: "seoul-1988-serum",
    description: "Retinal Liposome 2% + Black Ginseng",
    price: null,
    images: ["/brand/IMG_1549.JPG.jpeg"],
    origin: "KR",
    category: "Serum",
  },
  {
    id: "p2",
    name: "Centella Toning Set",
    slug: "centella-toning-set",
    description: "Madagascar Centella Toner + Ampoule",
    price: null,
    images: ["/brand/IMG_4709.JPG.jpeg"],
    origin: "KR",
    category: "Toner",
  },
  {
    id: "p3",
    name: "Dr. Althea Relief Cream",
    slug: "dr-althea-relief-cream",
    description: "345 Relief Cream · Pro Lab",
    price: null,
    images: ["/brand/IMG_9850.JPG.jpeg"],
    origin: "KR",
    category: "Moisturiser",
  },
];

interface FeaturedProductsProps {
  products?: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const { addItem } = useCartStore();
  const displayProducts =
    products && products.length > 0 ? products : staticProducts;

  return (
    <section className="bg-[#3D2E24] py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[#E8A020] text-sm tracking-[0.3em] uppercase mb-2">
              The Edit
            </p>
            <h2
              className="text-5xl text-[#F8F4EE]"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              Featured Products
            </h2>
          </motion.div>
          <Link
            href="/shop"
            className="hidden md:flex items-center gap-2 text-[#8A7D72] hover:text-[#E8A020] transition-colors text-sm"
          >
            View all <ArrowRight size={16} />
          </Link>
        </div>

        {/* Product grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {displayProducts.slice(0, 3).map((product, i) => {
            const image =
              (product.images as string[])?.[0] || null;
            const price =
              typeof product.price === "string" ? product.price : null;
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-[#2A1F18] mb-4">
                  {image && (
                    <Image
                      src={image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  {product.origin && (
                    <span
                      className="absolute top-3 left-3 bg-[#E8A020] text-[#3D2E24] text-[10px] px-2 py-0.5 tracking-widest font-medium"
                      style={{ fontFamily: "var(--font-dm-mono), monospace" }}
                    >
                      {product.origin}
                    </span>
                  )}
                </div>
                {/* Info */}
                <div className="space-y-2">
                  <p className="text-xs text-[#8A7D72] tracking-widest uppercase">
                    {product.category}
                  </p>
                  <h3
                    className="text-xl text-[#F8F4EE]"
                    style={{
                      fontFamily: "var(--font-cormorant), Georgia, serif",
                    }}
                  >
                    {product.name}
                  </h3>
                  <p className="text-sm text-[#8A7D72]">{product.description}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[#E8A020] text-sm">
                      {price
                        ? `₦${parseFloat(price).toLocaleString()}`
                        : "DM for price"}
                    </span>
                    <button
                      onClick={() =>
                        addItem({
                          id: product.id,
                          name: product.name,
                          price,
                          image,
                          slug: product.slug,
                        })
                      }
                      className="text-xs text-[#F8F4EE] border border-[#F8F4EE]/30 px-4 py-1.5 hover:bg-[#E8A020] hover:border-[#E8A020] hover:text-[#3D2E24] transition-all"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 border border-[#E8A020] text-[#E8A020] px-6 py-2.5 text-sm hover:bg-[#E8A020] hover:text-[#3D2E24] transition-colors"
          >
            View all products <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
