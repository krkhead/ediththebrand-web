"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ToggleCouponButton({
  id,
  value,
}: {
  id: string;
  value: boolean;
}) {
  const router = useRouter();
  const [current, setCurrent] = useState(value);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    const next = !current;
    setCurrent(next);
    await fetch(`/api/coupons/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: next }),
    });
    setLoading(false);
    router.refresh();
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`relative h-5 w-10 rounded-full transition-colors ${
        current ? "bg-[#2C7A2C]" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
          current ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
