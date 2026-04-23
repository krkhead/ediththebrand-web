"use client";

import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ReviewForm({ productId }: { productId: string }) {
  const router = useRouter();
  const [customerName, setCustomerName] = useState("");
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName, rating, review }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit review");
      }

      setCustomerName("");
      setRating(5);
      setReview("");
      setMessage("Thank you. Your review has been added.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border border-[#E0D8CE] bg-white p-5">
      <div>
        <p className="text-sm font-medium text-[#3D2E24]">Leave a review</p>
        <p className="text-xs text-[#8A7D72]">
          Share your rating and a short note about how the product worked for you.
        </p>
      </div>

      <div className="space-y-1">
        <label className="text-sm text-[#3D2E24]">Your name</label>
        <input
          required
          value={customerName}
          onChange={(event) => setCustomerName(event.target.value)}
          className="w-full border border-[#E0D8CE] px-4 py-3 text-sm outline-none focus:border-[#E8A020]"
          placeholder="e.g. Ada"
        />
      </div>

      <div className="space-y-1">
        <p className="text-sm text-[#3D2E24]">Rating</p>
        <div className="flex gap-2">
          {Array.from({ length: 5 }, (_, index) => {
            const value = index + 1;
            const active = value <= rating;

            return (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className="text-[#E8A020]"
                aria-label={`Rate ${value} star${value === 1 ? "" : "s"}`}
              >
                <Star
                  size={20}
                  fill={active ? "currentColor" : "none"}
                  className={active ? "text-[#E8A020]" : "text-[#C9B8A8]"}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm text-[#3D2E24]">Review</label>
        <textarea
          required
          value={review}
          onChange={(event) => setReview(event.target.value)}
          rows={4}
          className="w-full resize-none border border-[#E0D8CE] px-4 py-3 text-sm outline-none focus:border-[#E8A020]"
          placeholder="Tell future buyers what you loved, noticed or would recommend."
        />
      </div>

      {message && <p className="text-sm text-[#2C7A2C]">{message}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="bg-[#3D2E24] px-5 py-3 text-sm text-white transition-colors hover:bg-[#2A1F18] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? "Submitting..." : "Submit review"}
      </button>
    </form>
  );
}
