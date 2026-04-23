"use client";

import { useCartStore } from "@/store/cart";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: string | null;
    image: string | null;
    inStock: boolean | null;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCartStore();

  return (
    <button
      disabled={!product.inStock}
      onClick={() =>
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          slug: product.slug,
        })
      }
      className="bg-[#3D2E24] px-6 py-3 text-sm text-white transition-colors hover:bg-[#2A1F18] disabled:cursor-not-allowed disabled:opacity-30"
    >
      Add to Cart
    </button>
  );
}
