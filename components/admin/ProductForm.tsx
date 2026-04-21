"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import type { Product } from "@/lib/db/schema";

interface ProductFormProps {
  product?: Product;
  mode: "new" | "edit";
}

const CATEGORIES = [
  "Serum",
  "Toner",
  "Moisturiser",
  "Cleanser",
  "SPF / Sunscreen",
  "Eye Care",
  "Body",
  "Mask",
  "Oil",
  "Other",
];

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price ?? "");
  const [category, setCategory] = useState(product?.category ?? "");
  const [inStock, setInStock] = useState(product?.inStock ?? true);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [images, setImages] = useState<string[]>(
    ((product?.images as string[]) ?? []).filter(Boolean)
  );

  const uploadToCloudinary = useCallback(async (file: File): Promise<string | null> => {
    const res = await fetch("/api/upload", { method: "POST" });
    const { timestamp, signature, apiKey, cloudName, folder } = await res.json();

    const form = new FormData();
    form.append("file", file);
    form.append("timestamp", String(timestamp));
    form.append("signature", signature);
    form.append("api_key", apiKey);
    form.append("folder", folder);

    const upload = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: form }
    );
    const data = await upload.json();
    return data.secure_url ?? null;
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploadingImages(true);
    setError("");
    try {
      const urls = await Promise.all(files.map(uploadToCloudinary));
      const valid = urls.filter((url): url is string => Boolean(url));
      if (valid.length < files.length) {
        setError("One or more images failed to upload. The rest were saved.");
      }
      setImages((prev) => [...prev, ...valid]);
    } catch (err) {
      setError("Image upload failed. Check your Cloudinary credentials.");
      console.error(err);
    } finally {
      setUploadingImages(false);
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const slug = product?.slug ?? slugify(name);

    const payload = {
      name,
      slug,
      description,
      price: price ? String(price) : null,
      images,
      category,
      inStock,
      featured,
    };

    try {
      const url = mode === "new" ? "/api/products" : `/api/products/${product!.id}`;
      const method = mode === "new" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save product");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-white border border-gray-100 shadow-sm p-6 space-y-5">
        <h2
          className="text-2xl text-[#3D2E24]"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          Product Details
        </h2>

        <div className="space-y-1">
          <label className="text-sm text-gray-600 font-medium">
            Product Name *
          </label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8A020]"
            placeholder="e.g. Numbuzin 9+ Glow Set"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-gray-600 font-medium">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8A020] resize-none"
            placeholder="e.g. High-PDRN Glow Toning Toner + Essence"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm text-gray-600 font-medium">
              Price (₦)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8A020]"
              placeholder="Leave blank → DM for price"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-600 font-medium">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-[#E8A020] bg-white"
            >
              <option value="">Select category...</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Toggles */}
        <div className="flex gap-8 pt-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setInStock(!inStock)}
              className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${
                inStock ? "bg-[#2C7A2C]" : "bg-gray-300"
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white shadow mt-0.5 transition-transform ${
                  inStock ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </div>
            <span className="text-sm text-gray-600">In Stock</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setFeatured(!featured)}
              className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${
                featured ? "bg-[#E8A020]" : "bg-gray-300"
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white shadow mt-0.5 transition-transform ${
                  featured ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </div>
            <span className="text-sm text-gray-600">Featured on Home</span>
          </label>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white border border-gray-100 shadow-sm p-6 space-y-4">
        <h2
          className="text-2xl text-[#3D2E24]"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          Product Images
        </h2>
        <p className="text-xs text-gray-400">
          First image is the main display image. You can add multiple.
        </p>

        {/* Image previews */}
        {images.length > 0 && (
          <div className="flex gap-3 flex-wrap">
            {images.map((url, i) => (
              <div key={`${i}-${url}`} className="relative w-24 h-24 group">
                <Image
                  src={url}
                  alt={`Product image ${i + 1}`}
                  fill
                  className="object-cover"
                />
                {i === 0 && (
                  <span className="absolute bottom-0 left-0 right-0 bg-[#E8A020] text-[#3D2E24] text-[8px] text-center py-0.5 font-bold">
                    MAIN
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload button */}
        <label className={`flex items-center gap-3 border-2 border-dashed p-6 transition-colors ${uploadingImages ? "border-[#E8A020] cursor-wait" : "border-gray-200 cursor-pointer hover:border-[#E8A020]"}`}>
          <Upload size={20} className="text-gray-400 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-600">
              {uploadingImages ? "Uploading, please wait..." : "Click to upload images"}
            </p>
            <p className="text-xs text-gray-400">JPG, PNG, WEBP · Max 10MB each</p>
          </div>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={uploadingImages}
            className="hidden"
          />
          {uploadingImages && (
            <Loader2 size={18} className="ml-auto animate-spin text-[#E8A020]" />
          )}
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving || uploadingImages}
          className="flex items-center gap-2 bg-[#3D2E24] text-white px-8 py-3 text-sm hover:bg-[#2A1F18] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          {mode === "new" ? "Add Product" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
