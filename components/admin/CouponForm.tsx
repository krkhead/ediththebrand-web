"use client";

import type { Coupon } from "@/lib/db/schema";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface CouponFormProps {
  coupon?: Coupon;
  mode: "new" | "edit";
}

export default function CouponForm({ coupon, mode }: CouponFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [code, setCode] = useState(coupon?.code ?? "");
  const [label, setLabel] = useState(coupon?.label ?? "");
  const [type, setType] = useState<"percent" | "fixed">(coupon?.type ?? "percent");
  const [value, setValue] = useState(String(coupon?.value ?? ""));
  const [active, setActive] = useState(coupon?.active ?? true);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = mode === "new" ? "/api/coupons" : `/api/coupons/${coupon!.id}`;
      const method = mode === "new" ? "POST" : "PATCH";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          label: label.trim(),
          type,
          value: Number(value),
          active,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save coupon");
      }

      router.push("/admin/coupons");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      {error && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-5 border border-gray-100 bg-white p-6 shadow-sm">
        <h2
          className="text-2xl text-[#3D2E24]"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          Coupon Details
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Code *</label>
            <input
              required
              value={code}
              onChange={(event) => setCode(event.target.value.toUpperCase())}
              className="w-full border border-gray-200 px-4 py-2.5 text-sm focus:border-[#E8A020] focus:outline-none"
              placeholder="e.g. ETB10"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Label *</label>
            <input
              required
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              className="w-full border border-gray-200 px-4 py-2.5 text-sm focus:border-[#E8A020] focus:outline-none"
              placeholder="e.g. 10% off your order"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Type</label>
            <select
              value={type}
              onChange={(event) => setType(event.target.value as "percent" | "fixed")}
              className="w-full border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-[#E8A020] focus:outline-none"
            >
              <option value="percent">Percent discount</option>
              <option value="fixed">Fixed amount discount</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">
              {type === "percent" ? "Discount Percentage" : "Discount Value (₦)"}
            </label>
            <input
              required
              min={1}
              max={type === "percent" ? 100 : undefined}
              type="number"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              className="w-full border border-gray-200 px-4 py-2.5 text-sm focus:border-[#E8A020] focus:outline-none"
              placeholder={type === "percent" ? "10" : "1500"}
            />
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-3 pt-2">
          <div
            onClick={() => setActive(!active)}
            className={`h-5 w-10 rounded-full transition-colors ${
              active ? "bg-[#2C7A2C]" : "bg-gray-300"
            }`}
          >
            <span
              className={`mt-0.5 block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                active ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </div>
          <span className="text-sm text-gray-600">Coupon is active</span>
        </label>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-[#3D2E24] px-8 py-3 text-sm text-white transition-colors hover:bg-[#2A1F18] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          {mode === "new" ? "Add Coupon" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/coupons")}
          className="text-sm text-gray-500 transition-colors hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
