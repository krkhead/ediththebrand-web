"use client";

import AddToCartControls from "@/components/shop/AddToCartControls";

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
  return <AddToCartControls product={product} />;
}
