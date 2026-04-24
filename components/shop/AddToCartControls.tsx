"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/cart";

interface AddToCartControlsProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: string | null;
    image: string | null;
    inStock: boolean | null;
  };
  compact?: boolean;
  tone?: "light" | "dark";
  buttonClassName?: string;
}

export default function AddToCartControls({
  product,
  compact = false,
  tone = "dark",
  buttonClassName = "",
}: AddToCartControlsProps) {
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);

  const quantityBorder =
    tone === "light" ? "border-[#F8F4EE]/40 text-[#F8F4EE]" : "border-[#8A7D72] text-[#3D2E24]";
  const quantityHover = tone === "light" ? "hover:bg-white/10" : "hover:bg-[#F0EAE0]";

  const updateQuantity = (next: number) => {
    setQuantity(Math.max(1, next));
  };

  return (
    <div className={`flex items-center gap-2 ${compact ? "" : "flex-wrap"}`}>
      <div className={`flex items-center border ${quantityBorder}`}>
        <button
          type="button"
          onClick={() => updateQuantity(quantity - 1)}
          className={`flex h-9 w-9 items-center justify-center transition-colors ${quantityHover}`}
          aria-label="Decrease quantity"
        >
          <Minus size={14} />
        </button>
        <span className="w-10 text-center text-sm">{quantity}</span>
        <button
          type="button"
          onClick={() => updateQuantity(quantity + 1)}
          className={`flex h-9 w-9 items-center justify-center transition-colors ${quantityHover}`}
          aria-label="Increase quantity"
        >
          <Plus size={14} />
        </button>
      </div>

      <button
        disabled={!product.inStock}
        onClick={() =>
          addItem(
            {
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              slug: product.slug,
            },
            quantity
          )
        }
        className={
          buttonClassName ||
          "bg-[#3D2E24] px-6 py-3 text-sm text-white transition-colors hover:bg-[#2A1F18] disabled:cursor-not-allowed disabled:opacity-30"
        }
      >
        Add to Cart
      </button>
    </div>
  );
}
