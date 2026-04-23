"use client";

import type { Product } from "@/lib/db/schema";
import { formatNaira } from "@/lib/shop-utils";
import { useCartStore } from "@/store/cart";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
  href: string;
  badges?: string[];
  showDescription?: boolean;
}

export default function ProductCard({
  product,
  href,
  badges = [],
  showDescription = false,
}: ProductCardProps) {
  const { addItem } = useCartStore();
  const image = (product.images as string[])?.[0] || null;
  const price = product.price ? String(product.price) : null;

  return (
    <div className="group flex flex-col">
      <Link href={href} className="relative mb-4 block aspect-[3/4] overflow-hidden bg-[#F0EAE0]">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ShoppingBag size={40} className="text-[#8A7D72]" />
          </div>
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
                className="bg-[#F8F4EE]/92 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-[#3D2E24]"
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <span className="border border-[#8A7D72] px-3 py-1 text-xs uppercase tracking-widest text-[#8A7D72]">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      <div className="flex-1 space-y-2">
        {product.category && (
          <p className="text-[10px] uppercase tracking-widest text-[#8A7D72]">
            {product.category}
          </p>
        )}
        <Link
          href={href}
          className="block text-xl leading-tight text-[#3D2E24] transition-colors hover:text-[#A14D2A]"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          {product.name}
        </Link>
        {showDescription && product.description && (
          <p className="text-sm text-[#8A7D72]">{product.description}</p>
        )}
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm font-medium text-[#E8A020]">
            {price ? formatNaira(parseFloat(price)) : "DM for price"}
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
            className="border border-[#3D2E24] px-4 py-1.5 text-xs text-[#3D2E24] transition-all hover:bg-[#3D2E24] hover:text-[#F8F4EE] disabled:cursor-not-allowed disabled:opacity-30"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
