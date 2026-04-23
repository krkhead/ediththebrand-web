"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/lib/db/schema";
import { placeholderProducts } from "@/lib/storefront-data";
import { formatNaira, getProductStatusBadges } from "@/lib/shop-utils";

interface FeaturedProductsProps {
  products?: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const { addItem } = useCartStore();
  const displayProducts =
    products && products.length > 0 ? products : placeholderProducts;

  return (
    <section className="bg-[#3D2E24] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex items-end justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-5xl text-[#F8F4EE]"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              Featured Products
            </h2>
          </motion.div>
          <Link
            href="/shop/all-products"
            className="hidden items-center gap-2 text-sm text-[#8A7D72] transition-colors hover:text-[#E8A020] md:flex"
          >
            View all <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {displayProducts.slice(0, 3).map((product, index) => {
            const image = (product.images as string[])?.[0] || null;
            const price = product.price ? String(product.price) : null;
            const badges = getProductStatusBadges(product);
            const detailHref = `/shop/all-products/${product.slug}`;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Link href={detailHref} className="relative mb-4 block aspect-[3/4] overflow-hidden bg-[#2A1F18]">
                  {image && (
                    <Image
                      src={image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}

                  <div className="absolute left-3 top-3 flex gap-2">
                    {product.origin && (
                      <span
                        className="bg-[#E8A020] px-2 py-0.5 text-[10px] font-medium tracking-widest text-[#3D2E24]"
                        style={{ fontFamily: "var(--font-dm-mono), monospace" }}
                      >
                        {product.origin}
                      </span>
                    )}
                  </div>

                  {badges.length > 0 && (
                    <div className="absolute right-3 top-3 flex flex-col items-end gap-2">
                      {badges.map((badge) => (
                        <span
                          key={badge}
                          className="bg-[#F8F4EE]/90 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-[#3D2E24]"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>

                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-widest text-[#8A7D72]">
                    {product.category}
                  </p>
                  <Link
                    href={detailHref}
                    className="block text-xl text-[#F8F4EE] transition-colors hover:text-[#E8A020]"
                    style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                  >
                    {product.name}
                  </Link>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm text-[#E8A020]">
                      {price ? formatNaira(parseFloat(price)) : "DM for price"}
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
                      className="border border-[#F8F4EE]/30 px-4 py-1.5 text-xs text-[#F8F4EE] transition-all hover:border-[#E8A020] hover:bg-[#E8A020] hover:text-[#3D2E24]"
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
            href="/shop/all-products"
            className="inline-flex items-center gap-2 border border-[#E8A020] px-6 py-2.5 text-sm text-[#E8A020] transition-colors hover:bg-[#E8A020] hover:text-[#3D2E24]"
          >
            View all products <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
