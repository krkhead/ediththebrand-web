"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
  field: "inStock" | "featured";
  value: boolean;
}

export default function ToggleProductButton({ id, field, value }: Props) {
  const router = useRouter();
  const [current, setCurrent] = useState(value);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    const next = !current;
    setCurrent(next);
    await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: next }),
    });
    setLoading(false);
    router.refresh();
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`relative w-10 h-5 rounded-full transition-colors ${
        current ? "bg-[#2C7A2C]" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
          current ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
