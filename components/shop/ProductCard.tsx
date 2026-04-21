"use client";

import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/lib/db/schema";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const images = product.images as string[];
  const image = images?.[0] || null;
  const price = product.price ? String(product.price) : null;

  return (
    <div className="group flex flex-col">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F0EAE0] mb-4">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag size={40} className="text-[#8A7D72]" />
          </div>
        )}
        {product.origin && (
          <span
            className="absolute top-3 left-3 bg-[#E8A020] text-[#3D2E24] text-[10px] px-2 py-0.5 tracking-widest font-medium"
            style={{ fontFamily: "var(--font-dm-mono), monospace" }}
          >
            {product.origin}
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-xs text-[#8A7D72] tracking-widest uppercase border border-[#8A7D72] px-3 py-1">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 space-y-1.5">
        {product.category && (
          <p className="text-[10px] text-[#8A7D72] tracking-widest uppercase">
            {product.category}
          </p>
        )}
        <h3
          className="text-xl text-[#3D2E24] leading-tight"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          {product.name}
        </h3>
        {product.description && (
          <p className="text-sm text-[#8A7D72] line-clamp-2">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[#E8A020] text-sm font-medium">
            {price
              ? `₦${parseFloat(price).toLocaleString()}`
              : "DM for price"}
          </span>
          <button
            disabled={!product.inStock}
            onClick={() =>
              addItem({
                id: product.id,
                name: product.name,
                price,
                image,
                slug: product.slug,
              })
            }
            className="text-xs text-[#3D2E24] border border-[#3D2E24] px-4 py-1.5 hover:bg-[#3D2E24] hover:text-[#F8F4EE] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
