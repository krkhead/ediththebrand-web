"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteCouponButton({ id }: { id: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }

    setLoading(true);
    await fetch(`/api/coupons/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className={`p-1.5 transition-colors ${
        confirming ? "text-red-500 hover:text-red-700" : "text-gray-400 hover:text-red-500"
      }`}
      title={confirming ? "Click again to confirm delete" : "Delete coupon"}
    >
      <Trash2 size={16} />
    </button>
  );
}
